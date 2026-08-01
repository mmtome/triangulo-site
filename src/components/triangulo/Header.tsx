import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

type NavItem = { label: string; to?: string; href?: string };

const NAV: NavItem[] = [
  { label: "Início", to: "/" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Casos de uso", to: "/casos-de-uso" },
  { label: "Diagnóstico", to: "/diagnostico" },
  { label: "Insights", to: "/insights" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/60 shadow-elegant"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to!}
              className="group relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <motion.a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent("click_header_cta");
              trackEvent("whatsapp_conversion", { location: "header" });
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="btn-tri hidden text-[13px] sm:inline-grid"
          >
            <span className="inline-flex items-center gap-2">Solicitar diagnóstico</span>
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          <button
            className="lg:hidden p-2 rounded-md text-foreground"
            onClick={() => setOpen((s) => !s)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to!}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground py-1.5"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("click_header_cta", { source: "mobile" });
                  trackEvent("whatsapp_conversion", { location: "header_mobile" });
                  setOpen(false);
                }}
                className="btn-tri mt-2 w-full text-[13px] sm:hidden"
              >
                <span className="inline-flex items-center gap-2">Solicitar diagnóstico</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
