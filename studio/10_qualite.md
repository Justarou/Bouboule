# 10 — Standards de qualité et contrôle audiovisuel

🔒 FONDAMENTAL — **Un épisode n'est jamais validé parce qu'il « fonctionne techniquement ».** On valide sur le **rendu réel** (vidéo, son) et sur la grille ci-dessous. Un critère bloquant non satisfait = épisode refusé.

## Les 10 axes de jugement
1. Mise en scène (intention de scène claire, point focal).
2. Lisibilité de l'action (on comprend ce qui se passe sans les mots).
3. Cohérence émotionnelle (les émotions se suivent logiquement et se voient).
4. Fluidité des mouvements (pas de saut, pas de glissade bizarre).
5. Cadrage (objets cités visibles, personnages parlants dans le cadre, sous-titres dégagés).
6. Continuité visuelle (positions, objets, heure, décor).
7. Rythme (pas de longueur, pas de précipitation, pauses aux bons endroits).
8. Efficacité narrative (problème clair, escalade, résolution, morale incarnée).
9. Adaptation au public 6–9 ans.
10. Son (voix homogènes, bruitages sous les voix, ambiances propres, musique discrète).

Chaque axe est noté : **A** (très bon), **B** (acceptable), **C** (à reprendre), **X** (bloquant).

## Seuils mesurables (sur le rendu)
| Contrôle | Seuil | Outil |
|---|---|---|
| Loudness final | −16 LUFS ±1,5 ; crêtes < −1 dBFS | `outils/qc_audio.py` |
| Écart de niveau entre personnages | ≤ 3 dB | `outils/qc_audio.py` |
| Bruitages pendant une réplique | ≥ 6 dB sous la voix | `outils/qc_audio.py` |
| Trou audio non voulu | aucun silence > 1,5 s hors pause notée ; aucun trou dans une ambiance | `outils/qc_audio.py` |
| Cadrage (zones de sécurité) | aucun personnage/objet clé coupé ou sous le sous-titre, marges ≥ 5 % (voir 07) | `outils/qc_cadrage.js` |
| Saut de caméra (moteur) | aucun changement > 25 % de la largeur en moins de 0,2 s | `outils/qc_camera.js` |
| **Fluidité caméra (rendu)** | niveau **CONFORME** exigé : aucune image dupliquée en plein mouvement, aucune micro-coupure, aucun à-coup (voir section ci-dessous) | `outils/qc_fluidite.py` (paysage ET vertical) |
| Durée minimale d'un plan | ≥ 2,5 s en dialogue (sauf gag) | `outils/qc_camera.js` |
| Image noire / figée | aucune image noire hors fondu ; aucune image figée > 4 s hors pause | `outils/qc_video.py` |
| Synchro labiale | seule la bouche du personnage qui parle bouge (amplitude ≥ 4, autres ≤ 60 % de la sienne) ; narrateur = aucune bouche ; contrôle visuel sur échantillons | `outils/qc_lipsync.js` + regard humain |
| Durée | 3 min 30–4 min, jamais plus de 4 min 15 | `outils/qc_video.py` |
| Formats | paysage 1920×1080 et vertical 1080×1920, même durée à ±0,1 s | `outils/qc_video.py` |

## Contrôle visuel obligatoire (planches-contact)
1. Extraire une image toutes les 3 s (`outils/qc_video.py` → planche-contact par format).
2. Pour chaque réplique : image à 1 s et à la fin → vérifier expression, regard, cadrage, sous-titre.
3. Pour chaque **objet cité à l'oral** : au moins une image où il est entier et lisible (paysage ET vertical).
4. Pour chaque **changement de lieu** : image avant, pendant le fondu, après.
5. Pour chaque **gag visuel** : séquence de 5 images.
6. Écouter : 20 premières secondes, un gag, un changement de lieu, une réplique de chaque personnage, la fin.

## Problèmes à signaler (liste de contrôle)
- **Cadrage** : personnage coupé, objet clé hors cadre ou caché derrière un personnage, sous-titre sur un visage, plan trop serré en vertical.
- **Expression** : émotion illisible, expression qui ne correspond pas à la réplique, changement brutal, regard dans le vide.
- **Mouvement** : glissade, saut, rotation étrange, personnage qui flotte ou ne touche pas le sol, anticipation absente d'un saut.
- **Synchro labiale** : bouche qui bouge quand un autre parle, bouche immobile quand le personnage parle, formes de bouche répétitives.
- **Rythme** : réplique trop longue sans action, deux plans trop courts d'affilée, pause absente après un gag.
- **Cohérence visuelle** : objet qui change de taille ou de place, heure incohérente, décor qui change sans transition.
- **Son** : une voix plus faible, bruitage trop fort, trou dans une ambiance, musique qui couvre.

