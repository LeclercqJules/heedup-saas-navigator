# Refonte visuelle de la page Fonctionnalités

## Résultat attendu
- Remplacer les onglets et l’accordéon par six sections visibles dans une page déroulée.
- Ajouter une navigation latérale collante sur ordinateur, synchronisée par `IntersectionObserver`, avec défilement vers chaque section.
- Alterner texte et visuel selon les sections, avec une présentation spécifique en trois étapes pour la mise en route.
- Conserver mot pour mot les contenus corrigés lors du lot précédent, en regroupant les recommandations dans le rapport et le tableau de bord dans l’historique.
- Retirer la section de comparaison redondante et conserver le CTA final partagé.

## Mise en œuvre
- Recomposer `src/routes/fonctionnalites.tsx` autour des six sujets demandés et réutiliser `DemoReportCard` et `FinalCta`.
- Ajouter des classes dédiées dans `src/styles.css` pour la grille, la navigation collante, les alternances, les cartes, les trois encadrés importants et les adaptations tablette/mobile.
- Sous 1024 px, remplacer la colonne latérale par une rangée d’ancres horizontale et afficher chaque section en une colonne.
- Sous 768 px, empiler les trois étapes de mise en route.

## Vérifications
- Confirmer les six sections, l’activation automatique sans écouteur de défilement, l’alternance des visuels et exactement trois encadrés lilas.
- Vérifier ordinateur, tablette et mobile, l’absence de débordement horizontal et la présence du CTA partagé.
- Rechercher les textes interdits, les anciennes sections et tout tiret cadratin, puis lancer les contrôles du projet.

## Détails techniques
- Une seule observation d’intersection sera installée dans la page et nettoyée au démontage.
- Les ancres utiliseront `scroll-margin-top` pour s’arrêter sous la navigation supérieure collante.
- Les animations resteront limitées à l’opacité.
