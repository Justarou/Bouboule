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

## Version 2 (4 nov.) — retours d'Aaron et évolution EV-004
Retours : personnages tassés, Pitou devant Bouboule quand il parle, pierres illisibles (elles doivent s'éloigner du rivage, être dans l'eau, espacées sur la largeur, et Bouboule doit rapetisser en s'éloignant).
- Moteur (branche `ev-004-profondeur`, engine ≥ 4, **non fusionnée dans main**, en attente de validation) : verbe `depth who d dur` (0 = rive, 1 = loin : monte et rapetisse), cailloux `[x, profondeur]`, `stones add` (ajout sans refaire apparaître les anciens), locuteur toujours dessiné devant, les plus éloignés derrière. Non-régression ép. 1 à 4 : 24/24 images identiques à chaque changement.
- Épisode : engine 4, groupes en éventail, cailloux étalés sur la largeur (x .34 à .82, profondeur .15 à .79), Bouboule saute de l'un à l'autre en rapetissant, pont de Robi ajouté sans réapparition de la file.
- Contrôles du rendu final : paysage et vertical, fluidité identique (seules les deux alertes faux positifs 0,3 s et 11,6 s), audio −15,5 LUFS / crête −1,8 dBFS, 231,4 s, aucun noir ni image figée ; caméra moteur CONFORME ; synchro labiale OK.

## Version 3 (4 nov) — eau, mouillé, pierres prises
- Bouboule tente réellement la première pierre (animation `tug`), puis tombe : immersion visible (`water`), nage, silhouette mouillée (`wet`), gouttes (`drip`).
- Cailloumatic visible dans l'eau (anneau `.mring`), pile parasite supprimée ; les pierres prises quittent l'eau (`stones take`) vers la pile du bord.
- QC : ép.1–4 16/16 identiques ; caméra moteur CONFORME ; synchro labiale OK ; vidéo (noir/figé) RAS en land et port ; fluidité land 1 alerte (fondu 0,3 s) et port 1 alerte (changement de sous-titre 11,6 s), faux positifs connus ; cadrage 174 alertes (139 avant, fenêtres verticales), à revoir en évolution.
