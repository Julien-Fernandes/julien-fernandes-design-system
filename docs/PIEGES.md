# Les pièges du socle

Ce que le code livré fait et qui ne se devine pas — chaque cas ci-dessous a coûté au moins
une panne réelle dans une app.

Ce fichier voyage avec le paquet (`files: ["dist", "src", "docs"]`). C'est délibéré : une
règle qui doit protéger les apps doit être lisible **depuis l'app**, pas seulement dans le
dépôt du socle. `docs/DESIGN.md` s'adresse à qui écrit une marque ; cette page-ci s'adresse
à qui écrit un écran.

---

## Le critère d'admission — à lire avant d'ajouter quoi que ce soit

> **Un piège entre ici si sa CAUSE est dans le code livré.**
>
> Si la cause est dans une **marque**, dans un **environnement de travail** ou dans une
> **décision d'app**, il n'entre pas — même s'il a coûté cher, même s'il est instructif.

Ce n'est pas de la coquetterie. Une page de pièges sans critère devient un fourre-tout en
trois mois : on y verse l'incident de la semaine, puis la ligne de commande qu'on oublie,
puis la préférence d'un projet. Elle cesse alors d'être lue — et le jour où elle cesse
d'être lue, les vrais pièges repartent dans le savoir oral, qui est exactement ce qu'elle
existe pour remplacer.

Le critère se teste en une question : **si je supprime ce paragraphe du code source du
socle, le piège disparaît-il ?** Si oui, il est à sa place. Sinon, il appartient ailleurs.

**Ce qui est explicitement dehors**, et où ça vit :

| Non admis | Pourquoi | Où ça vit |
|---|---|---|
| l'historique des incidents | c'est un journal, pas une règle | [`CHANGELOG.md`](../CHANGELOG.md) |
| le lock npm qui ressert un ancien SHA sur un tag à jour | la cause est dans npm, pas dans le code livré | [`GOVERNANCE.md`](../GOVERNANCE.md) |
| la numérotation des manques remontés par une app | c'est la file d'une app, pas une propriété du socle | le dépôt de l'app |
| « ce projet préfère telle densité » | décision d'app | le `PROJECT-CONTEXT.md` de l'app |

---

## 1 · Des classes Tailwind qui n'existent pas, et qui ne le disent pas

**Ce qui casse.** `theme.css` vide trois échelles natives avant d'écrire celles du
système : `--text-*: initial`, `--tracking-*: initial`, `--radius-*: initial`. **64 classes
natives cessent alors d'exister** — tous les paliers de taille (`text-sm`, `text-base`,
`text-lg`, `text-xs`, `text-xl` … `text-9xl`), tout l'interlettrage natif (`tracking-tight`,
`tracking-normal`, `tracking-wide`, `tracking-wider`, `tracking-widest`, `tracking-tighter`),
`rounded` nu, `rounded-3xl`, `rounded-4xl` et leurs déclinaisons par coin.

C'est **voulu** : seuls les paliers sémantiques du système existent, pour qu'une régression
casse au lieu de dériver.

**Pourquoi la panne est muette.** Une classe supprimée n'est pas une erreur, elle est
**inerte** : Tailwind n'émet aucune règle, le nœud hérite simplement de son parent. Ni
`tsc`, ni le lint, ni le build, ni la console du navigateur ne disent quoi que ce soit. Le
texte s'affiche — à la mauvaise taille.

Deux cas attestés, dans deux apps :

- `tracking-widest` écrit pour traduire `var(--tracking-display)`. Ce ne sont pas deux
  valeurs voisines, **c'est le signe inverse** : `-0.02em` contre `+0.1em`, parce qu'Anton
  est une display serrée. Il n'existe aucune valeur « proche » à choisir ;
- `tracking-normal` écrit pour « remettre à zéro ». C'était vrai jusqu'à la v0.16.0 ;
  depuis, l'échelle native est supprimée **entière**, `normal` compris. La classe ne remet
  plus rien à zéro, elle laisse hériter.

