import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePage } from "@/components/triangulo/ServicePage";
import { getService, SITE_URL } from "@/lib/services";
import { breadcrumbJsonLd } from "@/components/triangulo/Breadcrumbs";
import { faqJsonLd } from "@/components/triangulo/FAQ";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/$serviceSlug")({
  loader: ({ params }) => {
    const service = getService(params.serviceSlug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData?.service) return { meta: [{ title: "Página não encontrada" }] };
    const s = loaderData.service;
    const url = `${SITE_URL}/${params.serviceSlug}`;
    return {
      meta: [
        { title: s.title },
        { name: "description", content: s.description },
        { name: "robots", content: "index,follow,max-image-preview:large" },
        { property: "og:title", content: s.title },
        { property: "og:description", content: s.description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: s.title },
        { name: "twitter:description", content: s.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.shortName,
            description: s.description,
            provider: {
              "@type": "ProfessionalService",
              name: SITE.name,
              areaServed: [SITE.city, SITE.area, "Minas Gerais"],
              address: {
                "@type": "PostalAddress",
                addressLocality: SITE.city,
                addressRegion: SITE.region,
                addressCountry: "BR",
              },
            },
            areaServed: [SITE.city, SITE.area],
            serviceType: s.shortName,
            url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqJsonLd(s.faq)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd(
              [
                { label: "Início", href: "/" },
                { label: "Soluções", href: "/solucoes" },
                { label: s.shortName, href: `/${params.serviceSlug}` },
              ],
              SITE_URL,
            ),
          ),
        },
      ],
    };
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const { service } = Route.useLoaderData();
  return <ServicePage service={service} />;
}
