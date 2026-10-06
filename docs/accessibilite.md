# Accessibilité — le contraste du système, mesuré

> **Les chiffres de ce document sont ceux de la marque du dépôt,
> `src/styles/brand-julien-fernandes.css`** (tableaux régénérés en v0.10.0). Une palette
> différente produirait d'autres ratios et d'autres écarts assumés : régénérez les
> tableaux avec `node check-contrast.mjs --table` si la marque change.

> **Ce document ne s'écrit pas à la main.** Les deux tableaux sortent de
> `node check-contrast.mjs --table`, qui lit les valeurs réelles de
> `src/styles/brand-julien-fernandes.css` — la marque du dépôt. `node check-contrast.mjs`
> sans argument mesure **toutes** les marques présentes et imprime une ligne par marque.
> Le même contrôle tourne à chaque `npm run lint` et **fait tomber le build** si une
> paire passe sous son seuil sans être déclarée.
>
> Cible : **WCAG 2.2 niveau AA**. 4,5:1 pour le texte courant (1.4.3) · 3:1 pour le gros
> texte, les icônes porteuses de sens et les contours de contrôle (1.4.11). Les fonds
> translucides — pilules, `--grad-soft` — sont composités sur leur surface porteuse
> avant mesure : c'est la couleur que l'œil reçoit, pas celle qui est écrite.
>
> **Un template, pas un design system.** Le socle ne porte AUCUNE couleur : elles viennent
> toutes du fichier de marque, que le client écrit. `TOKENS=<son fichier>
> node check-contrast.mjs` mesure SA palette. C'est le sens de ce document : un écart
> d'accessibilité doit être une décision écrite du concepteur, jamais une découverte faite
> par l'audit du client.

---

## 1. La règle qui est sortie de la mesure

**`--primary` et `--destructive` sont des couleurs de REMPLISSAGE. Elles ne sont jamais une
`color:`.** (L'état ACTIF a son propre jeton, `--active`, et c'est un autre rôle — § 1.2.)

Une couleur conçue pour tenir un aplat de bouton ne peut pas, en général, atteindre 4,5:1
comme texte sur une surface claire : ici `--primary` (`#e85d2f`) mesure **3,48 sur son
propre aplat** — et poser l'orange de marque en texte courant tomberait plus bas encore.

Le contrat porte donc deux **jumeaux lisibles** — la même marque, rendue lisible :

| jeton | clair | sombre | garantie du contrat |
|---|---|---|---|
| `--primary-readable` | `#b23a1c` | `#f0916b` | ≥ 4,5:1 sur `--background`, `--card`, `--popover`, `--secondary`, `--accent`, `--surface-alt` |
| `--destructive-readable` | `#a32d2d` | `#ec8f8f` | idem |

Les lignes `a{}`, `.ds-badge--accent`, `.ds-cal__day.is-today`, `.ds-error`, etc. du
tableau § 2 mesurent ces jumeaux : de **5,16 à 7,11** selon la porteuse et le thème pour
le primaire, de **5,73 à 6,62** pour le destructif. Le survol de lien ne demande pas de troisième jeton : il se
**dérive** en tirant le jumeau vers `--foreground`
(`color-mix(in srgb, var(--primary-readable) 80%, var(--foreground))`), ce qui ne peut
qu'**augmenter** le ratio — 6,76 en clair, 8,21 en sombre.

La règle se vérifie d'un grep, et c'est ce qui la rend tenable :

```bash
grep -rE '(^|[^-[:alnum:]])color:var\(--(primary|destructive)\)' src/styles/
```

Une sortie vide = la règle tient. Aujourd'hui : vide.

### 1.1 · Le corollaire — une icône se colore selon ce qu'elle PORTE

Pas selon l'endroit où elle est. La distinction sort de la même mesure, et c'est la ligne
qu'on cassera un jour en voulant « harmoniser » :