**⚠️ Ce qui survit, et qu'on croit mort à tort.** L'inverse coûte aussi cher — on réécrit
du code correct :

- **`text-primary`, `text-muted`** — l'utilitaire `text-` lit **deux** espaces de noms, les
  tailles (`--text-*`) et les couleurs (`--color-*`). Seule l'échelle de tailles est morte ;
- **`text-shadow-lg`** — `--text-shadow-*` est un espace de noms **à part**, que
  `--text-*: initial` ne touche pas : Tailwind résout le plus long ;
- **`rounded-full`, `rounded-none`** — ce sont des **valeurs statiques** de l'utilitaire,
  pas des entrées de `--radius-*`. Elles ne peuvent pas mourir avec lui.

**La parade.** Prendre le palier du système (`text-body`, `text-heading`, `text-caption`,
`tracking-display`, `rounded-lg`…). Quand aucun palier ne dit ce qu'on veut, écrire la
valeur en littéral : `tracking-[0em]` est la seule façon d'obtenir `letter-spacing: 0`
depuis la v0.16.0.

**Le garde.** `node check-dead-utilities.mjs [dossier…]` — il **dérive** la liste à chaque
appel (entrées natives moins entrées redéclarées), il ne la recopie pas. Une app le pointe
sur son propre `src/`.

---

## 2 · Les utilitaires de marque perdent contre les composants

