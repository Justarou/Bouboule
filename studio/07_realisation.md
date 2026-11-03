# 07 — Bible de réalisation

## Intention de scène (obligatoire)
Chaque scène a une **fiche d'intention** avant le storyboard :
- **Intention narrative** : que fait avancer cette scène dans l'histoire ? (une information, un obstacle, un choix)
- **Intention émotionnelle** : que doit ressentir l'enfant au début, à la fin ? (ex. inquiétude → soulagement)
- **Changement** : qu'est-ce qui est différent à la fin de la scène ?
- **Point focal** : personnage, objet ou expression à voir.
- **Plan clé** : l'image qu'on garderait si on n'en gardait qu'une.
Une scène sans changement ni intention est supprimée ou fusionnée.

## Les types de plans (verbe `shot`)
| Plan | Verbe | Usage |
|---|---|---|
| Général | `wide` | situer un lieu, arrivée, action collective, accessoire en entier |
| Groupe | `group` | plusieurs personnages interagissent |
| Moyen | `medium` | dialogue, geste lisible |
| Gros plan | `close` | émotion forte, information importante |
| Très gros plan | `extreme` | un instant crucial (désespoir, découverte) |
| Réaction | `reaction` | personnage silencieux qui encaisse ou rit |
| Insert | `cam` avec cible et zoom | un objet cité à l'oral |
La cible peut être un personnage, `group`, une fraction de scène, une position en pixels (`"x213"`) ou une paire `[paysage, vertical]` quand les formats diffèrent.

## Règles d'or de la caméra
1. 🔒 FONDAMENTAL — **Ce dont on parle doit se voir.** Si une réplique nomme un objet, la caméra le montre en entier et lisible (insert) pendant la réplique, dans les deux formats.
2. **Un plan = une raison.** Pas de changement de plan gratuit ; au plus un changement toutes les 3 s en dialogue calme ; pas de zigzag.
3. Un seul point focal par plan (taille, contraste, placement).
4. Cadrage par tiers ; de l'air devant le regard.
5. **Sens de l'écran** : un trajet « aller » va dans une direction, le « retour » dans l'autre ; un personnage qui marche à droite continue à droite au plan suivant.
6. Mouvements doux, motivés, lents (le moteur lisse automatiquement) ; ne pas lutter contre le lissage avec des fenêtres qui se chevauchent.
7. Pour un décor étroit en vertical (la largeur utile est plus petite), prévoir le cadrage vertical séparément.
8. Plan général de contexte avant une réplique importante, pas seulement au début.

## Transitions de lieu (protocole obligatoire)
1. **Départ** : les personnages *sortent* du plan en décalé (`exit`, un par un, chacun avec sa démarche) pendant la réplique « allons à… », avec un plan général.
2. **Fondu enchaîné** du décor (`set` avec durée 1,2 s) pendant la phrase du narrateur qui annonce le lieu ; l'ambiance sonore suit.
3. **Arrivée** : ils *entrent* du côté opposé (`enter`) et marchent à leur place ; plan général de 1 à 2 s qui présente le décor.
Aller = sortie à droite → arrivée par la gauche. Retour = l'inverse. Jamais de coupe sèche entre deux lieux sauf effet de surprise voulu et noté.

## Zones de sécurité et proportions (valeurs mesurables)
- **Image** : paysage 16:9 (800×450 de référence), vertical 9:16 (450×800). Le même moment doit raconter la même chose dans les deux formats (même point focal, mêmes objets visibles), même si le cadrage diffère.
- **Marges de sécurité** : aucun personnage ni objet clé à moins de **5 %** d'un bord latéral ; rien d'important au contact du bord haut. Exceptions : entrée ou sortie de personnage en cours, animation de construction (la maison tombe du ciel), décor de fond.
- **Bande de sous-titres** : paysage = bas 22 % de l'image ; vertical = haut 20 %. Aucun visage ni objet cité dans cette bande.
- **Maison** : toit et murs entièrement visibles dès la fin de sa construction, dans les deux formats. Échelle de référence 2,2 (≈ 2 fois la hauteur d'un personnage) ; caméra `cam` zoom 1,0 avec cibles `["x450","x410"]` quand la maison est à 0,64 de la scène.
- **Personnages parlants** : toujours entiers dans le cadre ; en vertical deux personnages tiennent ensemble si leur écart est inférieur à ≈ 150 px de monde (positions 0,40 et 0,53 de la scène) — sinon choisir un seul point focal ou cadrer `group` plus large.
- **Personnage silencieux** : jamais coupé par le bord ; s'il ne tient pas dans le cadre vertical, rapprocher les positions plutôt que couper.
- **Générique de fin** : la caméra reste sur le plan final (ne pas laisser le titre « FIN » recouvrir la maison ou un personnage).
- Contrôle automatique : `node studio/outils/qc_cadrage.js out/epNNN.html` (3 échantillons par réplique, deux formats).

## Mise en scène des personnages
- Pas de personnages immobiles qui parlent : chaque réplique s'accompagne d'une action, d'un déplacement ou d'une réaction visible.
- Les personnages silencieux continuent à vivre (regard, souffle, micro-mouvements) et réagissent (voir `04_graphique.md` et la compétence character-acting).
- Placements : les personnages parlants jamais cachés par un accessoire ; l'accessoire important n'est jamais derrière eux (la maison est à droite, les personnages à gauche, etc.).

## Rythme
Répliques ≤ 8 s ; alternance de plans longs (respirations) et courts ; une pause avant et après chaque gag ; durée d'un épisode : 3 min 30 à 6 min.

## Chaîne de production
Voir `chaine_production.md`. La réalisation valide chaque porte avant de passer à la suivante.
