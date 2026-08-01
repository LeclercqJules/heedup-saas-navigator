import { useEffect, useState } from "react";

export function RapportCard({ className }: { className?: string }) {
  const [score1, setScore1] = useState("0.0");
  const [score2, setScore2] = useState("0.0");
  const [score3, setScore3] = useState("0.0");
  const [showDeltas, setShowDeltas] = useState(false);
  const [reco1, setReco1] = useState(false);
  const [reco2, setReco2] = useState(false);
  const [reco3, setReco3] = useState(false);
  const [responseWidth, setResponseWidth] = useState("0%");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setScore1("3.6");
      setScore2("4.1");
      setScore3("4.3");
      setShowDeltas(true);
      setReco1(true);
      setReco2(true);
      setReco3(true);
      setResponseWidth("80%");
      return;
    }

    const animateScore = (target: number, setter: (v: string) => void, duration = 1000) => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setter((eased * target).toFixed(1));
        if (progress < 1) requestAnimationFrame(tick);
        else setter(target.toFixed(1));
      };
      requestAnimationFrame(tick);
    };

    const timer = setTimeout(() => {
      animateScore(3.6, setScore1, 1200);
      setTimeout(() => animateScore(4.1, setScore2, 1000), 200);
      setTimeout(() => animateScore(4.3, setScore3, 900), 400);
    }, 400);

    const deltaTimer = setTimeout(() => setShowDeltas(true), 1800);
    const reco1Timer = setTimeout(() => setReco1(true), 2200);
    const reco2Timer = setTimeout(() => setReco2(true), 2700);
    const reco3Timer = setTimeout(() => setReco3(true), 3200);
    const progressTimer = setTimeout(() => setResponseWidth("80%"), 3600);

    return () => {
      clearTimeout(timer);
      clearTimeout(deltaTimer);
      clearTimeout(reco1Timer);
      clearTimeout(reco2Timer);
      clearTimeout(reco3Timer);
      clearTimeout(progressTimer);
    };
  }, []);

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
          Rapport d'équipe, lundi 16 juin
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Semaine 24</div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-5" style={{ backgroundColor: "var(--bg-main)" }}>
        {[
          { label: "Charge", value: score1, change: "▼ 0.3", changeColor: "var(--semantic-red)" },
          { label: "Ambiance", value: score2, change: "▲ 0.2", changeColor: "var(--semantic-green)" },
          { label: "Motivation", value: score3, change: "=", changeColor: "var(--text-muted)" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-4 text-center" style={{ backgroundColor: "var(--bg-card)" }}>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: "26px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: s.changeColor,
                marginTop: "4px",
                opacity: showDeltas ? 1 : 0,
                transition: "opacity 0.4s ease",
              }}
            >
              {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pt-5 pb-2">
        <div
          style={{
            fontSize: "11.5px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
            marginBottom: "12px",
          }}
        >
          Recommandations IA
        </div>
        {[
          {
            shown: reco1,
            bg: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.18)",
            icon: "↓",
            iconBg: "var(--semantic-red)",
            text: "Charge en baisse 2 semaines. Organisez un point d'équipe avant vendredi.",
          },
          {
            shown: reco2,
            bg: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.18)",
            icon: "↑",
            iconBg: "var(--semantic-green)",
            text: "Ambiance en hausse. Bon moment pour lancer un projet à forte visibilité.",
          },
          {
            shown: reco3,
            bg: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.18)",
            icon: "!",
            iconBg: "var(--semantic-red)",
            text: "2 employés n'ont pas répondu cette semaine. Envoyez un rappel discret avant vendredi. Le silence est aussi un signal.",
          },
        ].map((r) => (
          <div
            key={r.text}
            className="mb-4 flex items-start gap-3 rounded-lg p-4"
            style={{
              backgroundColor: r.bg,
              border: r.border,
              opacity: r.shown ? 1 : 0,
              transform: r.shown ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div
              className="flex flex-shrink-0 items-center justify-center"
              style={{ backgroundColor: r.iconBg, width: "18px", height: "18px" }}
            >
              <span style={{ fontSize: "11px", color: "#FFFFFF" }}>{r.icon}</span>
            </div>
            <p style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--text-primary)" }}>{r.text}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 pt-3">
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "10px" }}>
          Taux de réponse : 8 / 10 employés
        </div>
        <div
          style={{
            height: "7px",
            backgroundColor: "rgba(67,56,202,0.1)",
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
