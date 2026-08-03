import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, MapPin, MessageCircle, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Sections";
import { CookieBanner } from "./CookieBanner";
import { Breadcrumbs } from "./Breadcrumbs";
import { FAQ } from "./FAQ";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { SERVICES, type ServiceContent, getService } from "@/lib/services";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServicePage({ service }: { service: ServiceContent }) {
  const reduce = useReducedMotion();
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };
  const related = service.related
    .map(getService)
    .filter(Boolean) as ServiceContent[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          <motion.div
            aria-hidden
            className="absolute top-16 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
            animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
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
                  { label: "Soluções", href: "/solucoes" },
                  { label: service.shortName },
                ]}
              />
            </motion.div>
            <motion.div
              variants={item}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {service.badge}
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] text-foreground max-w-3xl"
            >
              {service.h1}
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              {service.subtitle}
            </motion.p>
            <motion.div variants={item} className="mt-7 flex flex-col sm:flex-row gap-3">
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_service_cta", { slug: service.slug, location: "hero" });
                  trackEvent("whatsapp_conversion", { location: `service_hero_${service.slug}` });
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
                Ver todas as soluções
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Pains */}
        <section className="py-16 sm:py-20 bg-surface">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <motion.h2
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-2xl sm:text-3xl font-bold text-foreground max-w-2xl"
            >
              Quando sua empresa precisa disso?
            </motion.h2>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid sm:grid-cols-2 gap-4"
            >
              {service.pains.map((p) => (
                <motion.div
                  key={p.title}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group rounded-2xl bg-card border border-border p-6 shadow-elegant hover:border-primary/50 hover:shadow-brand transition-all duration-300"
                >
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Approach */}
        <section className="py-16 sm:py-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto max-w-3xl px-5 sm:px-8"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Como a Triângulo Solutions resolve
            </motion.div>
            <motion.h2 variants={item} className="mt-3 text-2xl sm:text-3xl font-bold text-foreground">
              Da dor operacional ao resultado mensurável
            </motion.h2>
            <div className="mt-8 space-y-5 text-base text-muted-foreground leading-relaxed">
              {service.approach.map((p, i) => (
                <motion.p variants={item} key={i}>{p}</motion.p>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Deliverables */}
        <section className="relative py-16 sm:py-20 bg-graphite text-graphite-foreground overflow-hidden">
          <div className="absolute inset-0 bg-grid-dark opacity-40" />
          <motion.div
            aria-hidden
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl"
            animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Zap className="h-3.5 w-3.5" /> Módulos & entregáveis
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                O que pode ser desenvolvido
              </h2>
            </motion.div>
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid sm:grid-cols-2 gap-3"
            >
              {service.deliverables.map((d) => (
                <motion.li
                  key={d}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -3, scale: 1.01 }}
                  className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-primary/50 hover:bg-white/[0.08] transition-all duration-300"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-sm text-white/85 leading-relaxed">{d}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Para empresas de Uberaba/MG e região
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground max-w-2xl">
                Benefícios reais para o seu negócio
              </h2>
            </motion.div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid sm:grid-cols-2 gap-4"
            >
              {service.benefits.map((b) => (
                <motion.div
                  key={b.title}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/50 hover:shadow-elegant transition-all duration-300"
                >
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={service.faq} />

        {/* Related */}
        {related.length > 0 && (
          <section className="py-16 sm:py-20 bg-surface">
            <div className="mx-auto max-w-5xl px-5 sm:px-8">
              <motion.h2
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE }}
                className="text-xl sm:text-2xl font-bold text-foreground"
              >
                Soluções relacionadas
              </motion.h2>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-6 grid sm:grid-cols-2 gap-4"
              >
                {related.map((r) => (
                  <motion.div key={r.slug} variants={item} whileHover={reduce ? undefined : { y: -4 }}>
                    <Link
                      to="/$serviceSlug"
                      params={{ serviceSlug: r.slug }}
                      className="group block h-full rounded-2xl border border-border bg-card p-6 hover:border-primary/60 hover:shadow-brand transition-all duration-300"
                    >
                      <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {r.badge}
                      </div>
                      <div className="mt-2 text-lg font-bold text-foreground">{r.shortName}</div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {r.subtitle}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                        Ver detalhes <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-6">
                <Link
                  to="/solucoes"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors story-link"
                >
                  Ver todas as soluções da Triângulo →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 sm:py-20">
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
                className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary/40 blur-3xl"
                animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
                animate={reduce ? undefined : { scale: [1.1, 1, 1.1] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Próximo passo
                </div>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white max-w-2xl leading-tight">
                  Quer entender se essa solução faz sentido para sua empresa?
                </h2>
                <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
                  Conversamos, entendemos o seu cenário e indicamos o melhor próximo passo —
                  sem compromisso.
                </p>
                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("click_service_cta", { slug: service.slug, location: "final" });
                    trackEvent("whatsapp_conversion", { location: `service_final_${service.slug}` });
                  }}
                  whileHover={reduce ? undefined : { y: -2, scale: 1.03 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-brand"
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

export { SERVICES };
