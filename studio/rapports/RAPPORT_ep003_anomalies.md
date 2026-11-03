# Rapport qualité — épisode 3 : anomalies connues (contrôle de fluidité caméra)
Bible : 1.1.0 · Outil : `studio/outils/qc_fluidite.py` · Contrôle rétroactif du 3 nov. 2026 sur le rendu publié (`ep003_paysage_16x9.mp4`, `ep003_vertical_9x16.mp4`).
Décision d'Aaron (3 nov. 2026) : **le rendu actuel est conservé**. Les anomalies restent documentées ici.

| Format | Horodatage | Niveau | Constat | Cause |
|---|---|---|---|---|
| Paysage | 39,67 s | **BLOQUANT** (au sens de la règle 10_qualite ; livré avant l'existence de la règle) | Coupe sèche à la place du fondu entre deux décors (changement `set`) | Défaut moteur EV-002 : le décor entrant garde une opacité de 1 ; le fondu n'existe que si le décor sortant est dessiné au-dessus |
| Vertical | — | non reporté par l'outil | Même changement de décor, à vérifier au visionnage | idem |

Suites : correctif EV-002 sur la branche `ev-002-transition-decors` (moteur, activé par `engine: 3`, épisode 3 inchangé). Un nouveau rendu de l'épisode 3 n'est pas prévu sans décision d'Aaron.
