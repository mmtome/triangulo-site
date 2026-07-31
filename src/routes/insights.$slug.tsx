import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { getWhatsAppUrlWithMessage, SITE } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { ARTICLES, getArticle, type Article, type ArticleBlock, type RelatedLink } from "@/lib/insights";
import { SITE_URL } from "@/lib/services";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }): { article: Article } => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Artigo não encontrado" }] };
    const url = `${SITE_URL}/insights/${params.slug}`;
    const title = a.seoTitle ?? a.title;
    const description = a.seoDescription ?? a.description;
    return {
      meta: [
        { title: `${title} | Insights Triângulo Solucions` },
        { name: "description", content: description },
        { name: "keywords", content: a.keywords.join(", ") },
        { name: "author", content: a.author },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: a.publishedAt },
        ...(a.updatedAt
          ? [{ property: "article:modified_time", content: a.updatedAt }]
          : []),
        { property: "article:section", content: a.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: a.title,
            description: a.description,
            url,
            datePublished: a.publishedAt,
            dateModified: a.updatedAt ?? a.publishedAt,
            author: { "@type": "Organization", name: a.author },
            publisher: {
              "@type": "Organization",
              name: SITE.name,
              url: SITE_URL,
            },
            articleSection: a.category,
            keywords: a.keywords.join(", "),
            inLanguage: "pt-BR",
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd(
              [
                { label: "Início", href: "/" },
                { label: "Insights", href: "/insights" },
                { label: a.title },
              ],
              SITE_URL,
            ),
          ),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
        <Link to="/insights" className="mt-4 inline-block text-primary font-semibold">
          Ver todos os insights →
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Algo deu errado ao abrir o artigo</h1>
        <button onClick={reset} className="mt-4 text-primary font-semibold">
          Tentar novamente
        </button>
      </div>
    </div>
  ),
  component: ArticlePage,
});

