import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard/DashboardScreen";
import { useDashboardData } from "@/lib/dashboardData";

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
      <DashboardBody />
    </AuthGuard>
  );
}

function DashboardBody() {
  const data = useDashboardData();
  if (data.loading) return <DashboardSkeleton />;
  return <DashboardContent data={data} />;
}
