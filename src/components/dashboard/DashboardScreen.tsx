import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { DashTopBar } from "@/components/dashboard/DashNav";
import { heedupClient } from "@/config/heedupClient";
import {
  DIMENSIONS,
  formatDelta,
  formatScore,
  formatWeek,
  formatWeekPill,
  readScore,
  type DashboardData,
  type Effectif,
  type Rapport,
  type ScoreEntry,
} from "@/lib/dashboardData";

const cardStyle: CSSProperties = {
  background: "var(--bg-card)",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(13,27,62,0.06), 0 1px 3px rgba(13,27,62,0.04)",
  padding: "26px 26px",
};

const primaryLinkStyle: CSSProperties = {
  display: "inline-block",
  background: "var(--indigo)",
  color: "#FFFFFF",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  fontWeight: 700,
  borderRadius: "8px",
  padding: "13px 28px",
  textDecoration: "none",
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

function Shell({
  orgName,
  narrow = false,
  children,
}: {
  orgName?: string | null;
  narrow?: boolean;
  children: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <DashTopBar orgName={orgName} />
      <div className={narrow ? "heedup-dash-wrap heedup-dash-wrap--narrow" : "heedup-dash-wrap"}>{children}</div>
    </div>
  );
}

/** Un antécédent valable est un rapport antérieur dont scores n'est pas null. */
function hasValidPrevious(rapports: Rapport[], index: number): boolean {
  for (let i = index + 1; i < rapports.length; i += 1) {
    if (rapports[i].scores) return true;
  }
  return false;
}

function ScoreRows({
  scores,
  showDeltas,
  highlight = true,
}: {
  scores: Record<string, ScoreEntry> | null;
  showDeltas: boolean;
  highlight?: boolean;
}) {
  let highlightKey: string | null = null;
  if (highlight && showDeltas && scores) {
    let worst = 0;
    DIMENSIONS.forEach((dim) => {
      const { delta } = readScore(scores[dim.key] ?? null);
      if (delta !== null && delta < worst) {
        worst = delta;
        highlightKey = dim.key;
      }
    });
  }

  return (
    <div>
      {DIMENSIONS.map((dim) => {
        const { score, delta: rawDelta } = readScore(scores?.[dim.key] ?? null);
        const delta = showDeltas ? rawDelta : null;
        const pct = score === null ? 0 : Math.max(0, Math.min(100, (score / 5) * 100));
        const isHighlighted = highlightKey === dim.key;
        return (
          <div
            key={dim.key}
            className="heedup-dash-row"
            style={
              isHighlighted
                ? { borderLeft: "3px solid var(--indigo)", paddingLeft: "13px" }
                : { borderLeft: "3px solid transparent", paddingLeft: "13px" }
            }
          >
            <div
              className="heedup-dash-row-label"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                fontWeight: isHighlighted ? 600 : 500,
                color: "var(--text-primary)",
              }}
            >
              {dim.label}
            </div>
            <div className="heedup-dash-row-bar">
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: "var(--indigo)" }} />
            </div>
            <div className="heedup-dash-row-value">{score === null ? "" : formatScore(score)}</div>
            <div
              className="heedup-dash-row-delta"
              style={{
                color:
                  delta === null
                    ? "var(--text-muted)"
                    : delta < 0
                      ? "var(--semantic-red)"
                      : "var(--semantic-green)",
              }}
            >
              {delta === null ? "–" : formatDelta(delta)}
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
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <DashTopBar />
      <div className="heedup-dash-wrap heedup-dash-wrap--narrow heedup-dash-skeleton">
        <div style={{ display: "flex", gap: "8px" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={bar("92px", "34px", "0")} />
          ))}
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(13,27,62,0.06), 0 1px 3px rgba(13,27,62,0.04)",
            overflow: "hidden",
            marginTop: "32px",
            marginBottom: "20px",
            paddingBottom: "28px",
          }}
        >
          <div style={{ background: "var(--midnight)", height: "56px", borderRadius: "16px 16px 0 0" }} />
          <div style={{ padding: "18px 28px 0" }}>
            <div style={bar("300px", "14px", "0")} />
          </div>
          <div style={{ padding: "24px 28px 0" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={bar("100%", "20px", i === 4 ? "0" : "24px")} />
            ))}
          </div>
          <div style={{ padding: "28px 28px 0" }}>
            <div style={bar("140px", "12px", "16px")} />
            <div style={bar("100%", "46px", "10px")} />
            <div style={bar("100%", "46px", "0")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function participationLine(rapport: Rapport, effectif: Effectif): string {
  const n = rapport.respondent_count ?? 0;
  const rep = n === 1 ? "1 réponse" : `${n} réponses`;
  const sollicites = effectif && typeof effectif.sollicites === "number" ? effectif.sollicites : null;
  return sollicites === null
    ? rep
    : `${rep} sur ${sollicites} ${sollicites === 1 ? "salarié sollicité" : "salariés sollicités"}`;
}

function WeekStrip({ rapports, current }: { rapports: Rapport[]; current: string }) {
  const navigate = useNavigate();
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [current]);

  if (rapports.length < 2) return null;

  const ordered = rapports.slice().sort((a, b) => (a.week_start < b.week_start ? -1 : 1));

  return (
    <div className="heedup-dash-strip">
      {ordered.map((r) => {
        const isCurrent = r.week_start === current;
        const isBelow = r.below_threshold === true;
        const base: CSSProperties = {
          flex: "0 0 auto",
          fontFamily: "var(--font-sans)",
          fontSize: "13.5px",
          fontWeight: isCurrent ? 600 : 500,
          borderRadius: "20px",
          padding: "8px 16px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "border-color 0.2s ease, background 0.2s ease, color 0.2s ease",
        };
        const variant: CSSProperties = isCurrent
          ? { background: "var(--indigo)", color: "#FFFFFF", border: "1px solid var(--indigo)" }
          : isBelow
            ? {
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px dashed color-mix(in srgb, var(--text-muted) 20%, transparent)",
              }
            : {
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid color-mix(in srgb, var(--text-muted) 20%, transparent)",
              };
        return (
          <button
            key={r.week_start}
            type="button"
            ref={isCurrent ? activeRef : undefined}
            aria-current={isCurrent ? "true" : undefined}
            onClick={() => navigate({ to: "/dashboard/rapport/$weekStart", params: { weekStart: r.week_start } })}
            style={{ ...base, ...variant }}
            onMouseEnter={(e) => {
              if (!isCurrent) e.currentTarget.style.borderColor = "var(--indigo)";
            }}
            onMouseLeave={(e) => {
              if (!isCurrent) {
                e.currentTarget.style.borderColor = "color-mix(in srgb, var(--text-muted) 20%, transparent)";
              }
            }}
          >
            {formatWeekPill(r.week_start)}
          </button>
        );
      })}
    </div>
  );
}

