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
| Saut de caméra | aucun changement > 25 % de la largeur en moins de 0,2 s | `outils/qc_camera.js` |
| Durée minimale d'un plan | ≥ 2,5 s en dialogue (sauf gag) | `outils/qc_camera.js` |
| Image noire / figée | aucune image noire hors fondu ; aucune image figée > 4 s hors pause | `outils/qc_video.py` |
| Synchro labiale | l'ouverture de bouche commence à ±80 ms de l'attaque de la voix ; fermée pendant les silences | `outils/qc_video.py` (échantillons) + regard humain |
| Durée | 3 min 30–6 min, jamais plus de 7 min | `outils/qc_video.py` |
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

## Rapport de contrôle (livrable)
Forme : tableau « Axe | Note | Constat (avec horodatage) | Correction proposée » + liste des **blocants** + verdict :
- **VALIDÉ** : aucun X, au plus 2 C non critiques.
- **À REPRENDRE** : un X ou plus de 2 C. La liste numérotée des corrections est renvoyée aux compétences concernées, puis nouveau rendu et nouveau rapport.
Le rapport indique la version de la bible utilisée.

## Autocritique obligatoire
Avant de présenter un épisode à Aaron, la compétence supervision-qualite écrit sa propre critique : ce qui fonctionne, ce qui la gêne encore, ce qu'elle ferait différemment avec plus de temps, et les améliorations à tenter au prochain épisode.