## 🔒 FONDAMENTAL — Contrôle obligatoire de la fluidité des mouvements de caméra
Règle imposée par Aaron le 3 nov. 2026. Certaines générations produisent parfois des mouvements de caméra saccadés ou irréguliers : ce n'est pas systématique, **donc le contrôle est systématique**, pour **chaque épisode et chaque scène démo, dans les deux formats**, **avant toute livraison**. Il fait partie de la chaîne (étapes F, L, M, N dans `chaine_production.md`) ; une livraison sans rapport de fluidité est interdite.

### Contenu du contrôle
1. **Détection des saccades et micro-coupures** : `python3 studio/outils/qc_fluidite.py video.mp4` mesure image par image (images dupliquées au milieu d'un mouvement, sauts brutaux, coupe sèche à la place d'un fondu). Pré-contrôle côté moteur, avant rendu : `node studio/outils/qc_camera.js out/epNNN.html`.
2. **Vérification des mouvements brusques ou irréguliers** : à-coups de déplacement (accélération anormale d'une image à l'autre), plans trop courts, zigzag.
3. **Visionnage des passages suspects** : l'outil extrait trois images par fenêtre suspecte (`…_fluidite/suspects/`) ; la supervision les regarde **et** visionne le passage dans la vidéo ; elle décide s'il s'agit d'un vrai défaut ou d'un événement voulu (par ex. un changement de sous-titre est exclu, une coupe voulue est notée dans la fiche d'intention).
4. **Nouvelle génération du plan concerné si nécessaire** : on corrige la cause (réglage de caméra dans l'épisode, ou relance du rendu si c'est un accident de génération) et on relance le rendu du format concerné (`render_video.js`, ~20 min ; limitation actuelle : le script rend l'épisode entier, il n'existe pas encore de rendu d'un seul plan).
5. **Vérification du résultat après correction** : on relance `qc_fluidite.py` sur le nouveau rendu **et** on revoit le passage corrigé ; le rapport garde la trace de chaque tour.

### Trois niveaux de verdict (inscrits dans le rapport de contrôle, pour chaque format)
| Niveau | Sens | Conséquence |
|---|---|---|
| **CONFORME** | aucun défaut détecté (ou suspects examinés et reconnus voulus, avec justification écrite) | livraison possible (si le reste est VALIDÉ) |
| **À CORRIGER** | anomalie légère (image dupliquée isolée, à-coup isolé, micro-coupure légère) | correction **obligatoire**, nouveau rendu et nouveau contrôle ; **pas de livraison tant que le niveau n'est pas CONFORME** |
| **BLOQUANT** | défaut franc ou persistant (coupe sèche non voulue, ≥ 4 anomalies en 1,5 s, défaut qui revient après correction) | **livraison interdite**, remontée à Aaron avec cause et proposition ; si la cause est dans le moteur, fiche d'évolution (`11_moteur.md`) |
Un défaut qui persiste après **deux** corrections passe en BLOQUANT.

### Interdictions
Ne jamais livrer un rendu non contrôlé ; ne jamais classer un défaut « CONFORME » sans l'avoir regardé ; ne jamais masquer un défaut en ignorant une fenêtre sans justification écrite.

## Checklist de livraison (à cocher dans chaque rapport, dans cet ordre)
- [ ] Rendus paysage ET vertical existent, durée identique (±0,1 s)
- [ ] Audio : loudness, écart des voix, trous (`qc_audio.py`)
- [ ] Vidéo : noir / figé / planche-contact (`qc_video.py`)
- [ ] Cadrage : zones de sécurité (`qc_cadrage.js`)
- [ ] Synchro labiale (`qc_lipsync.js`)
- [ ] **Fluidité caméra : niveau CONFORME dans les deux formats (`qc_camera.js` + `qc_fluidite.py`)**
- [ ] Passages suspects visionnés, décisions écrites
- [ ] Vérification artistique et autocritique
- [ ] Verdict global VALIDÉ ; continuité mise à jour (09)

## Rapport de contrôle (livrable)
Forme : tableau « Axe | Note | Constat (avec horodatage) | Correction proposée » + liste des **blocants** + verdict :
- **VALIDÉ** : aucun X, au plus 2 C non critiques, **et fluidité caméra CONFORME dans les deux formats**.
- **À REPRENDRE** : un X, plus de 2 C, ou fluidité caméra À CORRIGER / BLOQUANT. La liste numérotée des corrections est renvoyée aux compétences concernées, puis nouveau rendu et nouveau rapport.
Le rapport indique la version de la bible utilisée.

## Autocritique obligatoire
Avant de présenter un épisode à Aaron, la compétence supervision-qualite écrit sa propre critique : ce qui fonctionne, ce qui la gêne encore, ce qu'elle ferait différemment avec plus de temps, et les améliorations à tenter au prochain épisode.
