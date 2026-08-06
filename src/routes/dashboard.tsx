import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard, SignOutButton } from "@/components/auth/AuthGuard";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Tableau de bord · HeedUp" },
      { name: "description", content: "Votre espace HeedUp : rapports d'équipe et suivi hebdomadaire." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Tableau de bord · HeedUp" },
      { property: "og:description", content: "Votre espace HeedUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AuthGuard>
      <div style={{ minHeight: "100vh", background: "var(--bg-main)", padding: "40px 5%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "var(--midnight)", letterSpacing: "-0.5px" }}>
            Tableau de bord
          </h1>
          <SignOutButton />
        </div>
      </div>
    </AuthGuard>
  );
}
