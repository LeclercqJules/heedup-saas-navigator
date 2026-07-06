import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Calculator } from "lucide-react";


export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="heedup-hero"
        style={{
          height: "calc(100vh - 84px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-main)",
        }}
      >
        <div
          className="heedup-hero-inner"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 5%",
          }}
        >
          <div className="heedup-hero-grid grid w-full items-center md:grid-cols-2" style={{ gap: "64px" }}>
            {/* Colonne gauche : texte */}
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "var(--indigo-pale)",
                  color: "var(--midnight)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "5px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Votre équipe, enfin lisible.
              </span>

              <h1
                className="heedup-hero-h1"
                style={{
                  fontFamily: "var(--font-display)",
                fontSize: "58px",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
                color: "var(--midnight)",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                Votre prochain départ surprise, vous l'aurez{" "}
                <span style={{ fontStyle: "italic", color: "var(--indigo)" }}>vu venir</span>.
              </h1>

              <p
                className="heedup-hero-sub"
                style={{
                  fontFamily: "var(--font-sans)",
                  maxWidth: "460px",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  color: "var(--text-muted)",
                  marginBottom: "32px",
                }}
              >
                Pilotez votre équipe sans devenir RH. 5 questions anonymes chaque vendredi, un rapport d'équipe actionnable chaque lundi.
              </p>

              <div
                className="heedup-hero-actions"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <a
                  href="#waitlist"
                  className="heedup-hero-cta inline-flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--indigo)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "16px",
                    borderRadius: "8px",
                    padding: "15px 28px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Rejoindre la liste d'attente →
                </a>

                <div
                  className="heedup-hero-social inline-flex items-center gap-2"
                  style={{
                    marginTop: "14px",
                    backgroundColor: "rgba(67,56,202,0.07)",
                    borderRadius: "20px",
                    padding: "7px 16px",
                    alignSelf: "flex-start",
                  }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--semantic-green)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--midnight)",
                    }}
                  >
                    27 dirigeants déjà sur la liste d'attente
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne droite : carte */}
            <div
              className="heedup-hero-card"
              style={{
                backgroundColor: "var(--bg-card)",
                borderRadius: "15px",
                border: "1px solid rgba(67,56,202,0.12)",
                overflow: "hidden",
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Header */}
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
                  Rapport d'équipe — Lundi 16 juin
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  Semaine 24
                </div>
              </div>

              {/* 3 scores */}
              <div
                className="grid grid-cols-3 gap-4 p-5"
                style={{ backgroundColor: "var(--bg-main)" }}
              >
                {[
                  { label: "Charge", value: "3.6", change: "▼ 0.3", changeColor: "var(--semantic-red)" },
                  { label: "Ambiance", value: "4.1", change: "▲ 0.2", changeColor: "var(--semantic-green)" },
                  { label: "Motivation", value: "4.3", change: "—", changeColor: "var(--text-muted)" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-4 text-center"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
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
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: "12px", color: s.changeColor, marginTop: "4px" }}>
                      {s.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommandations */}
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
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--semantic-red)", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "11px", color: "#FFFFFF" }}>↓</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                    }}
                  >
                    Charge en baisse 2 semaines. Organisez un point d'équipe avant vendredi.
                  </p>
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.18)",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--semantic-green)", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "11px", color: "#FFFFFF" }}>↑</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                    }}
                  >
                    Ambiance en hausse. Bon moment pour lancer un projet à forte visibilité.
                  </p>
                </div>
                <div
                  className="mb-4 flex items-start gap-3 rounded-lg p-4"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--semantic-red)", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "11px", color: "#FFFFFF" }}>!</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "var(--text-primary)",
                    }}
                  >
                    2 employés n'ont pas répondu cette semaine. Envoie un rappel discret avant vendredi — le silence est aussi un signal.
                  </p>
                </div>
              </div>

              {/* Footer carte */}
              <div className="px-6 pb-6 pt-3">
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    marginBottom: "10px",
                  }}
                >
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
                      width: "80%",
                      height: "100%",
                      backgroundColor: "var(--indigo)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          className="heedup-trust"
          style={{
            backgroundColor: "var(--midnight)",
            padding: "16px 5%",
          }}
        >
          <div className="heedup-trust-inner flex flex-wrap items-center justify-center" style={{ gap: "36px" }}>
            {[
              "RGPD natif",
              "Hébergé en France",
              "Réponses anonymes",
              "Actif en 10 minutes",
              "Sans engagement",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span style={{ color: "var(--indigo-pale)" }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact business */}
      <section
        className="heedup-impact"
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "64px 3%",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: "40px" }}>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.9px",
                textTransform: "uppercase",
                color: "var(--midnight)",
                opacity: 0.35,
                marginBottom: "12px",
              }}
            >
              IMPACT BUSINESS
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "42px",
                letterSpacing: "-0.8px",
                lineHeight: 1.15,
                color: "var(--midnight)",
                marginBottom: "12px",
              }}
            >
              Ce que les données disent de vos équipes.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "19px",
                lineHeight: 1.65,
                color: "var(--text-muted)",
                marginBottom: "40px",
                maxWidth: "620px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              On ne perd pas un salarié le jour de sa démission. On le perd bien avant, en silence.
            </p>
          </div>

          <div
            className="grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                eyebrow: "TAUX D'ENGAGEMENT",
                figure: "13 %",
                label: "des salariés français réellement engagés dans leur travail, l'un des taux les plus bas en Europe.",
                source: "Gallup, 2024",
              },
              {
                eyebrow: "COÛT CHRONIQUE",
                figure: "~14 300 €",
                label: "par salarié et par an, le coût du désengagement en France, avant même le moindre départ.",
                source: "IBET, 2024",
              },
              {
                eyebrow: "COÛT D'UN DÉPART",
                figure: "15–30 K€",
                label: "le coût réel d'un départ en PME, recrutement, formation et désorganisation compris.",
                source: "Deloitte, 2024",
              },
              {
                eyebrow: "LE LEVIER MANAGER",
                figure: "70 %",
                label: "du climat d'équipe dépend directement du manager, pas de la politique RH globale.",
                source: "Gallup, 2024",
              },
            ].map((c) => (
              <div
                key={c.figure}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid rgba(67,56,202,0.10)",
                  borderTop: "3px solid var(--midnight)",
                  borderRadius: "12px",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  {c.eyebrow}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "52px",
                    lineHeight: 1,
                    color: "var(--midnight)",
                  }}
                >
                  {c.figure}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "14.5px",
                    lineHeight: 1.6,
                    color: "var(--text-primary)",
                    flex: 1,
                  }}
                >
                  {c.label}
                </p>
                <span
                  style={{
                    backgroundColor: "#EEEEFF",
                    color: "var(--midnight)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    display: "inline-block",
                    alignSelf: "flex-start",
                  }}
                >
                  {c.source}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "32px" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "14px",
              }}
            >
              Combien vous coûte réellement le désengagement dans votre équipe ?
            </p>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2"
              style={{
                backgroundColor: "var(--indigo)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "16px",
                borderRadius: "8px",
                padding: "14px 32px",
                fontFamily: "var(--font-sans)",
              }}
            >
              <Calculator size={18} strokeWidth={2} />
              Estimer le coût pour mon équipe
            </a>
          </div>
        </div>
      </section>



    </SiteLayout>
  );
}
