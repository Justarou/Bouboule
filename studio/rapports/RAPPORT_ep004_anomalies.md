# Rapport qualité — épisode 4 : anomalies connues (contrôle de fluidité caméra)
Bible : 1.1.0 · Outil : `studio/outils/qc_fluidite.py` · Contrôle rétroactif du 3 nov. 2026 sur le rendu publié.
Décision d'Aaron (3 nov. 2026) : **publication maintenue vendredi 6 nov. avec le rendu actuel.** Les anomalies restent documentées ici.

| Format | Horodatage | Niveau | Constat | Cause |
|---|---|---|---|---|
| Paysage | 44,13 s | **BLOQUANT** (règle postérieure à la livraison) | Coupe sèche colline → forêt (le fondu `set` de 1,4 s n'est pas visible) | EV-002 : opacité du décor entrant fixée à 1 |
| Vertical | 7,1 s ; 11,7–13,2 s ; 44,13–45,1 s | à examiner (non visionnés au 3 nov.) ; 44,13 s = même coupe que le paysage | fenêtres signalées par l'outil | 44,13 s : EV-002 ; les deux autres : à qualifier |
| Les deux | dès 45 s, jusqu'à la fin | contenu (continuité) | Le piquet-drapeau de la colline reste visible dans la forêt | Accessoire `house stake` non lié à son décor (corrigé par EV-002 sous `engine: 3`) |

Suites : correctif EV-002 sur la branche `ev-002-transition-decors` ; épisode 4 inchangé.
