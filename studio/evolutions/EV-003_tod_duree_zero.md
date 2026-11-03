# EV-003 — Fiche d'évolution du moteur : `tod` avec durée 0
Statut : **EN TEST sur la branche `ev-003-tod-duree-zero`** (autorisée par Aaron le 3 nov. 2026). **Pas de fusion sans présentation des résultats et validation d'Aaron.** Indépendante d'EV-001 (rivière). Bible 1.1.1.

## Problème
`[t, 'tod', 'dusk', 0]` : le moteur lit `a[1] || 3` → la durée 0 devient 3 s. Dans l'ép. 4 (ligne 7, `tod dusk 0`), cette rampe de 3 s chevauche le `tod night` de la ligne 8 → clés de ciel non monotones → saut de teinte à 45,1 s (dans le rendu publié aussi).

## Correctif (engine/engine.js, une ligne)
Sous `engine: 3` uniquement : durée absente → 3 s (inchangé) ; durée **0 → changement instantané** ; durée > 0 → rampe de cette durée. `engine: 2` et moins : comportement historique inchangé.

## Limite connue, non traitée
Deux `tod` **qui se chevauchent avec des durées > 0** produisent encore un saut (ép. 2 à 52,7 s : dusk 4 s puis night 3 s plus tard ; ép. 3 à 6,0 s : dawn 3 s puis day 0,5 s plus tard). Présent dans les rendus publiés, non modifié. À décider (EV-004 possible : repartir de l'état de ciel courant au lieu du palier).

Tests : `studio/tests/RAPPORT_EV-003_tests.md`.
