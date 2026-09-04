import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Reco = { type: "positive" | "decline" | "alert"; text: string };

type Scenario = {
  button: string;
  contexte: string;
  total: number;
  respondents: number;
  date: string;
  week: string;
  scores: { label: string; avg: number; delta: number }[];
  recos: Reco[];
  raw: string[];
  needsReview: boolean;
  reviewTitle?: string;
  reviewBody?: string;
  synthesis?: string;
  belowThreshold?: boolean;
  belowThresholdNote?: string;
};

const SCENARIO_SLUGS = [
  "surcharge",
  "reconnaissance",
  "tensions",
  "sereine",
  "seuil",
];

const scenarios: Scenario[] = [
  {
    button: "Alerte surcharge",
    contexte: "Restaurant bistronomique",
    total: 18,
    respondents: 11,
    date: "Lundi 27 juillet",
    week: "Semaine 31",
    scores: [
      { label: "Charge de travail", avg: 2.1, delta: -1.1 },
      { label: "Reconnaissance", avg: 3.0, delta: -0.3 },
      { label: "Clarté", avg: 3.6, delta: 0.0 },
      { label: "Soutien", avg: 2.8, delta: -0.5 },
      { label: "Sens", avg: 3.4, delta: -0.1 },
    ],
    recos: [
      { type: "decline", text: "Charge de travail en chute (-1.1) cette semaine. Revoyez le planning pour garantir un repos complet avant la fin du mois." },
      { type: "decline", text: "Soutien perçu en recul (-0.5), lié au sous-effectif ressenti en cuisine. Un renfort temporaire peut alléger la pression dès cette semaine." },
      { type: "alert", text: "7 employés n'ont pas répondu cette semaine. En période de rush, le silence peut aussi être un signal de fatigue." },
    ],
    raw: [
      "On enchaîne les services sans vraie pause depuis 3 semaines, ça commence à peser.",
      "Le manque de personnel en cuisine se ressent, on est constamment sous l'eau.",
      "Besoin de vrais jours de repos, pas juste une demi-journée coupée.",
    ],
    needsReview: true,
    reviewTitle: "Signal de vigilance managériale : surcharge et épuisement",
    reviewBody:
      "Un ou plusieurs retours de cette semaine évoquent une situation de surcharge ou d'épuisement qui pourrait nécessiter une attention particulière. Nous vous recommandons de proposer des points individuels avec les membres de votre équipe cette semaine. Aucun détail supplémentaire n'est disponible : cela fait partie de notre engagement d'anonymat.",
    synthesis:
      "Les retours convergent fortement sur un sentiment de surcharge lié au rythme estival : plusieurs commentaires évoquent un enchaînement des services sans récupération suffisante, et une fatigue qui s'accumule depuis plusieurs semaines. Le soutien perçu recule également, en lien avec un sentiment de sous-effectif à certains postes.",
  },
  {
    button: "Reconnaissance en baisse",
    contexte: "Atelier de production artisanale",
    total: 22,
    respondents: 15,
    date: "Lundi 13 juillet",
    week: "Semaine 29",
    scores: [
      { label: "Charge de travail", avg: 3.7, delta: 0.0 },
      { label: "Reconnaissance", avg: 2.6, delta: -0.8 },
      { label: "Clarté", avg: 3.9, delta: 0.1 },
      { label: "Soutien", avg: 3.5, delta: -0.1 },
      { label: "Sens", avg: 3.8, delta: 0.0 },
    ],
    recos: [
      { type: "decline", text: "Reconnaissance en net recul (-0.8) cette semaine. Un retour verbal, même bref, sur le travail terminé peut suffire à inverser la tendance." },
      { type: "positive", text: "Clarté stable et bien perçue (3.9/5). Le cadre de travail actuel fonctionne, gardez cette structure sur les prochaines missions." },
      { type: "alert", text: "7 employés n'ont pas répondu cette semaine. Vérifiez que le rappel du vendredi leur parvient bien." },
    ],
    raw: [
      "On ne sait jamais si le travail rendu convient vraiment, aucun retour depuis des semaines.",
      "Même quand une pièce est complexe et bien finie, ça passe inaperçu.",
      "Le travail est intéressant mais on a l'impression d'être un peu invisibles.",
    ],
    needsReview: false,
    synthesis:
      "Plusieurs retours pointent un manque de reconnaissance perçue sur le travail fourni, notamment sur les tâches les plus techniques. La charge et la clarté des missions restent stables et globalement bien vécues cette semaine. Le sentiment dominant est celui d'un travail de qualité qui manque de visibilité, plutôt qu'un problème de fond sur l'organisation.",
  },
  {
    button: "Tensions d'équipe",
    contexte: "Boutique multi-sites (retail)",
    total: 27,
    respondents: 16,
    date: "Lundi 3 août",
    week: "Semaine 32",
    scores: [
      { label: "Charge de travail", avg: 3.3, delta: -0.1 },
      { label: "Reconnaissance", avg: 3.1, delta: -0.2 },
      { label: "Clarté", avg: 3.0, delta: -0.6 },
      { label: "Soutien", avg: 2.4, delta: -0.9 },
      { label: "Sens", avg: 3.2, delta: -0.3 },
    ],
    recos: [
      { type: "decline", text: "Soutien entre collègues en chute nette (-0.9). Organisez un temps d'échange en équipe avant que les tensions ne s'installent durablement." },
      { type: "decline", text: "Clarté en recul (-0.6), possible signe d'un manque de communication inter-sites. Clarifiez les priorités de chaque site cette semaine." },
      { type: "alert", text: "11 employés n'ont pas répondu cette semaine. Un taux de réponse en baisse peut aussi refléter le climat actuel." },
    ],
    raw: [
      "L'ambiance entre certaines personnes de l'équipe est tendue depuis quelques semaines.",
      "On sent des clans se former, ce n'est pas agréable de venir travailler dans ce climat.",
      "Le manque de communication entre les deux boutiques crée des malentendus à répétition.",
    ],
    needsReview: true,
    reviewTitle: "Signal de vigilance managériale : tensions au sein de l'équipe",
    reviewBody:
      "Un ou plusieurs retours de cette semaine évoquent des tensions au sein de l'équipe qui pourraient nécessiter une attention particulière. Nous vous recommandons de proposer des points individuels avec les membres de votre équipe cette semaine. Aucun détail supplémentaire n'est disponible : cela fait partie de notre engagement d'anonymat.",
    synthesis:
      "Plusieurs retours convergent sur un climat d'équipe tendu, avec une entraide entre collègues perçue en net recul. Ce ressenti semble lié à des incompréhensions qui ne sont pas encore adressées ouvertement, notamment entre les différents points de vente. Le sens du travail reste globalement présent, mais la dynamique collective s'en trouve fragilisée cette semaine.",
  },
  {
    button: "Équipe sereine",
    contexte: "Agence marketing digital",
    total: 14,
    respondents: 12,
    date: "Lundi 22 juin",
    week: "Semaine 26",
    scores: [
      { label: "Charge de travail", avg: 3.9, delta: 0.2 },
      { label: "Reconnaissance", avg: 4.2, delta: 0.3 },
      { label: "Clarté", avg: 4.4, delta: 0.1 },
      { label: "Soutien", avg: 4.1, delta: 0.0 },
      { label: "Sens", avg: 4.3, delta: 0.2 },
    ],
    recos: [
      { type: "positive", text: "Reconnaissance en hausse (+0.3) cette semaine. Le rythme de brief clair porte ses fruits, gardez ce format sur les prochains dossiers." },
      { type: "positive", text: "Sens du travail renforcé (+0.2). Un mot rapide en réunion sur les réussites de la semaine peut consolider cette dynamique." },
      { type: "alert", text: "2 employés n'ont pas répondu cette semaine. Un rappel discret avant vendredi suffit généralement à ce niveau." },
    ],
    raw: [
      "Bonne ambiance cette semaine, le brief client était clair dès le départ.",
      "Contente d'avoir eu un retour rapide sur mes propositions créatives.",
      "La charge est correcte, un peu tendue en toute fin de semaine mais gérable.",
    ],
    needsReview: false,
    synthesis:
      "Les retours de la semaine sont globalement positifs : plusieurs commentaires soulignent une clarté appréciée sur les objectifs des nouveaux dossiers et une réactivité satisfaisante sur les retours créatifs. Quelques mentions ponctuelles d'une charge un peu plus dense en fin de semaine, sans signal de tension généralisée.",
  },
  {
    button: "Scores seuls",
    contexte: "Cabinet de conseil",
    total: 12,
    respondents: 9,
    date: "Lundi 6 juillet",
    week: "Semaine 28",
    scores: [
      { label: "Charge de travail", avg: 3.6, delta: -0.2 },
      { label: "Reconnaissance", avg: 3.9, delta: 0.1 },
      { label: "Clarté", avg: 4.0, delta: 0.0 },
      { label: "Soutien", avg: 3.8, delta: 0.0 },
      { label: "Sens", avg: 3.7, delta: 0.1 },
    ],
    recos: [
      { type: "decline", text: "Charge de travail en léger repli (-0.2). Rien d'alarmant, un point rapide en équipe permet de vérifier que tout va bien." },
      { type: "positive", text: "Sens du travail en hausse (+0.1). Le cadre actuel semble porter ses fruits, continuez ainsi." },
      { type: "alert", text: "3 employés n'ont pas répondu cette semaine. Rien d'inquiétant à ce stade, un rappel suffit généralement." },
    ],
    raw: ["RAS cette semaine.", "Rien de particulier à signaler."],
    needsReview: false,
    belowThreshold: true,
    belowThresholdNote:
      "9 réponses reçues cette semaine : les scores ci-dessus sont fiables et affichés normalement. Moins de 5 commentaires libres ont été renseignés, pas assez de matière pour générer une synthèse fiable et anonyme cette semaine.",
  },
];

