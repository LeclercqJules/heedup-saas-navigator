# Ajustements du hero HeedUp

## Résultat attendu

Rendre le titre lisible en trois lignes maximum sur les largeurs desktop demandées, actualiser les données fixes du rapport unique, et harmoniser le bandeau avec la navigation sans augmenter leur hauteur cumulée.

## Mise en œuvre

1. **Titre et équilibre des colonnes**
   - Réduire légèrement la taille du H1 sans modifier son texte ni celui du sous-titre.
   - Rééquilibrer la grille desktop pour donner davantage de largeur au texte.
   - Compacter uniquement la présentation du rapport dans le hero, en réduisant légèrement ses espacements et tailles internes, sans altérer ses autres utilisations.

2. **Données du rapport unique**
   - Remplacer la ligne fixe par « 17 réponses · 11 commentaires · Seuil atteint » dans `DemoReportCard`.
   - Conserver ce composant comme source unique sur toutes les pages marketing.

3. **Bandeau et navigation solidaires**
   - Regrouper visuellement le bandeau et la navigation dans un seul bloc sticky en haut de l'écran.
   - Remplacer la bordure sombre de 3 px par un filet clair de 1 px.
   - Donner plus de présence au texte du bandeau sans augmenter sa hauteur, puis réduire la navigation afin que la hauteur cumulée reste au plus égale aux 120 px actuels.
   - Aligner l'espace réservé au-dessus du contenu sur cette nouvelle hauteur réelle.

## Vérifications

- Mesurer le nombre de lignes du H1 à 1280, 1440 et 1920 px.
- Vérifier le texte « 17 réponses · 11 commentaires » sur toutes les pages utilisant le rapport partagé.
- Faire défiler la page et confirmer que bandeau et navigation restent collés ensemble en haut.
- Mesurer leur hauteur cumulée et confirmer qu'elle ne dépasse pas 120 px.
- Confirmer que le séparateur mesure 1 px et reste visuellement discret.
