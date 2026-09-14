# Aligner les deux calculateurs de coût

## Modifications
- Centraliser le taux français de 7 %, le coût unitaire de 14 840 €, la valeur de départ de 22 500 €, la fourchette 15 000 € à 30 000 € et la grille tarifaire HeedUp dans une source commune.
- Utiliser cette source dans `/estimer-cout` et dans la fenêtre modale afin qu’un même effectif produise toujours le même résultat.
- Remplacer les textes et sources visibles par les formulations validées, puis retirer toute attribution à Deloitte des textes et métadonnées concernés.

## Vérifications
- Confirmer 29 680 € pour 25 salariés dans les deux calculateurs.
- Confirmer le taux de 7 %, le coût de 14 840 € et les sources séparées Gallup France et IBET.
- Confirmer l’absence de « Deloitte 2024 » et l’absence de changement dans la grille tarifaire HeedUp.
- Vérifier les deux interfaces dans le navigateur et contrôler les types.

## Détail technique
- Extraire les constantes et fonctions communes dans un module partagé pour empêcher une nouvelle divergence.
