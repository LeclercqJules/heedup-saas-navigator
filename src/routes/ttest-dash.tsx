import { createFileRoute } from "@tanstack/react-router";
import { DashboardContent } from "@/components/dashboard/DashboardScreen";
import type { DashboardData } from "@/lib/dashboardData";

const data: DashboardData = {
  loading: false,
  orgName: "Atelier Martin",
  hasSurveys: true,
  effectif: { status: "ok", salaries_actifs: 11, desinscrits: 1, sollicites: 10, sous_le_seuil: false },
  rapports: [
    {
      week_start: "2026-08-24",
      respondent_count: 6,
      free_text_count: 2,
      scores: { meaning: { score: 4.17, delta: 0 }, support: { score: 3, delta: 0 }, workload: { score: 2.83, delta: 0 }, clarity: { score: 3.5, delta: 0 }, recognition: { score: 3.17, delta: 0 } },
      team_scores: {},
      synthesis: null,
      recommendations: ["Piste une.", "Piste deux."],
      needs_human_review: false,
      review_category: null,
      review_message: null,
    },
  ],
};

export const Route = createFileRoute("/ttest-dash")({ ssr: false, component: () => <DashboardContent data={data} /> });
