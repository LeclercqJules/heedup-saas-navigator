import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardContent, DashboardSkeleton } from "@/components/dashboard/DashboardScreen";
import { useDashboardData } from "@/lib/dashboardData";

export const Route = createFileRoute("/dashboard_/rapport/$weekStart")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Rapport d'équipe · HeedUp" },
      { name: "description", content: "Votre rapport d'équipe hebdomadaire HeedUp." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Rapport d'équipe · HeedUp" },
      { property: "og:description", content: "Votre rapport d'équipe hebdomadaire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RapportPage,
});

function RapportPage() {
  const { weekStart } = Route.useParams();
  return (
    <AuthGuard>
      <RapportBody weekStart={weekStart} />
    </AuthGuard>
  );
}

function RapportBody({ weekStart }: { weekStart: string }) {
  const data = useDashboardData();
  if (data.loading) return <DashboardSkeleton />;
  return <DashboardContent data={data} weekStart={weekStart} />;
}
