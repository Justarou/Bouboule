# EV-001 — Fiche d'évolution du moteur : décor « La rivière aux cailloux » (épisode 5)
Statut : **APPROUVÉE le 3 nov. 2026 — Option B retenue** (décor, cailloux sur lesquels sauter, effets d'eau) ; gag « Robi refuse l'eau, Flamme est éteinte » validé pour l'épisode 5. Développement sur la branche `ev-001-riviere` ; épisodes 1 à 4 intacts (références de non-régression) ; contrôle de fluidité caméra obligatoire sur les rendus de test.
Bible : 1.0.0 · Demandeur : direction-artistique / storyboard (épisode 5, `serie/saison1.json`) · Rédigée le 3 nov. 2026.

## 1. Pourquoi
L'épisode 5 (« Bouboule et la rivière aux cailloux », casting B, R, P, F) se passe à la rivière : il faut y aller chercher des pierres plates pour les fondations de la maison. Le moteur n'a que trois lieux (colline, forêt, atelier). Une rivière **ne peut pas** être simulée avec la forêt : il faut un nouveau lieu. Idée de continuité : le teaser de l'épisode 4 y envoie déjà Bouboule seul (`09_continuite.md`).

## 2. Besoins graphiques du décor (`05_decors.md` : 🔒 décor statique, pas de parallaxe)
- **Cadre** : berge herbeuse au premier plan (là où marchent les personnages, même ligne de sol GY=395 que les autres lieux), rivière large en travers du milieu de l'image, autre berge avec rochers et quelques arbres, collines et montagnes lointaines identiques à la colline (continuité de monde), ciel commun (heures du jour déjà gérées).
- **Rivière** : bande d'eau bleu-vert qui occupe y≈330–395 de l'image, dégradé plus clair au centre, bords sombres, légère transparence au bord de la berge.
- **Cailloux** : 5 à 7 pierres plates posées au milieu du courant (gris-beige, ombre portée, anneau d'écume à la base), assez grandes pour porter un personnage (≈ 60 px de large) ; un tas de pierres plates sur la berge (l'objet de la quête).
- **Détails** : roseaux, nénuphars, 2–3 poissons discrets sous la surface, libellules (comme les lucioles de la forêt), pont de planches cassé en fond (idée de gag/obstacle), reflets du ciel.
- **Heures** : jour, aube, crépuscule ; teinte de l'eau suit `tod` (déjà géré par la teinte globale).
- **Lisibilité** : eau jamais plus contrastée que les personnages ; bande de sous-titres (bas 22 %) dégagée ; zones de sécurité (07) respectées en vertical → prévoir une disposition « rivière étroite » où 2 personnages tiennent ensemble.

## 3. Animations nécessaires
| Élément | Animation | Coût |
|---|---|---|
| Courant | 3–4 bandes de reflets qui glissent lentement (translation + opacité) ; lignes d'écume | faible |
| Surface | ondulation douce de la ligne de berge (sinus) | faible |
| Cailloux | léger balancement d'écume ; **réaction à un poids** (s'enfonce de 3 px quand un personnage atterrit) | moyen |
| Roseaux / nénuphars | oscillation comme les herbes existantes (`grassTufts`) | faible |
| Poissons / libellules | trajectoires simples (comme `ffs` de la forêt) | faible |
| Pont cassé | planche qui pend et grince (option) | faible |

## 4. Effets d'eau (réutilisation maximale de l'existant)
Déjà dans le moteur : particules `splashe` (anneau), `drop` (gouttes), `foam`, `puff` (vapeur) — `engine.js`.
À ajouter : **ondulations concentriques** persistantes (3 anneaux qui s'élargissent, ~1,2 s) ; **éclaboussure en gerbe** (gouttes + anneau) à l'atterrissage ; **vapeur** quand Flamme touche l'eau (réutilise `puff` gris) ; **reflets colorés** sous les personnages (ellipse teintée à la couleur du perso, flou léger — pas de vrai miroir : trop coûteux, inutile pour 6–9 ans) ; **personnage mouillé** (option : gouttes qui tombent et couleur assombrie 20 % pendant 5 s).
Sons déjà disponibles (`sfx/`) : `amb_ruisseau_1`, `pas_eau_1-3`, `eclabousse_eau_1`, `impact_eau_1-3`, `bulle_1`, `blop_1-2`. Rien à générer.

## 5. Interactions possibles avec les personnages
- **Bouboule** : rebondit de caillou en caillou (hop sur place existant + déplacement) ; rate un saut et tombe à l'eau (gag) ; ricoche comme une balle.
- **Robi** : métal → il refuse d'entrer dans l'eau (« bzzzt » si une goutte tombe) ; utile : il mesure l'écart entre cailloux ; peut tomber en panne mouillé (gag, cohérent avec le Bâtimatic de l'ép. 3).
- **Pitou** : sa lumière se reflète dans l'eau ; elle éclaire sous l'eau ou guide dans le brouillard ; trop légère pour couler (elle pose un pied et flotte).
- **Flamme** : l'eau l'éteint → vapeur + hoquet de peur ; elle peut au contraire faire fondre/sécher (chaleur : sèche Robi).
- **Grincheux** : sa pluie fait des ronds dans l'eau ; il peut gonfler le niveau (« Pfff ! » → la rivière monte) : il devient utile et la promesse du toit (ép. 4) est rappelée.
- **Quête** : transport de pierres plates (objet porté — voir §6), construire un pont de cailloux.

