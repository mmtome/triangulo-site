import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Target,
  Wrench,
  Cog,
  AlertTriangle,
  Compass,
  MessageCircle,
  Sparkles,
  Info,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { FAQ, faqJsonLd } from "@/components/triangulo/FAQ";
import { USE_CASES, getUseCaseBySlug } from "@/lib/use-cases";
import { SERVICES, SITE_URL } from "@/lib/services";
import { getWhatsAppUrlWithMessage } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/casos-de-uso/$slug")({
  loader: ({ params }) => {
    const uc = getUseCaseBySlug(params.slug);
    if (!uc) throw notFound();
    return uc;
  },
  head: ({ params, loaderData }) => {
    const uc = loaderData ?? getUseCaseBySlug(params.slug);
    if (!uc) return { meta: [{ title: "Cenário de uso | Triângulo Solucions" }] };
    const url = `${SITE_URL}/casos-de-uso/${uc.slug}`;
    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: uc.h1,
          description: uc.description,
          url,
          mainEntityOfPage: url,
          inLanguage: "pt-BR",
          articleSection: "Casos de uso",
          author: { "@type": "Organization", name: "Triângulo Solucions", url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: "Triângulo Solucions",
            url: SITE_URL,
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd(
            [
              { label: "Início", href: "/" },
              { label: "Casos de uso", href: "/casos-de-uso" },
              { label: uc.shortName, href: `/casos-de-uso/${uc.slug}` },
            ],
            SITE_URL,
          ),
        ),
      },
    ];
    if (uc.faq && uc.faq.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd(uc.faq)),
      });
    }
    return {
      meta: [
        { title: uc.title },
        { name: "description", content: uc.description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: uc.title },
        { property: "og:description", content: uc.description },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: uc.title },
        { name: "twitter:description", content: uc.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  component: UseCasePage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <h1 className="text-2xl font-bold">Cenário não encontrado</h1>
        <Link to="/casos-de-uso" className="mt-4 inline-block text-primary underline">
          Ver todos os cenários
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen grid place-items-center text-center px-6">
      <div>
        <h1 className="text-2xl font-bold">Não foi possível carregar este cenário</h1>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        <button onClick={reset} className="mt-4 text-primary underline">
          Tentar novamente
        </button>
      </div>
    </div>
  ),
});

