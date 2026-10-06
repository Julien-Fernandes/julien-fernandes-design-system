# Journal des versions

Ce fichier est **celui du projet que vous fabriquez**, pas celui du squelette. Il démarre
vide exprès : l'historique d'un autre design system n'apprend rien sur le vôtre.

La procédure de version est dans [`GOVERNANCE.md`](GOVERNANCE.md), et `node check-version.mjs`
vérifie que la version de `package.json`, la ligne d'installation du README et le tag git
concordent.

---

---

---

---

---

---

---

---

## 0.23.0 — le site public : menu sans JS, polices locales, et la prose promue

Le lot que décrit `docs/AUDIT-SITE.md` : ce qu'un site public (Astro, rendu statique,
îlots React) demandait au socle et qui vaut pour n'importe quel projet. **Rien de propre à
ce site n'entre dans le paquet** — ni libellé, ni contenu, ni mise en page : chaque ajout
est une prop, une classe ou un emplacement que le projet remplit. L'audit lui-même reste
dans le dépôt mais sort du paquet (`"!docs/AUDIT-SITE.md"` dans `files`).

### ⚠ Ce qui change à l'écran chez QUI monte de version — sans toucher à son code

Tout le reste est opt-in. Ces quatre lignes-là sont voulues.

| Ce qui bouge | Avant (0.22.0) | Après | Sites concernés |
|---|---|---|---|
| **L'anneau de focus** (`--ring`, M3) | `--brand-via` `#f08029` en clair (2,41:1, écart assumé), `--brand-from` `#f5a524` en sombre | l'aplat **`#e85d2f`** dans les deux thèmes : 3,12 sur la page en clair, 4,79 en sombre — **le seuil de 3:1 tient**, l'écart assumé disparaît | tout focus clavier de Creator et Dashboard : champs, boutons, onglets, cases, jours de calendrier |
| **Les gris de texte en sombre** (M2) | `--text-secondary` `#d2cfc9`, `--text-muted` `#b0aea9` | **`#ece9e3`** et **`#d2cfc9`** — un cran plus clairs | tout texte secondaire et toute légende en thème sombre |
| **Les deux displays sous 64rem** (B10) | 3,25 / 4,5rem à toutes les largeurs | `--text-display` **2,5rem**, `--text-display-xl` **3,25rem** — un cran plus bas SUR L'ÉCHELLE existante (les valeurs desktop de `heading-xl` et de `display`), comme `heading-xl` et `heading` le faisaient déjà | relevé : ni Creator ni Dashboard ne lisent ces deux paliers en taille (Dashboard pose `.display` mais écrase la taille par un utilitaire) — leurs pages vitrine internes seulement |
| **DM Sans** (B15) | chargée depuis Google Fonts | servie par le paquet — **même dessin**, aucune requête tierce | toutes les apps : une requête bloquante en moins, plus d'adresse IP envoyée à Google |

Rien ne descend tout seul : Creator est épinglé à v0.22.0, Dashboard et Editing à v0.21.0. Monter =
réinstaller par la spec explicite, puis vérifier le SHA du lock (GOVERNANCE, « côté app »).

### Ce qui entre

- **B1 · `Navbar menu`** — le menu replié, **opt-in** (`menu` absent = DOM d'hier). Sous
  64rem (ou partout avec `menu="always"`), les liens et le `cta` quittent la barre ; un
  burger ouvre un panneau qui les reprend, le `cta` en pleine largeur dans son pied
  (`menuFooter`, `menuLabel`). Le panneau est un **`popover` natif** : ouverture, Échap,
  clic extérieur, focus rendu au burger, burger annoncé « développé » — tenus par le
  navigateur, **sans JavaScript**. Vérifié sur une page Astro statique à zéro script :
  ouvert au clic, fermé par Échap, focus rendu. Hydratée, la barre referme aussi le
  panneau quand on suit un de ses liens ; non hydratée, une ancre de la même page ne le
  referme pas (la ligne à ajouter est dans `docs/PROMPTS.md`). Là où l'ancrage CSS
  existe, le panneau s'ancre sous SA barre (`anchor-name` posé en ligne, nom dérivé de
  `useId`) ; ailleurs il se pose à `--navbar-h`. `popoverTarget` (React 19) ou
  `popovertarget` (React 18) selon la version présente : aucun avertissement dans l'une
  ni dans l'autre.
- **B2 · `aria-current="page"`** sur le lien `active` de la barre (et de son panneau).
- **B4 · `Footer` à emplacements** — `note` devient un nœud (une chaîne reste valable ; un
  `mailto:` y tient), `FooterColumn.content` (contenu libre après les liens, `links`
  devient optionnel), `bottom` (la ligne du bas, `.ds-footer__bottom`). Le pied ne porte
  toujours aucun contenu.
- **B5 · `Card href`** (+ `target`, `rel`) — la carte ENTIÈRE est un seul `<a>`,
  `variant="interactive"` par défaut, couleur de texte de la carte (`.ds-card--link`
  neutralise la couleur et la dérive de la règle `a`), anneau de focus visible quel que
  soit le variant, avec un **contour transparent** qui reste visible en contrastes forcés.
  Un lien ou un bouton imbriqué est signalé en console en développement.
- **B6 · `Calendar fluid`** — pleine largeur, `repeat(7, minmax(0,1fr))`. La hauteur des
  cases ne change pas : l'audit proposait 2,5rem, c'eût été une mesure nouvelle — refusée.
- **B7 · `Calendar today`** — « aujourd'hui » injectable (défaut inchangé : l'horloge au
  rendu). Le piège qu'il ferme est écrit : **PIEGES § 9**, le calendrier rendu côté
  serveur grave la date du build.
- **B8 · `Halo extent`** (`section·wide·contained`) — **aucune couleur, aucun jeton** :
  c'est le dégradé de la marque, peint dans une image de fond redimensionnée
  (`.halo--wide` 160 % × 155 %, `.halo--contained` plafonnée à `--container-shell`),
  ancrée là où le halo l'est. Une image de fond ne déborde jamais : rien ne fuit hors de
  la section. (L'audit proposait de dériver les arrêts par `color-mix` ; inutile — et ça
  aurait figé la forme du halo de cette marque dans le socle.)
- **B9 · `.overline`** — le sur-titre neutre : le gabarit d'`.eyebrow` sans le pochoir, en
  `currentColor`. **Pas fragile** (`check-fragile-classes` ne le dérive pas, à raison). Un
  nœud par rôle. Dans `Card` / `CardHeader` : `eyebrowTone="neutral"`.
- **B12 · la barre est une porteuse** — un bouton ou un bouton-icône secondaire posé dans
  `.ds-navbar` prend `--background` (même déduction que dans une carte) ; couvre le
  burger et le panneau.
- **B13 · les ancres sous la barre collante** — `:root:has(.ds-navbar){scroll-padding-top:
  calc(var(--navbar-h) + var(--space-4))}`. Le brief disait `scroll-margin-top` : posé sur
  le conteneur de défilement plutôt que sur chaque cible, il fait le même travail pour
  TOUTES les ancres, et couvre aussi le focus clavier qui fait défiler (WCAG 2.4.11, focus
  non masqué). Sans barre dans la page, rien ne s'applique.
- **B14 · `@julienfernandes/ds/fonts/*`** — les polices sont importables par l'app, donc
  préchargeables. Vérifié sur Astro : l'URL du `preload` et celle du `@font-face` sont la
  MÊME URL hachée — un seul téléchargement.
- **B15 · DM Sans auto-hébergée** — variable (axe wght), deux fichiers par
  `unicode-range` (latin 36,9 Ko, latin-ext 18,2 Ko) au lieu des huit instances statiques
  de Google, source Fontsource 5.3.0, licence OFL jointe (`DMSans-OFL.txt`). Plus aucune
  requête vers Google Fonts : vérifié dans la feuille émise par Astro.
- **C1 · `.ds-prose`** — la typographie de flux, **promue depuis Dashboard**
  (`@utility document-riche`), deuxième demandeur : le site. Sa version sert de base ; ce
  qui connaît son éditeur reste chez lui (`[data-type='taskList']`, `:focus`) ; ajouts :
  proximité titre → texte (`--space-3`), écart entre puces (`--space-2`), `h4`, lien
  souligné (WCAG 1.4.1). Classe en `layer(components)`, sélecteurs descendants seulement.
  `.prose` ne change pas. La promotion est consignée dans GOVERNANCE (nouvelle section,
  « Promouvoir depuis une app », et son registre). Dashboard n'est pas modifié par ce
  lot : il composera `.ds-prose` à son prochain lot, en gardant sa part TipTap.

### Les décisions de marque

- **M2 adopté** (voir le tableau).
- **M3 adopté, parce que `check-contrast.mjs` le valide** — sans cette condition, rien
  n'aurait bougé. Mesuré avant d'écrire : 3,12 / 4,79 sur la page ; 3,25 à 3,37 sur
  carte, `--secondary` et popover en clair ; 3,78 au plus bas en sombre. Seul `--muted` en
  clair reste à 2,96 (contre ~2,3 avant). Le bloc `@a11y-assume` de l'anneau est retiré —
  le garde l'exigeait — et `docs/accessibilite.md` est régénéré (`--table`) : **18 écarts
  assumés au lieu de 19**, § 3.4 réécrit en « sorti des écarts ».
- **M4 non confirmé, donc rien n'est corrigé.** Vérifié dans la vitrine, au clic réel
  (Chromium) : clic sur le libellé ou sur la case → la case prend le focus mais
  `:focus-visible` reste faux, aucun halo ; au clavier, le halo apparaît comme prévu. La
  règle est `:focus-visible` dans le paquet comme dans le bundle des maquettes : le halo
  vu dans Claude Design venait de l'outil, pas du socle.
- **M1 refusé** (liens en `--primary`, 3,12:1 sous le 4,5 du texte). Non fait.

### Non fait, volontairement

B3 (teinte CSS de la barre), B11 (Pastille « puce »), B16 (frontière 1 024 px) : reportés.
Aucune pastille « en direct », aucun carrousel, aucun compte à rebours, aucun composant
métier : ils restent dans le site (`docs/AUDIT-SITE.md` § 9).

### Le reste

- Vitrine : chaque ajout y est — Navigation (lien actif, menu replié ouvrable, bouton dans
  la barre, pied à emplacements), Data display (cartes-liens, sur-titre neutre),
  Formulaires (calendrier fluide, `today` injecté), Marque (les trois étendues de halo),
  Fondations (`.overline`, la note des displays mobiles, un spécimen `.ds-prose`). La note
  de l'Input qui parlait de `--brand-via` est corrigée.
- Docs : PROMPTS (Navbar, Footer, Card, Calendar, Halo, et les classes `.overline` /
  `.ds-prose`), PIEGES (§ 2 compte neuf utilitaires, § 9 nouveau), README (polices et
  préchargement, classes), DESIGN.md (la ligne `--ring` remplace celle de `--brand-via`),
  GOVERNANCE (promotions). Deux commentaires du socle (`core.css`, `preflight.css`) qui
  citaient l'import Google de cette marque au présent sont remis au passé.
- `check-portage.sh` : **32 correctifs** (sept entrent, recomptés).
- Gabarit : porté en **0.9.0** — API, comportement, accessibilité ; ni M2, ni M3, ni B15,
  ni B12 (le gabarit n'a pas la déduction de surface du bouton secondaire, divergence
  assumée de son inventaire).

**Aucune rupture d'API.** 39 composants, 48 glyphes, 3 icônes de plateforme, quatorze
gardes. Toutes les props sont additives ; `note: string` → `ReactNode` est un
élargissement ; `FooterColumn.links` devient optionnel.

**Vérifié avant tag :** typecheck, les treize gardes hors version, `check-portage.sh`,
`npm run demo:build`, `npm run build`, et le paquet monté dans un projet Astro 7 /
React 19 (build statique, rendu inspecté). **Après tag :** `npm run lint` en entier.

---

## 0.22.0 — `ContentIcon` gagne `tiktok`

Un lot d'une seule pièce, entré par la règle du deuxième demandeur (GOVERNANCE, test 2) :
Creator affiche trois plateformes de publication — YouTube, Instagram, TikTok — et une
autre app en aura besoin demain. Le logo remonte donc dans le socle, jamais dans l'app.

**Rien ne change à l'écran chez qui monte de version** : aucune règle CSS ne bouge, aucun
composant existant ne change de rendu. `youtube` et `instagram` sont au pixel près ce
qu'ils étaient. Dashboard et Creator sont épinglés à **v0.21.0** ; Creator monte à
`#v0.22.0` dans son lot front, par la spec explicite puis le SHA du lock (GOVERNANCE,
« côté app »).

### Le glyphe — dessiné à la main, parce qu'il n'y a rien à relever

`Github`, `Youtube` et `Instagram` ont été *relevés* sur lucide 0.469 en 0.5.3, la dernière
version à les livrer. **TikTok, lucide ne l'a jamais eu** — et lucide v1 ne livre plus
aucun logo, donc ne pas l'importer de là n'était pas un choix. `Tiktok` est écrit dans
`src/components/icons/brand-glyphs.ts`, sur la même grille 24 avec 2 de marge, le même
trait de 2, 2 de jour partout entre deux traits, en un seul tracé fermé : la hampe (bande
12→16), le crochet (quart d'anneau centré en (21,3), rayons 5 et 9, pointe verticale de 8 à
12 — la concavité du logo), le corps (anneau centré en (9.5,14.5), rayons 6.5 et 2.5, ouvert
par une coupe verticale à x=8 — le « C » qui le sépare d'une note ordinaire). Reconstruit
par `createLucideIcon` comme les trois autres : un `LucideIcon` ordinaire, qui traverse le
même `Glyph`, hérite du même créneau de taille et rend en **`currentColor`**. Aucune
couleur de marque TikTok n'entre au socle, ni en JS ni en CSS — même règle que le rouge
YouTube et le dégradé Instagram, qui n'y sont pas non plus.

Vérifié à 24, 20 et 16 px, en clair et en sombre, à côté des deux autres : la note se lit,
le « C » reste ouvert à 16 px.

### L'API

`ContentIconName` devient `'youtube' | 'instagram' | 'tiktok'` — extension pure d'une
union : tout code qui compilait compile. `ContentIcon` ne change pas de signature.

### Le catalogue sait maintenant lire le sous-chemin

`ContentIcon` n'avait **pas de section** dans `docs/PROMPTS.md` — une mention dans celle
de `Icon`, rien d'autre — parce que `check-catalogue.mjs` ne connaissait que
`src/index.ts` et aurait tenu `## ContentIcon` pour une section fantôme. Le garde lit
désormais aussi les `export function` de `src/brand-content.tsx` : `ContentIcon` et
`HaloHot` ont leur section (famille `# brand-content`, entre `icons` et `navigation`),
chaque `<ContentIcon name="…">` cité dans un bloc `tsx` doit exister dans
`ContentIconName`, et le compte « N icônes de plateforme » annoncé dans README.md,
PORTAGE.md et docs/PROMPTS.md est celui du type. Falsifié avant d'être gardé : un nom
inventé et un compte faux font tomber le garde.

À noter, pour lire le verdict : « 48 glyphes » **ne bouge pas**. `ContentIconName` et
`IconName` sont deux listes disjointes — c'est le compte des icônes de plateforme (3) qui
naît, pas celui des glyphes qui monte.

### Le reste

- vitrine : la page Icônes montre les 3 icônes de plateforme dans leur propre bloc, le pied
  de page de la page Navigation gagne un bouton TikTok à côté de YouTube et Instagram ;
- `check-portage.sh` : deux contrôles de plus (`Tiktok` dessinée, `ContentIcon` la connaît)
  — et le verdict dit le vrai compte, 25 : la ligne annonçait 24 pour 23 contrôles réels
  depuis la 0.21.0 ;
- la notice de `Icon.tsx` et celle de `brand-glyphs.ts` disent quatre logos et non trois ;
  README et PORTAGE nomment les trois plateformes.

**Aucune rupture.** 39 composants, 48 glyphes, quatorze gardes — inchangés.

---

## 0.21.0 — le rail, l'en-tête unique, et UNE couleur d'actif

Un lot porté depuis les maquettes v2 d'une app, relevé sur pièces, plus une décision de
Julien prise en cours de lot et qui pèse plus lourd que le reste : **tout ce qui est actif
a désormais UN jeton, `--active`**, et un garde qui l'impose. Quatre changements modifient
le rendu d'écrans existants ; ils sont listés en tête, parce que c'est ce qu'on lit en
montant de version.

### ⚠ Ce qui change à l'écran chez QUI monte de version — sans toucher à son code

| Ce qui bouge | Avant (0.20.0) | Après | Sites concernés |
|---|---|---|---|
| **La couleur de tout état actif** | trois couleurs selon le composant : `--primary-readable` (brique `#b23a1c` en clair) sur l'entrée de menu active et le bouton-icône enfoncé, `--primary` (`#e85d2f`) sur le bouton-icône `accent`, l'**encre** sur le lien de navbar actif et la page courante de pagination | **`--active`** partout — `#e85d2f`, l'orange clair, dans cette marque : libellé ET icône de l'entrée de menu, libellé de l'onglet, page courante, lien de navbar, icône et contour du bouton-icône enfoncé, icône du bouton-icône `accent` | Creator, Dashboard, Editing — chaque `Sidebar`, `Tabs`, `Pagination`, `IconButton` pressé ou `accent`, `Navbar` |
| **L'onglet sélectionné** (`.ds-tab[aria-selected]`, `.is-selected`) | plaque `--background` + `--shadow-sm` (sur une carte : `--card` ; en sombre : encre mêlée à `--secondary`), libellé en encre | plaque **`--accent`**, libellé **`--active`**, aucune ombre, aucun contour — la même plaque sur la page, sur une carte, en clair, en sombre | Creator (2 `Tabs`), Dashboard (5 `Tabs` + `OngletsDocuments`, qui émet `ds-tab is-selected` en dur), Editing |
| **L'entrée active du menu latéral** (`.ds-sidenav.is-active`) | libellé en encre, icône en `--primary` | libellé **et** icône en **`--active`** — une seule couleur ; la règle `svg` est partie | Creator, Dashboard, Editing (toutes trois en `Sidebar collapsible={false}`) |
| **L'en-tête de toute modale** (`Modal` en phase `confirm` / `loading`) | pastille et croix sur un rang, titre sur un second | pastille · titre · croix sur **une ligne** (l'en-tête de `Card`), le corps à 1,5 rem sous l'en-tête. Même taille de titre (`--text-subheading`), même pastille, même croix | Creator (4 modales), Dashboard (~14), Editing (~5) |