function SousLeSeuilCard({ effectif }: { effectif: Effectif }) {
  if (!effectif?.sous_le_seuil) return null;
  return (
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
      Votre effectif sollicité est passé sous cinq personnes. En dessous de ce seuil, aucun nouveau rapport ne pourra
      être produit.
    </div>
  );
}

function BelowThresholdView({ rapport, data }: { rapport: Rapport; data: DashboardData }) {
  const { orgName, effectif, rapports } = data;
  const recos = rapport.recommendations ?? [];
  return (
    <Shell orgName={orgName}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "var(--midnight)" }}>
          Rapport d'équipe
        </h1>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: "16px", color: "var(--text-muted)", marginTop: "6px" }}>
          {formatWeek(rapport.week_start)}
        </div>
      </div>

      <WeekStrip rapports={rapports} current={rapport.week_start} />
      <SousLeSeuilCard effectif={effectif} />

      <div style={{ ...cardStyle, marginTop: "32px", marginBottom: "20px" }}>
        <h2 style={{ ...blockTitleStyle, fontSize: "24px", marginBottom: "12px" }}>Pas de rapport pour cette semaine</h2>
        <p style={bodyStyle}>
          Un rapport a besoin d'au moins cinq réponses complètes. En dessous de ce seuil, rien n'est publié : une
          moyenne cesse alors de protéger les personnes qui la composent.
        </p>
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
    </Shell>
  );
}

const eyebrowStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  color: "var(--text-muted)",
  marginBottom: "16px",
};

