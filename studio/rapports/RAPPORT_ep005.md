# Rapport de production — Épisode 5 « Bouboule et la rivière aux cailloux »
Branche `ep-005-production` · moteur 3 · durée 3 min 51 (231,4 s) · public 6–9 ans · **pas de Short (> 3 min)**.

## Contrôles
| Contrôle | Paysage | Vertical |
|---|---|---|
| Caméra moteur (`qc_camera.js`) | CONFORME | CONFORME |
| Fluidité rendu (`qc_fluidite.py`) | 1 alerte : 0,3 s (fondu d'ouverture, faux positif) | 1 alerte : 11,6 s (changement de sous-titre, exclu par la règle) |
| Audio (`qc_audio.py`) | −15,5 LUFS, crête −1,8 dBFS, OK | idem |
| Vidéo (`qc_video.py`) | aucun noir, aucune image figée | idem |
| Synchro labiale | OK (parleur seul mobile) | — |
| Cadrage (`qc_cadrage.js`) | alertes surtout en vertical (groupes de 4 dans une fenêtre étroite), 139 contre 107 sur l'ép. 4 | à revoir en évolution (fenêtres verticales) |

## Tours de correction
1. 1er rendu : à-coup réel à ~199 s (sortie vers la colline) + 2 alertes de synchro (Pitou : bouche de Bouboule restée ouverte en « scared », bouche de Pitou peu mobile) → humeurs remises à « worried », panoramique lent et sorties plus douces.
2. 2e rendu : l'à-coup de 199 s a disparu dans les deux formats.

## Points à noter
- Les deux alertes restantes ont été regardées sur images : aucun défaut visible.
- Plans de groupe en vertical : chevauchement de personnages (déjà présent ép. 3–4), à traiter dans l'évolution « fenêtres verticales ».
- Épisodes 1 à 4 : non touchés (seul `episodes/ep005.json` ajouté sur main pour les voix).

## Publication (proposition)
- Titre : « Bouboule et la rivière aux cailloux — Dessin animé pour enfants (6–9 ans) »
- Description : Bouboule veut rapporter seul les pierres des fondations de la maison. Mais le courant l'emporte… Pitou, Robi et Flamme vont devoir garder leur calme. Un dessin animé pour les 6–9 ans sur le courage et l'écoute. Épisode 5 de « Bouboule et ses amis ».
- Pas de Short : durée de 3 min 51.
