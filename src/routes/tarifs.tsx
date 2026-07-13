import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  IconSend,
  IconBrain,
  IconShieldCheck,
  IconEyeOff,
  IconHeadset,
  IconCreditCardOff,
  IconTag,
  IconRefresh,
} from "@tabler/icons-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs - HeedUp" },
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

const features = [
  {
    icon: IconSend,
    title: "Survey hebdomadaire automatique",
    desc: "Envoi automatique chaque vendredi à vos salariés. Aucune intervention requise de votre côté.",
  },
  {
    icon: IconBrain,
    title: "Rapport d'équipe IA chaque lundi",
    desc: "Scores, tendances et recommandations managériales actionnables générées par IA.",
  },
  {
    icon: IconShieldCheck,
    title: "RGPD documenté et vérifiable",
    desc: "DPA fourni à la signature, registre de traitement inclus, hébergement Paris eu-west-3.",
  },
  {
    icon: IconEyeOff,
    title: "Anonymat architectural",
    desc: "Réponses individuelles inaccessibles par conception. Jamais un paramètre désactivable.",
  },
  {
    icon: IconHeadset,
    title: "Support en français",
    desc: "Réponse sous 24h ouvrées par email, en français, sans chatbot.",
  },
  {
    icon: IconCreditCardOff,
    title: "Sans engagement annuel obligatoire",
    desc: "Facturation mensuelle ou annuelle. Résiliation libre depuis votre espace client.",
  },
];

function SectionFeatures() {
  return (
    <section
      style={{
        backgroundColor: "#EEEEFF",
        padding: "52px 5%",
        borderTop: "1px solid rgba(67,56,202,0.08)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            letterSpacing: "-0.5px",
            color: "var(--midnight)",
          }}
        >
          Tout est inclus. Dès le premier plan.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            color: "var(--text-muted)",
            marginTop: 10,
          }}
        >
          Aucun module à débloquer, aucune feature réservée aux plans supérieurs.
        </p>
      </div>

      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              style={{
                backgroundColor: "var(--bg-main)",
                borderRadius: 12,
                padding: 22,
                border: "1px solid rgba(67,56,202,0.08)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: "var(--midnight)",
                  color: "#EEEEFF",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} strokeWidth={2} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--midnight)",
                  marginBottom: 4,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.55,
                }}
              >
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const faqItems = [
  {
    q: "Comment est calculé mon tarif ?",
    a: "Le prix est calculé par siège, selon le palier correspondant à la taille de votre équipe. Le nombre de sièges correspond au nombre de salariés que vous invitez à répondre au survey. Plus votre équipe est grande, moins vous payez par siège.",
  },
  {
    q: "Que se passe-t-il si j'embauche et change de palier ?",
    a: "Votre facture est automatiquement recalculée au nouveau palier. Attention : franchir un seuil (25, 50 ou 100 salariés) peut réduire votre facture, car le tarif par siège du nouveau palier s'applique à l'ensemble des sièges. Le simulateur ci-dessus vous indique précisément ces zones d'économie.",
  },
  {
    q: "Quelle est la différence entre facturation mensuelle et annuelle ?",
    a: "La facturation mensuelle est disponible sans engagement. L'option annuelle offre une remise sur le tarif mensuel équivalent. Les deux options sont disponibles depuis votre espace client.",
  },
  {
    q: "Puis-je résilier à tout moment ?",
    a: "Oui, sans préavis ni frais de résiliation. Vous pouvez résilier depuis votre espace client à tout moment. La résiliation prend effet à la fin de la période de facturation en cours.",
  },
  {
    q: "Y a-t-il des frais cachés ?",
    a: "Non. Le prix affiché est le prix payé. Aucun frais d'installation, aucun onboarding payant, aucun module à débloquer, support inclus dans tous les plans. Ce que vous lisez est ce que vous payez.",
  },
  {
    q: "Mon équipe dépasse 100 salariés. HeedUp est-il adapté ?",
    a: "HeedUp est calibré pour les équipes de 10 à 100 salariés. Au-delà, contactez-nous directement via le formulaire de liste d'attente. Nous évaluerons ensemble si le produit correspond à votre contexte ou si nous pouvons vous orienter.",
  },
];

function SectionFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        backgroundColor: "var(--bg-main)",
        padding: "52px 5%",
        borderTop: "1px solid rgba(67,56,202,0.08)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 32,
          letterSpacing: "-0.5px",
          color: "var(--midnight)",
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        Questions sur les tarifs
      </h2>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {faqItems.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{ borderBottom: "1px solid rgba(67,56,202,0.08)", padding: 0 }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "20px 0",
                  cursor: "pointer",
                  userSelect: "none",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--midnight)",
                  lineHeight: 1.4,
                }}
              >
                <span>{item.q}</span>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: isOpen ? "var(--indigo)" : "#EEEEFF",
                    color: isOpen ? "#FFFFFF" : "var(--indigo)",
                    flexShrink: 0,
                    marginTop: 1,
                    fontSize: 14,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s",
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13.5,
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    paddingBottom: 20,
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionCta() {
  return (
    <section
      style={{
        backgroundColor: "#EEEEFF",
        padding: "64px 5%",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 36,
          letterSpacing: "-0.5px",
          color: "var(--midnight)",
          marginBottom: 10,
        }}
      >
        Prêt à démarrer ce vendredi ?
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          color: "var(--text-muted)",
          marginBottom: 26,
          lineHeight: 1.6,
        }}
      >
        Rejoignez les 27 dirigeants déjà sur la liste d'attente. Lancement dans les prochaines semaines.
      </p>
      <button
        type="button"
        {...TALLY_ATTRS}
        style={{
          backgroundColor: "var(--indigo)",
          color: "#FFFFFF",
          padding: "14px 32px",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
        }}
      >
        Rejoindre la liste d'attente →
      </button>
    </section>
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
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Colonne gauche */}
          <div>
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
                maxWidth: "520px",
                marginTop: "16px",
                lineHeight: 1.6,
              }}
            >
              Prix calculé par siège, affiché avant toute inscription. Aucun appel
              commercial requis.
            </p>
          </div>

          {/* Colonne droite : card comparatif */}
          <div
            style={{
              backgroundColor: "var(--midnight)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            {[
              { price: "5,00€", suffix: "/siège", seats: "10 salariés", featured: false },
              { price: "4,50€", suffix: "/siège", seats: "25 salariés", featured: true },
              { price: "4,00€", suffix: "/siège", seats: "50 salariés", featured: false },
              { price: "3,50€", suffix: "/siège", seats: "100 salariés", featured: false },
            ].map((row, i, arr) => (
              <div
                key={row.seats}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: i === 0 ? "0 0 14px" : i === arr.length - 1 ? "14px 0 0" : "14px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    color: "#FFFFFF",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                  }}
                >
                  {row.price}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "12px",
                      opacity: 0.45,
                      fontWeight: 500,
                    }}
                  >
                    {row.suffix}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {row.seats}
                  {row.featured && (
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "var(--indigo)",
                        color: "#FFFFFF",
                        fontSize: "9px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        letterSpacing: "0.6px",
                      }}
                    >
                      Le plus choisi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {/* TRUST BAR */}
      <section
        style={{
          backgroundColor: "var(--midnight)",
          padding: "16px 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: IconTag, text: "Prix affiché sans devis" },
          { icon: IconCreditCardOff, text: "Sans engagement annuel" },
          { icon: IconRefresh, text: "Résiliation libre" },
          { icon: IconHeadset, text: "Support inclus" },
          { icon: IconShieldCheck, text: "RGPD documenté" },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.65)",
              whiteSpace: "nowrap",
            }}
          >
            <item.icon size={16} strokeWidth={2} color="var(--indigo-pale)" />
            <span>{item.text}</span>
          </div>
        ))}
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

      <SectionFeatures />
      <SectionFaq />
      <SectionCta />
    </SiteLayout>
  );
}