| l'icône est… | sa couleur | exemples |
|---|---|---|
| décorative | `currentColor` | elle suit son texte — dont l'icône de l'item de nav actif, depuis la 0.21.0 : elle suit son libellé |
| **active** | `--active` | l'icône du bouton-icône `accent` et du bouton enfoncé, l'entrée active d'un `Rail` — et le TEXTE actif prend le même jeton (§ 1.2) |
| décorative mais **de marque** | `--primary` | pastille d'état vide, pastille d'en-tête de carte |
| **porteuse d'information** | `--primary-readable` | message d'erreur, jour courant, état — et là le seuil de 4,5:1 s'applique pleinement |

**Cet emploi de marque est le seul** où `--primary` touche du non-texte : partout ailleurs
il reste un aplat — CTA, piste de switch, case cochée. Il tient le seuil de 3:1 des
graphiques non textuels : la pastille à **3,08 / 3,14**. L'icône active, en `--active`, tient
le même seuil sur `--accent` : **3,00 / 3,94**.

Le chemin y a mené en deux temps, et les deux étapes sont instructives.
`--primary-readable` tenait le seuil (5,30) mais rendait un brun-brique sombre sur un lavis
chaud — de l'encre colorée, pas la marque. `--brand-via` a corrigé l'éclat mais tombait à
**2,34**, sous le seuil. `--primary` tient les deux bouts. *Contrepartie assumée* : en
sombre, `--primary` est plus dense que `--brand-via` sur la plaque — la marque gagne en
densité ce qu'elle perd en éclat.

**Les tons sémantiques ne suivent pas.** `success`, `warning`, `danger`, `coral`, `amber`,
`neutral` gardent leur couleur lisible : une pastille de statut porte une information.

> L'icône du bouton-icône `accent` est à **3,0027** en clair — au-dessus du seuil, mais de
> 0,003. Ni `--active` ni `--accent` ne peuvent bouger d'un cran sans la faire passer
> dessous.

### 1.2 · L'état actif — UN jeton, `--active`, et quatre écarts assumés

Depuis la 0.21.0, **tout ce qui est actif** lit `--active` : l'icône du bouton-icône
`accent` et du bouton enfoncé, l'entrée active d'un `Rail`, et le TEXTE actif — le libellé
(avec son icône) de l'entrée de menu, le libellé de l'onglet sélectionné, la page courante
de pagination, le lien actif de navbar. Décision de Julien du 12/09/2026 : « la couleur
d'un icône actif, d'un texte actif, d'un texte d'onglet actif, de n'importe quoi actif,
c'est l'orange clair » — le socle en lisait trois. `check-active.mjs` refuse désormais
toute autre couleur dans une règle d'état actif.

La marque du dépôt y met son orange d'aplat (`#e85d2f`). Sur les **icônes**, le seuil des
graphiques est tenu (3,00 / 3,94 sur `--accent`). Sur le **texte**, il ne l'est pas : de
**3,00 à 3,28** en clair, **3,78 à 4,12** en sombre, sous le 4,5 du texte courant. Ce sont
**quatre écarts assumés par écrit** dans le fichier de marque (§ 3.5) — une décision de
marque, prise en connaissance de la mesure, et le remède est une ligne dans ce fichier
(`--active:#b23a1c` en clair), jamais un retour à trois jetons.

---

## 2. Les paires conformes

