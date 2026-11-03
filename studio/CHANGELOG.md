# Journal des modifications de la bible du studio

## À traiter
- EV-001 — rivière (option B) : développée sur `ev-001-riviere`, tests dans `tests/RAPPORT_EV-001_tests.md`, **en attente de validation d'Aaron avant fusion** (prévue : studio 1.2.0).
- EV-003 — **`tod X 0`** : une durée de 0 est lue comme 3 s (`a[1] || 3`) et chevauche le `tod` suivant → saut de teinte du ciel (ép. 4, 45,1 s). Branche `ev-003-tod-duree-zero` en développement (autorisée le 3 nov. 2026).
- Qualification des fenêtres verticales 7–13 s des ép. 3 et 4 (mouvements rapides de saut ?).

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