**Ce qui casse.** Les neuf utilitaires de `tokens/base.css` — `.display`, `.display-xl`,
`.eyebrow`, `.ds-overline`, `.chip`, `.accent`, `.mono`, `.caption`, `.prose` — vivent en
`layer(base)`.
**Toutes** les règles de `patterns.css` vivent en `layer(components)`. Sur un même nœud, la
couche des composants gagne **toujours**, quelle que soit la spécificité. (Pas de décompte
ici volontairement : le fichier grossit, un nombre écrit une fois deviendrait faux sans que
rien ne le signale — c'est le défaut que cette page combat.)

`.mono` posé sur un nœud qu'une règle `.ds-*` typographie déjà ne rend rien.

**Pourquoi la panne est muette.** La classe est bien dans le DOM, la règle est bien dans la
feuille : elle est simplement perdante. L'inspecteur la montre barrée, ce que personne ne
va vérifier sur un nœud qui « a l'air bien ».

**La parade.** L'utilitaire Tailwind équivalent sur le même jeton — `font-mono` lit
`--font-mono` et vit en `layer(utilities)`, il gagne. **On ne déplace pas la couche** :
`layer(base)` est ce qui permet à un composant de typographier son propre contenu sans
qu'une classe d'app le contredise par accident.

**Le garde.** Aucun. La combinaison dépend du nœud, et une heuristique crierait sur du code
correct. C'est le piège de cette page qui repose entièrement sur sa lecture.

---

## 3 · `.accent` et `.eyebrow` sont un pochoir à quatre déclarations

**Ce qui casse.** Ces deux classes peignent le dégradé de marque **dans le texte** par
quatre déclarations solidaires :

```css
background: var(--brand-gradient);
background-clip: text;
color: transparent;
width: fit-content;
```

Retirez-en une et l'effet tombe. Or elles vivent en `layer(base)` : **tout** utilitaire
Tailwind posé sur le même nœud vit en `layer(utilities)` et gagne.

**Pourquoi la panne est muette — deux façons, aucune ne lève d'erreur :**

| L'utilitaire posé | Ce qu'il écrase | Ce qu'on voit |
|---|---|---|
| une couleur (`text-*` de couleur, `bg-*`) | `color: transparent` | le dégradé disparaît, le mot reste **lisible en gris** |
| une dimension (`w-*`, `max-w-*`) | `width: fit-content` | le dégradé s'étale sur la **gouttière** au lieu des glyphes |

Le second cas s'est produit sur le numéro des cartes de projet d'une app. C'est l'artboard
ré-exporté qui l'a rattrapé, pas un contrôle.

**Sans risque, en revanche** : la typographie pure — `font-*`, les paliers `text-heading`…,
`leading-*`. Elle ne touche à aucune des quatre déclarations.

**Le sur-titre neutre n'a pas ce piège** : `.ds-overline` (v0.24.0) reprend le gabarit
d'`.eyebrow` sans le pochoir, en `currentColor` — un utilitaire de couleur posé dessus
fait ce qu'il dit. Mais un nœud par rôle : jamais `.ds-overline` et `.eyebrow` ensemble.

**La parade — structurelle, deux spans.** L'externe porte la mise en page et la typo, que
l'enfant **hérite** ; l'interne ne porte que la classe et le texte.

```tsx
<span className="mb-2 font-display"><span className="accent">un mot</span></span>
```

**Le garde.** `node check-fragile-classes.mjs [dossier…]` — il **dérive** l'ensemble des
classes fragiles du CSS (toute règle à classe unique qui clippe un fond dans son texte
**et** pose `color: transparent`), il ne le recopie pas. Le jour où une troisième classe
clippée entre au socle, elle est couverte avant son premier usage.

---

## 4 · Une taille de police en pixels ne suit pas l'échelle d'app

**Ce qui casse.** `app-scale.css` change la taille de la **racine** par bande de largeur
d'écran — 103 %, 112 %, 126 %, 130 %. Toute l'interface suit, *parce qu'elle est en rem*.
Une classe arbitraire en pixels (`text-[15px]`) ne suit pas : elle reste à sa valeur
pendant que ses voisines grandissent, et elle rétrécit visuellement à chaque bande.

**Pourquoi la panne est muette.** Elle est pire que muette, elle est **locale** : sur
l'écran où on l'a écrite, la valeur est exactement celle de la maquette. Le défaut ne se
voit que chez quelqu'un d'autre, sur une autre largeur — et à ce moment-là personne ne fait
le lien avec une classe posée trois mois plus tôt.

**La parade.** Convertir en rem (÷ 16) : `15px` devient `text-[0.9375rem]`. Mieux : prendre
le palier nommé du socle quand il existe, il porte déjà son interligne et son interlettrage.

**Le garde.** `node check-font-px.mjs [dossier…]`.

> *Admission :* la cause est `app-scale.css`, qui est **dans le paquet**. Sans lui, une
> taille en px serait une préférence de style ; avec lui, c'est un défaut de rendu. Le
> critère passe.

---

## 5 · Il n'y a pas de portail — un flottant vit dans le flux

**Ce qui casse.** Aucun composant du système ne monte dans un portail (`createPortal` n'est
utilisé nulle part). Les trois flottants — le panneau de `Dropdown`
(`.ds-dropdown--floating`), le popover de `DatePicker` (`.ds-datepicker__pop`) et la bulle
de `Tooltip` (`.ds-tooltip__bubble`) — sont en `position: absolute` **dans le flux du
parent**.

Or `.ds-card--flush` pose `overflow: hidden` (c'est ce qui fait tenir un tableau à ras dans
le rayon de la carte). Un `Dropdown` ouvert dans une `Card flush` est donc **coupé au bord
de la carte**.

**Pourquoi la panne est muette.** Rien n'échoue : le panneau est monté, il est dans le DOM,
il a ses dimensions. Il est simplement rogné — et souvent de manière partielle, ce qui se
lit comme un défaut de position plutôt que comme un clipping.

Le même mécanisme joue avec tout ancêtre qui crée un contexte de rognage ou d'empilement :
`overflow` autre que `visible`, `transform`, `filter`, `contain`.

**La parade.** Sortir le flottant du conteneur rognant — l'ancrer sur un parent qui ne
rogne pas — ou renoncer à `flush` sur cette carte. Le `z-index` n'y peut rien : un contexte
d'empilement local ne se franchit pas par une valeur plus grande. Les modales, elles, ne
sont pas concernées : `.ds-scrim` est en `position: fixed` sur `inset: 0`.

**Le garde.** Aucun : la relation est structurelle, entre deux nœuds que rien ne rapproche
dans le source.

---

## 6 · `Select` est un `<select>` natif, avec tout ce que ça implique

**Ce qui casse.** Le composant habille un `<select>` du navigateur. Ce qui est habillé,
c'est le **contrôle fermé** — le rail, la surface, le chevron. La **liste ouverte** est
dessinée par le système d'exploitation : ni `--popover`, ni rayon, ni item composé, ni icône,
ni séparateur. Sur mobile, c'est une roue ou une feuille système.

Deux conséquences qui surprennent à l'écriture :

- **les options passent par la prop `options`, pas par les enfants.** `SelectProps` fait
  `Omit<…, 'children'>` : `<Select><option/></Select>` est une erreur de compilation, pas
  une surprise au rendu ;
- **`onChange` rend un événement natif**, pas une valeur. `e.target.value`.

**Pourquoi ce n'est pas un défaut.** C'est un arbitrage, et il tient : le natif gagne au
clavier et au tactile, et il ne coûte aucun code d'accessibilité. **Ne pas le remplacer par
un menu custom.** Le piège n'est pas le choix, c'est de découvrir en cours d'écran qu'on ne
peut pas styler la liste.

**La parade.** Quand la liste doit vraiment être composée — icône par item, description,
séparateurs —, ce n'est plus un `Select` : c'est un `Dropdown` déclenché par un bouton, et
l'app en porte l'état et l'ARIA. Voir alors le piège 5 : ce `Dropdown`-là est un flottant.

**Le garde.** Le type, et c'est le bon niveau : l'erreur des enfants est de compilation.

---

## 7 · La forme récurrente — une valeur du socle hors de portée de l'appelant

Ce n'est pas un cas, c'est **le moule** des autres. Cinq défauts en un mois l'ont pris,
sous trois formes :

1. **la valeur est battue par la cascade** — `.accent`, `.mono` : la couche des utilitaires
   ou des composants gagne toujours, la panne est muette (pièges 2 et 3) ;
2. **la valeur est hors d'atteinte de la cascade** — un défaut de design écrit en style
   inline, un nœud sans aucune classe : aucun sélecteur ne peut la viser, même en théorie ;
3. **la valeur est atteignable mais non prévue pour varier** — les quatre mesures de
   `.ds-logo__dot` : une classe parfaitement ciblable, mais rien ne dit que ces valeurs
   sont censées changer, donc la seule façon d'en changer est de les recopier.

Même issue à chaque fois : **l'app recopie ou surcharge, et le socle ne le sait pas.** La
valeur part en double, et la prochaine version du socle ne la retrouvera pas. C'est la
doctrine prise à revers — le socle fournit les VALEURS, l'app écrit les NOMS.

**Les deux questions de revue**, sur tout nouveau composant comme sur tout écran :

> **1 · Cette valeur, l'appelant peut-il la reprendre ?**
> Si non, elle est mal placée, quel que soit le moyen.
>
> **2 · Si oui, le sait-il ?**
> Une valeur reprise en aveugle est une valeur recopiée. C'est la forme 3, et c'est celle
> qu'on ne voit pas.

**Le corollaire, pour le style inline** — il décide où une valeur a le droit de vivre :

- **légitime** quand la valeur vient de l'appelant à chaque rendu (`Skeleton`, `Avatar`,
  `Logo`, `Progress`) : la prop **est** la valeur, il n'y a rien à redéfinir ;
