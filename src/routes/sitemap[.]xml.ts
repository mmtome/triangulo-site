import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SERVICES } from "@/lib/services";
import { ARTICLES } from "@/lib/insights";
import { USE_CASES } from "@/lib/use-cases";

const BASE_URL = "https://triangulosolutions.com.br";

type Entry = {
  path: string;
  lastmod?: string;
};

// Páginas institucionais e serviços: sem <lastmod> — não há fonte real
// e mantida de data de modificação para essas rotas.
const staticEntries: Entry[] = [
  { path: "/" },
  { path: "/solucoes" },
  { path: "/diagnostico" },
  { path: "/casos-de-uso" },
  { path: "/sobre" },
  { path: "/contato" },
  { path: "/insights" },
  { path: "/politica-de-privacidade" },
];

const serviceEntries: Entry[] = SERVICES.map((s) => ({
  path: `/${s.slug}`,
}));

// Insights: <lastmod> = updatedAt (fallback publishedAt).
const articleEntries: Entry[] = ARTICLES.map((a) => ({
  path: `/insights/${a.slug}`,
  lastmod: (a.updatedAt ?? a.publishedAt).slice(0, 10),
}));

// Casos de uso: <lastmod> = dateModified.
const useCaseEntries: Entry[] = USE_CASES.map((u) => ({
  path: `/casos-de-uso/${u.slug}`,
  lastmod: u.dateModified.slice(0, 10),
}));

const entries: Entry[] = [
  ...staticEntries,
  ...serviceEntries,
  ...articleEntries,
  ...useCaseEntries,
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
