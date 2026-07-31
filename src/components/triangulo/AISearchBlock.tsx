// AI search blocks: blocos de pergunta-resposta diretos, otimizados para LLMs
// (Perplexity, ChatGPT, Gemini) e para resposta direta em SERP.
// Texto curto, factual e específico — sem floreio.
//
// Schema: usamos FAQPage (não QAPage), pois são FAQs institucionais
// mantidas pela Triângulo Solucions, não perguntas de usuários em fórum.

import { Sparkles } from "lucide-react";

export type AIBlock = { q: string; a: string };

export function AISearchBlocks({
  title = "Respostas rápidas",
  intro,
  blocks,
}: {
  title?: string;
  intro?: string;
  blocks: AIBlock[];
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Para busca rápida
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        {intro && (
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">{intro}</p>
        )}
        <div className="mt-8 space-y-6">
          {blocks.map((b, i) => (
            <article
              key={i}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-foreground">
                {b.q}
              </h3>
              <div className="mt-2">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {b.a}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function aiBlocksJsonLd(blocks: AIBlock[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blocks.map((b) => ({
      "@type": "Question",
      name: b.q,
      acceptedAnswer: { "@type": "Answer", text: b.a },
    })),
  };
}
