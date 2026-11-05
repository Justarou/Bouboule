# Rapport de contrôle — Épisode 7 « Pitou regarde les étoiles » (v1)

Bible 1.4.0 · 5 novembre 2026 · branche `ep-007-production` (moteur 5 + EV-006, branche `ev-006-fenetre`).

- 41 répliques, **3 min 08** (188,7 s avec générique et carte FIN) : sous la fourchette de 3 min 30, bien dans le maximum de 4 min (décision d'Aaron, crédits ElevenLabs). Décors : colline (crépuscule → nuit étoilée), maison avec murs et fenêtre ronde.
- **EV-006** : `house window show/lit/mark/hide` (fenêtre ronde, lanterne, message sur la vitre), `fx shootstar` (étoile filante). Non-régression ép. 1 à 6 : 16/16 images identiques chacun.
- Caméra (moteur) : CONFORME, aucun saut. Fluidité vidéo : paysage CONFORME (0 anomalie) ; portrait CONFORME dans les 3 segments de 79 s (0 anomalie).
- Audio : −15,5 LUFS, crête −1,4 dBFS ; aucun trou hors le début (générique). Vidéo : aucune image noire ni figée.
- Synchro labiale : 3 alertes, 2 corrigées (descente de Pitou plus rapide, visage de Flamme) ; reste « bouche peu mobile » de Pitou quand elle regarde la fenêtre (profil).
- Cadrage : 62 alertes paysage, 92 portrait, surtout le nuage de Grincheux qui touche le haut et les personnages sous les sous-titres ; à traiter dans une évolution des fenêtres verticales.
- Relecture logique : fenêtre justifiée (« Le toit cachera le ciel »), Pitou monte puis redescend, vitre posée avant d'être lavée, lanterne allumée avant son retour, escalier arc-en-ciel visible seulement pendant ses trajets, étoile filante vue par elle seule.
- À faire après validation : fusion (EV-006 + ép. 7), `bible.json`, continuité (09), statut dans `saison1.json`.