39 paires sur 58, dans les deux thèmes.

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `texte courant sur --background` | 16 / 400 | 4,5 | 14,94 | 14,52 |
| `texte courant sur --card` | 16 / 400 | 4,5 | 15,59 | 12,50 |
| `--text-secondary sur --card` | 16 / 400 | 4,5 | 10,31 | 11,83 |
| `.caption — --text-muted sur --card` | 13 / 500 | 4,5 | 5,12 | 9,22 |
| `.ds-input::placeholder` | 15 / 400 | 4,5 | 5,17 | 9,22 |
| `.ds-tooltip__bubble` | 13 / 600 | 4,5 | 14,52 | 15,59 |
| `a{} au repos sur --background` | 16 / 400 | 4,5 | 5,36 | 7,11 |
| `a{} au repos sur --card` | 16 / 400 | 4,5 | 5,59 | 6,12 |
| `a:hover — dérivé vers --foreground` | 16 / 400 | 4,5 | 6,76 | 8,21 |
| `.ds-badge--accent` | 12 / 700 | 4,5 | 5,16 | 5,85 |
| `.ds-banner--info` | 15 / 400 | 4,5 | 5,16 | 5,85 |
| `.ds-cal__day.is-today` | 14 / 700 | 4,5 | 5,59 | 6,12 |
| `.ds-pastille--brand — icône` | icône | 3 | 3,08 | 3,14 |
| `.ds-pastille--brand-solid — glyphe sur --brand-to` | icône | 3 | 3,80 | 3,80 |
| `.ds-icon-btn[aria-pressed] — icône` | icône | 3 | 3,00 | 3,94 |
| `.ds-icon-btn--accent — icône` | icône | 3 | 3,00 | 3,94 |
| `.ds-rail__item au repos — icône --text-muted sur --secondary` | icône | 3 | 5,17 | 9,22 |
| `.ds-kbd — --text-secondary sur --secondary` | 13 / 600 | 4,5 | 10,40 | 11,83 |
| `.ds-error` | 13 / 500 | 4,5 | 6,62 | 6,07 |
| `.ds-dropdown__item--danger` | 14 / 400 | 4,5 | 6,84 | 5,73 |
| `.ds-actionsheet__item--danger` | 15 / 500 | 4,5 | 6,84 | 5,73 |
| `.ds-badge--coral sur --card` | 12 / 700 | 4,5 | 4,90 | 5,32 |
| `.ds-badge--coral sur --background` | 12 / 700 | 4,5 | 4,69 | 6,15 |
| `.ds-badge--amber sur --card` | 12 / 700 | 4,5 | 4,99 | 5,35 |
| `.ds-badge--amber sur --background` | 12 / 700 | 4,5 | 4,82 | 6,22 |
| `.ds-badge--danger sur --card` | 12 / 700 | 4,5 | 5,47 | 5,22 |
| `.ds-badge--danger sur --background` | 12 / 700 | 4,5 | 5,28 | 6,00 |
| `.ds-badge--warning sur --card` | 12 / 700 | 4,5 | 4,79 | 4,89 |
| `.ds-badge--warning sur --background` | 12 / 700 | 4,5 | 4,59 | 5,60 |
| `.ds-badge--success sur --card` | 12 / 700 | 4,5 | 4,94 | 6,17 |
| `.ds-badge--success sur --background` | 12 / 700 | 4,5 | 4,75 | 7,14 |
| `.ds-badge--neutral sur --card` | 12 / 700 | 4,5 | 5,20 | 7,46 |
| `.ds-badge--neutral sur --background` | 12 / 700 | 4,5 | 5,00 | 8,78 |
| `.ds-badge--outline` | 12 / 700 | 4,5 | 10,31 | 11,83 |
| `survol — --foreground sur --surface-alt` | 15 / 600 | 4,5 | 14,38 | 11,47 |
| `anneau de focus --ring sur --background` | contour 2px | 3 | 3,12 | 4,79 |
| `.ds-choice coché — aplat --primary` | contrôle | 3 | 3,12 | 4,79 |
| `.ds-switch actif — piste --primary` | contrôle | 3 | 3,12 | 4,79 |
| `.ds-progress__bar sur son rail` | graphique | 3 | 3,00 | 3,78 |
| `.ds-input.is-error — bordure --destructive` | contour 1.5px | 3 | 3,58 | 3,78 |

---

## 3. Les écarts assumés

18 paires. Chacune est déclarée **dans le fichier de marque**,
`src/styles/brand-julien-fernandes.css`, par un bloc `@a11y-assume:` — pas dans le script.
Le script porte la mécanique, la marque porte ses renoncements : un client qui écrit sa
marque repart d'une liste VIDE et n'hérite d'aucune dérogation qu'il n'a pas prise. Le
build tombe si une **dix-neuvième** apparaît.

Quatre familles, et les quatre sont des décisions de marque — aucune n'est un oubli. Une a
été prise après le portage : la couleur d'actif (v0.21.0). L'anneau de focus, assumé de la
v0.8.0 à la v0.22.0, est sorti de la liste en v0.23.0 : il tient désormais son seuil
(§ 3.4).

