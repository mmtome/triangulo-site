import { createServerFn } from "@tanstack/react-start";

/* ============================================================================
   Feed do Instagram.

   Duas fontes possíveis, nesta ordem:

   1. BEHOLD_FEED  — id ou URL de um feed JSON do Behold (feeds.behold.so/ID).
      O Behold é dono do app na Meta, então a conta é autorizada só com o
      login do Instagram, sem Facebook e sem token para renovar.
   2. INSTAGRAM_ACCESS_TOKEN — a Graph API oficial, para quando houver um app
      próprio na Meta. O token vale 60 dias e precisa ser renovado.

   Sem nenhuma das duas, `configured: false` e a seção mostra o cartão de
   fallback em vez da grade.
   ========================================================================== */

export type InstagramPost = {
  id: string;
  caption: string | null;
  altText?: string | null;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string | null;
};

export type InstagramFeedResult = {
  configured: boolean;
  posts: InstagramPost[];
  error?: string;
};

/* Cache no servidor. Sem ele cada visitante novo dispara uma chamada à API.
   Três horas não é exagero: o plano grátis do Behold dá 1.200 requisições por
   mês, e a 15 minutos daria ~2.900 — estouraria e o feed sumiria no fim do
   mês. A 3h são ~240 por instância, com folga de sobra. A pauta publica dia
   sim, dia não, então o atraso máximo é irrelevante.
   Erro fica cacheado por pouco tempo, só para não martelar a origem quando a
   credencial vence. */
const TTL_OK = 3 * 60 * 60 * 1000;
const TTL_ERRO = 60 * 1000;
let cache: { em: number; ttl: number; dados: InstagramFeedResult } | null = null;

const LIMITE = 15;

type PostBehold = {
  id?: string;
  permalink?: string;
  caption?: string;
  prunedCaption?: string;
  altText?: string;
  timestamp?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: Record<string, { mediaUrl?: string } | undefined>;
};

function urlDoBehold(valor: string): string {
  const v = valor.trim();
  return v.startsWith("http") ? v : `https://feeds.behold.so/${v}`;
}

function doBehold(p: PostBehold): InstagramPost {
  // Em vídeo o mediaUrl é o arquivo de vídeo, não serve de miniatura.
  const capa =
    p.mediaType === "VIDEO"
      ? (p.thumbnailUrl ?? p.sizes?.medium?.mediaUrl ?? p.mediaUrl ?? "")
      : (p.sizes?.medium?.mediaUrl ?? p.mediaUrl ?? "");

  return {
    id: String(p.id ?? ""),
    caption: p.prunedCaption ?? p.caption ?? null,
    altText: p.altText ?? null,
    mediaType: p.mediaType ?? "IMAGE",
    mediaUrl: capa,
    permalink: p.permalink ?? "",
    timestamp: p.timestamp ?? null,
  };
}

export const getInstagramFeed = createServerFn({ method: "GET" }).handler(
  async (): Promise<InstagramFeedResult> => {
    if (cache && Date.now() - cache.em < cache.ttl) return cache.dados;

    const guardar = (dados: InstagramFeedResult) => {
      cache = { em: Date.now(), ttl: dados.error ? TTL_ERRO : TTL_OK, dados };
      return dados;
    };

    const behold = process.env.BEHOLD_FEED;
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!behold && !token) return { configured: false, posts: [] };

    try {
      if (behold) {
        const res = await fetch(urlDoBehold(behold));
        if (!res.ok) {
          return guardar({
            configured: true,
            posts: [],
            error: `Behold [${res.status}]: ${(await res.text()).slice(0, 300)}`,
          });
        }
        const json = (await res.json()) as { posts?: PostBehold[] };
        const posts = (json.posts ?? [])
          .map(doBehold)
          .filter((p) => p.id && p.mediaUrl && p.permalink)
          .slice(0, LIMITE);
        return guardar({ configured: true, posts });
      }

      const fields =
        "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
      const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${LIMITE}&access_token=${encodeURIComponent(token!)}`;

      const res = await fetch(url);
      if (!res.ok) {
        return guardar({
          configured: true,
          posts: [],
          error: `Instagram API [${res.status}]: ${(await res.text()).slice(0, 300)}`,
        });
      }
      const json = (await res.json()) as {
        data?: Array<Record<string, string | undefined>>;
      };
      const posts: InstagramPost[] = (json.data ?? [])
        .map((item) => ({
          id: String(item.id ?? ""),
          caption: item.caption ?? null,
          mediaType: item.media_type ?? "IMAGE",
          mediaUrl:
            item.media_type === "VIDEO"
              ? (item.thumbnail_url ?? item.media_url ?? "")
              : (item.media_url ?? ""),
          permalink: item.permalink ?? "",
          timestamp: item.timestamp ?? null,
        }))
        .filter((p) => p.id && p.mediaUrl && p.permalink);

      return guardar({ configured: true, posts });
    } catch (e) {
      return guardar({
        configured: true,
        posts: [],
        error: e instanceof Error ? e.message : "Falha ao consultar o Instagram",
      });
    }
  },
);