function Separator() {
  return (
    <div
      style={{
        borderTop: "1px solid color-mix(in srgb, var(--text-muted) 10%, transparent)",
        margin: "24px 28px 0",
      }}
    />
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
  const teams = Object.entries(rapport.team_scores ?? {});
  const recos = rapport.recommendations ?? [];

  return (
    <Shell orgName={orgName} narrow>
      <WeekStrip rapports={rapports} current={rapport.week_start} />
      <SousLeSeuilCard effectif={effectif} />

      <div style={{ height: "32px" }} />

      {rapport.provisoire ? (
        <div
          style={{
            background: "var(--indigo-pale)",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            fontFamily: "var(--font-sans)",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--text-primary)",
          }}
        >
          Rapport provisoire. Il a été produit dès les cinq premières réponses, et sera complété lundi si d'autres
          arrivent d'ici là.
        </div>
      ) : null}

      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(13,27,62,0.06), 0 1px 3px rgba(13,27,62,0.04)",
          overflow: "hidden",
          marginBottom: "20px",
          paddingBottom: "28px",
        }}
      >
        <div className="heedup-report-banner">
          <span
            aria-hidden="true"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--indigo)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "16px", fontWeight: 600, color: "#FFFFFF" }}>
            Rapport d'équipe · {formatWeek(rapport.week_start)}
          </span>
        </div>

        <div style={{ padding: "18px 28px 0", fontFamily: "var(--font-sans)", fontSize: "14px", color: "var(--text-muted)" }}>
          {orgName ? `${orgName} · ` : ""}
          {participationLine(rapport, effectif)}
        </div>

        <div style={{ padding: "22px 28px 0" }}>
          <ScoreRows scores={rapport.scores} showDeltas={hasPrevious} />
        </div>

        {recos.length > 0 ? (
          <>
            <Separator />
            <div style={{ padding: "24px 28px 0" }}>
              <div style={eyebrowStyle}>Pistes d'action</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recos.map((reco, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--indigo-pale)",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "var(--indigo)",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans)",
                        fontSize: "12px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {i + 1}
                    </div>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.5, color: "var(--text-primary)" }}>
                      {reco}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {rapport.needs_human_review && rapport.review_message ? (
          <>
            <Separator />
            <div style={{ padding: "24px 28px 0" }}>
              <div
                style={{
                  background: "var(--indigo-pale)",
                  borderLeft: "3px solid var(--midnight)",
                  borderRadius: "10px",
                  padding: "18px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: "18px", lineHeight: 1.3, color: "var(--midnight)", flexShrink: 0 }}>
                  ⚠
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--midnight)",
                      marginBottom: "8px",
                    }}
                  >
                    Point de vigilance
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.6, color: "var(--text-primary)" }}>
                    {rapport.review_message}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <Separator />
        <div style={{ padding: "24px 28px 0" }}>
          <div style={eyebrowStyle}>Ce qui ressort des commentaires</div>
          {rapport.synthesis ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.65, color: "var(--text-primary)" }}>
              {rapport.synthesis}
            </p>
          ) : (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "15px", lineHeight: 1.65, color: "var(--text-muted)" }}>
              Pas de synthèse cette semaine. Il faut au moins cinq commentaires libres pour en produire une.
            </p>
          )}
          <div style={{ ...mutedStyle, fontSize: "13px", marginTop: "14px" }}>
            Vous recevez une synthèse collective. Les commentaires individuels ne sont pas accessibles depuis votre
            espace.
          </div>
        </div>

        {teams.length > 0 ? (
          <>
            <Separator />
            <div style={{ padding: "24px 28px 0" }}>
              <div style={eyebrowStyle}>Par équipe</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {teams.map(([id, team]) => (
                  <div key={id}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "var(--midnight)",
                        }}
                      >
                        {team.team_name ?? ""}
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-muted)" }}>
                        {(team.respondent_count ?? 0) === 1 ? "1 réponse" : `${team.respondent_count ?? 0} réponses`}
                      </span>
                    </div>
                    <ScoreRows scores={team.scores ?? null} showDeltas={hasPrevious} highlight={false} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </Shell>
  );
}