| Paire | contenu | seuil | clair | sombre |
|---|---|--:|--:|--:|
| `.ds-navlink.is-active` | 16 / 600 | 4,5 | 3,28 ✗ | 4,12 ✗ |
| `.ds-sidenav.is-active` | 15 / 600 | 4,5 | 3,00 ✗ | 3,78 ✗ |
| `.ds-page[aria-current]` | 15 / 600 | 4,5 | 3,25 ✗ | 4,12 ✗ |
| `.ds-pastille--brand-solid — glyphe sur --brand-from` | icône | 3 | 2,04 ✗ | 2,04 ✗ |
| `.ds-pastille--brand-solid — glyphe sur --brand-via` | icône | 3 | 2,68 ✗ | 2,68 ✗ |
| `.ds-tab[aria-selected]` | 15 / 600 | 4,5 | 3,00 ✗ | 3,94 ✗ |
| `.ds-btn--primary — label sur --primary à plat` | 15 / 600 | 4,5 | 3,48 ✗ | 3,48 ✗ |
| `.ds-btn--primary — label sur --brand-from (pire arrêt)` | 15 / 600 | 4,5 | 2,04 ✗ | 2,04 ✗ |
| `.ds-btn--primary — label sur --brand-via` | 15 / 600 | 4,5 | 2,68 ✗ | 2,68 ✗ |
| `.ds-btn--primary — label sur --brand-to` | 15 / 600 | 4,5 | 3,80 ✗ | 3,80 ✗ |
| `.ds-btn--danger — label sur --destructive` | 15 / 600 | 4,5 | 3,80 ✗ | 3,80 ✗ |
| `.ds-cal__day.is-selected` | 14 / 600 | 4,5 | 3,48 ✗ | 3,48 ✗ |
| `.eyebrow / .accent — dégradé clippé en texte` | 12 / 600 | 4,5 | 1,83 ✗ | 8,16 |
| `.ds-input — bordure --input vs page` | contour 1.5px | 3 | 1,17 ✗ | 1,82 ✗ |
| `.ds-input — bordure --input vs remplissage` | contour 1.5px | 3 | 1,23 ✗ | 1,57 ✗ |
| `.ds-input — remplissage vs page` | aplat | 3 | 1,05 ✗ | 1,16 ✗ |
| `.ds-card — bordure --border vs page` | contour 1px | 3 | 1,17 ✗ | 1,44 ✗ |
| `.ds-sep — filet --border sur --card` | filet 1px | 3 | 1,22 ✗ | 1,24 ✗ |

### 3.1 · Le blanc sur les aplats et le dégradé chauds — `2,04` au pire arrêt

**L'écart.** Huit paires, de **2,04 à 3,80**, dans les deux thèmes : le CTA primaire porte
`--brand-gradient` (ambre `#f5a524` → orange `#f08029` → corail `#e84c3d`) sous un label
blanc, l'aplat `--primary` (`#e85d2f`) sert de repli et de piste de switch, le bouton
danger porte le corail sémantique `#e84c3d`, et le jour sélectionné du calendrier est un
aplat `--primary` sous chiffre blanc. Le label du bouton mesure **15 px / 600** : il ne
bénéficie **pas** du seuil « gros texte » de 3:1, qui commence à 18,66 px en gras.

**Pourquoi il est assumé.** Aucun arrêt chaud ne tient 4,5:1 sous un label blanc — c'est
la définition d'un dégradé chaud, et ce dégradé EST l'identité de la marque. Le rouge
foncé qui tiendrait 4,5 sous le label danger sortirait de la palette chaude et se
confondrait avec l'encre. On n'assombrit pas la marque pour gagner 0,7.

**Ce qui l'atténue.** Le label est centré, donc posé sur les deux arrêts les plus foncés
(`--brand-via`, `--brand-to`) — 3,80 est la mesure réelle du centre du CTA, 2,04 celle
d'un bord que le texte n'atteint jamais seul. Le corps est 15 px/600, la cible 48 px
minimum, et le CTA porte une lueur qui le détache de la page. Le danger n'est jamais
seul : toujours couleur + icône + mot (« Supprimer »), et le texte de danger courant
passe par `--destructive-readable` (6,62 sur carte). Le jour sélectionné est le seul
rempli de la grille — la forme porte l'information autant que le contraste — et le jour
du jour, lui, est en `--primary-readable` (5,16).

