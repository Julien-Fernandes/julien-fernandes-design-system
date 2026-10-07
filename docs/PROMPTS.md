# Catalogue d'usage des composants

Le second fichier qu'un agent lit, après `PORTAGE.md`, avant d'écrire un écran.
Une section par composant : à quoi il sert, quand ne PAS l'utiliser, un exemple minimal
qui compile, et les états qu'il sait rendre.

Ce document est **gardé par `check-catalogue.mjs`** : chaque composant exporté par
`src/index.ts` — et par le sous-chemin optionnel `src/brand-content.tsx` — doit avoir sa
section ici, chaque section doit correspondre à un export réel, chaque `<Icon name="…">`
cité doit exister dans le type `IconName` et chaque `<ContentIcon name="…">` dans
`ContentIconName`. Si vous ajoutez un composant, ajoutez sa section — le build vous le
rappellera.

Les exemples supposent les imports depuis la racine du paquet :

```tsx
import { Button, Card, Icon } from '@julienfernandes/ds';
```

**➜ Les pièges du socle sont rassemblés dans [`PIEGES.md`](PIEGES.md)** — un par section,
avec ce qui casse, pourquoi la panne est muette, la parade, et le garde qui l'attrape quand
il y en a un. Ce qui suit en reprend l'essentiel au fil des composants ; la page en est la
version complète, et c'est elle qu'on lit avant d'écrire un écran.

**⚠️ LA DOCTRINE, avant les cas particuliers : aucune valeur du socle ne doit être hors
de portée de l'appelant.** Cinq défauts en un mois, trois formes d'un même mal :

1. la valeur est **battue par la cascade** — `.accent`, `.mono` : la couche des
   utilitaires ou des composants gagne toujours, la panne est muette ;
2. la valeur est **hors d'atteinte de la cascade** — le créneau d'icône muré par un
   style inline, deux nœuds sans classe du tout : aucun sélecteur ne peut viser la
   valeur, même en théorie ;
3. la valeur est **atteignable mais non prévue pour varier** — les quatre mesures de
   `.ds-logo__dot` : une classe parfaitement ciblable, mais rien ne dit que ces valeurs
   sont censées varier, donc la seule façon d'en changer est de les recopier.

Même issue à chaque fois : l'app recopie ou surcharge, et le socle ne le sait pas. C'est
la doctrine du socle prise à revers — il fournit les VALEURS, l'app écrit les NOMS. Le
premier réflexe de revue, sur tout nouveau composant comme sur tout écran : **cette
valeur, l'appelant peut-il la reprendre ?** Si non, elle est mal placée, quel que soit le
moyen. Et la forme 3 impose la seconde question : **si oui, le sait-il ?** — une valeur
reprise en aveugle est une valeur recopiée.

**La règle du style inline** — elle décide où une valeur a le droit de vivre :

- **Légitime** quand la valeur vient de l'appelant à chaque rendu — `Skeleton`, `Avatar`,
  `Logo`, `Progress` : la prop EST la valeur, il n'y a rien à redéfinir.
- **Illégitime** dès qu'il porte un **défaut**. Un défaut est un arbitrage de design ;
  l'écrire inline le range au seul endroit du langage que la cascade n'atteint pas.
  `Glyph` et `Spinner` faisaient exactement ça — corrigé en v0.17.0 : le défaut vit dans
  le repli de `var(--ds-icon-size, 1.25rem)`, côté cascade, où un créneau peut le battre.
- **Sans excuse** quand il n'y a même pas de prop — l'astérisque de `FormField`, le hint
  de `Dropdown` : une décision du socle qu'aucun sélecteur ne pouvait viser. Corrigés
  (`.ds-label__required`, `.ds-dropdown__hint`).

**⚠️ Les utilitaires de marque perdent contre les composants.** Les neuf de
`tokens/base.css` — `.display`, `.display-xl`, `.eyebrow`, `.ds-overline`, `.chip`, `.accent`,
`.mono`, `.caption`, `.prose` — vivent en `layer(base)` ; toutes les règles de `patterns.css`
vivent en `layer(components)` et gagnent toujours sur le même nœud, quelle que soit la
spécificité. `.mono` posé sur un nœud qu'une règle `.ds-*` typographie ne rend rien, en
silence. **La parade** : l'utilitaire Tailwind équivalent sur le même jeton — `font-mono`
lit `--font-mono` et vit en `layer(utilities)`, il gagne. On ne déplace pas la couche.

**⚠️ Deux classes CSS pièges, avant tout écran : `.accent` et `.eyebrow`.** Elles peignent
le dégradé de marque dans le texte par quatre déclarations solidaires (`background`,
`background-clip: text`, `color: transparent`, `width: fit-content`) en `layer(base)` — un
utilitaire posé sur le même nœud vit en `layer(utilities)` et gagne toujours, sans rien
casser à l'écran. **Dangereux** : couleur, fond, `background-clip`, dimension (`text-*` de
couleur, `bg-*`, `w-*`…) — le dégradé meurt en silence. **Sans risque** : la typographie
(`font-*`, paliers `text-heading`…, `leading-*`). La mise en page va sur un span externe.

**Le sur-titre NEUTRE est `.ds-overline`** (v0.24.0 ; `.overline` en v0.23.0, alias déprécié
au moins jusqu'à la v0.25.0 incluse, retiré au plus tôt en v0.26.0 — l'ancien nom est aussi celui d'un utilitaire Tailwind, voir PIEGES § 10) :
le gabarit exact d'`.eyebrow` (taille,
graisse, capitales, interlettrage), sans le pochoir — il rend en `currentColor`, donc un
utilitaire de couleur posé dessus (`text-muted-foreground`) fait ce qu'il dit, et il n'est
PAS fragile. Un nœud par rôle : `.ds-overline` OU `.eyebrow`, jamais les deux. Dans une
`Card` / un `CardHeader`, c'est `eyebrowTone="neutral"`.

**La typographie de flux est `.ds-prose`** (v0.23.0, `layer(components)`) : une classe sur
le CONTENEUR d'un texte suivi — rendu Markdown, page légale, document d'éditeur. Titres en
display (`h1`/`h2` au palier `heading`, `h3` `subheading`, `h4` `heading-sm`), interligne
de lecture, `--space-5` entre deux blocs et `--space-3` sous un titre, puces et numéros
rétablis, liens SOULIGNÉS, `code`, `pre`, `blockquote`, `hr`, tableau aligné sur les
paragraphes. Elle ne fixe aucune largeur : `max-w-read` à côté. `.prose` reste ce qu'il
était — l'interligne seul.

```tsx
<article className="ds-prose max-w-read">
  <h2>1. Éditeur du site</h2>
  <p>Texte suivi, <a href="/contact">lien souligné</a>.</p>
  <ul><li>Une puce</li></ul>
</article>
```

---

# actions

## Button

L'action du système. `primary` porte le dégradé de marque et la lueur : c'est LE CTA de la
vue — un seul par écran. Tout le reste est `secondary`, `ghost` ou `danger`.

**Ne pas l'utiliser** pour une action icône seule (c'est `IconButton`), ni pour un lien de
navigation dans du texte (un `<a>` suffit).

```tsx
<Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" />}>On build une app</Button>
<Button variant="secondary" icon={<Icon name="play" />}>Voir la démo</Button>
<Button variant="ghost" size="sm">Annuler</Button>
<Button variant="danger" icon={<Icon name="triangle-alert" />}>Supprimer</Button>
<Button loading>Génération…</Button>
<Button as="a" href="/inscription">S'inscrire</Button>
<Button variant="secondary" surface="page">Dans un panneau posé dans une Card</Button>
```

- Props : `variant` (`primary·secondary·ghost·danger`) · `size` (`sm·md·lg`) · `surface`
  (`auto·page·card`) · `icon` / `iconRight` · `loading` (spinner + désactivé) · `fullWidth`
  · `as` / `href`.
- **`surface` est l'échappatoire à la déduction**, jumelle de celle d'`Input`. Un bouton
  `secondary` dans une `Card` prend `--background` tout seul, pour se détacher de sa
  porteuse. Mais si l'app pose un **panneau `--background` DANS la carte** — une ligne de
  fichier, une tuile, un encadré — la déduction le peint de la couleur de ce panneau et il
  disparaît : `surface="page"` lui rend `--secondary`. `surface="card"` fait l'inverse,
  hors d'une vraie `.ds-card`. `auto` (défaut) ne change rien. Sans effet sur `ghost`,
  `primary` et `danger`, qui ne portent pas `--secondary`.
