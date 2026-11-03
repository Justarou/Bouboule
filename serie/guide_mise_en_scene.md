> Ce guide est complété par la bible du studio (`studio/`, v1.0.0). En cas de contradiction, la bible du studio prime.

# Guide de mise en scène, de son et de scénario — « Bouboule et ses amis »

À relire AVANT d'écrire ou de mettre en scène chaque épisode, et à cocher à la fin (liste de contrôle en bas).
Sources : principes de « staging » en animation (clarté, point focal unique, caméra au service du récit — cg-wire, Fiveable, Brian Lemay, Nancy Beiman), grammaire de plans classique du cinéma d'animation, et retours d'Aaron sur l'épisode 3.

## 1. Caméra : montrer ce dont on parle
- **Règle d'or : si un personnage parle d'un objet, le spectateur doit le voir, en entier et lisible.** Plan d'insert (gros plan sur l'objet) dès que la réplique le nomme (plan de la maison, machine, pierre, étoile…). Cadrer l'objet, pas le personnage. Tenir le plan pendant toute la réplique, puis revenir aux personnages.
- Un objet important a un **point focal unique** : grand, contrasté, sans détail concurrent autour (décor calme derrière).
- Variété des plans, avec une raison à chaque changement :
  - **Plan général** : pour situer un lieu, au début d'une scène et à chaque arrivée.
  - **Plan de groupe / moyen** : quand plusieurs personnages interagissent.
  - **Gros plan** : émotion forte ou information importante.
  - **Très gros plan / plan de réaction** : un personnage silencieux réagit (peur, honte, joie). Idéal pour le gag.
  - **Insert** : objet, mécanisme, plan, cadran.
- Jamais de changement de plan « gratuit ». Pas plus d'un changement de plan toutes les 3 secondes. Pas de zigzag (l'auto-cadrage est lissé ; les fenêtres `cam`/`shot` explicites prennent le dessus et ne doivent pas se chevaucher).
- Cadrage par tiers : le sujet principal sur une ligne de tiers, pas au centre, avec de l'air devant le regard.
- **Sens de l'écran** : quand un personnage marche vers la droite, il continue vers la droite au plan suivant. Un trajet « aller » va dans une direction, le « retour » dans l'autre.
- Le **plan large** de contexte revient avant une réplique importante, pas seulement au début.
- Caméra mobile douce et motivée (suivre un déplacement, révéler). Pas de mouvement qui distrait.
- Portrait (Shorts/TikTok) : la largeur utile est réduite. Vérifier que l'objet de l'insert tient dans le cadre vertical (utiliser une cible en coordonnées `"x213"` plutôt qu'une fraction de scène, qui dépend du format).

## 2. Changer de lieu : jamais d'un coup
Séquence type (3 temps), avec le même sens de marche :
1. **Départ** : les personnages **sortent** du plan (`exit` vers la gauche, en décalé : un par un, chacun avec sa démarche) pendant la réplique « allons à… », avec un plan général.
2. **Fondu enchaîné** du décor (`["set", "lieu", 1.2]`, 1,2 s) pendant la phrase du narrateur qui annonce le lieu ; ambiance sonore en fondu aussi.
3. **Arrivée** : ils **entrent** de l'autre côté (par la droite) et marchent jusqu'à leur place (`enter`), avec un plan général qui présente le décor (1 à 2 s de respiration avant la prochaine réplique).
Retour ou lieu suivant : sens inverse. Le narrateur annonce le lieu pendant le fondu.

## 3. Mixage sonore (rendu final)
- **Voix** : chaque ligne est normalisée automatiquement (`vg`, niveau cible ≈ -20 dBFS RMS). Une voix plus faible que les autres (Pitou) est remontée jusqu'à ×4. Vérifier à l'oreille un extrait de chaque personnage.
- **Bruitages** : bus à 0,36 (avant 0,62) et **atténués de 45 %** pendant qu'on parle. Un bruitage ne doit jamais couvrir une réplique. Les gros bruits (explosion, chute) restent entre les répliques.
- **Musique** : 0,26, baissée à 34 % pendant les voix. **Ambiance** : 0,24.
- **Ambiances en boucle** : on coupe le début et la fin du fichier (fondus, silences) et on enchaîne en **fondu croisé de ~2 s**, pour éviter le trou audible à chaque tour.
- Silences voulus : après une chute ou une blague, laisser 0,5 s de silence avant la réplique suivante.
- Contrôle avant publication : écouter les 20 premières secondes, une chute, un changement de lieu et la fin.

## 4. Scénario (6–9 ans, épisodes de 3 min 30 à 6 min — règles complètes : `studio/08_narration.md`)
- **Accroche en 10 secondes** : une question, un problème visible ou un gag.
- **Une seule intrigue**, un problème clair énoncé tôt, 3 péripéties qui montent (essai → raté drôle → autre idée), résolution par la coopération ou une qualité du personnage.
- **Au moins un gag visuel** (qu'on comprend sans les mots) et un moment d'émotion lisible (tristesse, fierté).
- **2 à 3 personnages principaux** par épisode ; les autres réagissent en plan de réaction.
- **Pas de personnages immobiles qui discutent** : chaque réplique s'accompagne d'une action, d'un déplacement ou d'une réaction visible. Répliques courtes (≤ 15 mots, ≤ 8 s).
- Vocabulaire clair (un mot nouveau par épisode au plus) ; répétitions rythmiques avec variation (refrain, compte à rebours retourné) : à 6–9 ans on aime anticiper puis être surpris.
- Petite morale naturelle dite par un personnage (pas par le narrateur seul), conclusion positive ou amusante, teaser de l'épisode suivant.
- Cohérence de série : tenir `serie/bible.json` à jour (qui sait quoi, objets, lieux) et ne pas contredire un épisode précédent.

## 5. Liste de contrôle avant rendu
- [ ] Chaque objet cité à l'oral est montré en gros plan lisible (et fonctionne en vertical).
- [ ] Chaque changement de lieu : sortie → fondu → entrée, même sens de marche.
- [ ] Aucun plan changé sans raison ; pas de zigzag de caméra (script `camdump.js`).
- [ ] Niveaux des voix homogènes (`vg` entre 0,55 et 4) ; bruitages sous les voix ; ambiances en fondu croisé.
- [ ] Gag visuel + émotion + morale présents ; accroche < 10 s.
- [ ] Sous-titres : ne cachent ni personnages ni objet clé (vérifier paysage ET vertical).
- [ ] Rendu complet regardé/écouté au moins en partie avant publication.
