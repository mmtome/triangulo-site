import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Cog,
  BarChart3,
  Boxes,
  Network,
  Workflow,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { FAQ, faqJsonLd } from "@/components/triangulo/FAQ";
import { SERVICES, SITE_URL } from "@/lib/services";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const ICONS: Record<string, typeof Layers> = {
  "sistemas-personalizados-uberaba": Layers,
  "automacao-de-processos-uberaba": Cog,
  "dashboards-indicadores-uberaba": BarChart3,
  "software-gestao-uberaba": Workflow,
  "microsaas-sob-medida": Boxes,
  "consultoria-processos-tecnologia": Network,
};

const TITLE = "Soluções Digitais para Empresas em Uberaba/MG";
const DESC =
  "Conheça soluções digitais para automatizar processos, organizar operações e melhorar a gestão da sua empresa em Uberaba/MG.";
const URL = `${SITE_URL}/solucoes`;

const FAQ_ITEMS = [
  {
    q: "Quais soluções a Triângulo Solucions oferece?",
    a: "Desenvolvemos sistemas personalizados, automações de processos, dashboards de gestão, software de gestão sob medida, MicroSaaS e consultoria em processos e tecnologia para empresas em Uberaba/MG e região.",
  },
  {
    q: "Vocês atendem empresas fora de Uberaba?",
    a: "Sim. Somos baseados em Uberaba/MG, atendemos todo o Triângulo Mineiro e prestamos serviços de forma remota para empresas de outras regiões do país.",
  },
  {
    q: "Como escolher a solução certa para a minha empresa?",
    a: "Recomendamos começar com um diagnóstico. Em muitos casos, antes de desenvolver, é preciso entender se o problema é de processo, de ferramenta ou de gestão. A consultoria define o caminho mais adequado.",
  },
  {
    q: "Posso contratar mais de uma solução?",
    a: "Sim, as soluções são complementares. É comum começar com consultoria, evoluir para automações pontuais e, em seguida, desenvolver sistema ou dashboards conforme o crescimento.",
  },
];

export const Route = createFileRoute("/solucoes")({
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
          "@type": "CollectionPage",
          name: "Soluções da Triângulo Solucions",
          description: DESC,
          url: URL,
        }),
      },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQ_ITEMS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd(
            [
              { label: "Início", href: "/" },
              { label: "Soluções", href: "/solucoes" },
            ],
            SITE_URL,
          ),
        ),
      },
    ],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const reduce = useReducedMotion();
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
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
              <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Soluções" }]} />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Catálogo de soluções
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground max-w-3xl leading-[1.1]"
            >
              Soluções digitais para gestão de negócios em Uberaba/MG
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Sistemas, automações, dashboards e consultoria para empresas que querem organizar
              operações, reduzir retrabalho e tomar decisões melhores com dados.
            </motion.p>
            <motion.div variants={item} className="mt-7 flex flex-col sm:flex-row gap-3">
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_solutions_cta", { location: "hero" });
                  trackEvent("whatsapp_conversion", { location: "solutions_hero" });
                }}
                whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand"
              >
                <MessageCircle className="h-4 w-4" />
                Falar com a Triângulo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.a>
              <Link
                to="/diagnostico"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2 hover:border-primary/40 transition-colors"
              >
                Fazer diagnóstico gratuito
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((s, i) => {
                const Icon = ICONS[s.slug] ?? Layers;
                const dark = i % 2 === 1;
                return (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduce ? undefined : { y: -6 }}
                  >
                    <Link
                      to="/$serviceSlug"
                      params={{ serviceSlug: s.slug }}
                      className={`group relative block h-full rounded-2xl border overflow-hidden transition-all duration-300 ${
                        dark
                          ? "bg-graphite text-graphite-foreground border-white/10 hover:border-primary/60"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      } hover:shadow-brand`}
                    >
                      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 group-hover:bg-primary/30 blur-2xl transition-colors duration-500" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative p-6">
                        <div
                          className={`h-11 w-11 rounded-xl grid place-items-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                            dark
                              ? "bg-white/10 text-white group-hover:bg-primary"
                              : "bg-graphite text-graphite-foreground group-hover:bg-primary"
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                        <h2
                          className={`mt-5 text-lg font-bold ${
                            dark ? "text-white" : "text-foreground"
                          }`}
                        >
                          {s.shortName}
                        </h2>
                        <p
                          className={`mt-2 text-sm leading-relaxed ${
                            dark ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {s.subtitle}
                        </p>
                        <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary opacity-90 group-hover:gap-2.5 transition-all">
                          Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-14 relative overflow-hidden rounded-3xl bg-graphite p-8 sm:p-12 text-graphite-foreground"
            >
              <div className="absolute inset-0 bg-grid-dark opacity-60" />
              <motion.div
                aria-hidden
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/40 blur-3xl"
                animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Próximo passo
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Não sabe por onde começar?
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Em uma conversa rápida indicamos o caminho mais adequado para o cenário atual
                    da sua empresa — sem compromisso.
                  </p>
                </div>
                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_solutions_cta", { location: "hub_final" });
                    trackEvent("whatsapp_conversion", { location: "solutions_hub_final" });
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

        <FAQ items={FAQ_ITEMS} />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
