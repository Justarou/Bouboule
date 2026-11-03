# Chaîne de production d'un épisode (obligatoire, dans l'ordre)

Chaque étape produit un **livrable vérifiable**. On ne passe à la suivante que lorsque la **porte** est franchie. Le chef d'orchestre est la compétence `realisation-animation`. Chaque livrable porte la mention « bible 1.0.0 » (version lue).

| Étape | Intitulé | Compétence principale | Livrable | Porte de validation |
|---|---|---|---|---|
| A | Idée et intention narrative | storytelling-jeunesse | fiche d'une page : vedette, désir, problème, enjeu, émotion, morale incarnée, lien avec `saison1.json`, rappel de continuité | cohérence avec 01, 02, 03, 09 ; une seule intrigue |
| B | Écriture du scénario | storytelling-jeunesse | scénario dialogué par scènes | respect de 08 (accroche 10 s, péripéties, gag, nuance, répliques courtes) |
| C | Validation de la structure dramatique | storytelling-jeunesse + supervision-qualite | grille d'actes (problème, escalade, surprise, creux, résolution) | tous les éléments présents, durée estimée 3 min 30–6 min |
| D | Découpage en scènes | storyboard-et-decoupage | liste de scènes avec lieu, moment, personnages, **fiche d'intention** (07) | chaque scène a un changement ; transitions de lieu prévues |
| E | Storyboard | storyboard-et-decoupage | tableau plan par plan : réplique, image, point focal, objets à montrer, durée | tout objet cité est montré ; format vertical vérifié |
| F | Mouvements de caméra | cinematographie | fenêtres `shot`/`cam` par réplique, inserts, transitions + **pré-contrôle moteur `qc_camera.js` (niveau CONFORME / À CORRIGER / BLOQUANT)** | règles d'or de 07 ; pas de zigzag ; **niveau CONFORME**, sinon retour à F |
| G | Direction des personnages | character-acting | fiche par réplique : émotion, regard, geste, réaction des silencieux | émotions nuancées ; fidélité aux personnages (02) |
| H | Définition des animations | animation-2d | verbes `do` (déplacements, sauts, anticipations, effets) | timing et physique plausibles ; compatibles avec 11 |
| I | Génération des voix | sound-design (+ Aaron/GitHub) | mp3 de chaque réplique | étiquettes de jeu justes ; voix présentes pour chaque réplique |
| J | Synchronisation labiale | animation-2d + supervision-qualite | `vis`/`amp` calculés à la fabrication (automatique) ; contrôle sur échantillons | bouche synchrone à ±80 ms |
| K | Sound design et musique | sound-design | plan sonore : musique par scène, ambiances, signatures, silences, bruitages | niveaux conformes à 06 |
| L | Montage | montage-animation | épisode assemblé (`out/epNNN.html`) + rendus paysage et vertical + **rapport de fluidité `qc_fluidite.py` (un niveau par format)** | rythme, durée, formats ; **fluidité CONFORME dans les deux formats** (À CORRIGER → nouveau rendu du format ; BLOQUANT → arrêt) |
| M | Contrôle qualité | supervision-qualite | rapport de contrôle sur le rendu réel (10) avec **checklist de livraison et passages suspects de caméra visionnés** + mise à jour de la continuité (09) | verdict **VALIDÉ** et **fluidité caméra CONFORME** |
| N | Export final | montage-animation | MP4 paysage et vertical + titres/descriptions (YouTube, Shorts, TikTok) | rapport validé **avec fluidité CONFORME** ; export **interdit** sinon ; Aaron informé |

## Règles de la chaîne
- 🔒 **Contrôle de fluidité caméra obligatoire** (`10_qualite.md`) : à chaque épisode et chaque démo, deux formats, avant livraison. Pas de livraison tant que le niveau n'est pas CONFORME ; un BLOQUANT arrête la chaîne et est remonté à Aaron.
- Un livrable refusé revient à l'étape qui l'a produit, avec la liste numérée des corrections.
- Une idée qui dépasse le moteur déclenche la procédure de `11_moteur.md` (pas de bricolage).
- Aucune étape ne peut changer une règle fondamentale de la bible.
- L'épisode doit rester produisible dans le temps (rendu environ 20 min, voix via GitHub).
- À la fin : autocritique et améliorations pour le prochain épisode (voir `10_qualite.md`).
