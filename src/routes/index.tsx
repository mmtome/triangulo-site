import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/triangulo/Header";
import { Footer } from "@/components/triangulo/Sections";
import {
  Hero,
  Contraste,
  Metodo,
  Promessa,
  Diferenciais,
  Credo,
  Assinatura,
  ChamadaFinal,
} from "@/components/triangulo/Home";
import { CookieBanner } from "@/components/triangulo/CookieBanner";
import { InstagramFeed } from "@/components/triangulo/InstagramFeed";
import { SITE } from "@/lib/site";

const TITLE = `${SITE.name} | Tecnologia e Gestão em ${SITE.city}/${SITE.region}`;
const META_DESC =
  "Sistemas, automações e dashboards para empresas que querem melhorar processos, gestão e produtividade em Uberaba/MG.";
const KEYWORDS =
  "soluções digitais Uberaba, desenvolvimento de sistemas Uberaba, automação de processos Uberaba, software para gestão Uberaba, empresa de tecnologia Uberaba, sistemas personalizados Uberaba, Triângulo Mineiro tecnologia, consultoria em processos Uberaba, dashboards Uberaba";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: META_DESC },
      { name: "keywords", content: KEYWORDS },
      { name: "author", content: SITE.name },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: META_DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: "https://triangulosolutions.com.br/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: META_DESC },
    ],
    links: [{ rel: "canonical", href: "https://triangulosolutions.com.br/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: SITE.name,
          description: SITE.description,
          areaServed: [SITE.city, SITE.area, "Minas Gerais"],
          address: {
            "@type": "PostalAddress",
            addressLocality: SITE.city,
            addressRegion: SITE.region,
            addressCountry: "BR",
          },
          serviceType: [
            "Desenvolvimento de sistemas personalizados",
            "Automação de processos",
            "Dashboards e indicadores",
            "Soluções digitais para gestão de negócios",
            "MicroSaaS sob medida",
            "Integração de dados e operação",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Contraste />
        <Metodo />
        <Promessa />
        <Diferenciais />
        <Credo />
        <ChamadaFinal />
        <Assinatura />
      </main>
      <InstagramFeed />
      <Footer />
      <CookieBanner />
    </div>
  );
}
