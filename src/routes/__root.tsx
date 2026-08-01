import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AnalyticsLoader } from "@/components/triangulo/AnalyticsLoader";
import GradualBlur from "@/components/triangulo/GradualBlur";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida. Vamos te levar de volta para o início.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-95"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente atualizar a página ou voltar para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-95"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#D92D32" },
      { property: "og:site_name", content: "Triangulo Solucions" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Triângulo Solucions | Tecnologia e Gestão em Uberaba/MG" },
      { property: "og:title", content: "Triângulo Solucions | Tecnologia e Gestão em Uberaba/MG" },
      { name: "twitter:title", content: "Triângulo Solucions | Tecnologia e Gestão em Uberaba/MG" },
      { name: "description", content: "Sistemas, automações e dashboards para empresas que querem melhorar processos, gestão e produtividade em Uberaba/MG." },
      { property: "og:description", content: "Sistemas, automações e dashboards para empresas que querem melhorar processos, gestão e produtividade em Uberaba/MG." },
      { name: "twitter:description", content: "Sistemas, automações e dashboards para empresas que querem melhorar processos, gestão e produtividade em Uberaba/MG." },
      { property: "og:image", content: "https://triangulosolutions.com.br/logo-triangulo-solutions.jpg" },
      { name: "twitter:image", content: "https://triangulosolutions.com.br/logo-triangulo-solutions.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap",
      },
      { rel: "icon", href: "/favicon-v4.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32-v4.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16-v4.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-v4.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Desfoque de borda em todo o site. Fica no root para valer em qualquer rota.
 *
 * zIndex −60 vira 40 no componente (target="page" soma 100). É proposital: o
 * Header é z-50 e o banner de cookies z-60 — acima disso o desfoque borraria a
 * própria navegação. Só nas bordas: backdrop-filter é caro e empilhá-lo em
 * cada seção derruba o scroll.
 */
function DesfoqueDeBorda() {
  return (
    <>
      <GradualBlur
        target="page"
        position="top"
        height="5rem"
        strength={1.4}
        divCount={4}
        curve="bezier"
        zIndex={-60}
      />
      <GradualBlur
        target="page"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={4}
        curve="bezier"
        exponential
        zIndex={-60}
      />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <DesfoqueDeBorda />
      <AnalyticsLoader />
    </QueryClientProvider>
  );
}