## 6. Adaptations techniques (périmètre précis)
1. **`engine/sets.js`** : nouvelle fonction `riviere(back, front)` (≈ 120 lignes) + déclaration dans `build: { …, riviere }`. Suivre la structure de `foret` (couches `back`/`front`, `update(t,S)` avec `S.tint`). Le moteur ne construit que les lieux utilisés (`setNames`, `engine.js` l.471) : **aucun coût pour les autres épisodes**.
2. **Eau devant les pieds** : bande d'eau semi-transparente dans `front` (au-dessus des personnages) pour que des personnages « dans » l'eau aient les pieds sous la surface — **sans toucher à la logique des acteurs**.
3. **Cailloux comme accessoires** : nouveau verbe `stones` (`show/hide`, liste de x) sur le modèle de `house`/`machine` (tableau `PROPS.stones`, `propL`), ≈ 60 lignes.
4. **Se tenir sur un caillou** : décalage vertical de l'acteur (≈ −8 px) pendant qu'il est sur la pierre ; solution minimale : verbe `move … ` + `anim hop` existants et ajout d'un paramètre optionnel `lift` à `place/move` (valeur par défaut 0 = comportement actuel).
5. **Effets** : verbes `fx` supplémentaires (`ripple`, `splashbig`, `steam`) en réutilisant les pools de particules existants ; ajouter 1 pool d'anneaux (`ripple`, 12 éléments).
6. **Objet porté (option)** : `carry` (pierre au-dessus de la tête) — peut se faire sans moteur avec une pierre-accessoire qui suit un personnage ; à étudier seulement si l'histoire en a besoin.
7. **Son** : aucun changement (`amb`, `sfx` existent).
8. **Doc** : `05_decors.md` (fiche du lieu), `11_moteur.md` (nouveaux verbes), `CHANGELOG.md`, version **studio 1.1.0** (MINEUR : ajout, sans changement de règle fondamentale).

### Trois niveaux possibles
| Option | Contenu | Effort estimé | Risque |
|---|---|---|---|
| **A — Minimal** | §6.1 + 6.2 : décor rivière seulement, personnages sur la berge, pas de cailloux interactifs (histoire racontée avec le narrateur et des plans fixes) | ½ jour | très faible |
| **B — Recommandé** | A + cailloux (6.3), saut sur caillou (6.4), éclaboussures/ondulations/vapeur (6.5) | 1 à 1,5 jour | faible |
| **C — Étendu** | B + objet porté, reflets teintés, poissons, pont cassé, personnage mouillé | 2 à 3 jours | moyen (plus de code d'acteur) |

## 7. Risques de régression sur les décors existants
| Risque | Pourquoi | Mesure |
|---|---|---|
| Altération de colline/forêt/atelier | on **n'édite pas** leur code, seulement l'ajout d'une fonction dans le même fichier et d'une entrée dans `build` | diff limité aux lignes ajoutées |
| Parallaxe / règle 🔒 de `05_decors.md` | la rivière ne doit pas introduire de décalage selon la caméra | le décor reste dans `back`/`front` fixes ; contrôle `qc_camera.js` |
| Verbes DSL | un nouveau verbe mal gardé pourrait changer l'analyse des épisodes existants | gardes `V2` (`engine: 2`) ; les épisodes 1–2 (moteur 1) ne voient rien |
| `place/move` avec `lift` | modifie l'altitude des acteurs | valeur par défaut 0 ; aucun épisode existant n'envoie ce paramètre |
| Pools de particules | plus de nœuds SVG → rendu un peu plus lent | 12 anneaux seulement ; mesure du temps de rendu |
| Pitou / Robi / Flamme dans l'eau | superposition de la bande d'eau avec les personnages | tests visuels paysage et vertical (zones de sécurité) |
| Audio | aucun | — |

**Protocole de non-régression avant livraison** : reconstruire les épisodes 1, 2, 3, 4 avant/après modification ; comparer 12 images par épisode et par format (différence de pixels = **0**) ; comparer les pistes audio (identiques) ; relancer `qc_camera.js` / `qc_cadrage.js` ; test vidéo court de la rivière en paysage et vertical ; rapport de la supervision qualité.

## 8. Décision demandée à Aaron
1. Option A, B ou C ? 2. Le gag « Robi refuse l'eau / Flamme éteinte » te convient-il pour l'épisode 5 ? 3. Autorisation de créer la branche de travail `ev-001-riviere` (le moteur actuel reste intact sur `main` tant que rien n'est validé).