- Rayon toujours `--radius-md`. **Jamais un pill** — le pill est réservé aux badges.
- Rail partagé : min-height 3rem (2.75rem sous 64rem). `lg` (3.25rem) = CTA de héros.
- **Les icônes ne se dimensionnent pas au site d'appel** : le créneau du bouton s'en
  charge (sm 1rem · md 1.125rem, via `--ds-icon-size` — voir la section Icon). Le spinner
  de `loading` prend la même taille que l'icône qu'il remplace.
- États rendus : repos, hover (lueur + translateY), pressé, focus-visible, désactivé,
  loading.

## IconButton

Bouton carré à icône seule — copier, fermer, basculer. `label` est **obligatoire** : il
devient `aria-label` et `title`.

**Ne pas l'utiliser** quand un libellé texte est possible : un bouton qui peut dire ce
qu'il fait le dit.

```tsx
<IconButton label="Copier le prompt"><Icon name="copy" /></IconButton>
<IconButton label="Fermer" variant="secondary" size="sm"><Icon name="x" /></IconButton>
<IconButton label="Boutique" variant="accent" as="a" href="/boutique"><Icon name="external-link" /></IconButton>
```

- Props : `variant` (`primary·secondary·ghost·danger·accent`, défaut `ghost`) · `size`
  (`sm·md·lg`) · `surface` (`auto·page·card`) · `label` (requis) · `as` / `href`.
- `surface` a le même rôle et les mêmes valeurs que sur `Button` — voir sa section.
- **`variant="accent"`** (v0.17.0) : fond `--accent`, sans bordure, icône `--active` —
  l'état « sélectionné doux » d'un lien-icône ou d'un raccourci, et l'entrée active d'un
  `Rail`. Ne pas le recomposer avec `is-active` (une aide de démo) et un style inline :
  c'est cette fraude que la variante remplace. Le bouton enfoncé (`aria-pressed`) est le
  même état, plus le contour.
- **`as="a"` + `href`** (v0.17.0) : un lien-icône reste un LIEN — clic-milieu, « ouvrir
  dans un onglet », annonce correcte au lecteur d'écran. Jumeau du `as` de `Button`.
- L'icône ne se dimensionne pas au site d'appel : le créneau s'en charge (sm 1rem ·
  md 1.125rem) — voir la section Icon.
- Carré sur son propre rail (`--icon-control-*`), rayon `--radius-md`, jamais un pill.
- États rendus : repos, hover, pressé (`aria-pressed` = actif), focus-visible, désactivé.

---

# brand

## Avatar

Portrait **détouré** (PNG transparent) avec halo de marque derrière les épaules. Sans
`src`, il retombe sur un monogramme en sourdine — jamais une image cassée.

**Ne pas l'utiliser** pour une vignette de contenu ou une image pleine : c'est un
portrait, posé bas, jamais centré derrière un titre.

```tsx
<Avatar src="/portrait-cutout.png" size="4rem" />
<Avatar size="3rem" halo={false} />
```

- Props : `src` · `alt` · `initials` (monogramme de repli) · `size` (longueur CSS, rem) ·
  `halo` (défaut `true`).
- Les défauts (`alt`, `initials`) viennent de `src/brand.ts`.

## Halo

L'atmosphère radiale de la marque. À poser dans une section `position:relative`, derrière
le contenu. Ancré en bas par défaut — jamais plein écran, jamais un grand aplat dégradé.

**Ne pas l'utiliser** pour une miniature ou une carte de motion : ce halo-là est `HaloHot`,
sur le sous-chemin optionnel `@julienfernandes/ds/brand-content`.

```tsx
<section style={{ position: 'relative', overflow: 'hidden' }}>
  <Halo placement="bottom" />
  <div style={{ position: 'relative' }}>…</div>
</section>
```

