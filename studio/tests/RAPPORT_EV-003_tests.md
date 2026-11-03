# EV-003 — Rapport de tests (3 nov. 2026) — branche `ev-003-tod-duree-zero`
Correctif : `engine/engine.js` (1 ligne), actif uniquement sous `engine: 3`. Rien dans main.

## 1. Interprétation des durées (clés de ciel `ENGINE.SKY`, épisode de test dérivé de l'ép. 1)
| Cas | engine 2 (historique) | engine 3 (EV-003) |
|---|---|---|
| `tod dusk 0` (ligne 4) | rampe 3 s (24,28 → 27,28) | **instantané** (24,28 → 24,28) |
| `tod day 0` (ligne 8) | rampe 3 s (46,59 → 49,59) | **instantané** (46,59 → 46,59) |
| `tod night` sans durée | 3 s | 3 s (inchangé : 24,28 → 27,28) |
| `tod gloom 4`, `day 3.5`, `night 5` | rampes 4 / 3,5 / 5 s | identiques |

## 2. Transitions jour / crépuscule / nuit (`studio/tests/tod_continuite.js`, saut = variation moyenne RVB de la bande de ciel entre deux images à 30 i/s, seuil 4)
Épisodes 1 à 4 reconstruits en `engine: 3` (couvrent day, dawn, dusk, gloom, night) :
- Ép. 1 : 0 saut. Ép. 2 : 1 saut (52,71 s) = chevauchement dusk/night, identique en engine 2. Ép. 3 : 1 saut (6,00 s) = chevauchement dawn/day, identique en engine 2.
- **Ép. 4 : le saut de 45,1 s (22,4 en engine 2) a disparu.** Reste 44,13 s (10,4) : début du fondu de décor et du zoom caméra ; la teinte, mesurée numériquement, y est continue (255,170,110 → 241,161,108 → 187,128,99 → 159,111,94 de 44,1 à 45,2 s).

## 3. Effet de EV-003 isolé (ép. 4 en `engine: 3`, main = EV-002 seul vs branche = EV-002 + EV-003, images paysage)
Identiques à 41, 42, 43, 44 s ; différentes seulement de 44,3 à 45,0 s (lissage de la teinte, diff moyenne 0,5 → 8,4) ; identiques à 45,3 s et au-delà (45,6 / 46 / 47 / 60 / 100 s). Ép. 3 en `engine: 3` : 300/300 images identiques à main.

## 4. Non-régression
Épisodes 1 à 4 (`engine: 2` ou 1) : moteur de la branche vs moteur de main, 40 instants × 2 formats : **80/80 identiques par épisode (320/320)**. Épisodes 1 et 2 sont en engine 1 (historique) : non concernés.

## 5. Effets secondaires
Aucun changement hors fenêtre de ciel (voir §3) ; voix, caméra, cadrage, personnages non touchés (un seul fichier de code modifié, une ligne).
