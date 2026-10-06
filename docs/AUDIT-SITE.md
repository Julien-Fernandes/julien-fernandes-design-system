# Audit — julienfernandes.com face au design system (v0.22.0)

> **Suite — livré en v0.23.0** (voir le CHANGELOG) : B1, B2, B4 à B10, B12 à B15, C1, M2,
> M3. Écarts avec les propositions ci-dessous : `menu` de la Navbar est **opt-in** (pas
> par défaut) ; B6 ne change pas la hauteur des cases ; B8 redimensionne le dégradé de la
> marque au lieu d'en dériver les arrêts ; B9 donne `eyebrowTone="neutral"` (et non
> `ink`) ; B10 descend `display-xl` à 3,25rem (la valeur de l'échelle) et non 2,75 ; B13
> pose `scroll-padding-top` sur la racine. M4 vérifié et non confirmé ; M1, B3, B11, B16
> non faits. Ce fichier reste dans le dépôt mais ne part pas dans le paquet.

Session 1 du plan du site (`site/PROJECT-CONTEXT.md` § 10) : audit maquettes ↔ DS, **sans
code**. Aucun composant modifié, aucune version bumpée. Ce fichier est le seul ajout.

**Sources lues** : `site/PROJECT-CONTEXT.md`, `site/CLAUDE.md`, `GOVERNANCE.md`,
`docs/PIEGES.md`, `README.md`, le code de `src/` (composants, `core.css`, `theme.css`,
`patterns.css`, `tokens/*`, fichier de marque), les six maquettes `.dc.html` et la planche
« Maquettes julienfernandes.com ».

**Vérifié en exécution, pas déduit** (banc jetable dans le scratchpad, hors des dépôts) :

- les 24 composants utiles au site passent en `renderToString` (React 18.3, celui du DS) ;
- un projet **Astro 7.3.5 + @astrojs/react 7 + React 19.3 + Tailwind 4.3.3 (Vite 8)**
  monté avec le paquet `npm pack` de la v0.22.0, sortie statique : build vert, HTML et CSS
  inspectés.

---

## 0 · Légende et règles de tri

| Cat. | Sens |
|---|---|
| **A** | couvert tel quel par un composant ou une classe du DS |
| **B** | couvert, mais il manque une prop / variante **générique** — `Bn` renvoie à la liste consolidée § 7 |
| **C** | manque générique, **les quatre tests de `GOVERNANCE.md` passent** — `Cn` § 8 |
| **D** | spécifique au site : reste dans `site/app/src/components/` |
| **D\*** | candidat générique **refusé aujourd'hui par le test 2** (un seul produit le demande) : il reste dans le site, écrit de façon promouvable — § 9 |
| ↺ | élément déjà classé plus haut (section partagée) : listé pour mémoire, **non recompté** |

Le tri suit GOVERNANCE à la lettre : un manque n'est **C** que s'il a un deuxième produit
demandeur, attesté dans le code d'une autre app. « Ça servirait sûrement » ne suffit pas —
« en cas de doute, ça reste dans l'app ».

### Traduction maquette → paquet

Les maquettes importent le bundle Claude Design, pas le paquet. Trois écarts mécaniques à
appliquer partout, ce ne sont pas des manques :

| Maquette | Paquet |
|---|---|
| classes `jf-*` (`jf-btn`, `jf-navbar`, `jf-card--flush`, `jf-choice__box`, `jf-cal__day`…) | `ds-*` |
| `tone="brandSolid"` (Pastille) | `tone="brand-solid"` |
| `full-width`, `default-checked`, `on-click` | `fullWidth`, `defaultChecked`, `onClick` |
| `.jf-grid` (grille fine des vignettes) | n'existe plus au socle depuis sa sortie de `brand-content.css` : six lignes de CSS dans le site si on la garde |
| littéraux `#ffffff`, `rgba(240,128,41,.30)`, `0.6875rem`… | jetons : `--primary-foreground`, `Halo` (§ B8), paliers `text-*` |

---

## 1 · Accueil

| # | Élément | Cat. | Composant / classe DS | Remarque |
|---|---|---|---|---|
| 1 | Barre de navigation collante (logo · liens · CTA) | A | `Navbar` (`links`, `cta`, `homeHref`, `homeLabel`) · `.ds-navbar` | `cta` passé par slot nommé ou depuis un `.tsx` (§ 10, R1) |
| 2 | Logo mot-marque (barre + pied) | A | `Logo variant="wordmark"` | déjà le défaut de `Navbar` / `Footer` |
| 3 | Liens d'ancre (Contenus, Projets, Newsletter) | A | `NavLink` → `.ds-navlink` | |
| 4 | CTA « Parle-moi de ton idée » (sm / md / lg, lien) | A | `Button as="a" href` | |
| 5 | Burger + panneau de menu sous 64 rem | B | `Navbar` → **B1** | aujourd'hui `.ds-navbar__links` ne se replie jamais : déborde sous 64 rem |
| 6 | Teinte de la barre au défilement | B | `Navbar` → **B3** | `is-scrolled` vient d'un `useEffect` : sans hydratation, jamais de teinte |
| 7 | Ancres masquées sous la barre collante | B | → **B13** | la maquette le règle à la main (`scroll-margin-top:6rem`) |
| 8 | Halo de section (bas, haut, opacité 0,6 / 0,7) | A | `Halo placement intensity` · `.halo` `.halo-top` | |
| 9 | Pastille « En train de construire : Yunary » + point pulsant | D\* | — (`StatusDot`, § 9) | 100 % CSS : **pas besoin d'îlot**, la valeur vient de `src/config/site.ts` au build. Le `@keyframes` de la maquette écrit `rgba(232,93,47,…)` : à réécrire en `color-mix` sur `--primary` |
| 10 | H1 display + un mot `.accent` (« vibe coder ») | A | `.display` / `text-display` + `.accent` | deux spans (piège 3) |
| 11 | Display réduite sous 64 rem (2,5 rem) | B | → **B10** | la maquette surcharge à la main ; le jeton ne bouge pas aujourd'hui |
| 12 | Chapô | A | `text-body-lg` | |
| 13 | Liste à puces : Pastille + icône + texte | A | `Pastille size="carte" tone="brand"` + `Icon` (`code`, `rocket`, `book-open`, `video`) | les 4 glyphes sont au catalogue |
| 14 | Paire de CTA (primaire lg + secondaire lg) | A | `Button size="lg"` | |
| 15 | Portrait 4:5 encadré | D | utilitaires `rounded-xl border shadow-lg bg-card` + `astro:assets` | |
| 16 | Sur-titre dégradé + H2 | A | `.eyebrow` + `text-heading-xl` | 1,75 rem sous 64 rem : **déjà porté par le jeton** (`typography.css`), la surcharge de la maquette est inutile |
| 17 | Sections encre (Contenus, Contact) | A | `.dark bg-background text-foreground` | |
| 18 | Tuiles réseaux (YouTube, Instagram, TikTok) | A | `IconButton as="a" variant="secondary"` + `ContentIcon` (`@julienfernandes/ds/brand-content`) | le survol « aplat orange + glyphe blanc » de la maquette n'est pas celui du DS (`--surface-alt`) : s'aligner sur le DS |
| 19 | Libellé capitales **neutre** (« Formats longs · YouTube ») | B | → **B9** | `.eyebrow` est forcément en dégradé ; aucune classe ne donne le même gabarit à l'encre |
| 20 | Vignettes YouTube (lecture, durée, titre) | D | blocs : `--overlay-play-bg` / `bg-overlay-play`, `Badge` | données du flux RSS, vraies miniatures : la vignette dessinée de la maquette disparaît |
| 21 | Carte entièrement cliquable (vidéos, projets) | B | `Card` → **B5** | `Card as="a" href` passe au runtime mais **ne type pas** (`href` absent de `CardProps`) |
| 22 | Carrousel Shorts (aimantation, flèches, sans barre) | D\* | — (`Scroller`, § 9) ; flèches = `IconButton` | défilement natif sans JS, flèches en amélioration progressive |
| 23 | Carte projet (média 16:10, titre, badges, texte, bouton pleine largeur) | A | `Card flush variant="interactive" as="article"` + `Badge` + `Button fullWidth` | la carte « se soulève » mais seul le bouton est cliquable : voir B5 |
| 24 | Badges de statut (En construction · Projet client · Terminé) | A | `Badge tone="warning│accent│success" pad="dense" icon` | |
| 25 | Carte « Ton app ici ? » | A | `Pastille size="heros" tone="brand-solid"` + `bg-grad-soft` | |
| 26 | Cartes « Pourquoi moi » (titre + texte) | A | `Card flush` | |
| 27 | Illustrations de ces cartes (cadrage, chat, plan) | D | — | `aria-hidden` ; tailles `0.625rem` / `0.6875rem` hors échelle, à ramener sur `text-caption` |
| 28 | Étapes 01 · 02 · 03 en dégradé | A | `.accent` + `font-display` | ⚠️ la maquette pose `width:2rem` **sur** le nœud `.accent` : c'est exactement le piège 3 (dégradé étalé sur la gouttière). Deux spans |
| 29 | Lien `mailto:` en légende | A | `<a>` | couleur : décision M1 (§ 6) |
| 30 | Carte de réservation | A | `Card size="lg"` | |
| 31 | En-tête de carte : libellé neutre + badge « Gratuit » | B | `CardHeader` (`eyebrow`, `action`) → **B9** | le slot `eyebrow` ne sait faire que le dégradé |
| 32 | Calendrier pleine largeur | B | `Calendar` → **B6** | décision du 06/10 ; la maquette réécrit `.jf-cal__grid` à la main |
| 33 | « Aujourd'hui » du calendrier | B | `Calendar` → **B7** | `new Date()` au rendu : **figé à la date du build** en SSG (§ 10, R2) |
| 34 | Créneaux horaires (choix unique) | A | `Button size="sm"`, primaire si choisi, secondaire sinon | passer `aria-pressed` (traverse par `...rest`) ou un `role="radiogroup"` |
| 35 | Champs prénom / e-mail avec libellé | A | `FormField` + `Input` | le libellé de la maquette (body-sm medium) n'est pas `.ds-label` : prendre `FormField` |
| 36 | Bouton de confirmation désactivé | A | `Button fullWidth disabled` | |
| 37 | Légende centrée (fuseau, lien visio) | A | `text-caption text-text-muted` | |
| 38 | Logique de prise de RDV (créneaux, fuseau, envoi) | D | îlot `BookingWidget` | `client:only="react"` (R2) |
| 39 | Halo élargi de la section newsletter (95 % × 70 %) | B | `Halo` → **B8** | la maquette écrit les arrêts en `rgba` littéraux : interdit côté site |
| 40 | Formulaire newsletter empilé (prénom, e-mail, bouton) | A | `Input` + `Button type="submit" fullWidth` | « champ e-mail + bouton en ligne » : **absent des maquettes**, rien à créer |
| 41 | Case de consentement | A | `Checkbox label required` | ⚠️ **pré-cochée** dans la maquette : un consentement pré-coché n'est pas valable (RGPD) — risque site, § 11 |
| 42 | Pied de page (marque, e-mail, colonnes, ©) | B | `Footer` → **B4** | `note` est une `string` (pas de lien), une colonne ne prend que des liens, aucune ligne de bas |
| 43 | Icônes réseaux du pied | A | `IconButton as="a"` + `ContentIcon` | la maquette les fait en 2,25 rem : le rail des `IconButton` est 3 rem, c'est le bon (cible tactile) |
| 44 | Glyphe LinkedIn | D\* | — | `ContentIcon` n'a que YouTube / Instagram / TikTok ; TikTok est entré au **deuxième** demandeur, LinkedIn n'en a qu'un : SVG local au site |

**Accueil : 44 éléments — A 26 · B 11 · C 0 · D 7 (dont D\* 3).**

---

## 2 · Projet Yunary (gabarit des pages projet)

| # | Élément | Cat. | Composant / classe DS | Remarque |
|---|---|---|---|---|
| 1 | Barre projet : Retour · logo centré · CTA | D | classes `.ds-navbar` `.ds-navbar__inner` + grille du site | `Navbar` n'a pas de créneau à gauche du logo ; un seul produit le demande |
| 2 | Bouton « Retour » + chevron | A | `Button variant="secondary" size="sm" icon={<Icon name="chevron-left"/>}` | la maquette enveloppe l'icône à la main |
| 3 | Bouton secondaire posé **sur** la barre | B | → **B12** | décision du 06/10 : fond `--background` ; la déduction de surface ne connaît pas la barre |
| 4 | Sur-titre « Projet · Produit perso » | A | `.eyebrow` | |
| 5 | H1 display-xl (nom du projet) | A | `.display-xl` | |
| 6 | Display-xl réduite sous 64 rem (2,75 rem) | B | → **B10** | |
| 7 | Halo contenu (48 rem × 22 rem) | B | `Halo` → **B8** | trois sections de la maquette l'écrivent en `rgba` |
| 8 | Cadre navigateur (trois points, barre d'URL, capture) | D\* | — (`BrowserFrame`, § 9) | blocs : `Card flush` + utilitaires |
| 9 | Fiche « En un coup d'œil » (clé / valeur + pastilles) | D | blocs : `Card`, `Pastille size="carte"`, `Icon` (`user`, `layout-dashboard`) | connaît la forme `fiche` de la collection |
| 10 | Libellés neutres (« En un coup d'œil », « Stack », « Charte Yunary ») | B | → **B9** | |
| 11 | Lignes de stack (logo tiers · nom en Anton · rôle) | D | — | les couleurs des logos tiers (`#149eca`, `#3ecf8e`…) sont du **contenu** : elles vivent dans les SVG de la collection, jamais en CSS |
| 12 | Timeline animée au défilement (rail, remplissage dégradé, points allumés, zigzag, 1 colonne en mobile) | D | — | script vanilla ou `animation-timeline: view()` plutôt qu'un îlot React ; `prefers-reduced-motion` → tout allumé |
| 13 | Titre d'étape + texte | A | `h3` + `text-heading` · `text-body-lg` | |
| 14 | « Les choix clés » | A | `.eyebrow` | |
| 15 | Lignes « choix clés » (carte compacte + puce ronde cochée en dégradé) | B | `Pastille` → **B11** ; `Card` + `p-*` | la plus petite Pastille fait 2,25 rem, la maquette 1,5 rem |
| 16 | Visuel du brief (téléphone, artefacts Analyse / Script / Programmation) | D | — | illustration |
| 17 | Carte « Charte » (en-tête à filet, logo, nuancier, typos) | D | blocs : `Card flush` + `CardHeader flush` (`eyebrow` → B9, `action`) | |
| 18 | Grille de maquettes (figure 4:3 + légende) | D | utilitaires + `astro:assets` | |
| 19 | Écrans de l'app (carte figure + titre + légende) | A | `Card flush as="figure"` | |
| 20 | Badge « Bientôt » | A | `Badge tone="amber" pad="dense"` | |
| 21 | Étape « Avis client » (masquée tant qu'absente) | D | — | |
| — | Section Contact (RDV) | ↺ | Accueil 28 → 38 | |
| — | Pied de page | ↺ | Accueil 42 → 44 | |

**Projet Yunary : 21 éléments — A 7 · B 5 · C 0 · D 9 (dont D\* 1).**

---

## 3 · Projet KineFlow

Même gabarit, mêmes composants que Yunary : seules les différences sont listées.

| # | Élément | Cat. | Composant / classe DS | Remarque |
|---|---|---|---|---|
| — | Gabarit projet complet | ↺ | Projet Yunary | |
| 1 | Visuel du brief : tableur barré + liste d'attribution | D | — | |
| 2 | Pastilles d'initiales (CL, TM, SB) sur `--accent` | D | — | `Avatar` du DS est un portrait / monogramme en sourdine : autre objet |
| 3 | Charte réelle : mot-marque client + nuancier hex | D | — | les hex du client = données `designSystem.couleurs[]` de la collection |
| 4 | Horaires en chasse fixe | A | `font-mono` | utilitaire plutôt que `.mono` (piège 2) |
| — | Stack à 4 lignes (Claude ajouté, correction du cadrage) | ↺ | Yunary 11 | |

**Projet KineFlow : 4 éléments — A 1 · B 0 · C 0 · D 3.**

---

## 4 · Newsletter

| # | Élément | Cat. | Composant / classe DS | Remarque |
|---|---|---|---|---|
| 1 | Lien actif « Newsletter » de la barre | B | `NavLink active` → **B2** | la couleur active est là ; `aria-current="page"` ne l'est pas |
| 2 | H1 display + accent « Journal d'un vibe coder » | A | `.display` + `.accent` | quatre mots en dégradé : la marque dit « UN mot » — à trancher côté contenu |
| — | Halo contenu | ↺ | B8 | |
| 3 | Mockup d'e-mail ouvert (#12) | D | — | |
| 4 | Puces Pastille + emoji | A | `Pastille size="carte" tone="brand"` (enfant emoji) | |
| 5 | Formulaire du hero (champs lg, bouton lg) | A | `Input size="lg"` + `Button size="lg" fullWidth` | |
| 6 | Consentement sur deux lignes | A | `Checkbox label={<>…<br/>…</>}` | même risque « pré-cochée » qu'Accueil 41 |
| 7 | Cartes « Ce qu'il y a dedans » | A | `Card flush` | |
| 8 | Illustrations de ces cartes (progression, éditeur sombre, actus) | D | — | |
| 9 | Barre de progression (dans l'illustration) | A | `Progress` | remplissage en dégradé, conforme |
| 10 | Badges d'illustration (« A avancé », « Testé ») | A | `Badge tone="success│coral" pad="dense"` | |
| — | Carrousel des numéros + flèches | ↺ | Accueil 22 (D\*) | inutile au lancement : la section affiche l'état vide |
| 11 | Carte de numéro envoyé (aperçu, n° accent, date, badge « Envoyé · plus disponible ») | D | blocs : `Card flush`, `Badge tone="amber"` | |
| 12 | État vide : carte #01 + compte à rebours | D\* | — (`Countdown`, § 9) | JS obligatoire ; valeur SSG fausse dès le lendemain du build → îlot `client:only` ou texte de repli « dimanche, 8:00 » |
| 13 | Bouton « Je m'abonne » vers `#inscription` | A | `Button as="a"` | |
| 14 | Section CTA finale en encre + formulaire | A | `.dark` + mêmes champs | |
| — | Pied de page | ↺ | Accueil 42 → 44 | |

**Newsletter : 14 éléments — A 9 · B 1 · C 0 · D 4 (dont D\* 1).**

---

## 5 · Mentions légales · Politique de confidentialité

Les deux pages partagent tout leur gabarit.

| # | Page | Élément | Cat. | Composant / classe DS | Remarque |
|---|---|---|---|---|---|
| — | les deux | Barre + pied | ↺ | Accueil | |
| 1 | Mentions | En-tête : sur-titre, H1, date de mise à jour | A | `.eyebrow` + `h1` (palier `heading-xl` par défaut) + `text-caption` | |
| 2 | Mentions | Corps d'article : sections `h2`, paragraphes, listes à puces | C | → **C1** | `.prose` ne règle que l'interligne ; le preflight retire les puces des `ul` |
| 3 | Mentions | Liens dans le texte (`mailto`, externes) | A | `<a>` | couleur : M1 |
| — | les deux | Ancres de section | ↺ | B13 | |
| 4 | Politique | Chapô « Version courte… » | A | `text-body-lg` | |
| — | Politique | Listes à intitulés en gras | ↺ | C1 | |

**Pages légales : 4 éléments — A 3 · B 0 · C 1 · D 0.**

---

## 6 · Les « décisions Julien du 06/10 » — à arbitrer avant le lot

Chaque maquette porte un bloc `<style>` qui **surcharge la marque** à l'échelle de la page.
Le site n'a pas le droit d'écrire une couleur : ces décisions vont soit dans
`brand-julien-fernandes.css` (et touchent alors **toutes les apps**), soit nulle part.

| # | Décision dans la maquette | Aujourd'hui dans la marque | Avis |
|---|---|---|---|
| M1 | liens de texte en `--primary` (`#e85d2f`), survol encre | `--primary-readable` (`#b23a1c`) | **Ne pas adopter tel quel** : `--primary` tient 3,12:1 sur la page crème, sous le 4,5 du texte courant. Si l'orange vif est voulu, l'ouvrir proprement : un rôle `--link` au contrat (comme `--active` en 0.21.0) + un `@a11y-assume` écrit. Mineure |
| M2 | en sombre, gris plus clairs : `--text-secondary #ece9e3`, `--text-muted #d2cfc9` | `#d2cfc9` / `#b0aea9` | Gain de contraste, sans risque. Mais c'est une ligne de marque : **toutes** les apps changent en sombre. Patch de marque |
| M3 | anneau de focus = `--primary`, en clair comme en sombre | `--brand-via` (clair) / `--brand-from` (sombre) | À mesurer par `check-contrast.mjs` avant ; patch de marque |
| M4 | case à cocher : bordure de survol `--border` (pas `--primary`), focus = contour 2 px au lieu du halo 3 px « qui apparaît après un clic » | survol `--primary`, halo sur `:focus-visible` | Le remplissage « dégradé jusqu'au bord » est **déjà** celui du paquet (`background: … border-box`). Pour le halo : vérifier d'abord dans la vitrine qu'il apparaît vraiment au clic (la règle est en `:focus-visible`). Patch `patterns.css` si confirmé |
| M5 | bouton secondaire de la barre sur `--background` | `--secondary` (même couleur que la barre) | Conforme à la doctrine de déduction de surface : c'est **B12** |

---

## 7 · Liste consolidée des manques **B** (prop ou variante générique)

Règle de version appliquée : **mineure** = nouvelle surface d'API (prop, classe, sous-chemin,
jeton) ou rendu qui change ; **patch** = correctif qui ramène le rendu à la doctrine écrite,
sans API nouvelle.

| # | Cible | Proposition d'API | Pourquoi générique | Impact |
|---|---|---|---|---|
| **B1** | `Navbar` | `menu?: boolean` (défaut `true`) · `menuLabel?: string` (défaut « Menu ») · `menuFooter?: ReactNode` (défaut : `cta`). Sous 64 rem : `.ds-navbar__links` masqué, un `IconButton` burger ouvre un panneau `.ds-navbar__menu` monté en **`popover` natif** (`popovertarget`) — ouverture / fermeture / Échap **sans une ligne de JS**, donc sans hydratation | tout site qui pose `Navbar` casse aujourd'hui sous 64 rem | mineure. Limite à documenter : un lien d'ancre de la même page ne referme pas le popover tout seul (3 lignes de script côté site, ou `<details>`) |
| **B2** | `Navbar` | `aria-current="page"` posé sur le lien `active` | accessibilité ; `check-active.mjs` reconnaît déjà `[aria-current]` | patch |
| **B3** | `Navbar` | teinte `is-scrolled` en CSS pur : `@supports (animation-timeline: scroll())`, le `useEffect` reste le repli | une barre rendue sans hydratation (Astro, e-mail, slides) ne se teinte jamais | patch · **optionnel** |
| **B4** | `Footer` | `note?: ReactNode` (au lieu de `string`, compatible) · `FooterColumn.content?: ReactNode` (rendu après les liens — les réseaux dans « Réseaux ») · `legal?: ReactNode` (ligne de bas : ©) | aucun pied de site n'est complet sans ligne légale ni lien de contact | mineure |
| **B5** | `Card` | `href?: string` — rend un `<a>` (et `variant="interactive"` par défaut quand `href` est passé), typé comme `Button` / `IconButton` | la carte-lien est le cas d'usage n° 1 de `variant="interactive"` ; `as="a"` ne type pas `href` aujourd'hui | mineure |
| **B6** | `Calendar` | `fluid?: boolean` → `.ds-cal--fluid` : largeur 100 %, `repeat(7, minmax(0,1fr))`, case haute `--cal-day-fluid` (2,5 rem), chiffre en `text-body` | tout widget de réservation pose le calendrier dans une carte | mineure |
| **B7** | `Calendar` | `today?: Date` — sert au marquage `is-today` et au mois initial ; doc : en SSR / SSG, passer `today` ou monter en `client:only` | `new Date()` au rendu fige « aujourd'hui » au moment du build et provoque un écart d'hydratation (fuseau Netlify UTC ≠ visiteur en Corée) | mineure |
| **B8** | `Halo` | `extent?: 'section' \| 'wide' \| 'contained'` → `.halo--wide` (95 % × 70 %), `.halo--contained` (48 rem × 22 rem). Les arrêts se **dérivent** dans `tokens/derives.css` : `color-mix(in srgb, var(--brand-via) 30%, transparent)` et `var(--brand-to) 12%` donnent **exactement** les `rgba` des maquettes — aucun jeton de marque ajouté, contrat inchangé | sur grand écran un halo en % s'étale ; une étendue fixe le contient | mineure |
| **B9** | `.eyebrow` / `CardHeader` | classe `.overline` : gabarit d'`.eyebrow` (taille, graisse, capitales, interlettrage) **sans** le pochoir dégradé, en `currentColor` — donc non fragile. `CardHeader` / `Card` : `eyebrowTone?: 'brand' \| 'ink'` | libellé de section neutre ; huit occurrences sur trois maquettes ; aujourd'hui seul `.chip` s'en approche (autre taille, autre graisse) | mineure |
| **B10** | `tokens/typography.css` | dans le bloc `(width < 64rem)` existant : `--text-display: 2.5rem; --text-display-xl: 2.75rem` | `heading-xl` et `heading` descendent déjà, les deux displays non ; un H1 de 52 px ne tient pas sur 390 px | mineure (rendu mobile modifié pour toute app qui emploie `text-display` : vérifier ses usages) |
| **B11** | `Pastille` | `size="puce"` (1,5 rem, rayon `--radius-xs`, glyphe 0,875 rem par le créneau) | puce d'une liste à cocher de marque | mineure · **basse priorité** (repli : `size="carte" shape="round"`) |
| **B12** | déduction de surface (`patterns.css`) | ajouter `.ds-navbar` aux porteuses : un bouton / icône secondaire **dans** la barre passe sur `--background` | la barre est en `--secondary` : un bouton secondaire y est de la même couleur qu'elle | patch |
| **B13** | `tokens/base.css` | `:root:has(.ds-navbar){scroll-padding-top:var(--navbar-h)}` | toute ancre sous une barre collante est masquée ; ne touche pas les apps sans `Navbar` | patch |
| **B14** | `package.json` (exports) | `"./fonts/*": "./src/styles/assets/fonts/*"` | **testé** : `import url from '@julienfernandes/ds/src/styles/assets/fonts/Anton-400.woff2?url'` échoue (« is not exported ») → aucun `preload` possible ; copier le fichier dans `public/` le ferait télécharger deux fois (deux URL) | mineure |
| **B15** | `brand-julien-fernandes.css` | DM Sans **auto-hébergée** (woff2 variable, sous-ensembles latin + latin-ext, dans `assets/fonts/`) ; l'`@import url(fonts.googleapis.com…)` disparaît | requête tierce bloquante en cascade (CSS → CSS Google → police), IP du visiteur envoyée à Google (la politique de confidentialité dit « Netlify seulement »), et contradiction avec « polices auto-hébergées avec preload » du cadrage. Bénéficie à toutes les apps | patch (aucune API ; rendu identique) |
| **B16** | `tokens/scales.css` · `patterns.css` | harmoniser la frontière : tout en `(width < 64rem)` / `(width >= 64rem)` | à **1 024 px pile** (iPad paysage) : `typography.css` est en desktop (`< 64rem`), `scales.css` et la modale en mobile (`max-width: 64rem` inclusif), et le `lg:` de Tailwind en desktop | patch · basse priorité |

**Écarté, à surveiller** — `Button pressed` (l'état enfoncé qui existe déjà sur
`IconButton`) : deux usages hors DS en `aria-pressed` dans Creator (`ChoixCouverture`,
`FormatPickerCard`), mais la maquette dessine le créneau choisi en **primaire**, pas en
plaque active. Le changement de variante suffit au site ; à rouvrir si Creator le demande.

---

## 8 · Liste consolidée des manques **C** (nouveau générique)

| # | Proposition | Les quatre tests | API | Impact |
|---|---|---|---|---|
| **C1** | **Typographie de flux** — classe `.ds-prose` (`patterns.css`, couche `components`) | **Nom** : passe. **Réutilisation** : Dashboard l'a déjà écrite chez lui (`@utility document-riche`, `Dashboard/app/src/index.css`) et l'annonce noir sur blanc : *« si une deuxième app réclame une typographie de prose complète, ce sera un candidat pour le socle »*. Le site est cette deuxième app (pages légales + contenus Markdown des collections). **Dépendance** : aucune. **Doublon** : `.prose` ne règle que l'interligne ; l'étendre changerait la sémantique d'une classe publiée → nouveau nom | une classe, zéro JS : flux `> * + *` (`--space-4`), `h2` / `h3` sur `heading` / `subheading` (face, casse et graisse via les jetons de titrage), `ul` / `ol` avec puces rétablies (`list-style: revert`, retrait `--space-5`), `li + li`, `strong` semibold, `a` souligné au survol, `code` en mono. **Sélecteurs descendants uniquement** (la leçon de Dashboard avec TipTap). Dashboard peut ensuite composer `document-riche` dessus | mineure |

Aucun autre candidat ne passe le test 2 aujourd'hui (§ 9).

---

## 9 · Candidats refusés par le test 2 — restent dans le site, écrits « promouvables »

Les exemples du brief, vérifiés un par un dans le code de Creator, Dashboard et Editing :

| Candidat | Verdict | Pourquoi | Comment l'écrire dans le site pour pouvoir le promouvoir |
|---|---|---|---|
| Pastille « en direct » animée (`StatusDot`) | D\* | aucune autre app n'a de point pulsant | composant sans connaissance du site (`tone`, `pulse`, `label` lu par les lecteurs d'écran), CSS sur jetons, `color-mix` sur `--primary`. La pulsation s'arrête d'elle-même en mouvement réduit (règle globale de `scales.css`) |
| Champ e-mail + bouton en ligne | — | **absent des maquettes** : les trois formulaires sont empilés | rien à faire |
| Case de consentement | A | `Checkbox` la couvre, `label` accepte un nœud | — |
| Carrousel horizontal (`Scroller`) | D\* | aucun `scroll-snap` dans les autres apps ; les Shorts et les numéros sont deux écrans **du même produit** | défilement natif + `scroll-snap`, flèches en amélioration progressive, conteneur `tabindex="0"` + `aria-label` (sinon une liste sans barre de défilement est inatteignable au clavier) |
| Compte à rebours (`Countdown`) | D\* | le « compte à rebours » de Creator est une minuterie interne, pas une interface | îlot ou script vanilla ; texte de repli statique |
| Cadre navigateur (`BrowserFrame`) | D\* | un seul produit | `Card flush` + slots |
| Glyphe LinkedIn (`ContentIcon`) | D\* | TikTok est entré au deuxième demandeur, LinkedIn n'en a qu'un | SVG local en `currentColor`, même gabarit que les trois autres |

Restent **D** sans discussion, comme le prévoyait le brief : timeline de projet, hero,
mockup d'e-mail, fiche « En un coup d'œil », lignes de stack, carte de numéro, illustrations,
logique de RDV.

---

## 10 · Compatibilité Astro — ce qui a été mesuré

Banc : Astro 7.3.5 · @astrojs/react 7.0.0 · React 19.3.0 · Tailwind 4.3.3 · Vite 8.3.3 ·
sortie statique · paquet v0.22.0 (`npm pack --ignore-scripts`, `dist/` en l'état).

### Montage qui marche

```astro
---
// src/layouts/Base.astro — imports JS, dans le frontmatter
import '@julienfernandes/ds/core.css';
import '@julienfernandes/ds/brand-julien-fernandes.css';
import '../styles/global.css';
---
```

```css
/* src/styles/global.css — l'entrée que traite @tailwindcss/vite */
@import '@julienfernandes/ds/theme.css';
/* PAS de @import "tailwindcss" ; PAS d'app-scale.css (c'est un site) */
```

```js
// astro.config.mjs
integrations: [react()], vite: { plugins: [tailwindcss()] }
```

### Résultats

| Point | Résultat |
|---|---|
| Les trois CSS | ✅ un seul fichier CSS émis. L'`@import` Google est **remonté en tête** ; couches dans l'ordre theme → base → components → utilities. Le minifieur retire la ligne `@layer theme, base, components, utilities;`, mais l'ordre d'apparition est le même : sans effet |
| Utilitaires Tailwind | ✅ `text-display`, `text-body-lg`, `text-text-secondary`, `rounded-lg`, `bg-card`, `p-card-pad`, `gap-space-4`, `max-w-read` générés ; `text-sm` **absent** (classe morte, comme prévu au piège 1) |
| Anton et JetBrains Mono | ✅ résolues depuis `node_modules`, émises hachées dans `/_astro/` |
| DM Sans | ❌ chargée depuis Google (B15) |
| `preload` des polices | ❌ impossible tant que l'`exports` ne les expose pas (B14) |
| Rendu serveur | ✅ 24 composants en `renderToString`, et la page Astro complète en React 19 : aucun accès à `window` / `document` au rendu. Les API navigateur ne vivent que dans des effets ou des gestionnaires (`Navbar`, `DatePicker`, `Modal` / `ActionSheet` via `useModalSurface`) ; `Sidebar` lit `localStorage` dans un `try` (sûr en SSR, non employé par le site) |
| Zéro JS pour le visuel | ✅ sans directive `client:*`, `Button` / `IconButton` en lien, `Badge`, `Pastille`, `Card`, `Logo`, `Halo`, `Input`, `Checkbox`, `FormField`, `Navbar`, `Footer` sortent en HTML pur ; le seul `<script>` de la page est celui de l'îlot. Les classes `.ds-*` écrites à la main dans un `.astro` marchent aussi |
| Coût d'un îlot React | runtime React 65,8 Ko gzip + îlot calendrier 17,7 Ko gzip (`cn` → `tailwind-merge`, catalogue d'icônes). Un seul îlot React se justifie : la prise de RDV |

### Risques trouvés

| # | Risque | Constat | Parade |
|---|---|---|---|
| **R1** | Un composant passé **en prop** depuis un `.astro` casse le build | `cta={<Button/>}` → *Objects are not valid as a React child (found: object with keys {htmlParts, expressions…})* : dans un `.astro`, `<Button/>` est un gabarit Astro, pas un élément React | **testé, deux voies qui marchent** : slot nommé (`<Button slot="cta" …/>`, laisse un attribut `slot` inoffensif) ou composition dans un `.tsx` rendu **sans** directive (zéro JS). Recommandé : `.tsx` pour tout bloc qui passe `icon`, `cta`, `action`, `brand`… |
| **R2** | `Calendar` figé au build | HTML construit le 6 : `is-today` sur le 6, jours 1 → 5 `disabled`, mois d'octobre — tout cela gravé. React ne corrige pas un attribut divergent à l'hydratation | îlot RDV en `client:only="react"` (il est sous la ligne de flottaison) ; B7 au DS |
| **R3** | DM Sans via Google | voir B15 | B15 ; en attendant, ne pas déclarer « aucun tiers » dans la politique de confidentialité |
| **R4** | Pas de `preload` | voir B14 | B14 |
| **R5** | Le CSS d'Astro n'est pas en couche | un `<style>` de composant `.astro` est **hors couche** : il bat `.ds-*` **et** les utilitaires, toujours. Le contrat « un utilitaire en `className` surcharge le composant » s'inverse | dans le site, écrire ses styles en `@layer components { … }` ou en utilitaires |
| **R6** | L'ordre d'import de la marque | `core.css` l'écrit : atteinte depuis l'entrée Tailwind, la marque perd son `@import` Google | importer la marque **en JS** (frontmatter), comme ci-dessus. Devient sans objet après B15 |
| **R7** | `Navbar` sans hydratation | collante oui, teinte au défilement non, menu mobile absent | B1 (popover natif) + B3 ; ne pas hydrater la barre pour ça |
| **R8** | Frontière à 1 024 px | voir B16 | B16 ; dans le site, `max-lg:` = « sous 64 rem » |
| R9 | Installation | dépôt **public** (vérifié) : Netlify installe le tag sans jeton ; `prepare: tsup` tourne à l'installation (comme dans les apps) | — |

---

## 11 · Hors DS — risques à porter dans les sessions du site

- **Consentement pré-coché** (`default-checked` sur les trois cases newsletter) : un
  consentement doit être un acte positif. Case **décochée** par défaut.
- **Piège 3 dans la maquette** : les numéros 01 · 02 · 03 du Contact portent `width:2rem`
  et la police sur le nœud `.accent`. Deux spans.
- **Littéraux** à ne pas recopier : `#ffffff` (→ `--primary-foreground`), halos en `rgba`
  (→ `Halo`, B8), tailles `0.625rem` / `0.6875rem` / `3.25rem` (→ paliers), couleurs des
  logos tiers (→ fichiers SVG de la collection).
- **Îlots** : le cadrage prévoit des îlots React pour le formulaire newsletter, le
  carrousel, la timeline, la pastille « en direct » et le compte à rebours. Seule la prise
  de RDV en a besoin. Le formulaire Netlify Forms marche en HTML pur ; carrousel et
  timeline en CSS + script vanilla ; la pastille en CSS ; le compte à rebours en script.
  C'est la différence entre ~85 Ko de JS gzip sur l'Accueil et zéro sur les autres pages.
- **Mouvement réduit** : la règle globale de `scales.css` coupe déjà transitions et
  animations ; les scripts (timeline, carrousel `scroll-behavior: smooth`) doivent aussi
  lire `prefers-reduced-motion`.

---

## 12 · Récapitulatif

**87 éléments uniques** (sections partagées comptées une fois) :

| | A | B | C | D | dont D\* | Total |
|---|---|---|---|---|---|---|
| Accueil | 26 | 11 | 0 | 7 | 3 | 44 |
| Projet Yunary | 7 | 5 | 0 | 9 | 1 | 21 |
| Projet KineFlow | 1 | 0 | 0 | 3 | 0 | 4 |
| Newsletter | 9 | 1 | 0 | 4 | 1 | 14 |
| Pages légales | 3 | 0 | 1 | 0 | 0 | 4 |
| **Total** | **46** (53 %) | **17** (20 %) | **1** (1 %) | **23** (26 %) | 5 | **87** |

Les 17 lignes B renvoient à **13 manques distincts** (B1 → B13), auxquels s'ajoutent trois
manques de socle hors maquettes trouvés au banc Astro (B14 polices exportées, B15 DM Sans
auto-hébergée, B16 frontière 1 024 px).

### Lot proposé — v0.23.0 (mineure)

| Priorité | Items |
|---|---|
| **Bloquant pour le site** | B1 menu mobile de `Navbar` · B4 `Footer` · B5 `Card href` · B6 + B7 `Calendar` · B8 `Halo extent` · B9 `.overline` · B10 displays mobiles · B14 polices exportées · B15 DM Sans locale · **C1 `.ds-prose`** |
| **Petits correctifs, même lot** | B2 `aria-current` · B12 surface de la barre · B13 ancres sous la barre |
| **Optionnels / reportables** | B3 teinte CSS · B11 `Pastille` puce · B16 frontière 1 024 px |
| **À trancher avec Julien d'abord** | M1 (avis : non, ou rôle `--link`) · M2 · M3 · M4 |

Pas de rupture attendue : toutes les props proposées sont additives, `note: string` →
`ReactNode` est un élargissement, B8 ne touche pas au contrat de marque. Les seuls
changements de rendu pour les apps existantes sont B10 (displays en mobile), B12 (bouton
dans la barre), B15 (même police, autre source) et M2 / M3 / M4 s'ils sont adoptés.

### Compatibilité Astro, en une ligne par risque

R1 composants en props depuis `.astro` (build cassé — slots ou `.tsx`) · R2 calendrier figé
au build (`client:only`) · R3 DM Sans chez Google · R4 pas de `preload` · R5 CSS d'Astro
hors couche · R6 marque à importer en JS · R7 barre sans teinte ni menu sans JS · R8
frontière 1 024 px. Aucun accès navigateur au rendu : **le SSR est sain**.
