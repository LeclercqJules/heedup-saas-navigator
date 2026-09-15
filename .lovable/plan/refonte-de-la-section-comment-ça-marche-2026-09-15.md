# Refonte de la section « Comment ça marche »

## Résultat attendu

Remplacer l’actuelle section à onglets par deux blocs successifs qui expliquent clairement la mise en route puis le rituel hebdomadaire réel de HeedUp.

## Bloc A : mise en route

- Ajouter le badge « COMMENT ÇA MARCHE », le titre, le sous-titre et les trois mentions de réassurance demandés.
- Présenter trois étapes horizontales reliées par des flèches sur ordinateur, puis empilées sur mobile.
- Créer trois illustrations stylisées conformes au produit : un seul champ « Nom de votre entreprise », une zone évocatrice de collage d’adresses email, puis la confirmation manager pour 24 salariés.
- Appliquer une apparition successive en opacité aux trois étapes, conformément aux règles d’animation du site.

## Transition et bloc B : rituel hebdomadaire

- Insérer le séparateur fin et son badge central « ET CHAQUE SEMAINE, LE MÊME RITUEL ».
- Ajouter le titre, le sous-titre et les quatre cartes VENDREDI, HEEDUP, LUNDI et LA SEMAINE avec leurs contenus exacts.
- Montrer une échelle de réponse stylisée, une analyse IA, une notification qui renvoie vers l’espace manager et l’objectif final sans promesse de résultat.
- Sur ordinateur, faire progresser la séquence horizontale selon le défilement vertical dans une zone dédiée, avec un indicateur discret.
- Sous 768 px, utiliser un carrousel tactile horizontal avec points de position et mise à jour accessible de la carte active.

## Garde-fous et vérifications

- Supprimer l’ancienne section et ses anciens visuels pour éviter toute duplication.
- Vérifier l’absence de taille d’équipe, lien d’invitation, promesse absolue d’anonymat, résultat non mesuré, scores dans un email et tiret cadratin.
- Vérifier les mises en page et interactions à 1280 px, 1024 px, 767 px et 390 px, y compris le défilement desktop et le balayage mobile.

## Détails techniques

- Isoler la nouvelle section dans un composant dédié afin de garder la page d’accueil lisible.
- Utiliser `IntersectionObserver` et un suivi de défilement limité à la section pour la progression desktop, sans transformer les cartes.
- Utiliser le défilement natif avec `scroll-snap` sur mobile, sans dépendance supplémentaire.
- Respecter les deux polices, les couleurs sémantiques existantes et les transitions uniquement en opacité.