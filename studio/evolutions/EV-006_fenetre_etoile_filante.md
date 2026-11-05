# EV-006 — Fenêtre ronde et étoile filante (moteur, épisode 7)

Statut : **proposée, non développée (en attente de la validation d'Aaron).**
Aucun changement des règles fondamentales. Épisodes 1 à 6 : images identiques exigées (non-régression 8 instants par épisode, paysage et portrait).

## Besoin (ce qu'on veut voir à l'écran)
- Une grande fenêtre ronde dans le mur de la maison (cadre de bois, vitre brillante, ciel visible à travers) avec une lanterne dorée derrière.
- Une étoile filante qui traverse le ciel, et une toute petite étoile claire qui apparaît puis s'efface sur la vitre (le « message »).

## Pourquoi le moteur actuel ne suffit pas
La maison n'a ni ouverture ni vitre ; le champ d'étoiles est fixe (scintillement seul) ; aucun effet de traînée dans le ciel.

## Adaptation proposée
| Verbe | Syntaxe | Effet |
|---|---|---|
| `house window` | `house, window, show/hide, durée` | découpe ronde dans le mur (état `walls`), cadre de bois, vitre ; la lanterne est le `fire` existant placé derrière |
| `fx shootstar` | `fx, cible, shootstar, durée` | étoile filante en diagonale avec traînée et éclat ; 4e paramètre : départ (x, y) |
| `window mark` | `house, window, mark, durée` | petite étoile claire sur la vitre, qui s'efface |

Fichiers concernés : `engine/engine.js`, `engine/sets.js`. Effets uniquement quand ces verbes sont utilisés ; aucun comportement existant modifié.

## Risques
Lisibilité de la vitre en portrait ; mélange avec les étoiles du décor ; régression sur l'état `walls` de l'ép. 6 (mur plein à comparer image par image).

## Alternative sans changement du moteur
Aucune qui garde l'émotion de l'épisode (fenêtre vue, étoile filante vue) ; à défaut, remplacer par une lanterne posée au pied du mur et un simple `fx stars` (moins lisible).
