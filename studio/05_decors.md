# 05 — Bible des décors

## Principe
Chaque lieu a une identité (forme, couleurs, ambiance sonore), des variantes (moment de la journée, météo) et des accessoires qui racontent l'histoire. Un décor sert le personnage : jamais de détail qui vole le regard au point focal.
🔒 FONDAMENTAL — **Le décor ne bouge pas par lui-même quand la caméra bouge** : pas de parallaxe (le fond ne glisse pas à part des personnages). Seuls les éléments d'ambiance (nuages qui passent, lucioles, herbe qui ondule, lumière) s'animent, discrètement.

## Lieux disponibles (moteur actuel)
| Lieu | Clé moteur | Contenu | Ambiance sonore |
|---|---|---|---|
| Colline des Rigolos | `colline` | collines rondes, moulin qui tourne, panneau, petite maison au loin, arbres ronds, fleurs, herbe | `amb_oiseaux` (jour), `amb_nuit` (nuit) |
| Forêt | `foret` | sapins en trois plans, champignons lumineux, lucioles, rayons de lumière | `amb_nuit`, `amb_vent`, hibou |
| Atelier de Robi | `atelier` | mur bleu clair avec lambris, sol en planches avec tapis rond, grande fenêtre avec rideaux, guirlande lumineuse, plan de la maison sur grand panneau, étagères, établi, plante, engrenages tournants, rayon de soleil | `amb_classe` bas |
| Rivière aux cailloux | `riviere` | (EV-001, option B) montagnes lointaines comme la colline, autre berge avec arbres et rochers, pont de planches cassé au fond, rivière bleu-vert large (y 328–394) avec reflets qui glissent, écume, nénuphars, libellules (jour), roseaux de chaque côté, berge herbeuse où marchent les personnages (sol GY=395) ; cailloux du gué et tas de pierres plates posés par les accessoires `stones` | `amb_ruisseau` (+ `amb_oiseaux` le jour) ; bruitages `pas_eau`, `eclabousse_eau`, `impact_eau`, `blop` |

## Lieux à créer (planifiés)
- ~~Rivière aux cailloux (ép. 5)~~ : créée (voir tableau ci-dessus), **fusionnée dans main (studio 1.2.0, EV-001)**.
- **Ciel étoilé / escalier arc-en-ciel** (fil de Pitou, ép. 7, 10–12).
- Intérieur de la maison commune au fil de la construction (ép. 8–12).
Toute création de lieu : fiche dans ce document (forme, couleurs, accessoires, ambiance sonore, variantes) avant le code, puis demande d'évolution du moteur (voir `11_moteur.md`).

## Variantes temporelles et météo (verbes du moteur)
- Moment : `tod` = `dawn`, `day`, `dusk`, `night`, `gloom` (ciel sombre). Passage progressif (durée en secondes).
- Météo : pluie (`fx rain` autour d'un personnage), rayons de lumière (`beams`), arc-en-ciel (`rainbow show/hide`), foudre (`fx lightning`), secousse (`shake`).
- Teinte globale : le moteur teinte le décor selon l'heure ; vérifier la lisibilité.

## Accessoires (props) avec état
- **Maison** (`house`) : `build` (monte), `collapse` (s'écroule), `clear` (disparaît), `stake` (piquet). Échelle réglable ; elle doit être **plus grande que les personnages** et visible en entier pendant l'action.
- **Machine de Robi** (`machine`) : `show`, `hide`, `shake`, `boom`.
- **Balle** (`ball`) : lancer, brûler.
- **Cailloux** (`stones`) : gué de pierres plates dans l'eau (on y monte avec `lift`, 22 px ; la pierre s'enfonce de 3 px sous le poids) et tas de pierres plates sur la berge (`pile`).
Un accessoire important a toujours son plan d'insert (voir `07_realisation.md`).

## Règles de composition
1. **Trois couches** : premier plan (herbe, fleurs), plan des personnages, arrière-plan, ciel.
2. Le sol des personnages est une ligne fixe : leurs pieds touchent toujours le sol visible.
3. Éviter les détails clairs et très contrastés derrière les têtes.
4. Laisser un espace vide pour les sous-titres en bas.
5. Cohérence d'un épisode à l'autre : mêmes positions du moulin, du panneau, de la maison commune (son état est dans `09_continuite.md`).
6. Intérieur : le sol est dessiné derrière les personnages (pas de personnage « debout sur le mur »).
