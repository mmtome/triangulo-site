import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Layers,
  Target,
  MapPin,
  MessageCircle,
  Sparkles,
  Building2,
  Cpu,
} from "lucide-react";
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { SITE } from "@/lib/site";
import { SITE_URL } from "@/lib/services";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const TITLE = `Sobre a Triângulo Solutions | Tecnologia em Uberaba/MG`;
const DESC =
  "Conheça a Triângulo Solutions, empresa de tecnologia em Uberaba/MG que une software, processos e gestão.";
const URL = `${SITE_URL}/sobre`;
const EASE = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/sobre")({
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
          "@type": "AboutPage",
          name: TITLE,
          description: DESC,
          url: URL,
          mainEntity: {
            "@type": "Organization",
            name: SITE.name,
            description: SITE.description,
            areaServed: [SITE.city, SITE.area, "Minas Gerais"],
            address: {
              "@type": "PostalAddress",
              addressLocality: SITE.city,
              addressRegion: SITE.region,
              addressCountry: "BR",
            },
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd(
            [
              { label: "Início", href: "/" },
              { label: "Sobre", href: "/sobre" },
            ],
            SITE_URL,
          ),
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const reduce = useReducedMotion();
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
            className="relative mx-auto max-w-3xl px-5 sm:px-8"
          >
            <motion.div variants={item}>
              <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Sobre" }]} />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Sobre a Triângulo
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]"
            >
              Tecnologia, processos e gestão para o Triângulo Mineiro
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              A Triângulo Solutions foi criada por estudantes de Engenharia de Produção em
              Uberaba/MG, unindo visão de processos, tecnologia e gestão para desenvolver soluções
              digitais aplicadas à realidade das empresas.
            </motion.p>
            <motion.div variants={item} className="mt-7 flex flex-col sm:flex-row gap-3">
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_about_cta", { location: "hero" });
                  trackEvent("whatsapp_conversion", { location: "about_hero" });
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
                to="/solucoes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2 hover:border-primary/40 transition-colors"
              >
                Ver soluções
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 space-y-14">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Building2 className="h-3.5 w-3.5" /> Onde nascemos
              </motion.div>
              <motion.h2 variants={item} className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                Da Engenharia de Produção para o software aplicado
              </motion.h2>
              <div className="mt-5 space-y-4 text-base text-muted-foreground leading-relaxed">
                <motion.p variants={item}>
                  A Triângulo Solutions nasceu em Uberaba/MG, no coração do Triângulo Mineiro, a
                  partir da percepção de que muitas empresas da região cresciam mais rápido do que
                  seus processos conseguiam acompanhar. Planilhas se multiplicavam, sistemas
                  prontos não cabiam na operação real e decisões importantes acabavam sendo
                  tomadas no improviso.
                </motion.p>
                <motion.p variants={item}>
                  Com formação em Engenharia de Produção, nossos fundadores entendem que
                  tecnologia, sozinha, não resolve. É preciso primeiro enxergar o processo:
                  onde está o gargalo, onde está o desperdício e o que de fato muda quando um
                  software entra em campo.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Cpu className="h-3.5 w-3.5" /> Como pensamos tecnologia
              </motion.div>
              <motion.h2 variants={item} className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
                Software que cabe na operação e evolui com o negócio
              </motion.h2>
              <div className="mt-5 space-y-4 text-base text-muted-foreground leading-relaxed">
                <motion.p variants={item}>
                  Acreditamos que software bom é aquele que cabe na operação, evolui com o negócio
                  e libera o tempo da equipe para o que realmente importa. Não construímos
                  sistemas para impressionar — construímos para resolver.
                </motion.p>
                <motion.p variants={item}>
                  Cada projeto começa por entender a empresa: o modelo de negócio, as pessoas que
                  vão usar a ferramenta, o tamanho do problema e o resultado esperado. Só depois
                  desenhamos a solução, em ciclos curtos, com o cliente acompanhando de perto.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid sm:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: Compass,
                  title: "Visão de processos",
                  desc: "Engenharia de Produção aplicada ao software desde o primeiro dia.",
                },
                {
                  icon: Layers,
                  title: "Sob medida",
                  desc: "Sistemas modelados pela operação real, não por templates genéricos.",
                },
                {
                  icon: Target,
                  title: "Foco em resultado",
                  desc: "Indicadores claros para enxergar o ganho de cada entrega.",
                },
              ].map((d) => (
                <motion.div
                  key={d.title}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-elegant transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3">
                    <d.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative overflow-hidden rounded-3xl bg-graphite p-8 sm:p-12 text-graphite-foreground"
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
                    <MapPin className="h-3.5 w-3.5" /> Uberaba/MG — Triângulo Mineiro
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Vamos conversar sobre o próximo passo da sua operação?
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Atendemos empresas em todo o Triângulo Mineiro e prestamos atendimento remoto
                    para outras regiões.
                  </p>
                </div>
                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_about_cta", { location: "final" });
                    trackEvent("whatsapp_conversion", { location: "about_final" });
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

            <div className="text-sm text-muted-foreground text-center">
              Conheça também as{" "}
              <Link to="/solucoes" className="text-primary font-semibold hover:underline">
                soluções da Triângulo
              </Link>{" "}
              ou fale com a gente pela{" "}
              <Link to="/contato" className="text-primary font-semibold hover:underline">
                página de contato
              </Link>
              .
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
