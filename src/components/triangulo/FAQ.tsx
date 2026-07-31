import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export type FAQItem = { q: string; a: string };

export function FAQ({ items, title = "Perguntas frequentes" }: { items: FAQItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 bg-surface">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {items.map((it, i) => {
            const active = open === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full flex items-start justify-between gap-4 text-left"
                  aria-expanded={active}
                >
                  <span className="text-base sm:text-lg font-semibold text-foreground">
                    {it.q}
                  </span>
                  <span className="mt-1 shrink-0 h-7 w-7 rounded-full grid place-items-center border border-border text-primary">
                    {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {it.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
