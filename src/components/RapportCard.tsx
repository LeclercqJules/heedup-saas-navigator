import { useEffect, useState } from "react";

const DIMENSIONS = [
  { label: "Charge de travail", target: 3.6, change: "▼ 0.3", changeColor: "var(--semantic-red)" },
  { label: "Reconnaissance", target: 3.2, change: "▼ 0.4", changeColor: "var(--semantic-red)" },
  { label: "Clarté", target: 4.0, change: "▲ 0.2", changeColor: "var(--semantic-green)" },
  { label: "Soutien", target: 4.1, change: "—", changeColor: "var(--text-muted)" },
  { label: "Sens", target: 4.3, change: "▲ 0.1", changeColor: "var(--semantic-green)" },
];

const RECOS = [
  {
    bg: "#FEF2F2",
    border: "1px solid rgba(239,68,68,0.18)",
    icon: "↓",
    iconBg: "var(--semantic-red)",
    text: "Reconnaissance en baisse 2 semaines. Prenez 10 minutes pour un retour individuel à chacun avant vendredi.",
  },
  {
    bg: "#F0FDF4",
    border: "1px solid rgba(34,197,94,0.18)",
    icon: "↑",
    iconBg: "var(--semantic-green)",
    text: "Clarté en hausse. Le point de lundi dernier a eu de l'effet, gardez ce format.",
  },
  {
    bg: "#FEF2F2",
    border: "1px solid rgba(239,68,68,0.18)",
    icon: "!",
    iconBg: "var(--semantic-red)",
    text: "3 employés n'ont pas répondu cette semaine. Envoyez un rappel discret avant vendredi. Le silence est aussi un signal.",
  },
];

export function RapportCard({ className }: { className?: string }) {
  const [scores, setScores] = useState<string[]>(() => DIMENSIONS.map(() => "0.0"));
  const [showDeltas, setShowDeltas] = useState(false);
  const [reco1, setReco1] = useState(false);
  const [reco2, setReco2] = useState(false);
  const [reco3, setReco3] = useState(false);
  const [responseWidth, setResponseWidth] = useState("0%");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setScores(DIMENSIONS.map((d) => d.target.toFixed(1)));
      setShowDeltas(true);
      setReco1(true);
      setReco2(true);
      setReco3(true);
      setResponseWidth("86%");
      return;
    }

    const setScoreAt = (index: number, value: string) =>
      setScores((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });

    const animateScore = (target: number, index: number, duration: number) => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setScoreAt(index, (eased * target).toFixed(1));
        if (progress < 1) requestAnimationFrame(tick);
        else setScoreAt(index, target.toFixed(1));
      };
      requestAnimationFrame(tick);
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        DIMENSIONS.forEach((d, i) => {
          timers.push(setTimeout(() => animateScore(d.target, i, 1200 - i * 60), i * 150));
        });
      }, 400)
    );

    timers.push(setTimeout(() => setShowDeltas(true), 1800));
    timers.push(setTimeout(() => setReco1(true), 2200));
    timers.push(setTimeout(() => setReco2(true), 2700));
    timers.push(setTimeout(() => setReco3(true), 3200));
    timers.push(setTimeout(() => setResponseWidth("86%"), 3600));

    return () => timers.forEach(clearTimeout);
  }, []);

  const shown = [reco1, reco2, reco3];

  return (
    <div
      className={className}
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "12px",
        border: "1px solid rgba(67,56,202,0.12)",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--midnight)",
          padding: "14px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#FFFFFF",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ color: "var(--indigo)" }}>●</span>
          Rapport d'équipe — Lundi 16 juin
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Semaine 24</div>
      </div>

      <div className="rapport-scores" style={{ padding: "16px 22px 6px" }}>
        {DIMENSIONS.map((d, i) => (
          <div
            key={d.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              className="rapport-label"
              style={{
                width: "118px",
                flexShrink: 0,
                fontSize: "11.5px",
                color: "var(--text-muted)",
                lineHeight: 1.3,
              }}
            >
              {d.label}
            </div>
            <div
              className="rapport-bar"
              style={{
                flex: 1,
                height: "5px",
                borderRadius: "3px",
                backgroundColor: "var(--indigo-pale)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(parseFloat(scores[i]) / 5) * 100}%`,
                  height: "100%",
                  backgroundColor: "var(--indigo)",
                  borderRadius: "3px",
                }}
              />
            </div>
            <div
              style={{
                width: "30px",
                flexShrink: 0,
                textAlign: "right",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {scores[i]}
            </div>
            <div
              style={{
                width: "40px",
                flexShrink: 0,
                textAlign: "right",
                fontSize: "11.5px",
                color: d.changeColor,
                opacity: showDeltas ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              {d.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "6px 22px 2px" }}>
        <div
          style={{
            fontSize: "11.5px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          Recommandations IA
        </div>
        {RECOS.map((r, i) => (
          <div
            key={r.text}
            className="mb-2.5 flex items-start gap-3 rounded-lg p-3"
            style={{
              backgroundColor: r.bg,
              border: r.border,
              opacity: shown[i] ? 1 : 0,
              transform: shown[i] ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div
              className="flex flex-shrink-0 items-center justify-center"
              style={{ backgroundColor: r.iconBg, width: "18px", height: "18px" }}
            >
              <span style={{ fontSize: "11px", color: "#FFFFFF" }}>{r.icon}</span>
            </div>
            <p style={{ fontSize: "12.5px", lineHeight: 1.5, color: "var(--text-primary)" }}>{r.text}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 22px 20px" }}>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "10px" }}>
          Taux de réponse : 18 / 21 employés
        </div>
        <div
          style={{
            height: "7px",
            backgroundColor: "var(--indigo-pale)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: responseWidth,
              height: "100%",
              backgroundColor: "var(--indigo)",
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