function renderBlock(b: ArticleBlock, i: number) {
  if (b.type === "h2") {
    return (
      <h2
        key={i}
        className="mt-10 text-xl sm:text-2xl font-bold text-foreground scroll-mt-24"
      >
        {b.text}
      </h2>
    );
  }
  if (b.type === "h3") {
    return (
      <h3
        key={i}
        className="mt-6 text-lg sm:text-xl font-semibold text-foreground scroll-mt-24"
      >
        {b.text}
      </h3>
    );
  }
  if (b.type === "ul") {
    return (
      <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground">
        {b.items.map((it, j) => (
          <li key={j}>{it}</li>
        ))}
      </ul>
    );
  }
  if (b.type === "checklist") {
    return (
      <div
        key={i}
        className="not-prose my-4 rounded-2xl border border-border bg-surface/60 p-5 sm:p-6"
      >
        {b.title && (
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {b.title}
          </div>
        )}
        <ul className="space-y-2.5">
          {b.items.map((it, j) => (
            <li key={j} className="flex items-start gap-2.5 text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (b.type === "callout") {
    return (
      <aside
        key={i}
        className="not-prose my-5 rounded-2xl border-l-4 border-primary bg-primary/5 p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <div className="text-sm font-semibold text-foreground">{b.title}</div>
            <p className="mt-1 text-muted-foreground leading-relaxed">{b.text}</p>
          </div>
        </div>
      </aside>
    );
  }
  return (
    <p key={i} className="text-muted-foreground leading-relaxed">
      {b.text}
    </p>
  );
}

function ArticlePage() {
  const reduce = useReducedMotion();
  const { article } = Route.useLoaderData();
  const related = article.related.map(getArticle).filter(Boolean) as Article[];

  const dateFmt = new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const whatsappMessage =
    article.whatsappMessage ??
    `Olá, vim pelo site da Triângulo Solucions e li o artigo "${article.title}". Gostaria de entender como esse tema se aplica à minha empresa.`;


  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <article>
          <section className="relative pt-28 sm:pt-32 pb-10 overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
            <motion.div
              aria-hidden
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
              animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative mx-auto max-w-3xl px-5 sm:px-8"
            >
              <motion.div variants={item}>
                <Breadcrumbs
                  items={[
                    { label: "Início", href: "/" },
                    { label: "Insights", href: "/insights" },
                    { label: article.category },
                  ]}
                />
              </motion.div>
              <motion.div
                variants={item}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {article.category}
              </motion.div>
              <motion.h1
                variants={item}
                className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-foreground"
              >
                {article.h1}
              </motion.h1>
              <motion.p
                variants={item}
                className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                {article.description}
              </motion.p>
              <motion.div
                variants={item}
                className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
              >
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> {dateFmt}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {article.readMinutes} min de leitura
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {article.author}
                </span>
              </motion.div>
              <motion.a
                variants={item}
                href={getWhatsAppUrlWithMessage(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_article_cta", { slug: article.slug, location: "hero" });
                  trackEvent("whatsapp_conversion", {
                    location: `article_hero_${article.slug}`,
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Conversar sobre este tema pelo WhatsApp
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </motion.div>
          </section>

          <section className="pb-12">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mx-auto max-w-3xl px-5 sm:px-8"
            >
              <div className="space-y-5 text-base sm:text-lg text-foreground/90 leading-relaxed">
                {article.blocks.map(renderBlock)}
              </div>
            </motion.div>
          </section>

          {(article.relatedServices?.length || article.relatedUseCases?.length) && (
            <section className="pb-12">
              <div className="mx-auto max-w-3xl px-5 sm:px-8">
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Onde isso se conecta
                  </div>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    {article.relatedServices && article.relatedServices.length > 0 && (
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          Soluções relacionadas
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {article.relatedServices.map((s: RelatedLink) => (
                            <li key={s.slug}>
                              <Link
                                to="/$serviceSlug"
                                params={{ serviceSlug: s.slug }}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors story-link"
                              >
                                {s.label} →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {article.relatedUseCases && article.relatedUseCases.length > 0 && (
                      <div>
                        <div className="text-sm font-bold text-foreground">
                          Cenários parecidos
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {article.relatedUseCases.map((u: RelatedLink) => (
                            <li key={u.slug}>
                              <Link
                                to="/casos-de-uso/$slug"
                                params={{ slug: u.slug }}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors story-link"
                              >
                                {u.label} →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 border-t border-border pt-4">
                    <Link
                      to="/diagnostico"
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors story-link"
                    >
                      Fazer um diagnóstico da sua empresa →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CTA final */}
          <section className="pb-16">
            <div className="mx-auto max-w-3xl px-5 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative overflow-hidden rounded-3xl bg-graphite p-7 sm:p-10 text-graphite-foreground"
              >
                <div className="absolute inset-0 bg-grid-dark opacity-60" />
                <motion.div
                  aria-hidden
                  className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-primary/40 blur-3xl"
                  animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Próximo passo
                  </div>
                  <h3 className="mt-3 text-xl sm:text-2xl font-bold text-white max-w-xl leading-tight">
                    Quer entender como isso se aplica à sua empresa?
                  </h3>
                  <p className="mt-3 text-white/70 max-w-2xl leading-relaxed">
                    A Triângulo Solucions une Engenharia de Produção e desenvolvimento
                    de software para estruturar soluções coerentes com a operação de
                    cada negócio.
                  </p>
                  <motion.a
                    href={getWhatsAppUrlWithMessage(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent("click_article_cta", {
                        slug: article.slug,
                        location: "footer",
                      });
                      trackEvent("whatsapp_conversion", {
                        location: `article_${article.slug}`,
                      });
                    }}
                    whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Conversar pelo WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </section>

          {related.length > 0 && (
            <section className="pb-20">
              <div className="mx-auto max-w-3xl px-5 sm:px-8">
                <h2 className="text-xl font-bold text-foreground">Continue lendo</h2>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-5 grid sm:grid-cols-2 gap-4"
                >
                  {related.map((r) => (
                    <motion.div key={r.slug} variants={item} whileHover={reduce ? undefined : { y: -4 }}>
                      <Link
                        to="/insights/$slug"
                        params={{ slug: r.slug }}
                        className="group block h-full rounded-2xl border border-border bg-card p-5 hover:border-primary/60 hover:shadow-elegant transition-all duration-300"
                      >
                        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                          {r.category}
                        </div>
                        <div className="mt-2 text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {r.title}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {r.excerpt}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                          Ler <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-6">
                  <Link
                    to="/insights"
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors story-link"
                  >
                    Ver todos os insights →
                  </Link>
                </div>
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

// Keep ARTICLES referenced for tree-shaking awareness
void ARTICLES;
