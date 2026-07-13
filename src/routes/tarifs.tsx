import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

const THUMB = 20; // px
const MIN = 10;
const MAX = 100;

function calcPrice(n: number) {
  if (n < 25) return { seat: 5.0, total: n * 5.0 };
  if (n < 50) return { seat: 4.5, total: n * 4.5 };
  if (n < 100) {
    const total = 200 + (n - 50) * 3.75;
    return { seat: parseFloat((total / n).toFixed(2)), total };
  }
  return { seat: 3.5, total: n * 3.5 };
}

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",");
}

function getSavings(n: number): string | null {
  if (n >= 23 && n < 25) {
    const saving = fmt(n * 5.0 - 112.5);
    const extra = 25 - n;
    return `En passant à 25 sièges, vous économisez ${saving}€/mois et pouvez couvrir ${extra} salarié${extra > 1 ? "s" : ""} supplémentaire${extra > 1 ? "s" : ""}.`;
  }
  if (n >= 45 && n < 50) {
    const saving = fmt(n * 4.5 - 200);
    const extra = 50 - n;
    return `En passant à 50 sièges, vous économisez ${saving}€/mois et pouvez couvrir ${extra} salarié${extra > 1 ? "s" : ""} supplémentaire${extra > 1 ? "s" : ""}.`;
  }
  if (n >= 91 && n < 100) {
    const saving = fmt(200 + (n - 50) * 3.75 - 350);
    const extra = 100 - n;
    return `En passant à 100 sièges, vous économisez ${saving}€/mois et pouvez couvrir ${extra} salarié${extra > 1 ? "s" : ""} supplémentaire${extra > 1 ? "s" : ""}.`;
  }
  return null;
}

function tickLeft(v: number) {
  return `calc(${THUMB / 2}px + ${(v - MIN) / (MAX - MIN)} * (100% - ${THUMB}px))`;
}

function activeTier(n: number) {
  if (n < 25) return 10;
  if (n < 50) return 25;
  if (n < 100) return 50;
  return 100;
}

function PricingSimulator() {
  const [val, setVal] = useState(25);
  const sliderRef = useRef<HTMLInputElement>(null);

  const updateGradient = (n: number) => {
    if (!sliderRef.current) return;
    const pct = ((n - MIN) / (MAX - MIN)) * 100;
    sliderRef.current.style.background = `linear-gradient(to right, var(--indigo) ${pct}%, rgba(67,56,202,0.15) ${pct}%)`;
  };

  useEffect(() => {
    updateGradient(25);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value);
    setVal(n);
    updateGradient(n);
  };

  const price = calcPrice(val);
  const savings = getSavings(val);
  const tier = activeTier(val);

  const ticks = [
    { v: 10, label: "10", sub: "5,00€/siège" },
    { v: 25, label: "25", sub: "4,50€/siège" },
    { v: 50, label: "50", sub: "dès 4,00€/siège" },
    { v: 100, label: "100", sub: "3,50€/siège" },
  ];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        borderRadius: 16,
        border: "1px solid rgba(67,56,202,0.10)",
        padding: "36px 40px",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      {/* Label */}
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          color: "rgba(13,27,62,0.35)",
          marginBottom: 16,
        }}
      >
        Nombre de salariés
      </div>

      {/* Counter */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: 56,
          color: "var(--midnight)",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {val}
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 24,
        }}
      >
        salariés dans votre équipe
      </div>

      {/* Slider */}
      <div style={{ position: "relative", marginBottom: 0 }}>
        <input
          ref={sliderRef}
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={val}
          onChange={handleChange}
          style={{ width: "100%", height: 5, borderRadius: 3 }}
        />

        {/* Ticks */}
        <div style={{ position: "relative", height: 36, marginTop: 6 }}>
          {ticks.map((t) => (
            <div
              key={t.v}
              style={{
                position: "absolute",
                left: tickLeft(t.v),
                transform: "translateX(-50%)",
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
                  background: tier === t.v ? "var(--indigo)" : "rgba(13,27,62,0.2)",
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: tier === t.v ? 700 : 500,
                  color: tier === t.v ? "var(--indigo)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {t.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result bar */}
      <div
        style={{
          background: "var(--midnight)",
          borderRadius: 12,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 6,
            }}
          >
            Coût par siège
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "#fff",
            }}
          >
            {fmt(price.seat)}€/siège
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)" }} />
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 6,
            }}
          >
            Total mensuel
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              color: "#fff",
            }}
          >
            {fmt(price.total)}€/mois
          </div>
        </div>
        <button
          type="button"
          {...TALLY_ATTRS}
          style={{
            background: "var(--indigo)",
            color: "#fff",
            border: "none",
            padding: "11px 22px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Rejoindre →
        </button>
      </div>

      {/* Savings message */}
      {savings && (
        <div
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 8,
            padding: "11px 14px",
            fontSize: 12.5,
            color: "#15803d",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
          }}
        >
          ↘ {savings}
        </div>
      )}
    </div>
  );
}

function Page() {
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
          padding: "48px 5%",
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
            gap: "16px",
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
                  backgroundColor: "var(--bg-main)",
                  boxShadow: featured
                    ? "0 8px 32px rgba(13,27,62,0.12)"
                    : undefined,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* HEADER */}
                <div
                  style={{
                    padding: "28px 24px 20px",
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
                        fontSize: "9px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        marginBottom: "12px",
                        letterSpacing: "0.6px",
                      }}
                    >
                      Le plus choisi
                    </span>
                  )}
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: featured
                        ? "rgba(255,255,255,0.4)"
                        : "var(--midnight)",
                      opacity: featured ? 1 : 0.35,
                      marginBottom: "14px",
                    }}
                  >
                    {c.range}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "44px",
                      letterSpacing: "-1px",
                      color: featured ? "#FFFFFF" : "var(--midnight)",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    {c.price}
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        opacity: 0.35,
                        marginLeft: "4px",
                      }}
                    >
                      {c.priceSuffix}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "11px",
                      color: featured ? "rgba(255,255,255,0.45)" : "var(--text-muted)",
                      marginBottom: "16px",
                    }}
                  >
                    par siège, par mois
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: featured
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(67,56,202,0.07)",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      color: featured ? "rgba(255,255,255,0.6)" : "var(--midnight)",
                      opacity: featured ? 1 : 0.55,
                    }}
                  >
                    {c.total}
                  </div>
                </div>
                {/* BODY */}
                <div
                  style={{
                    padding: "20px 24px",
                    backgroundColor: "var(--bg-card)",
                    marginTop: "auto",
                  }}
                >
                  <button
                    type="button"
                    {...TALLY_ATTRS}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
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
          padding: "48px 5%",
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

        <PricingSimulator />
      </section>
    </SiteLayout>
  );
}