function UseCasePage() {
  const reduce = useReducedMotion();
  const params = Route.useParams();
  const uc = getUseCaseBySlug(params.slug)!;
  const related = USE_CASES.filter((u) => u.slug !== uc.slug).slice(0, 3);
  const relatedSvcs = SERVICES.filter((s) => uc.relatedServices.includes(s.slug));
  const waUrl = getWhatsAppUrlWithMessage(uc.whatsappMessage);

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
        {/* HERO */}
        <section className="relative pt-28 sm:pt-32 pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <motion.div
            aria-hidden
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
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
              <Breadcrumbs
                items={[
                  { label: "Início", href: "/" },
                  { label: "Casos de uso", href: "/casos-de-uso" },
                  { label: uc.shortName },
                ]}
              />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-widest"
            >
              {uc.sector}
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]"
            >
              {uc.h1}
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {uc.subtitle}
            </motion.p>
            <motion.div variants={item} className="mt-7 flex flex-col sm:flex-row gap-3">
              <motion.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_usecase_cta", { slug: uc.slug, location: "hero" });
                  trackEvent("whatsapp_conversion", { location: `usecase_hero_${uc.slug}` });
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
                to="/casos-de-uso"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2 hover:border-primary/40 transition-colors"
              >
                Ver outros cenários
              </Link>
            </motion.div>

            {/* Microcopy disclaimer */}
            <motion.div
              variants={item}
              className="mt-8 flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-xs text-muted-foreground leading-relaxed"
            >
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p>
                Os cenários apresentados são exemplos hipotéticos baseados em problemas comuns
                de gestão e operação. Não representam clientes específicos da Triângulo Solucions.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* ARTICLE BODY */}
        <article className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 space-y-14">
            {/* Problem */}
            <ArticleSection
              eyebrow="O problema por trás do sintoma"
              title="Por que esse cenário acontece"
            >
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                {uc.problem.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </ArticleSection>

            {/* Signals */}
            <ArticleSection
              eyebrow="Como isso aparece no dia a dia"
              title="Sinais práticos para reconhecer o cenário"
              icon={<Target className="h-5 w-5" />}
            >
              <div className="grid sm:grid-cols-2 gap-3">
                {uc.signals.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.03 }}
                    className="flex gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </motion.div>
                ))}
              </div>
            </ArticleSection>

            {/* Engineering lens */}
            <ArticleSection
              eyebrow="O olhar da Engenharia de Produção"
              title="O que a Engenharia de Produção enxerga aqui"
              icon={<Wrench className="h-5 w-5" />}
            >
              <p className="text-base text-muted-foreground leading-relaxed">
                {uc.engineeringLens.intro}
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {uc.engineeringLens.tools.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-foreground">{t.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                ))}
              </div>
            </ArticleSection>

            {/* Software */}
            <ArticleSection
              eyebrow="Onde o software entra"
              title="O papel da tecnologia nesse cenário"
              icon={<Cog className="h-5 w-5" />}
            >
              <p className="text-base text-muted-foreground leading-relaxed">
                {uc.software.intro}
              </p>
              <ul className="mt-5 space-y-2.5">
                {uc.software.items.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </ArticleSection>

            {/* Avoid */}
            <ArticleSection
              eyebrow="O que evitar"
              title="Erros comuns que costumam piorar esse cenário"
              icon={<AlertTriangle className="h-5 w-5" />}
            >
              <ul className="space-y-2.5">
                {uc.avoid.map((s, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-foreground"
                  >
                    <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </ArticleSection>

            {/* Next step */}
            <ArticleSection
              eyebrow="Próximo passo recomendado"
              title="Por onde começar"
              icon={<Compass className="h-5 w-5" />}
            >
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <p className="text-base text-foreground leading-relaxed">{uc.nextStep}</p>
              </div>
            </ArticleSection>
          </div>
        </article>

        {/* FINAL CTA */}
        <section className="py-10">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
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
                    <Sparkles className="h-3.5 w-3.5" /> Próximo passo
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Esse cenário parece com a sua empresa?
                  </h2>
                  <p className="mt-3 text-white/70 leading-relaxed">
                    Chame a Triângulo no WhatsApp e vamos entender se faz sentido organizar
                    processo, criar automação, dashboard ou sistema sob medida para o seu contexto.
                  </p>
                </div>
                <motion.a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_usecase_cta", { slug: uc.slug, location: "final" });
                    trackEvent("whatsapp_conversion", { location: `usecase_final_${uc.slug}` });
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

        {/* RELATED */}
        {(relatedSvcs.length > 0 || related.length > 0) && (
          <section className="py-12 bg-surface">
            <div className="mx-auto max-w-5xl px-5 sm:px-8 grid lg:grid-cols-2 gap-8">
              {relatedSvcs.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground">Soluções relacionadas</h2>
                  <ul className="mt-4 space-y-3">
                    {relatedSvcs.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to="/$serviceSlug"
                          params={{ serviceSlug: s.slug }}
                          className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition-colors"
                        >
                          <span className="text-sm font-semibold text-foreground">
                            {s.shortName}
                          </span>
                          <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/diagnostico"
                        className="group flex items-center justify-between rounded-xl border border-dashed border-border bg-background p-4 hover:border-primary/60 transition-colors"
                      >
                        <span className="text-sm font-semibold text-foreground">
                          Diagnóstico de processos e tecnologia
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              {related.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-foreground">Outros cenários</h2>
                  <ul className="mt-4 space-y-3">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <Link
                          to="/casos-de-uso/$slug"
                          params={{ slug: r.slug }}
                          className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/60 transition-colors"
                        >
                          <span className="text-sm font-semibold text-foreground">
                            {r.shortName}
                          </span>
                          <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Optional FAQ */}
        {uc.faq && uc.faq.length > 0 && <FAQ items={uc.faq} />}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function ArticleSection({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="h-9 w-9 rounded-lg grid place-items-center bg-primary/10 text-primary">
            {icon}
          </span>
        ) : null}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}