- Props : `placement` (`bottom·top·center`) · `intensity` (0–1, multiplicateur d'opacité) ·
  `extent` (v0.23.0) : `section` (défaut, le halo de la marque en pour-cent de la section) ·
  `wide` (1,6 × plus large et plus haut — une section courte) · `contained` (plafonné à
  `--container-shell` : sur grand écran, il reste sous la colonne de page).
- Les dégradés viennent des utilitaires `.halo*` de `tokens/base.css` — aucune valeur ici.
  `extent` ne change AUCUNE couleur : c'est le même dégradé de marque, peint dans une image
  de fond redimensionnée (`.halo--wide`, `.halo--contained`). Rien ne déborde de la
  section. **Ne réécrivez jamais un `radial-gradient` à la main** pour agrandir un halo :
  c'est exactement ce que `extent` remplace.

## Logo

La marque, rendue **en CSS** : capitales de `--font-display` + pastille carrée arrondie en
dégradé avec lueur. La pastille garde le dégradé sur tous les fonds ; seules les lettres
s'inversent avec le thème. Les défauts (mot-marque, monogramme) viennent de `src/brand.ts`.

**Ne pas** fausse-grasser, contourer ni interlettrer le mot-marque : sa casse et sa
graisse suivent `--heading-transform` / `--heading-weight`, comme tout le titrage.

```tsx
<Logo variant="wordmark" height="1.75rem" />
<Logo variant="wordmark" letters="light" height="1.75rem" />
<Logo variant="monogram" height="2.5rem" />
<Logo variant="dot" height="1.75rem" />
<Logo wordmark="Acme" dot={false} />
```

- **`variant="dot"`** (v0.21.0) : la pastille SEULE — le point de marque en tête d'un
  `Rail`. Même nœud, même dégradé, même lueur ; `height` est son côté. Pas un second
  dessin de la marque.

- Props : `variant` (`wordmark·stacked·monogram·dot`) · `letters` (`dark·light` — force la
  couleur des lettres ; omise, elles suivent `--foreground`) · `height` · `wordmark` ·
  `monogram` · `dot` (`false` = sans pastille ; un nœud la remplace) · `label`.
- En HTML nu, le même mark existe en `.ds-logo` / `.ds-logo__dot` (tokens/base.css).

---

# data-display

## Badge

Pill de statut ou de catégorie. Les tons sémantiques portent toujours **couleur + icône +
texte**, jamais la couleur seule.

**Ne pas l'utiliser** comme bouton ni comme métrique : un badge ne se clique pas.

```tsx
<Badge tone="success" icon={<Icon name="circle-check" size="0.875rem" strokeWidth={2.5} />}>En ligne</Badge>
<Badge tone="danger" icon={<Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />}>Échec</Badge>
<Badge tone="outline">Brouillon</Badge>
<Badge tone="neutral" pad="dense">v0.1.0</Badge>
```

- Props : `tone` (`coral·amber·danger·warning·success·neutral·accent·outline`, défaut
  `neutral`) · `pad` (`md·dense`) · `icon`.
- Le rayon pill est légal ici — jamais sur un bouton, un champ ou une barre d'onglets.

## Card

LA surface du système — tout ce qui n'est pas une section de page se pose sur une Card.
Fond `--card`, bordure 1px, ombre teintée. Jamais du blanc pur. L'en-tête à slots
(`eyebrow` / `icon` / `title` / `subtitle` / `action`) ne rend AUCUN nœud si aucun slot
n'est passé.

**Ne pas** imbriquer une Card dans une Card, ni poser une grille de cartes avec un gap
sous 1.5rem.

```tsx
<Card>Contenu</Card>
<Card variant="interactive" onClick={() => ouvrir()}>Card cliquable</Card>
<Card variant="feature" size="lg">Mise en avant — lavis --grad-soft + bordure de marque</Card>
<Card icon={<Pastille size="carte"><Icon name="rocket" /></Pastille>}
  title="Déployer" subtitle="En un clic" action={<IconButton label="Options"><Icon name="ellipsis" /></IconButton>}>
  Contenu sous l'en-tête
</Card>
<Card flush><img src="/cover.png" alt="" style={{ width: '100%' }} /></Card>
```

```tsx
// LA CARTE-LIEN (v0.23.0) : la carte ENTIÈRE est un seul <a>. variant="interactive" par
// défaut, couleur de texte de la carte, anneau de focus visible quel que soit le variant.
<Card href="/projets/kineflow" flush className="flex flex-col">
  <img src="/kineflow.png" alt="" />
  <div className="p-card-pad"><h3>KineFlow</h3><p>Planifier les soins…</p></div>
</Card>
// ⚠️ AUCUN lien ni bouton à l'intérieur — un <a> dans un <a> est invalide, et la seconde
// cible est inatteignable au clavier. Le composant le signale en console en développement.
// Une carte qui DOIT porter un bouton n'a pas de href : le lien va sur le bouton.
```

```tsx
// L'en-tête à FILET (v0.21.0) : une Card flush qui porte un slot d'en-tête le rend à filet
// toute seule — padding --space-4 --space-5, border-bottom, pas de gouttière ; le corps
// porte son padding.
<Card flush title="Projets actifs"
  action={<Tabs onCard items={filtres} value={filtre} onChange={setFiltre} />}>
  <Table>…</Table>
</Card>

// L'en-tête seul, en tête d'une zone qui n'est pas une Card — même grammaire, mêmes réglages.
<CardHeader flush title="Sections" subtitle="Dans l'ordre de lecture"
  action={<Button size="sm" variant="secondary">Proposer un découpage</Button>} />
```

- Props : `variant` (`default·interactive·feature`) · `size` (`md·lg`) · `flush` (sans
  padding, media plein bord — et l'en-tête à filet s'il y a un slot) · slots d'en-tête
  `eyebrow` / `icon` / `title` / `subtitle` / `action` · `titleSize` (`sm·lg`) ·
  `headerGap` (`normal·airy`) · `as` · `eyebrowTone` (`brand·neutral`, v0.23.0 — `neutral`
  rend le sur-titre en `.ds-overline`, à l'encre) · `href` / `target` / `rel` (v0.23.0, la
  carte-lien — rend un `<a>`).
- **`CardHeader` est exporté** (v0.21.0), du même fichier : c'est UN SEUL en-tête au socle
  — `Card` le compose par ses props, `Modal` le rend (pastille · titre + sous-titre ·
  croix), et une app le pose seule en tête d'une zone. Ses réglages : les cinq slots,
  `titleSize`, `headerGap`, et `flush` (le mode à filet). Il n'émet aucun nœud sans slot.
- **Le titre ne descend jamais sous 1.125rem** (`sm`, le plus petit palier de la display).
  Une maquette qui pose un `h3` à `--text-control` — un palier de CONTRÔLE — fait une
  approximation de l'outil, pas une décision de marque : on rend `sm`.
- **L'alignement de l'en-tête est décidé par le socle, jamais par une prop** (v0.18.0) :
  titre simple → rangée **centrée** — icône, titre et action partagent un axe, la langue
  du design (99 × center sur le relevé) ; titre **et** sous-titre → `flex-start` —
  l'action s'aligne sur la ligne du haut au lieu de flotter entre les deux. `baseline`
  est écarté : il exigeait une retouche par instance. Ne recomposez pas l'en-tête à la
  main pour choisir un alignement — c'est le composant qui le sait.
- États rendus : repos ; `interactive` ajoute hover (levée + `--shadow-md`), pressé,
  focus-visible.

## Kbd

La touche (v0.21.0) : « ⌘ », « K », « ↵ », « Échap ». `min-width` et `height` 1.375rem,
rayon `xs`, fond `--secondary`, filet interne `--border`, caption semi-gras en
`--text-secondary` — la forme unique des 47 touches des maquettes v2 d'une app. Une vraie
balise `<kbd>`, en corps de texte.

**Ne pas** en faire un `Badge` (pilule, 1.5rem, méta) ni y écrire une combinaison : une
combinaison est une SUITE de touches.

```tsx
<span className="flex items-center gap-space-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
<Kbd>Échap</Kbd>
```

- Props : les attributs natifs de `<kbd>`.
- États rendus : un seul — une touche ne se presse pas à l'écran.

## Pastille

La tuile d'icône du système — l'unique porteur carré-ou-rond teinté. Ses tailles sont
nommées par **contexte**, jamais par mesure : un site d'appel n'écrit jamais un rem.

**Ne pas l'utiliser** comme bouton (elle ne se clique pas) ni réinventer une tuile d'icône
en div : c'est exactement ce que ce composant remplace.

```tsx
<Pastille size="carte"><Icon name="terminal" /></Pastille>
<Pastille size="dialogue" tone="danger"><Icon name="triangle-alert" /></Pastille>
<Pastille size="panneau" tone="brand" outlined><Icon name="folder" /></Pastille>
<Pastille size="heros" shape="round" tone="inverse"><Icon name="rocket" size="1.5rem" /></Pastille>
<Pastille size="dialogue" tone="brand-solid"><Icon name="plus" /></Pastille>
```

- Props : `size` (`carte` 2.25 · `dialogue` 2.625 · `panneau` 3.25 · `heros` 4 · `ecran`
  5rem — le rayon suit la taille) · `shape` (`square·round`) · `tone` (`brand` ·
  `brand-solid` + les 6 paires sémantiques + `inverse`) · `outlined` (contour 1px
  currentColor à 22 %).
- L'icône ne se dimensionne pas au site d'appel : le créneau s'en charge — `dialogue` et
  `panneau` rendent 1.5rem, `carte` le repli 1.25rem. Seules `heros` et `ecran` attendent
  encore une taille explicite.
- **`tone="brand-solid"` porte le dégradé PLEIN**, avec son glyphe en
  `--primary-foreground` : la tuile de marque affirmée, là où `brand` est la tuile douce.
  `size="dialogue"` en fait le jumeau exact d'un `IconButton` `md` — même 2,625 rem, même
  `--radius-md` — mais en `<span>`, donc **posable dans un `<label>` ou une zone cliquable,
  là où un vrai `<button>` imbriqué est du contenu interactif invalide dont le navigateur
  ne transmet pas l'activation.**
- ⚠️ `brand-solid` ne porte **aucune lueur**, et c'est délibéré : dans ce système la lueur
  marque ce qui se **presse**, et seuls `.ds-btn--primary` et `.ds-icon-btn--primary` la
  portent. Une `Pastille` ne se clique jamais. Un appelant qui veut le halo l'ajoute
  lui-même, en le sachant.
- `tone="brand"` porte son icône en `--primary` : elle est **décorative**, elle rend la
  marque, et elle tient le seuil de 3:1 des graphiques non textuels. Les six tons
  sémantiques gardent leur couleur **lisible** — une pastille de statut porte une
  information, et la distinction est la règle du système.
- C'est elle qui rend la tuile du `Modal` et celle de l'`EmptyState`.

## Separator

Filet 1px `--border` entre deux blocs. Avec `label`, la légende est centrée sur la ligne.

**Ne pas l'utiliser** pour structurer une liste dense (l'espacement suffit) ni dans un
menu de bureau (`Dropdown` a son item `separator`). Une `ActionSheet` n'en porte PAS : une
feuille du bas est aérée et parcourue au pouce, le rythme des lignes suffit.

```tsx
<Separator />
<Separator label="Ou" />
<Separator orientation="vertical" />
```

- Props : `orientation` (`horizontal·vertical`) · `label` (horizontal uniquement).

## Table

Table de données composable pour les UIs d'outil : `Table > THead/TBody > Tr > Th/Td`.
`framed` lui donne son propre cadre (1px `--border`, radius-lg, fond `--card`, en-tête sur
`--background`) — pas de Card autour. `columns`, `striped`, `hoverable` se composent.

**Ne pas** rendre une table vide : c'est `EmptyState` À LA PLACE de la table, jamais un
état vide dans la table.

```tsx
<Table framed columns hoverable>
  <THead><Tr><Th>Build</Th><Th>Statut</Th></Tr></THead>
  <TBody><Tr><Td>App de lecture</Td><Td><Badge tone="success">En ligne</Badge></Td></Tr></TBody>
</Table>
```

- Props de `Table` : `striped` · `hoverable` · `framed` · `columns`. `THead`, `TBody`,
  `Tr`, `Th`, `Td` acceptent leurs attributs HTML natifs.
- États rendus : lignes au repos, alternées (`striped`), survolées (`hoverable`).

## Tooltip

Bulle d'encre au survol et au focus (bulle claire en thème sombre). Un libellé court —
jamais du contenu riche.

**Ne pas l'utiliser** pour de l'information indispensable : ce qui doit être lu vit dans
la page, pas dans une bulle.

```tsx
<Tooltip content="Copier le prompt">
  <IconButton label="Copier le prompt"><Icon name="copy" /></IconButton>
</Tooltip>
```

- Props : `content` · `placement` (`top·bottom`) · `open` (force la bulle ouverte — cartes
  spécimens et captures).
- États rendus : fermé, ouvert au survol, ouvert au focus clavier, forcé (`open`).

---

# feedback

## Banner

Message persistant, dans une page ou une Card. Toujours couleur + icône + texte.

