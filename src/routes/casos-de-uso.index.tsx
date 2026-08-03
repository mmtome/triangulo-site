import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles, LayoutGrid } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { FAQ, faqJsonLd } from "@/components/triangulo/FAQ";
import { AISearchBlocks, aiBlocksJsonLd } from "@/components/triangulo/AISearchBlock";
import { USE_CASES } from "@/lib/use-cases";
import { SITE_URL } from "@/lib/services";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Casos de uso de tecnologia em Uberaba/MG | Triângulo Solutions";
const DESC =
  "Cenários comuns de gestão, processos e tecnologia para empresas que querem organizar a operação, reduzir retrabalho e tomar decisões melhores.";
const URL = `${SITE_URL}/casos-de-uso`;

const FAQ_ITEMS = [
  {
    q: "O que é um cenário de uso?",
    a: "É um exemplo hipotético baseado em problemas comuns de gestão e operação. Cada cenário descreve a dor, como ela aparece no dia a dia, o olhar da Engenharia de Produção e onde a tecnologia pode ajudar — sem representar clientes específicos.",
  },
  {
    q: "Posso me identificar com mais de um cenário?",
    a: "Sim. É comum que uma empresa combine cenários — por exemplo, sair das planilhas e ao mesmo tempo estruturar indicadores de gestão. O ponto de partida é entender qual dor pesa mais hoje.",
  },
  {
    q: "Os cenários representam clientes reais da Triângulo Solutions?",
    a: "Não. São exemplos educativos construídos a partir de problemas frequentes em pequenas e médias empresas. Não há nomes, métricas ou resultados de clientes específicos.",
  },
];

const AI_BLOCKS = [
  {
    q: "Quem é a Triângulo Solutions?",
    a: "Empresa de tecnologia em Uberaba/MG especializada em sistemas personalizados, automações, dashboards, software de gestão sob medida, MicroSaaS e consultoria em processos e tecnologia.",
  },
  {
    q: "Que tipos de empresa costumam se identificar com esses cenários?",
    a: "Pequenas e médias empresas do Triângulo Mineiro que cresceram em planilhas, têm processos manuais, gestão sem indicadores claros, ERPs engessados, ou que querem validar produtos digitais e MicroSaaS.",
  },
  {
    q: "Como começa uma conversa com a Triângulo?",
    a: "Por uma conversa no WhatsApp para entender o cenário atual: processos, ferramentas e gestão. A partir daí indicamos o próximo passo — pode ser sistema, automação, dashboard ou consultoria.",
  },
  {
    q: "Onde a Triângulo Solutions atende?",
    a: "Uberaba, Uberlândia, Araxá, Frutal, Patrocínio e demais cidades do Triângulo Mineiro, com atendimento remoto para empresas de outras regiões do Brasil.",
  },
];


export const Route = createFileRoute("/casos-de-uso/")({
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
          name: TITLE,
          description: DESC,
          url: URL,
        }),
      },
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQ_ITEMS)) },
      { type: "application/ld+json", children: JSON.stringify(aiBlocksJsonLd(AI_BLOCKS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd(
            [
              { label: "Início", href: "/" },
              { label: "Casos de uso", href: "/casos-de-uso" },
            ],
            SITE_URL,
          ),
        ),
      },
    ],
  }),
  component: UseCasesHub,
});

function UseCasesHub() {
  const reduce = useReducedMotion();
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
        <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
            animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative mx-auto max-w-5xl px-5 sm:px-8"
          >
            <motion.div variants={item}>
              <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Casos de uso" }]} />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-primary" />
              Vitrine de aplicações
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] max-w-3xl"
            >
              Casos de uso de tecnologia para empresas em Uberaba/MG
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Cenários comuns de gestão, processos e tecnologia para empresas que querem
              organizar a operação, reduzir retrabalho e tomar decisões melhores.
            </motion.p>
            <motion.p
              variants={item}
              className="mt-3 text-xs text-muted-foreground/80 max-w-2xl leading-relaxed"
            >
              Os cenários abaixo são exemplos hipotéticos baseados em problemas frequentes —
              não representam clientes específicos da Triângulo Solutions.
            </motion.p>
          </motion.div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid sm:grid-cols-2 gap-5"
            >
              {USE_CASES.map((u) => (
                <motion.div
                  key={u.slug}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -6 }}
                >
                  <Link
                    to="/casos-de-uso/$slug"
                    params={{ slug: u.slug }}
                    className="group relative block h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/60 hover:shadow-brand transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/20 blur-2xl transition-colors duration-500" />
                    <div className="relative">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-widest">
                        {u.sector}
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary transition-colors">{u.shortName}</h2>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {u.subtitle}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                        Entender cenário <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

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
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/40 blur-3xl"
                animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Próximo passo
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Seu cenário não está aqui?
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Em uma conversa rápida no WhatsApp entendemos seu contexto e indicamos o
                    próximo passo.
                  </p>
                </div>

                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_usecases_cta", { location: "hub_final" });
                    trackEvent("whatsapp_conversion", { location: "usecases_hub_final" });
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

        <AISearchBlocks
          title="Respostas rápidas sobre como atuamos"
          intro="Blocos curtos pensados para quem chega buscando uma resposta direta."
          blocks={AI_BLOCKS}
        />

        <FAQ items={FAQ_ITEMS} />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