function LaunchCard({ data }: { data: DashboardData }) {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEquipeLink, setShowEquipeLink] = useState(false);

  const launch = async () => {
    setSending(true);
    setNotice(null);
    setErrorMessage(null);
    setShowEquipeLink(false);
    try {
      const { data: result, error } = await heedupClient.functions.invoke("send-first-survey");
      const message =
        typeof (result as { message?: unknown } | null)?.message === "string"
          ? ((result as { message: string }).message.toLowerCase().replace(/\.$/, "") as string)
          : "";

      if (!error && (result as { status?: unknown } | null)?.status === "ok") {
        const n = (result as { sent_count?: unknown } | null)?.sent_count;
        setNotice(
          typeof n === "number" && n > 1 ? `Le questionnaire est parti à ${n} salariés.` : "Le questionnaire est parti.",
        );
        data.reload();
        return;
      }

      if (message.includes("déjà été envoyée")) {
        data.reload();
        return;
      }
      if (message.includes("aucun salarié à solliciter")) {
        setErrorMessage("Aucun salarié ne peut être sollicité pour le moment. Vérifiez la liste de votre équipe.");
        setShowEquipeLink(true);
        return;
      }
      if (message.includes("n'est pas actif")) {
        setErrorMessage((result as { message: string }).message);
        return;
      }
      if (message.includes("aucune organisation n'est rattachée")) {
        navigate({ to: "/onboarding" });
        return;
      }
      setErrorMessage("Une erreur est survenue. Réessayez dans quelques instants.");
    } catch {
      setErrorMessage("Une erreur est survenue. Réessayez dans quelques instants.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Shell orgName={data.orgName}>
      <div style={cardStyle}>
        <h2 style={{ ...blockTitleStyle, fontSize: "24px", marginBottom: "12px" }}>Lancez votre premier questionnaire</h2>
        <div style={bodyStyle}>
          Vos salariés sont enregistrés. Le questionnaire partira automatiquement vendredi à 9h, ou dès maintenant si
          vous le souhaitez.
        </div>
        <div style={{ marginTop: "22px" }}>
          <button
            type="button"
            onClick={launch}
            disabled={sending}
            style={{
              ...primaryLinkStyle,
              border: "none",
              cursor: sending ? "default" : "pointer",
              opacity: sending ? 0.7 : 1,
            }}
          >
            {sending ? "Envoi en cours…" : "Lancer maintenant"}
          </button>
        </div>
        {notice ? <div style={{ ...bodyStyle, marginTop: "16px" }}>{notice}</div> : null}
        {errorMessage ? (
          <div style={{ ...bodyStyle, marginTop: "16px" }}>
            {errorMessage}
            {showEquipeLink ? (
              <>
                {" "}
                <Link to="/dashboard/equipe" style={{ color: "var(--indigo)", fontWeight: 600 }}>
                  Voir mon équipe
                </Link>
              </>
            ) : null}
          </div>
        ) : null}
        <div style={{ ...mutedStyle, marginTop: "14px" }}>
          Vos salariés ont 48 heures pour répondre. Prenez le temps de les prévenir avant de lancer.
        </div>
      </div>
    </Shell>
  );
}

export function DashboardContent({ data, weekStart }: { data: DashboardData; weekStart?: string | null }) {
  const { rapports, effectif, orgName, hasSurveys, employeeCount } = data;

  // Semaine explicitement demandée
  if (weekStart !== undefined && weekStart !== null) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return (
        <Shell orgName={orgName}>
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
        <Shell orgName={orgName}>
          <EmptyCard title="Pas de rapport pour cette semaine">
            <p>
              Un rapport a besoin d'au moins cinq réponses complètes. En dessous de ce seuil, rien n'est publié : une
              moyenne cesse alors de protéger les personnes qui la composent.
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
    if (rapports[index].below_threshold === true) {
      return <BelowThresholdView rapport={rapports[index]} data={data} />;
    }
    return <ReportView rapport={rapports[index]} data={data} hasPrevious={hasValidPrevious(rapports, index)} />;
  }

  if (rapports.length === 0) {
    if (!hasSurveys) {
      if (employeeCount === 0) {
        return (
          <Shell orgName={orgName}>
            <div style={cardStyle}>
              <h2 style={{ ...blockTitleStyle, fontSize: "24px", marginBottom: "12px" }}>Il reste une étape</h2>
              <div style={bodyStyle}>
                Votre espace est créé, mais aucun salarié n'y est encore rattaché. Personne ne recevra de questionnaire
                tant que votre équipe n'est pas ajoutée.
              </div>
              <div style={{ marginTop: "22px" }}>
                <Link to="/dashboard/equipe" style={primaryLinkStyle}>
                  Ajouter mon équipe
                </Link>
              </div>
            </div>
          </Shell>
        );
      }
      return <LaunchCard data={data} />;
    }
    return (
      <Shell orgName={orgName}>
        <EmptyCard title="Votre rapport est en préparation">
          <p>
            Vos salariés ont reçu le questionnaire. Votre rapport sera disponible dès que cinq réponses complètes
            seront arrivées.
          </p>
          <p style={{ marginTop: "14px" }}>
            Ce seuil garantit que personne ne peut être identifié à partir des moyennes.
          </p>
          <SousLeSeuilCard effectif={effectif} />
        </EmptyCard>
      </Shell>
    );
  }

  if (rapports[0].below_threshold === true) {
    return <BelowThresholdView rapport={rapports[0]} data={data} />;
  }
  return <ReportView rapport={rapports[0]} data={data} hasPrevious={hasValidPrevious(rapports, 0)} />;
}
