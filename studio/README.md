# Studio « Bouboule et ses amis » — référentiel officiel

> Version de la bible : voir `VERSION` · Historique : `CHANGELOG.md` · Procédure de mise à jour : `PROCEDURE_MISE_A_JOUR.md`

Ce dossier est la **référence officielle** du projet. Les dix compétences (Skills) du studio le lisent avant toute production.
**Aucune compétence ne peut modifier seule une règle marquée 🔒 FONDAMENTAL.** Toute modification de ces règles passe par la validation d'Aaron (voir la procédure).

## Public cible (décision d'Aaron, 3 nov. 2026)
Enfants de **6 à 9 ans**, univers accessible aux familles. Histoires plus développées, vrais traits de caractère, émotions nuancées, situations parfois surprenantes. Les épisodes 1 à 4 ont été écrits pour un public plus jeune (3–9 ans) : ils restent canon, mais ne servent pas de modèle de niveau d'écriture.

## Documents de référence (les 11 + 1)
| N° | Fichier | Contenu |
|---|---|---|
| 1 | `01_univers.md` | monde, ton, règles fondamentales, interdits |
| 2 | `02_personnages.md` | identité, désirs, failles, voix, gestes, évolution des six voix |
| 3 | `03_relations.md` | matrice des relations et tensions, comment elles évoluent |
| 4 | `04_graphique.md` | formes, couleurs, proportions, contours, expressions |
| 5 | `05_decors.md` | lieux, variantes jour/nuit/météo, accessoires, règles de décor |
| 6 | `06_sonore.md` | identité sonore, voix, mixage, thème, signatures, ambiances |
| 7 | `07_realisation.md` | plans, caméra, transitions, intention de scène |
| 8 | `08_narration.md` | structure d'épisode, écriture 6–9 ans, humour, émotions |
| 9 | `09_continuite.md` | mémoire de la série, ce qui influence la suite, protocole |
| 10 | `10_qualite.md` | grille de contrôle, seuils mesurables, verdicts |
| 11 | `11_moteur.md` | ce que le moteur sait faire, ses limites, demandes d'évolution |
| + | `chaine_production.md` | les 14 étapes A→N avec livrables et portes de validation |

Données d'état lisibles par machine : `../serie/bible.json` (état des personnages après chaque épisode) et `../serie/saison1.json` (plan de la saison). Le texte fait foi pour les règles ; ces deux fichiers font foi pour l'état.
`outils/` : scripts de contrôle qualité sur les rendus réels (voir `10_qualite.md`).

## Qui lit quoi
| Compétence | Lit obligatoirement | Lit au besoin |
|---|---|---|
| storytelling-jeunesse | 01, 02, 03, 08, 09 | 05, 07 |
| realisation-animation | tous | — |
| storyboard-et-decoupage | 05, 07, 08, 09 | 02, 04, 11 |
| direction-artistique | 04, 05, 01 | 06, 11 |
| animation-2d | 04, 11 | 02, 07 |
| character-acting | 02, 03, 04 | 08, 11 |
| cinematographie | 07, 05, 11 | 04 |
| sound-design | 06, 08 | 02, 11 |
| montage-animation | 07, 06, 10 | 11 |
| supervision-qualite | 10, 11, 09 | tous |

## Règle de priorité en cas de conflit
1. Les règles 🔒 FONDAMENTAL de la bible.
2. Le reste de la bible.
3. Les compétences (leurs méthodes).
4. Les préférences ponctuelles d'Aaron dans la conversation (elles l'emportent sur tout, mais si elles touchent une règle fondamentale, elles déclenchent la procédure de mise à jour).
