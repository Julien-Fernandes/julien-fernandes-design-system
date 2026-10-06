# Charte — ✏️ À REMPLIR

Le document qu'on remplit **avant** de toucher au CSS.

Une décision écrite en une phrase se discute. La même décision, noyée dans 200 lignes de
CSS, ne se discute plus — elle se subit. Ce fichier existe pour que les arbitrages soient
lisibles par quelqu'un qui n'écrit pas de code.

Il se remplit en 20 minutes. Les sections marquées ★ sont celles qui portent le plus :
sans elles, un système devient bruyant au bout de trois mois et personne ne sait dire
pourquoi.

---

## 1. La marque en cinq lignes ★

**Nom :**
**Ce que c'est :** _(exemple : un outil interne de suivi de production, pour trois personnes)_
**Pour qui :** _(qui l'ouvre, combien de fois par jour, sur quel écran)_
**Trois adjectifs :** _(exemple : dense · calme · rapide — ils doivent s'opposer à trois autres qu'on refuse)_
**Ce qu'on refuse :** _(exemple : ludique, coloré, animé)_

**La règle qui décide** — une seule phrase, celle qu'on cite quand deux options se valent :
> _(exemple : « à densité égale, on choisit toujours le plus calme. »)_

---

## 2. Support et contexte

**Où ça vit :** _(app web · site public · e-mails · slides · exports)_
**Thème principal :** _(clair · sombre · les deux, à parité)_
**Densité :** _(confortable · compacte — une app de saisie et un site vitrine ne veulent pas la même)_
**Écran de référence :** _(exemple : 1440, desktop ; le mobile est secondaire)_

Le système livre un **thème clair en `:root`** et un **thème sombre en `.dark`**, jamais un
media query : on veut pouvoir poser une section sombre au milieu d'une page claire. Si un
seul thème t'intéresse, remplis quand même l'autre — les composants le lisent.

---

## 3. Couleur → ton `src/styles/brand-<toi>.css` ★

Le fichier que `npm run rebrand` a créé pour toi. Le contrat commenté, à garder ouvert à
côté, est `src/styles/brand.template.css`.

### Surfaces

| Jeton | Valeur | Rôle |
|---|---|---|
| `--background` | | le fond de page |
| `--card` | | **doit se détacher de `--background`**, sinon les cartes disparaissent |
| `--secondary` | | la surface des CONTRÔLES posés à même la page — navbar, onglets, champs, bouton secondaire. Jamais un fond de page |
| `--accent` | | teinte de marque très diluée, pour un badge ou un bandeau |
| `--surface-alt` | | UN CRAN de séparation : survol, rail de progression, squelette. Même écart de luminance dans les deux thèmes |
| `--border` · `--input` | | frontières |

### Texte

Quatre niveaux, pas sept. Au-delà, plus personne ne sait lequel choisir.

| Jeton | Valeur | Rôle |
|---|---|---|
| `--foreground` | | titres et corps |
| `--text-secondary` | | libellés |
| `--text-muted` | | méta — **c'est le couple qui casse le contraste sur `--card`** |
| `--text-inverted` | | texte posé sur une surface sombre |

### Marque ★

| Jeton | Valeur | Rôle |
|---|---|---|
| `--primary` | | LA couleur d'action. Un REMPLISSAGE, jamais une couleur de texte — et l'unique exception, les icônes DÉCORATIVES de marque : pastille d'état vide ou d'en-tête. Une icône se colore selon ce qu'elle PORTE, pas selon l'endroit où elle est |
| `--primary-readable` | | le même accent, rendu LISIBLE : ≥ 4,5:1 sur les six surfaces. C'est lui que prennent les liens et toute icône PORTEUSE D'INFORMATION (erreur, jour courant, état) |
| `--active` | | LA couleur de tout ce qui est ACTIF — icône active, texte actif, libellé d'onglet sélectionné, page courante, contour d'un bouton enfoncé. UN jeton, lu par toutes les règles d'actif du socle (`check-active.mjs` refuse toute autre couleur). Un rôle, pas un alias : mets-y ce que ta marque veut ; si ça ne tient pas 4,5:1 en texte, tu l'assumes par écrit (`@a11y-assume`) |
| `--ring` | | l'anneau de focus. Un rôle, pas un alias : ≥ 3:1 sur la page, le seuil des indicateurs non textuels (`check-contrast.mjs` le mesure). La marque de ce dépôt y met l'aplat `--primary` depuis la v0.23.0 ; un arrêt du dégradé plus clair passerait sous le seuil |
| `--destructive` / `--destructive-readable` | | même paire, pour le danger |
| `--brand-from/via/to` | | les trois arrêts du dégradé signature. Pas de dégradé ? mets la même valeur dans les trois : tout continue de fonctionner, en aplat |

**Où l'accent a le droit d'apparaître** — une liste FERMÉE. C'est elle qui empêche le
système de devenir bruyant :

1. le logo
2. un mot par titre
3. le sur-titre
4. le CTA primaire, un seul par vue
5. le halo
6. _(à compléter, ou à raccourcir)_

**Où il n'a jamais le droit :** _(exemple : un fond de page, un grand aplat, une bordure de carte)_

**Vérification :** `node check-contrast.mjs` sort en `✓`, ou chaque écart est déclaré dans
ton fichier avec sa raison.

---

## 4. Typographie → ton fichier de marque

| Jeton | Valeur | Rôle |
|---|---|---|
| `--font-display` | | titres |
| `--font-body` | | texte et UI |
| `--font-mono` | | code, méta technique |
| `--heading-transform` | | `uppercase` ou `none` |
| `--heading-weight` | | `var(--weight-regular)` ou `var(--weight-bold)` |

Les deux derniers **découlent de la face display** :

- condensée à capitales (Anton, Oswald, Bebas…) → `uppercase` + `var(--weight-regular)`
- grotesque classique (Inter, Geist, DM Sans…) → `none` + `var(--weight-bold)`

Ils gouvernent `h1`→`h4`, `.display`, `.display-xl`, `.ds-card__title` et `.ds-logo` —
exactement les règles en `--font-display`, et rien d'autre.

**Les PALIERS ne se substituent pas.** `tokens/typography.css` porte l'échelle, les
interlettrages et les interlignes : ils sont structurels et valent pour n'importe quelle
famille. Tu choisis les faces, pas les tailles.

**Graisses à charger :** _(ne charge que celles que tu affiches réellement — chaque .woff2
inutile est du poids payé au premier rendu)_

---

## 5. Espacement, rayons, rail

**Le socle ne s'ouvre pas — aucun de ses fichiers.** Les rayons se REDÉCLARENT dans ton
fichier de marque : le § 4.1 de `brand.template.css` liste les sept paliers avec leurs
défauts en commentaire. `tokens/scales.css` porte ces défauts et ne se touche pas. Le
reste non plus : l'échelle d'espacement (base 4), le rail de hauteur des contrôles et
les largeurs de contenu par rôle sont ce qui fait que deux design systems nés de ce
template se ressemblent en **structure** tout en n'ayant rien en commun.

**Rayons :** _(tels quels · divisés par ~2, technique et dense · multipliés par ~1.4, grand
public)_ — garde la progression : un élément imbriqué a toujours un rayon plus petit que son
contenant.

**Densité :** _(le rail de contrôles vaut 3rem, 2.75rem sous 64rem. Le changer touche
boutons, champs, selects et barres d'onglets ensemble — c'est voulu, ils s'alignent)_

---

## 6. Motifs signature

Ce qui fait qu'on reconnaît le système sans lire le logo.

**Le halo :** _(radial chaud ancré en bas · aucun · autre chose)_
**Le dégradé :** _(sur le CTA · sur un mot de titre · nulle part)_
**La lueur :** `--shadow-glow*` — _(un CTA qui rayonne · rien : mets `none`, les jetons doivent EXISTER)_
**L'ombre :** _(trois niveaux teintés de `--tone-dark`, jamais du noir pur — la géométrie est au socle, la teinte suit ton encre)_

**Un motif qu'on refuse :** _(exemple : pas de glassmorphism ailleurs que la navbar au scroll)_

---

## 7. Logo → `src/brand.ts` + `.ds-logo`

`npm run rebrand` a déjà rempli `BRAND_NAME`, `BRAND_MONOGRAM` et `BRAND_WORDMARK_LINES`.

**Mark en CSS ou en SVG :** _(le mark CSS ne coûte aucune requête et s'inverse tout seul ;
un SVG remplace le corps de `Logo.tsx`, en gardant l'API `variant` / `letters` / `height`)_
**La pastille :** _(le carré en dégradé par défaut · `dot={false}` · un nœud à toi)_
**Casse du mot-marque :** _(elle suit `--heading-transform`. Si ton mot-marque est en casse
mixte alors que ton titrage est en capitales : `.ds-logo{text-transform:none}` dans ton
fichier de marque)_

---

## 8. Périmètre du design system

**Ce qui entre :** structure, comportements, états, les composants sans métier.
**Ce qui n'entre pas :** tout ce qui a besoin de savoir ce que fait ton produit.

L'arbre de décision complet est dans [`GOVERNANCE.md`](../GOVERNANCE.md). La règle courte :
**en cas de doute, ça reste dans l'app.** Un design system pollué coûte plus cher qu'un
design system incomplet.

**Extension métier :** _(importes-tu `brand-content.css` ? La plupart des apps : non)_

---

## 9. Interdits — la liste courte ★

Celle qu'on relit avant une PR. Cinq à dix lignes, pas plus.

1. Aucune valeur littérale hors des fichiers de jetons et de marque.
2. Toute dimension en `rem`, sauf la liste d'exceptions de `scales.css`.
3. `--primary` et `--destructive` ne sont jamais une `color:` — le contenu prend les jumeaux
   lisibles.
4. Jamais un rayon pill sur un bouton, un champ ou une barre d'onglets.
5. Jamais la couleur seule pour porter un sens — toujours + icône + texte.
6. L'entrée d'**accueil** porte `house`. `layout-dashboard` — les quatre tuiles — est réservée
   à un vrai **tableau de bord de widgets** : elle annonce une grille, pas une destination.
7. Jamais un utilitaire de couleur, de fond, de `background-clip` ou de dimension sur le nœud
   qui porte `.accent` ou `.eyebrow`. Le socle vit en `layer(base)`, les utilitaires en
   `layer(utilities)` : **ils gagnent toujours**, et la panne est muette — un `text-*` de
   couleur écrase `color: transparent` (le mot passe en aplat), un `w-*` écrase
   `width: fit-content` (le dégradé se peint sur la boîte, les lettres n'en montrent qu'une
   tranche). La typographie (`font-*`, paliers, `leading-*`) ne touche aucune des quatre
   déclarations et est sans risque ; la mise en page, elle, va sur un span externe.
8. Jamais un **défaut de design** écrit en style inline — inline est le seul endroit du
   langage que la cascade n'atteint pas, et la panne est muette. Un style inline n'est
   légitime que si la valeur vient de l'appelant à chaque rendu (`Skeleton`, `Avatar`).
   Le réflexe de revue, sur toute valeur d'un composant : **l'appelant peut-il la
   reprendre ?** Si non, elle est mal placée, quel que soit le moyen.
9. _(à compléter)_

---

## 10. Journal des décisions

Les arbitrages qu'on ne veut pas rejouer dans six mois. Une ligne suffit ; c'est le
« pourquoi » qui compte, pas le « quoi ».

| Date | Décision | Pourquoi |
|---|---|---|
| | | |
