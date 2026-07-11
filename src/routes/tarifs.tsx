import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — HeedUp" },
      {
        name: "description",
        content:
          "Prix calculé par siège, affiché avant toute inscription. Aucun appel commercial requis.",
      },
    ],
  }),
  component: Page,
});

const TALLY_ATTRS = {
  "data-tally-open": "obpYab",
  "data-tally-overlay": "1",
  "data-tally-emoji-text": "👋",
  "data-tally-emoji-animation": "wave",
} as const;

function formatFR(n: number) {
  return n.toFixed(2).replace(".", ",");
}

function calcPrice(n: number): { seat: number; total: number } {
  n = parseInt(String(n), 10);
  if (n < 25) return { seat: 5.0, total: n * 5.0 };
  if (n < 50) return { seat: 4.5, total: n * 4.5 };
  if (n < 100) {
    const total = 200 + (n - 50) * 3.75;
    return { seat: parseFloat((total / n).toFixed(2)), total };
  }
  return { seat: 3.5, total: n * 3.5 };
}

type Card = {
  range: string;
  price: string;
  priceSuffix: string;
  total: string;
  featured?: boolean;
};

const cards: Card[] = [
  {
    range: "10 à 24 salariés",
    price: "5,00€",
    priceSuffix: "/siège",
    total: "À partir de 50€/mois",
  },
  {
    range: "25 à 49 salariés",
    price: "4,50€",
    priceSuffix: "/siège",
    total: "À partir de 112,50€/mois",
    featured: true,
  },
  {
    range: "50 à 99 salariés",
    price: "dès 4,00€",
    priceSuffix: "/siège",
    total: "À partir de 200€/mois",
  },
  {
    range: "100+ salariés",
    price: "3,50€",
    priceSuffix: "/siège",
    total: "À partir de 350€/mois",
  },
];

const ticks = [
  { value: 10, label: "5,00€/siège" },
  { value: 25, label: "4,50€/siège" },
  { value: 50, label: "dès 4,00€/siège" },
  { value: 100, label: "3,50€/siège" },
];

function activeTierIndex(n: number) {
  if (n < 25) return 0;
  if (n < 50) return 1;
  if (n < 100) return 2;
  return 3;
}

function cliffMessage(n: number): string | null {
  if (n === 24)
    return "À 25 salariés, votre tarif passe à 4,50€/siège. Soit 112,50€/mois au lieu de 120€.";
  if (n === 49)
    return "À 50 salariés, votre tarif passe à 200€/mois. Soit 20,50€ de moins qu'à 49 salariés.";
  if (n === 99)
    return "À 100 salariés, votre tarif passe à 3,50€/siège. Soit 350€/mois au lieu de 383,75€.";
  return null;
}

