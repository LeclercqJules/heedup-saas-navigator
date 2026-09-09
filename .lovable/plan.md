# Sortie de la phase bêta

## Occurrences trouvées avant modification

### Changements couverts
- `src/components/Nav.tsx:143` et `src/components/Nav.tsx:307` : « Accéder au lancement », versions bureau et mobile de la navigation.
- `src/components/SiteLayout.tsx:108` et `src/components/SiteLayout.tsx:140` : annonce du lancement et accès bêta dans le bandeau supérieur.
- `src/routes/index.tsx:490-500` : bloc social proof de l’accueil avec compteur et liste d’attente.
- `src/routes/index.tsx:1399` : bloc social proof final avec liste d’attente et lancement prévu.
- `src/routes/fonctionnalites.tsx:1063` : bloc social proof final avec liste d’attente et lancement prévu.
- `src/routes/tarifs.tsx:1025` : bloc social proof final avec liste d’attente et lancement prévu.
- `src/routes/bienvenue.tsx:789-790` et `src/routes/bienvenue.tsx:845` : variante de lancement à venir et variante courte du bloc social proof.
- `src/routes/onboarding.tsx:232-246` : écran de refus et liste d’attente réintroduits par erreur, contrairement à la contrainte explicite.

### Changements désormais couverts
- `src/routes/index.tsx:435` et `src/routes/index.tsx:1425` : boutons « Accéder au lancement » hors navigation.
- `src/routes/fonctionnalites.tsx:1085` : bouton « Accéder au lancement » hors navigation.
- `src/routes/tarifs.tsx:1041` : bouton « Accéder au lancement » hors navigation.
- `src/routes/bienvenue.tsx:335` et `src/routes/bienvenue.tsx:793` : boutons « Accéder au lancement » hors navigation.
- `src/routes/estimer-cout.tsx:334` : bouton « Accéder au lancement » hors navigation.
- `src/components/CostCalculatorModal.tsx:368` : bouton « Accéder au lancement » dans la fenêtre d’estimation.
- `src/components/StickyCTA.tsx:51` : bouton mobile sticky « Accéder au lancement ».

### Occurrences trouvées mais non couvertes, laissées inchangées
- `src/routes/tarifs.tsx:530` : réponse FAQ mentionnant un formulaire de liste d’attente pour les équipes de plus de 100 salariés.
- `src/hooks/useTallyCount.ts:1` et `src/hooks/use-waitlist-count.ts:1` : valeur technique `22`, sans texte affiché directement.

## Modifications prévues

1. Remplacer les deux CTA de navigation et les neuf CTA marketing recensés par « Créer mon espace », tous reliés à `/connexion`.
2. Remplacer les deux textes du bandeau supérieur par « 2 premiers rapports gratuits, sans carte bancaire » et « Commencer maintenant ».
3. Uniformiser tous les blocs social proof identifiés avec « Déjà plus de 20 managers partenaires », sans compteur dynamique ni mention de lancement futur.
4. Retirer l’écran de refus réapparu dans `/onboarding` et conserver le parcours de création d’espace non bloquant.
5. Ne modifier aucun autre texte listé dans la section « laissées inchangées ».

## Vérifications

- Rechercher à nouveau tous les termes demandés et produire la liste finale avec fichiers et lignes.
- Vérifier les textes de navigation sur bureau et dans le menu mobile.
- Vérifier que les neuf CTA marketing portent le même texte et mènent à `/connexion` sur chaque route.
- Vérifier le bandeau supérieur et le social proof à 1280 px et 390 px.
- Vérifier que `/onboarding` ne contient plus l’écran « L’accès n’est pas encore ouvert ».
- Vérifier qu’aucun tiret cadratin n’a été ajouté et que les contrôles du projet passent.