**⚠ Rien de tout cela ne descend tout seul.** `Dashboard` est épinglé à **v0.19.0** et
`Creator` à **v0.14.0** dans leur `package.json` ; `Editing` à v0.20.0. Tant que Julien ne
change pas cette ligne — et ne réinstalle pas par la spec explicite, puis vérifie le SHA du
lock (GOVERNANCE, « côté app ») — ces apps rendent exactement ce qu'elles rendaient hier.
La colonne « sites concernés » dit ce qui bougera **le jour où** chacune monte.

Ce qui ne bouge pas, vérifié dans les trois apps : les cartes à en-tête sans `flush`
(Dashboard en a six, toutes au cran `sm`), les cartes `flush` sans slot d'en-tête (Creator
en a sept), la barre latérale hors de son entrée active, tout `Input` sans `icon` ni `unit`
(le DOM est le même nœud nu), le jour sélectionné et le jour courant du calendrier.
**Rien de ce lot ne touche une règle `.ds-sidebar*`.**

### `--active` — LA couleur de tout ce qui est actif, et le garde qui l'impose

Julien, le 12/09/2026 : « la couleur d'un icône actif, d'un texte actif, d'un texte d'onglet
actif, de n'importe quoi actif, ce n'est pas la couleur primaire qu'on utilise, c'est
l'orange clair. Il faut que ça soit un réflexe, je le redemande tout le temps. » Le socle
lisait trois couleurs pour cet état (voir le tableau) — chacune avec sa raison écrite, et
le résultat était trois oranges pour dire « tu es ici ». Une demande qu'on refait n'est
pas une règle ; celle-ci en devient une, en trois pièces :

1. **Le jeton `--active`**, au contrat de marque (§ OBLIGATOIRE, en `:root` et `.dark`),
   exposé à Tailwind en **`text-active`**. Un RÔLE, pas un alias de `--primary` : la marque
   du dépôt y met son orange d'aplat (`#e85d2f`, la valeur A parmi les trois candidats
   rendus côte à côte, choisie par Julien), une autre marque y mettra ce qu'elle veut.
2. **Toutes les règles d'état actif de `patterns.css` le lisent** — quatorze règles :
   `.ds-sidenav.is-active`, `.ds-tab[aria-selected]`, `.ds-page[aria-current]`,
   `.ds-navlink.is-active`, `.ds-icon-btn--accent`, `.ds-icon-btn[aria-pressed]` et son
   contour. Le jour courant du calendrier (`is-today`) reste en `--primary-readable` :
   c'est une information (une date), pas un état actif ; le jour sélectionné reste blanc
   sur le dégradé.
3. **`check-active.mjs`**, le **quatorzième garde** de `npm run lint` : toute règle dont
   le sélecteur nomme un état actif (`.is-active`, `.is-selected`, `[aria-selected="true"]`,
   `[aria-current…]`, `[aria-pressed="true"]`, `.ds-icon-btn--accent`) ne peut colorer son
   contenu et ses contours qu'avec `var(--active)` — `color:`, `border-color:`,
   `box-shadow:` ; seule exception, `--primary-foreground` sur un remplissage de marque
   (le jour sélectionné). Le pseudo-état `:active` (le clic) n'est pas regardé. Jumeau de
   falsification de 16 cas, rejoué à chaque appel ; falsifié aussi sur le dépôt (une règle
   fautive injectée, échec constaté, retirée).

**⚠ Le prix, mesuré et assumé.** Sur les icônes, le seuil des graphiques tient (3,00 /
3,94 sur `--accent`). Sur le **texte**, `#e85d2f` ne tient pas 4,5 : l'entrée de menu
**3,00 / 3,78**, l'onglet **3,00 / 3,94**, la page courante **3,25 / 4,12**, le lien de
navbar **3,28 / 4,12**. Ce sont **quatre écarts assumés par écrit** dans
`brand-julien-fernandes.css` (`@a11y-assume`, 15 → **19**), repris dans
`docs/accessibilite.md` § 3.5 — une décision de marque prise en connaissance de la mesure,
avec ce qui l'atténue (l'état n'est jamais porté par la couleur seule : plaque, graisse,
`aria-current` / `aria-selected`) et son remède, qui est **une ligne dans le fichier de
marque** (`--active:#b23a1c` en clair), jamais un retour à trois jetons. C'est exactement le
mécanisme que le dépôt s'est donné pour ça : le script porte la mécanique, la marque porte
ses renoncements.

La charte (`docs/DESIGN.md`), le gabarit, `PIEGES.md` § 8 et le catalogue le disent au même
mot ; la règle consolidée des icônes (au-dessus de `.ds-pastille--brand`) gagne sa
quatrième ligne, **ACTIVE → `--active`**, et l'icône de nav active quitte celle des
« décoratives mais de marque » pour suivre son texte.

### L'onglet sélectionné — en orange clair, sans contour

Demande de Julien, hors maquette (ses onglets portent encore l'ancien régime) : « en orange
clair, sur le fond du menu, franchement visible ». Plaque **`--accent`** — la seule surface
« orange clair » du contrat — et libellé `--active`, la référence qu'il a montrée. **Pas de
contour** : le filet interne `--primary` à 45 % de l'étape courante de la barre des 7
étapes (f2) a été posé, rendu, puis retiré le même jour sur son verdict (« pas très moderne,
pas très joli »). Ce qui distingue le sélectionné du survol n'est donc pas un contour :
c'est que le survol d'un onglet n'a **pas de fond** (couleur seule, inchangé) et ne doit pas
en prendre — en clair, `--accent` et `--surface-alt` sont la même couleur.

Les règles par porteuse de l'ancien régime (`--card` sur une carte, l'override `.dark`)
n'ont plus d'objet et sont parties : la barre garde sa déduction de surface, la plaque est
la même partout. Nouvelle paire mesurée, `.ds-tab[aria-selected]`.

### `Rail` — le rail d'icônes, un composant à part

Une colonne de **`--rail-w` (3.75rem)** sur `--secondary`, filet droit : le point de marque
en tête, des entrées en icône SEULE (le libellé est leur `title` et leur nom accessible),
un ressort, les entrées de pied, l'avatar. Relevé sur les quinze écrans et la planche f1
des maquettes : `padding 1rem .5rem`, `gap .375rem`, point de marque 1.75rem à .875rem du
premier item, entrées de `--icon-control-md` (2.625rem — **pas 2.375**, l'audit de l'app
s'était trompé d'un cran), icône 1.25rem, avatar 1.75rem rond.

**Pourquoi un composant et pas un mode de `Sidebar`.** Rien n'est partagé sauf le type
`SidebarItem` et `linkAs`. Largeur, padding, gap, l'entrée (un carré `IconButton` contre
une pilule `.ds-sidenav` de 2.75rem), l'état actif, la marque, le pied — tout diverge ; et
`collapsible`, `defaultCollapsed`, `storageKey`, `brandCollapsed`, les titres de section
seraient devenus des **props qui mentent** en mode rail (GOVERNANCE, test 4). **La règle
qui départage, écrite dans les deux composants et le catalogue** : rail = icônes seules,
largeur fixe, jamais de repli · sidebar = libellés, repliable. Une app choisit l'un.

Une entrée est un `IconButton` par ses classes — `ghost` au repos (`--text-muted`, 5,17 /
6,47 ; encre au survol, le geste de `.ds-sidenav`), **`accent` quand elle est active** : la
variante née en 0.17.0 pour exactement cet état, plaque `--accent`, icône `--active`. Le
rail compose, il ne redessine rien.

Ce qui l'accompagne : `--rail-w` entre au § FACULTATIF du contrat (et à la planche
Fondations de la vitrine) ; **`Logo variant="dot"`** rend la pastille seule, dimensionnée à
`height` — le même nœud `.ds-logo__dot`, pas un second dessin de la marque ; la règle
sticky d'`AppShell` couvre `.ds-rail`. **Pas de forme tiroir** : un rail est un châssis de
bureau et se monte en `responsive={false}` — `AppShell` le signale en console en
développement si on l'oublie (il reconnaît l'élément `Rail` dans son slot).

### L'entrée active du menu, d'une seule couleur

Une règle `svg` posait l'icône en `--primary` pendant que le libellé restait en encre.
Julien veut les deux identiques, partout : les deux passent en `--active`. La règle `svg`
est partie, l'icône suit son texte par `currentColor`. Le survol d'une entrée active ne la
repasse plus en encre : l'état actif prime sur le pointeur. `check-portage.sh` cherche la
nouvelle règle, plus l'ancienne (20 → **24 correctifs**, avec l'onglet, le rail et le jeton `--active` au contrat).

### Un seul en-tête au socle — `CardHeader` et le mode à filet

L'audit de l'app (§ 6) a relevé cinq en-têtes — carte, carte étroite, modale, chat, zone —
et conclu qu'un seul suffit. L'en-tête sort du JSX de `Card` en **`CardHeader`, exporté du
même fichier** (pas de 40ᵉ composant) : `Card` le compose par ses props, l'API de `Card` ne
bouge pas, une app peut le poser seul en tête d'une zone.

