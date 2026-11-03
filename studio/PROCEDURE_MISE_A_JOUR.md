# Gestion des versions et procédure de mise à jour de la bible

## Numérotation (fichier `VERSION`, format MAJEUR.MINEUR.CORRECTIF)
- **MAJEUR** : une règle 🔒 FONDAMENTAL change (public, ton, règles du monde, identité d'un personnage, standards de qualité). **Validation écrite d'Aaron obligatoire.**
- **MINEUR** : ajout compatible (nouveau lieu, nouvelle signature sonore, nouvelle règle de réalisation, nouveau personnage récurrent à l'accord d'Aaron).
- **CORRECTIF** : faute, précision, exemple, chiffre ajusté sans changer le sens.
Chaque changement est inscrit dans `CHANGELOG.md` (date, version, fichiers, résumé, raison, validé par).

## Étapes
1. **Constat** : une compétence ou Claude repère un manque, une contradiction ou une amélioration. Il le note dans `CHANGELOG.md`, section « À traiter » (jamais directement dans la bible).
2. **Proposition** : texte avant/après, fichiers touchés, raison, impact sur les épisodes déjà publiés, impact sur les autres documents et sur les compétences.
3. **Classement** : fondamental ou non ? En cas de doute, c'est fondamental.
4. **Validation** : fondamental → Aaron valide dans la conversation (« oui, je valide »). Non fondamental → Claude peut l'appliquer et en informe Aaron dans la foulée.
5. **Application** : modifier le ou les documents, mettre à jour les renvois entre documents, augmenter `VERSION`, ajouter l'entrée du changelog.
6. **Vérification de cohérence** : relire les documents liés (tableau « Qui lit quoi » du README) et les compétences concernées.
7. **Enregistrement** : commit Git avec le message `studio vX.Y.Z : résumé`, puis `git tag studio-vX.Y.Z`.
8. **Information** : Aaron est prévenu de ce qui a changé et de ce que ça implique pour les prochains épisodes.

## Règles de lecture pour les Skills
- Au début de chaque production, la compétence lit `VERSION` et les documents listés dans le README pour son rôle.
- Elle indique dans son livrable la version de la bible utilisée (« bible 1.0.0 »).
- Si le livrable demande une chose que la bible interdit, elle s'arrête et signale le conflit au lieu de contourner.
- Si un document lu est incohérent avec un autre, elle le signale (étape 1) et n'invente pas d'arbitrage.

## Mémoire d'épisode (continuité) : cas particulier
La mise à jour de `09_continuite.md` et de `../serie/bible.json` après chaque épisode n'est pas un changement de règle : elle fait partie de la production (étape M) et ne demande pas de validation, sauf si elle modifie la personnalité ou la relation de fond d'un personnage au-delà de ce qu'a décidé le scénario validé.

## Marquage des règles fondamentales
Dans les documents, une règle fondamentale commence par « 🔒 FONDAMENTAL ». Seul le texte marqué ainsi est protégé ; le reste peut évoluer par MINEUR ou CORRECTIF.
