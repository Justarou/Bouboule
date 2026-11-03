# Journal des modifications de la bible du studio

## À traiter
- EV-002 — **transition de décor** : à la lecture des rendus réels, le fondu `set` n'est effectif que dans un sens (le décor entrant garde une opacité de 1 : coupe sèche quand il est dessiné au-dessus). Détecté par `qc_fluidite.py` sur les épisodes 3 et 4. Correctif moteur à proposer à Aaron avec la branche rivière ; épisodes 1 à 4 non modifiés en attendant.

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

