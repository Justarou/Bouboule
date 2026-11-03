# EV-002 — Rapport de tests (3 nov. 2026) — branche `ev-002-transition-decors`
Correctif : `engine/engine.js`, activé uniquement par `"engine": 3`. Rien dans main.

## 1. Rendus de test (copies des ép. 3 et 4 avec `engine: 3`, voix identiques)
| Rendu | Durée rendue | `qc_fluidite.py` | Détail |
|---|---|---|---|
| Ép. 4 paysage | 0–50 s | A CORRIGER (1 anomalie) | la coupe 44,13 s a disparu ; reste 45,1 s = saut de teinte du ciel, **présent dans l'original** (cause : `tod dusk 0` lu comme 3 s, chevauche `tod night`) → EV-003 proposée |
| Ép. 4 vertical | 0–50 s | A CORRIGER (5) | 44,13 s corrigé ; 45,1 s (même saut de teinte) ; 7,1 s et 11,7–13,2 s existent à l'identique dans l'original (avant toute transition) |
| Ép. 3 paysage | 0–86 s | **CONFORME (0)** | les deux transitions (39,7 s et 81,6 s) |
| Ép. 3 vertical | 0–86 s | A CORRIGER (5) | seulement 7,83–8,37 s et 11,5 s (avant toute transition, identiques à l'original) ; transitions propres |
Ép. 4 : le retour forêt → colline (130,4 s) n'a pas été rendu en vidéo (rendu complet ≈ 30 min) ; vérifié par images (ci-dessous).

## 2. Deux sens d'affichage (`set_timeline.js`)
- Ép. 3 : colline→atelier (décor entrant au-dessus ; coupe avant correctif) et atelier→colline (sortant au-dessus) : fondus continus dans les deux cas.
- Ép. 4 : colline→forêt (entrant au-dessus ; coupe avant) et forêt→colline (sortant au-dessus) : idem. Images 3 par transition vérifiées (paysage), vertical vérifié sur colline→forêt.

## 3. Piquet
Ép. 4, paysage et vertical : le piquet-drapeau disparaît en fondu avec la colline, absent pendant toute la forêt (images à 45,6 / 46,2 / 100 / 129,67 s), réapparaît au retour à la colline (131,4 s), comme attendu.

## 4. Comparaison image par image (original vs `engine: 3`)
- Ép. 3 (150 instants × 2 formats) : différences uniquement dans la fenêtre de transition 39,67 s.
- Ép. 4 (150 × 2) : 0 différence avant 44,15 s, 161 différences entre 44,15 et 131,9 s (transition + piquet absent de la forêt + retour), 0 après 131,9 s.

## 5. Non-régression
- Ép. 1 à 4 (`engine: 2`) : moteur de la branche vs moteur de main, 12 instants × 2 formats : **24/24 identiques par épisode** (96/96).
- Voix intégrées (hash des blocs audio), `qc_camera.js` et `qc_cadrage.js` : identiques entre original et `engine: 3` (ép. 3 et 4).

## 6. Effets secondaires
Personnages, animations, voix, cadrages : aucun changement mesuré (pixels identiques hors fenêtres/piquet, caméra et cadrage identiques, audio identique). Non traités : accessoires `ball` et `machine` (même principe possible si besoin).

## 7. Hors périmètre, à décider
EV-003 (proposée, non développée) : `tod X 0` → durée 3 s au lieu de 0 et chevauchement de `tod` → saut de teinte (ép. 4 à 45,1 s). Fenêtres verticales 7–13 s des ép. 3 et 4 : mouvements rapides de saut, à qualifier au visionnage.
