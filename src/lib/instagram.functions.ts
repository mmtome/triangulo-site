import { createServerFn } from "@tanstack/react-start";

export type InstagramPost = {
  id: string;
  caption: string | null;
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

/* Cache no servidor. Sem ele, cada visitante novo dispara uma chamada à
   Graph API — o limite é de 200 por hora por usuário, e um dia movimentado
   estoura. Erro fica cacheado por pouco tempo, só para não martelar a API
   quando o token vence. */
const TTL_OK = 15 * 60 * 1000;
const TTL_ERRO = 60 * 1000;
let cache: { em: number; ttl: number; dados: InstagramFeedResult } | null = null;

export const getInstagramFeed = createServerFn({ method: "GET" }).handler(
  async (): Promise<InstagramFeedResult> => {
    if (cache && Date.now() - cache.em < cache.ttl) return cache.dados;

    const guardar = (dados: InstagramFeedResult) => {
      cache = { em: Date.now(), ttl: dados.error ? TTL_ERRO : TTL_OK, dados };
      return dados;
    };

    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) return { configured: false, posts: [] };

    const fields =
      "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=15&access_token=${encodeURIComponent(token)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text();
        return guardar({
          configured: true,
          posts: [],
          error: `Instagram API [${res.status}]: ${body.slice(0, 300)}`,
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
