# Outils de contrôle (lecture seule — ne modifient ni moteur ni épisodes)
- `qc_audio.py video.mp4 [lignes.json]` : LUFS, crêtes, trous, écart de niveau entre personnages.
- `qc_video.py video.mp4 [dossier]` : durée, résolution, noir, images figées, planche-contact + une image / 3 s.
- `qc_cadrage.js out/epNNN.html` : zones de sécurité (personnages et maison non coupés, sous-titres dégagés, paysage et vertical).
- `qc_lipsync.js out/epNNN.html` : synchro labiale mesurée sur le moteur (seule la bouche du parleur bouge ; narrateur = aucune bouche).
- `qc_camera.js out/epNNN.html` : sauts de caméra, plans trop courts.
- `shot_images.js` / `lignes_temps.js` : images à des instants précis et temps des répliques (copies des outils de travail ; adapter le chemin `out/test_*.html`).
Playwright et ffmpeg requis.

Option `--scene` de `qc_video.py` : ne pas appliquer la contrainte de durée d'un épisode (scènes de démonstration).
