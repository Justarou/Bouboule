# EV-002 — Fiche d'évolution du moteur : transitions de décor et accessoires liés au décor
Statut : **FUSIONNÉE dans main (studio 1.1.1), validée par Aaron le 3 nov. 2026.** Active uniquement avec `"engine": 3`.
Bible : 1.1.0.

## Problème
1. Le fondu `set` n'est effectif que si le décor sortant est dessiné au-dessus du décor entrant (ordre des calques = ordre de première utilisation) : sinon coupe sèche (ép. 4 à 44,13 s ; ép. 3 à 39,67 s).
2. La maison/le piquet (`house`) est un accessoire global : il reste visible dans les autres décors (piquet visible dans la forêt, ép. 4).

## Correctif (engine/engine.js)
Activé **uniquement si l'épisode déclare `"engine": 3`** → les épisodes à `engine: 2` (1 à 4) sont rendus exactement comme avant.
- Fondu enchaîné symétrique : le calque du dessus fond (rampe lissée) ; celui du dessous reste plein puis s'efface sur la seconde moitié (sortant) ou apparaît dès la première moitié (entrant), pour éviter tout « pop ».
- `house` mémorise le décor où il a été posé ; il n'est visible que dans ce décor, en fondu avec la transition.
Non traité (à examiner si besoin) : `ball`, `machine` (même principe possible).

## Tests (3 nov. 2026)
Voir `studio/tests/RAPPORT_EV-002_tests.md`. Résumé : non-régression ép. 1–4 moteur de la branche vs moteur main = 24/24 images identiques par épisode ; ép. 3 et 4 en `engine: 3` : seules les fenêtres de transition (et le piquet en forêt) diffèrent ; fluidité des rendus corrigés : voir rapport.