- **illégitime** dès qu'il porte un **défaut** — un défaut est un arbitrage de design, et
  l'écrire inline le range au seul endroit du langage que la cascade n'atteint pas. Le
  repli d'un `var(--x, défaut)` fait le même travail, du bon côté ;
- **sans excuse** quand il n'y a même pas de prop : une décision du socle qu'aucun
  sélecteur ne peut viser.

---

## 8 · L'état actif a UN jeton, `--active` — et ni `text-primary` ni `text-primary-readable` ne le sont

**Ce qui casse.** Jusqu'à la 0.20.0, le socle colorait « actif » de **trois** façons selon
le composant : le jumeau lisible (`--primary-readable`, brique en clair) sur l'entrée de
menu et le bouton enfoncé, l'aplat (`--primary`) sur l'entrée de rail et la pastille,
l'**encre** sur le lien de navbar et la page courante de pagination. Chaque règle avait
sa raison, écrite ; à l'écran, trois oranges pour dire « tu es ici », et une app qui
voulait le même état chez elle piochait l'une des trois — `text-primary`,
`text-primary-readable` — au hasard de ce qu'elle avait sous les yeux. Julien l'a
redemandé à chaque lot.

**Pourquoi la panne est muette.** Les trois classes existent, compilent et rendent une
couleur de marque. Rien ne dit qu'elles ne sont pas la MÊME, et le défaut ne se voit
qu'en mettant deux composants côte à côte.

