import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section
        style={{
          height: "calc(100vh - 72px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 5%",
          }}
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Colonne gauche : texte */}
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#0F1B33",
                  color: "#C9A06A",
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
                className="mt-5"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "36px",
                  lineHeight: 1.15,
                  color: "#0F1B33",
                }}
              >
                Votre prochain départ surprise, vous l'aurez{" "}
                <span style={{ color: "#C9A06A" }}>vu venir</span>.
              </h1>

              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-sans)",
                  maxWidth: "440px",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(15,27,51,0.65)",
                }}
              >
                5 questions anonymes à votre équipe chaque vendredi.
                <br />
                Un rapport d'équipe le lundi avec les signaux d'alerte et les actions à prendre.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <a
                  href="#waitlist"
                  className="mt-7 inline-flex items-center gap-2"
                  style={{
                    backgroundColor: "#C9A06A",
                    color: "#0F1B33",
                    fontWeight: 600,
                    fontSize: "15px",
                    borderRadius: "8px",
                    padding: "13px 24px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Rejoindre la liste d'attente →
                </a>

                <div
                  className="inline-flex items-center gap-2"
                  style={{
                    marginTop: "12px",
                    backgroundColor: "rgba(15,27,51,0.05)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    alignSelf: "flex-start",
                  }}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-[#7A9B8E] animate-pulse" />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0F1B33",
                    }}
                  >
                    27 dirigeants déjà sur la liste d'attente
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne droite : carte */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "13px",
                border: "1px solid rgba(15,27,51,0.12)",
                overflow: "hidden",
                fontFamily: "var(--font-sans)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: "#0F1B33",
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#FFFFFF",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "#C9A06A" }}>●</span>
                  Rapport d'équipe — Lundi 16 juin
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                  Semaine 24
                </div>
              </div>

              {/* 3 scores */}
              <div
                className="grid grid-cols-3 gap-3 p-4"
                style={{ backgroundColor: "#F7F5F0" }}
              >
                {[
                  { label: "Charge", value: "3.6", change: "▼ 0.3", changeColor: "#B23A48" },
                  { label: "Ambiance", value: "4.1", change: "▲ 0.2", changeColor: "#3A7D44" },
                  { label: "Motivation", value: "4.3", change: "—", changeColor: "#9A9A9A" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg p-3 text-center"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(15,27,51,0.45)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "4px",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#0F1B33",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: "11px", color: s.changeColor, marginTop: "4px" }}>
                      {s.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommandations */}
              <div className="px-5 pt-4 pb-1">
                <div
                  style={{
                    fontSize: "9.5px",
                    color: "rgba(15,27,51,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Recommandations IA
                </div>
                <div
                  className="mb-3 flex items-start gap-3 rounded-lg p-3"
                  style={{ backgroundColor: "rgba(201,160,106,0.10)" }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "#0F1B33", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "10px", color: "#C9A06A" }}>↓</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "rgba(15,27,51,0.85)",
                    }}
                  >
                    Charge en baisse 2 semaines. Organisez un point d'équipe avant vendredi.
                  </p>
                </div>
                <div
                  className="mb-3 flex items-start gap-3 rounded-lg p-3"
                  style={{ backgroundColor: "rgba(201,160,106,0.10)" }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "#0F1B33", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "10px", color: "#C9A06A" }}>↑</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "rgba(15,27,51,0.85)",
                    }}
                  >
                    Ambiance en hausse. Bon moment pour lancer un projet à forte visibilité.
                  </p>
                </div>
                <div
                  className="mb-3 flex items-start gap-3 rounded-lg border border-[#C9A06A] p-3"
                  style={{ backgroundColor: "rgba(201,160,106,0.10)" }}
                >
                  <div
                    className="flex flex-shrink-0 items-center justify-center"
                    style={{ backgroundColor: "#C9A06A", width: "18px", height: "18px" }}
                  >
                    <span style={{ fontSize: "10px", color: "#0F1B33" }}>!</span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "rgba(15,27,51,0.85)",
                    }}
                  >
                    2 employés n'ont pas répondu cette semaine. Envoie un rappel discret avant vendredi — le silence est aussi un signal.
                  </p>
                </div>
              </div>

              {/* Footer carte */}
              <div className="px-5 pb-5 pt-2">
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(15,27,51,0.55)",
                    marginBottom: "8px",
                  }}
                >
                  Taux de réponse : 8 / 10 employés
                </div>
                <div
                  style={{
                    height: "6px",
                    backgroundColor: "rgba(15,27,51,0.08)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      height: "100%",
                      backgroundColor: "#7A9B8E",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div
          style={{
            backgroundColor: "#0F1B33",
            padding: "14px 5%",
          }}
        >
          <div className="flex flex-wrap items-center justify-center" style={{ gap: "32px" }}>
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
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                <span style={{ color: "#C9A06A" }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards conservées */}
      <section className="mx-auto grid gap-6 px-[5%] pb-24 pt-16 md:grid-cols-3">
        {[
          {
            t: "Signaux faibles",
            d: "Repérez les micro-changements dans l'engagement avant qu'ils ne se transforment en départ.",
          },
          {
            t: "Alertes précoces",
            d: "Recevez une alerte contextuelle dès qu'un collaborateur entre dans une zone de risque.",
          },
          {
            t: "Conforme RGPD",
            d: "Données hébergées en France, chiffrées et pseudonymisées par défaut.",
          },
        ].map((c) => (
          <div
            key={c.t}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "28px",
              border: "1px solid rgba(15,27,51,0.08)",
            }}
          >
            <h3 style={{ fontSize: "22px" }}>{c.t}</h3>
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(15,27,51,0.65)",
              }}
            >
              {c.d}
            </p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
