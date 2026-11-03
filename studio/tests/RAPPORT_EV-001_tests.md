# EV-001 — Rapport de tests de la rivière, option B (3 nov. 2026) — branche `ev-001-riviere`
Bible 1.1.1. Rien dans main. Épisodes 1 à 4 non touchés.

## Contenu développé
- **Décor `riviere`** (`engine/sets.js`) : montagnes et collines lointaines comme la colline, autre berge (arbres, rochers, pont de planches cassé dont une planche balance), rivière bleu-vert, reflets qui glissent, écume scintillante, nénuphars, libellules (jour), roseaux avant et arrière, lucioles la nuit. Le décor est statique (pas de parallaxe).
- **`stones`** : `show, [x…]` gué de cailloux dans l'eau (apparition en pop échelonnée, anneau d'écume, s'enfonce de 3 px sous un personnage) ; `hide` ; `pile, x` / `unpile` : tas de pierres plates sur la berge (l'objet de la quête).
- **`lift, qui, px, durée`** : monte un personnage (22 px = debout sur un caillou) ; ombre, effets et poids suivent. Sans `lift`, comportement inchangé.
- **Effets** `fx, qui, ripple` (3 ondulations), `splashbig` (gerbe + 2 anneaux + bruit `eclabousse_eau`), `vapeur` (Flamme dans l'eau). L'effet `steam` existant n'est pas modifié.
- Documentation : `05_decors.md` (fiche du lieu, accessoire cailloux), `11_moteur.md` (verbes).
- Non développé, non nécessaire à l'option B : bande d'eau devant les personnages (pas de baignade), objet porté, poissons, personnage mouillé (option C).

## Tests
1. **Scène de test** `zrv1` (engine 3, B, R, P, F ; jour → crépuscule → nuit) : décor correct en paysage et en vertical, jour/crépuscule/nuit lisibles ; B monte sur le caillou, ondulations, gerbe, vapeur, tas de pierres visibles.
2. **Rendus** 9,5 s paysage et vertical : durée OK, aucune image noire ni figée. `qc_fluidite.py` : paysage **CONFORME** ; vertical **À CORRIGER (1)** à 0,5 s = apparition des personnages au début de la scène de test (`place` sans `enter`), pas un défaut du décor ; à éviter dans l'épisode (entrées `enter`/`pop`).
3. **Cadrage** (`qc_cadrage.js`) : 6 alertes, toutes dues au placement extrême de la scène de test (Robi à 0,18, Flamme à 0,86, vertical) ; en vertical, garder les personnages entre ≈ 0,3 et 0,7. Rappel dans la fiche.
4. **Non-régression** : épisodes 1 à 4 reconstruits avec le moteur de la branche vs moteur de main, 40 instants × 2 formats : **80/80 identiques par épisode (320/320)**. Les nouveaux verbes ne sont lus que s'ils apparaissent dans un épisode.
5. Non testé à ce stade : voix et sons de l'ép. 5 (pas d'épisode), rendu complet, qualité du jeu d'acteur sur les cailloux (à voir dans l'ép. 5 / démo).

## Limites / à décider
Le `place` d'un acteur à une extrémité du décor peut le couper en vertical (règle des zones de sécurité). Les cailloux sont placés par fraction (x) comme les personnages : ils ne sont pas à la même position monde en paysage et en vertical, ce qui est voulu (ils suivent les personnages).