function Page() {
  const [count, setCount] = useState(25);
  const { seat, total } = useMemo(() => calcPrice(count), [count]);
  const pct = ((count - 10) / 90) * 100;
  const activeTier = activeTierIndex(count);
  const cliff = cliffMessage(count);

  useEffect(() => {
    // inject slider thumb styles once
    const id = "heedup-sim-slider-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .heedup-sim-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; outline:none; }
      .heedup-sim-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:var(--indigo); border:3px solid #fff; box-shadow:0 0 0 2px var(--indigo); cursor:pointer; }
      .heedup-sim-slider::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:var(--indigo); border:3px solid #fff; box-shadow:0 0 0 2px var(--indigo); cursor:pointer; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "56px 5% 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--midnight)",
            opacity: 0.35,
            marginBottom: "12px",
          }}
        >
          TARIFS
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "52px",
            letterSpacing: "-1px",
            color: "var(--midnight)",
            lineHeight: 1.1,
          }}
        >
          Transparent. <em style={{ color: "var(--indigo)" }}>Sans surprise.</em>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "17px",
            color: "var(--text-muted)",
            maxWidth: "540px",
            margin: "16px auto 0",
            lineHeight: 1.6,
          }}
        >
          Prix calculé par siège, affiché avant toute inscription. Aucun appel
          commercial requis.
        </p>
      </section>

      {/* PRICING CARDS */}
      <section
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "52px 5%",
          borderTop: "1px solid rgba(67,56,202,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              letterSpacing: "-0.5px",
              color: "var(--midnight)",
            }}
          >
            Les 4 paliers tarifaires
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "10px",
            }}
          >
            Plus votre équipe est grande, moins vous payez par siège.
          </p>
        </div>

        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px",
          }}
        >
          {cards.map((c) => {
            const featured = !!c.featured;
            return (
              <article
                key={c.range}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: featured
                    ? "2px solid var(--midnight)"
                    : "1px solid rgba(67,56,202,0.12)",
                  backgroundColor: "var(--bg-card)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* HEADER */}
                <div
                  style={{
                    padding: "32px 28px 24px",
                    backgroundColor: featured ? "var(--midnight)" : "var(--bg-main)",
                  }}
                >
                  {featured && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "var(--indigo)",
                        color: "#FFFFFF",
                        fontFamily: "var(--font-sans)",
                        fontSize: "9.5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        marginBottom: "10px",
                        letterSpacing: "0.6px",
                      }}
                    >
                      Le plus choisi
                    </span>
                  )}
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: featured
                        ? "rgba(255,255,255,0.4)"
                        : "var(--midnight)",
                      opacity: 0.4,
                      marginBottom: "16px",
                    }}
                  >
                    {c.range}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "52px",
                      letterSpacing: "-1px",
                      color: featured ? "#FFFFFF" : "var(--midnight)",
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                    {c.price}
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        opacity: 0.4,
                        marginLeft: "4px",
                      }}
                    >
                      {c.priceSuffix}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      color: featured ? "#FFFFFF" : "var(--midnight)",
                      opacity: 0.4,
                      marginBottom: "20px",
                    }}
                  >
                    par siège, par mois
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: featured
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(67,56,202,0.08)",
                      borderRadius: "8px",
                      padding: "7px 12px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: featured ? "rgba(255,255,255,0.65)" : "var(--midnight)",
                      opacity: featured ? 1 : 0.6,
                    }}
                  >
                    {c.total}
                  </div>
                </div>
                {/* BODY */}
                <div
                  style={{
                    padding: "24px 28px",
                    backgroundColor: "var(--bg-card)",
                    marginTop: "auto",
                  }}
                >
                  <button
                    type="button"
                    {...TALLY_ATTRS}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "8px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      backgroundColor: featured ? "var(--indigo)" : "transparent",
                      border: featured
                        ? "1.5px solid var(--indigo)"
                        : "1.5px solid var(--midnight)",
                      color: featured ? "#FFFFFF" : "var(--midnight)",
                    }}
                  >
                    Rejoindre la liste
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SIMULATEUR */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "52px 5%",
          borderTop: "1px solid rgba(67,56,202,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              letterSpacing: "-0.5px",
              color: "var(--midnight)",
            }}
          >
            Estimez votre tarif
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--text-muted)",
              marginTop: "10px",
            }}
          >
            Déplacez le curseur selon la taille de votre équipe.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "16px",
            border: "1px solid rgba(67,56,202,0.10)",
            padding: "40px",
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--midnight)",
              opacity: 0.35,
              marginBottom: "20px",
            }}
          >
            NOMBRE DE SALARIÉS
          </div>
          <div
            id="sim-count"
            style={{
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontSize: "52px",
              color: "var(--midnight)",
              lineHeight: 1,
            }}
          >
            {count}
          </div>
          <div
            style={{
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginTop: "8px",
              marginBottom: "24px",
            }}
          >
            salariés dans votre équipe
          </div>

          <input
            type="range"
            min={10}
            max={100}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="heedup-sim-slider"
            style={{
              background: `linear-gradient(to right, var(--indigo) ${pct}%, rgba(67,56,202,0.15) ${pct}%)`,
            }}
          />

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "28px",
              marginTop: "10px",
              marginBottom: "28px",
            }}
          >
            {ticks.map((t, i) => {
              const active = i === activeTier;
              const left = `${((t.value - 10) / (100 - 10)) * 100}%`;
              const isFirst = t.value === 10;
              const isLast = t.value === 100;
              return (
                <div
                  key={t.value}
                  style={{
                    position: "absolute",
                    left,
                    transform: isFirst
                      ? "translateX(0)"
                      : isLast
                        ? "translateX(-100%)"
                        : "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <div
                    style={{
                      width: "1px",
                      height: "6px",
                      backgroundColor: active
                        ? "var(--indigo)"
                        : "rgba(13,27,62,0.25)",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11.5px",
                      fontWeight: active ? 700 : 500,
                      color: active ? "var(--indigo)" : "var(--midnight)",
                    }}
                  >
                    {t.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESULT */}
          <div
            style={{
              backgroundColor: "var(--midnight)",
              borderRadius: "12px",
              padding: "22px 28px",
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr auto",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.8px",
                  marginBottom: "6px",
                }}
              >
                COÛT PAR SIÈGE
              </div>
              <div
                id="sim-seat"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  color: "#FFFFFF",
                }}
              >
                {formatFR(seat)}€/siège
              </div>
            </div>
            <div
              style={{
                width: "1px",
                height: "36px",
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.8px",
                  marginBottom: "6px",
                }}
              >
                TOTAL MENSUEL
              </div>
              <div
                id="sim-total"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  color: "#FFFFFF",
                }}
              >
                {formatFR(total)}€/mois
              </div>
            </div>
            <button
              type="button"
              {...TALLY_ATTRS}
              style={{
                backgroundColor: "var(--indigo)",
                color: "#FFFFFF",
                padding: "11px 20px",
                borderRadius: "7px",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Rejoindre →
            </button>
          </div>

          <div
            id="sim-cliff"
            style={{
              display: cliff ? "flex" : "none",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(67,56,202,0.08)",
              border: "1px solid rgba(67,56,202,0.15)",
              borderRadius: "8px",
              padding: "11px 14px",
              fontFamily: "var(--font-sans)",
              fontSize: "12.5px",
              color: "var(--indigo)",
              marginTop: "14px",
            }}
          >
            <span aria-hidden>↗</span>
            <span>{cliff}</span>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
