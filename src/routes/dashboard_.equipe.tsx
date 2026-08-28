import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { EquipeContent } from "@/components/dashboard/EquipeScreen";

export const Route = createFileRoute("/dashboard_/equipe")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Votre équipe · HeedUp" },
      { name: "description", content: "Gérez les salariés qui reçoivent le questionnaire hebdomadaire." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Votre équipe · HeedUp" },
      { property: "og:description", content: "Gérez les salariés de votre organisation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EquipePage,
});

function EquipePage() {
  return (
    <AuthGuard>
      <EquipeContent />
    </AuthGuard>
  );
}