**`flush`** — le mode à FILET : `padding var(--space-4) var(--space-5)`, `border-bottom`,
marge basse à zéro. Relevé sur les **quinze** en-têtes de carte `flush` des maquettes
(`1rem 1.5rem`) ; dix en-têtes d'une colonne étroite sont à `1rem 1.25rem`, c'est un
resserrement de largeur, pas un second en-tête — UNE valeur, sur l'échelle. **Une `Card
flush` qui porte un slot d'en-tête le rend à filet toute seule** : c'est la carte qui le
sait, comme l'alignement depuis la 0.18.0. Aucune app ne combinait `flush` et un slot.

**Pas de nouveau cran de titre, et l'interdit tient.** La v2 pose ses en-têtes de carte en
`h3` à `--text-control` — 15 px en Anton. Un cran `control` a été écrit, rendu, puis
**retiré** sur pièces : `--text-control` est un palier de CONTRÔLE (« boutons, champs,
chips, onglets »), et le plus petit palier de la display est `--text-heading-sm`
(1.125rem), celui que `.ds-card__title` porte déjà. Le 15 px de la maquette est une
approximation de l'outil, pas une décision de marque. `titleSize` reste `sm` / `lg`,
l'interdit « jamais `--font-display` sous 1.125rem » n'est pas touché, et `PIEGES.md` n'en
parle pas.

### `Modal` rend l'en-tête de `Card` — « le titre avec la croix sur la même ligne »

Le composant que Julien a explicitement demandé. Pastille · titre + sous-titre · croix sur
**une** ligne, par `CardHeader` : titre en cran `lg` (`--text-subheading`, la taille
qu'avait déjà le h3 de la modale), la croix en `action`, **`subtitle` nouveau** (la ligne
sous le titre, DANS l'en-tête), `description` **reste le corps**. Relevé q8/q10 : le corps
commence à **1,5 rem** sous l'en-tête — la modale espace ses enfants de 0.875rem, l'en-tête
garde 0.625rem de marge basse, la somme fait le relevé. Trois écarts absorbés par l'en-tête
unique, tous sous 2 px : gap icône-texte `.875` → `--space-3`, gap titre-sous-titre `.25` →
`.1875rem`, interligne du sous-titre `normal` → `snug`. Un seul en-tête vaut ces trois
pixels. Le pied de la modale ne bouge pas (la v2 le pose à 1,75 rem, hors périmètre).
`.ds-modal__title` est parti avec le second rang ; `.ds-modal__head` ne survit que pour la
phase `result`. La croix est désormais le **premier** focusable du panneau — le choix
`initialFocus: 'container'` tient pour la même raison qu'avant, et ses deux commentaires
disent l'ordre réel.

### Le reste de la liste É19 — tranché

- **`Kbd` entre.** La touche : 1.375rem, rayon `xs`, `--secondary`, filet interne, caption
  semi-gras — **47 occurrences** d'une seule forme dans les maquettes, sur neuf écrans sur
  vingt. Une vraie balise `<kbd>`, en corps de texte (`kbd` retombe sur `--font-mono` dans
  le socle ; `.ds-kbd` le redit). Atomique, mesuré, incomposable depuis un `Badge`.
- **`Input icon` entre.** L'icône de tête (« Chercher une vidéo… ») — le miroir exact du
  mécanisme `unit` de la 0.17.0 : `padding-left 2.5rem`, l'icône à `.875rem`, 1rem par le
  créneau des déclencheurs de champ, `--text-muted`, `aria-hidden`. Ce qu'un site d'appel
  ne peut pas recopier sans recopier aussi le padding du champ et son créneau. L'enveloppe
  `.ds-input-unit` devient **`.ds-input-wrap`** avec deux modificateurs (`--icon`,
  `--unit`) qui se cumulent — classe interne, aucune app ne l'écrivait (vérifié).
- **La poignée de redimensionnement reste métier.** Un seul produit ; sa valeur est le
  drag et le clavier, que l'app possède déjà (`SeparateurGlissant`) ; ses quatre jetons
  (`--border`, `--primary`, `--accent`, `--surface-alt`) sont atteignables. On promeut au
  deuxième appelant.
- **La densité est écartée.** Un réglage produit (q7) dont l'état « compacte » n'est
  dessiné nulle part : l'écrire, c'est inventer un second jeu de paliers. « Ce projet
  préfère telle densité » est une décision d'app (PIEGES, critère d'admission).
- **Les sept icônes sont closes sans rien ajouter.** `Icon` accepte `glyph={LucideIcon}`
  depuis la 0.15.0 et `lucide-react` est une peer dependency — chaque app l'a. C'est
  écrit dans le catalogue et le README pour que personne ne redemande un glyphe.

### Les gardes et la doc

- **Quatorze gardes** : `check-active.mjs` entre dans `npm run lint`, entre `contraste` et
  `surfaces` ; README, GOVERNANCE, PORTAGE et `ci.yml` comptent quatorze.
- `check-contrast.mjs` : **53 → 58 paires** — les états actifs mesurés sur `--active`
  (`.ds-navlink.is-active`, `.ds-sidenav.is-active`, `.ds-page[aria-current]`,
  `.ds-tab[aria-selected]`, `.ds-icon-btn[aria-pressed]`, `.ds-icon-btn--accent`), l'entrée
  de rail au repos, `.ds-kbd`. 39 conformes, **19 écarts assumés** (15 + les quatre de
  `--active`). `docs/accessibilite.md` régénéré ; § 1.1 réécrit (la ligne ACTIVE), § 1.2 et
  § 3.5 ajoutés.
- `check-portage.sh` : 20 → **24 correctifs**.
- `docs/PIEGES.md` : **§ 8** « L'état actif a UN jeton, `--active` — et ni `text-primary`
  ni `text-primary-readable` ne le sont ».
- `docs/DESIGN.md` : la ligne `--active` de la charte. `brand.template.css` : le jeton au
  § OBLIGATOIRE, avec sa règle.
- Le catalogue : `Rail`, `Kbd`, et les sections `Card`, `Modal`, `Input`, `Tabs`,
  `Sidebar`, `AppShell`, `Pagination`, `IconButton`, `Logo`, `Icon` mises à jour ;
  **39 composants**.

**Vérifié avant tag :** les treize gardes hors version, `npm run demo:build`, `npm run build`.
**Après tag, avant push :** `npm run lint` en entier, les quatorze.

## 0.20.0 — les pièges du socle cessent d'être du savoir oral

Trois pièges du code livré ne vivaient que dans la tête de qui s'était fait avoir, ou dans
les tests d'UNE app. Ils deviennent trois gardes du socle et une page de doc qui voyage
avec le paquet. Aucun changement de rendu, aucun changement d'API.

### Trois gardes, portés depuis une app

Ils existaient, écrits et éprouvés, dans `architecture.test.ts` d'une app consommatrice —
sous vitest, avec leurs listes écrites à la main. Ils entrent au socle dans son idiome :
des scripts `check-*.mjs` à la racine, sans framework, enchaînés par `npm run lint`, qui
passe de dix à **treize gardes**.

| Garde | Ce qu'il ferme |
|---|---|
| `check-dead-utilities.mjs` | une classe que `theme.css` a supprimée et qui ne rend RIEN |
| `check-font-px.mjs` | une taille de police en pixels, qui ne suit pas `app-scale.css` |
| `check-fragile-classes.mjs` | un utilitaire posé sur `.accent` ou `.eyebrow`, qui tue le dégradé |

**Le périmètre est PARAMÉTRABLE, et c'est la moitié de l'intérêt de les tenir ici.** Chacun
prend des dossiers en argument (défaut : `src demo/src`). Une app consommatrice pointe le
même garde sur son propre `src/` :

```bash
node check-dead-utilities.mjs src      # THEME= et TAILWIND_THEME= si le socle est en node_modules
node check-font-px.mjs src
node check-fragile-classes.mjs src
```

### Deux exigences de conception, et elles portent tout le lot

**1 · Ce qu'un garde surveille est DÉRIVÉ, jamais recopié.** La liste des classes mortes se
calcule à chaque appel — *entrées natives de Tailwind moins entrées que notre `theme.css`
redéclare* — en lisant quels espaces de noms sont mis à `initial`. Elle donne aujourd'hui
**64 classes** (`--text-*`, `--tracking-*`, `--radius-*`). Une liste en dur périmerait au
premier changement de `theme.css`, et un garde périmé qui reste vert est exactement le
défaut qu'on essaie d'empêcher, une couche plus haut. Même principe pour les classes
fragiles : elles se dérivent du CSS (toute règle à classe unique qui clippe un fond dans son
texte ET pose `color:transparent`), ce qui donne `.accent` et `.eyebrow` — et couvrira la
troisième AVANT son premier usage.

⚠️ **Les faux positifs sont la moitié du travail, et ils sont épinglés.** Un garde qui crie
sur du code correct se fait désactiver aussi sûrement qu'un garde muet. Trois pièges, tous
mesurés sur une compilation Tailwind réelle plutôt que déduits :

- `text-primary` / `text-muted` **survivent** — l'utilitaire `text-` lit deux espaces de
  noms, les tailles et les couleurs ; seule l'échelle de TAILLES est morte ;
- `text-shadow-lg` **survit** — `--text-shadow-*` est un espace de noms à part, que
  `--text-*: initial` ne touche pas (Tailwind résout le plus long) ;
- `rounded-full` / `rounded-none` **survivent** — ce sont des valeurs statiques de
  l'utilitaire, pas des entrées de `--radius-*` : elles ne peuvent pas mourir avec lui.

**2 · Chaque garde porte son JUMEAU DE FALSIFICATION, et le rejoue à chaque appel.** C'est
la partie de l'original qui avait le plus de valeur, et elle est conservée telle quelle : le
motif doit reconnaître une violation ET laisser passer ce qui est légitime. Le jumeau tourne
AVANT le scan ; s'il tombe, le garde échoue au lieu de scanner. Un motif qui ne reconnaît
plus rien rend un garde toujours vert, donc décoratif — et **ce mode de panne est aussi
silencieux que les défauts qu'il surveille**. 57 cas au total (7 · 30 · 20).

Les trois ont aussi été falsifiés de bout en bout sur le dépôt, comme `check-catalogue.mjs`
l'avait été à 47 glyphes : violation introduite dans la vitrine, échec constaté, violation
retirée. Le même passage a prouvé les faux positifs — `text-primary`, `rounded-full`,
`text-shadow-lg`, `bg-accent px-3` et une branche de ternaire étaient posés à côté des
violations, et sont tous passés.

**Ce qu'ils lisent, et pourquoi ce n'est pas un `grep`.** Les trois extraient les valeurs de
`className` plutôt que de chercher une sous-chaîne dans le fichier. Sans ça, `theme.css`
échouerait sur ses propres commentaires — ils citent `text-sm` et `tracking-widest` pour
EXPLIQUER la règle — et on désactiverait le garde plutôt que la prose. Le découpage en mots
écarte au passage `bg-accent` et `text-eyebrow`, qui nomment le jeton de surface et le
palier typographique.

**Une limite, écrite plutôt que cachée** : `check-fragile-classes.mjs` juge un `className`
construit par un TERNAIRE branche par branche, jamais en union — sinon
`cond ? 'accent' : 'text-muted'`, qui est correct, serait signalé. Les autres formes
(`cn('accent', x && 'w-full')`) sont bien vues en union.

### `docs/PIEGES.md` — et son critère d'admission

Une page qui rassemble les pièges du socle : ce qui casse, **pourquoi la panne est muette**,
la parade, et le garde qui l'attrape quand il y en a un. Elle vit dans `docs/`, qui voyage
avec le paquet (`files`) : une règle qui doit protéger les apps doit être lisible DEPUIS
l'app. `docs/DESIGN.md` s'adresse à qui écrit une marque ; celle-ci à qui écrit un écran.

⚠️ **Le critère d'admission est en tête de page, avant la liste**, et c'est lui qui la garde
utile : **un piège entre ici si sa CAUSE est dans le code livré.** Si la cause est dans une
marque, dans un environnement de travail ou dans une décision d'app, il n'y entre pas — même
s'il a coûté cher. Sans critère, une page de pièges devient un fourre-tout en trois mois,
cesse d'être lue, et les vrais pièges repartent dans le savoir oral qu'elle existe pour
remplacer. Le critère se teste en une question : *si je supprime ce paragraphe du code
source du socle, le piège disparaît-il ?*

Sept entrées : les classes Tailwind qui n'existent pas · l'utilitaire de marque qui perd
contre un composant (`layer(base)` contre `layer(components)`) · le pochoir à quatre
déclarations de `.accent`/`.eyebrow` · **les tailles de police en pixels** · l'absence de
portail — un flottant absolu clippé par le `overflow:hidden` d'une `Card flush` · `Select`
qui est un `<select>` natif · et la forme récurrente du défaut, avec ses trois formes et ses
deux questions de revue.

La quatrième est ENTRÉE par le critère sans figurer au cahier des charges : sa cause est
`app-scale.css`, qui est dans le paquet. Sans lui, une taille en px serait une préférence de
style ; avec lui, c'est un défaut de rendu — et un défaut de rendu qu'on ne voit que sur
l'écran de quelqu'un d'autre. Quatre candidats sont SORTIS, avec le fichier qui les
accueille, écrit dans un tableau au lieu d'être laissé au jugement : l'historique des
incidents, le piège du lock npm sur un tag, la numérotation des manques d'une app, et les
préférences propres à un projet.

Liée depuis le tableau « Par où commencer » du README et depuis la tête de `docs/PROMPTS.md`.

### `GOVERNANCE.md` — à quel moment lancer les gardes

La procédure de version listait ses six étapes sans dire QUAND jouer les gardes, et chaque
lot le redécouvrait en le signalant comme une entorse. Ce n'en est pas une, c'est la
séquence : `check-version.mjs` **ne peut pas** passer avant le tag — il exige que le tag
existe, c'est son travail. La procédure passe à huit étapes, avec deux passages :

- **avant le tag** — les douze autres gardes, `npm run demo:build`, `npm run build` : verts.
  `check-version.mjs` est rouge, et c'est correct ;
- **après le tag, avant le push** — `npm run lint` en entier. **Rien ne part sans les
  treize.**

### Trois chiffres corrigés au passage

- `docs/PROMPTS.md` et cette page annonçaient « les **185 redéclarations** de
  `patterns.css` ». Le nombre n'est reproductible par aucune mesure du fichier
  d'aujourd'hui — 318 groupes de sélecteurs, 393 sélecteurs, 125 règles touchant une
  propriété typographique. Il a été mesuré une fois et le fichier a grossi. La phrase dit
  désormais « toutes les règles de `patterns.css` » : le mécanisme ne dépend pas du compte,
  et un compte qui dérive en silence est le défaut que ce lot combat ;
- `README.md` annonçait « dix gardes » — treize ;
- `.github/workflows/ci.yml` annonçait « les trois gardes du dépôt » dans son en-tête, et
  nommait quatre gardes dans le libellé du pas `lint`. Corrigé, avec le rappel que la
  réciproque est fausse : un garde peut vivre hors de `lint` (dans `build`), donc on ne
  conclut jamais de la lecture du seul script `lint` qu'un garde ne tourne pas. Vérifié en
  énumérant les `run:` réels du job `qualite`, pas en lisant le script.

**Vérifié avant tag :** les douze gardes hors version, `npm run demo:build`, `npm run build`.
**Après tag, avant push :** `npm run lint` en entier, les treize.

## 0.19.0 — la vitrine type-checke, et le déclencheur s'étale sans cast

Passe de clôture : un renommage qui n'était pas descendu, une vitrine qui ne compilait
plus depuis assez longtemps pour cacher un défaut de contrat, et trois commentaires qui
prescrivaient l'état d'avant. Rien de neuf au catalogue.

### `npm run demo:build` — 56 erreurs, et ce qu'elles cachaient

La dernière étape du job `qualite` était rouge. **La cause n'est pas la plage de version
déclarée, c'est le nombre de copies.** Le `paths` de `demo/tsconfig.json` fait résoudre
`../src/index.ts` — donc la source du socle se type contre les `@types/react` de la
RACINE pendant que les fichiers de la vitrine se typent contre les SIENS. Deux copies,
deux identités.

⚠️ **Aligner les numéros ne suffit pas, et c'est le piège.** Passer la vitrine en `^19`
fait tomber 55 erreurs sur 56 — puis en laisse une nouvelle, `Ref<HTMLButtonElement>
n'est pas assignable à Ref<HTMLButtonElement>`. React 19 type le retour de `RefCallback`
avec un `unique symbol` : deux copies de la **même** version ne sont pas assignables
l'une à l'autre. (En 18 elles l'étaient — d'où un dépôt qui a pu vivre avec la
duplication tant que les deux copies étaient en 18.) La vitrine ne déclare donc plus
`@types/react` ni `@types/react-dom` du tout et lit ceux de la racine : **une seule
identité de types, celle que le paquet publie.** Le socle, lui, garde son garde-fou —
sa source se type contre la 19 avec un runtime en 18.

### `DatePicker` : `triggerProps.ref` devient une ref de RAPPEL

Une fois la vitrine compilée, elle a attrapé ce que `tsconfig.json` cachait en excluant
`demo` : **l'exemple `trigger` du catalogue ne compilait pas.** `triggerProps.ref` était
un `Ref<HTMLElement | null>`, c'est-à-dire un objet de ref — invariant sur son contenu,
donc refusé par le `ref` d'un `<button>`. Le socle s'en sortait par un cast interne que
la doc ne montrait pas, **tout en présentant l'étalement nu comme LE contrat**. La
vitrine recopie l'exemple au caractère près : le contrat était faux, et rien ne le
disait.

`ref` est désormais `(node: HTMLElement | null) => void`. Une ref de rappel est
**contravariante sur son paramètre** : elle s'assigne au `ref` de n'importe quelle
balise. Plus un seul cast — ni chez l'appelant, ni dans le socle, dont le bouton par
défaut se contente maintenant du `{...triggerProps}` nu. Les deux chemins redeviennent
identiques, ce qui était le point de la forme arbitrée en 0.17.1.

⚠ **Changement de TYPE public**, `DatePickerTriggerApi['triggerProps'].ref` :

- **ne casse rien pour qui étale** — `{...triggerProps}` est le cas documenté et le seul
  attesté ; un cast déjà écrit reste compilable, il devient seulement inutile ;
- **casse** un appelant qui aurait traité cette valeur comme un objet de ref et lu son
  `.current`. Ce n'était pas le contrat, aucun appelant connu ne le fait, mais la
  signature change et le journal le dit.

Recette au rendu, sur les deux chemins (bouton par défaut **et** déclencheur composé) :
ARIA posé par le socle, `aria-controls` qui pointe le popover réel et n'existe qu'avec
lui, retour de focus sur Échap **et** sur sélection, ArrowDown qui ouvre.

### `--shadow-glow-sm` entre au `@theme inline`

Déclaré par la marque, employé par le socle (l'état enfoncé de `.ds-btn--primary`),
jamais atteignable : une app le recopiait en `shadow-[var(--shadow-glow-sm)]`. C'est
exactement le défaut des quatre couleurs de la 0.17.1, un espace de noms plus loin —
et le commentaire qui déclarait ce balayage terminé avait donc tort d'un cran. Les
**trois** paliers de lueur sont exposés ; `.shadow-glow-sm` est généré, vérifié sur une
compilation Tailwind réelle. `--shadow-logo-dot` reste dehors, et c'est écrit : sa seule
lecture est `.ds-logo__dot`, un nœud que le socle rend lui-même.

### `brand-example.css` — 23 endroits pour un fichier mort

Le renommage en `brand-julien-fernandes.css` n'était pas descendu. Le coût réel n'est
pas dans les commentaires, il est dans **les trois lignes d'installation du README** :
elles ne lèvent aucune erreur au copier-coller et lèvent un module introuvable chez
celui qui installe. Plus l'alias de `demo/vite.config.ts`, qui pointait sur un fichier
inexistant. Balayé partout — README, `src/index.ts`, `PORTAGE.md`,
`GETTING-STARTED.md`, `brand.template.css`, `rebrand.mjs`, `check-contrast.mjs`,
`ci.yml`. Les quatre lignes d'installation du README résolvent, vérifié contre la carte
d'`exports`.

Là où le renommage rendait la phrase fausse **autrement**, la phrase suit la marque
réelle au lieu de décrire celle du gabarit : la marque livrée ici n'est pas « froide,
serif, celle de personne », son dossier de polices n'est pas vide (Anton et JetBrains
Mono y sont), et elle ne redéclare aucun rayon. La preuve de neutralité du socle se fait
dans le gabarit — c'est désormais écrit là où on lisait le contraire, `ci.yml` compris.

### La doc contre le code — quatre écarts, et un garde pour le dernier

- **`Toast`** : la doc disait `--popover`, `patterns.css` pose `--card` ;
- **`Progress`** : la doc annonçait un remplissage `--primary` ; la barre porte le
  dégradé de marque depuis la 0.6.0, la phrase n'avait pas suivi ;
- **`Navbar.children`** était déclaré, rendu dans un emplacement précis — l'emplacement
  de droite, juste **avant** `cta` — et c'était la seule prop de `NavbarProps` sans
  commentaire, absente du catalogue. Les deux sont écrits ;
- **le catalogue compte 48 glyphes**, la doc en annonçait 47 à trois endroits.

Le dernier ne reviendra pas. `check-catalogue.mjs` gagne une **cinquième vérité** : le
nombre de glyphes annoncé dans `README.md` et `docs/PROMPTS.md` doit être la taille du
type `IconName`. Le contrôle 3 vérifiait que chaque icône **citée** existe ; il ne
regardait jamais le COMPTE. Falsifié : remis à 47, le garde tombe.

### Trois commentaires qui prescrivaient l'état d'avant

- `patterns.css`, bloc « UN SEUL BORD OPTIQUE GAUCHE » : sa phrase d'ouverture donnait
  `padding:0 var(--space-4)` pour une entrée quand `.ds-sidenav` pose `--space-2` depuis
  la 0.14.0 — et c'est **elle** qui sert de référence, puisque le bloc ajoute « si l'un
  bouge, les autres suivent ». Qui appliquait la consigne remettait quatre blocs à 16px ;
- au-dessus de `.ds-sidenav.is-active svg`, un bloc de sept lignes décrivait un
  `--brand-via` « pâle mais assumé » avec ses mesures (2,29 / 5,34). La règle juste en
  dessous pose `--primary` depuis la 0.10.0 (l'addenda v0.8.0), et `docs/accessibilite.md`
  porte d'autres chiffres (2,34 pour l'option écartée, 3,00 / 3,78 pour celle en place).
  Le bloc part, l'historique reste là où il se mesure ;
- `patterns.css` renvoyait à « Modal.jsx » ; le fichier est `Modal.tsx`.

### Le socle cesse d'emprunter la numérotation d'une de ses apps

`docs/PROMPTS.md` renvoyait au « manque n° 9 » — un numéro qui appartient au § 8 de
Dashboard, où il désigne aujourd'hui autre chose — et annonçait le mode plage « en tête
de file pour la prochaine version », ce que la 0.18.0 avait déjà démenti. Le besoin est
décrit par son périmètre, sans numéro emprunté : le paragraphe `Calendar` est maintenant
identique, mot pour mot, à celui du gabarit.

Ride avec ce lot, sans matière propre : la note `eyebrow` de la section 0.18.0, corrigée
en place — étendre le déclencheur `--stacked` à `eyebrow && title` calerait l'action sur
le sur-titre, ce n'est pas une valeur d'`align-items` mais une autre mise en page.

**Vérifié avant tag :** `npm run lint` (dix gardes), `npm run demo:build`, `npm run build`.

## 0.18.0 — l'en-tête de carte apprend le centrage

Le `align-items:flex-start` de `.ds-card__header` n'avait **jamais rencontré un design
réel** : sur les six artboards de Dashboard, l'en-tête du socle apparaît zéro fois sur
48 cartes — 48 en-têtes recomposés à la main — et le relevé des alignements donne
99 × center, 11 × flex-start, 5 × baseline, 2 × flex-end. Trois cartes d'un même écran
s'alignaient de trois façons, aucune n'étant celle du socle. Le centrage est la langue
du design ; le socle la parle désormais, et la décide seul.

