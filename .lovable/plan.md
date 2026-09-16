# Enrichissement de la page Fonctionnalités

## Résultat attendu
- Ajouter après les coches de « L’anonymat » un bloc neutre « Ce que vous ne verrez jamais », sans rouge ni coches vertes.
- Enrichir « La mise en route » avec l’organisation en équipes, le seuil obligatoire de 10 salariés actifs et 5 réponses complètes, le partage d’accès entre managers, la taille adaptée de 10 à 100 salariés et le nouveau texte de support.
- Présenter les fonctions équipes et multi-manager comme actives, conformément à la décision prise, sans inventer un chemin précis dans l’interface.
- Ajouter une sixième section légère « Ce que ce n’est pas » avant « Vos données ».
- Passer la navigation latérale et mobile à sept sections dans l’ordre demandé.

## Mise en œuvre
- Ajouter des listes à puces neutres réutilisables pour les limites d’accès et le périmètre produit.
- Structurer les nouveaux contenus de mise en route en sous-blocs lisibles, avec un encadré indigo visible pour le seuil des équipes et un encadré pour la taille adaptée.
- Remplacer le bloc support existant par le texte exact sur le fondateur, le délai de 24 heures et l’assistant disponible en bas de page.
- Ajouter la section « LE PÉRIMÈTRE » avec un traitement plus léger que les sections principales.
- Étendre uniquement les styles de `/fonctionnalites`, sans modifier le composant partagé du rapport ni les cinq autres gabarits.

## Vérifications
- Vérifier les sept sections et leur ordre dans le contenu et les deux navigations.
- Vérifier les textes, le lien `mailto:contact@heedup.fr`, les seuils 10 actifs et 5 réponses, et la seule promesse de support à 24 heures.
- Vérifier ordinateur, tablette et mobile, sans débordement horizontal.
- Rechercher tout tiret cadratin et toute puce rouge dans les nouveaux blocs.

## Détails techniques
- Conserver l’observation d’intersection existante, automatiquement étendue par le tableau des sections.
- Utiliser uniquement des transitions d’opacité et les couleurs sémantiques existantes.
- Ne pas ajouter de logique métier ni modifier le fonctionnement du tableau de bord.
