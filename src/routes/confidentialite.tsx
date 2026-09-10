import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité et mentions légales - HeedUp" },
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
      "Éditeur : Jules Leclercq, auto-entrepreneur.\nSIRET : 90077093400017\n32 Cours Pasteur, 33000 Bordeaux, France.\nDirecteur de publication : Jules Leclercq.\nContact : contact@heedup.fr\n\nHébergement frontend : Vercel Inc., 340 Pine Street, San Francisco, CA 94104.\nHébergement des données : serveurs en France (région Paris). Les données sont hébergées en France, région Paris. Deux traitements font intervenir des prestataires établis aux États-Unis : l'envoi des emails et la génération de la synthèse des commentaires libres, à laquelle le texte libre des salariés est transmis. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne.",
  },
  {
    title: "Données collectées",
    content:
      "Côté manager : email, nom, entreprise, taille d'équipe. Les paiements sont traités par Stripe et ne sont jamais stockés par HeedUp.\n\nCôté salarié : l'email professionnel est conservé pour permettre l'envoi du questionnaire. Aucune réponse ne lui est rattachée, le lien étant supprimé au moment de la soumission. Sont collectés cinq scores numériques de 1 à 5 (charge de travail, reconnaissance, clarté, soutien, sens) et, de façon facultative, un commentaire en texte libre. Ces réponses sont associées à un token aléatoire non traçable, régénéré chaque semaine. Il est techniquement impossible de relier une réponse à un salarié identifié.\n\nTraitement du commentaire libre : le texte n'est jamais transmis au manager, ni cité, ni reformulé. Il est traité automatiquement pour produire une synthèse des thèmes récurrents à l'échelle de l'équipe. Cette synthèse exclut tout nom, projet, date ou détail attribuable à une seule personne. Le manager n'a aucun moyen d'accéder à un commentaire individuel : la donnée n'est pas exposée dans l'interface.\n\nLa documentation contractuelle (DPA et registre) est disponible sur demande à contact@heedup.fr.",
  },

  {
    title: "Nous ne pouvons pas savoir qui a répondu quoi",
    content:
      "Quand un salarié valide son questionnaire, le lien entre lui et sa réponse est effacé dans l'opération même qui enregistre la réponse. La réponse conservée ne porte aucun identifiant de personne et aucune référence au lien reçu par email.\n\nCe n'est pas une interdiction d'accès, c'est une absence de donnée. Il n'existe nulle part de table, de sauvegarde ou de journal qui permettrait de reconstituer ce lien. Personne, chez nous, ne peut obtenir une information qui n'a jamais été écrite.",
  },
  {
    title: "Votre manager ne voit que des résultats agrégés",
    content:
      "Un manager accède aux moyennes de son équipe et à une synthèse écrite, jamais à une réponse individuelle. Un rapport n'est produit qu'à partir de 5 réponses complètes, et en dessous de ce seuil aucun chiffre n'est publié.",
  },
  {
    title: "Hébergement et sécurité",
    content:
      "Toutes les données sont hébergées en France, sur des serveurs situés en région parisienne. Les communications sont chiffrées via HTTPS. Les données sont hébergées en France, région Paris. Deux traitements font intervenir des prestataires établis aux États-Unis : l'envoi des emails et la génération de la synthèse des commentaires libres, à laquelle le texte libre des salariés est transmis. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne.",
  },
  {
    title: "Sous-traitants",
    content:
      "Les données des salariés sont hébergées en France, région Paris. Les prestataires suivants interviennent dans le fonctionnement du service :\n\nSupabase, hébergement de la base de données, région Paris.\nVercel Inc., hébergement de l'interface web.\nStripe, traitement des paiements.\nResend, envoi des emails transactionnels.\nAnthropic, génération de la synthèse des commentaires libres.\nGoogle, authentification des comptes managers. Adresse email, nom et photo de profil transmis à la connexion.\n\nLa liste complète et à jour, ainsi que le registre de traitement, sont disponibles sur demande à contact@heedup.fr.",
  },
  {
    title: "Combien de temps nous conservons vos données",
    content:
      "| Ce que nous conservons | Combien de temps | À partir de quand |\n|---|---|---|\n| Les réponses aux questionnaires hebdomadaires | 12 mois | la date de la réponse |\n| Les échanges avec l'assistant du site, sans coordonnées laissées | 6 mois | le dernier message |\n| Les échanges avec l'assistant du site, avec coordonnées laissées | 24 mois | le dernier message |\n| Les comptes créés sans espace de travail | 90 jours | la création ou la dernière connexion |\n| Les rapports hebdomadaires | sans limite de durée | |\n| Les demandes de désinscription | sans limite de durée | |\n\nPourquoi les rapports ne sont pas effacés. Un rapport hebdomadaire ne contient aucune donnée permettant d'identifier une personne : ni nom, ni adresse, ni réponse individuelle. Il contient des moyennes et une synthèse rédigée à partir de l'ensemble des retours. L'intérêt du produit étant de suivre l'évolution d'une équipe dans le temps, effacer cet historique reviendrait à effacer le service rendu.\n\nPourquoi les demandes de désinscription ne sont pas effacées. Une désinscription est la trace de votre refus de recevoir nos emails. L'effacer reviendrait à l'oublier, donc à vous solliciter de nouveau. Nous la conservons précisément pour continuer à la respecter.\n\nPourquoi les échanges avec l'assistant ont deux durées. Une conversation où personne n'a laissé de coordonnées ne sert plus à rien passé quelques mois : nous l'effaçons à six mois. Une conversation où un visiteur nous a laissé son adresse pour être recontacté est conservée deux ans, parce que c'est la durée pendant laquelle ce contact garde un sens. Dans les deux cas, vous pouvez demander la suppression immédiate.",
  },
  {
    title: "Suppression des comptes inactifs",
    content:
      "Un compte créé sans espace de travail, et sans connexion depuis 90 jours, est supprimé automatiquement. C'est le cas d'une personne qui crée un compte, ne va pas au bout de la configuration, et ne revient pas. Rien n'est perdu : il n'y a par définition ni équipe, ni questionnaire, ni rapport rattaché à ce compte. Créer un nouveau compte avec la même adresse reste possible à tout moment.\n\nUn compte rattaché à un espace de travail n'est jamais supprimé automatiquement, quelle que soit la durée d'inactivité.",
  },
  {
    title: "Cookies",
    content:
      "HeedUp utilise Plausible Analytics pour la mesure d'audience, un outil sans cookie et sans donnée personnelle identifiable.\n\nHeedUp utilise également Microsoft Clarity pour analyser l'ergonomie du site. Cet outil enregistre les parcours de navigation et dépose des cookies. Il ne s'applique qu'aux visiteurs du site heedup.fr et jamais aux réponses des salariés au questionnaire.\n\nVous pouvez refuser ce dépôt via les paramètres de votre navigateur.",
  },

  {
    title: "Vos droits",
    content:
      "Vous pouvez à tout moment demander l'accès, la rectification ou la suppression de vos données, ainsi que la suppression immédiate d'un échange avec l'assistant, en écrivant à contact@heedup.fr. Une demande de suppression est traitée sans attendre l'échéance des durées ci-dessus.\n\nLe questionnaire hebdomadaire peut être arrêté à tout moment depuis le lien présent en bas de chaque email, sans passer par votre employeur, qui n'est pas informé des désinscriptions individuelles.\n\nRéclamation possible auprès de la CNIL : www.cnil.fr",
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
            Dernière mise à jour : 10 septembre 2026
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
