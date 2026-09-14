import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import {
  calculateDisengagementCost,
  calculateHeedupAnnualCost,
  DEPARTURE_COST,
  DEPARTURE_COST_MAX,
  DEPARTURE_COST_MIN,
  DEPARTURE_COST_SOURCE,
  DISENGAGEMENT_COST_PER_EMPLOYEE,
  DISENGAGEMENT_RATE,
  DISENGAGEMENT_SOURCE,
} from "@/lib/costCalculator";

export const Route = createFileRoute("/estimer-cout")({
  head: () => ({
    meta: [
      { title: "Estimez le coût du désengagement | HeedUp" },
      {
        name: "description",
        content:
          "Calculez ce que le désengagement coûte à votre équipe, à partir des données Gallup France et IBET 2024.",
      },
      { property: "og:title", content: "Estimez le coût du désengagement | HeedUp" },
      {
        property: "og:description",
        content: "Calculez le coût annuel du désengagement pour votre équipe.",
      },
    ],
  }),
  component: EstimerCoutPage,
});

function fmtEuro(n: number): string {
  return Math.round(n).toLocaleString("fr-FR") + "€";
}

const TALLY_ATTRS = {
  "data-tally-open": "VLBY9E",
  "data-tally-overlay": "1",
  "data-tally-emoji-text": "👋",
  "data-tally-emoji-animation": "wave",
} as const;

type Tick = { value: number; left: string; transform: string };
const TICKS: Tick[] = [
  { value: 10, left: "calc(10px + 0 * (100% - 20px))", transform: "translateX(0)" },
  { value: 25, left: "calc(10px + 0.1667 * (100% - 20px))", transform: "translateX(-50%)" },
  { value: 50, left: "calc(10px + 0.4444 * (100% - 20px))", transform: "translateX(-50%)" },
  { value: 75, left: "calc(10px + 0.7222 * (100% - 20px))", transform: "translateX(-50%)" },
  { value: 100, left: "calc(100% - 10px)", transform: "translateX(-50%)" },
];

function activeTick(n: number): number {
  if (n < 25) return 10;
  if (n < 50) return 25;
  if (n < 75) return 50;
  if (n < 100) return 75;
  return 100;
}

function EstimerCoutPage() {
  const [employees, setEmployees] = useState(25);

  useEffect(() => {
    setEmployees(25);
  }, []);

  const n = employees;
  const disengaged = calculateDisengagementCost(n);
  const heedup = calculateHeedupAnnualCost(n);
  const roi = DEPARTURE_COST - heedup;
  const pct = ((n - 10) / 90) * 100;
  const sliderBg = `linear-gradient(to right, var(--indigo) 0%, var(--indigo) ${pct}%, rgba(67,56,202,0.15) ${pct}%, rgba(67,56,202,0.15) 100%)`;
  const active = activeTick(n);

  return (
    <SiteLayout>
      <div
        className="calc-page-scope"
        style={{
          background: "var(--bg-main)",
          padding: "56px 5%",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 42,
              letterSpacing: "-1px",
              color: "var(--midnight)",
              textAlign: "center",
              marginBottom: 8,
              lineHeight: 1.15,
            }}
          >
            Estimez le coût du{" "}
            <em style={{ fontStyle: "italic", color: "var(--indigo)" }}>désengagement</em>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--text-muted)",
              textAlign: "center",
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            Basé sur les données Gallup France et IBET 2024. Entrez la taille de votre équipe.
          </p>

          <div
            style={{
              background: "var(--bg-card)",
              borderRadius: 12,
              border: "1px solid rgba(67,56,202,0.10)",
              padding: 28,
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
                marginBottom: 14,
              }}
            >
              Nombre de salariés
            </div>
            <div
              id="calcCount"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
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
                marginTop: 4,
                marginBottom: 20,
              }}
            >
              salariés dans votre équipe
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
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
              .calc-page-scope input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: var(--indigo);
                border-radius: 50%;
                cursor: pointer;
                border: 3px solid #fff;
                box-shadow: 0 0 0 2px var(--indigo);
              }
              .calc-page-scope input[type=range]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: var(--indigo);
                border-radius: 50%;
                cursor: pointer;
                border: 3px solid #fff;
                box-shadow: 0 0 0 2px var(--indigo);
              }
            `}</style>

            <div style={{ position: "relative", height: 28, marginTop: 10 }}>
              {TICKS.map((t) => {
                const isActive = t.value === active;
                return (
                  <div
                    key={t.value}
                    style={{
                      position: "absolute",
                      left: t.left,
                      transform: t.transform,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <div
                      style={{
                        width: 1,
                        height: 6,
                        background: isActive ? "var(--indigo)" : "rgba(13,27,62,0.2)",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--indigo)" : "var(--text-muted)",
                      }}
                    >
                      {t.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <div
              className="fade-up fade-up-delay-1 card-hover"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.7px", color: "#b91c1c", marginBottom: 8 }}>
                Coût annuel du désengagement
              </div>
              <div id="calcDisengaged" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#b91c1c" }}>
                {fmtEuro(disengaged)}
              </div>
              <div style={{ fontSize: 12, color: "rgba(185,28,28,0.7)", marginTop: 4 }}>
                {DISENGAGEMENT_RATE * 100}% de vos salariés sont activement désengagés, impliqués en apparence, mais plus vraiment investis dans leur travail. Chacun coûte en moyenne {fmtEuro(DISENGAGEMENT_COST_PER_EMPLOYEE)}/an.
              </div>
              <div style={{ fontSize: 10, color: "rgba(185,28,28,0.4)", marginTop: 6 }}>
                {DISENGAGEMENT_SOURCE}
              </div>
            </div>

            <div
              className="fade-up fade-up-delay-2 card-hover"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.7px", color: "#b91c1c", marginBottom: 8 }}>
                Risque par départ non anticipé
              </div>
              <div id="calcDeparture" style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#b91c1c" }}>
                {fmtEuro(DEPARTURE_COST)}
              </div>
              <div style={{ fontSize: 12, color: "rgba(185,28,28,0.7)", marginTop: 4 }}>
                Recrutement, formation et perte de productivité pendant 6 mois.
              </div>
              <div style={{ fontSize: 10, color: "rgba(185,28,28,0.4)", marginTop: 6 }}>
                Source : {DEPARTURE_COST_SOURCE}. Fourchette : {fmtEuro(DEPARTURE_COST_MIN)} à {fmtEuro(DEPARTURE_COST_MAX)}.
              </div>
            </div>

            <div className="fade-up fade-up-delay-3" style={{ background: "var(--midnight)", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.7px", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
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

            <div
              className="fade-up fade-up-delay-4 card-hover"
              style={{
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 10,
                padding: "16px 18px",
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.7px", color: "#15803d", marginBottom: 8 }}>
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

          <Link
            to="/connexion"
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
              textDecoration: "none",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            Créer mon espace
          </Link>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Estimations basées sur des données sectorielles françaises.
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
