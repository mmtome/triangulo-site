import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Search,
  Map,
  Workflow,
  FileCheck,
  Table2,
  RefreshCcw,
  BarChart3,
  Brain,
  Send,
  TrendingUp,
  Database,
  Wrench,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { FAQ, faqJsonLd } from "@/components/triangulo/FAQ";
import { AISearchBlocks, aiBlocksJsonLd } from "@/components/triangulo/AISearchBlock";
import { SITE_URL } from "@/lib/services";
import { getDiagnosticWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Diagnóstico de Processos e Tecnologia em Uberaba/MG";
const DESC =
  "Entenda gargalos, processos e oportunidades de automação com um diagnóstico de tecnologia para empresas em Uberaba/MG.";
const URL = `${SITE_URL}/diagnostico`;

const SIGNS = [
  {
    icon: Table2,
    title: "Tudo depende de planilhas",
    desc: "A operação até funciona, mas as informações ficam espalhadas, desatualizadas e difíceis de acompanhar.",
  },
  {
    icon: RefreshCcw,
    title: "Retrabalho virou rotina",
    desc: "O time precisa conferir, copiar, mandar mensagem, atualizar arquivo e repetir tarefas que poderiam ser automatizadas.",
  },
  {
    icon: BarChart3,
    title: "Você não confia nos números",
    desc: "Vendas, custos, pedidos, estoque ou indicadores existem, mas ninguém sabe se estão atualizados ou corretos.",
  },
  {
    icon: Brain,
    title: "A gestão depende de memória",
    desc: "Muita coisa importante fica na cabeça do dono, dos colaboradores ou em conversas perdidas no WhatsApp.",
  },
  {
    icon: Send,
    title: "O cliente espera e você não sabe onde travou",
    desc: "O pedido, orçamento ou atendimento passa por várias etapas, mas não existe visão clara do fluxo.",
  },
  {
    icon: TrendingUp,
    title: "A empresa cresceu, a gestão não acompanhou",
    desc: "O volume aumentou, mas os controles continuam improvisados, manuais e difíceis de escalar.",
  },
];

const SELF_CHECK = [
  "Tenho informações espalhadas em vários lugares",
  "Perco tempo buscando dados para tomar decisão",
  "Minha equipe repete tarefas manuais todos os dias",
  "Não tenho clareza de onde estão os gargalos",
  "Uso planilhas que já não acompanham a operação",
  "Quero crescer, mas tenho medo de perder controle",
];

const ANALYSIS = [
  {
    icon: Workflow,
    title: "Processos",
    desc: "Como a operação funciona hoje, onde existem esperas, retrabalho, falhas de comunicação e etapas manuais.",
  },
  {
    icon: Database,
    title: "Dados",
    desc: "Quais informações a empresa já tem, onde elas estão e como poderiam apoiar decisões melhores.",
  },
  {
    icon: Wrench,
    title: "Ferramentas",
    desc: "Quais sistemas, planilhas ou aplicativos já são usados e onde eles ajudam ou atrapalham.",
  },
  {
    icon: Lightbulb,
    title: "Oportunidades",
    desc: "Quais melhorias fazem sentido agora: automação, dashboard, sistema sob medida, integração ou redesenho de processo.",
  },
];

const STEPS = [
  {
    icon: Search,
    title: "Conversa inicial",
    desc: "Entendemos a realidade da empresa, as dores principais e o que já foi tentado.",
  },
  {
    icon: Map,
    title: "Mapeamento dos sinais",
    desc: "Organizamos os sintomas em processos, dados, ferramentas e rotina operacional.",
  },
  {
    icon: Workflow,
    title: "Caminho recomendado",
    desc: "Indicamos o próximo passo mais coerente, evitando tecnologia desnecessária ou projetos grandes demais para o momento.",
  },
  {
    icon: FileCheck,
    title: "Proposta, se fizer sentido",
    desc: "Se houver aderência, desenhamos uma solução com sistema, automação, dashboard ou consultoria aplicada.",
  },
];

const HONESTY = [
  "Sem empurrar ferramenta desnecessária",
  "Sem prometer transformação mágica",
  "Sem apresentação genérica",
  "Com olhar de processos, gestão e tecnologia",
];

const FAQ_ITEMS = [
  {
    q: "O diagnóstico tem custo?",
    a: "Não. A primeira conversa é sem custo e serve para entender o cenário da empresa e avaliar se existe oportunidade real de melhoria.",
  },
  {
    q: "Preciso já saber qual sistema quero criar?",
    a: "Não. Muitas empresas procuram a Triângulo justamente porque ainda não sabem se precisam de sistema, automação, dashboard ou apenas organização de processo.",
  },
  {
    q: "O diagnóstico é só para empresas de Uberaba?",
    a: "Não. A Triângulo tem base em Uberaba/MG, mas também atende empresas do Triângulo Mineiro e projetos remotos.",
  },
  {
    q: "Depois do diagnóstico sou obrigado a contratar?",
    a: "Não. O diagnóstico serve para clarear o próximo passo. Uma proposta só faz sentido se houver aderência entre a dor da empresa e o que a Triângulo consegue resolver.",
  },
  {
    q: "Quais tipos de problema vocês analisam?",
    a: "Processos manuais, retrabalho, falta de indicadores, planilhas desorganizadas, controle operacional, precificação, pedidos, atendimento, dashboards e automações.",
  },
];

const AI_BLOCKS = [
  {
    q: "O que é o diagnóstico de tecnologia da Triângulo Solutions?",
    a: "Conversa estruturada e sem custo para mapear processos, ferramentas e gestão da empresa. Tem como saída um caminho recomendado, com prioridades claras.",
  },
  {
    q: "Para quem o diagnóstico faz sentido?",
    a: "Para empresas em Uberaba/MG e região que sentem que tecnologia poderia gerar mais resultado, mas não têm clareza sobre por onde começar.",
  },
  {
    q: "O que a empresa recebe ao final?",
    a: "Uma leitura direta do cenário, indicação dos pontos mais críticos e proposta de próximos passos — que podem ou não envolver a Triângulo Solutions.",
  },
];

export const Route = createFileRoute("/diagnostico")({
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
          "@type": "Service",
          name: "Diagnóstico de tecnologia",
          description: DESC,
          serviceType: "Consultoria diagnóstica",
          provider: { "@type": "Organization", name: "Triângulo Solutions" },
          areaServed: ["Uberaba", "Triângulo Mineiro", "Minas Gerais"],
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
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
              { label: "Diagnóstico", href: "/diagnostico" },
            ],
            SITE_URL,
          ),
        ),
      },
    ],
  }),
  component: DiagnosticoPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