**Ne pas l'utiliser** pour du feedback transitoire (c'est `Toast`) ni pour une erreur de
champ (c'est `FormField error`).

```tsx
<Banner tone="warning" title="Ce tuto date de mars">La CLI a changé depuis — la méthode reste bonne.</Banner>
<Banner tone="info" title="Nouvelle série en ligne" action={<Button variant="secondary" size="sm">Voir</Button>} />
```

- Props : `tone` (`danger·warning·success·info`, défaut `info`) · `title` · `children`
  (corps) · `action` (contrôle à droite).

## EmptyState

Emplacement vide en pointillés : tuile `Pastille panneau brand outlined`, titre H4 en face
display, une description courte, et **le prochain geste**. Toujours donner au lecteur la
suite.

**Ne pas l'utiliser** pour une erreur (c'est `Banner` ou `Modal` result) ni pour un
chargement (c'est `Skeleton`).

```tsx
<EmptyState icon={<Icon name="folder" />} title="Aucun build ici"
  description="Choisis une série pour voir les vidéos correspondantes."
  action={<Button variant="secondary">Voir tout</Button>} />
<EmptyState tile={<Pastille size="dialogue" tone="neutral"><Icon name="search" /></Pastille>}
  title="Aucun résultat" description="Essaie un autre mot-clé." />
```

- Props : `icon` (glyphe nu — la Pastille par défaut l'enveloppe) · `tile` (v0.17.0 : la
  tuile complète, quand `panneau brand outlined` ne convient pas ; `icon` est alors
  ignoré) · `title` (requis) · `description` · `action`.

## Progress

Barre fine : rail `--surface-alt`, remplissage `--brand-gradient` — depuis la v0.6.0, la
barre remplie porte le dégradé de marque, jamais l'aplat (la piste, elle, reste un creux).
Déterminée (0–max) ou indéterminée (barre glissante).

**Ne pas l'utiliser** pour une attente sans notion d'avancement dans un contrôle — c'est
`Spinner` (ou `Button loading`).

```tsx
<Progress value={64} label="Progression du build" />
<Progress indeterminate label="Chargement" />
```

- Props : `value` · `max` (défaut 100) · `indeterminate` · `label` (nom accessible).
- ARIA : `role="progressbar"` + `aria-valuenow` (omis en indéterminé).

## Skeleton

Silhouette de chargement sur `--muted`, shimmer discret. Dimensions en chaînes CSS (rem
ou %) — c'est le style inline **légitime** au sens de la règle générale en tête de ce
fichier : la valeur vient de l'appelant à chaque rendu, il n'y a aucun défaut de design à
reprendre. (La même règle rend illégitime un défaut écrit inline — c'était le cas de
`Glyph` et `Spinner` avant la v0.17.0.)

**Ne pas l'utiliser** après le premier rendu : un skeleton qui persiste est un bug
d'affichage, pas un état.

```tsx
<Skeleton width="12rem" height="1.25rem" />
<Skeleton height="9rem" radius="var(--radius-lg)" />
```

- Props : `width` (défaut 100 %) · `height` (défaut 0.75rem) · `radius` (défaut
  `--radius-sm`).

## SkeletonCard

Un skeleton en forme de carte média (16/9 + lignes) — un par emplacement de grille pendant
qu'une grille de cartes charge.

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-5)' }}>
  {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
</div>
```

- Props : `media` (le bloc 16/9, défaut `true`) · `lines` (défaut 2).

## Spinner

Anneau de chargement en `currentColor`, tailles alignées sur Icon (1 / 1.25 / 1.5rem).

**Ne pas le poser** dans un `Button` : la prop `loading` du bouton le fait, et désactive
le bouton avec.

```tsx
<Spinner size="sm" />
<Spinner size="1.5rem" />
```

- Props : `size` (`sm·md·lg` ou longueur CSS — omise, le créneau décide, comme pour
  Icon : même propriété `--ds-icon-size`, même repli 1.25rem).
- ARIA : `role="status"`, `aria-label="Chargement"`.

## Toast

Notification transitoire, en bas à droite du viewport, sur `--card` avec `--shadow-lg`.
Toujours couleur + icône + texte. Le texte d'erreur est concret, jamais dramatisé.

**Ne pas l'utiliser** pour un message qui doit rester lisible (c'est `Banner`) ni pour une
confirmation bloquante (c'est `Modal`).

```tsx
<Toast tone="success" title="Prompt copié" description="Colle-le dans Claude Code." onClose={() => fermer()} />
<Toast tone="danger" title="Ça a planté, on réessaie ?" description="Le build n'a pas pu démarrer." />
```

- Props : `tone` (`success·danger·warning·info`, défaut `info`) · `title` (requis) ·
  `description` · `onClose` (rend la croix).
- Tuile d'icône 1.5rem radius-sm, glyphes à stroke-width 2.5 (check / x / triangle-alert /
  info).

---

# forms

## Calendar

Vue mois, lundi d'abord, locale `fr-FR` par défaut. `Date` natif + `Intl` uniquement —
aucune dépendance. Date unique, pas de plage.

**Ne pas l'utiliser** posé nu dans un formulaire : c'est `DatePicker` qui l'y emmène, en
popover.

```tsx
<Calendar value={date} onChange={setDate} min={new Date()} />
<Calendar />
<Calendar fluid value={date} onChange={setDate} />     {/* pleine largeur — v0.23.0 */}
<Calendar today={aujourdhuiDuVisiteur} />               {/* « aujourd'hui » injecté — v0.23.0 */}
```

- Props : `value` · `onChange(Date)` · `min` / `max` · `disabledDates` · `locale` · `bare`
  (sans le cadre — l'usage interne du DatePicker) · `fluid` (v0.23.0 : la largeur du
  conteneur, sept colonnes qui se la partagent, la hauteur des cases inchangée) · `today`
  (v0.23.0 : le jour marqué `is-today` et le mois ouvert sans `value` ; défaut l'horloge
  de la machine).
- **⚠️ Rendu serveur (Astro, Next, SSG).** Sans `today`, « aujourd'hui » est calculé AU
  RENDU : le jour du build, dans le fuseau du serveur, gravé dans le HTML — et
  l'hydratation ne corrige pas un attribut divergent. Montez le calendrier côté client
  seulement (`client:only` en Astro), ou passez `today` calculé chez le visiteur. Voir
  PIEGES.md § 9.
- États rendus : jour au repos, survolé, sélectionné (aplat `--primary`), aujourd'hui
  (`--primary-readable` gras), désactivé, focus-visible.
- **Accessibilité** (v0.24.0). Les jours forment un **groupe** nommé par le mois affiché
  (`role="group"` + `aria-labelledby` — plus de `role="grid"` sans lignes ni cellules).
  Chaque jour annonce sa date COMPLÈTE (« lundi 13 octobre 2026 », dans la `locale`),
  `aria-pressed` s'il est choisi, `aria-current="date"` si c'est aujourd'hui, et le
  `disabled` natif s'il est indisponible ; les en-têtes de semaine sont `aria-hidden`.
- **Clavier** (v0.24.0) : UN arrêt de tabulation dans les jours — le jour choisi, sinon
  aujourd'hui, sinon le premier jour disponible. Flèches : ± 1 jour, ± 1 semaine ;
  Début / Fin : lundi / dimanche ; PageHaut / PageBas : mois précédent / suivant (+ Maj :
  année). Les jours indisponibles sont sautés, le mois change si besoin, `min` / `max` ne
  sont jamais franchis. Entrée ou Espace choisit. **Ne recâblez pas les rôles** à la main
  depuis l'app.
- **Pas de plage.** En attendant un mode plage (périmètre envisagé : deux mois,
  surlignage des jours intermédiaires, présélections externes),
  un calendrier fait main peut émettre lui-même les classes du socle et hériter de ses
  espacements, de sa typo et de ses états au lieu de les réinventer : `.ds-cal` (cadre,
  ou `.ds-cal--bare`), `.ds-cal__head` / `.ds-cal__label` / `.ds-cal__nav`,
  `.ds-cal__grid` / `.ds-cal__wd` / `.ds-cal__day` et ses états `.is-today` /
  `.is-selected` / `:disabled`. Ces classes sont un contrat de rendu — le socle les
  garde stables tant que la parade est nécessaire.

## Checkbox

Case à cocher avec libellé. `forwardRef` : la ref atteint l'`<input>` natif —
`register()` de react-hook-form se branche directement.

**Ne pas l'utiliser** pour un choix exclusif (c'est `Radio`) ni pour un réglage à effet
immédiat (c'est `Switch`).

```tsx
<Checkbox label="Je veux recevoir le prompt du build" defaultChecked />
<Checkbox label="Sélection partielle" indeterminate />
<Checkbox label="Option indisponible" disabled />
```

- Props : `label` · `indeterminate` (case d'en-tête de sélection multiple : propriété DOM
  posée par ref, trait `minus` à la place de la coche, `aria-checked="mixed"`) + les
  attributs natifs (`checked`, `defaultChecked`, `onChange`, `disabled`…).
- États rendus : décochée, cochée, indéterminée, hover, focus-visible, désactivée.

## DatePicker

Déclencheur façon Input (même règle de `surface`) + `Calendar` en popover. Clic extérieur
ou Échap pour fermer — Échap et la sélection rendent le focus au déclencheur. Avec `name`,
un `<input type="hidden">` porte la date en ISO (`YYYY-MM-DD`) pour la soumission de
`<form>`. Avec react-hook-form : passer par `<Controller>` (composant contrôlé).

**Ne pas l'utiliser** pour une plage de dates — le système n'en a pas.

```tsx
<DatePicker value={date} onChange={setDate} placeholder="Choisir une date" />
<DatePicker surface="card" name="echeance" value={date} onChange={setDate} />
<DatePicker invalid value={date} onChange={setDate} />
<DatePicker value={date} onChange={setDate}
  trigger={({ value, triggerProps }) => (
    <button type="button" className="ds-btn ds-btn--secondary" {...triggerProps}>
      {value ? value.toLocaleDateString('fr-FR') : 'Choisir une date'}
      <Icon name="calendar" />
    </button>
  )} />
```

- Props : `value` · `onChange(Date)` · `placeholder` · `locale` · `min` / `max` ·
  `disabledDates` · `surface` (`page·card`) · `invalid` · `disabled` · `name` ·
  `trigger`.
- **`trigger` — le déclencheur composable** (v0.17.1). Un render-prop qui reçoit
  `{ open, value, triggerProps }` et rend l'élément de son choix en **étalant
  `triggerProps`** dessus — ref, clic, clavier, ARIA. C'est l'étalement qui est le
  contrat : par lui le socle garde la ref (retour de focus sur Échap et sur sélection)
  et pose l'ARIA lui-même (`aria-haspopup` / `aria-expanded` / `aria-controls`), qui
  cesse d'être la charge de l'app. L'élément doit être **focusable et recevoir `ref`** —
  un `<button type="button">` nu, pas un composant sans `forwardRef` (le `Button` du
  socle n'en a pas : la ref s'y perdrait, et le retour de focus avec).
  **L'étalement est nu : aucun cast.** `triggerProps.ref` est une ref de RAPPEL
  (`(node: HTMLElement | null) => void`), donc assignable au `ref` de n'importe quelle
  balise. Un objet de ref sur `HTMLElement` ne l'aurait pas été — l'appelant aurait dû
  écrire `ref={triggerProps.ref as Ref<HTMLButtonElement>}`, et l'exemple ci-dessus
  n'aurait pas compilé. `disabled` reste
  la charge de l'appelant sur son élément. Sans `trigger`, rien ne change : le bouton
  façon Input d'hier, qui étale les mêmes `triggerProps` — les deux chemins ne peuvent
  pas diverger.
- États rendus : vide, rempli, ouvert, invalide, désactivé, focus-visible.

## FormField

Enveloppe libellé + contrôle + aide/erreur. Une erreur **remplace** le texte d'aide et
porte toujours couleur + icône + texte.

**Ne pas** poser un libellé à la main au-dessus d'un champ : c'est ce composant qui tient
l'anatomie.

```tsx
<FormField label="Ton email" htmlFor="mail" help="Un build décortiqué par semaine. Zéro spam.">
  <Input id="mail" placeholder="ton@email.com" />
</FormField>
<FormField label="Ton email" htmlFor="mail2" error="Ça a planté, on réessaie ?">
  <Input id="mail2" invalid defaultValue="pas-un-email" />
</FormField>
```

- Props : `label` · `htmlFor` · `help` · `error` · `required` (astérisque `--primary`).
- **Le câblage est automatique** (v0.24.0). Quand l'enfant est UN contrôle — `Input`,
  `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, ou un `<input>` / `<select>` /
  `<textarea>` natif —, FormField lui pose son `id` s'il n'en a pas (repris de `htmlFor`,
  sinon généré ; le libellé le vise), `aria-describedby` vers l'erreur ou à défaut l'aide
  (AJOUTÉ à celui que l'enfant porte déjà), et `aria-invalid="true"` quand il y a une
  erreur. **N'écrivez plus ces attributs à la main**, ni d'`id` sur le message d'erreur :
  le message serait annoncé deux fois.
- `aria-invalid` porte la bordure rouge de `.ds-input` (règle existante) : un champ sous
  une `error` la prend désormais même sans `invalid` — c'est l'état que la doctrine
  demande (« toujours avec un message d'erreur », et réciproquement).
- Un enfant **composite** (une liste, un groupe, un composant d'app) est laissé tel quel —
  rien ne prouve qu'il transmet ces attributs. L'aide et l'erreur portent un `id` stable,
  `<id du champ>-aide` / `<id du champ>-erreur`, pour un câblage à la main.

## Input

Champ texte sur le rail de contrôle partagé, bordure 1.5px. Focus = la bordure passe en
`--ring` — UNE bordure, jamais un anneau en plus. Jamais un pill. `forwardRef` sur
l'`<input>` natif.

**Ne pas l'utiliser** pour du texte multi-lignes (c'est `Textarea`).

```tsx
<Input placeholder="ton@email.com" />
<Input surface="card" placeholder="Dans une Card" />
<Input invalid defaultValue="pas-un-email" />
<Input size="lg" placeholder="CTA de héros" />
<Input unit="kg" inputMode="decimal" placeholder="72" />
<Input icon={<Icon name="search" />} type="search" placeholder="Chercher une vidéo…" />
```

- Props : `size` (`sm·md·lg`) · `invalid` · `surface` (`page` = fond `--secondary`, posé
  à même le layout · `card` = fond `--background`, dans une Card) · `unit` · `icon` +
  attributs natifs.
- **`icon`** (v0.21.0) : l'icône de TÊTE — le miroir de `unit`, à gauche. Passez un
  `<Icon>` sans `size` : le créneau des déclencheurs de champ la rend à 1rem, à .875rem
  du bord, en `--text-muted`. Elle est `aria-hidden` : c'est le `placeholder` ou le
  libellé qui nomme le champ. `icon` et `unit` se cumulent.
- **`unit`** (v0.17.0) : l'unité — « kg », « € », « min » — posée DANS le champ, à
  droite, en sourdine. **Trois caractères au plus** ; plus long, c'est un suffixe de
  libellé, pas une unité. Elle est `aria-hidden` : le libellé du `FormField` la nomme.
- États rendus : repos, focus, invalide, désactivé — sur les deux surfaces.

## Radio

Bouton radio — le seul contrôle circulaire du système. Toujours dans un groupe `name`.
`forwardRef` sur l'`<input>` natif.

**Ne pas l'utiliser** pour plus de ~5 options (c'est `Select`) ni pour un choix multiple
(c'est `Checkbox`).

```tsx
<Radio name="niveau" value="debutant" label="Je débute" defaultChecked />
<Radio name="niveau" value="avance" label="Je code déjà" />
```

- Props : `label` + attributs natifs (`name`, `value`, `checked`, `onChange`,
  `disabled`…).
- États rendus : au repos, sélectionné, hover, focus-visible, désactivé.

## Select

Select **natif** sur le rail 3rem, avec un chevron Lucide. Même silhouette qu'Input et
Button md. `forwardRef` sur le `<select>` natif.

**Ne pas** le remplacer par un menu custom : le natif gagne au clavier et au tactile.

```tsx
<Select options={[{ value: 'build', label: 'Build' }, { value: 'tuto', label: 'Tuto' }]} defaultValue="build" />
<Select options={[{ value: 'a', label: 'A' }]} invalid />
```

- Props : `options` (`{value, label}[]`) · `invalid` · `surface` (`page·card`) + attributs
  natifs.
- États rendus : repos, focus, invalide, désactivé — sur les deux surfaces.

## Switch

Bascule binaire à effet **immédiat** — jamais suivie d'un bouton Enregistrer. `forwardRef`
sur l'`<input>` natif.

**Ne pas l'utiliser** dans un formulaire soumis d'un bloc (c'est `Checkbox`).

```tsx
<Switch label="Thème sombre" defaultChecked />
<Switch label="Notifications" disabled />
```

- Props : `label` + attributs natifs (`checked`, `onChange`, `disabled`…). Rendu
  `role="switch"`.
- États rendus : off, on, hover (piste teintée vers `--primary`), focus-visible,
  désactivé.

## Textarea

Champ multi-lignes. Hauteur automatique — jamais de min-height. Redimensionnement
vertical uniquement. Même règle de `surface` que l'Input. `forwardRef` sur le
`<textarea>` natif.

```tsx
<Textarea rows={5} placeholder="Décris ton idée d'app en deux phrases." />
<Textarea rows={3} invalid defaultValue="Trop court" />
```

- Props : `invalid` · `rows` (défaut 4) · `surface` (`page·card`) + attributs natifs.
- États rendus : repos, focus, invalide, désactivé.

---

# icons

## Icon

LE système d'icônes : Lucide, exclusivement. Jamais un emoji, jamais un SVG dessiné à la
main. 48 glyphes typés (`IconName`) — un nom hors du type est une erreur TypeScript, et
c'est voulu.

**Ne pas** chercher `youtube`, `instagram` ou `tiktok` ici : les icônes de PLATEFORME
vivent dans `ContentIcon`, sur le sous-chemin optionnel `@julienfernandes/ds/brand-content`
(section plus bas). Et jamais `sparkles` : l'étoile-éclair est bannie du set.

**La taille vient du CRÉNEAU, plus du site d'appel — v0.17.0.** Une icône sans `size` lit
`var(--ds-icon-size, 1.25rem)` ; les créneaux du socle posent la propriété par une règle
CSS (bouton sm 1rem · bouton et IconButton md 1.125rem · badge dense 0.75rem · pastille
dialogue et panneau 1.5rem · déclencheurs de champ 1rem — le relevé des artboards, dans
patterns.css). **Ne passez `size` que pour une correction optique** — un `plus` dans un
créneau sm se rend à 1.125rem, c'est attesté — ou hors de tout créneau : passée, elle
gagne sur la règle. Une app pose son propre créneau en ciblant le `svg` lui-même
(`.ma-tuile svg { --ds-icon-size: 1.5rem }`) — jamais le conteneur : la propriété est
enregistrée `inherits: false`, une règle de conteneur est inerte, et c'est voulu.

```tsx
<Icon name="circle-check" strokeWidth={2} />
<Icon name="arrow-right" size="1rem" style={{ color: 'var(--primary-readable)' }} />
```

**Ce que le catalogue ne couvre pas se passe en `glyph`.** Lucide compte ~1500 tracés ;
le catalogue en cure 48 glyphes. Pour le reste, l'app importe le tracé et le socle lui applique
ses propres règles — même grille, même épaisseur. Plus besoin de publier une version du
design system pour une icône.

```tsx
import { ShoppingBag } from 'lucide-react';

<Icon glyph={ShoppingBag} />
```

- Props : `name` (`IconName`) **ou** `glyph` (tracé lucide), jamais les deux — ils sont
  mutuellement exclusifs, et le TYPE l'impose : passer les deux, ou aucun, est une erreur
  de compilation. · `size` (longueur CSS, toujours rem — omise, le créneau décide) ·
  `strokeWidth` (2 standard · 2.5 dans les pills et les toasts · 3 pour la coche).
- **`name` reste la voie normale** : le catalogue est relu, documenté, et garantit qu'un
  nom existe. `glyph` est la porte de sortie, pas le chemin par défaut — un besoin qui
  revient dans DEUX apps mérite d'entrer au catalogue.
- **Ne demandez plus un glyphe au socle.** `lucide-react` est une peer dependency : chaque
  app l'a déjà, et `glyph` prend n'importe lequel de ses ~1500 tracés (`merge`, `scissors`,
  `link`, `rotate-ccw`, `square`, `pause`, `chevron-up`, `film`…). Un glyphe absent du
  catalogue n'est pas un manque du socle, c'est un import dans l'app — le catalogue ne
  s'agrandit qu'au deuxième demandeur.
- `glyph` n'autorise PAS un SVG maison : le rendu reste celui du socle. Ce qui s'ouvre,
  c'est le choix du tracé dans lucide, pas la liberté graphique.
- La couleur suit `currentColor`. Les actions destructives prennent `trash-2`.

---

# brand-content — l'extension métier, optionnelle

Deux outils de VISUEL — une vignette, une carte de motion, un export social —, pas
d'interface. Ils ne sont pas exportés par la racine du paquet : ils vivent sur le
sous-chemin `@julienfernandes/ds/brand-content`, avec `brand-content.css` en face côté CSS.
Une app d'écrans ne les importe pas et ne perd rien.

```tsx
import { ContentIcon, HaloHot } from '@julienfernandes/ds/brand-content';
```

## ContentIcon

Les icônes de PLATEFORME — 3 icônes de plateforme, typées (`ContentIconName`) : `youtube`,
`instagram`, `tiktok`. Hors d'`IconName` exprès : un design system générique n'a aucune
raison d'embarquer un logo dans le bundle de toute app qui importe `Icon`. Le rendu est
celui de `Icon` — même grille 24, même trait, même créneau de taille (`--ds-icon-size`) —
parce que c'est le même `Glyph` derrière.

**Ne pas** lui donner la couleur d'une plateforme. Comme `Icon`, il rend en `currentColor`
et le socle ne connaît aucun rouge YouTube, aucun dégradé Instagram, aucun cyan-rose
TikTok — c'est voulu, et c'est la même règle que pour `github` dans `Icon`. Un état actif
qui la porte prend `text-active`, comme tout état actif.

**Ne pas** chercher un logo de plus par `glyph` : lucide a retiré toutes ses icônes de
marque en v1. Les tracés sont dessinés dans le socle (`brand-glyphs.ts`) — un quatrième
logo entre ici, au deuxième demandeur, jamais dans l'app.

```tsx
<Button variant="secondary" icon={<ContentIcon name="youtube" />}>Voir la chaîne</Button>
<IconButton label="TikTok"><ContentIcon name="tiktok" /></IconButton>
<ContentIcon name="instagram" size="1.5rem" />
```

- Props : `name` (`ContentIconName`) · `variant` (v0.24.0 : `outline`, le défaut, le
  contour au trait de 2 · `filled`, le glyphe OFFICIEL plein de la plateforme — YouTube :
  rectangle arrondi, triangle de lecture en creux) · `size` (longueur CSS, toujours rem —
  omise, le créneau décide) · `strokeWidth` (sans effet sur `filled`) · `className` ·
  `style`. Rendu `aria-hidden` : le nom accessible est celui du bouton ou du lien qui la
  porte.

```tsx
<IconButton as="a" href="https://youtube.com/@chaine" label="YouTube">
  <ContentIcon name="youtube" variant="filled" />
</IconButton>
```

## HaloHot

Le halo CHAUD des miniatures — l'ancien `<Halo hot />`, sorti du socle parce que c'était la
seule prop d'un composant d'interface à lire un jeton métier. Il lit `--gradient-thumbnail`,
un des trois jetons du contrat de `brand-content.css` : sans ce CSS, il rend une boîte vide,
et c'est voulu — un manque doit se voir.

**Ne pas** l'utiliser dans un écran : l'atmosphère d'une section, c'est `Halo`.

```tsx
<div style={{ position: 'relative', overflow: 'hidden' }}>
  <HaloHot intensity={0.8} />
  <img src={vignette} alt="" style={{ position: 'relative' }} />
</div>
```

- Props : celles de `Halo` sans `placement` — `intensity` (0–1), `className`, `style`.

---

# navigation

## AppShell

Le squelette d'app-outil : grille `[Sidebar | contenu]`. Sous 64rem, la sidebar devient un
tiroir piloté par `open`/`onClose` de `Sidebar`.

**Ne pas l'utiliser** pour un site de contenu (c'est `Navbar` + `Footer`).

```tsx
<AppShell sidebar={<Sidebar sections={sections} open={menuOpen} onClose={() => setMenuOpen(false)} />}>
  {contenu}
</AppShell>
```

- Props : `sidebar` (un `<Sidebar>` — ou un `<Rail>`) · `responsive` (défaut `true` ;
  `false` fige la double colonne desktop).
- **Avec un `<Rail>`, `responsive={false}` est obligatoire** (v0.21.0) : un rail n'a pas
  de forme tiroir — sous 64rem, la grille responsive passe en une colonne et il
  s'empilerait au-dessus du contenu. `AppShell` le signale en console en développement.

## Footer

Pied de site — une STRUCTURE à emplacements : la zone de marque (marque + une ligne sous
elle), N colonnes, une rangée sociale, une ligne du bas. Le socle ne porte AUCUN contenu :
ni adresse, ni réseau, ni mention légale, ni libellé — tout vient du projet.

```tsx
<Footer
  note="Busan · Corée du Sud"
  columns={[{ title: 'Séries', links: [{ label: 'Build' }, { label: 'Tuto' }] }]}
  social={<IconButton label="GitHub"><Icon name="github" /></IconButton>}
/>

// Les emplacements de la v0.23.0 : une ligne qui porte un lien, une colonne de contenu
// libre, la ligne du bas.
<Footer
  note={<a href="mailto:contact@exemple.fr">contact@exemple.fr</a>}
  columns={[
    { title: 'Ressources', links: [{ label: 'Newsletter', href: '/newsletter' }] },
    { title: 'Réseaux', content: <span className="flex gap-space-2">{reseaux}</span> },
  ]}
  bottom={<span>© Nom du projet</span>}
/>
```

- Props : `columns` (`{title, links?:[{label, href?}], content?}[]`) · `social` · `brand`
  (défaut : le `Logo` du paquet) · `letters` · `note` (la ligne sous la marque — un nœud
  depuis la v0.23.0, rendu dans un `<p>` : du contenu EN LIGNE, texte ou lien ; AUCUN
  défaut, omise elle n'est pas rendue) · `bottom` (v0.23.0, la ligne du bas, sous les
  colonnes et la rangée sociale ; omise, elle n'est pas rendue).

## Navbar

Barre de site sticky : logo à gauche, liens au centre, CTA à droite. Toujours sur
`--secondary` avec filet bas — un contrôle détaché du layout, jamais transparent. Au
scroll : teinte + blur + ombre. C'est le SEUL endroit du système qui emploie
`backdrop-filter` — pas de glassmorphism ailleurs.

```tsx
<Navbar
  links={[{ label: 'Vidéos', active: true }, { label: 'Séries' }, { label: 'À propos' }]}
  cta={<Button size="sm">La newsletter</Button>}
/>
```

- Props : `links` (`{label, href?, active?}[]`) · `cta` · `brand` (défaut : le `Logo`) ·
  `homeHref` / `homeLabel` · `letters` · `scrolled` (force l'état scrollé — spécimens) ·
  `children` (rendu dans l'emplacement de DROITE, juste **avant** `cta` : une action de plus
  — bascule de thème, sélecteur de langue — sans remplacer le CTA) · `menu`
  (`true·'always'`, v0.23.0) · `menuLabel` (défaut « Menu ») · `menuFooter` (défaut : le
  `cta` ; `null` le retire).
- **Le lien actif porte `aria-current="page"`** (v0.23.0) : `active` veut dire « la page
  qu'on lit ».
- **Le menu replié — `menu`, OPT-IN** (v0.23.0). Sous 64rem (ou à toute largeur avec
  `menu="always"`), les liens et le `cta` quittent la barre ; un burger ouvre un panneau
  qui les reprend en colonne, le `cta` en pleine largeur dans son pied. Le panneau est un
  **`popover` natif** : ouverture, Échap, clic extérieur, focus rendu au burger, burger
  annoncé « développé » — le navigateur fait tout, **sans JavaScript**. La barre marche
  donc rendue côté serveur et jamais hydratée. Là où l'ancrage CSS existe, le panneau
  s'ancre sous sa barre ; ailleurs il se pose à `--navbar-h` du haut de la fenêtre — juste
  pour une barre collante.
- **⚠️ Une ancre de la même page ne referme pas le panneau** — rien n'est « à
  l'extérieur ». Hydratée, la barre le referme au clic d'un lien. Rendue sans JS (Astro
  statique), le site ajoute une ligne :

  ```tsx
  document.addEventListener('click', e => (e.target as Element).closest('.ds-navbar__menu a')?.closest<HTMLElement>('[popover]')?.hidePopover());
  ```
- **Un bouton secondaire dans la barre** (un « Retour ») prend `--background` par
  déduction de surface (v0.23.0) : la barre est une porteuse, comme la carte.
- **Le burger est une icône nue** (v0.25.0) : `IconButton` `ghost` — ni fond ni bordure au
  repos, `--surface-alt` au survol, l'anneau de focus du système au clavier. Sa cible fait
  `--control-md` (44 px sous 64rem, 48 au-dessus) ; le glyphe est aligné optiquement sur
  le bord droit du contenu. Nom accessible (`menuLabel`), état « développé » et lien vers
  le panneau inchangés (tenus par le `popover` natif).
- **La marque est centrée dans la barre, quelle qu'elle soit** (v0.25.0) : le lien
  d'accueil (`.ds-navbar__brand`) est en `inline-flex` centré. Avant, il contenait une
  ligne de texte et la marque s'y posait sur la ligne de base : 2,85 px trop haut pour le
  Logo par défaut, 3,50 px pour un SVG + texte. Après : 0,00. Ne recentrez pas la marque à
  la main (`translate`, `margin-top`) — retirez tout recentrage écrit pour l'ancienne
  version.
- **Les ancres ne passent plus sous la barre** (v0.23.0) : dès qu'une `.ds-navbar` est
  dans la page, la racine reçoit `scroll-padding-top` = `--navbar-h` + `--space-4`.
- **Changer la hauteur de la barre** : redéclarer `--navbar-h` dans la feuille de l'app,
  **hors de toute couche**, après les imports du DS. TOUT suit : la barre, le haut du
  panneau du menu replié, le `scroll-padding-top` des ancres (vérifié sur le banc :
  72 → 64 px, panneau collé, 88 → 80 px).

  ```css
  /* src/styles/global.css de l'app — HORS de tout @layer */
  :root { --navbar-h: 4rem; }
  ```

  ⚠️ Posée dans un `@layer` (`@layer components { :root { … } }`), la redéclaration est
  **ignorée en silence** : les jetons du socle sont hors couche, et une déclaration hors
  couche bat toutes les couches. Voir PIEGES § 11. Une marque peut aussi la poser dans
  son fichier (§ FACULTATIF du contrat).
- **Le banc** : `?banc=navbar` dans la vitrine — une barre réelle, avec les mesures en
  direct.
- États rendus : repos, scrollée, lien au repos / survolé / actif, menu replié fermé /
  ouvert.

## Pagination

Pagination contrôlée sur une barre `--secondary` (même traitement que Tabs). Ellipse
au-delà de 7 pages ; la page courante est ACTIVE — plaque `--card`, libellé `--active`,
comme l'onglet sélectionné (v0.21.0).

```tsx
<Pagination page={page} pageCount={12} onPageChange={setPage} />
```

- Props : `page` (1-based) · `pageCount` · `onPageChange`.
- États rendus : page au repos, survolée, courante (`aria-current="page"`), flèches
  désactivées aux bornes, focus-visible.

## Sidebar

Navigation d'app sur `--secondary` : marque en tête, sections titrées, item actif, pied
(Avatar + nom). Repliable en icônes seules, persisté en localStorage. Sous 64rem : tiroir
`open`/`onClose`, voile compris.

```tsx
<Sidebar
  sections={[{ title: 'Outils', items: [
    { label: 'Accueil', icon: <Icon name="house" />, active: true },
    { label: 'Contenu', icon: <Icon name="video" /> },
  ] }]}
  footer={<Avatar size="2rem" />}
/>
```

- Props : `sections` (`{title?, items:[{label, icon?, href?, active?, onClick?}]}[]`) ·
  `footer` · `footerItems` · `brand` / `brandCollapsed` · `collapsible` (défaut `true`) ·
  `defaultCollapsed` · `storageKey` · `open` / `onClose` (tiroir mobile) · `staticLayout`
  · `linkAs`.
- Chaque section est un **groupe** (v0.17.0) : les groupes se séparent par le gap de la
  nav (16px), avec ou sans titre — deux sections sans titre ne se collent plus.
- **L'entrée active est d'une seule couleur, icône et libellé** (v0.21.0) : `--active`,
  la couleur de tout ce qui est actif, sur `--surface-alt`. Contraste 3,00 / 3,78 : écart
  assumé par la marque ([`PIEGES.md`](PIEGES.md) § 8). La graisse reste le second signal.
- **Sidebar ou Rail ?** Sidebar = libellés, sections titrées, repliable par l'utilisateur.
  Rail = icônes seules, largeur fixe, jamais de repli. Une app choisit l'un — la barre
  repliée n'est pas un rail (4,5 rem contre 3,75, des pilules contre des carrés d'icône,
  un bouton de repli contre aucun).
- États rendus : dépliée, repliée, item au repos / survolé / actif, tiroir ouvert.

## Rail

Le rail d'icônes (v0.21.0) : une colonne de `--rail-w` (3.75rem) sur `--secondary`, filet
droit. Le point de marque en tête (`Logo variant="dot"`), des entrées en icône SEULE — leur
`label` est leur `title` et leur nom accessible —, un ressort, les entrées de pied,
l'avatar. Relevé sur les quinze écrans des maquettes v2 d'une app.

**Ne pas** l'employer quand les entrées ont besoin d'un libellé lisible ou d'un repli :
c'est `Sidebar`. Ne pas le monter dans un `AppShell` responsive : il n'a pas de forme
tiroir.

```tsx
<AppShell responsive={false} sidebar={
  <Rail
    linkAs={NavLink}
    items={[
      { label: 'Accueil — la liste des vidéos', href: '/', icon: <Icon name="house" />, active: true },
      { label: 'Studio — le process maître', href: '/studio', icon: <Icon name="sliders-horizontal" /> },
    ]}
    footerItems={[{ label: "Réglages de l'application", href: '/reglages', icon: <Icon name="settings" /> }]}
    footer={<Avatar size="1.75rem" halo={false} />}
  />
}>
  {contenu}
</AppShell>
```

- Props : `items` / `footerItems` (`SidebarItem[]` — `label` requis) · `brand` (défaut :
  le point de marque à 1.75rem) · `footer` · `label` (nom de la `<nav>`) · `linkAs`.
- Une entrée est un `IconButton` par ses classes : `ghost` au repos (`--text-muted`, encre
  au survol), `accent` quand elle est active — plaque `--accent`, icône `--primary`
  (3,00 / 3,94, seuil des graphiques). Le rail compose, il ne redessine rien.
- États rendus : entrée au repos / survolée / active / focus.

## Tabs

Groupe d'onglets segmenté sur le rail de contrôle. La barre contraste TOUJOURS avec sa
surface porteuse : `--secondary` sur la page, `onCard` bascule sur `--background`.
Rectangle (barre 0.875rem · onglet `--radius-sm`) — jamais un pill, jamais fondu dans le
fond.

**Ne pas l'utiliser** pour de la navigation entre pages (c'est `Navbar` ou `Sidebar`) :
Tabs filtre un contenu en place.

```tsx
<Tabs value={tab} onChange={setTab}
  items={[{ value: 'all', label: 'Tout' }, { value: 'build', label: 'Build' }]} />
<Tabs onCard value={tab} onChange={setTab} items={[{ value: 'all', label: 'Tout' }]} />
```

- Props : `items` (`{value, label}[]`) · `value` / `onChange` (contrôlé) · `onCard`.
- **L'onglet sélectionné est une plaque `--accent`, libellé en `--active`** (v0.21.0) —
  la couleur de tout ce qui est actif ; la même plaque sur la page, sur une carte, en
  clair, en sombre. Pas de contour. Le survol reste couleur seule, sans fond : c'est ce
  qui le distingue de la sélection, puisqu'en clair `--accent` et `--surface-alt` sont la
  même couleur. Une app qui émet `ds-tab` en dur porte le même état par
  `aria-selected="true"` ou `is-selected`. Contraste 3,00 / 3,94 : écart assumé par la
  marque, voir [`PIEGES.md`](PIEGES.md) § 8.
- États rendus : onglet au repos, survolé, sélectionné (`aria-selected`), focus-visible.

---

# overlays

## ActionSheet

Le menu « ⋯ » sur mobile : une feuille basse d'actions, Annuler intégré, chaque ligne au
moins `--control-md` (le rail tactile). Surface modale complète : focus piégé, Échap
ferme, focus rendu au déclencheur, défilement verrouillé.

**DOCTRINE ⋯ — ne pas l'ouvrir au-dessus de 64rem** : `.ds-scrim--sheet` y est en
`display:none`, une ActionSheet modale y est invisible par construction (le composant le
signale en console en développement). Au-dessus de 64rem, le même geste ouvre un
`Dropdown`. En spécimen desktop : `inline panel`.

```tsx
<ActionSheet
  open={sheet}
  onCancel={() => setSheet(false)}
  items={[
    { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" />, onSelect: () => setSheet(false) },
    { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
  ]}
/>
<ActionSheet inline panel items={[{ label: 'Copier le lien' }]} />
```

- Props : `open` · `title` / `subtitle` (en-tête optionnel) · `note` (légende de
  conséquence au-dessus d'Annuler) · `items`
  (`{label, icon?, danger?, onSelect?, className?}[]`) · `cancelLabel` ·
  `onCancel` · `inline` (sans voile) · `panel` (spécimen desktop 20rem — implique
  `inline`).
- **Pas de séparateur** (v0.8.0) : l'item `separator` a été retiré, la feuille n'émet plus
  aucun `<hr>`. C'est `Dropdown` qui garde le sien.
- États rendus : fermée, ouverte (feuille), item au repos / survolé / danger, panneau
  desktop.

## Dropdown

Menu contextuel — **desktop only**. Sous 64rem, un menu « ⋯ » ouvre TOUJOURS une
`ActionSheet` : même geste, deux tailles d'écran. Panneau sur `--secondary` — la
continuation du champ ou du bouton qui l'ouvre — et sur `--popover` dès qu'il est posé dans
une carte ou une modale, où il doit flotter. Items éclairés sur `--surface-alt`.

**Ne pas l'utiliser** comme select de formulaire (c'est `Select`).

```tsx
<Dropdown items={[
  { label: 'Copier le lien', icon: <Icon name="copy" size="1rem" /> },
  { label: 'Ouvrir la vidéo', icon: <Icon name="play" size="1rem" />, hint: '⏎' },
  { separator: true },
  { label: 'Supprimer', icon: <Icon name="trash-2" size="1rem" />, danger: true },
]} />
<Dropdown inline items={[{ label: 'Spécimen dans le flux' }]} />
```

- Props : `items` (`{label, icon?, hint?, danger?, separator?, onSelect?, className?}[]`)
  · `inline` (rendu dans le flux, sans positionnement absolu).
- États rendus : item au repos, survolé, danger, séparateur.

## Modal

Dialogue de confirmation ou de tâche focalisée, sur `--popover`, au-dessus d'un voile
encre flouté. **Trois phases dans UN dialogue** : `confirm` → `loading` (rien ne ferme :
Échap, voile et croix inertes) → `result` (succès ou erreur, avec « Réessayer »). Sous
64rem, la MÊME modale devient une feuille basse — CSS seul. Focus piégé, Échap ferme,
focus rendu au déclencheur.

**Ne pas l'utiliser** pour du feedback passif (c'est `Toast` ou `Banner`) ni pour un menu
d'actions (c'est `Dropdown` / `ActionSheet`).

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  icon={<Icon name="triangle-alert" />}
  title="Supprimer ce build ?"
  subtitle="Trois décisions, pas une de plus."
  description="Cette action est définitive."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
    <Button variant="danger">Supprimer</Button>
  </>}
