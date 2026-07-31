import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { getDiagnosticWhatsAppUrl, getWhatsAppUrl } from "@/lib/site";
import { PrismScene } from "./PrismScene";

/* ============================================================================
   Home da Triângulo Solucions.

   Estrutura: "ref site 2" (hero com brilho → prova → blocos de valor →
   fechamento) · Hero 3D: "ref site 3" (objetos flutuando em profundidade).
   Copy: documento de Branding e Posicionamento (jul/2026).
   Cor e tipo: Manual da Marca v1.0 — cinco cores, Poppins.
   ========================================================================== */

const surgir = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const escalonar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO                                                                        */
/* -------------------------------------------------------------------------- */

export function Hero() {
  return (
    <section
      id="inicio"
      className="grao relative isolate min-h-[92vh] overflow-hidden pt-28 sm:pt-32"
    >
      {/* brilho de horizonte — o elemento das referências, em vermelho da marca */}
      <div
        className="pointer-events-none absolute left-1/2 top-[62%] z-0 h-[1200px] w-[1600px] -translate-x-1/2 rounded-full opacity-90"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(206,43,52,.30) 0%, rgba(206,43,52,.11) 18%, rgba(206,43,52,.03) 34%, rgba(206,43,52,0) 55%)",
        }}
      />
      <div className="bg-grid pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:radial-gradient(ellipse_at_50%_35%,black_20%,transparent_70%)]" />

      {/* cena 3D atrás do texto */}
      <PrismScene className="pointer-events-none absolute inset-0 z-0" />

      {/* Véu atrás do texto: sem ele o prisma passa por baixo das letras e o
          contraste cai abaixo do legível. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[62%] lg:block"
        style={{
          background:
            "linear-gradient(to right, #0e0e10 0%, rgba(14,14,16,.94) 42%, rgba(14,14,16,.65) 72%, rgba(14,14,16,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 text-center sm:px-8 lg:max-w-7xl lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Etiqueta>Uberaba · Triângulo Mineiro</Etiqueta>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-4xl text-[2.6rem] leading-[1.04] sm:text-6xl lg:mx-0 lg:max-w-[15ch] lg:text-[4.4rem]"
        >
          O seu lucro já existe.
          <br />
          <span className="text-primary">Ele só está preso.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-[46ch]"
        >
          Ele está travado em processo manual, retrabalho e gargalo — e some todo
          mês sem você ver. A gente destrava com a solução digital certa.{" "}
          <span className="destaque text-foreground">
            Você não precisa vender mais pra lucrar mais: precisa parar de perder.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
        >
          <a
            href={getDiagnosticWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="shadow-brand group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Solicitar diagnóstico
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#metodo"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-white/25 hover:bg-white/[0.04]"
          >
            Como funciona
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-14 text-[11px] font-semibold uppercase tracking-[0.34em] text-muted-foreground"
        >
          Mapear · Resolver · Lucrar
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* O CONTRASTE — o que define a marca                                          */
/* -------------------------------------------------------------------------- */

const CONTRASTE = [
  {
    mercado: "Tecnologia como fim — “faça um site”, “implemente IA”",
    triangulo: "Resultado como fim. A tecnologia é só o meio",
  },
  {
    mercado: "A solução antes do diagnóstico",
    triangulo: "Diagnóstico do processo antes de qualquer linha de código",
  },
  {
    mercado: "Hype de IA e “transformação digital” genérica",
    triangulo: "IA e automação só quando aumentam o lucro — sem hype",
  },
  {
    mercado: "Consultoria de PowerPoint que entrega relatório",
    triangulo: "Consultoria mão na massa que constrói e implementa",
  },
];

export function Contraste() {
  return (
    <section className="relative border-y border-white/[0.06] bg-[#0b0b0d] py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={escalonar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={surgir}>
            <Etiqueta>O contraste</Etiqueta>
          </motion.div>
          <motion.h2 variants={surgir} className="mt-6 text-3xl sm:text-4xl">
            O mercado te vende a solução
            <br />
            antes de entender o seu problema.
          </motion.h2>
          <motion.p
            variants={surgir}
            className="mx-auto mt-5 max-w-xl text-muted-foreground"
          >
            Você compra a ferramenta e continua perdendo dinheiro no mesmo lugar.
            A gente inverte a ordem.
          </motion.p>
        </motion.div>

        <motion.div
          variants={escalonar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2"
        >
          <div className="bg-[#0e0e10] px-6 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              O mercado costuma vender
            </p>
          </div>
          <div className="hidden bg-[#0e0e10] px-6 py-5 sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              A Triângulo entrega
            </p>
          </div>

          {CONTRASTE.map((linha) => (
            <motion.div
              key={linha.mercado}
              variants={surgir}
              className="contents"
            >
              <div className="flex items-start gap-3 bg-[#0e0e10] px-6 py-6">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {linha.mercado}
                </p>
              </div>
              <div className="flex items-start gap-3 bg-graphite px-6 py-6">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-foreground">
                  {linha.triangulo}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={surgir}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-2xl text-center text-lg leading-relaxed sm:text-xl"
        >
          Não somos uma agência que faz site. Não somos uma software house que
          entrega sistema.{" "}
          <span className="font-semibold text-primary">
            A gente destrava o lucro que já está preso na sua operação
          </span>{" "}
          — e a tecnologia é só a chave.
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* MÉTODO — os três vértices                                                   */
/* -------------------------------------------------------------------------- */

const METODO = [
  {
    numero: "01",
    titulo: "Mapear",
    texto:
      "Toda relação começa com uma sessão de mapeamento do seu processo. A gente desenha o fluxo real — não o que está no papel — e acha onde o dinheiro escapa.",
  },
  {
    numero: "02",
    titulo: "Resolver",
    texto:
      "A solução é escolhida pelo problema, não pelo modismo. Às vezes é uma automação simples, às vezes um app, às vezes IA — e às vezes IA nem entra.",
  },
  {
    numero: "03",
    titulo: "Lucrar",
    texto:
      "Toda proposta declara a tese de lucro: quanto se ganha ou economiza. E todo projeto termina com um comparativo em números — tempo, custo, capacidade, receita.",
  },
];

export function Metodo() {
  return (
    <section id="metodo" className="relative py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-[600px] w-[1100px] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(206,43,52,.14) 0%, rgba(206,43,52,0) 62%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Etiqueta>O método</Etiqueta>
          <h2 className="mt-6 text-3xl sm:text-4xl">
            Três vértices. Nessa ordem.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            É o raciocínio da engenharia de produção aplicado ao digital: mapear,
            medir, otimizar.
          </p>
        </div>

        <motion.div
          variants={escalonar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-5 md:grid-cols-3"
        >
          {METODO.map((etapa) => (
            <motion.div
              key={etapa.numero}
              variants={surgir}
              className="shadow-elegant group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-graphite p-8 transition hover:border-primary/30"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(206,43,52,.18) 0%, rgba(206,43,52,0) 70%)",
                }}
              />
              <span className="text-[11px] font-semibold tracking-[0.2em] text-primary">
                {etapa.numero}
              </span>
              <h3 className="mt-4 text-2xl">{etapa.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {etapa.texto}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* PROMESSA                                                                    */
/* -------------------------------------------------------------------------- */

export function Promessa() {
  return (
    <section className="relative border-y border-white/[0.06] bg-[#0b0b0d] py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-2xl leading-snug sm:text-4xl"
        >
          “Nenhuma linha de código antes de entender onde está o seu lucro.
          <br className="hidden sm:block" /> Todo projeto começa com um
          diagnóstico e termina em resultado.”
        </motion.blockquote>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          A promessa da marca
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* DIFERENCIAIS                                                                */
/* -------------------------------------------------------------------------- */

const DIFERENCIAIS = [
  {
    titulo: "Método de engenharia de produção",
    texto:
      "Não é palpite criativo: é mapear, medir e otimizar processos para maximizar resultado. Raro no mercado digital.",
  },
  {
    titulo: "Diagnóstico antes da solução",
    texto:
      "A gente mapeia o processo primeiro. A maioria chega vendendo o produto pronto sem entender a dor.",
  },
  {
    titulo: "Tecnologia como meio, lucro como fim",
    texto:
      "A ferramenta é escolhida pelo problema. Se não dá lucro, a gente não faz.",
  },
  {
    titulo: "Obsessão por ROI",
    texto:
      "Todo projeto tem uma tese de lucro: quanto se ganha ou economiza. Medimos antes e depois.",
  },
  {
    titulo: "Consultoria que executa",
    texto:
      "Não entregamos PowerPoint e vamos embora. Construímos, implementamos e acompanhamos.",
  },
  {
    titulo: "Visão sistêmica",
    texto:
      "Enxergamos a empresa como um sistema — fluxos, gargalos, capacidade — não como um site isolado.",
  },
];

export function Diferenciais() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Etiqueta>Por que acreditar</Etiqueta>
          <h2 className="mt-6 text-3xl sm:text-4xl">
            O que sustenta a promessa.
          </h2>
        </div>

        <motion.div
          variants={escalonar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DIFERENCIAIS.map((d) => (
            <motion.div key={d.titulo} variants={surgir}>
              <div className="h-px w-10 bg-primary" />
              <h3 className="mt-5 text-lg leading-snug">{d.titulo}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {d.texto}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CREDO                                                                       */
/* -------------------------------------------------------------------------- */

const CREDO = [
  "Existe lucro preso em toda empresa. Nosso trabalho é destravar.",
  "Crescer não é só vender mais. É parar de perder.",
  "Todo atrito é lucro escapando.",
  "A gente não chuta: triangula. Antes de resolver, acha o ponto exato.",
  "A gente não vende tecnologia. Se não dá lucro, a gente não faz.",
  "IA é meio, não milagre.",
  "Número acima de achismo. Mão na massa acima de PowerPoint.",
];

export function Credo() {
  return (
    <section className="grao relative overflow-hidden border-y border-white/[0.06] bg-[#0b0b0d] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[900px] w-[1400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(206,43,52,.10) 0%, rgba(206,43,52,0) 60%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="text-center">
          <Etiqueta>O credo</Etiqueta>
          <h2 className="mx-auto mt-6 max-w-2xl text-3xl leading-snug sm:text-4xl">
            “O seu maior concorrente não está lá fora. É a sua própria operação
            travada.”
          </h2>
        </div>

        <motion.ul
          variants={escalonar}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-14 max-w-2xl space-y-4"
        >
          {CREDO.map((linha) => (
            <motion.li
              key={linha}
              variants={surgir}
              className="flex items-start gap-3.5 border-b border-white/[0.06] pb-4 last:border-0"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
              <span className="text-[15px] leading-relaxed text-muted-foreground">
                {linha}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CTA FINAL                                                                   */
/* -------------------------------------------------------------------------- */

export function ChamadaFinal() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-full z-0 h-[1100px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(206,43,52,.26) 0%, rgba(206,43,52,.08) 24%, rgba(206,43,52,0) 52%)",
        }}
      />
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-4xl leading-[1.06] sm:text-6xl"
        >
          Destrave o lucro
          <br />
          <span className="text-primary">que já é seu.</span>
        </motion.h2>

        <p className="mx-auto mt-7 max-w-lg text-muted-foreground">
          Comece pelo Mapa: uma sessão de diagnóstico do seu processo, com os
          pontos de vazamento e a tese de lucro na mesa.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={getDiagnosticWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="shadow-brand group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Solicitar diagnóstico
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-8 py-4 text-sm font-semibold text-foreground transition hover:border-white/25 hover:bg-white/[0.04]"
          >
            Conversar sobre o meu caso
          </a>
        </div>
      </div>
    </section>
  );
}