La tuile `brand-solid` (v0.13.0) entre dans cette même famille, avec l'argument en plus
fort : elle fait 2,625 rem, le dégradé la traverse en entier, et son glyphe est CENTRÉ —
il reçoit donc `--brand-to` (3,80, au-dessus du seuil de 3), jamais l'arrêt clair du bord
gauche. Et le glyphe d'une `Pastille` est DÉCORATIF : le libellé voisin porte
l'information, la tuile n'est jamais la seule chose à lire.

**Le remède, si l'écart ne peut pas être assumé.** Basculer `--primary-foreground` sur
l'encre dans les deux thèmes. C'est une décision d'identité, pas une correction
technique.

### 3.2 · Le dégradé clippé en texte — `1,83` en clair

**L'écart.** `.eyebrow` (12 px / 600) et `.accent` clippent `--brand-gradient` dans le
texte. Sur `--background` clair, le pire arrêt — l'ambre — mesure **1,83**. En sombre le
même dégradé passe (8,16) : l'écart est un défaut du thème clair seul. C'est une
propriété de la TECHNIQUE, pas de la palette — toute marque qui clippe un dégradé
d'aplat en texte pique au même endroit.

**Pourquoi il est assumé.** C'est **la signature** : un mot en dégradé par titre. La
corriger reviendrait à la supprimer.

**Ce qui l'atténue.** La règle de rationnement de la marque : UN mot de titre par vue, en
display 40 px+, jamais un paragraphe ni un lien — et le sur-titre est doublé du titre
juste dessous, qui porte la même information en encre pleine. Aucun des deux ne porte une
information unique. Toute pose durable de la marque en texte passe par
`--primary-readable`, qui tient de 5,16 à 7,11 sur les six porteuses et dans les deux
thèmes.

**Le remède.** Un `--brand-gradient-text` bâti sur `--primary-readable` plutôt que sur
les arrêts d'aplat, clippé par `.eyebrow` / `.accent`. Le mot reste en dégradé, il passe
le seuil. Non fait ici : cela change l'aspect de la signature, et c'est une décision du
concepteur de la marque.

### 3.3 · Les contours doux — `1,12` à `1,44`

**L'écart.** Aucune frontière neutre du système n'atteint 3:1. Le contour d'un champ
(`--input` `#e5e1da` sur crème `#f6f2ec`) mesure **1,17** contre la page et **1,23**
contre son propre remplissage ; le remplissage du champ contre la page, **1,05** — l'écart
s'est encore resserré en v0.8.0, quand `--secondary` a quitté le blanc pur pour la crème.
Bordure de carte et filet de séparateur, même ordre. WCAG 1.4.11 demande 3:1 pour ce qui est
nécessaire à **identifier un composant**.

**Pourquoi il est assumé.** Crème sur crème : le système sépare ses surfaces à l'écart de
luminance et à l'ombre, pas au filet. Les frontières à peine posées **sont** un choix
d'identité — décision de marque, pas de cartes cernées. Les remonter à 3:1 impose des
gris moyens francs sur chaque carte, chaque tableau, chaque séparateur et chaque champ.
C'est un autre design.

**Ce qui l'atténue.** Un champ ne se signale pas seulement par son contour : il a une
hauteur de rail de 48 px, un libellé associé, un placeholder à 5,17:1, et **au focus** sa
bordure passe à `--ring` avec un halo de 3 px (voir § 3.4). L'état d'erreur passe aussi, à
3,58 en clair et 3,78 en sombre. Sur une carte — ou dans une modale, une feuille, un menu —
le champ bascule sur `--background` par déduction de surface, pour garder l'écart. La carte se distingue de
la page par l'écart de surface ET par `--shadow-sm` — le filet est un ourlet, pas la
séparation. Le séparateur ne porte aucune information seule, et sa variante
`.ds-sep--label` porte son texte en `--text-muted` (5,12 sur carte).

**Le remède.** `--border` et `--input` sont des jetons du contrat de marque : un client
qui doit tenir 1.4.11 les remonte dans SON fichier de marque, sans ouvrir un fichier du
socle, et vérifie d'un `node check-contrast.mjs` que les paires de contour passent 3:1.

