# Portage — Design System Julien Fernandes → repo GitHub `design-system`

> **À lire par Claude Code.** Ce dossier accompagne le zip complet du projet Claude Design
> « Julien Fernandes — Design System ». Ta mission : créer le repo `design-system` qui devient
> la **source de vérité** design de tous les outils de Julien (site, vidéos, slides, e-mails,
> dashboard, création de contenu, sport…).

## État du dépôt de portage — MISE À JOUR APRÈS CHAQUE LIVRAISON

> **À relire avant d'écrire un brief de portage.** Sans cette section, chaque brief repart d'un
> dépôt imaginaire. Toute section plus bas qui la contredit est **historique** (elle décrit le
> portage v1) : c'est celle-ci qui fait foi.

| | |
|---|---|
| Dépôt | `Julien-Fernandes/julien-fernandes-design-system` · branche `main` (anciennement `Yamiro02/…`, redirigé) |
| Paquet | `@julienfernandes/ds` |
| **Version publiée** | **0.4.0** — Pastille, ActionSheet, Badge dense, en-tête de Card, Modal 3 phases + feuille basse, switch. Le prochain lot est **0.4.1**. |
| **Mécanisme de thème** | **Tailwind v4 SEUL.** La couche utilitaire vit dans `src/styles/theme.css`, en `@theme inline`, exportée sous `./theme.css`. |
| **Couches CSS** | `base.css` en `layer(base)` · `patterns.css` en `layer(components)` → les utilitaires Tailwind repassent devant les classes `.jf-*`, comme en v3. |
| **Peer deps** | react · react-dom · tailwindcss >= 4 · lucide-react · tailwind-merge ^3 |
| **Surfaces modales** | `src/components/overlays/useModalSurface.ts` : piège de focus, Échap, focus rendu au déclencheur, verrou de défilement à compteur. Option `initialFocus` — `container` (Modal) / `first` (ActionSheet). |
| **Apps consommatrices** | **aucune à ce jour** — rien à protéger côté sites d'appel : un déprécié peut être supprimé tout de suite. |

**Fichiers supprimés du dépôt** — ne jamais les viser dans un brief :
`docs/PROMPTS.md` (v0.4.1 — dupliquait les contrats de props et dérivait ; ses règles propres sont
passées dans `docs/readme.md`) ·
`src/tailwind-preset.ts` (+ l'export `./preset`) · `src/components/content/` (BeforeAfter,
CodeBlock, QuoteBlock, StepCard) · les alias dépréciés `.jf-modal__icon` / `.jf-empty__icon` (v0.4.0,
supprimés des deux côtés) · `MetricPill` (composant métier, sorti du socle le 26/08 ; les
classes `.jf-metric*` restent dans `patterns.css`).

**Décisions structurelles en vigueur**
1. Les jetons vivent **uniquement** dans `src/styles/tokens/*.css`. `theme.css` n'expose un jeton
   que si un utilitaire Tailwind en a besoin — sinon il n'y entre pas.
2. Les composants s'habillent en **classes de motif `.jf-*`**, jamais en empilement d'utilitaires.
3. Le thème sombre est le scope `.dark`, jamais un media query. Point de rupture unique : **64 rem**.
4. Le projet Claude Design est l'atelier : rien n'est tranché dans le dépôt puis remonté ici —
   sinon les copies dérivent.

**Journal des livraisons**
- **0.4.0** — Pastille, ActionSheet, Badge `dense`, en-tête à slots sur Card, Modal 3 phases +
  feuille basse sous 64 rem, `sparkles` bannie / `trash-2` ajoutée, dette `.jf-switch__knob`,
  13 jetons. Vérifié conforme au maître le 26/08.
- **0.3.0** — migration Tailwind v4 seul : preset v3 supprimé, `theme.css` en `@theme inline`, couches.
- **0.2.0** — portage v2 : rayons, rail de contrôles, surfaces, focus champ, blocs separator /
  spinner / progress / table / pagination / appshell / calendar ; `content/` supprimé.
- **0.1.0** — portage v1 : tokens, patterns, 32 composants, démo, docs.
- **à venir : 0.4.1** — `portage-github/MISE-A-JOUR-v4.1.md` (nav tab bar : onglet actif visible en
  clair et en sombre ; script `lint` cassé). Deux points, aucun jeton touché.

**Écarts tranchés en faveur du code le 26/08** — le maître a été aligné dessus, un futur diff ne doit
pas les rouvrir : `initialFocus` du hook modal · verrou de défilement · `panel` implique `inline`
+ avertissements de dev · `Omit<…,'title'>` sur Card et EmptyState · suppression des deux alias
dépréciés. Code-seulement, sans équivalent maître : `cn.ts` (`makeCn`, `PALIERS_TYPO`), `Icon` en
lucide-react, `theme.css`, les layers.

## Règle n°1 — PORT, pas réinterprétation

Toute valeur (couleur, taille, rayon, ombre, durée, tracking…) vient des fichiers sources de ce
zip. **Zéro valeur inventée.** Les tokens sont copiés **tels quels**. Si une valeur manque, elle
manque aussi dans la source : ne l'invente pas, signale-la.

## Sources dans ce zip (la vérité)

