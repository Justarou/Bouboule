# Rapport de production test — scène démo « Robi compte les pierres » (bible 1.0.0)
Scène de 38 s, 6 répliques (N, B, R), hors `episodes/`, aucun changement du moteur ni de l'épisode 4. Build : `build_episode.py --fake` (voix non générées : estimation des durées ; le test son n'est donc pas fait).

## Chaîne parcourue
A idée (Robi doute après l'échec du Bâtimatic — continuité ép. 3) → B scénario → C structure (problème : la maison sera lente ; surprise : Robi se lance ; résolution : un vrai petit pas) → D/E scènes et plans → F caméra (wide/medium/reaction/group + cible `[x,y]`) → G jeu (tristesse → fierté timide) → H verbes `do` → K bruitage `xylo` + musique douce → L build → M contrôle sur images.

## Contrôle (images paysage + vertical à 5 instants, qc_camera.js)
| Axe | Note | Constat | Correction |
|---|---|---|---|
| Caméra / sauts | A | aucun saut (qc_camera.js) | — |
| Cadrage (v1) | X → corrigé | Bouboule caché derrière Robi (placements à 0,40/0,45) | Robi à 0,56, Bouboule entre à 0,30 ✔ (v2) |
| Cohérence narrative | C → corrigé | arc-en-ciel final sans cause | supprimé ✔ |
| Cadrage maison | C (reste) | au plan de fin la toiture touche le haut du cadre (paysage) et la maison est coupée à droite (vertical) | cible de caméra à décaler / zoom 1,05 au lieu de group : à refaire par cinematographie |
| Expressions | B | Robi triste lisible ; la fierté finale est peu visible à 1,5 s | prolonger le plan `medium R` |
| Son | non testé | voix absentes (pas de clé ElevenLabs ici) | test réel à faire via GitHub Actions |

**Verdict : À REPRENDRE (2 corrections mineures) — la chaîne fonctionne et le contrôle sur images a détecté deux vrais défauts avant présentation.**

## Autocritique
Ce qui marche : les fiches d'intention imposent un point focal ; le contrôle en images paysage/vertical attrape ce que la lecture du JSON ne voit pas (personnage masqué). Ce qui gêne : le cadrage vertical d'une grande maison reste un compromis du moteur (limite connue, `11_moteur.md`) ; l'outil de capture d'images est encore manuel. À améliorer : script qui sort automatiquement une image par réplique (début/fin) dans les deux formats ; test son réel dès que les voix existent.
