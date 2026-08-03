import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight,
  AlertTriangle,
  Database,
  Repeat,
  BarChart3,
  Cog,
  Layers,
  Boxes,
  Workflow,
  Network,
  Brain,
  Target,
  Gauge,
  Wrench,
  MapPin,
  Triangle,
  MessageCircle,
  ClipboardList,
  PenTool,
  Code2,
  TrendingUp,
  Calculator,
  FileSpreadsheet,
  ArrowDownToLine,
} from "lucide-react";
import { Logo } from "./Logo";
import { HeroVisual } from "./HeroVisual";

/* ---------- Shared bits ---------- */
function SectionLabel({
  children,
  variant = "dark",
}: {
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
        isLight
          ? "border-white/15 bg-white/5 text-white/80"
          : "border-border bg-surface text-muted-foreground"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ---------- HERO ---------- */
const HERO_LINES = ["Tecnologia para transformar", "processos em crescimento."];

export function Hero() {
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      [25, 50, 75, 90].forEach((m) => {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          trackEvent(`scroll_${m}`);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="inicio" className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div
        className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <SectionLabel>Uberaba · Triângulo Mineiro</SectionLabel>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground">
            {HERO_LINES.map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {i === 1 ? (
                  <>
                    <span className="relative inline-block">
                      <span className="relative z-10 text-primary">processos em crescimento</span>
                      <motion.span
                        className="absolute inset-x-0 bottom-1 h-3 bg-primary/15 -z-0"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
                        style={{ transformOrigin: "left" }}
                      />
                    </span>
                    .
                  </>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Criamos sistemas, automações e soluções de gestão para empresas que querem organizar
            operações, reduzir retrabalho e tomar decisões melhores com dados.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <motion.a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("click_hero_whatsapp");
                trackEvent("whatsapp_conversion", { location: "hero" });
              }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand"
            >
              Solicitar diagnóstico <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#solucoes"
              onClick={() => trackEvent("click_hero_solutions")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2 transition-colors"
            >
              Conhecer soluções
            </motion.a>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            transition={{ delayChildren: 0.9 }}
            className="mt-10 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { k: "Engenharia", v: "de Produção" },
              { k: "Software", v: "sob medida" },
              { k: "Triângulo", v: "Mineiro" },
            ].map((s) => (
              <motion.div key={s.k} variants={fadeUp} transition={{ duration: 0.5 }}>
                <div className="text-sm font-bold text-foreground">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- PROBLEM ---------- */
const PAINS = [
  { icon: FileSpreadsheet, title: "Planilhas espalhadas", desc: "Dados duplicados, versões desatualizadas e nenhuma fonte única." },
  { icon: Repeat, title: "Retrabalho operacional", desc: "Tarefas refeitas várias vezes consumindo horas do seu time." },
  { icon: BarChart3, title: "Falta de indicadores", desc: "Sem visibilidade do que está funcionando e do que está travando." },
  { icon: Cog, title: "Processos manuais", desc: "Operações que rodam no improviso e dependem de pessoas-chave." },
  { icon: AlertTriangle, title: "Decisões sem dados", desc: "Escolhas estratégicas baseadas em intuição, não em métricas." },
  { icon: TrendingUp, title: "Crescimento sem controle", desc: "A empresa vende mais e atende mais clientes, mas os controles continuam manuais e difíceis de acompanhar." },
];

export function ProblemCards() {
  return (
    <section className="py-20 sm:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <SectionLabel>O problema</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
          >
            Sua operação cresceu, mas seus processos ainda estão travados?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-base sm:text-lg text-muted-foreground"
          >
            Muitos negócios crescem, mas continuam operando com ferramentas improvisadas.
            A Triangulo Solutions cria tecnologia para organizar esse crescimento.
          </motion.p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PAINS.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl bg-card border border-border p-6 transition-colors duration-300 hover:border-primary/50 shadow-elegant overflow-hidden"
            >
              <motion.div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <motion.div
                whileHover={{ rotate: -8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <p.icon className="h-5 w-5" strokeWidth={1.75} />
              </motion.div>
              <h3 className="mt-4 text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- SOLUTIONS ---------- */
const SOLUTIONS = [
  { icon: Layers, title: "Sistemas personalizados", desc: "Softwares construídos sob a operação real do seu negócio." },
  { icon: Cog, title: "Automações de processos", desc: "Eliminamos tarefas repetitivas com fluxos automatizados." },
  { icon: BarChart3, title: "Dashboards e indicadores", desc: "Visualização clara de dados para decisões mais rápidas." },
  { icon: Calculator, title: "Calculadoras comerciais", desc: "Precificação, margens e estimativas com precisão." },
  { icon: Boxes, title: "MicroSaaS sob medida", desc: "Soluções focadas, leves e direto ao ponto da dor." },
  { icon: Network, title: "Integração de dados e operação", desc: "Conectamos sistemas, planilhas e times em um só fluxo." },
];

export function SolutionCards() {
  return (
    <section id="solucoes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <SectionLabel>Soluções</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
            >
              Soluções digitais para gestão de negócios em Uberaba/MG
            </motion.h2>
          </div>
          <a
            href="#contato"
            className="group text-sm font-semibold text-primary inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
          >
            Conversar sobre o meu caso{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SOLUTIONS.map((s, i) => {
            const dark = i % 2 === 1;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 ${
                  dark
                    ? "bg-graphite text-graphite-foreground border-white/10 hover:border-primary/60"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                } hover:shadow-brand`}
              >
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 group-hover:bg-primary/30 blur-2xl transition-colors duration-500" />
                <svg
                  className={`absolute inset-0 w-full h-full pointer-events-none ${dark ? "opacity-30" : "opacity-40"}`}
                  viewBox="0 0 200 200"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 200 L100 0 L200 200 Z"
                    fill="none"
                    stroke={dark ? "white" : "currentColor"}
                    strokeOpacity="0.06"
                  />
                </svg>
                <div className="relative p-6">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    className={`h-11 w-11 rounded-xl grid place-items-center transition-colors ${
                      dark
                        ? "bg-white/10 text-white group-hover:bg-primary"
                        : "bg-graphite text-graphite-foreground group-hover:bg-primary"
                    }`}
                  >
                    <s.icon className="h-5 w-5" strokeWidth={1.75} />
                  </motion.div>
                  <h3 className={`mt-5 text-lg font-bold ${dark ? "text-white" : "text-foreground"}`}>
                    {s.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/65" : "text-muted-foreground"}`}>
                    {s.desc}
                  </p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Módulo do sistema
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- PROCESS TIMELINE ---------- */
const STEPS = [
  { n: "01", icon: ClipboardList, title: "Diagnóstico do processo", desc: "Entendemos a operação real, gargalos, fluxos e necessidades do negócio." },
  { n: "02", icon: PenTool, title: "Desenho da solução", desc: "Transformamos a dor em uma solução simples, funcional e validável." },
  { n: "03", icon: Code2, title: "Desenvolvimento do sistema", desc: "Criamos o sistema com foco em usabilidade, segurança e evolução." },
  { n: "04", icon: TrendingUp, title: "Melhoria contínua", desc: "Acompanhamos o uso, ajustamos fluxos e evoluímos com base nos dados." },
];

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="processo"
      className="py-20 sm:py-28 bg-graphite text-graphite-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-dark opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <SectionLabel variant="light">Como atuamos</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          >
            Da dor operacional ao software funcionando
          </motion.h2>
        </div>
        <div ref={ref} className="relative mt-16">
          {/* Desktop horizontal line */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-white/10" />
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: "left" }}
            className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-primary via-primary to-primary/40"
          />
          {/* Mobile vertical line */}
          <div className="lg:hidden absolute top-0 bottom-0 left-7 w-px bg-white/10" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="lg:hidden absolute top-0 bottom-0 left-7 w-px bg-gradient-to-b from-primary via-primary to-primary/30"
          />

          <div className="grid lg:grid-cols-4 gap-6 lg:gap-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-20 lg:pl-0"
              >
                {/* Node */}
                <div className="absolute lg:relative top-0 lg:top-auto left-0 lg:left-auto">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center shadow-brand relative z-10"
                  >
                    <s.icon className="h-6 w-6" strokeWidth={1.75} />
                    <span className="absolute -top-2 -right-2 h-6 px-1.5 rounded-full bg-white text-graphite text-[10px] font-bold grid place-items-center">
                      {s.n}
                    </span>
                  </motion.div>
                </div>
                <div className="lg:mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 hover:bg-white/10 transition-colors">
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">{s.desc}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-primary font-semibold">
                    <Triangle className="h-3 w-3 fill-primary" />
                    ETAPA {s.n}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- DIFFERENTIAL ---------- */
const DIFFS = [
  { icon: Workflow, title: "Visão de processos" },
  { icon: Brain, title: "Pensamento analítico" },
  { icon: Gauge, title: "Foco em produtividade" },
  { icon: Target, title: "Tecnologia aplicada à realidade" },
  { icon: Wrench, title: "Soluções sob medida" },
];

export function Differential() {
  return (
    <section id="sobre" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <SectionLabel>Diferencial</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
          >
            <span className="text-primary">Engenharia de Produção</span> aplicada ao
            desenvolvimento de software
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-base sm:text-lg text-muted-foreground"
          >
            Unimos visão de processos, tecnologia e pensamento analítico para criar soluções que
            não apenas funcionam, mas melhoram a forma como a empresa opera.
          </motion.p>
        </div>

        {/* Equation: EP + Software = Gestão */}
        <div className="mt-14 grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-5 items-stretch">
          <EquationCard
            label="Engenharia de Produção"
            sub="Processos · Eficiência · Métricas"
            icon={Gauge}
            delay={0}
          />
          <Operator symbol="+" delay={0.15} />
          <EquationCard
            label="Software"
            sub="Sistemas · Automação · Dados"
            icon={Code2}
            delay={0.3}
            dark
          />
          <Operator symbol="=" delay={0.45} />
          <EquationCard
            label="Soluções de Gestão"
            sub="Organização · Crescimento"
            icon={Target}
            delay={0.6}
            highlight
          />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {DIFFS.map((d) => (
            <motion.div
              key={d.title}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border bg-card p-5 flex items-center gap-3 hover:border-primary/50 hover:shadow-elegant transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16 }}
                className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <d.icon className="h-5 w-5" strokeWidth={1.75} />
              </motion.div>
              <div className="text-sm font-semibold text-foreground leading-tight">{d.title}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function EquationCard({
  label,
  sub,
  icon: Icon,
  delay,
  dark,
  highlight,
}: {
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  delay: number;
  dark?: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl p-6 border overflow-hidden ${
        highlight
          ? "bg-primary text-primary-foreground border-primary shadow-brand"
          : dark
            ? "bg-graphite text-graphite-foreground border-white/10"
            : "bg-card text-foreground border-border shadow-elegant"
      }`}
    >
      <div
        className={`h-11 w-11 rounded-xl grid place-items-center ${
          highlight ? "bg-white/15" : dark ? "bg-white/10" : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="mt-4 text-lg font-bold leading-tight">{label}</div>
      <div className={`mt-1 text-xs ${highlight ? "text-white/85" : dark ? "text-white/65" : "text-muted-foreground"}`}>
        {sub}
      </div>
    </motion.div>
  );
}

function Operator({ symbol, delay }: { symbol: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 220 }}
      className="hidden md:grid place-items-center text-3xl font-light text-primary"
    >
      {symbol}
    </motion.div>
  );
}

/* ---------- REGIONAL ---------- */
export function RegionalSection() {
  return (
    <section className="py-20 sm:py-28 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3">
          <SectionLabel>Regional</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground"
          >
            Tecnologia feita em <span className="text-primary">Uberaba/MG</span> para negócios em
            evolução
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-base sm:text-lg text-muted-foreground"
          >
            A Triangulo Solutions nasce no Triângulo Mineiro com o propósito de aproximar empresas
            locais de soluções digitais inteligentes, acessíveis e alinhadas à realidade de cada
            operação.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-semibold text-foreground shadow-elegant"
          >
            <MapPin className="h-4 w-4 text-primary" />
            Uberaba/MG · Triângulo Mineiro
          </motion.div>
        </div>
        <div className="lg:col-span-2">
          <RegionalMap />
        </div>
      </div>
    </section>
  );
}

function RegionalMap() {
  const cities = [
    { x: 150, y: 95, label: "Uberaba", main: true },
    { x: 88, y: 215, label: "Uberlândia" },
    { x: 212, y: 225, label: "Araxá" },
    { x: 175, y: 165, label: "" },
    { x: 125, y: 170, label: "" },
  ];
  const links = [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 3],
    [0, 4],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-square max-w-sm mx-auto"
    >
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <linearGradient id="triGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.58 0.205 25)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="oklch(0.18 0.008 270)" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        <motion.path
          d="M150 30 L270 250 L30 250 Z"
          fill="url(#triGrad)"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: "150px 165px" }}
        />
        <motion.path
          d="M150 70 L240 235 L60 235 Z"
          fill="none"
          stroke="white"
          strokeOpacity="0.25"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        {links.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={cities[a].x}
            y1={cities[a].y}
            x2={cities[b].x}
            y2={cities[b].y}
            stroke="white"
            strokeOpacity="0.55"
            strokeDasharray="3 3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 + i * 0.1 }}
          />
        ))}
        {cities.map((c, i) => (
          <g key={i}>
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={c.main ? 8 : 5}
              fill="white"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            />
            <motion.circle
              cx={c.x}
              cy={c.y}
              r={c.main ? 16 : 10}
              fill="white"
              opacity="0.18"
              animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
              style={{ transformOrigin: `${c.x}px ${c.y}px` }}
            />
            {c.label && (
              <text
                x={c.x + 12}
                y={c.y + 4}
                fontSize="11"
                fill="white"
                fontWeight={c.main ? 700 : 500}
              >
                {c.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ---------- CTA ---------- */
export function CTASection() {
  return (
    <section id="contato" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-graphite text-graphite-foreground p-8 sm:p-14 shadow-elegant"
        >
          <div className="absolute inset-0 bg-grid-dark opacity-60" />
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/40 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating triangles */}
          {[
            { x: "8%", y: "20%", size: 24, dur: 6 },
            { x: "88%", y: "70%", size: 18, dur: 7 },
            { x: "20%", y: "75%", size: 14, dur: 5 },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: t.x, top: t.y }}
              animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
              transition={{ duration: t.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            >
              <Triangle className="text-primary/60 fill-primary/30" style={{ width: t.size, height: t.size }} />
            </motion.div>
          ))}

          <div className="relative grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <SectionLabel variant="light">Diagnóstico gratuito</SectionLabel>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Vamos encontrar o próximo ganho de eficiência da sua empresa?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl">
                Solicite um diagnóstico e descubra onde a tecnologia pode organizar, automatizar
                e acelerar sua operação.
              </p>
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3">
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_final_cta", { destination: "whatsapp" });
                  trackEvent("whatsapp_conversion", { location: "cta_final" });
                }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-brand"
              >
                Falar com a Triângulo
                <ArrowRight className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("whatsapp_conversion", { location: "cta_final" });
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-6 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp direto
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            Tecnologia, processos e gestão para negócios em evolução.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Uberaba/MG — Triângulo Mineiro
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-foreground">Navegação</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[
              ["Início", "/"],
              ["Soluções", "/solucoes"],
              ["Casos de uso", "/casos-de-uso"],
              ["Diagnóstico", "/diagnostico"],
              ["Insights", "/insights"],
              ["Sobre", "/sobre"],
              ["Contato", "/contato"],
            ].map(([l, h]) => (
              <li key={h}>
                <a
                  href={h}
                  className="relative inline-block hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-foreground">Contato</div>
          <motion.a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("whatsapp_conversion", { location: "footer" });
            }}
            whileHover={{ y: -2, scale: 1.03 }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </motion.a>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Converse direto com a Triângulo pelo WhatsApp
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Triângulo Solutions. Todos os direitos reservados. · <a href="/politica-de-privacidade" className="hover:text-foreground transition-colors">Política de Privacidade</a></div>
          <div>Feito em Uberaba/MG</div>
        </div>
      </div>
    </footer>
  );
}
