# Refonte du hero HeedUp

## Résultat attendu

Remplacer le haut de la page d’accueil par une composition éditoriale à deux colonnes, avec le texte fourni à gauche et un rapport produit lisible à droite. Le rapport restera un vrai composant React adaptatif, jamais une image.

## Mise en œuvre

1. **Logo et navigation**
   - Utiliser directement `public/favicon.svg`, qui correspond au logo indigo avec le « h » blanc fourni, sans le redessiner.
   - Afficher cette icône avec le nom HeedUp dans la navigation et dans l’en-tête du rapport.
   - Conserver l’ordre Accueil, Fonctionnalités, Tarifs, Connexion, Créer mon espace.
   - Passer le bandeau supérieur au fond lilas pâle, avec les deux textes verbatim et le lien souligné.

2. **Composant de rapport unique**
   - Créer un seul `DemoReportCard` contenant les données statiques exactes du brief : date, cinq scores dans l’ordre imposé, deltas, recommandations, synthèse et vigilance.
   - Calculer chaque barre avec `score / 5 * 100`.
   - Colorer uniquement les ronds numérotés des recommandations, jamais leurs lignes entières.
   - Utiliser le bloc de vigilance lilas avec bordure gauche indigo, sans rouge, orange ni triangle.
   - Ajouter une prop de présentation si une largeur différente est nécessaire, sans dupliquer le contenu.
   - Remplacer les anciennes utilisations marketing de `RapportCard` et `RapportDemo` sur l’accueil, Fonctionnalités et Bienvenue par ce composant unique. Les composants du dashboard réel resteront séparés.

3. **Nouveau hero**
   - Construire la colonne texte avec l’eyebrow, le titre exact et son espace insécable avant le point d’interrogation, le sous-titre, les deux boutons et les avatars anonymes.
   - Faire pointer « Créer mon espace → » vers `/connexion` et « Voir le rapport ↓ » vers le rapport dans la page.
   - Mettre le rapport dans une colonne plus large, avec deux feuillets pleins décalés, un halo indigo flouté sans dégradé, et les trois annotations uniquement dans le hero.
   - Respecter la règle existante sans animation de déplacement : aucune transition autre que l’opacité et aucun `transform`. L’inclinaison statique sera obtenue sans animation de transformation.

4. **Responsive et barre de confiance**
   - Desktop au-dessus de 1024 px : grille 40/60, contenu aligné en haut et typographie confortable.
   - Tablette : texte puis rapport centré, sans réduire les textes internes jusqu’à l’illisibilité.
   - Sous 768 px : le même composant masque automatiquement tout sauf son titre et ses cinq scores; les bulles et feuillets du hero disparaissent.
   - Sous 640 px : boutons et éléments de confiance s’adaptent sans compression; les cinq garanties passent sur deux lignes.
   - Remplacer la barre sombre par une bande claire séparée d’un filet et afficher les cinq garanties exactes avec coches vertes.

## Fichiers concernés

- `src/components/DemoReportCard.tsx` : source unique du rapport marketing.
- `src/components/Nav.tsx` : logo réel et structure demandée.
- `src/components/SiteLayout.tsx` : bandeau supérieur clair.
- `src/routes/index.tsx` : nouveau hero et usages du rapport.
- `src/routes/fonctionnalites.tsx` et `src/routes/bienvenue.tsx` : import du composant unique à la place des anciennes cartes de rapport.
- `src/styles.css` : styles adaptatifs du hero, du rapport et de la barre de confiance.
- Suppression des anciens composants marketing devenus inutilisés après migration, afin d’empêcher toute duplication future.

## Vérifications

- Recherche exhaustive des anciennes cartes, des contenus du rapport, des termes interdits, des logos clients et des tirets cadratins.
- Contrôle que toutes les démonstrations marketing importent exclusivement `DemoReportCard` et que le dashboard réel ne l’importe pas.
- Vérification visuelle et fonctionnelle à 1280×800, 1024 px, 768 px, 767 px, 640 px et 390 px.
- Contrôle du titre à toutes les largeurs, des cinq scores et deltas, des pourcentages de barres, des CTA, du scroll vers le rapport et de la simplification mobile.
- Validation TypeScript et tests de rendu sans requête vers `lovable.cloud`.