/>
<Modal inline phase="result" onClose={() => setOpen(false)}
  result={{ status: 'success', title: 'Build supprimé', message: 'Les fichiers ont été retirés.' }} />
```

- Props : `open` · `icon` + `iconVariant` (`danger·brand·neutral·warning·success` — la
  tuile est une `Pastille dialogue`) · `title` / `subtitle` / `description` / `children` ·
  `footer` · `onClose` · `closeButton` · `dismissable` · `phase` (`confirm·loading·result`)
  · `result` (`{status, title?, message?, onRetry?}`) · `inline` (spécimen sans voile).
- **L'en-tête est celui de `Card`** (v0.21.0) : pastille · titre + sous-titre · croix sur
  UNE ligne, rendus par `CardHeader` (titre en cran `lg`, la croix en `action`).
  `subtitle` est la ligne sous le titre, DANS l'en-tête ; `description` reste le corps, à
  1,5 rem sous l'en-tête. Sans sous-titre la rangée est centrée ; avec, elle passe en
  `--stacked` et la croix s'aligne sur le titre. La largeur reste `--modal-w`, redéclarée
  au site d'appel si besoin (`className="[--modal-w:38rem]"`).
- **La croix et les gestes de fuite sont découplés** (v0.17.0) : `closeButton={false}`
  retire la croix en gardant Échap et le clic-voile ; `dismissable={false}` fait
  l'inverse — la croix devient le seul geste de fermeture, pour une modale à saisie
  qu'un clic à côté ne doit pas jeter. Les deux à `true` par défaut : rien ne bouge.
- Un champ dans une modale : voir le spécimen « Avec un champ contrôlé » de la vitrine —
  le piège de focus tient la frappe.
- États rendus : les trois phases, avec et sans icône, succès et erreur, feuille basse
  sous 64rem.
