# EV-004 — Profondeur, eau, immersion, pierres prises (moteur 4)

Statut : **intégrée dans main** (4 nov. 2026, validation d'Aaron, fusion de ep-005-production d169a81). Activée uniquement par `"engine": 4` ; les épisodes 1 à 4 (engine 1–3) sont inchangés (24/24 images identiques aux références).

## Ajouts
- `depth who d dur` : profondeur 0 (berge) à 1 (loin), recul vertical et réduction d'échelle ; le personnage qui parle passe toujours devant.
- `stones` : éléments `[x, profondeur]`, `add [...] ["drop"]` (chute + éclaboussure), `take [idx…] [écart]` (la pierre part en arc vers la pile).
- `water who s dur` (immersion), `wet who v dur` (Bouboule mouillé), fx `drip`, `ringat`, `machine show x style depth`.
- Anim `tug` : bras tendus vers la pierre, regard vers le bas-droite (`lookOv`), bras gauche passé devant le corps (`armLX/armLY`, `armS`).
- Plans portrait : cible de caméra `[paysage, portrait]` à vérifier pour ne pas couper le personnage.

## Vérifications (ép. 5)
Non-régression ép. 1–4 : 24/24. Caméra moteur CONFORME, synchro labiale OK, vidéo sans noir ni figé, fluidité : 1 alerte par format (faux positifs connus, acceptés). Cadrage : 174 alertes (139 avant), fenêtres verticales à revoir.