**La règle, deux cas, aucune prop d'alignement :** titre simple → `center` (le nouveau
défaut) ; titre **et** sous-titre → `flex-start` (`--stacked`, posé par `Card` lui-même
quand `subtitle` est passé) — l'action s'aligne sur la ligne du haut, elle ne flotte pas
entre deux lignes. `baseline` est **écarté**, preuve à l'appui : pour qu'un badge tombe
juste dans une rangée en baseline, l'artboard a dû écrire `align-self:center;
position:relative; top:-1px` dessus — une règle qui exige une retouche par instance
n'est pas une règle.

**⚠ Changement de rendu, pas un ajout — impact mesuré :**

- bouge : toute `Card` à en-tête **sans sous-titre** portant une `action` ou une icône
  plus haute que la ligne de titre — le bloc icône + titre descend vers l'axe central
  (de l'ordre de la demi-différence de hauteur, ~5 à 9px selon l'action). Vérifié au
  rendu : l'écart entre le centre du titre et le centre de l'action passe à **0**.
- ne bouge pas : les cartes **à sous-titre** (`--stacked` = l'ancien défaut, au pixel),
  les cartes **sans en-tête** (aucun nœud émis), et les en-têtes recomposés à la main
  (ils n'emploient pas la classe).
- la vitrine : ses deux spécimens d'en-tête portaient tous deux un sous-titre — rendu
  inchangé ; un spécimen « titre simple, rangée centrée » est ajouté, c'est lui qui
  montre le nouveau défaut.
- Creator : 9 sites `<Card`, **zéro** avec un slot d'en-tête, zéro `.ds-card__header`
  écrit en dur — rien ne bouge chez lui, même le jour où il bumpe.

**L'audit demandé — que laisse encore l'en-tête à l'appelant sans le dire ?** Un seul
cas hors règle, remonté : **`eyebrow` + titre sans sous-titre** fait aussi une colonne à
deux lignes, que la règle ne couvre pas. ⚠️ Ce ne serait PAS « une ligne » à corriger, et
étendre le déclencheur à `eyebrow && title` serait FAUX : avec `title + subtitle`,
`flex-start` cale l'action sur le TITRE parce que le titre est la première ligne ; avec
`eyebrow + title`, il la calerait sur l'EYEBROW — un sur-titre de 12px. On échangerait
un défaut contre un autre. La règle qui se cache dessous est « l'action s'aligne sur la
ligne du TITRE » : elle se confond avec `center` quand le titre est seul, avec
`flex-start` quand le titre est premier de deux, et cesse de se confondre avec quoi que
ce soit dès que le titre n'est pas premier. Ce n'est pas une valeur d'`align-items`,
c'est une AUTRE mise en page. Et il n'y a **aucun demandeur** : zéro `eyebrow` dans les
six maquettes de Dashboard, zéro prop `eyebrow=` dans les deux apps (vérifié). Candidat,
pas besoin — on n'écrit pas une mise en page pour personne. Le reste est en règle : la gouttière
basse est variable ET annoncée (`headerGap`), les gaps internes (icône/colonne
`--space-3`, titre/sous-titre 3px) sont des littéraux de compacité couverts par la
doctrine en tête de patterns.css, et chaque nœud de l'en-tête porte une classe
atteignable.

## 0.17.1 — les quatre couleurs hors de portée, et le déclencheur arbitré

Le patch sous le titre de la 0.17.0 : deux valeurs de plus rendues à l'appelant.

### Quatre couleurs que le socle employait sans les exposer

Le balayage (celui de Dashboard, refait indépendamment ici — mêmes quatre, rien d'autre) :
`--surface-alt` (15 usages dans les règles du socle), `--primary-readable` (6),
`--destructive-readable` (3), `--success` (1) n'existaient pas en `--color-*` dans
`theme.css`, contre 43 couleurs exposées dont `overlay-play`. Ce n'était pas une
politique — `primary` et `destructive` étaient exposés quand leurs jumeaux `-readable`,
précisément ceux qui posent une couleur sur du TEXTE, ne l'étaient pas. Une app qui en
avait besoin recopiait le `var()` : la forme 2 du défaut, côté utilitaires. Les quatre
entrent au `@theme inline`. Vérifié : zéro collision (ni un nom natif de Tailwind 4.3.3,
ni un `@utility` du socle — le garde passe à 119 jetons), et les quatre GÉNÈRENT, mesuré
sur la feuille émise, variantes comprises (`hover:bg-surface-alt`,
`dark:text-primary-readable`). Seul autre non-exposé : `--tone-deep`, exclusion
délibérée déjà documentée (extension métier).

### `DatePicker` : le déclencheur composable — la forme arbitrée

Pas `({open, toggle})` : le socle ne tiendrait plus l'élément — pas de ref, donc pas de
retour de focus ; pas de prise, donc pas d'ARIA. `trigger` reçoit
`{ open, value, triggerProps }` et l'appelant **étale `triggerProps`** sur l'élément de
son choix : le socle récupère sa ref (retour de focus sur Échap ET sur sélection, mesuré
au rendu) et pose l'ARIA lui-même (`aria-haspopup` / `aria-expanded` / `aria-controls` —
ce dernier n'existe que quand le popover existe : pointer un id non rendu serait un lien
mort pour le lecteur d'écran). Le bouton par défaut étale LE MÊME objet `triggerProps` :
les deux chemins ne peuvent pas diverger. Détails d'implémentation assumés :
`onKeyDown` n'ouvre que sur ArrowDown/ArrowUp — Entrée et Espace passent par le `click`
natif du bouton, les gérer aussi au clavier doublerait la bascule ; l'élément doit être
focusable et **recevoir `ref`** (un composant sans `forwardRef` — le `Button` du socle
compris — perdrait le retour de focus) ; `disabled` reste la charge de l'appelant.
`DatePickerTriggerApi` est exporté. Le manque n° 4 de Dashboard est fermé.

### Le contrôle de couverture des classes est au gabarit

`check-classes.mjs` — né chez Dashboard, falsifié chez lui comme au gabarit — confronte
les classes littérales du JSX à la feuille émise par le build et attrape toute classe
muette. Sa place est le gabarit (v0.3.1) : chaque app née de lui l'a au premier commit.
Ce dépôt-ci ne le porte pas — sa vitrine est déjà couverte par celle du gabarit, aux
mêmes sources près. Au passage, une affirmation de `theme.css` re-mesurée : parmi les
classes tuées par les trois `--*: initial`, `rounded-none` et `rounded-full` SURVIVENT
bien (staticValues), comme le commentaire le disait — mais `text-sm`, `text-base`,
`text-lg`, tout `tracking-*` natif, `rounded` nu et `rounded-3xl/4xl` sont muets.

## 0.17.0 — aucune valeur du socle hors de portée de l'appelant

Cinq défauts en un mois, trois formes d'un même mal : une valeur **battue par la cascade**
(`.accent`, `.mono` — la couche gagne toujours), une valeur **hors d'atteinte de la
cascade** (le créneau d'icône muré par un style inline, deux nœuds sans classe), une
valeur **atteignable mais non prévue pour varier** (`.ds-logo__dot`). Même issue à chaque
fois : l'app recopie ou surcharge, le socle ne le sait pas, et la panne est **muette**.
Cette version ferme la deuxième forme en entier, écrit la doctrine des trois là où on la
lit, et embarque les manques que Dashboard a accumulés.

### Le créneau d'icône — le défaut principal

`Glyph` posait `width`/`height` inline avec `size = '1.25rem'` en **défaut de
paramètre** : la déclaration existait à chaque rendu, aucune règle CSS ne pouvait donc
dimensionner un créneau — `.ds-badge--dense svg { width: .75rem }` était mort-né. Le socle
se contredisait lui-même : `Button` calculait une taille pour son `Spinner` mais pas pour
l'icône passée par l'appelant — le même bouton `sm` rendait 1rem en chargement et 1.25rem
au repos.

Le mécanisme, désormais : `.ds-icon` et `.ds-spinner` lisent
`var(--ds-icon-size, 1.25rem)` ; les **créneaux** posent la propriété par une règle CSS
(patterns.css, § LES CRÉNEAUX D'ICÔNE) ; la prop `size` d'un site d'appel l'écrit inline
et **gagne** — la surcharge optique reste possible, et doit le rester. La propriété est
**enregistrée** :

    @property --ds-icon-size { syntax: '*'; inherits: false; }

`inherits: false` est le point non négociable : une règle posée sur un conteneur est
INERTE au lieu d'être fuyante — `EmptyState` rend une Pastille ET un Button dans son
créneau `action`, une règle sur `.ds-empty` aurait grossi l'icône du bouton en silence.
Les règles ciblent le `svg` lui-même. `syntax: '*'` sans `initial-value` laisse la
propriété **guaranteed-invalid** (vérifié au spec ET au rendu) : le repli `1.25rem` est
actif partout où rien ne pose la propriété — `<length>` aurait exigé un `initial-value`
qui tuerait le repli, et refusé un `size="100%"` en silence.

Les créneaux posés sont **le relevé des six artboards** (131 icônes) : IconButton sm 1rem
· Button sm 1rem · IconButton md 1.125rem · déclencheurs de champ (chevron du Select,
calendrier du DatePicker) 1rem · Badge dense 0.75rem · Pastille dialogue 1.5rem · Button
md 1.125rem · Pastille panneau 1.5rem (vitrine et doc). Pastille carte et nav de Sidebar
rendent déjà le repli. La constante JS de `Button` (`md → 1.25rem` — la marque dit 1.125,
attesté 13 fois) est **supprimée**, pas corrigée : c'est la règle CSS qui porte la valeur.

**⚠ Ce qui change à l'écran** — les créneaux corrigent des tailles fausses, c'est le but :
une icône SANS `size` explicite rend désormais 1.125rem dans un bouton ou IconButton `md`
(avant 1.25), 1rem dans un `sm`, 1.5rem dans une pastille `dialogue`/`panneau` (le Modal
result compris), 1rem sur le chevron du Select (avant 1.125) et le déclencheur du
DatePicker (avant 1.25). Les `size` explicites des apps continuent de gagner, à
l'identique. Le spinner d'un bouton `md` passe de 1.25 à 1.125rem — il rend enfin comme
l'icône qu'il remplace. Aucune rupture d'API ; `Glyph` porte maintenant la classe
`.ds-icon` (les quatre déclarations inline — width, height, flex, display — vivent là).

### Les deux nœuds sans classe — même leçon

L'astérisque « requis » de `FormField` et le hint d'un item de `Dropdown` étaient des
styles inline **sans même une prop** : une décision du socle qu'aucun sélecteur ne pouvait
viser. Ils deviennent `.ds-label__required` et `.ds-dropdown__hint`, valeurs identiques.

### Le liseré sur le dégradé — un bug vu depuis des mois, attribué au template

Une bordure de couleur **plate** (`--brand-to`) entourait un fond `--brand-gradient` : en
haut à gauche le fond est à son arrêt clair, la bordure au bout sombre — liseré visible.
Deux sites dans patterns.css : la case cochée de `.ds-choice` et son état indéterminé. La
bordure passe `transparent` et le dégradé se peint `border-box` — il se dessine SOUS elle,
la boîte garde sa taille. Le radio coché, qui revient sur fond plat, **reprend**
explicitement sa bordure `--brand-to`, sinon son anneau disparaissait. Balayage complet :
aucun autre site — les autres fonds dégradés (boutons primaires, switch, progress, jour
sélectionné, pastille brand-solid) n'ont pas de bordure ; le seul cas restant est
`Pastille brand-solid` + `outlined`, dont le contour currentColor à 22 % est translucide
et délibéré.

### Les manques remontés par Dashboard

- **`IconButton` : `variant="accent"` + `as`/`href`.** Fond `--accent`, sans bordure,
  icône `--primary` (3,08:1 clair / 3,14 sombre — au-dessus du seuil 3:1 des graphiques
  non textuels) — la variante que l'artboard des Achats recomposait en détournant l'aide
  de démo `is-active` et en annulant la bordure en inline, 4+ occurrences. Et le même
  nœud est un `<a href>` : `as`/`href` arrivent, jumeaux exacts de ceux de `Button`.
  `Button` n'a pas reçu le jumeau `accent` : le besoin n'est attesté que sur le carré
  d'icône — on promeut au deuxième appelant.
- **`Modal` : la croix et les gestes de fuite sont découplés.** `closeButton={false}`
  retire la croix en gardant Échap et le clic-voile ; `dismissable={false}` fait
  l'inverse. Défauts à `true` : comportement historique inchangé.
- **`EmptyState` : la tuile n'est plus figée.** `tile` reçoit la tuile complète quand
  `panneau brand outlined` ne convient pas ; `icon` garde son rendu d'hier.
- **`Sidebar` : l'espacement inter-groupes.** Chaque section rend un
  `.ds-sidebar__group` ; le gap de la nav sépare les groupes (16px), celui du groupe ses
  entrées (4px). La somme est conservée pour les sections titrées — deux sections SANS
  titre passent de 4 à 16px, c'est le correctif. Seul autre effet visible : le premier
  titre de section ne porte plus 12px de padding mort en tête de nav.
- **`Input` : le champ à unité.** `unit="kg"` pose l'unité dans le champ, à droite, en
  sourdine, `aria-hidden` (le libellé du FormField la nomme). Trois caractères au plus —
  plus long, c'est un suffixe de libellé. Sans `unit`, le DOM d'hier ne bouge pas d'un
  nœud.

### La doctrine entre dans la doc — là où on la lit

En tête de `docs/PROMPTS.md`, au-dessus des cas particuliers : la thèse (« aucune valeur
du socle hors de portée de l'appelant ») et ses **trois formes** — battue par la cascade
(`.accent`, `.mono`) ; hors d'atteinte de la cascade (style inline, nœuds sans classe) ;
atteignable mais non prévue pour varier (`.ds-logo__dot`, dont les quatre mesures sont
ciblables mais que rien n'annonce comme variables — la forme trouvée par Dashboard,
probablement la plus fréquente ; **pas d'API ouverte dessus** : un seul appelant, un seul
contexte, on promeut au deuxième demandeur). Les deux questions de revue : « cette
valeur, l'appelant peut-il la reprendre ? » — et pour la forme 3 : « si oui, le
sait-il ? ». S'y ajoute **la règle du style inline**, remontée de sous `Skeleton` où
elle était enterrée et affûtée en trois cas — légitime (la valeur vient de l'appelant à
chaque rendu), illégitime (il porte un défaut), sans excuse (pas même une prop). S'y
ajoute la règle des **utilitaires de marque** : les huit de `tokens/base.css` vivent en
`layer(base)` et perdent contre les 185 redéclarations de `layer(components)` — la parade
est l'utilitaire Tailwind équivalent sur le même jeton, on ne déplace pas la couche.
`docs/DESIGN.md` § 9 reçoit l'interdit n° 8 (la même règle, format liste de PR).

Le garde-fou **mécanique** étudié — « un paramètre avec défaut qui alimente un
`style={{}}` » — attrape bien `Glyph` et `Spinner` mais aussi `Skeleton` (trois défauts :
width/height/radius) et `Avatar` (`size = '4rem'`) : deux faux positifs sur quatre
composants. Non retenu ; le réflexe de revue reste la protection.

### Reporté, et pourquoi

- **Déclencheur composable de `DatePicker`** : la seule forme composable honnête est un
  render-prop (`trigger?: ({ open, value, toggle }) => ReactNode`), et le câblage du
  retour de focus (Échap, sélection) plus l'ARIA du déclencheur rendent l'API non
  triviale — un mauvais choix coûterait une rupture. À arbitrer avant d'écrire.
- **Manque n° 9 — `Calendar` en plage**, en tête de file pour la prochaine version.
  Périmètre acté : mode plage, deux mois, surlignage des jours intermédiaires,
  présélections externes. Pas dans celle-ci : la version a une thèse, un calendrier de
  plage en ferait un fourre-tout en retardant ce dont Dashboard a besoin. **La parade est
  documentée** dans la section Calendar de PROMPTS.md : les classes `.ds-cal__*` qu'un
  calendrier fait main peut émettre pour hériter des espacements, de la typo et des états
  du socle — c'est le contrat de rendu que Dashboard applique cette semaine.
- Les spans structurels encore inline (`flex:1` du libellé de Dropdown et d'ActionSheet,
  `width:100%` d'un wrapper d'ActionSheet) : de la structure pure, sans valeur de design
  à reprendre — notés, pas touchés.

## 0.17.0 · le lot doc déjà commité — le piège de `.accent`, et deux textes disent le vrai

Commentaires et documentation seuls : aucun jeton, aucune règle CSS, aucun composant ne
change. **Rien ne casse.** Commité en amont (`c33e2b0`), publié avec cette version.

### `.accent` — quatre déclarations solidaires, et rien ne le disait

`.accent` peint le dégradé de marque dans le texte avec quatre déclarations qui ne
fonctionnent qu'ensemble : `background`, `background-clip: text`, `color: transparent`,
`width: fit-content`. Retirez-en une, l'effet disparaît — et **la panne est muette**, le
texte reste lisible.

Or la règle vit en `layer(base)` quand les utilitaires Tailwind vivent en
`layer(utilities)` : posés sur le même nœud, **ils gagnent toujours**, quelle que soit la
spécificité. Le piège a mordu trois fois, dans deux apps : une classe `text-*` de couleur
qui écrase `color: transparent` — le dégradé disparaît, le mot s'affiche en couleur
pleine — et une largeur `w-12` qui écrase `width: fit-content` — le dégradé se peint sur
toute la boîte puis se découpe aux lettres, qui n'en montrent qu'une tranche, et deux
nombres de largeurs différentes n'ont plus la même couleur.

Rien dans le dépôt ne prévenait. Quatre entrées le font désormais : un commentaire au-dessus
de la déclaration dans `tokens/base.css`, l'interdit n° 7 de `docs/DESIGN.md` — et, parce
qu'une règle écrite hors du parcours de lecture ne protège personne, deux lignes au
paragraphe « L'accent est rationné » de `PORTAGE.md` et un avertissement en tête de
`docs/PROMPTS.md`, les deux fichiers qu'un agent lit avant d'écrire un écran.

La règle est calibrée, pas totale. **Dangereux** : couleur, fond, `background-clip`,
dimension — tout ce qui touche l'une des quatre déclarations. **Sans risque** : la
typographie (`font-*`, paliers, `leading-*`), qui n'en touche aucune — quatre des six
usages réels en posent sur le nœud, à raison. La parade, quand une mise en page est
nécessaire : un span externe la porte, le span `.accent` n'en porte pas. `.eyebrow` clippe
le dégradé avec les mêmes quatre déclarations : même piège, même règle.

Un composant `<Accent>` a été étudié et **n'est pas retenu** : il n'aurait couvert qu'une
classe d'une famille de deux, et la classe resterait publique de toute façon. Le
déclencheur est écrit : si le piège mord encore malgré ces quatre textes, on promeut — sur
la **famille**, pas sur `.accent` seule.

**Intention notée, à payer ce jour-là** : la règle vit aussi, recopiée, dans le
`PROJECT-CONTEXT.md` de Dashboard (§ 7), que son agent lit avant ce dépôt. Tant que la
règle est jeune, la redondance protège plus qu'elle ne coûte. Le jour où la formulation
bouge — promotion comprise — le socle devient la source et le `PROJECT-CONTEXT` y
**renvoie** au lieu de recopier, en ne gardant que ce qui est propre à Dashboard. Sans
cette ligne, c'est le genre de dette qu'on découvre en la payant.

### Le commentaire de `--tracking-*: initial` annonçait un faux coût

L'avertissement au-dessus de la ligne, dans `theme.css`, affirmait qu'un mauvais placement
« emporterait la typographie de la marque avec lui ». **C'est faux, et c'est mesuré** :
posée après les jetons, la ligne coûte les **utilitaires** `tracking-*` — tous, y compris
ceux du système — mais les paliers `.text-*` gardent leur interlettrage, qui vient de
`tokens/typography.css` et se résout à l'exécution. Le commentaire reprend la formulation
que le CHANGELOG 0.2.0 du gabarit porte déjà. La ligne, elle, ne bouge pas — l'avertissement
reste, il dit le vrai coût.

### La mesure de 0.16.0 ne se rejoue pas par la chaîne de la vitrine

La section 0.16.0 ci-dessous annonce une mesure « `vite build` de la vitrine, puis lecture
du bundle ». `npx vite build` dans `demo/` passe toujours — la mesure elle-même se rejoue.
Mais **`npm run demo:build` échoue** : la chaîne commence par `tsc --noEmit`, qui tombe sur
**51 × TS2786** — la vitrine épingle `@types/react` 18 quand le paquet est en 19. Défaut
antérieur à 0.16.0 et sans rapport avec elle ; signalé ici plutôt que de laisser une
affirmation que la commande annoncée du dépôt ne peut pas reproduire.

## 0.16.0 — l'échelle d'interlettrage de Tailwind cesse d'exister

Une ligne dans `theme.css`. Aucune prop, aucun composant, aucun jeton retiré : **rien ne
casse**, sauf une classe qu'aucune app n'aurait dû écrire.

**Pour une app consommatrice** : `tracking-tight`, `tracking-wide`, `tracking-widest` et le
reste de l'échelle native **ne génèrent plus rien**. Une app qui en écrit une voit son
interlettrage retomber sur celui du palier de texte — c'est-à-dire le bon.

### Deux vocabulaires, et rien ne disait lequel était le bon

C'est le même traitement que les paliers de texte ont déjà reçu, pour la même raison, et il
manquait ici. L'échelle native de Tailwind est presque entièrement **positive** —
`tracking-wide` vaut +0,025em, `tracking-widest` +0,1em — alors que l'interlettrage de la
display de marque est **négatif** : `--tracking-display` vaut −0,02em.

Les deux vocabulaires cohabitaient dans le même espace de noms. Une app a écrit
`tracking-widest` là où sa maquette demandait `--tracking-display` : **0,12em d'écart, et le
signe inversé**. Ce n'est pas une approximation, c'est le contraire de ce qui était demandé —
et aucune valeur « proche » n'existait dans l'échelle native, donc aucun choix n'était bon.

```css
--tracking-*: initial;   /* dans @theme, AVANT les jetons de la marque */
```

Les neuf jetons du système sont redéclarés juste après et restent seuls disponibles.

### La ligne doit rester où elle est, et le commentaire le dit

`--tracking-*: initial` **efface tout l'espace de noms**. Placée après les neuf jetons, elle
les emporterait avec elle : plus un seul interlettrage dans le système, la typographie de la
marque à plat, et rien pour le signaler à l'écran — un `letter-spacing` vide ne casse pas, il
rend simplement faux. L'avertissement est écrit au-dessus de la déclaration.

**Mesuré sur le CSS livré**, pas déduit — `vite build` de la vitrine, puis lecture du
bundle : zéro classe `.tracking-*` native générée, les **neuf** jetons `--tracking-*` du
système présents avec leur valeur réelle, et les **neuf** références `var(--tracking-*)` du
bundle qui résolvent. `.text-heading` sort bien en
`letter-spacing:var(--tw-tracking,var(--tracking-heading))`, et `--tracking-heading` vaut
`-.01em`.

**Rappel qui rend la classe inutile** : chaque palier porte DÉJÀ son interlettrage, par
`--text-<palier>--letter-spacing`. Une app n'a jamais eu à l'écrire à la main — écrire
`text-display` suffit, et suffisait déjà.

### `README.md` — le compte des gardes était faux

La chaîne de `npm run lint` en enchaîne **dix**, le README en annonçait neuf : `check-literals.sh`
a été branché en fin de chaîne sans que le compte suive. Une doc qui compte faux fait douter
du reste.

## 0.15.0 — le catalogue d'icônes cesse d'être une impasse

Une PROP ajoutée, aucun jeton CSS touché, aucun composant retiré. **Rien ne casse** : tout
code existant qui écrit `<Icon name="…" />` continue de fonctionner à l'identique.

**Pour une app consommatrice** : une icône absente du catalogue n'oblige plus à publier une
version du design system. L'app importe le tracé lucide et le passe en `glyph`.

### Le manque n'était pas dans la librairie, il était dans la porte

Le socle est bâti sur **lucide-react** — environ 1500 tracés disponibles — dont **47** sont
importés à la main dans `Icon.tsx` et typés par `IconName`. Ce jeu curé est une bonne chose :
il se relit, il se documente, il empêche une app de piocher au hasard.

Mais il était FERMÉ. Une app qui avait besoin de `shopping-bag` avait trois issues, toutes
mauvaises : dessiner son propre SVG (ce que la charte interdit — `Icon` est le seul jeu
d'icônes du système), prendre une icône approchante qui ne veut pas dire la même chose, ou
rouvrir le design system et publier une version pour une ligne. C'est arrivé sur Dashboard,
avec deux icônes d'un coup.

Or **le mécanisme existait déjà**, à l'intérieur : `Glyph`, le rendu nu, écrit pour que
l'extension métier affiche ses icônes de plateforme « avec exactement les mêmes règles de
taille et d'épaisseur, sans dupliquer huit lignes ni rouvrir le socle ». Il était interne.
On l'expose, sous la forme d'une prop.

### `name` OU `glyph`, jamais les deux

```tsx
import { ShoppingBag } from 'lucide-react';