**La règle, depuis la 0.21.0.** Tout ce qui est actif — icône active, texte actif, libellé
d'onglet sélectionné, page courante, contour d'un bouton enfoncé — lit **un** jeton :
`--active` (`text-active` en utilitaire). C'est un RÔLE du contrat de marque, pas un alias
de `--primary` : la marque de ce dépôt y met son orange d'aplat (`#e85d2f`, « l'orange
clair » — décision de Julien du 12/09/2026), une autre marque y met ce qu'elle veut.

**Le contraste, et pourquoi il n'est pas une raison de changer de jeton.** Avec cette
valeur, les quatre états actifs en TEXTE mesurent de **3,00 à 3,28** en clair et de
**3,78 à 4,12** en sombre — au-dessus du seuil des graphiques (3), sous celui du texte
courant (4,5). C'est un **écart assumé par la marque, par écrit** (quatre blocs
`@a11y-assume` dans `brand-julien-fernandes.css`, repris dans `accessibilite.md` § 3.5) :
l'état actif n'est jamais porté par la couleur seule — la plaque, la graisse et
`aria-current` / `aria-selected` le portent avec elle. Le remède, si l'écart ne peut plus
être assumé, est **une ligne dans le fichier de marque** (`--active:#b23a1c` en clair), pas
un retour à trois jetons. Pour tout texte qui n'est PAS un état actif, la règle de
`accessibilite.md` § 1 tient : `--primary` est un remplissage, `text-primary` sur un
libellé tombe à 3,00, on écrit `text-primary-readable`.

**La parade.** `text-active` / `var(--active)` pour un état actif ; `text-primary-readable`
pour un lien ou une information de marque ; `text-primary` pour rien, jamais.

**Le garde.** `node check-active.mjs` — toute règle de `patterns.css` dont le sélecteur
nomme un état actif (`.is-active`, `.is-selected`, `[aria-selected="true"]`,
`[aria-current…]`, `[aria-pressed="true"]`, `.ds-icon-btn--accent`) ne peut colorer son
contenu et ses contours qu'avec `var(--active)` ; il porte son jumeau de falsification (16
cas) et le rejoue à chaque appel. Pour le code d'une **app**, aucun garde : `text-primary`
y est une classe valide. Le réflexe : *un état actif qui n'est pas en `text-active` est
faux, quelle que soit la couleur qu'il a l'air d'avoir.*

---

## 9 · En rendu serveur, le calendrier grave « aujourd'hui » au moment du rendu

**Ce qui casse.** `Calendar` calcule « aujourd'hui » par `new Date()` **au rendu**. Rendu
côté serveur — une page statique Astro, un SSG, une requête SSR —, ce rendu a lieu sur le
SERVEUR : le jour marqué `is-today`, le mois ouvert sans `value`, et tous les jours
désactivés par un `min={new Date()}` sont ceux du **build** (ou de la requête), dans le
**fuseau du serveur** — puis gravés dans le HTML. Mesuré sur une page Astro construite le
6 : le 6 marqué, les jours 1 à 5 `disabled`, quel que soit le jour où le visiteur l'ouvre.

**Pourquoi la panne est muette.** Le HTML est valide et plausible : un calendrier, un jour
marqué. À l'hydratation, React recalcule chez le visiteur mais **ne corrige pas un
attribut divergent** (`class`, `disabled`) — il le signale au mieux en console de
développement. Le décalage ne se voit que chez quelqu'un qui ouvre la page un autre jour,
ou d'un autre fuseau (serveur en UTC, visiteur à UTC+9) — jamais chez celui qui vient de
construire.