function WhatsAppButton({
  label,
  location,
  variant = "primary",
  size = "md",
}: {
  label: string;
  location: string;
  variant?: "primary" | "outline";
  size?: "md" | "lg";
}) {
  const reduce = useReducedMotion();
  const base =
    "group inline-flex items-center gap-2 rounded-full font-semibold transition-colors relative overflow-hidden";
  const sizes = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-sm";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-brand hover:bg-primary/90 hover:shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
      : "border border-border text-foreground hover:bg-surface";
  return (
    <motion.a
      href={getDiagnosticWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent("click_diagnostico_cta", { location });
        trackEvent("whatsapp_conversion", { location: `diagnostico_${location}` });
      }}
      whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`${base} ${sizes} ${styles}`}
    >
      <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
      <span>{label}</span>
    </motion.a>
  );
}

function DiagnosticoPage() {
  const reduce = useReducedMotion();

  // Hero stagger
  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };

  // Timeline progress (Como funciona)
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative pt-28 sm:pt-32 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          {/* soft accent blob */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl pointer-events-none"
          />
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="relative mx-auto max-w-5xl px-5 sm:px-8"
          >
            <motion.div variants={heroItem}>
              <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Diagnóstico" }]} />
            </motion.div>
            <motion.h1
              variants={heroItem}
              className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] max-w-3xl tracking-tight"
            >
              Diagnóstico de tecnologia para empresas em Uberaba/MG
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              Uma conversa estruturada para entender gargalos, processos, ferramentas e
              oportunidades antes de investir em mais sistemas, automações ou dashboards.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <WhatsAppButton label="Falar no WhatsApp" location="hero" />
              <motion.a
                href="#sinais"
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface hover:border-primary/40 transition-colors"
              >
                Ver sinais comuns
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            </motion.div>
            <motion.p
              variants={heroItem}
              className="mt-5 text-xs text-muted-foreground max-w-xl"
            >
              Sem custo. Sem apresentação genérica. Primeiro entendemos o cenário real da sua
              operação.
            </motion.p>
          </motion.div>
        </section>

        {/* PROCESSO > FERRAMENTA */}
        <section className="py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto max-w-4xl px-5 sm:px-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Você provavelmente não precisa de mais uma ferramenta. Precisa entender o processo.
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Muitas empresas tentam resolver problemas de gestão comprando ferramentas, criando
              planilhas novas ou contratando sistemas isolados. O problema é que, sem entender o
              processo, a tecnologia vira mais uma camada de confusão.
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              O diagnóstico da Triângulo ajuda a identificar onde está o gargalo: operação,
              processo, dados, rotina comercial, controle financeiro, atendimento, gestão de
              pedidos ou tomada de decisão.
            </p>
          </motion.div>
        </section>

        {/* SINAIS COMUNS */}
        <section id="sinais" className="py-12 sm:py-16 bg-surface relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-2xl sm:text-3xl font-bold text-foreground max-w-3xl"
            >
              Sinais de que sua empresa precisa olhar para processos e tecnologia
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
              }}
              className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {SIGNS.map((s) => (
                <motion.div
                  key={s.title}
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : {
                          y: -4,
                          transition: { type: "spring", stiffness: 280, damping: 20 },
                        }
                  }
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_32px_-16px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                    <s.icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-4deg]" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* AUTOAVALIAÇÃO */}
        <section className="py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative rounded-2xl border border-border bg-card p-6 sm:p-10 overflow-hidden"
            >
              {/* corner accent */}
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"
              />
              <h2 className="relative text-xl sm:text-2xl font-bold text-foreground leading-tight">
                Se você marcou mentalmente 2 ou mais sinais, já existe oportunidade de melhoria.
              </h2>
              <p className="relative mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Não significa necessariamente que sua empresa precisa de um sistema grande. Às
                vezes, o melhor próximo passo é organizar o processo, automatizar uma etapa
                simples ou criar um painel com os dados certos.
              </p>
              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                }}
                className="relative mt-6 grid sm:grid-cols-2 gap-3"
              >
                {SELF_CHECK.map((c) => (
                  <motion.li
                    key={c}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                    }}
                    className="group flex gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <span>{c}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <div className="relative mt-8">
                <WhatsAppButton label="Quero entender meu cenário" location="self_check" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* O QUE ANALISAMOS */}
        <section className="py-12 sm:py-16 bg-surface">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              O que a Triângulo observa no diagnóstico
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
              className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {ANALYSIS.map((a, i) => (
                <motion.div
                  key={a.title}
                  variants={{
                    hidden: { opacity: 0, y: 22 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -4, transition: { type: "spring", stiffness: 280, damping: 20 } }
                  }
                  className="group relative rounded-2xl border border-border bg-card p-6 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_32px_-16px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center transition-transform duration-300 group-hover:scale-110">
                      <a.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* COMO FUNCIONA — TIMELINE */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              Como funciona o diagnóstico
            </motion.h2>

            <div ref={timelineRef} className="relative mt-12">
              {/* vertical line (mobile) / horizontal line (desktop) — background */}
              <div
                aria-hidden
                className="absolute left-5 top-0 bottom-0 w-px bg-border lg:left-0 lg:right-0 lg:top-7 lg:bottom-auto lg:h-px lg:w-auto"
              />
              {/* progress fill */}
              <motion.div
                aria-hidden
                style={{
                  scaleY: reduce ? 1 : lineScale,
                  scaleX: reduce ? 1 : lineScale,
                }}
                className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/70 to-transparent origin-top lg:left-0 lg:right-0 lg:top-7 lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r lg:from-primary lg:via-primary/70 lg:to-transparent lg:origin-left"
              />

              <div className="grid lg:grid-cols-4 gap-8 lg:gap-5">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
                    className="relative pl-12 lg:pl-0 lg:pt-16"
                  >
                    {/* node */}
                    <div className="absolute left-0 top-0 lg:left-0 lg:top-0 h-10 w-10 rounded-full bg-background border-2 border-primary grid place-items-center shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_12%,transparent)]">
                      <s.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-primary">
                      Etapa {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-1 text-base font-bold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HONESTIDADE */}
        <section className="py-12 sm:py-16 bg-surface relative overflow-hidden">
          {/* geometric background */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(60deg, var(--primary) 1px, transparent 1px), linear-gradient(-60deg, var(--primary) 1px, transparent 1px)",
              backgroundSize: "44px 76px",
            }}
          />
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"
          />
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-2xl border border-border bg-card/95 backdrop-blur p-6 sm:p-10"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
                  className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"
                >
                  <ShieldCheck className="h-5 w-5" />
                </motion.div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    Antes de vender software, entendemos o problema.
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    A Triângulo Solutions não parte do princípio de que toda empresa precisa de um
                    sistema novo. Nosso foco é entender se existe uma dor operacional real, qual é
                    a causa e qual solução tem melhor custo-benefício para o momento da empresa.
                  </p>
                </div>
              </div>
              <motion.ul
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
                }}
                className="mt-6 grid sm:grid-cols-2 gap-3"
              >
                {HONESTY.map((h) => (
                  <motion.li
                    key={h}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                    }}
                    className="group flex gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* REGIONAL */}
        <section className="py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mx-auto max-w-4xl px-5 sm:px-8 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Diagnóstico para empresas de Uberaba/MG e região
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Atendemos empresas de Uberaba, do Triângulo Mineiro e também operações remotas que
              querem melhorar gestão, processos e produtividade com tecnologia aplicada.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton label="Falar com a Triângulo" location="regional" />
            </div>
          </motion.div>
        </section>

        <AISearchBlocks
          title="Respostas rápidas sobre o diagnóstico"
          blocks={AI_BLOCKS}
        />

        <FAQ items={FAQ_ITEMS} />

        {/* CTA FINAL */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-primary/30 p-10 sm:p-16 text-center"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--primary) 18%, var(--background)) 0%, var(--background) 55%, color-mix(in oklab, var(--primary) 12%, var(--background)) 100%)",
              }}
            >
              {/* geometric accents */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
                  backgroundSize: "56px 56px",
                  maskImage:
                    "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                }}
              />
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE }}
                className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"
              />
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
                className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl pointer-events-none"
              />

              <div className="relative">
                <h2 className="text-2xl sm:text-4xl font-bold text-foreground leading-tight max-w-2xl mx-auto tracking-tight">
                  Quer entender onde sua empresa está perdendo eficiência?
                </h2>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Chame a Triângulo no WhatsApp e vamos mapear os principais sinais de gargalo na
                  sua operação.
                </p>
                <div className="mt-9 flex justify-center">
                  <WhatsAppButton
                    label="Agendar diagnóstico pelo WhatsApp"
                    location="final_cta"
                    size="lg"
                  />
                </div>
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