<Icon name="folder" />          // le catalogue — la voie normale
<Icon glyph={ShoppingBag} />    // un tracé lucide quelconque
```

`IconProps` devient une **union discriminée** avec `?: never` de part et d'autre. Passer les
deux, ou n'en passer aucun, est une **erreur de compilation** — pas une surprise au rendu où
l'un gagnerait silencieusement sur l'autre. Vérifié dans les deux sens sur un fichier
d'essai : les deux formes valides compilent, les deux formes invalides échouent.

Trois propriétés sont conservées, et ce sont elles qui justifient cette forme plutôt qu'un
simple élargissement du type :

- **le tree-shaking** — l'import reste statique et vit dans l'app, donc seule l'icône
  réellement employée entre dans son bundle ;
- **la cohérence** — le rendu reste celui du socle : grille 24, épaisseur, `aria-hidden`,
  taille en rem. `glyph` ouvre le choix du TRACÉ, jamais la liberté graphique ;
- **le catalogue** — `name` reste la voie normale, et la doc le dit : un besoin qui revient
  dans DEUX apps a vocation à entrer au catalogue plutôt qu'à rester en `glyph`.

### Un détail de typage qui aurait mordu en silence

`GlyphProps` étendait `Omit<IconProps, 'name'>`. Depuis qu'`IconProps` est une union, un
`Omit` dessus ne garde que les clés COMMUNES aux deux branches : `size`, `strokeWidth`,
`className` et `style` auraient disparu de `GlyphProps`, donc de `ContentIconProps`, sans
qu'aucun test ne le dise. Les propriétés partagées sont donc extraites dans **`IconBaseProps`**,
désormais exporté — une app qui écrit un composant relayant des props d'icône en a besoin.

### Porté au template

`design-system-template` reçoit la même API. C'est la règle du dossier : ce qui se porte
systématiquement, c'est l'**API des composants**, pas le traitement visuel. Sans ça, chaque
design system client naîtrait avec un manque déjà comblé ailleurs.

---

## 0.14.0 — la barre respire d'un cran, et l'accueil retrouve une maison

Deux points indépendants. Une icône **ajoutée** au catalogue, aucun jeton CSS ajouté ni
retiré, aucune prop touchée.

**Pour une app consommatrice** : le contenu de toute `Sidebar` recule de **4 px**. Et une
entrée d'accueil qui porte `name="layout-dashboard"` devrait passer à `name="house"` — rien
ne casse si elle ne le fait pas, l'ancienne icône reste au catalogue.

### Le retrait horizontal de la barre remonte d'un cran : 20 → 24 px

La v0.12.0 avait fait passer le bord optique de 40 à 20 px. Le geste était bon, il allait un
cran trop loin : à 20, la colonne est **au ras du bord**.

Une seule déclaration change — `.ds-sidebar` passe à `padding: var(--space-5) var(--space-4)`.
**C'est le retrait de BOÎTE qui bouge, jamais celui du contenu** : les quatre blocs
(`__head`, `__title`, `.ds-sidenav`, `__foot`) restent à `--space-2`. Ces 8 px existent pour
que la pilule de survol dépasse du texte, ce qui est leur seul rôle, et 8 suffisent à le lire.
Le vide de trop était dans la boîte, il se corrige dans la boîte. Le vertical reste
`--space-5`, l'état replié reste `--space-3`.

Le commentaire du bord optique unique dit maintenant **pourquoi le chiffre a bougé deux fois**
— 40, puis 20, puis 24 — pour que ça ne se lise pas comme une hésitation.

Vérifié à 1280, dans les deux thèmes, sur la vitrine : logo, texte du titre de section, icône
d'entrée et avatar de pied tombent tous sur **une seule verticale, à 24 px** du bord.

### Une icône `house`, et c'est elle qui va sur l'accueil

`layout-dashboard` — les quatre tuiles — servait d'icône à l'entrée « Tableau de bord ». Ce
n'est pas ce qu'elle dit : quatre tuiles annoncent une **grille de widgets**, pas la
destination d'accueil d'une app. Une maison le dit en un glyphe, c'est la convention la plus
ancienne de la navigation, et elle ne demande aucun apprentissage.

**`layout-dashboard` reste au catalogue** — elle est juste, pour un vrai tableau de bord. Ce
qui change, c'est l'endroit où on la pose. La règle entre dans les interdits de
`docs/DESIGN.md` : l'entrée d'accueil porte `house`, `layout-dashboard` est réservée à une
grille de widgets.

Les usages basculent dans la démo (deux endroits) et dans `docs/PROMPTS.md`, et l'entrée est
renommée **« Accueil »** au passage — « Tableau de bord » sous une maison serait un libellé
qui contredit son icône.

#### Le glyphe est DESSINÉ dans le socle, pas importé de lucide

Nouveau fichier `src/components/icons/compat-glyphs.ts`, et il ne faut pas le confondre avec
`brand-glyphs.ts` : celui-là existe pour une raison **juridique**, celui-ci pour une raison
**mécanique**.

Le peer déclare `lucide-react: ">=0.400"`. Le glyphe s'appelle `House` depuis son renommage et
`Home` avant. Les deux coexistent sur la version installée ici (0.469) — vérifié — mais **pas
sur toute la plage du peer** : une app en 0.4xx d'avant le renommage n'expose que `Home`, et
une app future peut voir l'alias disparaître. Un import nommé absent n'est pas une erreur
rattrapable : Rollup refuse le module, et c'est le `vite build` de **l'app** qui casse, jamais
le nôtre. Le peer serait redevenu un mensonge, exactement comme avant le sous-lot des icônes
de marque en 0.5.3.

Le fichier ne porte que les **coordonnées** du dessin, relevées au caractère près sur
lucide-react 0.469.0, clés comprises, et reconstruites par `createLucideIcon` — l'usine que
lucide expose de façon stable. Le résultat est un `LucideIcon` ordinaire : vérifié sur la
planche d'inventaire, il rend en 20 × 20, `stroke-width` 2, `viewBox 0 0 24 24`, comme tous
les autres. Contrepartie : ce dessin est à nous, une refonte du glyphe chez lucide ne nous
parviendra plus.

`check-portage.sh` gagne trois points — le retrait de boîte à `--space-4`, le glyphe dessiné
ici, et l'entrée d'accueil sur `house` — et passe de 17 à **20**.

## 0.13.0 — le texte reprend son poids, et la marque a sa tuile pleine

**Changement de rendu pour TOUTES les apps : tout le corps de texte s'épaissit sur macOS.**
Aucune classe retirée, aucune prop cassée, aucun jeton touché. Rien à migrer — mais c'est le
genre de version qu'on regarde à l'écran avant de la propager.

### 1 · `-webkit-font-smoothing` passe de `antialiased` à `auto`

`tokens/base.css` posait `-webkit-font-smoothing: antialiased` sur `body` depuis l'origine.
Le nom trompe, et c'est tout le problème : la valeur **n'ajoute pas** de lissage, elle force
le lissage en **niveaux de gris** à la place du rendu dense par défaut. Les fûts perdent une
fraction de pixel de chaque côté, et **tout le corps de texte descend d'environ un demi-cran
de graisse** sur macOS.

C'est l'une des lignes les plus copiées-collées du web. Elle réglait un défaut de Chrome sur
macOS qui n'existe plus depuis des années ; elle est restée dans à peu près tous les resets,
celui-ci compris.

**Ce qui rendait le défaut difficile à voir** : l'écart est proportionnel à la finesse du
trait. Anton à 22, 29 ou 40 ne bouge presque pas — la maquette et le titrage paraissent
justes. C'est **DM Sans entre 13 et 16** qui perd son poids, c'est-à-dire les libellés, les
champs, les tableaux, les cartes : l'interface entière, partout où on ne la regarde pas
comme une image.

**Et le socle était déjà incohérent d'un navigateur à l'autre** : le jumeau Firefox
`-moz-osx-font-smoothing: grayscale` n'a jamais été posé. Chrome et Safari amincissaient,
Firefox non, sur la même machine. Il n'est toujours pas posé, et il ne doit pas l'être : le
socle ne demande à aucun moteur d'amincir son texte.

`auto` est écrit **explicitement** plutôt que la déclaration retirée : sans elle, quelqu'un
remet `antialiased`. Le commentaire qui l'accompagne dit pourquoi, pour que ce quelqu'un
s'arrête.

`text-rendering: optimizeLegibility`, sur la même ligne, **n'est pas touché** — c'est une
autre question, et deux variables changées ensemble ne s'attribuent plus.

### 2 · `Pastille` prend un ton `brand-solid`

Le socle avait la tuile de marque **douce** (`tone="brand"`, `--grad-soft`) et le bouton de
marque **plein** (`.ds-btn--primary`, `.ds-icon-btn--primary`). Rien entre les deux : une app
qui voulait un carré en dégradé plein **non interactif** devait recomposer le remplissage à
la main, sur trois utilitaires.

`tone="brand-solid"` porte `--brand-gradient` et `--primary-foreground`. En `size="dialogue"`
il est le **jumeau exact d'un `IconButton` `md`** — `--pastille-dialogue` et
`--icon-control-md` valent tous deux 2,625 rem, et les deux prennent `--radius-md`.

**Pourquoi ça compte, et ce n'est pas cosmétique** : un `<button>` posé dans un `<label>` est
du contenu interactif imbriqué, donc du HTML invalide, et le navigateur **ne transmet pas**
l'activation du label depuis cet enfant. Mesuré dans une app : `<button>` → **0** ouverture
du sélecteur de fichier, `<span>` → **1**. Une tuile d'icône interactive au milieu d'une zone
de dépôt rend donc inerte la cible la plus évidente de la zone — invisible à la relecture,
évident à l'usage. `brand-solid` donne l'apparence sans le défaut.

⚠ **Aucune lueur, et c'est délibéré.** Dans ce système la lueur marque ce qui se **presse** :
seuls les deux boutons primaires la portent. Les cinq autres endroits où le dégradé remplit
quelque chose — barre de progression, case à cocher, pastille du radio, piste de
l'interrupteur, jour sélectionné du calendrier — n'en ont aucune, et une `Pastille` ne se
clique jamais. Un appelant qui veut le halo ajoute `shadow-glow` chez lui, en le sachant.

`check-contrast.mjs` mesure le glyphe sur les **trois arrêts** du dégradé, pas sur un aplat,
au seuil de 3 des graphiques non textuels — le même que sa jumelle douce.

## 0.12.0 — la barre latérale se resserre

**Changement de rendu pour toute app qui affiche une `Sidebar`** : elle est plus étroite, et
son contenu est plus près du bord. Rien à migrer — aucune classe, aucune prop, aucun jeton
ajouté ni retiré, aucune API touchée.

### Le `*/` orphelin : VÉRIFIÉ, ABSENT ICI

Le kit maître porte un défaut de syntaxe où le long commentaire précédant `--sidebar-w` se
ferme deux fois : la prose restante devient du CSS brut, le parseur part en récupération
d'erreur en avalant tout jusqu'au premier `;` — c'est-à-dire **la déclaration `--sidebar-w`
elle-même**. La barre tombe alors en `width:auto` et prend la largeur de son contenu, ce qui
ressemble à une barre un peu étroite et jamais à une erreur.

**Ce dépôt n'a pas ce défaut.** Balayage caractère par caractère des douze fichiers CSS du
socle, de la marque et du gabarit : **aucun `*/` orphelin, aucun bloc non fermé**. Et mesuré
dans la vitrine, dans les deux thèmes : `--sidebar-w` résout bien, et `.ds-sidebar` rend son
palier et non la largeur de son contenu.

**`check-token-refs.mjs` attrape déjà ce cas** — vérifié en injectant le défaut exact du
maître, puis en le retirant :

```
✗ token-refs — 1 jeton(s) LU(S) sans être déclaré(s), sur 1 site(s) :
    --sidebar-w  —  1 référence(s)
      src/styles/patterns.css:472
