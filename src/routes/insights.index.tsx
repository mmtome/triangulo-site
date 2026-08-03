import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, MessageCircle, Sparkles } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const EASE = [0.22, 1, 0.36, 1] as const;
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { ARTICLES, INSIGHT_CATEGORIES, getArticlesByCategory } from "@/lib/insights";
import { SITE_URL } from "@/lib/services";

const TITLE = "Insights | Tecnologia, Processos e Gestão no Triângulo Mineiro";
const DESC =
  "Conteúdos práticos sobre tecnologia, processos, gestão, automação e produtividade para empresas de Uberaba/MG e do Triângulo Mineiro.";
const URL = `${SITE_URL}/insights`;

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Insights Triângulo Solutions",
          description: DESC,
          url: URL,
          blogPost: ARTICLES.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            description: a.description,
            url: `${SITE_URL}/insights/${a.slug}`,
            datePublished: a.publishedAt,
            dateModified: a.updatedAt ?? a.publishedAt,
            author: { "@type": "Organization", name: a.author },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd(
            [
              { label: "Início", href: "/" },
              { label: "Insights", href: "/insights" },
            ],
            SITE_URL,
          ),
        ),
      },
    ],
  }),
  component: InsightsHubPage,
});

function InsightsHubPage() {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState<string>("Todos");
  const articles = getArticlesByCategory(category);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <motion.div
            aria-hidden
            className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
            animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative mx-auto max-w-5xl px-5 sm:px-8"
          >
            <motion.div variants={item}>
              <Breadcrumbs
                items={[
                  { label: "Início", href: "/" },
                  { label: "Insights" },
                ]}
              />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Insights
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-foreground max-w-3xl"
            >
              Conteúdos sobre tecnologia, processos e gestão no Triângulo Mineiro
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Materiais práticos para empresas de Uberaba/MG e região que querem usar
              tecnologia para organizar processos, melhorar a gestão e crescer com mais
              clareza.
            </motion.p>
            <motion.p
              variants={item}
              className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed"
            >
              Cada texto une o olhar da Engenharia de Produção ao desenvolvimento de
              software — para quem precisa decidir com base em realidade operacional,
              não em promessas de fornecedor.
            </motion.p>
          </motion.div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            {/* Filtros de categoria */}
            <div
              role="tablist"
              aria-label="Categorias de insights"
              className="mb-8 flex flex-wrap gap-2"
            >
              {INSIGHT_CATEGORIES.map((cat) => {
                const active = cat === category;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setCategory(cat);
                      trackEvent("insights_filter", { category: cat });
                    }}
                    className={
                      "rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
                      (active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground")
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <motion.div
              key={category}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 gap-5"
            >
              {articles.map((a) => (
                <motion.div
                  key={a.slug}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -6 }}
                >
                  <Link
                    to="/insights/$slug"
                    params={{ slug: a.slug }}
                    onClick={() =>
                      trackEvent("insights_card_click", { slug: a.slug })
                    }
                    className="group relative block h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/60 hover:shadow-brand transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/20 blur-2xl transition-colors duration-500 pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1">
                          {a.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" /> {a.readMinutes} min
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {a.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {a.excerpt}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                        Ler artigo <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {articles.length === 0 && (
              <p className="mt-10 text-center text-muted-foreground">
                Nenhum artigo nesta categoria ainda.
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-14 relative overflow-hidden rounded-3xl bg-graphite p-8 sm:p-12 text-graphite-foreground"
            >
              <div className="absolute inset-0 bg-grid-dark opacity-60" />
              <motion.div
                aria-hidden
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/40 blur-3xl"
                animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Próximo passo
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Quer aplicar algum desses conceitos na sua empresa?
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Converse com a Triângulo Solutions e entenda qual próximo passo
                    faz sentido para seus processos, dados e tecnologia.
                  </p>
                </div>
                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_insights_cta", { location: "hub_final" });
                    trackEvent("whatsapp_conversion", { location: "insights_hub_final" });
                  }}
                  whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className="group shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-brand"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar com a Triângulo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
