# EV-005 — Maison sans toit, petit feu, endormis (moteur, épisode 6)

Statut : **développée sur la branche `ev-005-feu-maison`, intégrée à `ep-006-production` pour l'épisode 6. Non fusionnée dans main (en attente de l'accord d'Aaron).**
Aucun changement des règles fondamentales. Épisodes 1 à 5 : images identiques aux références (16/16, 8 instants par épisode, contrôle fait à chaque modification).

## Ajouts
| Verbe | Syntaxe | Effet |
|---|---|---|
| `house walls` | `house, walls, x, durée, échelle` | la maison monte sans son toit (le toit est la promesse de l'ép. 8) ; même emplacement et fondu de décor que `build` |
| `fire` | `fire, show, x, taille, lift[, quiet]` | petit feu animé (3 flammes qui vacillent + halo chaud) posé au sol, ou en hauteur (`lift` en px : 26 sur le foyer, 42 sur un mur) |
| | `fire, grow, taille, durée` | le feu grandit ou diminue |
| | `fire, out, durée, trace[, quiet]` | le feu s'éteint en fumée grise ; `trace` = true laisse une trace noire (planche grillée) |
| | `fire, hide` | le feu et sa trace disparaissent |
| `fx zzz` | `fx, qui, zzz, durée` | petits « z » qui montent d'un personnage endormi |
| `mood asleep` | `mood, qui, asleep` | yeux fermés (squint 1) |

## Limites
- Le feu et le foyer ne suivent pas le décor : à retirer (`fire hide`, `stones unpile`) avant un changement de lieu.
- Un seul feu à la fois.