```

Il le voit parce qu'il retire les commentaires avec la **même règle non gourmande** que le
parseur CSS : la prose orpheline reste alors dans le texte, et la déclaration avalée ne
correspond plus au motif ancré `(?:^|[;{}])\s*--x:`. Aucun garde à ajouter — la couverture
existe. À noter tout de même : il ne la voit que parce que `patterns.css` **lit**
`var(--sidebar-w)`. Un jeton avalé que rien ne lit passerait toujours.

### Le retrait horizontal est divisé par deux — 40 px → 20

La barre cumulait deux retraits : `--space-5` de boîte et `--space-4` de contenu, soit **40 px
avant le premier glyphe**. Sur une colonne de 256, c'est 16 % de la largeur en vide de chaque
côté — un couloir dans un couloir.

Le nouveau bord optique est **20 px** : `--space-3` de boîte (12) + `--space-2` de contenu (8).
Les 8 px de contenu ne sont pas décoratifs — ils existent pour que la pilule de survol dépasse
du texte, et c'est leur **seul** rôle. 8 suffisent à le lire ; 16 payaient deux fois.

Cinq déclarations : le `padding` de `.ds-sidebar` (le **vertical reste** à `--space-5`, seul
l'horizontal bouge), puis `.ds-sidebar__head`, `.ds-sidebar__title`, `.ds-sidenav` et
`.ds-sidebar__foot`, qui portent tous le même retrait — c'est la règle du bord optique unique,
inchangée. Les trois règles de l'état replié ne bougent pas : elles retirent le retrait pour
recentrer le logo et les icônes.

Vérifié à 1280, dans les deux thèmes : logo, texte du titre de section, icône d'entrée et
avatar de pied tombent tous sur **une seule verticale, à 20 px** du bord de la barre. Replié :
logo et icône centrés sur le milieu exact des 72 px.

### `--sidebar-w` — nouvelle échelle, 240 → 288

`clamp(17rem,10rem + 7vw,21rem)` → **`clamp(15rem,11rem + 5vw,18rem)`**. La pente reste
**positive** : la barre grandit toujours avec l'écran.

| écran | largeur |
|---|---|
| ≤ 1280 | **240** (plancher) |
| 1600 | 256 |
| 1920 | 272 |
| ≥ 2240 | **288** (plafond) |

**C'est la conséquence du point précédent, pas un goût.** Le retrait divisé par deux rend la
colonne plus efficace de 20 px utiles : elle n'a plus besoin d'être aussi large pour tenir le
libellé le plus long sur une ligne. 336 sur un 27 pouces était déjà généreux avec l'ancien
retrait ; avec le nouveau, c'est un couloir.

Le commentaire garde ce qui reste vrai — pourquoi `rem` + `vw`, la composition avec
`app-scale.css`, et surtout que **c'est le plancher le vrai réglage**, plus encore
qu'avant : 240 gouverne tous les portables et les 13-14 pouces.

Au passage, le § FACULTATIF de `brand.template.css` annonçait encore `clamp(16rem,15vw,23rem)`
comme défaut du socle — la valeur d'avant la 0.10.0. Recalé.

## 0.11.0 — la déduction de surface a un cran de rattrapage

**Aucune rupture. `surface` vaut `auto` par défaut, et `auto` ne pose aucune classe : tout
le code existant rend exactement comme en 0.10.1.** Une app remonte de version pour avoir
l'échappatoire, pas pour réparer quelque chose.

**Le défaut, constaté dans une app et invisible depuis ce dépôt.** La v0.8.0 a posé la
déduction de surface — `.ds-card .ds-btn--secondary { background: var(--background) }` —
parce que `--secondary` est passé au rang de la carte et qu'un bouton secondaire posé sur
une carte aurait sinon 1,009 d'écart avec elle. La règle est juste, et elle prévoit **un
seul niveau d'imbrication** : le bouton posé sur la carte.

Une app qui pose un **panneau `--background` DANS une carte** — une ligne de fichier, une
tuile, un encadré — sort de ce cas : le bouton reçoit `--background`, soit exactement la
couleur du panneau qui le porte, et il n'existe plus à l'écran. Rien ne le signalait ici :
**la vitrine ne posait aucun panneau dans une carte**, et le contraste du bouton contre sa
carte, lui, restait bon. Le symptôme le plus trompeur : le même composant rendu dans un
`<div>` qui *ressemble* à une carte sans en être une s'affichait correctement, et faisait
soupçonner l'app.

**Le correctif est une prop, pas un composant** — `GOVERNANCE.md`, test 4. `Button` et
`IconButton` prennent `surface?: 'auto' | 'page' | 'card'`, **jumelle exacte de celle
qu'`Input` porte depuis la v0.5.0 pour le même problème** :

| valeur | ce qu'elle fait | quand |
|---|---|---|
| `auto` *(défaut)* | aucune classe, la déduction fait son travail | partout, y compris tout le code écrit avant cette version |
| `page` | force `--secondary` | bouton sur un panneau `--background` imbriqué dans une carte |
| `card` | force `--background` | conteneur qui n'a que l'apparence d'une carte, sans être une `.ds-card` |

Sans effet sur `ghost`, `primary` et `danger` : aucun des trois ne porte `--secondary`.
La prop ne ment donc jamais — elle ne change rien là où il n'y a rien à changer.

**Deux sélecteurs, et leur poids est le mécanisme entier.**

```css
.ds-btn--secondary.ds-btn--on-page,.ds-icon-btn--secondary.ds-icon-btn--on-page{background:var(--secondary)}
.ds-btn--secondary.ds-btn--on-card,.ds-icon-btn--secondary.ds-icon-btn--on-card{background:var(--background)}
```

Ils valent **0,2,0** — le même poids que la déduction — et arrivent **après** elle : ils
gagnent. Le survol reste à 0,3,0 et continue de passer devant les deux, donc la réponse au
pointeur est intacte. Écrits en un seul sélecteur de classe, ils repasseraient sous la
déduction et la prop ne ferait rien : c'est écrit à côté de la règle.

**La vitrine pose désormais le cas.** Section `Button`, bloc « Surface » : un panneau
`--background` dans une carte, le bouton en `auto` à côté du même en `page`. Le défaut se
voit en ouvrant la démo, ce qui n'était pas vrai avant cette version.

## 0.10.1 — le socle se contredit sur son propre preflight

**Documentation seule. Aucun changement de rendu, aucune API, aucun jeton, aucune classe —
une app n'a aucune raison de re-épingler.** Il n'y a rien à revoir à l'écran.

Ce n'est pas cosmétique pour autant : trois documents affirmaient encore que « le preflight
est volontairement omis, le design system embarque son propre reset **que le preflight
neutraliserait** ». C'est exactement le raisonnement qui a coûté au socle des mois sans
reset — quelqu'un lit une raison périmée, la croit, et agit dessus.

**`README.md` est le point qui justifie la publication** : c'est la documentation
d'installation, et son § « Ce que `theme.css` règle pour toi » décrivait du code **retiré en
0.10.0** — les deux rustines `border-width:0` / `border-style:solid`. Quelqu'un qui monte le
socle aujourd'hui y lit les instructions d'une version disparue. Il dit maintenant l'état
réel : le socle porte son preflight, et il repose `border-color: var(--border, currentColor)`
dans `tokens/base.css`, dont le cas inverse s'écrit `border-current`.

L'avertissement « supprime ton `@import "tailwindcss";` » **reste valable** — un second
Tailwind amène un second preflight, qui arrive **après** le reset du socle. Mais il est
reformulé en problème d'**ordre**, pas en incompatibilité : « le preflight revient
neutraliser le reset » est la phrase qui a fait retirer le preflight, elle ne doit plus
exister nulle part.

**`theme.css` n'est pas seulement corrigé, il est verrouillé.** Un commentaire neutre
laisserait le prochain lecteur libre d'y ajouter `@import "tailwindcss/preflight.css"` —
c'est-à-dire de rejouer le bug. Il **interdit** le geste et dit pourquoi : `theme.css` et
`core.css` sont deux points d'entrée **indépendants**, l'app les importe séparément et
`theme.css` n'importe pas `core.css`. Un reset posé là-bas n'a donc aucun rapport d'ordre
garanti avec `tokens/base.css` — or le reset du socle ne tient QUE par cet ordre.

Et le piège est pire, **mesuré sur les quatre cas** : un `@import` **sans `layer()`** atterrit
hors couche, et le CSS hors couche l'emporte sur **toutes** les couches, qu'il soit inséré
avant ou après le socle. En `layer(base)`, il ne gagne que s'il vient après. Un preflight
importé depuis `theme.css` sans couche écrase donc h1→h4, les liens et le focus du socle,
**toujours** — c'est très probablement l'observation d'origine, prise à l'époque pour une
incompatibilité alors que c'était un problème d'ordre et de couche.

Les deux autres arguments contre l'import direct — l'import de police avalé, le peer
optionnel — ne sont pas recopiés : `theme.css` renvoie à l'en-tête de `tokens/preflight.css`,
où ils sont écrits une seule fois. Un raisonnement écrit à deux endroits est un raisonnement
qui divergera.

`GETTING-STARTED.md` reçoit la même correction, en plus court.

Les trois corrections sont reportées à l'identique dans `design-system-template`.

## 0.10.0 — le preflight de Tailwind revient, et l'addenda v0.8.0 est appliqué

Le rendu de **tout élément HTML nu** change, dans les deux thèmes. Aucune prop, aucune
classe retirée, aucun jeton ajouté ni retiré. **Aucun composant du système ne bouge d'un
pixel du fait du preflight** — mesuré, voir plus bas. La seconde moitié du lot, elle, déplace
volontairement cinq règles de la barre latérale et deux couleurs d'icône.

> **Ce lot absorbe le contenu prévu pour une « 0.9.1 ».** Cet addenda a été rédigé contre
> `c2ab970` (la 0.9.0) alors que la 0.10.0 était déjà écrite, non publiée et non taguée. Une
> 0.9.1 posée *après* la 0.10.0 serait un numéro qui recule ; comme rien n'a jamais été
> publié sous ce nom, il n'y a aucun trou à combler. Le contenu est donc ici, en entier.

### Ce qui était cassé, et pourquoi la raison écrite ne tenait pas

`theme.css` omettait le preflight, au motif que « le socle embarque son propre reset
(`tokens/base.css`) que le preflight neutraliserait ».

Ce n'était pas une incompatibilité, c'était un problème d'**ordre**. Preflight et `base.css`
vivent tous deux dans `layer(base)` avec des sélecteurs d'éléments : à spécificité égale,
c'est le dernier chargé qui gagne. Chargé AVANT, le preflight normalise et l'identité du
socle repasse par-dessus. Quelqu'un a vraisemblablement vu les titres perdre leur display en
l'activant, a conclu « incompatible », et a retiré — la conclusion était logique, la cause
était l'ordre.

### Ce que l'omission coûtait

`tokens/base.css` couvre box-sizing, `html`, `body`, `h1`→`h4`, `p`, `a`, `:focus-visible`,
`code/pre/kbd/samp`, `img`, `::selection`. N'étaient normalisés **nulle part** :

- l'**apparence** de `button`, `input`, `select`, `textarea`. Un `<button>` nu écrit par une
  app héritait du gris `buttonface`, d'**Arial 13,33px** et d'un rembourrage de 1px 6px. Deux
  composants métier d'une app consommatrice l'ont attrapé à deux lots d'écart sans que
  personne le voie : le symptôme est un écran légèrement faux, jamais une erreur ;
- `ul`, `ol`, `li` — puces et retrait de 40px ;
- `table`, `fieldset`, `legend`, `figure`, `blockquote`, `hr`, `dl`, `dd`, `small`, `h5`, `h6`.

C'est cette **classe** de défauts qui se ferme, pas un cas.

### Le preflight est VERSÉ dans le dépôt, pas importé de `tailwindcss`

`src/styles/tokens/preflight.css` est une copie conforme de `tailwindcss/preflight.css`
(4.3.3), à six déclarations près. `core.css` la charge en `layer(base)` **juste avant**
`tokens/base.css` : même fichier, même couche, l'ordre est garanti par la source et il n'y a
rien à espérer du bundler.

Écrire `@import "tailwindcss/preflight.css"` à la place a été essayé, **et refusé sur
mesure** — deux raisons, chacune suffisante :

1. **L'import distant de la marque disparaissait.** Un specifier `tailwindcss/…` dans
   `core.css` fait réclamer tout l'arbre CSS par le compilateur Tailwind, dont la résolution
   d'`@import` ne laisse pas passer un `@import url(https://…)`. Or c'est par là que le
   fichier de marque charge sa police de texte. Vérifié en dev **et dans le bundle de
   production** : la règle `fonts.googleapis.com` disparaît de la feuille émise et DM Sans
   n'est jamais chargée. Le système rend alors dans sa police de repli — lisible, plausible,
   et faux.
2. **`tailwindcss` est un peer OPTIONNEL.** Une app qui monte le socle sans la couche
   Tailwind ne peut pas résoudre un `tailwindcss/…`. Le reset du socle ne peut pas dépendre
   d'un paquet facultatif.

Les six déclarations retirées de la copie sont les `font-family`, `font-feature-settings` et
`font-variation-settings` de `html,:host` et de `code,kbd,samp,pre` : toutes bâties sur
`--theme(…)`, une fonction que seul le compilateur Tailwind résout. `tokens/base.css` repose
ces deux familles depuis les jetons de marque quelques lignes plus loin, et une pile de
polices littérale n'a pas sa place dans le socle.

### Le relevé avant / après

Banc d'essai de **90 éléments** — nus et composants du socle, montés sur leur balise réelle
— × **2 thèmes** × **2 largeurs** (1811px et 900px, de part et d'autre du point de rupture),
sur 34 propriétés calculées plus la hauteur rendue.

**Zéro hauteur déplacée sur un composant du système.** Les différences résiduelles sont
toutes des propriétés calculées sans effet géométrique, et chacune est voulue :

| ce qui change | où | pourquoi c'est bon |
|---|---|---|
| `appearance: auto → button` | les 12 composants bâtis sur `<button>` | le correctif iOS du rayon de bordure ; aucun effet de peinture |
| `background-color: buttonface → transparent`, `color: black → --foreground` | `.ds-btn--sm` / `--lg` **sans classe de variante** | le bug lui-même, sur un chemin latent : `<Button>` émet toujours une variante (`defaultVariants`) |
| `font-family: Arial → --font-body`, `13,33px → 16px` | `.ds-icon-btn`, `.ds-modal__close`, `.ds-toast__close`, `.ds-sidebar__toggle`, `.ds-cal__nav` | boutons-icône à boîte fixe : hauteur inchangée, et la police cesse d'être Arial le jour où l'un d'eux porte un caractère |
| `line-height: normal → hérité` | `.ds-page`, `.ds-cal__day`, `.ds-actionsheet__item`, `.ds-sidenav` | boîtes calées par un `min-height` ou une hauteur fixe : géométrie inchangée. Effet de bord bienvenu — les rendus `<a>` et `<button>` de `.ds-sidenav`, qui divergeaient, s'accordent |
| `padding: 1px 6px → 0` | `.ds-cal__day`, `.ds-modal__close`, `.ds-cal__nav` | rembourrage natif retiré ; ces trois-là sont des `inline-flex` centrés à taille fixe |
| `resize: both → vertical` | `.ds-input` seul sur un `<textarea>` | `.ds-textarea` posait déjà `vertical` |
| `color` de `.ds-sep` | `<hr class="ds-sep">` | la règle pose `border:0` et un `background` : la propriété est inerte |

### Trois composants ont vraiment bougé, et ils sont réparés

Le preflight fait hériter police **et interligne** aux contrôles natifs (`font: inherit`).
Trois règles du socle n'avaient jamais déclaré de `line-height` : elles reposaient **en
silence** sur le `normal` du navigateur, et se sont mises à suivre `--leading-body`.

- `.ds-input` : **44 → 47px sous 64rem**, là où le rail tactile vaut 44 — donc désaligné du
  bouton posé à côté, ce que le rail unique existe précisément pour empêcher ;
- `.ds-tab` : 36 → 39px ;
- `.ds-dropdown__item` : 38 → 41px.

Les trois déclarent maintenant `line-height: normal` : la dépendance devient **explicite** au
lieu de dériver avec l'interligne du corps de texte. `.ds-btn` déclarait déjà la sienne
(`line-height: 1`), `.ds-textarea` la sienne (`--leading-normal`).

### Les deux rustines de `theme.css` sont retirées

`theme.css` restaurait à la main deux morceaux du preflight — `border-width: 0` et
`border-style: solid` sur `*`. Le preflight les repose (`border: 0 solid`) : elles sont
redondantes, et une réparation qui survit à son problème finit par être « corrigée » dans le
mauvais sens.

**⚠ La troisième ligne du même bloc partait avec elles, et elle n'était PAS redondante** :
`border-color: var(--border)`. Le preflight v4 laisse `currentColor` — c'est un changement
assumé d'amont entre Tailwind v3 et v4. Conséquence pour une app : `className="border"`
**sans** classe de couleur donne désormais une bordure de la couleur du texte, pas `--border`.
Aucun composant du système n'est concerné (tous posent leur `border-color` explicitement),
mais une app qui s'appuyait sur ce défaut doit écrire `border border-border`.

### Pour les apps consommatrices

Les classes défensives posées sur les `<button>` nus pour compenser ce défaut —
`bg-transparent`, `font-body`, `py-0` et apparentées — **deviennent redondantes** et peuvent
être retirées au prochain bump.

### La couleur de bordure par défaut est reposée par le socle

C'est la suite directe du point précédent, et elle renverse la conclusion de la première
version de ce lot. `tokens/base.css` repose le défaut, tout en haut :

```css
*,::after,::before,::backdrop,::file-selector-button{border-color:var(--border,currentColor)}
```

Deux raisons. **La doctrine** : le socle fournit les valeurs, l'app écrit les noms — un
défaut `currentColor` dit l'inverse, il fait dépendre la bordure d'une propriété de texte que
l'app n'a pas choisie pour ça. **Le mode de panne est silencieux** : sur une page crème à
encre sombre, un `border` nu trace un filet quasi noir là où on attendait le gris doux de
`--border`.

La liste des cinq sélecteurs recopie celle du preflight, sinon un élément échapperait au
défaut. Le cas rare — une bordure qui suit la couleur du texte — s'écrit `border-current`, un
mot, et c'est bien lui qui doit coûter les mots ; vérifié : l'utilitaire l'emporte, les
couches le placent au-dessus de `layer(base)`. Le repli `currentColor` n'est pas décoratif :
un socle monté **sans** fichier de marque retrouve exactement le comportement d'amont.

Aucun composant du système n'est concerné — vérifié règle par règle, aucune ne pose une
largeur de bordure sans poser sa couleur.

### `check-preflight-drift.mjs` — le dixième garde

La copie versée est figée à Tailwind 4.3.3, et son en-tête prescrit une *procédure écrite*
pour suivre les montées. Ce dépôt a déjà établi qu'une procédure écrite ne tient pas — c'est
littéralement pourquoi `check-version.mjs` existe, après trois oublis de suite. Le onzième
mois, Tailwind passe en 4.5, la copie ne bouge pas, et personne ne le sait.

Le garde compare la copie à `node_modules/tailwindcss/preflight.css`, coupes et commentaires
retirés des deux côtés : ce qui compte est qu'aucune **déclaration** n'ait bougé. La version
attendue est lue dans l'en-tête de la copie — un numéro noté à deux endroits est un numéro
qui divergera.

**Il n'échoue jamais**, `exit 0` dans tous les cas, et c'est délibéré : une montée de
Tailwind est légitime, l'arbitrage est humain, et `tailwindcss` est un peer **optionnel** —
un garde bloquant sur un paquet facultatif casserait la CI pour la mauvaise raison. Sa valeur
est de rendre la dérive **visible**, pas de l'interdire.

`check-portage.sh` gagne les deux points que ce lot pose et passe de 15 à **17**. Son point
« icône de nav active » est recalé sur `--primary` — il a d'ailleurs attrapé le changement
tout seul, ce qui est exactement son métier.

`check-token-refs.mjs` gagne une échappatoire jumelle, `@tokenref-fallback:` : sans elle il
répétait à chaque `lint` qu'un repli « pérennise le trou » sur la ligne où le repli **est** la
décision. Un garde qui a tort une fois par jour finit par être ignoré.

---

## L'addenda v0.8.0, appliqué

Quatre points étaient restés dans leur état d'avant.

### La pente de `--sidebar-w` était inopérante

`clamp(16rem,15vw,23rem)` → **`clamp(17rem,10rem + 7vw,21rem)`** (272 → 336).

En `15vw` pur, un écran de 1440 donne 216px — **sous le plancher**. La barre restait donc
figée à 256 sur tous les écrans de bureau courants, et n'atteignait son plafond de 368
qu'au-delà de 2450, où elle est devenue un couloir vide : le `clamp()` ne servait à rien dans
la plage où vivent les écrans réels.

La forme « base en rem + pente en vw » décolle vers 1600. Mesuré : **272** jusqu'à 1600,
**294** à 1920, **328** à 2400, **336** au-delà de 2514. Le plancher monte, le plafond
descend — l'écart utile se resserre là où les écrans existent.

Le commentaire dit maintenant ce qui manquait : **c'est le plancher le vrai réglage**, pas le
plafond, parce qu'il gouverne tous les écrans de bureau courants. Sans cette phrase, quelqu'un
ajuste le plafond en croyant agir sur ce qu'il voit.

### Un seul bord optique gauche dans la barre latérale

Une entrée porte `padding: 0 var(--space-4)` pour que sa pilule de survol dépasse du texte.
L'en-tête n'a pas de pilule, donc n'avait pas de retrait : **le logo commençait 16px à gauche
des icônes qu'il surplombe.** L'en-tête, le titre de section et le pied reprennent le retrait
de l'entrée.

C'est le bord du **contenu**, pas celui de la boîte : la marge extérieure de la barre
(`--space-5`) ne bouge pas, ces retraits s'y ajoutent. **Le retrait doit rester égal à celui
de `.ds-sidenav`** — si l'un bouge, les autres suivent.

Deux décalages fermés au passage : le **titre de section** était à `--space-3`, soit 4px à
gauche des entrées qu'il coiffe — assez petit pour ne pas se voir, assez grand pour salir la
colonne ; et l'**avatar du pied**, qui ne s'alignait sur rien. En replié, l'en-tête et le pied
perdent ce retrait comme l'entrée le fait déjà, sinon le logo se décentre.

Vérifié à 1280 : logo, titre de section, icône d'entrée et pied tous à **167px** — une seule
verticale. Replié : logo et icône centrés sur le milieu de la barre.

### Les deux icônes de marque passent sur `--primary`

```css
.ds-sidenav.is-active svg{color:var(--primary)}   /* était --brand-via */
.ds-pastille--brand{background:var(--grad-soft);color:var(--primary)}
```

L'icône d'item actif passe de **2,32 à 3,00:1** en clair (3,78 en sombre), la pastille de
**2,34 à 3,08** (3,14 en sombre). Les deux atteignent le seuil des graphiques non textuels :
**les deux cessent d'être des écarts assumés**, et le bloc `@a11y-assume` de la pastille est
retiré plutôt que mis à jour — un bloc qui survit à sa raison d'être fait croire à un problème
qui n'existe plus. Le compte passe de **14 à 13**.

*Contrepartie assumée* : en sombre, `--primary` est plus dense que `--brand-via` sur la
plaque. La marque gagne en densité ce qu'elle perd en éclat. Repli si l'écart déplaît :
`--primary-readable` (5,16 / 5,62).

La règle consolidée est écrite une fois, au-dessus de `.ds-pastille--brand`, et reprise dans
`docs/accessibilite.md` § 1.1 — une icône se colore selon **ce qu'elle porte** : décorative →
`currentColor` ; décorative mais de marque → `--primary` ; porteuse d'information →
`--primary-readable`. **Ces deux emplois sont les seuls** où `--primary` touche du non-texte.
Et **les tons sémantiques ne suivent pas** : `success` / `warning` / `danger` gardent leur
couleur lisible, parce qu'ils portent un statut.

### La pastille du logo grossit

`0.21em` → **`0.26em`**, marge gauche `0.07` → `0.08em`, marge basse `0.03` → `0.02em`. À
0,21 elle se lisait comme un **point de ponctuation** plutôt que comme une marque. Tout est en
`em` : elle suit le corps du mot-marque à toutes les tailles, de 16px dans une barre latérale à
108px sur la tuile de marque. Le rayon reste à 25 % du côté — un carré à coins adoucis, jamais
un cercle.

---

Le correctif preflight est également appliqué à `design-system-template`, pour qu'un design
system client ne naisse pas avec un bug déjà corrigé ailleurs.

## 0.9.0 — l'icône d'une pastille de marque est décorative

Un jeton lu, une règle changée, et la doctrine qui va avec.

```css
.ds-pastille--brand{background:var(--grad-soft);color:var(--brand-via)}  /* était --primary-readable */
```

`--primary-readable` (`#b23a1c`) y sortait à **5,30** — le seuil était tenu — mais un
brun-brique sombre sur un lavis chaud se lit comme de l'encre colorée plutôt que comme la
marque. C'est le plus visible dans un état vide, où la pastille fait 80 px.

### La règle, et elle vaut partout

Une icône se colore selon ce qu'elle **porte**, pas selon l'endroit où elle est :

| l'icône est… | sa couleur | exemples |
|---|---|---|
| décorative | `currentColor` | elle suit son texte |
| décorative mais **de marque** | `--brand-via` | pastille d'état vide, pastille d'en-tête de carte, icône de l'item de nav actif |
| **porteuse d'information** | `--primary-readable` | message d'erreur, jour courant, état |

`--primary` n'est **jamais** une couleur d'icône : 3,00 sur `--surface-alt`, 3,03 sur un
lavis de marque. Il reste un aplat — CTA, piste de switch, case cochée.

**Les tons sémantiques ne suivent PAS.** `success`, `warning`, `danger`, `coral`, `amber`,
`neutral` gardent leur couleur lisible : une pastille de statut porte une information. C'est
toute la différence entre décorer et informer, et c'est la ligne qu'on cassera un jour en
voulant « harmoniser ».

### L'écart mesuré

**2,34 à 2,38** en clair selon l'arrêt du lavis, **4,07 à 4,85** en sombre. Sous 3:1 en
clair, et c'est admis : un graphique purement décoratif n'a pas de seuil à tenir, précisément
parce qu'il ne porte rien seul — le titre et la description disent tout.

`check-contrast.mjs` scannait cette paire avec `--primary-readable` en dur. La paire mesurée
suit maintenant ce que le CSS peint (`--brand-via`) — un garde qui mesure une couleur que
plus personne n'affiche est pire qu'un garde absent — et l'écart est déclaré par un
`@a11y-assume` dans le fichier de marque. Le compte passe de **13 à 14**.

### `docs/accessibilite.md` rattrape la v0.8.0

Le document portait encore les ratios d'avant la 0.8.0 : `--ring` à 3,12, le remplissage du
champ à 1,12, « le seul blanc pur du thème clair ». Les deux tableaux sont **régénérés**
depuis `node check-contrast.mjs --table`, les comptes corrigés (36 conformes, 14 assumées),
et deux sections manquantes ajoutées — **3.4** l'anneau de focus, **3.5** l'icône décorative
de marque. La règle de coloration des icônes entre aussi dans `docs/DESIGN.md` et la fiche
`Pastille` de `docs/PROMPTS.md`.

Aucun jeton ajouté ni retiré, aucune prop touchée, contrat inchangé : **54 / 32**.

## 0.8.0 — les surfaces sortent du blanc, les marges respirent, un neuvième garde

Le rendu de **tout ce qui est posé sur la mise en page** change, dans les deux thèmes.
Aucune prop publique de composant n'est retirée sauf une, listée en rupture ci-dessous.

### Le blanc pur quitte les surfaces

`--secondary` — le remplissage du bouton secondaire, de la navbar, de la barre latérale, de
la barre d'onglets, de la pagination, des champs et des barres de recherche — passe de
`#ffffff` à **`#fbf8f3`** en clair et de `#37352f` à **`#2b2a28`** en sombre. Sur une page
crème, un champ de recherche en blanc pur ne se posait pas dessus : il tranchait.

En sombre, `--secondary` prend la valeur **exacte** de `--card`. Une barre latérale et les
cartes posées à sa droite sont la même hauteur de plan ; ce qui les sépare est le filet et
la mise en page, pas un troisième ton. Effet de bord réparé au passage : à `#37352f`,
`--secondary` était plus CLAIR que `--surface-alt`, donc un survol sur la barre latérale ou
un item de menu **assombrissait** la surface — l'inverse de ce qu'un survol doit faire en
thème sombre. Il l'éclaircit maintenant.

L'échelle des surfaces, après ce lot :

```
clair   muted #f1ece4 < surface-alt #f6ede2 < background #f6f2ec < card #faf7f2
        < secondary #fbf8f3 < popover #fdfbf8
sombre  background #1f1e1c < muted #262523 < card = secondary #2b2a28
        < popover #302e2b < surface-alt #32302d
```

### Un contrôle déduit sa porteuse

C'est la contrepartie indispensable du point précédent. Un bouton secondaire posé dans une
carte aurait eu **1,009** d'écart avec elle — invisible. Il bascule sur `--background` :
**1,044** en clair, **1,162** en sombre. La doctrine, déjà appliquée au champ et à la barre
d'onglets, couvre maintenant **quatre familles** : champ, barre d'onglets, menu déroulant,
bouton secondaire. Une surface se lit à son écart avec ce qui la porte, jamais dans l'absolu.

### Ce qui déroule sous un champ s'aligne sur lui

`.ds-dropdown`, `.ds-datepicker__pop` et `.ds-cal` passent de `--popover` à `--secondary` :
ils sont la continuation visuelle du contrôle qui les ouvre, et sur `--popover` ils étaient
un cran plus clairs que leur propre champ. **Posés dans une carte ou une modale, ils
retombent sur `--popover`** et continuent de flotter. `.ds-modal` et `.ds-actionsheet`
restent sur `--popover` : une modale est une grande plaque qui flotte au-dessus de tout,
pas la continuation d'un champ.

### Le focus du champ : un trait, plus un halo

Le champ recevait à la fois l'`outline` générique de `tokens/base.css` (2px, décalé de 2px)
ET son bord en `--ring` : deux traits concentriques autour du même contrôle. L'outline est
neutralisé **sur `.ds-input` seulement** ; partout ailleurs il reste le seul marqueur.

`--ring` passe de `--primary` (`#e85d2f`) à **`--brand-via` (`#f08029`)**, l'arrêt médian du
dégradé — décision de marque, prise en connaissance de la mesure : 2,41:1 sur la page, sous
le plancher de 3:1. Le halo de 3px, le même que celui des boutons, rend en **surface** ce
que le trait perd en contraste. **Ne pas le retirer sans remonter `--ring` à `--brand-to`.**
En sombre `--ring` ne bouge pas (`#f5a524`, 8,16).

### Les marges intérieures prennent un cran

`--card-pad` 24 → **28**, `--card-pad-lg` 28 → **32**. La modale prend le **même** padding
que la carte, et par le même jeton : deux surfaces de contenu, un seul levier.
Toast `1rem 1.125rem`, bandeau `1.125rem 1.25rem`, champ `0.6875rem 1rem` (l'horizontal
seul — la hauteur reste gouvernée par `--control-md`), item de menu `0.625rem 0.8125rem`,
barre latérale `--space-5`, entrée de nav `0 --space-4`. `.ds-card--flush` reste à 0 : les
tableaux à ras gardent leur densité.

`--space-5` n'est **pas** augmenté, et c'est délibéré : il porte la gouttière du voile, le
gap de la navbar, le plancher de safe-area et la gouttière de `.page` — quatre rôles qui ne
sont pas des marges intérieures.

### Toast et bandeau centrent leur contenu

`align-items` passe de `flex-start` à `center`. En `flex-start`, la pastille et la croix de
fermeture se collaient au haut du bloc : sur un message à deux lignes ça se lit comme un
défaut d'alignement. Le nudge optique d'1px de `.ds-banner__icon` disparaît avec la raison
qui le justifiait. *Contrepartie acceptée* : sur une description de trois lignes ou plus,
l'icône se trouve au milieu du bloc plutôt qu'en regard du titre.

### La barre latérale suit la fenêtre

`--sidebar-w` : `16rem` fixe → **`clamp(16rem,15vw,23rem)`** (256 → 368). 16rem est la bonne
largeur sur un portable et une bande étriquée sur un 27 pouces. C'est le **seul jeton du
socle qui mêle `rem` et `vw`**, et c'est assumé : une largeur de couloir doit suivre la
FENÊTRE, pas la préférence de taille de texte. Les paliers de `app-scale.css` agissent sur
la racine, donc sur le plancher et le plafond en rem — les deux mécanismes se composent.

`--sidenav-h` : 40 → **44**. L'entrée de navigation, cible la plus cliquée d'une coque
d'outil, était sous le seuil tactile que le reste du système tient déjà. Son rayon passe de
`--radius-sm` à `--radius-md` : à 44 de haut, la pilule active a la place de se lire comme
une pilule.

### ⚠ Rupture — plus de séparateur dans `ActionSheet`

L'item `separator` de `ActionSheetItem` est **retiré**, avec la règle
`.ds-actionsheet__sep` et le `<hr>` que le composant émettait avant « Annuler ». Une feuille
du bas est haute, aérée, parcourue au pouce : le rythme des lignes suffit, et l'action
destructrice se signale déjà par sa couleur. **`Dropdown` garde le sien** — il est dense,
survolé à la souris, et le filet y sépare l'action destructrice du reste.

*Migration* : retirer les entrées `{ separator: true }` des `items` d'un `ActionSheet`.
TypeScript signale les occurrences restantes.

### Neuvième garde — `check-token-refs.mjs`

Tout `var(--x)` lu par le CSS du système ou par un style inline de composant doit
correspondre à un `--x:` déclaré. Il est branché **en tête** de `npm run lint` : c'est le
moins cher, et un jeton manquant rend le diagnostic des autres trompeur.

**Le défaut qu'il ferme.** Un portage a livré un `patterns.css` qui lisait
`var(--text-body-sm)` en treize endroits sans que le jeton soit déclaré. Un `var()` non
résolu ne rend pas la déclaration « ignorée », il la rend **invalide at computed-value
time** — ce qui, pour `font-size`, signifie `inherit`. `.ds-btn--sm` héritait donc le corps
de texte du parent (16px) au lieu du `--text-control` de `.ds-btn` (15px) : le bouton
`size="sm"` rendait plus **gros** qu'un `md`. Les huit autres gardes mesurent des valeurs ou
une complétude de liste ; aucun ne vérifiait que ce que le CSS *lit* existe.

`theme.css` est **exclu** du balayage des déclarations, et toute déclaration valant
exactement `var(--<même-nom>)` est ignorée où qu'elle soit : le pont Tailwind y écrit
`--text-body-sm: var(--text-body-sm)`, et un scanner naïf y verrait une déclaration —
il passerait au vert sur le bug exact qu'il doit attraper. Pas de détection de jeton mort :
les alias historiques sont déclarés exprès sans consommateur.

`var(--x, repli)` n'est pas une erreur mais sort en ligne `⚠ fallback`. Échappatoire, raison
obligatoire : `/* @tokenref-assume: --x — qui le fournit, et pourquoi pas nous */`.

### Écarts assumés

Le compte de `check-contrast` passe de **12 à 13** (`anneau de focus --ring sur
--background`). `check-surfaces` porte désormais **deux `@surface-assume`** — `--secondary /
--card` en clair (1,009) et en sombre (1,000) : le garde mesure chaque paire **par thème**,
la clé d'un écart assumé nomme donc son thème. Contrat inchangé : **54 / 32**, aucun jeton
ajouté ni retiré.

## 0.7.2 — `Sidebar` porte des entrées en pied

Nouvelle prop `footerItems`, de même forme que les entrées de `sections`.

**Le manque qu'elle comble.** Le slot `footer` est une rangée horizontale à filet haut,
calibrée pour « avatar + nom ». Une app qui veut y poser une déconnexion ou un accès aux
réglages devait donc redessiner elle-même l'apparence d'une entrée — c'est-à-dire s'appuyer
sur `.ds-sidenav`, une classe **interne** que le socle peut renommer sans prévenir. Le
besoin est pourtant universel : toute coque d'outil pose en bas ce qui n'est pas une
destination de contenu.

Les entrées de pied empruntent **le même rendu** que celles de la navigation — même classe,
même état actif, même `linkAs`. Le rendu d'une entrée a été extrait en une fonction unique
que les deux traversent : elles ne *peuvent* plus diverger, et c'est le point.

Nouveau `.ds-sidebar__footnav` : une colonne d'entrées séparée par un filet, distincte de
`.ds-sidebar__foot` qui reste la rangée « avatar + nom ». Les deux cohabitent.

Aucune app existante n'est affectée : sans `footerItems`, le rendu est identique.

## 0.7.1 — `Sidebar` accepte le lien d'un routeur client

Nouvelle prop `linkAs` sur `Sidebar`. Défaut inchangé : `'a'`.

**Le mur qu'elle abat.** Une entrée portant un `href` était rendue en `<a href>` nu. Dans
une app à routeur client — react-router, TanStack Router — chaque clic **rechargeait la page
entière**. Il ne restait qu'à passer `onClick` sans `href`, ce qui rend un `<button>` : la
navigation fonctionne, mais l'entrée cesse d'être un lien — plus de clic-milieu, plus
d'« ouvrir dans un onglet », et un lecteur d'écran annonce un bouton là où il devrait
annoncer un lien.

Le composant était donc inutilisable dans son cas d'usage principal, et chaque app finissait
par réécrire sa barre — ce qui vide un design system de son sens.

```tsx
<Sidebar linkAs={NavLink} sections={[{ items: [{ label: 'Accueil', href: '/' }] }]} />
```

`href` arrive au composant en **`to`**, la prop que ces routeurs attendent tous.
`className`, `aria-current` et l'état actif restent calculés par le socle : il garde la main
sur l'apparence et l'accessibilité, l'app ne fournit que la mécanique de navigation.

Aucune app existante n'est affectée : sans `linkAs`, le rendu est identique.

## 0.7.0 — le dégradé partout où la marque se remplit, et la barre latérale qui colle

### Cinq remplissages passent de l'aplat au dégradé

`--primary` remplissait encore la case à cocher (cochée et indéterminée), la pastille du
radio, la piste de l'interrupteur, et le jour sélectionné du calendrier. Tous portent
désormais `--brand-gradient`.

C'est la suite directe de la 0.6.0, et la même doctrine — celle que la marque énonce
elle-même : « `--primary` est une couleur de REMPLISSAGE. Le CTA réel porte
`--brand-gradient`, pas cet aplat. » Le socle l'appliquait aux boutons, puis à la barre de
progression ; il la tient maintenant partout où un contrôle se remplit de la marque.
L'aplat reste ce que la marque dit qu'il est : un repli et une piste.

Le contour des cases cochées passe à `--brand-to`, l'arrêt le plus soutenu — un contour
dégradé sur 1 px ne se lirait pas.

### La barre latérale colle, au-dessus du seuil mobile

`.ds-appshell` est une grille en `align-items:stretch` : la cellule de la barre s'étirait à
la hauteur du **document**. Sur une page longue, le logo et la navigation sortaient donc de
l'écran au défilement — ce qu'une coque d'outil ne doit pas faire, et ce qui forçait les
apps à réécrire leur propre barre.

Au-dessus de 64,0625 rem, `.ds-sidebar` est désormais `position:sticky; top:0;
height:100dvh; align-self:start`. **`align-self:start` est indispensable** : le `stretch` de
la grille annulerait le `sticky` sans lui. Le document continue de défiler normalement, ce
qui laisse fonctionner les barres `sticky top-0` des écrans sans compensation de décalage.
Sous le seuil, la barre redevient un tiroir, inchangée.

### L'icône de l'item de nav actif porte `--brand-via`

Elle était en `--primary-readable`. Elle porte l'arrêt **médian** du dégradé.

⚠️ **Écart de contraste assumé et mesuré : 2,29:1 en clair, 5,34:1 en sombre.** En thème
clair l'icône est donc pâle — c'est un choix de marque, pas un oubli, et il est écrit en
regard de la règle. Ce qui le rend tenable : l'état actif est déjà porté par le **fond** et
par la **graisse** du libellé, lequel reste en `--foreground`. L'icône est un renfort
décoratif, jamais le seul porteur de l'information. Repli si l'écart déplaît :
`--primary-readable` (5,09).

## 0.6.0 — la barre de progression porte le dégradé de marque

`.ds-progress__bar` remplissait en `--primary`, un aplat. Il porte désormais
`--brand-gradient`.

**Ce n'est pas un goût, c'est la doctrine que la marque énonce déjà elle-même**, dans
`brand-julien-fernandes.css` : « `--primary` est une couleur de REMPLISSAGE. Le CTA réel
porte `--brand-gradient`, pas cet aplat ; l'aplat sert de repli et de piste de switch. »
Le socle l'appliquait à `.ds-btn--primary` et `.ds-icon-btn--primary`, et l'avait oubliée
sur la barre — l'endroit où une marque raconte le plus : l'avancement.

La **piste** reste `--surface-alt`. C'est un creux, pas une surface de marque.

**Changement visuel pour toute app qui affiche une `Progress`** — d'où le bump mineur et non
un patch. Aucun changement d'API : ni prop, ni variante. `--brand-gradient` est calculé par
le socle depuis les arrêts de la marque, il est donc toujours disponible.

## 0.5.5 — `app-scale.css` ne retouche plus aucun palier typographique

La 0.5.4 faisait descendre dans le socle un grossissement de trois paliers de métadonnée
au-delà de 2400 px. **Le bon endroit, mais la mauvaise règle.**

Tout étant en `rem`, changer la racine suffit : l'interface entière suit. Retoucher trois
paliers par bande revenait à dire que le facteur d'échelle ne fait pas son travail — et à
réintroduire, palier par palier, exactement le responsive que le `rem` sert à éviter.

Le réglage venait d'un constat fait **à l'œil, sur un 30 pouces, avec une autre app et un
autre design system**, jamais revérifié depuis. Une règle de système ne se fonde pas sur une
observation qu'on ne peut plus reproduire.

**Ce qui reste, et qui est légitime : le seuil mobile à 64 rem.** Il répond à des contraintes
que le `rem` ne peut pas résoudre — la largeur physique d'un écran et la taille d'un doigt.
Un titre de 40 px sur un téléphone de 390 px passe à la ligne quatre fois quelle que soit la
racine. C'est le même seuil que celui de l'`ActionSheet`, de la `Modal` en feuille du bas, du
scrim de l'`AppShell` et des cibles tactiles à 44 px : une seule décision, cinq endroits
cohérents.

`app-scale.css` ne contient donc plus que ses quatre bandes de zoom. Si un palier paraît un
jour réellement trop discret sur un très grand écran, il se corrigera ici — sur une
observation reproductible.

## 0.5.4 — le grossissement typographique de la bande haute rentre dans le socle

`app-scale.css` crée quatre paliers de zoom, dont une bande au-delà de 2400 px. Trois
paliers de **métadonnée** — `eyebrow`, `subheading`, `caption` — y grossissent d'un cran :
un facteur d'échelle global les laisse proportionnellement trop discrets sur un très grand
écran, là où le corps de texte, lui, est déjà à la bonne taille.

**Ce réglage vivait dans le CSS d'une app.** C'était une erreur de couche : redéfinir
`--text-caption` depuis l'app, c'est modifier le design system par la cascade au lieu de le
modifier par son fichier — même violation de la règle « le DS est en lecture seule », avec
un détour de plus. Une app **déclare** des jetons sous des noms qui lui appartiennent ; elle
n'en **redéfinit** jamais un qui existe déjà ici.

Et c'est dans `app-scale.css`, pas dans `tokens/typography.css`, parce que le grossissement
est la **conséquence** de la bande que ce fichier crée. Les séparer laisserait une app
importer le zoom sans sa contrepartie : une interface agrandie dont les plus petits paliers
seraient restés en arrière.

**Ne bougent pas, délibérément** : `body`, `body-lg`, `control`, `heading`, `heading-xl`.
Interligne et interlettrage ne sont pas redéclarés — sans unité ou en `em`, ils suivent la
taille d'eux-mêmes.

Aucun changement pour une app qui n'importe pas `app-scale.css` : il reste opt-in.

## 0.5.3 — le paquet se construit avec lucide v1

`Icon` importait `Github` de lucide-react, et `brand-content` importait `Youtube` et
`Instagram`. **lucide-react a retiré toutes ses icônes de marque en v1** — décision
juridique, pas régression : ces logos sont des marques déposées.

Ces imports étant au niveau du **module**, le bundle du paquet cassait chez toute app en
lucide v1, y compris une app qui ne s'en sert jamais :
`MISSING_EXPORT "Github" is not exported by lucide-react`. Le peer `lucide-react: ">=0.400"`
était devenu faux, et le symptôme n'apparaissait qu'au `vite build` de l'app — jamais ici,
où le dépôt est en 0.469.

**Le correctif.** Les trois tracés sont désormais écrits dans le socle
(`src/components/icons/brand-glyphs.ts`) et reconstruits par `createLucideIcon`, l'usine que
lucide expose toujours. **Aucune bibliothèque ajoutée** : ce sont les coordonnées, relevées
sur lucide 0.469, la dernière version à les livrer. Le résultat reste un `LucideIcon`
ordinaire, qui traverse le même `Glyph` — mêmes règles de taille et d'épaisseur.

**L'API publique ne bouge pas** : `<Icon name="github" />` et `ContentIcon` fonctionnent à
l'identique. Le peer redevient vrai — le socle marche avec n'importe quelle version de lucide.

Contrepartie assumée : ces trois dessins sont à nous. Si une de ces marques change son logo,
c'est ici qu'on le met à jour ; aucune mise à jour de lucide ne le fera plus.

## 0.5.2 — useModalSurface aligné sur les types React 19

`useModalSurface` annotait son retour `RefObject<HTMLDivElement>` ; depuis
`@types/react` 19, `useRef<T>(null)` rend `RefObject<T | null>` et l'annotation ne
compile plus sous 19. Élargie en `RefObject<HTMLDivElement | null>` — correcte sous
18 comme sous 19. Aligne le socle sur le template maître, qui typecheck désormais
contre les types 19 et a attrapé ce cas à la pose du garde-fou.
Même garde-fou posé ici : devDependencies `@types/react` / `@types/react-dom` en ^19 —
le typecheck du dépôt attrape désormais tout typage 18-only ; runtime et peers inchangés
(`react >=18`).

---

## 0.5.1 — le paquet typecheck sous React 19

Correctif de typage, sans changement de rendu ni d'API.

**Le défaut**

Les 37 composants annotaient leur retour `JSX.Element` **sans qualifier le namespace**.
`@types/react@18` déclare un `JSX` **global**, si bien que le typecheck passait ici — mais
React 19 a retiré ce global (il vit désormais sous `React.JSX`). Les `.d.ts` publiés
portaient donc une référence à un namespace qui n'existe pas chez le consommateur : toute
app en React 19 échouait au `tsc -b` avec 40 `TS2503: Cannot find namespace 'JSX'`.

Le piège était silencieux dans les deux sens : le dépôt du design system typecheckait
(il est en React 18) et le build Vite d'une app passait quand même (esbuild ne lit pas les
types). Seul `npm run build` cassait — donc en général sur le serveur de CI, jamais en local.

**Le correctif**

`JSX` est désormais **importé depuis `react`** dans chaque composant qui l'annote. Ce
namespace est exporté par le module `react` en **18.3 comme en 19** : le paquet reste
compatible avec les deux, et ne dépend plus d'un global.

## 0.5.0 — marque Julien Fernandes portée, surfaces corrigées, paquet installable

La marque Julien Fernandes est portée sur le squelette, et le paquet devient réellement
consommable par une app. Reprend la lignée de travail 0.2.0 → 0.4.2 (ci-dessous) que le
passage au squelette avait effacée du journal.

**⚠ Ruptures**

- Préfixe de classes `.jf-*` → `.ds-*`.
- `tokens/colors.css` disparaît : la couleur vit dans `brand-julien-fernandes.css`, monté
  par un second `@import` à côté de `core.css`.
- `exports` : `./brand-example.css` (mort) remplacé par `./brand-julien-fernandes.css` —
  `@import "@julienfernandes/ds/brand-julien-fernandes.css"` fonctionne désormais.

**La marque**

- Portage complet : 54 jetons obligatoires, 32 redéclarés en `.dark`, 3 jetons métier,
  12 écarts d'accessibilité assumés par écrit.
- `--surface-alt` introduit — 15 sites : survols, rail de progression, point haut du shimmer.
- Effondrement des surfaces sombres corrigé (6 valeurs) : l'échelle
  `page → muted → card → popover → surface-alt → secondary` est rétablie.
- `--popover` clair : `#fdfbf8` — flotte au-dessus de la carte (1,035), reste sous
  `--secondary` (1,033), pas de blanc pur en surface flottante.

**Le socle (règles `patterns.css`)**

- Un champ (`Input`, `Textarea`, `Select`, déclencheur de `DatePicker`) DÉDUIT sa surface
  porteuse dans une carte, une modale, une feuille, un dropdown ou un datepicker — la prop
  `surface="card"` devient une échappatoire, plus une obligation. Même geste pour `Tabs`
  dans une carte (`onCard` devient une échappatoire).
- Onglet actif en thème sombre : il monte AU-DESSUS de sa barre (mélange encre/remplissage)
  au lieu de se creuser en `--background`.
- Item de navigation actif (`Sidebar`, `Navbar`) : la sélection se signale par la graisse
  et l'icône (`--primary-readable`), plus par un libellé entier en orange — l'accent est
  rationné.

**L'outillage**

- `check-surfaces.mjs` : l'échelle des surfaces est mesurée à chaque lint, tout écart sous
  seuil exige un `@surface-assume` écrit.
- `npm run lint` agrège désormais les huit gardes : version, contrat, collisions,
  substitution, contraste, surfaces, catalogue, littéraux.

---

## 0.2.0 → 0.4.2 — la lignée de travail avant le squelette

Cinq prompts de mise au propre (cohérence doc & outillage · deux bugs bloquants du socle et
palier typographique manquant · mise en page sortie du JSX et échelle de z-index · états
manquants de la vitrine · catalogue d'usage réécrit + garde `check-catalogue`), puis le
portage de la marque et le correctif d'effondrement des surfaces (0.4.2). Les
spécifications détaillées de ces lots (`MISE-A-JOUR-v4.x.md`) vivent hors du dépôt ;
l'historique git en garde la trace commit par commit.

---

## 0.1.0 — squelette

Point de départ : 37 composants, 9 pages de vitrine, le contrat de marque, les sept scripts
de contrôle (`check-contract`, `check-contrast`, `check-dark-substitution`,
`check-utility-collisions`, `check-literals`, `check-version`, `check-catalogue`) —
`npm run lint` en agrège une partie avec le typecheck — et une marque d'exemple à remplacer.
