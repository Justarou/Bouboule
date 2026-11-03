# Rapport de contrôle qualité — démo 2 « Le nuage et l'étoile » (Pitou + Grincheux, bible 1.1.1)
Rendus réels : paysage 1920×1080 et vertical 1080×1920, 71,6 s, vraies voix ElevenLabs (Narrateur, Pitou, Grincheux), synchro labiale, bruitages, musique, ambiance d'oiseaux, caméra, animations. Scène : `studio/demo/demo02.json` (copie de travail `episodes/demo98.json`), `engine: 3`. Épisodes 1–4 et moteur de production non modifiés.

## Historique des itérations
| Version | Verdict | Défauts trouvés |
|---|---|---|
| v1 | À reprendre | Grincheux coupé aux bords/en haut (C) ; plan trop serré sur le nuage (C) |
| v2 | À reprendre | Alerte synchro labiale sur l'humeur « rire » de Pitou (C) ; Pitou 4,8 dB sous le narrateur (C) |
| **v3** | **Conforme** | recadrage, humeur « happy », `voice_gain3` (engine ≥ 3 uniquement) |

## Mesures sur les rendus réels
| Contrôle | Résultat | Seuil | |
|---|---|---|---|
| Fluidité caméra (qc_fluidite.py) | CONFORME paysage et vertical | CONFORME | ✔ |
| Loudness | −15,3 LUFS | −16 ± 1,5 | ✔ |
| Crête | −1,8 dBFS | < −1 | ✔ |
| Niveaux par voix | N −17,6 / P −19,5 / G −19,8 → écart max 2,3 dB | ≤ 3 dB | ✔ |
| Durée / formats | 71,6 s dans les deux formats | ±0,1 s | ✔ |
| Image noire / figée / trou audio | aucun | — | ✔ |
| Caméra (qc_camera.js) | CONFORME | — | ✔ |
| Cadrage (qc_cadrage.js) | 0 alerte | marges ≥ 5 % | ✔ |
| Synchro labiale (qc_lipsync.js) | OK | — | ✔ |

## Vérification artistique
| Axe | Note | Constat |
|---|---|---|
| Intention / lisibilité | A | Récit lisible sans le son : Grincheux pleut, Pitou rayonne, ils font de la couleur ensemble. |
| Émotion | A | Grincheux blanchit, la lueur de Pitou monte ; l'arc-en-ciel est motivé (pluie + lumière). |
| Cadrage | B+ | Les deux personnages restent dans les marges ; plans serrés/moyens alternés. |
| Son | B | Voix homogènes ; Pitou (la plus faible) ramenée dans la tolérance. |
| Public 6–9 ans | A | Message d'amitié simple, humour doux. |

## Limites et réserves
- **Carte de fin** : en paysage, « FIN / à demain, petits rigolos ! » assombrit la scène et recouvre en partie le visage de Grincheux. C'est la carte standard du moteur (identique aux ép. 1–4) ; non modifiée par prudence (touche les épisodes de référence). Réserve mineure, non bloquante ; à traiter par une évolution dédiée si Aaron le souhaite.
- `voice_gain3` (scripts/build_episode.py) n'agit que pour `engine >= 3` ; fusionné dans main le 3 nov. 2026 (studio 1.2.0) après validation d'Aaron ; épisodes 1 à 4 reconstruits octet pour octet identiques.
- Les fichiers de la démo 2 ont été poussés sur main comme fixtures (comme demo99) pour permettre la génération des voix.
- Reste à écouter à l'oreille : musique et mixage final (jugement humain).
