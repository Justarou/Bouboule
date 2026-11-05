# EV-005 — Maison sans toit, petit feu, endormis (moteur, épisode 6)

Statut : **VALIDÉE par Aaron et fusionnée dans main le 5 novembre 2026 (studio 1.4.0), avec l'épisode 6.**
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
| `mood asleep` | `mood, qui, asleep` | yeux entièrement fermés |
| `anim sleep` | `anim, qui, sleep, durée, angle` | pose de dormeur : appuyé, accroupi, respiration légère |
| `look fire` | `look, qui, fire` | les yeux suivent le feu |
| `aura` | `aura, qui, niveau, durée` | halo de lumière de Pitou (uniquement quand utilisé) |
| bois | (automatique en mode `walls`) | planches visibles sur les murs ; trace de brûlure réaliste après `fire out … trace` |
| moteur 5 | `"engine": 5` | caméra lissée plus finement (pas de 0,05 s) avec limitation douce du déplacement ; ne s'active que pour `engine: 5` |

## Limites
- Le feu et le foyer ne suivent pas le décor : à retirer (`fire hide`, `stones unpile`) avant un changement de lieu.
- Un seul feu à la fois.

## Contrôles finaux (fusion)
- Épisodes 1 à 5 reconstruits et comparés aux références : images identiques (voir CHANGELOG 1.4.0).
- Épisode 6 : contrôles de fluidité, cadrage, audio et vidéo dans `studio/rapports/RAPPORT_ep006.md`.
