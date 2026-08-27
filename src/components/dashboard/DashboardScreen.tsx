import type { CSSProperties, ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SignOutButton } from "@/components/auth/AuthGuard";
import {
  DIMENSIONS,
  formatDelta,
  formatScore,
  formatWeek,
  formatWeekShort,
  readScore,
  type DashboardData,
  type Rapport,
  type ScoreEntry,
} from "@/lib/dashboardData";

const cardStyle: CSSProperties = {
  background: "var(--bg-card)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(13,27,62,0.06), 0 1px 3px rgba(13,27,62,0.04)",
  padding: "26px 26px",
};

const blockTitleStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "20px",
  color: "var(--midnight)",
  marginBottom: "14px",
};

const mutedStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "13.5px",
  lineHeight: 1.6,
  color: "var(--text-muted)",
};

const bodyStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  lineHeight: 1.7,
  color: "var(--text-primary)",
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <div className="heedup-dash-wrap">{children}</div>
    </div>
  );
}

function TopBar({ orgName, right }: { orgName: string | null; right?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "22px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ ...mutedStyle, fontSize: "13px" }}>{orgName ?? ""}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {right}
        <SignOutButton />
      </div>
    </div>
  );
}

function ScoreRows({ scores }: { scores: Record<string, ScoreEntry> | null }) {
  return (
    <div>
      {DIMENSIONS.map((dim) => {
        const { score, delta } = readScore(scores?.[dim.key] ?? null);
        const pct = score === null ? 0 : Math.max(0, Math.min(100, (score / 5) * 100));
        return (
          <div key={dim.key} className="heedup-dash-row">
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {dim.label}
            </div>
            <div className="heedup-dash-row-data">
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14.5px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  minWidth: "62px",
                }}
              >
                {score === null ? "" : `${formatScore(score)} / 5`}
              </div>
              <div
                style={{
                  flex: 1,
                  height: "8px",
                  borderRadius: "4px",
                  background: "color-mix(in srgb, var(--text-muted) 12%, transparent)",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: `${pct}%`, height: "100%", borderRadius: "4px", background: "var(--indigo)" }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textAlign: "right",
                  minWidth: "56px",
                  whiteSpace: "nowrap",
                  color:
                    delta === null
                      ? "var(--text-muted)"
                      : delta < 0
                        ? "var(--semantic-red)"
                        : "var(--semantic-green)",
                }}
              >
                {delta === null ? "—" : formatDelta(delta)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={cardStyle}>
      <h2 style={{ ...blockTitleStyle, fontSize: "24px", marginBottom: "12px" }}>{title}</h2>
      <div style={bodyStyle}>{children}</div>
    </div>
  );
}

export function DashboardSkeleton() {
  const bar = (w: string, h = "14px", mb = "12px"): CSSProperties => ({
    width: w,
    height: h,
    marginBottom: mb,
    borderRadius: "6px",
    background: "rgba(13,27,62,0.06)",
  });
  return (
    <Shell>
      <div className="heedup-dash-skeleton">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "22px" }}>
          <div style={bar("160px", "17px", "0")} />
          <div style={bar("130px", "38px", "0")} />
        </div>
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={bar("180px", "16px")} />
          <div style={bar("300px", "30px")} />
          <div style={bar("220px", "16px", "0")} />
        </div>
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={bar("240px", "16px", "0")} />
        </div>
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={bar("200px", "22px", "18px")} />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={bar("100%", "20px", "16px")} />
          ))}
        </div>
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={bar("260px", "22px", "18px")} />
          <div style={bar("100%", "14px")} />
          <div style={bar("92%", "14px")} />
          <div style={bar("70%", "14px", "0")} />
        </div>
      </div>
    </Shell>
  );
}

