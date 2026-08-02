/* ============================================================================
   Feed do Instagram, via feed JSON público do Behold.

   Sem `createServerFn` de propósito. Toda server function do projeto passa
   pelo middleware global `attachSupabaseAuth` (src/start.ts), que instancia o
   Supabase — e isso derrubava o SSR da home com 500 e, no cliente, fazia a
   chamada falhar antes de sair do navegador. Um fetch simples não tem nada
   disso, roda igual no servidor e no cliente, e é o próprio uso que o Behold
   recomenda para os feeds JSON.
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

/* A URL do feed é pública por definição — é ela que os widgets do Behold usam
   direto no navegador. Fica aqui para o loader funcionar também na navegação
   pelo cliente, onde process.env não existe. */
const FEED_PADRAO = "https://feeds.behold.so/t7bLXFC6T39IGQzjvJ3o";

const LIMITE = 15;

/* Cache. No servidor evita bater no Behold a cada visita: o plano grátis dá
   1.200 requisições por mês. Três horas é folgado para uma pauta que publica
   dia sim, dia não. Erro fica pouco tempo, para se recuperar rápido. */
const TTL_OK = 3 * 60 * 60 * 1000;
const TTL_ERRO = 60 * 1000;
let cache: { em: number; ttl: number; dados: InstagramFeedResult } | null = null;

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

function normalizar(p: PostBehold): InstagramPost {
  // Em vídeo o mediaUrl é o arquivo de vídeo e não serve de miniatura.
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

function endereco(): string {
  const doAmbiente =
    typeof process !== "undefined" ? process.env?.BEHOLD_FEED : undefined;
  const valor = (doAmbiente || FEED_PADRAO).trim();
  return valor.startsWith("http") ? valor : `https://feeds.behold.so/${valor}`;
}

export async function buscarFeedInstagram(): Promise<InstagramFeedResult> {
  if (cache && Date.now() - cache.em < cache.ttl) return cache.dados;

  const guardar = (dados: InstagramFeedResult) => {
    cache = { em: Date.now(), ttl: dados.error ? TTL_ERRO : TTL_OK, dados };
    return dados;
  };

  try {
    const res = await fetch(endereco());
    if (!res.ok) {
      return guardar({
        configured: true,
        posts: [],
        error: `Behold [${res.status}]`,
      });
    }
    const json = (await res.json()) as { posts?: PostBehold[] };
    const posts = (json.posts ?? [])
      .map(normalizar)
      .filter((p) => p.id && p.mediaUrl && p.permalink)
      .slice(0, LIMITE);
    return guardar({ configured: true, posts });
  } catch (e) {
    return guardar({
      configured: true,
      posts: [],
      error: e instanceof Error ? e.message : "Falha ao consultar o feed",
    });
  }
}
