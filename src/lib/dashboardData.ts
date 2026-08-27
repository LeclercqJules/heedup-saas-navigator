import { useEffect, useState } from "react";
import { heedupClient } from "@/config/heedupClient";

export const DIMENSIONS = [
  { key: "workload", label: "Charge de travail" },
  { key: "recognition", label: "Reconnaissance" },
  { key: "clarity", label: "Clarté" },
  { key: "support", label: "Soutien" },
  { key: "meaning", label: "Sens" },
] as const;

export type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export type ScoreEntry = { score?: number | null; delta?: number | null } | number | null;

export type TeamScore = {
  team_name?: string | null;
  respondent_count?: number | null;
  scores?: Record<string, ScoreEntry> | null;
};

export type Rapport = {
  week_start: string;
  respondent_count: number | null;
  free_text_count: number | null;
  scores: Record<string, ScoreEntry> | null;
  team_scores: Record<string, TeamScore> | null;
  synthesis: string | null;
  recommendations: string[] | null;
  needs_human_review: boolean | null;
  review_category: string | null;
  review_message: string | null;
};

export type Effectif = {
  status?: string;
  salaries_actifs?: number;
  desinscrits?: number;
  sollicites?: number;
  sous_le_seuil?: boolean;
} | null;

export type DashboardData = {
  loading: boolean;
  rapports: Rapport[];
  effectif: Effectif;
  orgName: string | null;
  hasSurveys: boolean;
};

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** Formate une date calendaire YYYY-MM-DD sans jamais construire d'objet Date. */
export function formatWeek(weekStart: string): string {
  const [y, m, d] = weekStart.split("-");
  const day = String(Number(d));
  const month = MOIS[Number(m) - 1] ?? "";
  return `Semaine du ${day} ${month} ${y}`;
}

export function formatWeekShort(weekStart: string): string {
  const [y, m, d] = weekStart.split("-");
  return `${String(Number(d))} ${MOIS[Number(m) - 1] ?? ""} ${y}`;
}

export function formatScore(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

export function formatDelta(value: number): string {
  const arrow = value < 0 ? "▼" : "▲";
  return `${arrow} ${Math.abs(value).toFixed(1).replace(".", ",")}`;
}

export function readScore(entry: ScoreEntry): { score: number | null; delta: number | null } {
  if (entry === null || entry === undefined) return { score: null, delta: null };
  if (typeof entry === "number") return { score: entry, delta: null };
  const score = typeof entry.score === "number" ? entry.score : null;
  const delta = typeof entry.delta === "number" ? entry.delta : null;
  return { score, delta };
}

export function useDashboardData(): DashboardData {
  const [state, setState] = useState<DashboardData>({
    loading: true,
    rapports: [],
    effectif: null,
    orgName: null,
    hasSurveys: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [rapportsRes, effectifRes, orgRes, surveysRes] = await Promise.all([
        heedupClient
          .from("reports")
          .select(
            "week_start, respondent_count, free_text_count, scores, team_scores, synthesis, recommendations, needs_human_review, review_category, review_message",
          )
          .order("week_start", { ascending: false }),
        heedupClient.rpc("compter_desinscrits"),
        heedupClient.from("organizations").select("name").maybeSingle(),
        heedupClient.from("surveys").select("week_start").order("week_start", { ascending: false }).limit(1),
      ]);

      if (cancelled) return;

      const effectifRaw = (effectifRes.data ?? null) as Effectif;
      const effectif = !effectifRes.error && effectifRaw && effectifRaw.status !== "error" ? effectifRaw : null;

      setState({
        loading: false,
        rapports: ((rapportsRes.data ?? []) as Rapport[]).slice(),
        effectif,
        orgName: (orgRes.data as { name?: string } | null)?.name ?? null,
        hasSurveys: Array.isArray(surveysRes.data) && surveysRes.data.length > 0,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
