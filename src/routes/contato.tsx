import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Clock,
  Sparkles,
  Building2,
  Phone,
} from "lucide-react";
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { FAQ, faqJsonLd } from "@/components/triangulo/FAQ";
import { SITE, getWhatsAppUrl, WHATSAPP_NUMBER } from "@/lib/site";
import { SITE_URL } from "@/lib/services";
import { trackEvent } from "@/lib/analytics";

const TITLE = `Contato | Triângulo Solucions em Uberaba/MG`;
const DESC =
  "Fale com a Triângulo Solucions pelo WhatsApp. Empresa de tecnologia em Uberaba/MG com atendimento sob agendamento para todo o Triângulo Mineiro.";
const URL = `${SITE_URL}/contato`;
const EASE = [0.22, 1, 0.36, 1] as const;

const FAQ_ITEMS = [
  {
    q: "Qual o canal de atendimento mais rápido?",
    a: "O WhatsApp é o canal mais rápido. Converse diretamente com a Triângulo para entender seu cenário e indicar o melhor próximo passo.",
  },
  {
    q: "Vocês atendem apenas Uberaba?",
    a: "Somos baseados em Uberaba/MG, atendemos todo o Triângulo Mineiro presencialmente e fazemos atendimento remoto para empresas de outras regiões.",
  },
  {
    q: "Qual o horário de atendimento?",
    a: "Atendimento sob agendamento. Combinamos o melhor horário para a conversa diretamente pelo WhatsApp.",
  },
  {
    q: "A primeira conversa tem custo?",
    a: "Não. O primeiro contato é uma conversa gratuita para entender o cenário da sua empresa e indicar o melhor próximo passo.",
  },
];

export const Route = createFileRoute("/contato")({
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
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: TITLE,
          url: URL,
          mainEntity: {
            "@type": "ProfessionalService",
            name: SITE.name,
            description: SITE.description,
            telephone: `+${WHATSAPP_NUMBER}`,
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
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQ_ITEMS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd(
            [
              { label: "Início", href: "/" },
              { label: "Contato", href: "/contato" },
            ],
            SITE_URL,
          ),
        ),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const reduce = useReducedMotion();
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  const infoCards = [
    {
      icon: MessageCircle,
      title: "Atendimento",
      desc: "WhatsApp como canal principal. Conversa direta, sem fricção.",
    },
    {
      icon: Clock,
      title: "Conversa direta",
      desc: "Fale com a Triângulo pelo WhatsApp e avance no seu cenário sem fricção.",
    },
    {
      icon: MapPin,
      title: "Onde estamos",
      desc: `${SITE.city}/${SITE.region} — atendimento sob agendamento.`,
    },
    {
      icon: Building2,
      title: "Áreas atendidas",
      desc: "Uberaba, Uberlândia, Araxá, Frutal, Patrocínio e atendimento remoto para outras regiões.",
    },
  ];

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
              <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Contato" }]} />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Vamos conversar
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] max-w-3xl"
            >
              Fale com a Triângulo Solucions pelo WhatsApp
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Converse diretamente com a Triângulo pelo WhatsApp. Entendemos o seu cenário e
              indicamos o melhor próximo passo — sem compromisso.
            </motion.p>
            <motion.div variants={item} className="mt-7 flex flex-col sm:flex-row gap-3">
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_contact_whatsapp", { location: "hero" });
                  trackEvent("whatsapp_conversion", { location: "contato_hero" });
                }}
                whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.a>
              <Link
                to="/diagnostico"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2 hover:border-primary/40 transition-colors"
              >
                Conhecer o diagnóstico
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {infoCards.map((c) => (
                <motion.div
                  key={c.title}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-elegant transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-12 relative overflow-hidden rounded-3xl bg-graphite p-8 sm:p-12 text-graphite-foreground"
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
                    <Phone className="h-3.5 w-3.5" /> Próximo passo
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Pronto para conversar?
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Em poucos minutos no WhatsApp entendemos o seu cenário e indicamos o caminho
                    mais adequado — sem compromisso.
                  </p>
                </div>
                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_contact_whatsapp", { location: "final" });
                    trackEvent("whatsapp_conversion", { location: "contato_final" });
                  }}
                  whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className="group shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-brand"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar no WhatsApp
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
