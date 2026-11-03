# Rapport de contrôle qualité — scène démo « Robi compte les pas » (v3, bible 1.0.0)
Rendus réels analysés : paysage 1920×1080 et vertical 1080×1920, 42,0 s, vraies voix ElevenLabs (Narrateur, Bouboule, Robi), synchro labiale, bruitages, musique douce, ambiance d'oiseaux, mouvements de caméra, animations. Moteur et épisode 4 non modifiés. Scène : `studio/demo/demo01.json` (copie de travail `episodes/demo99.json` pour la génération des voix).

## Historique des itérations (le contrôle a servi)
| Version | Verdict | Défauts trouvés |
|---|---|---|
| v1 | À reprendre | Bouboule caché derrière Robi (X) ; arc-en-ciel sans cause (C) ; maison coupée (C) |
| v2 | À reprendre | « pierres » citées mais jamais montrées — viole 🔒 « ce dont on parle doit se voir » (X) ; générique « FIN » sur le toit en paysage (C) ; Bouboule à 3 % du bord en vertical (C) ; ambiance quasi inaudible entre les répliques (C) |
| **v3** | **VALIDÉ** | voir ci-dessous |

## Mesures sur les rendus réels
| Contrôle | Résultat | Seuil | |
|---|---|---|---|
| Loudness | −16,0 LUFS (paysage et vertical) | −16 ± 1,5 | ✔ |
| Crête | −2,7 dBFS | < −1 | ✔ |
| Écart de niveau entre voix | N −18,2 / B −19,4 / R −20,3 dB → 2,1 dB | ≤ 3 dB | ✔ |
| Trous audio > 1,5 s | aucun ; entre les répliques l'ambiance reste à −34/−39 dB (v2 : −43/−45) | — | ✔ |
| Durée / formats | 42,0 s dans les deux formats | ±0,1 s | ✔ |
| Image noire / figée | aucune | — | ✔ |
| Caméra | aucun saut brusque (qc_camera.js) | — | ✔ |
| Cadrage | maison entière et personnages dans les marges 5 % dans les deux formats (qc_cadrage.js) ; seule alerte : entrée de Bouboule par la gauche (normale) | marges ≥ 5 % | ✔ |
| Synchro labiale | seule la bouche du parleur bouge sur les 4 répliques parlées, narrateur = aucune bouche (qc_lipsync.js) ; contrôle visuel de quelques images | — | ✔ (limites ci-dessous) |

## Vérification artistique (jugement, pas seulement mesures)
| Axe | Note | Constat |
|---|---|---|
| Mise en scène / intention | A | Chaque scène a son point focal : Robi seul qui doute (plan serré), duo, pas vers la maison, maison qui grandit. L'objet cité (piquet, pas, maison) se voit. |
| Cohérence émotionnelle | B | Du doute (« la maison sera lente ») à une fierté timide : lisible, mais la fierté finale de Robi ne dure que ~1 s avant le plan de la maison. |
| Mouvement | B | Les trois pas de Robi puis le saut sont clairs ; le saut est un peu bref pour « hop ! ». |
| Cadrage / composition | A | Maison à droite, personnages à gauche (règle 07), toit entier, texte de fin dégagé, vertical aussi lisible que le paysage. |
| Rythme | B | Pauses correctes ; la dernière phrase du narrateur arrive juste après le saut sans temps de respiration. |
| Son | B | Voix claires et homogènes ; ambiance maintenant audible ; la musique douce reste très discrète — à écouter par Aaron ; un seul bruitage (xylo) pour les pas. |
| Public 6–9 ans | B | Doute de soi + humour de « compter nos pas » : bon niveau ; la scène est courte, la nuance n'est qu'esquissée. |
| Continuité | A | Rappel de l'échec du Bâtimatic (« sans machine, la maison sera… lente »), maison cohérente avec l'ép. 3 et 4. |

**Bloquants : aucun. Réserves (C) : fierté finale brève ; deux voix plus faibles que le narrateur de 1–2 dB (dans la tolérance) ; musique à vérifier à l'oreille.**

## Limites de cette validation (honnêteté)
- La scène ne contient que Bouboule, Robi et le narrateur : Pitou (voix la plus faible), Grincheux et Flamme ne sont pas testés ici ; le décor est la colline seule.
- La synchro labiale est vérifiée par la mesure du mouvement des bouches et quelques images, pas image par image.
- Le niveau des bruitages sous les voix n'est pas isolé par un outil (le mixage les baisse automatiquement) ; il est contrôlé par le loudness global et l'écoute.
- Le générique « FIN » est bien dégagé ici parce que la maison est à droite ; ce n'est pas garanti pour d'autres compositions.

## Autocritique
Ce qui marche : la chaîne A→N a produit un rendu propre en deux formats ; trois outils (cadrage, caméra, synchro) attrapent des défauts que je n'aurais pas vus en relisant le JSON ; le cycle « rapport → corrections → nouveau rendu » a été utilisé deux fois. Ce qui me gêne : la scène est simple (deux personnages, un décor) donc c'est une référence de **méthode** plus que de richesse ; la musique et les pas manquent de relief ; le contrôle artistique reste une lecture humaine/IA, pas une mesure. À améliorer au prochain épisode : un outil qui extrait une image par réplique dans les deux formats ; un vrai test de séparation voix/bruitages ; une scène de référence avec 3–4 personnages dont Pitou.
