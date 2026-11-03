# Journal des modifications de la bible du studio

## À traiter
- Qualification des fenêtres verticales 7–13 s des ép. 3 et 4 (mouvements rapides de saut ?).
- Sauts de teinte dus à des `tod` qui se chevauchent dans les épisodes `engine: 2` (ép. 2 à 52,7 s, ép. 3 à 6,0 s) : corrigés seulement si l'épisode passe en `engine: 3` ; évolution EV-004 possible.
- Carte « FIN » : en paysage elle recouvre en partie le personnage du dernier plan ; comportement conservé (décision d'Aaron, 3 nov. 2026), amélioration à étudier dans une évolution séparée.

## 1.2.1 — 3 novembre 2026
- **Règle de publication (Aaron) : pas de YouTube Shorts au-delà de 3 minutes.** Export (étape N) : pas de titre ni de description Shorts pour un épisode de plus de 3 min ; TikTok et YouTube paysage inchangés. Fichiers : `chaine_production.md`, `01_univers.md`. Épisodes 1 à 4 non modifiés.
- À traiter : descriptions YouTube des ép. 3 et 4 (« 3 à 9 ans » au lieu de 6–9 ans) ; ép. 4 programmé vendredi, correction à décider.

## 1.2.0 — 3 novembre 2026
- **Démo 2 (Pitou + Grincheux) VALIDÉE par Aaron** (rapport `demo/RAPPORT_demo02.md`) : condition de la validation définitive du studio remplie.
- **Fusions autorisées par Aaron, sans force push, non-régression après chacune** :
  - `voice_gain3` (`scripts/build_episode.py`) : normalisation des voix fines (Pitou), **uniquement `engine >= 3`** ; ép. 1–4 reconstruits octet pour octet identiques (commit de fusion 97d4483).
  - **EV-003** : `tod X 0` = changement instantané sous `engine: 3` (commit e70440d) ; ép. 1–4 : 24/24 images identiques par épisode.
  - **EV-001** : décor `riviere` (option B), verbes `stones`/`lift`, effets `ripple`/`splashbig`/`vapeur` (commit 483355f) ; ép. 1–4 : 24/24 identiques par épisode ; démo 2 inchangée (24/24).
- Tous les nouveaux comportements ne s'activent que pour `"engine": 3` ou par l'usage explicite des nouveaux verbes ; les épisodes 1 à 4 n'ont pas été modifiés.
- Étape suivante : épisode 5 « Bouboule et la rivière aux cailloux ».

## 1.1.1 — 3 novembre 2026
- **EV-002 fusionnée** (commit de fusion b3a9160, validée par Aaron) : fondu de décor symétrique (quel que soit l'ordre des calques) et maison/piquet liés à leur décor. **Actif uniquement pour les épisodes déclarant `"engine": 3`** ; épisodes 1 à 4 inchangés (vérifié image par image après fusion). Fiche `evolutions/EV-002_transition_decors.md`, rapport `tests/RAPPORT_EV-002_tests.md`, anomalies ép. 3/4 dans `rapports/`.
- Règle pour les nouveaux épisodes : déclarer `"engine": 3`.

## 1.1.0 — 3 novembre 2026
- **Nouvelle règle fondamentale (imposée par Aaron) : contrôle obligatoire de la fluidité de la caméra** avant chaque livraison, trois niveaux (CONFORME / À CORRIGER / BLOQUANT), intégré à la chaîne (F, L, M, N), à la checklist de livraison et aux outils (`outils/qc_fluidite.py`).
- Zones de sécurité et proportions (`07_realisation.md`), outils `qc_cadrage.js`, `qc_lipsync.js`, option `--scene` de `qc_video.py`.
- Fiche EV-001 (rivière) approuvée : option B.
- Public 6–9 ans aligné dans `serie/guide_mise_en_scene.md` et `serie/bible.json`.
- Fichiers : `10_qualite.md`, `chaine_production.md`, `07_realisation.md`, `README.md`, `outils/*`, `evolutions/EV-001_decor_riviere.md`, `../serie/guide_mise_en_scene.md`, `../serie/bible.json`, `VERSION`.
- Validé par : Aaron (3 nov. 2026).

## 1.0.0 — 3 novembre 2026
- Création de la bible du studio (11 documents + chaîne de production + procédure + outils de contrôle qualité).
- Public cible fixé à 6–9 ans (validé par Aaron le 3 nov. 2026).
- Reprise sans doublon de `serie/guide_mise_en_scene.md` (intégré dans `07_realisation.md` et `06_sonore.md`) et de `serie/bible.json` (devenu le fichier d'état, voir `09_continuite.md`).
- Validé par : Aaron (architecture et décisions du 3 nov. 2026).

