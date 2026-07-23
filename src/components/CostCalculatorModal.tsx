import { useEffect, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TALLY_ATTRS = {
  "data-tally-open": "VLBY9E",
  "data-tally-overlay": "1",
  "data-tally-emoji-text": "👋",
  "data-tally-emoji-animation": "wave",
} as const;

function calcHeedup(n: number): number {
  if (n < 25) return n * 5 * 12;
  if (n < 50) return n * 4.5 * 12;
  if (n < 100) return n * 4 * 12;
  return n * 3.5 * 12;
}

function fmtEuro(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + "€";
}

export function CostCalculatorModal({ isOpen, onClose }: Props) {
  const [employees, setEmployees] = useState(25);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setEmployees(25);
  }, [isOpen]);

  if (!isOpen) return null;

  const n = employees;
  const disengaged = Math.round(n * 0.13) * 14300;
  const heedup = calcHeedup(n);
  const roi = 22500 - heedup;
  const pct = ((n - 10) / 90) * 100;
  const sliderBg = `linear-gradient(to right, var(--indigo) 0%, var(--indigo) ${pct}%, rgba(67,56,202,0.15) ${pct}%, rgba(67,56,202,0.15) 100%)`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,27,62,0.6)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="calc-modal-scope"
        style={{
          background: "var(--bg-main)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "36px 32px",
          position: "relative",
          fontFamily: "var(--font-sans)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(13,27,62,0.08)",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            color: "var(--midnight)",
          }}
        >
          ✕
        </button>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            letterSpacing: "-0.5px",
            marginBottom: 6,
            textAlign: "center",
            color: "var(--midnight)",
          }}
        >
          Estimez le coût du{" "}
          <em style={{ fontStyle: "italic", color: "var(--indigo)" }}>désengagement</em>
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Basé sur les données IBET 2024 et Deloitte 2024. Entrez la taille de votre équipe.
        </p>

        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: 12,
            border: "1px solid rgba(67,56,202,0.10)",
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.7px",
              fontWeight: 700,
              color: "var(--midnight)",
              opacity: 0.35,
              marginBottom: 12,
            }}
          >
            Nombre de salariés
          </div>
          <div
            id="calcCount"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 44,
              color: "var(--midnight)",
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            {n}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: 16,
              marginTop: 4,
            }}
          >
            salariés dans votre équipe
          </div>
          <input
            ref={sliderRef}
            type="range"
            min={10}
            max={100}
            value={n}
            onChange={(e) => setEmployees(parseInt(e.target.value))}
            style={{
              width: "100%",
              height: 5,
              WebkitAppearance: "none",
              appearance: "none",
              background: sliderBg,
              borderRadius: 3,
              outline: "none",
              cursor: "pointer",
            }}
          />
          <style>{`
            .calc-modal-scope input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 20px;
              height: 20px;
              background: var(--indigo);
              border-radius: 50%;
              cursor: pointer;
              border: none;
            }
            .calc-modal-scope input[type=range]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              background: var(--indigo);
              border-radius: 50%;
              cursor: pointer;
              border: none;
            }
          `}</style>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--text-muted)",
              marginTop: 10,
            }}
          >
            <span>10</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Card 1 */}
          <div
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.7px",
                color: "#b91c1c",
                marginBottom: 8,
              }}
            >
              Coût annuel du désengagement
            </div>
            <div id="calcDisengaged" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#b91c1c" }}>
              {fmtEuro(disengaged)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(185,28,28,0.7)", marginTop: 4 }}>
              13% de vos salariés sont activement désengagés. Chacun coûte en moyenne 14 300€/an.
            </div>
            <div style={{ fontSize: 10, color: "rgba(185,28,28,0.4)", marginTop: 6 }}>
              Source : IBET 2024, Gallup 2024
            </div>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.7px",
                color: "#b91c1c",
                marginBottom: 8,
              }}
            >
              Risque par départ non anticipé
            </div>
            <div id="calcDeparture" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#b91c1c" }}>
              22 500€
            </div>
            <div style={{ fontSize: 12, color: "rgba(185,28,28,0.7)", marginTop: 4 }}>
              Recrutement, formation et perte de productivité pendant 6 mois.
            </div>
            <div style={{ fontSize: 10, color: "rgba(185,28,28,0.4)", marginTop: 6 }}>
              Source : Deloitte 2024, 15 000€ à 30 000€
            </div>
          </div>

          {/* Card 3 */}
          <div
            style={{
              background: "var(--midnight)",
              borderRadius: 10,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.7px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 8,
              }}
            >
              Coût annuel HeedUp
            </div>
            <div id="calcHeedup" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#FFFFFF" }}>
              {fmtEuro(heedup)}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
              Pour détecter les signaux faibles avant qu'ils deviennent des départs.
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
              Basé sur le palier tarifaire correspondant
            </div>
          </div>

          {/* Card 4 */}
          <div
            style={{
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 10,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.7px",
                color: "#15803d",
                marginBottom: 8,
              }}
            >
              Économie dès un départ évité
            </div>
            <div id="calcRoi" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#15803d" }}>
              {fmtEuro(roi)}
            </div>
            <div style={{ fontSize: 12, color: "#15803d", fontWeight: 500, marginTop: 4 }}>
              HeedUp est rentable dès qu'il vous évite un seul départ non anticipé dans l'année.
            </div>
          </div>
        </div>

        <button
          {...TALLY_ATTRS}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            background: "var(--indigo)",
            color: "#FFFFFF",
            border: "none",
            marginTop: 16,
            fontFamily: "var(--font-sans)",
          }}
        >
          Accéder au lancement →
        </button>
        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Estimations basées sur des données sectorielles françaises. Situation réelle variable.
        </div>
      </div>
    </div>
  );
}
