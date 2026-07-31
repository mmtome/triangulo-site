import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { getConsent, setConsent } from "@/lib/analytics";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getConsent() === null) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Aviso de cookies"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[60] sm:max-w-md"
        >
          <div className="rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-5 shadow-elegant">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 grid place-items-center text-primary">
                <Cookie className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-foreground">Nós usamos cookies</div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Usamos cookies para melhorar sua experiência de navegação e mensurar o acesso ao site.
                  Você pode aceitar ou recusar.{" "}
                  <a href="/politica-de-privacidade" className="underline hover:text-foreground">
                    Política de Privacidade
                  </a>
                  .
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => decide("granted")}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95 transition-opacity"
                  >
                    Aceitar
                  </button>
                  <button
                    type="button"
                    onClick={() => decide("denied")}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-2 transition-colors"
                  >
                    Recusar opcionais
                  </button>
                </div>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => decide("denied")}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
