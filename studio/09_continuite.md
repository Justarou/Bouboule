# 09 — Règles de continuité et mémoire de la série

## Principe
Chaque épisode peut être regardé seul, mais ce qui s'est passé compte : les souvenirs, les promesses, les objets, l'état de la maison et les relations évoluent. Un événement passé peut **influencer** un épisode suivant (un rappel, une rancune, une aide rendue, un objet réutilisé).
🔒 FONDAMENTAL — Aucun épisode ne contredit un fait établi (voir « Faits établis »). Un fait ne se corrige que par la procédure de mise à jour.

## Où vit la mémoire
- **Fichier d'état** : `../serie/bible.json` → pour chaque personnage : humeur, relations, souvenirs, progression. Mis à jour après chaque épisode.
- **Plan de saison** : `../serie/saison1.json` → liens entre épisodes, pièce de la maison, teasers, rappels.
- **Ce document** : règles + faits établis + registre des promesses et objets.

## Faits établis (état après l'épisode 7)
| Épisode | Faits retenus |
|---|---|
| 1 | Bouboule trouve Pitou, tombée du ciel, et l'aide ; Pitou retrouve sa lumière grâce à l'arc-en-ciel ; Grincheux joue sous la pluie avec eux : **premier ami de Bouboule** ; Pitou monte le soir par l'escalier arc-en-ciel. |
| 2 | Flamme a le hoquet de feu ; la machine anti-hoquet de Robi rate ; Flamme réchauffe Grincheux (qui n'avait pas d'abri) ; Pitou donne l'astuce de compter jusqu'à dix. |
| 3 | Les amis lancent la **maison de la colline** ; la machine de Robi (Bâtimatic) s'écroule ; Robi se croit nul ; ses amis le rassurent ; on décide de **construire à la main** ; premier piquet planté ; teaser : il faudra des pierres plates à la rivière. |
| 4 | Bouboule et Pitou plaisantent sur la pluie de Grincheux, qui se vexe et part dans la forêt ; il a peur du noir ; Pitou lui apprend à s'écarter pour qu'elle éclaire la forêt ; pluie + lumière = **arc-en-ciel de nuit** ; Grincheux **promet de faire le toit** de la maison ; il comprend qu'il peut demander de l'aide ; teaser : Bouboule est parti seul vers la rivière. |
| 5 | Bouboule va seul à la rivière aux cailloux plats (promis à Grincheux : les fondations) et pousse en vain une pierre ; Pitou, Robi et Flamme le rejoignent ; Robi a peur de l'eau (« ça rouille »), Flamme aussi (« ça m'éteint ») ; Pitou donne un plan et l'ordre de **ne pas dépasser le troisième caillou** ; Bouboule désobéit en sautant : il tombe et la rivière l'emporte ; Flamme s'éteint en tentant de l'aider ; Pitou le calme (« Écoute-moi. Respire doucement. »), lui donne dix secondes et dit à Robi de viser à droite du pont ; le **Cailloumatic de Robi** fait apparaître des pierres-pont, Bouboule est sauvé, Robi ne rouille pas ; **Flamme se rallume (hic)** et sèche Bouboule ; moral : « C'est ça, être courageux. » Les pierres sont roulées jusqu'à la colline : **fondations posées** au piquet (« la maison a mis ses chaussures ») ; Grincheux passe : « C'est solide. Merci, Bouboule. » ; Bouboule : « Avant de sauter, on écoute ! » ; teaser : les murs et le tout premier feu (ép. 6). |
| 6 | Les murs de la maison sont montés (sans toit) ; Flamme allume le **tout premier petit feu** dans le foyer en pierres plates ; les amis s'endorment autour du feu ; moral : la chaleur se partage. |
| 7 | Pitou brille moins et finit par avouer qu'elle a le cœur lourd : sa famille d'étoiles est là-haut et elle ne sait plus laquelle est la sienne ; Bouboule la console sans blague ; Robi, Grincheux et Flamme construisent une **fenêtre ronde** (trop petite d'abord, puis ajustée), la pluie la lave, le hic de Flamme allume la **lanterne** (idée de Grincheux : pour que sa famille la voie) ; Pitou, qui découvre la fenêtre de l'intérieur, promet de **dire plus vite** quand elle est triste ; elle seule voit une **étoile filante** ; un petit message s'écrit sur la vitre (vu par personne). Le petit feu du foyer (ép. 6) brûle encore. |

## Registre des promesses (à tenir dans la saison)
- Grincheux fera le **toit** (ép. 8).
- Pitou a une **famille d'étoiles** à retrouver (ép. 10, 11, 12) ; ép. 7 : elle a promis de dire plus vite sa tristesse ; graine : le message sur la vitre et l'étoile filante.
- Ép. 7 : la **lanterne de la fenêtre** reste allumée pour que sa famille la voie.
- ~~Bouboule va à la rivière seul (ép. 5)~~ **tenue** : il a appris à écouter (refrain « Avant de sauter, on écoute ! », à rappeler ensuite).
- Nouveau : **le premier feu** dans la maison (ép. 6, Flamme) ; Robi a vaincu sa peur de l'eau (conséquence à rappeler).
- La **bouteille à la mer** (fin de saison) ouvre la saison 2.

## État de la maison commune (objet récurrent)
Piquet planté (ép. 3). **Fondations posées (ép. 5)**, pile de pierres plates au pied du piquet. **Murs montés, sans toit (ép. 6)** ; **foyer en pierres plates posé au pied de la maison, premier petit feu allumé par Flamme (ép. 6)** — décor tout extérieur, pas d'intérieur. **Fenêtre ronde posée avec lanterne allumée (ép. 7)**, foyer toujours allumé. Prévu : toit (ép. 8, promesse de Grincheux ; le toit cachera le ciel, à ne pas oublier), porte (ép. 10), fête d'inauguration (ép. 12). Position : à droite de la colline (milieu-droit du décor), grande, plus haute que les personnages.

## Protocole de continuité
**Avant d'écrire** : lire les faits établis, le registre des promesses, l'état des personnages. Choisir *au moins un* rappel naturel d'un épisode passé (une phrase, un objet, un geste) ; vérifier qu'il ne contredit rien.
**Après chaque épisode** (étape M) :
1. Mettre à jour `../serie/bible.json` : humeur, souvenirs, relations, progression.
2. Ajouter une ligne aux faits établis (ce qui est définitivement vrai).
3. Mettre à jour le registre des promesses (une promesse tenue disparaît ; une nouvelle s'ajoute).
4. Mettre à jour l'état de la maison et des objets.
5. Noter les « graines » plantées (un détail qui servira plus tard).
6. Statut de l'épisode dans `saison1.json`.

## Types d'influence entre épisodes
- **Rappel** : un personnage cite un événement (« comme avec le hoquet… »).
- **Conséquence** : l'état d'un personnage découle d'avant (Robi plus prudent après son échec).
- **Objet** : le Bâtimatic, la maison, le piquet, l'arc-en-ciel de nuit.
- **Relation** : Grincheux fait confiance à Pitou après la forêt.
- **Promesse** : tenue ou mise à l'épreuve plus tard.
- **Retournement** : un fait ancien reprend un sens nouveau.

## Contrôle de cohérence
Pour chaque épisode : positions et état des objets, savoirs (qui sait quoi), météo et heure, nombre de personnages présents, vocabulaire et tics, lieu de départ = lieu d'arrivée de l'épisode précédent (ou le narrateur explique le saut).