### 3.4 · L'anneau de focus — sorti des écarts en v0.23.0

**Ce qu'il était.** De la v0.8.0 à la v0.22.0, `--ring` valait `--brand-via` (`#f08029`),
l'arrêt médian du dégradé : **2,41** sur la page en clair, sous le plancher de 3:1 des
indicateurs non textuels, compensé par le halo de 3 px du champ.

**Ce qu'il est.** Décision de Julien du 06/10/2026, adoptée **parce que la mesure la
valide** : `--ring` vaut l'aplat `--primary` (`#e85d2f`) dans les deux thèmes. Il tient
**3,12** sur la page, 3,25 sur la carte, 3,28 sur `--secondary`, 3,37 sur le popover en
clair ; **4,79** sur la page et 3,78 au plus bas (`--surface-alt`) en sombre. Seul
`--muted` en clair reste juste sous le seuil (**2,96**, contre ~2,3 avant) — une surface où
le focus ne porte jamais sur le seul bord.

**Ce qu'il faut garder quand même.** Le halo de 3 px du champ, des boutons, des onglets et
des entrées de nav : il n'est plus une compensation, il reste ce qui rend le focus lisible
d'un coup d'œil.

### 3.5 · La couleur d'actif en texte — `3,00` à `3,28` en clair

**L'écart.** Quatre paires, toutes en `--active` (`#e85d2f`) : l'entrée de menu active sur
`--surface-alt` (**3,00 / 3,78**), l'onglet sélectionné sur `--accent` (**3,00 / 3,94**),
la page courante de pagination sur `--card` (**3,25 / 4,12**), le lien de navbar actif sur
`--secondary` (**3,28 / 4,12**). Du texte de 15-16 px / 600 : le seuil est 4,5, et
`--active` vaut l'orange d'aplat.

**Pourquoi il est assumé.** C'est la décision de Julien du 12/09/2026, prise sur pièces et
sur mesure : un état actif se reconnaît à UNE couleur d'un composant à l'autre — l'orange
clair, celui que le rail et la pastille portaient déjà — et le jumeau lisible (brique en
clair) ne la donnait pas. Le socle lisait trois couleurs pour cet état ; il n'en lit plus
qu'une, `--active`, et `check-active.mjs` le tient.

**Ce qui l'atténue.** L'état actif n'est **jamais porté par la couleur seule** : la plaque
(`--surface-alt`, `--accent`, `--card`), la graisse (600 partout, contre 500 au repos) et
`aria-current` / `aria-selected` le portent avec elle. Et un état actif ne porte aucune
information que le contexte ne donne pas déjà — c'est LÀ où on est, et le titre de la
page le dit. Le seuil des graphiques (3) est tenu partout.

**Le remède, si l'écart ne peut plus être assumé.** `--active:#b23a1c` en clair (le jumeau
lisible), dans le fichier de marque : une ligne, et les quatre paires repassent 4,5. C'est
une autre décision de marque, pas une correction technique — et surtout pas un retour à
trois jetons.

---

## 4. Ce que ce document ne couvre pas

Le contraste des couleurs, et lui seul. Trois points relèvent de l'accessibilité mais pas
de la mesure faite ici :

- **1.4.1 Utilisation de la couleur.** `a{}` ne pose **pas** de soulignement : dans un
  paragraphe, un lien ne se distingue que par sa couleur. Le corriger change le rendu de
  toute prose du système — décision de conception, à trancher à part.
- **1.4.11 sur les états.** Les états `:hover` reposent sur un écart de surface de ~1,08,
  très en dessous de 3:1. C'est un usage courant et non couvert stricto sensu par 1.4.11
  (l'état reste identifiable par le curseur et le focus), mais il mérite d'être connu.
- **2.4.7, 1.4.12, 1.4.10.** Focus, espacement du texte, redimensionnement : hors mesure.

---

## 5. Refaire la mesure

```bash
node check-contrast.mjs           # le contrôle — sort non-zéro sur un écart non déclaré
node check-contrast.mjs --table   # les deux tableaux de ce document, en markdown
TOKENS=chemin/vers/brand-client.css node check-contrast.mjs   # la palette d'un client
```
