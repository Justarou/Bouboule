# Épisode 6 — « Flamme et la première cheminée »

**Scénario et découpage (étapes A à E de la chaîne de production)** — bible du studio **1.3.0** · 4 novembre 2026 · **à valider par Aaron avant la production (étapes F à N).**

Durée estimée : **≈ 4:10** (48 répliques) · casting : Flamme (vedette), Grincheux, Pitou + le narrateur ; Bouboule et Robi dorment (une réplique de rêve chacun) · décors : colline (crépuscule, nuit), forêt (nuit) · `"engine": 5` si l'évolution EV-005 est validée.

## Points à trancher (décisions importantes)

1. **Pas d'intérieur de maison.** Le plan de saison prévoyait un nouveau décor « intérieur de la maison à moitié construite ». Un nouveau lieu demande une évolution lourde du moteur. *Recommandation : tout se passe à l'extérieur, devant la maison sans toit.* La cheminée est un foyer de pierres plates au pied du mur (les pierres des fondations de l'épisode 5, déjà dans le moteur). L'intérieur reste prévu pour les épisodes 8 à 12.
2. **Petite évolution EV-005 (à valider).** Deux ajouts au moteur, sans toucher aux épisodes 1 à 5 : (a) état de maison `walls` (murs montés, **sans toit** ; le toit est la promesse de l'épisode 8) ; (b) accessoire `fire` (petit feu animé avec lueur : planche qui brûle, feu éteint par la pluie avec trace noire, foyer de la cheminée, flammèche finale). Travail sur une branche indépendante, tests de non-régression ép. 1–5 avant toute fusion. *Sans EV-005, le feu serait un effet de Flamme seul (illisible) et la maison garderait son toit (faux : le toit est l'épisode 8).*
3. **Bouboule et Robi en cameo endormis.** Le plan de saison ne les mettait pas au casting ; ils dorment au pied du mur (aucun rôle actif), avec deux répliques de rêve : Robi (« je ne rouille pas », rappel de l'ép. 5) et Bouboule (refrain chanté en dormant). *Recommandation : accepter ; sinon, je les retire et le refrain est dit par Pitou.*
4. **Grincheux entre seul dans la forêt de nuit** alors qu'il a peur du noir (ép. 4) : c'est le point fort émotionnel (surprise à 65 %). Rien à trancher, je le signale pour que tu saches que ça prolonge l'ép. 4.
5. **Pitou monte sur l'escalier arc-en-ciel à la fin** (règle de la bible : elle brille dans le ciel chaque soir) : graine pour l'épisode 7.

## A. Fiche idée

| | |
|---|---|
| Vedette | Flamme |
| Désir | Allumer le premier feu de la maison pour être utile à ses amis et se sentir accepté. |
| Faille | A peur de brûler ce qu'il aime ; se croit dangereux et nul. |
| Problème | Un feu dans une maison en bois : Flamme est le seul à pouvoir l'allumer, et son hoquet grille une planche dès le premier essai. |
| Enjeu | La première nuit froide des amis, et que Flamme s'en aille pour de bon. |
| Émotion | Peur → honte → fierté, avec un mélange : peur *et* fierté à la fin (il a toujours un peu peur, et il y arrive). |
| Morale incarnée | Se pardonner ses erreurs, c'est apprendre à bien faire. **Jamais énoncée comme une leçon** : elle passe par le geste. Grincheux dit seulement « Une planche, ça se remplace. Un ami, non. On retourne, d'accord ? », Flamme recommence et réussit, puis Pitou : « Tu as recommencé. Je suis fière de toi. » Le cœur de l'épisode est le rapprochement Grincheux–Flamme. |
| Lien avec la saison | Pièce de la maison : la cheminée. Teaser : le toit de Grincheux (ép. 8). |
| Rappels | Ép. 2 : Flamme avait réchauffé Grincheux (« Tu m'avais réchauffé, je t'éteins ») ; compter jusqu'à dix. Ép. 4 : Grincheux a peur du noir et a promis le toit. Ép. 5 : les pierres plates des fondations servent de foyer ; Robi ne rouille pas. |
| Gags récurrents (une fois chacun) | « Hic ! » (grille une planche) ; « Pfff » de Grincheux ; sa pluie sur la tête, **retournée : elle éteint le feu et devient utile** ; le compte jusqu'à dix de Pitou, **retourné : c'est Flamme qui compte tout seul, Pitou se tait**. |
| Gags visuels | La pluie qui arrose Bouboule et Robi endormis (Robi marmonne sans se réveiller) ; Grincheux qui « passe par là » ; Bouboule qui chante en dormant. |

## B. Scénario dialogué
Pour chaque réplique : étiquette de voix (ElevenLabs). Actions dans le tableau E.


### Scène 1 — Le soir tombe (colline, crépuscule) · ≈ 0:01
*Intention narrative : Les amis ont monté les murs ; il fait froid ; il faut un premier feu. Flamme, seul à pouvoir l'allumer, a peur. · Intention émotionnelle : inquiétude douce → peur de Flamme.*

1. **Narrateur** [warm, slow, gentle old man telling a bedtime story] — « Dans l'épisode d'avant, les amis ont posé les fondations. Depuis, les murs sont montés. Mais il n'y a pas encore de toit. »
2. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Brrr. Il fait froid, ce soir. Bouboule et Robi dorment déjà, épuisés. »
3. **Grincheux** [grumpy, sulking, plaintive] — « Pfff. Moi, je passais par là. Je regarde juste... mon futur toit. »
4. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Ce soir, il nous faut un feu. Un petit feu dans la cheminée. »
5. **Flamme** [shy, soft, trembling little voice] — « Un feu ? Moi ? Non, non, non... »
6. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Tu es notre seul dragon, Flamme. Tu sais faire du feu. »
7. **Flamme** [shy, soft, trembling little voice] — « Je sais en faire un trop grand. Et la maison est en bois. »
8. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Alors on commence tout petit. Un tout petit, tout petit feu. »
9. **Grincheux** [grumpy, sulking, plaintive] — « Pfff. Et si ça brûle ? C'est moi qui ai promis le toit. »
10. **Flamme** [shy, soft, trembling little voice] — « Je... je vais essayer. »

### Scène 2 — Le premier essai (colline, crépuscule → nuit) · ≈ 1:00
*Intention narrative : Flamme essaie, son hoquet grille une planche ; Grincheux éteint le début d'incendie avec sa pluie ; la pluie tombe aussi sur Bouboule et Robi qui dorment. · Intention émotionnelle : peur → panique → soulagement drôle.*

11. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Respire. Compte jusqu'à dix. Tout doucement. »
12. **Flamme** [shy, soft, trembling little voice] — « Un... deux... trois... Hic ! »
13. **Flamme** [shy, soft, trembling little voice] — « Oh non ! La planche brûle ! La maison brûle ! »
14. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Grincheux ! Vite, ta pluie ! »
15. **Grincheux** [grumpy, sulking, plaintive] — « Pfff ! J'arrive ! Psssh ! »
16. **Grincheux** [grumpy, sulking, plaintive] — « Voilà, c'est éteint. Tu m'avais réchauffé, je t'éteins. On est quittes. »
17. **Robi** [sleepy, robotic, mumbling] — « Bip... pluie... je ne rouille pas... bip... zzz. »

### Scène 3 — La honte (colline puis forêt, nuit) · ≈ 1:26
*Intention narrative : Flamme se croit dangereux et s'en va ; Pitou ne sait pas quoi dire ; Grincheux, qui a peur du noir, le suit dans la forêt. · Intention émotionnelle : honte → départ triste → surprise tendre.*

18. **Flamme** [shy, soft, trembling little voice] — « Je le savais. J'ai brûlé une planche. Je suis dangereux. »
19. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « C'est une seule planche, Flamme. Et personne n'est blessé. »
20. **Flamme** [shy, soft, trembling little voice] — « Aujourd'hui une planche. Demain, toute la maison. Je préfère partir. »
21. **Grincheux** [grumpy, sulking, plaintive] — « Pfff... Ne dis pas de bêtises. »
22. **Flamme** [shy, soft, trembling little voice] — « Je vais dormir dans la forêt. Loin des maisons. »
23. **Narrateur** [warm, slow, gentle old man telling a bedtime story] — « Flamme marcha jusqu'à la forêt. Sa petite flamme tremblait, de plus en plus petite. »
24. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Flamme, attends ! ... Grincheux, je ne sais pas quoi lui dire. »
25. **Grincheux** [grumpy, sulking, plaintive] — « Pfff. Laisse-moi faire, Pitou. Je vais lui parler. »

### Scène 4 — Deux peureux dans la forêt (forêt, nuit) · ≈ 2:08
*Intention narrative : Grincheux avoue sa peur et ses propres dégâts ; il console sans leçon ; ils reviennent ensemble. · Intention émotionnelle : aveu → réconfort → courage partagé.*

26. **Grincheux** [grumpy, sulking, plaintive] — « Flamme ! Attends. Je n'aime pas le noir. Reste allumé, s'il te plaît. »
27. **Flamme** [shy, soft, trembling little voice] — « Je te fais de la lumière ? Même après la planche ? »
28. **Grincheux** [grumpy, sulking, plaintive] — « Ta flamme m'a réchauffé, un jour. Elle ne m'a jamais fait peur. »
29. **Grincheux** [grumpy, sulking, plaintive] — « Et moi, ma pluie a gâché plein de pique-niques. Pfff. On s'en remet. »
30. **Flamme** [shy, soft, trembling little voice] — « Vraiment ? Toi aussi, tu as fait des dégâts ? »
31. **Grincheux** [grumpy, sulking, plaintive] — « Une planche, ça se remplace. Un ami, non. Pfff. On retourne, d'accord ? »
32. **Flamme** [shy, soft, trembling little voice] — « D'accord. Mais j'ai quand même un peu peur. »
33. **Grincheux** [grumpy, sulking, plaintive] — « Moi aussi. Alors on a peur ensemble. Pfff... ça va mieux. »

### Scène 5 — Le premier feu (colline, nuit) · ≈ 2:53
*Intention narrative : Flamme compte tout seul jusqu'à dix et allume un tout petit feu bien sage ; la maison devient dorée ; Pitou monte briller. · Intention émotionnelle : tension → fierté tranquille → douceur.*

34. **Narrateur** [warm, slow, gentle old man telling a bedtime story] — « Ils revinrent à la maison. Pitou les attendait, sa lumière allumée pour les guider. »
35. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Vous revenez ! Flamme, on réessaie ? Cette fois, Grincheux reste tout près. »
36. **Grincheux** [grumpy, sulking, plaintive] — « Pfff. Mon petit nuage est prêt. Au cas où. »
37. **Flamme** [shy, soft, trembling little voice] — « Cette fois, je compte tout seul. Un... deux... trois... quatre... cinq... »
38. **Flamme** [shy, soft, trembling little voice] — « Six... sept... huit... neuf... dix. »
39. **Flamme** [shy, soft, trembling little voice] — « Il est allumé ! Un tout petit feu. Tout sage. »
40. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Il est parfait. Regardez, la maison est toute dorée. »
41. **Flamme** [shy, soft, trembling little voice] — « J'ai grillé une planche... et j'ai quand même allumé le feu. »
42. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Tu as recommencé, Flamme. Je suis fière de toi. »
43. **Grincheux** [grumpy, sulking, plaintive] — « Pfff... C'est chaud. Ça sent bon. »
44. **Flamme** [shy, soft, trembling little voice] — « Viens plus près, Grincheux. Il y a de la place. »
45. **Grincheux** [grumpy, sulking, plaintive] — « ... Merci, Flamme. »
46. **Bouboule** [sleepy, mumbling, childlike voice] — « Bouboule, Bouboule, saute, saute... on recommence... zzz. »
47. **Pitou** [tiny cute high-pitched child-like voice, gentle and calm] — « Bonne nuit, tout le monde. Je monte briller pour vous. »
48. **Narrateur** [warm, slow, gentle old man telling a bedtime story] — « Dans la nuit, le premier feu brillait. Demain, Grincheux devrait tenir sa promesse : faire le toit. »

## C. Grille de structure

| Élément | Où | Contenu |
|---|---|---|
| Accroche (10 s) | répl. 1–3 | Maison sans toit, deux dormeurs, Grincheux qui « passe par là » : on sait qu'il faut un feu. |
| Problème | répl. 4–9 | Un feu dans une maison en bois ; Flamme refuse (peur de brûler). |
| Péripétie 1 | répl. 10–12 | Flamme essaie : « Hic ! » grille une planche. |
| Péripétie 2 | répl. 13–17 | Début d'incendie, Grincheux éteint avec sa pluie (gag retourné) ; Bouboule et Robi arrosés. |
| Creux émotionnel | répl. 18–23 | Honte : « Je suis dangereux », Flamme s'en va, flamme de plus en plus petite. |
| Surprise (≈ 65 %) | répl. 24–26 | Grincheux, qui a peur du noir, entre seul dans la forêt de nuit pour le retrouver. |
| Résolution | répl. 27–45 | Aveu à deux, Grincheux console, retour, Flamme compte seul et allume un petit feu sage ; Grincheux s'assoit près du feu, réchauffé (inverse de l'ép. 2). |
| Moment de cœur | répl. 28–33 et 43–45 | Grincheux avoue sa peur et ses dégâts ; à la fin Flamme lui fait de la place près du feu : « Merci, Flamme. » |
| Chanson-refrain | répl. 46 | Bouboule en dormant : « Bouboule, Bouboule, saute, saute... on recommence... zzz. » |
| Teaser | répl. 48 | Demain, Grincheux devra tenir sa promesse : le toit. |

Durée estimée : **4:10** (avant pauses de montage), dans la cible 3 min 30 – 6 min. Une seule intrigue. Pas de danger réaliste (un petit feu vite éteint).

## D. Découpage en scènes

| N° | Scène | Lieu / moment | Personnages | Changement dans la scène |
|---|---|---|---|---|
| 1 | Le soir tombe | colline, crépuscule | P,G,F (B et R endormis) | Dans une maison sans toit, qui ose allumer le premier feu ? |
| 2 | Le premier essai | colline, crépuscule → nuit | F,P,G (+B, R en dormant) | Le feu part sur la planche ; la pluie de Grincheux sert enfin à quelque chose. |
| 3 | La honte | colline puis forêt, nuit | F,P,G | Le bougon qui a peur du noir entre seul dans la forêt de nuit pour consoler. |
| 4 | Deux peureux dans la forêt | forêt, nuit | G,F | On a le droit d'avoir peur à deux, et de se pardonner. |
| 5 | Le premier feu | colline, nuit | F,P,G (+B, R) | Le premier feu de la maison est allumé par celui qui avait le plus peur. |

**Transitions de lieu** : colline → forêt à la réplique 22 (Flamme sort à droite, narrateur sur le fondu enchaîné de 1,2 s, `tod night`, ambiance qui suit : vent et hibou) ; forêt → colline à la réplique 33 (sortie à droite des deux, retour par la gauche, plan général de 1 à 2 s). La maison est posée sur la colline : elle disparaît (fondu) quand le décor change, comme à l'ép. 5.

## E. Storyboard plan par plan

Durées estimées (voix + respiration). Tout objet cité est montré : cheminée de pierres, planche noircie, nuage de Grincheux, escalier arc-en-ciel.

| N° | t | Qui — réplique | Image / action | Point focal | Plan | Durée |
|---|---|---|---|---|---|---|
| 1 | 0:01 | **N** — Dans l'épisode d'avant, les amis ont posé les fondations. Depuis, les murs sont montés. Mais il n'y a pas encore de toit. | Crépuscule sur la colline. Murs de la maison sans toit au centre ; Bouboule et Robi endormis en tas à gauche (ronflements). Pitou flotte, sa lumière faible. | la maison sans toit + Pitou | wide groupe | 10.3 s |
| 2 | 0:11 | **P** — Brrr. Il fait froid, ce soir. Bouboule et Robi dorment déjà, épuisés. | Pitou frissonne, regard vers les dormeurs ; la maison se reflète dorée dans ses yeux : elle pense au feu. | visage de Pitou | medium P | 6.1 s |
| 3 | 0:17 | **G** — Pfff. Moi, je passais par là. Je regarde juste... mon futur toit. | Grincheux arrive en flottant, fait semblant de passer ; son nuage s'arrête au-dessus du mur : il regarde le futur toit. | Grincheux qui fait semblant | medium G puis group | 6.1 s |
| 4 | 0:23 | **P** — Ce soir, il nous faut un feu. Un petit feu dans la cheminée. | Pitou montre la cheminée de pierres plates au pied du mur (les pierres des fondations) : elle est vide. | la cheminée vide | medium + insert cheminée | 6.6 s |
| 5 | 0:30 | **F** — Un feu ? Moi ? Non, non, non... | Flamme se tasse (squish), une petite flamme vacille ; il recule d'un pas. | Flamme qui recule | reaction F | 3.6 s |
| 6 | 0:33 | **P** — Tu es notre seul dragon, Flamme. Tu sais faire du feu. | Pitou pose sa pointe sur lui, ton doux ; la flamme de Flamme monte un peu. | Pitou rassure | medium P-F | 5.7 s |
| 7 | 0:39 | **F** — Je sais en faire un trop grand. Et la maison est en bois. | Flamme regarde le mur de bois, puis ses pattes ; fumée minuscule au bout de son museau. | museau de Flamme | close F | 6.6 s |
| 8 | 0:46 | **P** — Alors on commence tout petit. Un tout petit, tout petit feu. | Pitou compte avec les doigts : un petit doigt, un tout petit feu ; Flamme hoche la tête. | Pitou et les doigts | medium P-F | 5.7 s |
| 9 | 0:51 | **G** — Pfff. Et si ça brûle ? C'est moi qui ai promis le toit. | Le nuage de Grincheux fonce : inquiétude cachée derrière le « Pfff » ; petite pluie sur sa tête. | nuage de Grincheux | reaction G | 6.1 s |
| 10 | 0:57 | **F** — Je... je vais essayer. | Flamme s'avance vers la cheminée, les yeux fermés, bouche en O. | Flamme yeux fermés | medium F | 2.8 s |
| 11 | 1:00 | **P** — Respire. Compte jusqu'à dix. Tout doucement. | Pitou à côté de lui, lumière douce ; il inspire (gonflement), Grincheux au fond, nuage prêt. | Flamme qui inspire | medium F-P | 3.6 s |
| 12 | 1:04 | **F** — Un... deux... trois... Hic ! | Flamme compte sur ses doigts ; au « trois », hic : étincelle, une planche du mur s'enflamme (petite flamme sur le mur). | la planche qui prend feu | insert planche puis wide | 2.8 s |
| 13 | 1:07 | **F** — Oh non ! La planche brûle ! La maison brûle ! | Flamme agite les bras ; la flamme monte sur le mur ; fumée. | la flamme sur le mur | wide (feu sur le mur) | 4.5 s |
| 14 | 1:11 | **P** — Grincheux ! Vite, ta pluie ! | Pitou se tourne vers Grincheux, lumière forte ; plan de réaction de Grincheux. | Grincheux qui réagit | reaction G | 2.8 s |
| 15 | 1:14 | **G** — Pfff ! J'arrive ! Psssh ! | Grincheux bondit : sa pluie tombe sur la flamme (psshh), fumée blanche ; il est trempé aussi ; la planche reste noircie. | la pluie sur la flamme | wide, léger shake | 2.4 s |
| 16 | 1:16 | **G** — Voilà, c'est éteint. Tu m'avais réchauffé, je t'éteins. On est quittes. | Grincheux, nuage blanchissant, gêné, regarde ailleurs ; Flamme, bouche ouverte, ne sait pas quoi répondre. | Grincheux gêné | medium G-F | 5.7 s |
| 17 | 1:22 | **R** — Bip... pluie... je ne rouille pas... bip... zzz. | Insert : la pluie a atteint Bouboule et Robi endormis ; Robi marmonne sans se réveiller ; Bouboule rebondit en ronflant (gag visuel). | les dormeurs sous la pluie | insert dormeurs | 4.5 s |
| 18 | 1:26 | **F** — Je le savais. J'ai brûlé une planche. Je suis dangereux. | Flamme assis, tête basse, suie sur la joue ; son feu est minuscule ; regard sur la planche noircie. | Flamme tête basse | close F | 5.3 s |
| 19 | 1:32 | **P** — C'est une seule planche, Flamme. Et personne n'est blessé. | Pitou s'approche, lumière douce, mains jointes ; Flamme ne la regarde pas. | Pitou doute | medium P-F | 4.9 s |
| 20 | 1:37 | **F** — Aujourd'hui une planche. Demain, toute la maison. Je préfère partir. | Flamme se lève, secoue la tête ; sa flamme s'éteint presque. | flamme presque éteinte | close F | 5.3 s |
| 21 | 1:42 | **G** — Pfff... Ne dis pas de bêtises. | Grincheux gêné : son nuage fait une toute petite pluie de malaise ; il tente quelque chose, n'y arrive pas. | Grincheux maladroit | reaction G | 3.6 s |
| 22 | 1:46 | **F** — Je vais dormir dans la forêt. Loin des maisons. | Flamme s'éloigne à droite (waddle), de dos ; la nuit tombe (tod night) ; fondu enchaîné vers la forêt. | Flamme de dos qui part | wide, suivre F | 4.9 s |
| 23 | 1:50 | **N** — Flamme marcha jusqu'à la forêt. Sa petite flamme tremblait, de plus en plus petite. | Forêt de nuit : sapins, lucioles, hibou ; Flamme petit au centre, sa flamme est la seule lumière ; il avance. | flamme dans la forêt | wide forêt | 7.0 s |
| 24 | 1:57 | **P** — Flamme, attends ! ... Grincheux, je ne sais pas quoi lui dire. | Retour sur la colline : Pitou et Grincheux près de la planche noircie ; Pitou regarde Grincheux, impuissante. | Pitou impuissante | medium P-G | 5.3 s |
| 25 | 2:03 | **G** — Pfff. Laisse-moi faire, Pitou. Je vais lui parler. | Grincheux hésite (regard vers la forêt noire : il tremble), puis décide : il part à droite, son nuage assombri. | Grincheux qui tremble | close G | 4.9 s |
| 26 | 2:08 | **G** — Flamme ! Attends. Je n'aime pas le noir. Reste allumé, s'il te plaît. | Forêt de nuit : Grincheux entre, tremblant, nuage presque noir ; ses yeux cherchent la petite flamme au loin. | nuage presque noir | medium G forêt | 6.1 s |
| 27 | 2:14 | **F** — Je te fais de la lumière ? Même après la planche ? | Flamme se retourne, surpris ; sa flamme grandit un peu, éclaire le visage de Grincheux. | flamme qui grandit | close F | 5.3 s |
| 28 | 2:19 | **G** — Ta flamme m'a réchauffé, un jour. Elle ne m'a jamais fait peur. | Plan à deux ; Grincheux relève la tête vers la flamme : le nuage s'éclaircit ; il sourit presque. | nuage qui s'éclaircit | medium G-F | 6.1 s |
| 29 | 2:25 | **G** — Et moi, ma pluie a gâché plein de pique-niques. Pfff. On s'en remet. | Grincheux regarde sa pluie, honteux ; Flamme ouvre grand les yeux. | Grincheux honteux | close G | 7.0 s |
| 30 | 2:32 | **F** — Vraiment ? Toi aussi, tu as fait des dégâts ? | Flamme s'assoit près de lui ; sa flamme monte, douce. | Flamme à côté de lui | medium G-F | 4.5 s |
| 31 | 2:37 | **G** — Une planche, ça se remplace. Un ami, non. Pfff. On retourne, d'accord ? | Close sur Grincheux : sourire timide, nuage blanc ; il hoche la tête. | sourire de Grincheux | close G | 6.1 s |
| 32 | 2:43 | **F** — D'accord. Mais j'ai quand même un peu peur. | Flamme se lève : un peu de peur, un peu de fierté. | Flamme: peur + fierté | close F | 4.5 s |
| 33 | 2:47 | **G** — Moi aussi. Alors on a peur ensemble. Pfff... ça va mieux. | Les deux avancent côte à côte, la petite flamme éclaire le chemin ; le nuage blanc au-dessus d'eux. | les deux qui marchent | wide deux | 5.7 s |
| 34 | 2:53 | **N** — Ils revinrent à la maison. Pitou les attendait, sa lumière allumée pour les guider. | Fondu vers la colline de nuit ; Pitou, sa lumière vive, les attend près des dormeurs ; ils entrent par la gauche. | retour à la maison | wide colline | 7.0 s |
| 35 | 3:00 | **P** — Vous revenez ! Flamme, on réessaie ? Cette fois, Grincheux reste tout près. | Pitou s'avance, Flamme et Grincheux au premier plan ; le feu de la cheminée est prêt (bois). | la cheminée prête | group | 5.7 s |
| 36 | 3:06 | **G** — Pfff. Mon petit nuage est prêt. Au cas où. | Grincheux place son nuage au-dessus de la cheminée, petite pluie en attente. | nuage en veille | reaction G | 4.9 s |
| 37 | 3:10 | **F** — Cette fois, je compte tout seul. Un... deux... trois... quatre... cinq... | Flamme face à la cheminée, yeux ouverts cette fois ; il compte sur ses doigts, Pitou silencieuse (gag retourné). | Flamme qui compte seul | medium F | 5.7 s |
| 38 | 3:16 | **F** — Six... sept... huit... neuf... dix. | Insert sur la bouche de Flamme ; inspire, souffle doux : une petite flamme naît dans la cheminée. | souffle de Flamme | insert F + cheminée | 3.2 s |
| 39 | 3:19 | **F** — Il est allumé ! Un tout petit feu. Tout sage. | Flamme saute de joie (hop) ; la flamme dans la cheminée est toute petite et sage. | le petit feu | wide | 4.9 s |
| 40 | 3:24 | **P** — Il est parfait. Regardez, la maison est toute dorée. | La lumière dorée du feu éclaire la maison et les amis ; Pitou, ravie. | maison dorée | wide dorée | 4.9 s |
| 41 | 3:29 | **F** — J'ai grillé une planche... et j'ai quand même allumé le feu. | Flamme montre la planche noircie, puis le feu : fierté mêlée de gêne. | planche noircie + feu | medium F | 5.7 s |
| 42 | 3:35 | **P** — Tu as recommencé, Flamme. Je suis fière de toi. | Pitou pose sa pointe sur Flamme ; plan de réaction de Grincheux qui hoche la tête. | Pitou touche Flamme | medium P-F | 4.9 s |
| 43 | 3:40 | **G** — Pfff... C'est chaud. Ça sent bon. | Grincheux, nuage tout blanc, regarde le feu ; il sourit pour de vrai. | sourire de Grincheux | close G | 3.6 s |
| 44 | 3:43 | **F** — Viens plus près, Grincheux. Il y a de la place. | Flamme tapote le sol à côté de lui, devant le foyer ; Grincheux hésite, nuage gris qui tremble. | Flamme qui fait de la place | medium F-G | 5.3 s |
| 45 | 3:49 | **G** — ... Merci, Flamme. | Grincheux s'assoit près du feu, tout contre Flamme ; son nuage devient tout blanc, une petite vapeur chaude monte de lui (il est réchauffé : l'inverse de l'ép. 2). Ils regardent le feu côte à côte. | Grincheux réchauffé à côté de Flamme | close G puis medium deux | 2.2 s |
| 46 | 3:51 | **B** — Bouboule, Bouboule, saute, saute... on recommence... zzz. | Gag final : Bouboule, endormi, rebondit avec chaque mot en chantant sa chanson ; Robi ronfle en rythme. | Bouboule qui chante en dormant | insert B | 4.0 s |
| 47 | 3:55 | **P** — Bonne nuit, tout le monde. Je monte briller pour vous. | Pitou monte l'escalier arc-en-ciel (rainbow show), se retourne et salue ; sa lumière rejoint le ciel. | Pitou sur l'escalier | wide escalier | 5.3 s |
| 48 | 4:00 | **N** — Dans la nuit, le premier feu brillait. Demain, Grincheux devrait tenir sa promesse : faire le toit. | Plan fixe de nuit : maison sans toit, feu doré, silhouettes ; la carte FIN suit. | maison et feu | wide fixe long | 7.8 s |

## Placement et accessoires (repères)
- Maison (`house walls`, EV-005) à x 0,62 (échelle plus grande que les personnages), piquet de l'ép. 3 caché derrière les murs. Foyer de pierres plates au pied du mur gauche (x 0,52). Dormeurs (B, R) en tas à x 0,18 ; Pitou x 0,38, Flamme x 0,50 → 0,44, Grincheux x 0,30.
- Forêt : Flamme x 0,70 → 0,60, Grincheux entre à gauche (x 0,15 → 0,45).
- Vertical : zones de sécurité de 07 ; plans serrés sur Flamme et Grincheux seuls (pas de coupe d'un personnage au bord, cible de caméra `[paysage, portrait]` vérifiée à chaque `shot`).

## F. Contrôles déjà faits sur ce document
- Répliques ≤ 15 mots (narrateur excepté), une idée par réplique ; aucune réplique sans action visible.
- 🔒 « Ce dont on parle doit se voir » : feu, planche, cheminée, nuage, escalier : chacun a son insert.
- Continuité vérifiée contre les faits établis des épisodes 1 à 5 : aucune contradiction (Grincheux a peur du noir depuis l'ép. 4 ; Flamme a été éteint par l'eau à l'ép. 5 mais ici la pluie est celle de Grincheux, sur la maison ; Pitou monte briller le soir ; la maison a ses fondations ; Grincheux fera le toit à l'ép. 8).
- Gags récurrents : chacun une seule fois, deux retournés.
- Épisodes 1 à 5 non modifiés.

## G. Risques techniques à vérifier (étapes F et H)
1. **EV-005** (`house walls`, `fire`) : lisibilité de la planche qui brûle et de la trace noire en paysage et portrait.
2. **Forêt de nuit avec la lueur de Flamme** : lisibilité des visages, pas de détail clair derrière les têtes.
3. **Pluie de Grincheux sur le mur** : effet `rain` existant, à positionner sur la maison.
4. **Fluidité caméra** : contrôle `qc_fluidite.py` obligatoire, deux formats, avant livraison.
5. **Cible de caméra portrait** (leçon de l'ép. 5) : tout `shot` à cible double vérifié sur capture portrait.

## Suite après validation
Étapes F à N dans l'ordre : EV-005 sur branche indépendante (tests ép. 1–5), caméra, direction des personnages, animations (`episodes/ep006.json`), voix (workflow GitHub sur main), sons et musique, montage (deux formats), contrôle qualité (fluidité CONFORME dans les deux formats), export, puis mise à jour de `serie/bible.json` et de la continuité (09).
