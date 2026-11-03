# Outils de contrôle (lecture seule — ne modifient ni moteur ni épisodes)
- `qc_audio.py video.mp4 [lignes.json]` : LUFS, crêtes, trous, écart de niveau entre personnages.
- `qc_video.py video.mp4 [dossier]` : durée, résolution, noir, images figées, planche-contact + une image / 3 s.
- `qc_camera.js out/epNNN.html` : sauts de caméra, plans trop courts.
- `shot_images.js` / `lignes_temps.js` : images à des instants précis et temps des répliques (copies des outils de travail ; adapter le chemin `out/test_*.html`).
Playwright et ffmpeg requis.