function WeekSelect({ rapports, current }: { rapports: Rapport[]; current: string }) {
  const navigate = useNavigate();
  if (rapports.length < 2) return null;
  return (
    <select
      aria-label="Choisir une semaine"
      value={current}
      onChange={(e) => {
        navigate({ to: "/dashboard/rapport/$weekStart", params: { weekStart: e.target.value } });
      }}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        color: "var(--text-primary)",
        background: "var(--bg-card)",
        border: "1.5px solid rgba(13,27,62,0.12)",
        borderRadius: "8px",
        padding: "9px 12px",
        cursor: "pointer",
      }}
    >
      {rapports.map((r) => (
        <option key={r.week_start} value={r.week_start}>
          {formatWeekShort(r.week_start)}
        </option>
      ))}
    </select>
  );
}

function ReportView({
  rapport,
  data,
  hasPrevious,
}: {
  rapport: Rapport;
  data: DashboardData;
  hasPrevious: boolean;
}) {
  const { effectif, orgName, rapports } = data;
  const scores: Record<string, ScoreEntry> | null = hasPrevious
    ? rapport.scores
    : rapport.scores
      ? Object.fromEntries(
          Object.entries(rapport.scores).map(([k, v]) => {
            const { score } = readScore(v);
            return [k, { score, delta: null }];
          }),
        )
      : null;

  const teams = Object.entries(rapport.team_scores ?? {});
  const recos = rapport.recommendations ?? [];

  return (
    <Shell>
      <TopBar
        orgName={orgName}
        right={<WeekSelect rapports={rapports} current={rapport.week_start} />}
      />

      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", color: "var(--midnight)" }}>
          Rapport d'équipe
        </h1>
        <div style={{ ...mutedStyle, fontSize: "14.5px", marginTop: "6px" }}>{formatWeek(rapport.week_start)}</div>

        <div style={{ ...bodyStyle, marginTop: "18px" }}>
          {effectif && typeof effectif.sollicites === "number"
            ? `${rapport.respondent_count ?? 0} réponses sur ${effectif.sollicites} salariés sollicités`
            : `${rapport.respondent_count ?? 0} réponses`}
        </div>
        {effectif && (effectif.desinscrits ?? 0) > 0 ? (
          <div style={{ ...mutedStyle, marginTop: "6px" }}>
            {effectif.desinscrits} personnes ont choisi de ne plus recevoir le questionnaire.
          </div>
        ) : null}
        {effectif?.sous_le_seuil ? (
          <div
            style={{
              marginTop: "16px",
              background: "var(--bg-card)",
              border: "1.5px solid color-mix(in srgb, var(--text-muted) 30%, transparent)",
              borderRadius: "12px",
              padding: "14px 16px",
              ...bodyStyle,
              fontSize: "14px",
            }}
          >
            Votre effectif sollicité est passé sous cinq personnes. En dessous de ce seuil, aucun nouveau rapport ne
            pourra être produit.
          </div>
        ) : null}
      </div>

      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <ScoreRows scores={scores} />
      </div>

      {rapport.needs_human_review && rapport.review_message ? (
        <div
          style={{
            ...cardStyle,
            marginBottom: "20px",
            borderLeft: "3px solid var(--midnight)",
            padding: "28px 30px",
          }}
        >
          <h2 style={blockTitleStyle}>Point de vigilance</h2>
          <p style={bodyStyle}>{rapport.review_message}</p>
        </div>
      ) : null}

      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h2 style={blockTitleStyle}>Ce qui ressort des commentaires</h2>
        {rapport.synthesis ? (
          <p style={bodyStyle}>{rapport.synthesis}</p>
        ) : (
          <p style={{ ...bodyStyle, color: "var(--text-muted)" }}>
            Pas de synthèse cette semaine. Il faut au moins cinq commentaires libres pour en produire une.
          </p>
        )}
        <div style={{ ...mutedStyle, marginTop: "14px" }}>
          Vous recevez une synthèse collective. Les commentaires individuels ne sont pas accessibles depuis votre
          espace.
        </div>
      </div>

      {recos.length > 0 ? (
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2 style={blockTitleStyle}>Pistes d'action</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recos.map((reco, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--indigo)",
                    lineHeight: 1.7,
                  }}
                >
                  {i + 1}.
                </div>
                <p style={bodyStyle}>{reco}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {teams.length > 0 ? (
        <div style={{ ...cardStyle, marginBottom: "20px" }}>
          <h2 style={blockTitleStyle}>Scores par équipe</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {teams.map(([id, team]) => (
              <div
                key={id}
                style={{
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderRadius: "12px",
                  padding: "18px 18px 6px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--midnight)",
                  }}
                >
                  {team.team_name ?? ""}
                </div>
                <div style={{ ...mutedStyle, marginBottom: "12px" }}>{team.respondent_count ?? 0} réponses</div>
                <ScoreRows
                  scores={
                    hasPrevious
                      ? (team.scores ?? null)
                      : team.scores
                        ? Object.fromEntries(
                            Object.entries(team.scores).map(([k, v]) => [k, { score: readScore(v).score, delta: null }]),
                          )
                        : null
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Shell>
  );
}

export function DashboardContent({ data, weekStart }: { data: DashboardData; weekStart?: string | null }) {
  const { rapports, effectif, orgName, hasSurveys } = data;

  // Semaine explicitement demandée
  if (weekStart !== undefined && weekStart !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return (
        <Shell>
          <TopBar orgName={orgName} />
          <EmptyCard title="Semaine introuvable">
            <p>Ce lien ne correspond pas à une semaine valide.</p>
            {rapports.length > 0 ? (
              <p style={{ marginTop: "14px" }}>
                <Link to="/dashboard" style={{ color: "var(--indigo)", fontWeight: 600 }}>
                  Voir le dernier rapport disponible
                </Link>
              </p>
            ) : null}
          </EmptyCard>
        </Shell>
      );
    }
    const index = rapports.findIndex((r) => r.week_start === weekStart);
    if (index === -1) {
      return (
        <Shell>
          <TopBar orgName={orgName} />
          <EmptyCard title="Pas de rapport pour cette semaine">
            <p>
              Moins de cinq réponses complètes ont été enregistrées cette semaine. Aucun score n'est produit en dessous
              de ce seuil.
            </p>
            {rapports.length > 0 ? (
              <p style={{ marginTop: "14px" }}>
                <Link to="/dashboard" style={{ color: "var(--indigo)", fontWeight: 600 }}>
                  Voir le dernier rapport disponible
                </Link>
              </p>
            ) : null}
          </EmptyCard>
        </Shell>
      );
    }
    return <ReportView rapport={rapports[index]} data={data} hasPrevious={index < rapports.length - 1} />;
  }

  if (rapports.length === 0) {
    if (!hasSurveys) {
      return (
        <Shell>
          <TopBar orgName={orgName} />
          <EmptyCard title="Votre premier rapport arrive bientôt">
            <p>
              Vos salariés recevront leur premier questionnaire vendredi matin. Votre rapport d'équipe sera disponible
              ici le lundi suivant.
            </p>
          </EmptyCard>
        </Shell>
      );
    }
    return (
      <Shell>
        <TopBar orgName={orgName} />
        <EmptyCard title="Pas encore de rapport">
          <p>
            Un rapport est produit à partir de cinq réponses complètes sur une même semaine. Ce seuil garantit que
            personne ne peut être identifié à partir des moyennes.
          </p>
          <p style={{ marginTop: "14px" }}>
            Vos salariés ont reçu le questionnaire, mais le nombre de réponses n'a pas encore atteint ce seuil.
          </p>
          {effectif?.sous_le_seuil ? (
            <p style={{ marginTop: "14px" }}>
              Votre effectif sollicité est actuellement de {effectif.sollicites ?? 0} personnes. En dessous de cinq,
              aucun rapport ne peut être produit.
            </p>
          ) : null}
        </EmptyCard>
      </Shell>
    );
  }

  return <ReportView rapport={rapports[0]} data={data} hasPrevious={rapports.length > 1} />;
}