- `readme.md` — la spec complète : marque, règle du rem, fondations, interdits. **Lis-le en entier.**
- `styles.css` → `tokens/fonts|colors|typography|scales|base.css` — **tous les tokens, verbatim**.
- `patterns.css` — les états (hover / focus / active / disabled) de chaque composant, composés
  uniquement de tokens.
- `components/**/*.jsx` + `*.d.ts` — les primitives de référence et leurs contrats de props.
- `assets/fonts/` (Anton-400, JetBrainsMono-400/500) · `assets/logo/` (PNG officiels).
- À ignorer : `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`, `*.card.html`,
  `guidelines/`, `thumbnail.html`, `portage-github/` (outillage Claude Design).

## Fidélité

**Hi-fi.** Les `.jsx` + `patterns.css` sont la référence exacte de rendu et d'états. Recrée-les
dans la stack cible en gardant les mêmes valeurs et les mêmes props (les `.d.ts` sont le contrat).

## Cible

- Repo : `design-system` · package **`@julienfernandes/ds`** · semver + tags git.
- Install côté apps : `npm i github:julienfernandes/design-system#vX.Y.Z`.
- Stack : **CSS vars + preset Tailwind + composants React par-dessus shadcn/ui**
  (stack apps : React + Vite + TS + Tailwind + shadcn).

```
design-system/
├─ package.json            # @julienfernandes/ds · exports · peerDeps: react, tailwindcss
├─ src/
│  ├─ styles/
│  │  ├─ index.css         # port de styles.css (@import only)
│  │  ├─ tokens/*.css      # copiés tels quels depuis tokens/
│  │  └─ patterns.css      # copié tel quel
│  ├─ tailwind-preset.ts   # mapping tokens → Tailwind, uniquement var(--…)
│  ├─ components/          # ports React+TS, un dossier par famille (actions, forms, …)
│  └─ index.ts             # exports nommés de tous les composants
├─ assets/fonts/ · assets/logo/   # copiés tels quels
└─ docs/readme.md                     # copié (spec + usage)
```

`package.json` — exports minimum :
`"." → src/index.ts` · `"./styles.css" → src/styles/index.css` · `"./preset" → src/tailwind-preset.ts` ·
`"./assets/*"`. Version de départ `0.1.0`.

## Tokens & preset Tailwind

1. **CSS vars d'abord** : `tokens/*.css` copiés verbatim (`:root` crème + scope `.dark` ink).
   C'est le seul endroit où les valeurs existent.
2. **Le preset ne contient que des `var(--…)`** — jamais un littéral. Les noms de
   `tokens/colors.css` suivent déjà la convention shadcn (`--background`, `--card`, `--border`,
   `--input`, `--ring`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`,
   `--popover`…) : branche-les directement sur `theme.extend.colors` comme le fait shadcn.
3. Même principe pour `borderRadius` (`--radius-*`), `boxShadow` (`--shadow-*`),
   `fontFamily` (`--font-display|body|mono`), `fontSize` (échelle de `tokens/typography.css`),
   `transitionTimingFunction` (`--ease-standard`).
4. `darkMode: ['class']` — le thème sombre est le scope `.dark`, jamais un media query.

## Composants — base shadcn par composant

Garde les noms et props des `.d.ts`. Style = tokens + `patterns.css` traduits en Tailwind/CVA.

- `Button`, `IconButton` → shadcn `button` (variants primary · secondary · ghost · danger ; jamais pill).
- `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `FormField` → équivalents shadcn
  (rail 3rem, bordure 1.5px, ring 3px `--ring`).
- `Card`, `Badge`, `Tooltip` → shadcn `card` / `badge` / `tooltip`.
- `Toast` → sonner (rendu custom) · `Banner`, `EmptyState`, `Skeleton`, `SkeletonCard` → custom.
- `Modal` → shadcn `dialog` · `Dropdown` → `dropdown-menu` · `Tabs` → `tabs` (pill) ·
  `Navbar`, `Footer` → custom.
- `Logo`, `Halo`, `GridBackground`, `Avatar` → custom (marque, pas de base shadcn).
- `CodeBlock`, `StepCard`, `BeforeAfter`, `QuoteBlock` → custom.
- `Icon` → **`lucide-react`** en prod (mêmes noms, tailles rem, stroke 2 / 2.5 / 3).

## Règles non négociables (détail dans docs/readme.md)

1. Tout en **rem** (exceptions listées § « RÈGLE ABSOLUE »). Jamais de font-size px sur `html`.
2. **Orange rationné** : dégradé et coral en accent seulement, un mot dégradé max par titre.
3. **Anton 400 CAPS**, titres uniquement, jamais sous 1.125rem, jamais faux-gras.
4. Pill jamais sur un bouton ni un input. Pas de bleu, pas de blanc/noir purs, pas d'emoji.
5. Grille fine + `--ink-deep` : miniatures / motion uniquement, jamais l'UI.

## Périmètre & synchronisation

- **Ici : uniquement le générique.** Les composants métiers d'une app (spécifiques à un seul
  outil) restent dans l'app — ils n'entrent jamais dans ce repo.
- Chaque app épingle une version (`#vX.Y.Z`). Évolution = PR sur le repo, bump semver, tag,
  puis mise à jour de la dépendance dans chaque app.
- Le projet Claude Design reste l'atelier de conception ; tout changement validé y est reporté
  puis porté dans le repo (nouvelle version).
