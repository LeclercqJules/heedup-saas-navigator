import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité et mentions légales — HeedUp" },
      {
        name: "description",
        content:
          "Politique de confidentialité et mentions légales de HeedUp : hébergement en France, anonymat des réponses, droits RGPD.",
      },
    ],
  }),
  component: Page,
});

const sections: { title: string; content: string }[] = [
  {
    title: "Mentions légales",
    content:
      "Éditeur : Jules Leclercq, auto-entrepreneur.\nSIRET : 90077093400017\n32 Cours Pasteur, 33000 Bordeaux, France.\nDirecteur de publication : Jules Leclercq.\nContact : contact@heedup.fr\n\nHébergement frontend : Vercel Inc., 340 Pine Street, San Francisco, CA 94104.\nHébergement des données : serveurs en France (région Paris). Aucune donnée personnelle ne transite hors de l'Union Européenne.",
  },
  {
    title: "Données collectées",
    content:
      "Côté manager : email, nom, entreprise, taille d'équipe. Les paiements sont traités par Stripe et ne sont jamais stockés par HeedUp.\n\nCôté salarié : aucune donnée nominative. Sont collectés cinq scores numériques de 1 à 5 (charge de travail, reconnaissance, clarté, soutien, sens) et, de façon facultative, un commentaire en texte libre. Ces réponses sont associées à un token aléatoire non traçable, régénéré chaque semaine. Il est techniquement impossible de relier une réponse à un salarié identifié.\n\nTraitement du commentaire libre : le texte n'est jamais transmis au manager, ni cité, ni reformulé. Il est traité automatiquement pour produire une synthèse des thèmes récurrents à l'échelle de l'équipe. Cette synthèse exclut tout nom, projet, date ou détail attribuable à une seule personne. Le manager n'a aucun moyen d'accéder à un commentaire individuel : la donnée n'est pas exposée dans l'interface.\n\nLa documentation contractuelle (DPA et registre) est disponible sur demande à contact@heedup.fr.",
  },

  {
    title: "Anonymat des réponses",
    content:
      "L'anonymat est une contrainte d'architecture, pas un paramètre désactivable. Même HeedUp ne peut pas identifier l'auteur d'une réponse individuelle. En dessous de 5 réponses sur la semaine, aucun rapport n'est généré : ni scores, ni synthèse. Sur une petite équipe, un chiffre isolé serait identifiable.",
  },
  {
    title: "Hébergement et sécurité",
    content:
      "Toutes les données sont hébergées en France, sur des serveurs situés en région parisienne. Les communications sont chiffrées via HTTPS. Aucune donnée personnelle ne transite hors de l'Union Européenne.",
  },
  {
    title: "Sous-traitants",
    content:
      "Les données des salariés sont hébergées en France, région Paris. Les prestataires suivants interviennent dans le fonctionnement du service :\n\nSupabase, hébergement de la base de données, région Paris.\nVercel Inc., hébergement de l'interface web.\nStripe, traitement des paiements.\nResend, envoi des emails transactionnels.\nAnthropic, génération de la synthèse des commentaires libres.\n\nLa liste complète et à jour, ainsi que le registre de traitement, sont disponibles sur demande à contact@heedup.fr.",
  },
  {
    title: "Durée de conservation",
    content:
      "Réponses anonymisées et commentaires libres : 12 mois glissants, puis suppression.\nDonnées managers : durée de l'abonnement plus 12 mois après résiliation.\nDonnées de facturation : 10 ans (obligation légale comptable).",
  },
  {
    title: "Cookies",
    content:
      "HeedUp utilise Plausible Analytics pour la mesure d'audience, un outil sans cookie et sans donnée personnelle identifiable.\n\nHeedUp utilise également Microsoft Clarity pour analyser l'ergonomie du site. Cet outil enregistre les parcours de navigation et dépose des cookies. Il ne s'applique qu'aux visiteurs du site heedup.fr et jamais aux réponses des salariés au questionnaire.\n\nVous pouvez refuser ce dépôt via les paramètres de votre navigateur.",
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
      <section className="heedup-legal" style={{ backgroundColor: "var(--bg-main)", padding: "64px 5%" }}>
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
            Confidentialité et mentions légales
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
                  borderTop: index > 0 ? "1px solid rgba(67,56,202,0.08)" : "none",
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