**La parade.** Monter le calendrier **côté client seulement** (`client:only="react"` en
Astro — il n'y a rien à indexer dans une grille de jours), ou lui passer `today`
(v0.23.0) calculé chez le visiteur. Même règle pour tout `min={new Date()}` : c'est une
date de rendu, pas de visite.

**Le garde.** Aucun : le défaut n'existe qu'au croisement du composant et d'un mode de
rendu que le socle ne voit pas.

> *Admission :* la cause est le `new Date()` de `Calendar.tsx`, **dans le paquet**. Sans
> lui, aucune date de rendu ne serait gravée. Le critère passe.

---

## 10 · Une classe du socle qui porte le nom d'un utilitaire Tailwind

**Ce qui casse.** Le sur-titre neutre est sorti en v0.23.0 sous le nom `.overline`. Or
`overline` est AUSSI un utilitaire statique de Tailwind : `text-decoration-line:
overline`. Chez l'app, dès que le mot apparaît dans son code — et il y apparaît
forcément, puisqu'on écrit la classe —, le scanner de Tailwind génère l'utilitaire, en
`layer(utilities)`. Il gagne sur la classe du socle (`layer(base)`, piège 2), et chaque
sur-titre reçoit un trait AU-DESSUS du texte.

**Pourquoi la panne est muette.** Les deux règles sont légitimes et rendent ce qu'elles
disent ; aucune ne casse l'autre en entier. Le texte reste lisible, à la bonne taille, en
capitales — avec un filet en plus, qui se lit comme un choix graphique. La vitrine du
socle elle-même portait les deux règles sans que personne le voie ; c'est le site qui l'a
remonté.

**La parade.** Toute classe du socle prend le préfixe `ds-` dès qu'elle n'est pas un
utilitaire de marque historique — `.ds-overline` depuis la v0.24.0. Un ancien nom ne
survit qu'en **alias, une version**, et seulement si `theme.css` interdit au scanner de
générer le candidat natif (`@source not inline("overline")`) : c'est le cas de `.overline`
jusqu'à la v0.25.0. **Côté app** : écrire `ds-overline`, et retirer tout
`@source not inline('overline')` posé à la main — `theme.css` le porte.

**Le garde.** `check-utility-collisions.mjs`, seconde famille (v0.24.0) : il compile
`theme.css` tel qu'une app le reçoit et demande au compilateur Tailwind de construire
chaque classe déclarée par le CSS du socle ; une règle produite = un nom pris. Il
**dérive** donc la liste des utilitaires natifs de la version installée de Tailwind, au
lieu de la recopier, et rejoue son jumeau de falsification à chaque appel (`flex` et
`overline` doivent être reconnus, `ds-overline` et `eyebrow` libres). Retirer la ligne
`@source not inline` de `theme.css` le fait tomber — vérifié.

---

## Ajouter un piège

1. Passe-t-il le **critère d'admission** ? Sinon, écris-le dans le fichier qui lui revient.
2. Écris les quatre sections : **ce qui casse** · **pourquoi la panne est muette** · **la
   parade** · **le garde**. Si la panne n'est pas muette, ce n'est pas un piège, c'est un
   bug — corrige-le.
3. Un garde vaut mieux qu'un paragraphe. Les gardes de cette page vivent à la racine du
   dépôt (`check-*.mjs`), sont enchaînés par `npm run lint`, et **prennent un dossier en
   argument** pour qu'une app les pointe sur son propre `src/` :

   ```bash
   node check-dead-utilities.mjs src
   node check-font-px.mjs src
   node check-fragile-classes.mjs src
   ```

   Chacun porte son **jumeau de falsification** et le rejoue à chaque appel : un motif qui
   ne reconnaît plus rien rend un garde toujours vert, donc décoratif — et ce mode de panne
   est silencieux, exactement comme les pièges qu'il surveille.
