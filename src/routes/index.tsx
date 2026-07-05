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
          height: "calc(100vh - 84px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-main)",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 5%",
          }}
        >
          <div className="grid w-full items-center md:grid-cols-2" style={{ gap: "64px" }}>
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-2"
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
                  className="inline-flex items-center gap-2"
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
                    style={{ backgroundColor: "var(--indigo)", width: "22px", height: "22px" }}
                  >
                    <span style={{ fontSize: "12px", color: "#FFFFFF" }}>!</span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
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
          style={{
            backgroundColor: "var(--midnight)",
            padding: "16px 5%",
          }}
        >
          <div className="flex flex-wrap items-center justify-center" style={{ gap: "36px" }}>
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

      {/* Feature cards conservées */}
      <section
        className="mx-auto grid gap-6 px-[5%] pb-24 pt-16 md:grid-cols-3"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
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
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              padding: "28px",
              border: "1px solid rgba(67,56,202,0.1)",
            }}
          >
            <h3 style={{ fontSize: "22px", color: "var(--midnight)" }}>{c.t}</h3>
            <p
              className="mt-3"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                lineHeight: 1.6,
                color: "var(--text-muted)",
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
