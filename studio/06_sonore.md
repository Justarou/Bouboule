# 06 — Bible sonore et direction sonore

## Identité sonore de la série
Le son doit rendre la série reconnaissable les yeux fermés : une petite musique-signature, une signature par personnage, des ambiances propres à chaque lieu, des silences voulus.

### Thème de la série (motif)
🔒 FONDAMENTAL — Le **jingle d'ouverture** est un motif ascendant de 5 notes de marimba (do–mi–sol–do–mi, en montant), joué au début ; le **jingle de fin** en est le miroir descendant. Ce motif est la signature de la série : il se retrouve, très discret, dans la musique de fond (début et fin de séquence joyeuse) et dans la chanson-refrain.
Styles de musique de fond (moteur) : `joyeux` (jeu, joie), `doux` (tendresse, soir), `mystere` (nuit, peur douce), `fete` (final, danse). Musique synthétisée : marimba, basse douce, petites percussions. À terme, remplaçable par une vraie bande son (voir `11_moteur.md`).

### Signatures par personnage (bruitage court qui accompagne leur entrée ou leur geste)
| Personnage | Signature | Clé |
|---|---|---|
| Bouboule | « boing » élastique à chaque rebond, pas léger | `boing`, `pop` |
| Pitou | tintement de xylophone aigu quand elle réfléchit ou s'éclaire | `xylo`, `scintille` |
| Grincheux | goutte d'eau qui tombe, grondement bas quand il boude | `goutte` |
| Robi | « tic » mécanique + « valide » (bip de réussite) ; moteur qui ronronne | `tic`, `valide` |
| Flamme | petit « pouf » de hoquet, crépitement | `pop`, `feu_camp` |
Règle : une signature par personnage et par scène, pas à chaque réplique (sinon elle perd son sens).

## Voix
- Générées par ElevenLabs (modèle `eleven_v4`), une prise par réplique. Une prise qu'on aime n'est jamais régénérée (le fichier mp3 existe déjà).
- Étiquettes de jeu : voir `02_personnages.md`. Une émotion par réplique, nommée.
- **Normalisation automatique** à la fabrication : chaque réplique est ramenée au même niveau (cible RMS ≈ 0,115, gain entre ×0,55 et ×4). Une voix fine (Pitou) est relevée.
- Contrôle humain : écouter un extrait de chaque personnage.

## Mixage
| Bus | Niveau de base | Pendant une réplique |
|---|---|---|
| Voix | 1,0 | — |
| Bruitages | 0,36 | réduit à 55 % |
| Musique | 0,26 | réduite à 34 % |
| Ambiance | 0,24 | inchangée |
Loudness final visé : **−16 LUFS (±1,5)**, crêtes < −1 dBFS. Écart de niveau entre deux personnages ≤ 3 dB.
Les gros bruits (explosion, chute) tombent **entre** les répliques ou juste avant une pause.

## Ambiances
- Une ambiance par lieu, en **boucle à fondu croisé** (le début et la fin du fichier, qui contiennent fondus et silences, sont coupés ; ~2 s de croisement).
- Entrée et sortie en fondu de 1,2 s. Changement de lieu : l'ambiance suit le fondu du décor.
- Niveau bas : l'ambiance se sent, elle ne s'écoute pas.
Catalogue (banque `sfx/`) : `amb_oiseaux`, `amb_nuit`, `amb_vent`, `amb_pluie`, `amb_ruisseau`, `amb_mer`, `amb_grotte`, `amb_classe`, `amb_ext`, `amb_savane`, `amb_vague`.

## Transitions sonores
- Changement de lieu : le dernier son du lieu s'éteint en 1 s, l'ambiance suivante monte pendant le fondu visuel ; éventuellement un « whoosh » léger.
- Début d'épisode : jingle puis voix. Fin : jingle miroir, générique.
- Chute ou crash : une demi-seconde de silence **après** le bruit, avant la réplique.

## Silences voulus
Après un gag visuel (0,5–1 s) ; avant une confidence (1 s) ; sur un plan de réaction muet. Un silence est noté dans le découpage (pas laissé au hasard).

## Bruitages
Banque d'environ 100 sons dans `sfx/` (index `sfx/index.json`). Règles : synchronisés à l'image (au début de l'action), pas de bruit en continu sous les voix, volume relatif noté (0,2 à 0,9), variantes alternées pour éviter la répétition.
