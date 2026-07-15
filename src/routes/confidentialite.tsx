import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité — HeedUp" },
      {
        name: "description",
        content:
          "Politique de confidentialité de HeedUp : hébergement en France, anonymat des réponses, droits RGPD.",
      },
    ],
  }),
  component: Page,
});

const sections = [
  {
    title: "Éditeur",
    content:
      "Jules Leclercq, auto-entrepreneur.\nSIRET : 90077093400017\n32 Cours Pasteur, 33000 Bordeaux, France.\nContact : contact@heedup.fr",
  },
  {
    title: "Hébergement",
    content:
      "Les données HeedUp sont hébergées en France, sur des serveurs situés en région parisienne. Aucune donnée ne transite hors de l'Union Européenne.",
  },
  {
    title: "Données collectées",
    content:
      "Côté manager : email, nom, entreprise, taille d'équipe. Les paiements sont traités par Stripe et ne sont jamais stockés par HeedUp.\n\nCôté salarié : aucune donnée nominative. Les réponses sont associées à un token aléatoire non-traçable, régénéré chaque semaine. Il est techniquement impossible de relier une réponse à un salarié identifié.",
  },
  {
    title: "Anonymat des réponses",
    content:
      "L'anonymat est une contrainte d'architecture, pas un paramètre désactivable. Même HeedUp ne peut pas identifier l'auteur d'une réponse individuelle. En dessous de 5 répondants, aucun score n'est affiché.",
  },
  {
    title: "Vos droits",
    content:
      "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande : contact@heedup.fr\n\nRéclamation possible auprès de la CNIL : www.cnil.fr",
  },
];

function Page() {
  return (
    <SiteLayout>
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "64px 5%",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "42px",
              color: "var(--midnight)",
              letterSpacing: "-0.8px",
              marginBottom: "8px",
            }}
          >
            Confidentialité
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--text-muted)",
              marginBottom: "48px",
            }}
          >
            Dernière mise à jour : juillet 2025
          </p>

          {sections.map((section, index) => (
            <div key={section.title}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  color: "var(--midnight)",
                  paddingTop: "36px",
                  marginBottom: "10px",
                  borderTop:
                    index > 0
                      ? "1px solid rgba(67,56,202,0.08)"
                      : "none",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </p>
            </div>
          ))}

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "var(--midnight)",
              paddingTop: "36px",
              marginBottom: "10px",
              borderTop: "1px solid rgba(67,56,202,0.08)",
            }}
          >
            Contact
          </h2>
          <div
            style={{
              background: "#EEEEFF",
              borderRadius: "10px",
              padding: "20px 24px",
              border: "1px solid rgba(67,56,202,0.15)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--midnight)",
              fontWeight: 500,
              lineHeight: 2,
            }}
          >
            contact@heedup.fr
            <br />
            32 Cours Pasteur, 33000 Bordeaux, France
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
