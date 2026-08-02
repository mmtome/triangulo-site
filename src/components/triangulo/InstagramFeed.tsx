import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Instagram, ArrowUpRight, Play, Copy } from "lucide-react";
import { getInstagramFeed } from "@/lib/instagram.functions";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function InstagramFeed() {
  const fetchFeed = useServerFn(getInstagramFeed);
  const { data } = useQuery({
    queryKey: ["instagram-feed"],
    queryFn: () => fetchFeed(),
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const posts = data?.posts ?? [];

  return (
    <section className="bg-[#0b0b0d]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Acompanhe
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold">
            Siga a Triângulo Solucions no Instagram
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("click_instagram", { location: "feed_header" })}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Instagram className="h-4 w-4" />
            {INSTAGRAM_HANDLE}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </motion.div>

        {posts.length > 0 ? (
          /* Até 5 colunas, como na referência, mas a largura é limitada pela
             quantidade de posts: com o perfil recém-criado, uma grade fixa de
             5 colunas deixaria um quadradinho perdido no canto. O auto-fit
             cuida do responsivo sem media query. */
          <div
            className="mx-auto mt-10 grid w-full gap-2 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] sm:gap-3"
            style={{ maxWidth: `${Math.min(posts.length, 5) * 236}px` }}
          >
            {posts.slice(0, 15).map((post, i) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click_instagram", { location: "feed_post" })}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.4) }}
                whileHover={{ y: -4 }}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted shadow-elegant"
              >
                <img
                  src={post.mediaUrl}
                  alt={
                    post.altText ||
                    post.caption?.slice(0, 110) ||
                    `Publicação de ${INSTAGRAM_HANDLE} no Instagram`
                  }
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-graphite/0 transition-colors duration-300 group-hover:bg-graphite/45" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram className="h-6 w-6 text-graphite-foreground" />
                </span>
                {post.mediaType === "VIDEO" && (
                  <span className="absolute right-2 top-2 rounded-full bg-graphite/70 p-1">
                    <Play className="h-3 w-3 text-graphite-foreground" />
                  </span>
                )}
                {post.mediaType === "CAROUSEL_ALBUM" && (
                  <span className="absolute right-2 top-2 rounded-full bg-graphite/70 p-1">
                    <Copy className="h-3 w-3 text-graphite-foreground" />
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border bg-background p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Conteúdos sobre tecnologia, processos e gestão publicados no nosso perfil.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("click_instagram", { location: "feed_fallback" })}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand"
            >
              <Instagram className="h-4 w-4" />
              Ver no Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
