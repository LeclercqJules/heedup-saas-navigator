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
import { SiteLayout } from "../components/SiteLayout";

function NotFoundComponent() {
  return (
    <SiteLayout>
      <section
        style={{
          background: "var(--bg-main)",
          padding: "80px 5%",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "96px",
              color: "var(--indigo)",
              opacity: 0.3,
              lineHeight: 1,
              marginBottom: 0,
            }}
          >
            404
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "var(--midnight)",
              letterSpacing: "-0.5px",
              marginBottom: "12px",
            }}
          >
            Cette page n'existe pas.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
              color: "var(--text-muted)",
              marginBottom: "32px",
              lineHeight: 1.6,
            }}
          >
            Vous avez peut-être suivi un lien incorrect. La page que vous cherchez a peut-être bougé.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              background: "var(--indigo)",
              color: "#FFFFFF",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
            }}
          >
            Retour à l'accueil →
          </Link>
        </div>
      </section>
    </SiteLayout>
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
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { title: "HeedUp · PME : pilotez votre équipe, prévenez le turnover" },
      {
        name: "description",
        content:
          "Prévenez le turnover dans votre PME. HeedUp envoie 5 questions anonymes chaque vendredi et génère un rapport d'équipe IA chaque lundi. Sans équipe RH. Dès 50€/m",
      },
      { name: "author", content: "HeedUp" },
      { property: "og:title", content: "HeedUp · PME : pilotez votre équipe, prévenez le turnover" },
      {
        property: "og:description",
        content:
          "Prévenez le turnover dans votre PME. HeedUp envoie 5 questions anonymes chaque vendredi et génère un rapport d'équipe IA chaque lundi. Sans équipe RH. Dès 50€/m",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HeedUp · PME : pilotez votre équipe, prévenez le turnover" },
      { name: "twitter:description", content: "Prévenez le turnover dans votre PME. HeedUp envoie 5 questions anonymes chaque vendredi et génère un rapport d'équipe IA chaque lundi. Sans équipe RH. Dès 50€/m" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f41cc2e0-94d9-42d4-ad99-7cc08c9d9913/id-preview-493bea72--b890eb7b-6a90-4da1-a574-dc1e667673bf.lovable.app-1784641473692.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f41cc2e0-94d9-42d4-ad99-7cc08c9d9913/id-preview-493bea72--b890eb7b-6a90-4da1-a574-dc1e667673bf.lovable.app-1784641473692.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      { src: "https://tally.so/widgets/embed.js", async: true },
      { src: "https://plausible.io/js/pa-CIDeiK1v6ZROoW7xZv8u9.js", async: true },
      {
        children:
          "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()",
      },
    ],

  }),


  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
