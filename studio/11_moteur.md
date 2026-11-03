# 11 — Bible du moteur de production (ce qui est possible, ce qui ne l'est pas)

🔒 FONDAMENTAL — **Les compétences ne modifient pas le moteur.** Elles produisent des livrables compatibles avec lui. Si une idée dépasse le moteur, la compétence décrit l'**adaptation nécessaire** (voir « Demande d'évolution ») et attend la validation d'Aaron.

## Architecture
- **Épisode** : un fichier `episodes/epNNN.json` (réplique par réplique, avec une liste d'actions `do`).
- **Voix** : générées par ElevenLabs via GitHub Actions (`scripts/generate.py`) et rangées dans `audio/epNNN/lineNN.mp3` ; une prise existante n'est jamais régénérée. L'API ElevenLabs n'est **pas** accessible depuis l'espace de travail de Claude.
- **Assemblage** : `python3 scripts/build_episode.py epNNN` produit `out/epNNN.html` (moteur SVG + voix + bruitages + musique, un seul fichier).
- **Moteur** : `engine/` (`engine.js` timeline et caméra, `chars.js` personnages, `sets.js` décors, `audio.js` sons, `ui.js` lecteur).
- **Export** : `scripts/render_video.js out/epNNN.html land|port out.mp4` (Playwright + ffmpeg ; environ 20 min pour 3 min 30, deux formats en parallèle sur 2 processeurs).
- **Moteur « v2 »** : activé par `"engine": 2` dans l'épisode (voix normalisées, synchro labiale, vie des personnages, relief, plans, fondus, décor sans parallaxe). Les épisodes 1 et 2 sont en moteur 1 (inchangés).

## Format d'une réplique
`{ "who": "B", "text": "…", "tags": "[excited] [childlike voice]", "do": [ [décalage, verbe, …], … ] }`
Le décalage est en secondes depuis le début de la réplique ; `"e-2.4"` = 2,4 s avant la fin.

## Verbes disponibles
| Verbe | Syntaxe | Effet |
|---|---|---|
| `place` | `place, qui, x` | position de départ (fraction 0–1 de la scène) |
| `enter` / `exit` | `enter, qui, côté(L/R/pop/drop), x, durée, style` / `exit, qui, côté, durée, style` | entrée / sortie en marchant (styles : `walk`, `hop`, `float`, `waddle`, `drive`) |
| `move` | `move, qui, x, durée, style` | déplacement |
| `mood` | `mood, qui, émotion` | expression (progressive) |
| `look` | `look, qui, cible` | regard (personnage, `cam`, `up`, `L`, `R`) |
| `anim` | `anim, qui, nom, durée, paramètre` | `hop`, `jump`, `nod`, `squish`, `spin`, `shake`, `tremble`, `dance`, `cheer`, `bounce`, `puff`, `lean`, `fall`, `flop`, `ascend` |
| `fx` | `fx, qui, effet, durée` | `sparkle`, `hearts`, `smoke`, `stars`, `confetti`, `sweat`, `rain`, `steam`, `foam`, `lightning`, `fireworks`… |
| `glow` | `glow, qui, valeur, durée` | lueur (Pitou) |
| `sfx` | `sfx, clé, volume, variante` | bruitage de la banque |
| `amb` | `amb, clé, volume, durée` | ambiance en boucle |
| `music` | `music, style, volume` | `joyeux`, `doux`, `mystere`, `fete` |
| `tod` | `tod, moment, durée` | `dawn`, `day`, `dusk`, `night`, `gloom` |
| `set` | `set, lieu, durée du fondu` | change de décor en fondu (v2) |
| `beams` | `beams, 0/1` | rayons de lumière |
| `rainbow` | `rainbow, show/hide, durée` | arc-en-ciel |
| `shake` | `shake, force` | secousse de caméra |
| `shot` | `shot, type, cible, durée` | plan relatif : `wide`, `group`, `medium`, `close`, `extreme`, `reaction` |
| `cam` | `cam, cible, zoom, durée, y` | cadrage libre (cible : personnage, `group`, fraction, `"x213"`, ou `[paysage, vertical]`) |
| `machine`, `house`, `ball` | voir `05_decors.md` | accessoires animés |
| `hic`, `soot`, `vanish` | spécifiques personnages | hoquet de Flamme, suie, disparition |

## Capacités (moteur v2)
Lèvres synchronisées à partir de l'audio (6 formes de bouche) ; clignements irréguliers ; regards qui bougent ; respiration ; signatures de mouvement par personnage ; anticipation et écrasement des sauts ; relief (ombres et reflets) ; expressions qui se fondent ; fondu de décor ; fenêtres de caméra explicites avec lissage ; mixage avec baisse automatique des bruitages et de la musique pendant les voix ; ambiances en fondu croisé ; voix normalisées.

## Limites connues
- Cinq personnages jouables (B, P, G, R, F) + narrateur ; aucune nouvelle voix en saison 1 ; pas de personnage animal visible (seulement bruitages).
- La caméra zoome et se déplace avec le décor (pas d'effet de profondeur) ; elle ne peut pas passer *derrière* un décor.
- Sens du vertical : la largeur utile est plus petite ; deux plans différents sont nécessaires quand le décor est large.
- La synchro labiale est issue de l'enveloppe sonore (pas de phonèmes exacts) : bien pour les formes principales, pas pour chaque syllabe.
- Musique synthétisée (pas de vraie bande son orchestrale) ; banque de bruitages limitée (voir `sfx/index.json`).
- Les lieux sont codés dans `engine/sets.js` : un nouveau lieu demande du code.
- Pas de nouvelle voix possible depuis l'espace de Claude (clé API bloquée) : passer par le dépôt GitHub.
- Rendu lent (20 min / épisode) : prévoir la file de production.

## Demande d'évolution du moteur (procédure)
Une compétence qui a besoin d'une capacité absente écrit une **fiche** dans `CHANGELOG.md` (« À traiter ») : besoin (ce qu'on veut voir à l'écran), pourquoi la capacité actuelle ne suffit pas, adaptation proposée (fichiers du moteur concernés, taille, risque de régression sur les épisodes existants, test vidéo prévu), alternative sans changement du moteur. **Aaron valide avant toute modification** ; tout changement est testé sur un rendu vidéo comparatif et ne casse pas les épisodes 1 à 4.

## Outils de contrôle (dans `outils/`)
`qc_audio.py` (niveaux par personnage, bruitages vs voix, trous), `qc_video.py` (planches-contact, durées, images noires/figées), `qc_camera.js` (sauts de caméra et durées de plans). Ils ne modifient ni le moteur ni les épisodes.