const recoStyles = {
  positive: { bg: "#F0FDF4", dot: "var(--semantic-green)", symbol: "↑" },
  decline: { bg: "#FEF2F2", dot: "var(--semantic-red)", symbol: "↓" },
  alert: { bg: "var(--indigo-pale)", dot: "var(--indigo)", symbol: "·" },
} as const;

export function RapportDemo({ className }: { className?: string }) {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return 0;
    const cas = new URLSearchParams(window.location.search).get("cas");
    const i = SCENARIO_SLUGS.indexOf(cas ?? "");
    return i >= 0 ? i : 0;
  });

  const [zoomed, setZoomed] = useState(false);
  const cardWrapRef = useRef<HTMLDivElement | null>(null);
  const [minCardHeight, setMinCardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const measure = () => {
      const el = cardWrapRef.current;
      if (!el) return;
      if (window.innerWidth >= 768) {
        setMinCardHeight(0);
        return;
      }
      const h = el.getBoundingClientRect().height;
      setMinCardHeight((prev) => (h > prev ? Math.ceil(h) : prev));
    };
    const id = window.setTimeout(measure, 60);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", measure);
    };
  }, [active]);


  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = zoomed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  useEffect(() => {
    if (window.location.hash !== "#demo") return;
    const el = document.getElementById("demo");
    if (!el) return;
    el.querySelectorAll(".fade-up").forEach((n) => n.classList.add("visible"));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    });
  }, []);
  const s = scenarios[active];

  const card = (
        <div
          style={{
            width: "100%",
            background: "var(--bg-card)",
            borderRadius: "20px",
            border: "1px solid rgba(13,27,62,0.08)",
            boxShadow: "0 1px 2px rgba(13,27,62,0.04), 0 8px 24px rgba(13,27,62,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--midnight)",
              padding: "14px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#FFFFFF", fontWeight: 600 }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--indigo)", display: "inline-block" }} />
              Rapport d'équipe — {s.date}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{s.week}</div>
          </div>

          <div key={active} className="rapport-demo-body" style={{ padding: "24px 20px", animation: "rapportDemoFade 0.2s ease" }}>
            <div className="rapport-demo-cols">
            <div className="rapport-demo-left">
            <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "20px" }}>
              {s.contexte} · {s.respondents} réponses sur {s.total} salariés
            </div>

            <div className="rapport-scores">
              {s.scores.map((sc) => (
                <div key={sc.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div className="rapport-label" style={{ width: "118px", flexShrink: 0, fontSize: "11.5px", color: "var(--text-muted)", lineHeight: 1.3 }}>
                    {sc.label}
                  </div>
                  <div className="rapport-bar" style={{ flex: 1, height: "5px", borderRadius: "3px", background: "var(--indigo-pale)", overflow: "hidden" }}>
                    <div style={{ width: `${(sc.avg / 5) * 100}%`, height: "100%", background: "var(--indigo)", borderRadius: "3px" }} />
                  </div>
                  <div style={{ width: "30px", flexShrink: 0, textAlign: "right", fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {sc.avg.toFixed(1)}
                  </div>
                  <div
                    style={{
                      width: "40px",
                      flexShrink: 0,
                      textAlign: "right",
                      fontSize: "11.5px",
                      color: sc.delta > 0 ? "var(--semantic-green)" : sc.delta < 0 ? "var(--semantic-red)" : "var(--text-muted)",
                    }}
                  >
                    {sc.delta > 0 ? `▲ ${Math.abs(sc.delta).toFixed(1)}` : sc.delta < 0 ? `▼ ${Math.abs(sc.delta).toFixed(1)}` : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 700,
                color: "var(--text-muted)",
                margin: "20px 0 10px",
              }}
            >
              Recommandations IA
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {s.recos.map((r) => {
                const st = recoStyles[r.type];
                return (
                  <div
                    key={r.text}
                    style={{
                      background: st.bg,
                      padding: "10px 12px",
                      borderRadius: "8px",
                      fontSize: "12.5px",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        flexShrink: 0,
                        borderRadius: "4px",
                        background: st.dot,
                        color: "#FFFFFF",
                        fontSize: "11px",
                        lineHeight: "16px",
                        textAlign: "center",
                        marginTop: "1px",
                      }}
                    >
                      {st.symbol}
                    </span>
                    <span>{r.text}</span>
                  </div>
                );
              })}
            </div>

            {s.needsReview && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginTop: "16px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "16px", color: "var(--semantic-red)", flexShrink: 0 }}>⚠</span>
                <div>
                  <span style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "var(--midnight)", marginBottom: "4px" }}>
                    {s.reviewTitle}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{s.reviewBody}</span>
                </div>
              </div>
            )}
            </div>

            <div className="rapport-demo-right">
            <div
              className="rapport-demo-transform"
              style={{
                paddingTop: "20px",
                borderTop: "1px solid rgba(13,27,62,0.08)",
                marginTop: "24px",
              }}
            >
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--midnight)" }}>Ce que l'équipe a écrit</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>
                  Commentaires anonymes, jamais reliés à une identité
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {s.raw.map((r) => (
                    <div
                      key={r}
                      style={{
                        background: "var(--bg-main)",
                        border: "1px dashed rgba(13,27,62,0.12)",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "11.5px",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rapport-demo-arrow"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", margin: "12px 0" }}
              >
                <span style={{ fontSize: "18px", color: "var(--indigo)", lineHeight: 1 }}>↓</span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  IA anonymise
                </span>
              </div>

              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--midnight)" }}>Ce que le manager reçoit</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>Synthèse des thèmes récurrents</div>
                {s.belowThreshold ? (
                  <div
                    style={{
                      background: "var(--bg-main)",
                      border: "1px solid rgba(13,27,62,0.10)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      fontSize: "11.5px",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.belowThresholdNote}
                  </div>
                ) : (
                  <div
                    style={{
                      background: "var(--indigo-pale)",
                      border: "1px solid rgba(67,56,202,0.15)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      fontSize: "11.5px",
                      color: "var(--text-primary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.synthesis}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(13,27,62,0.08)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>
                Taux de réponse : {s.respondents} / {s.total} employés
              </div>
              <div style={{ height: "5px", borderRadius: "3px", background: "var(--indigo-pale)", overflow: "hidden" }}>
                <div style={{ width: `${(s.respondents / s.total) * 100}%`, height: "100%", background: "var(--indigo)", borderRadius: "3px" }} />
              </div>
            </div>
            </div>
            </div>
          </div>
        </div>
  );

  return (
    <div className={className} style={{ fontFamily: "var(--font-sans)" }}>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            background: "var(--indigo-pale)",
            color: "var(--indigo)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            fontWeight: 700,
            padding: "5px 14px",
            borderRadius: "20px",
          }}
        >
          Démonstration
        </span>
        <h2
          style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: "36px",
            color: "var(--midnight)",
            letterSpacing: "-0.5px",
            margin: "14px 0 10px",
          }}
        >
          Cinq équipes, cinq lundis matin.
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-muted)",
            maxWidth: "560px",
            margin: "0 auto 32px",
            lineHeight: 1.6,
          }}
        >
          Chaque situation produit un rapport différent. Choisissez un cas pour voir exactement ce que le manager reçoit.
        </p>
      </div>

      <div className="rapport-demo-stack" style={{ maxWidth: "1080px", margin: "0 auto", width: "100%" }}>
      <div
        className="rapport-demo-tabs"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div className="rapport-demo-tablist" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {scenarios.map((sc, i) => {
          const isActive = i === active;
          return (
            <button
              key={sc.button}
              type="button"
              onClick={() => setActive(i)}
              className={isActive ? "rapport-demo-tab is-active" : "rapport-demo-tab"}
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                padding: "8px 15px",
                borderRadius: "999px",
                border: `1px solid ${isActive ? "var(--indigo)" : "rgba(13,27,62,0.08)"}`,
                background: isActive ? "var(--indigo)" : "var(--bg-card)",
                color: isActive ? "#FFFFFF" : "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {sc.button}
            </button>
          );
        })}
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--indigo-pale)",
            color: "var(--midnight)",
            fontSize: "12px",
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: "999px",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--indigo)",
              display: "inline-block",
            }}
          />
          Exemple illustratif
        </span>
      </div>

      <div
        ref={cardWrapRef}
        className="rapport-demo-cardwrap"
        style={minCardHeight ? { minHeight: `${minCardHeight}px` } : undefined}
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth < 768) setZoomed(true);
        }}
      >
        {card}
      </div>

      <div className="rapport-demo-zoom-hint">Touchez pour agrandir</div>

      {zoomed && typeof document !== "undefined" && createPortal(
        <div className="rapport-demo-zoom-overlay" onClick={() => setZoomed(false)}>
          <button
            type="button"
            aria-label="Fermer"
            className="rapport-demo-zoom-close"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed(false);
            }}
          >
            ×
          </button>
          <div onClick={(e) => e.stopPropagation()}>{card}</div>
        </div>,
        document.body
      )}

      </div>

      <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "16px" }}>
        Équipes et commentaires fictifs, créés pour illustrer le fonctionnement du rapport.
      </div>
    </div>
  );
}
