/**
 * Filet anti-COLLISION entre un `@utility` maison et une classe déjà générée
 * par un jeton de thème.
 *
 * LE DÉFAUT QU'IL FERME. Dans Tailwind v4, un jeton de thème génère TOUT le
 * namespace de son préfixe : `--spacing-card-pad` ne donne pas seulement
 * `p-card-pad`, il donne aussi `w-card-pad`, `h-card-pad`, `gap-card-pad`,
 * `max-h-card-pad`… Déclarer à côté
 *
 *     @utility max-h-card-pad { max-height: 40rem }
 *
 * ne REMPLACE pas la classe générée : Tailwind écrit les deux déclarations dans
 * la MÊME règle, et la dernière gagne.
 *
 *     .max-h-card-pad { max-height: 40rem; max-height: var(--card-pad) }
 *
 * Ni erreur, ni avertissement, ni classe manquante : la déclaration disparaît en
 * silence. Rien dans `tsc`, dans le build tsup ni dans le build Vite ne peut la
 * voir. Le cas a coûté une demi-journée de diagnostic sur Videapro, où un rail
 * d'étapes s'est retrouvé plafonné à sa propre LARGEUR — carte tronquée après la
 * 4e étape, 777 px de vide dessous. Le contrôle vient de là.
 *
 * POURQUOI ICI, ALORS QUE LE DÉPÔT EST PROPRE. `src/styles/theme.css` déclare
 * 8 `@utility` (tous en `bg-*`, faute de namespace v4 pour `background-image` et
 * `background-size`) à côté de 44 jetons `--color-*` et 16 jetons `--spacing-*`.
 * L audit manuel fait à la migration v4 a conclu zéro recouvrement, et il était
 * juste — mais un audit manuel ne survit pas au prochain jeton ajouté. Le piège
 * vit désormais dans ce dépôt : c est ce contrôle qui le tient, pas la vigilance.
 *
 * LA RÈGLE. Un `@utility` de notre CSS ne doit jamais porter un nom qu un jeton
 * de thème produit déjà. Si le nom est pris, on suffixe (`bg-grid-dense`) ou on
 * passe par un jeton plutôt que par un utilitaire.
 *
 * SECONDE FAMILLE — v0.24.0 : une CLASSE DU SOCLE qui porte le nom d'un utilitaire NATIF.
 * Le sur-titre neutre est sorti en v0.23.0 sous le nom `.overline` — qui est AUSSI un
 * utilitaire statique de Tailwind (`text-decoration-line: overline`). Chez l'app, dès que
 * le mot apparaissait dans son code, Tailwind générait l'utilitaire en `layer(utilities)` :
 * il gagnait sur la classe du socle (`layer(base)`), et chaque sur-titre recevait un trait
 * au-dessus. Ni le build, ni les types, ni la vitrine ne l'ont vu — la vitrine elle-même
 * portait les deux règles. C'est le site qui l'a remonté.
 * Le contrôle DÉRIVE la vérité au lieu de la recopier : il compile `theme.css` exactement
 * comme une app le reçoit, puis demande au compilateur Tailwind de construire chaque nom
 * de classe déclaré par le CSS du socle. Si le compilateur en sort une règle, le nom est
 * pris. Un candidat que `theme.css` interdit au scanner (`@source not inline`) n'est plus
 * généré : c'est la seule façon légitime de garder un tel nom — le temps d'un alias.
 * Jumeau de falsification rejoué à chaque appel : un détecteur qui ne reconnaît plus
 * `flex` rendrait le garde toujours vert, donc décoratif.
 *
 * Lancé par `npm run lint`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(ICI, 'src', 'styles');

/**
 * Namespace de thème → préfixes d utilitaires qu il génère.
 *
 * Volontairement NON exhaustif sur les namespaces exotiques : il couvre ceux que
 * ce paquet déclare (`--color-*`, `--text-*`, `--font-*`, `--font-weight-*`,
 * `--tracking-*`, `--leading-*`, `--radius-*`, `--shadow-*`, `--spacing-*`,
 * `--container-*`, `--ease-*`) plus quelques voisins probables. Ajouter un
 * namespace au thème demande d ajouter sa ligne ici — c est le prix d un
 * contrôle qui ne ment pas plutôt que d un contrôle qui devine.
 *
 * `font-weight` est piégeux et absent de la version Videapro : ses jetons
 * génèrent des classes en `font-`, exactement comme `--font-*`. `--font-weight-
 * medium` produit `font-medium`, pas `font-weight-medium`.
 */
const NAMESPACES = {
  color: [
    'bg', 'text', 'border', 'ring', 'fill', 'stroke', 'outline', 'decoration',
    'accent', 'caret', 'shadow', 'divide', 'from', 'via', 'to', 'placeholder',
  ],
  spacing: [
    'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'ps', 'pe',
    'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'ms', 'me',
    'w', 'h', 'size', 'min-w', 'min-h', 'max-w', 'max-h',
    'gap', 'gap-x', 'gap-y', 'space-x', 'space-y',
    'inset', 'inset-x', 'inset-y', 'top', 'right', 'bottom', 'left', 'start', 'end',
    'translate-x', 'translate-y', 'basis', 'indent',
    'scroll-m', 'scroll-p',
  ],
  container: ['max-w', 'w', 'min-w'],
  radius: [
    'rounded', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l',
    'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl',
    'rounded-s', 'rounded-e', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es',
  ],
  shadow: ['shadow'],
  'inset-shadow': ['inset-shadow'],
  'drop-shadow': ['drop-shadow'],
  'text-shadow': ['text-shadow'],
  text: ['text'],
  font: ['font'],
  'font-weight': ['font'],
  tracking: ['tracking'],
  leading: ['leading'],
  ease: ['ease'],
  animate: ['animate'],
  aspect: ['aspect'],
  blur: ['blur', 'backdrop-blur'],
  perspective: ['perspective'],
};

/**
 * Masque les commentaires CSS, EN PRÉSERVANT LES POSITIONS.
 *
 * Sans ça le contrôle se ment à lui-même, et le cas est réel : l en-tête de
 * `theme.css` explique `@theme inline` contre `@theme` nu, il contient donc le
 * littéral `@theme` plusieurs fois EN COMMENTAIRE. La recherche de bloc
 * (`/@theme[^{]*\{/`) s ancrait sur l une de ces mentions, consommait jusqu à
 * l accolade suivante — celle du vrai bloc — et lisait le bon corps PAR ACCIDENT.
 *
 * Deux conséquences, mesurées : renommer l en-tête du vrai bloc en `@nope inline`
 * ne déclenchait AUCUNE alerte, le script annonçant 115 jetons dans un fichier qui
 * n en déclarait plus aucun ; et un commentaire mentionnant `@theme` placé avant
 * une accolade étrangère aurait ancré le parseur sur la mauvaise région, donc fait
 * extraire MOINS de clés — le contrôle devenant aveugle à de vraies collisions,
 * tout en restant vert.
 *
 * Chaque caractère de commentaire devient une espace, SAUF les sauts de ligne :
 * longueur et découpage en lignes sont conservés, donc les numéros de ligne des
 * messages d erreur restent exacts.
 */
function sansCommentaires(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (bloc) => bloc.replace(/[^\n]/g, ' '));
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.css')) out.push(full);
  }
  return out;
}

/**
 * Les clés déclarées DANS un bloc `@theme` — et elles seules.
 *
 * Une variable posée dans `:root` par `tokens/*.css` (`--card-pad`, `--brand-from`)
 * ne génère AUCUN utilitaire : la confondre avec une clé de thème produirait des
 * fausses alertes en rafale, ce dépôt en déclare 124. On suit donc les accolades
 * pour ne lire que l intérieur des `@theme` — `inline` compris.
 *
 * Les modificateurs de palier (`--text-heading--line-height`) sont ramenés à leur
 * clé racine : ils ne génèrent pas de classe à eux seuls.
 */
function clesDeTheme(source) {
  const cles = new Set();
  const re = /@theme[^{]*\{/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    let profondeur = 1;
    let i = re.lastIndex;
    const debut = i;
    while (i < source.length && profondeur > 0) {
      if (source[i] === '{') profondeur++;
      else if (source[i] === '}') profondeur--;
      i++;
    }
    const corps = source.slice(debut, i - 1);
    for (const d of corps.matchAll(/^[ \t]*--([a-z0-9-]+)\s*:/gm)) {
      cles.add(d[1].split('--')[0]);
    }
  }
  return cles;
}

/**
 * `[ \t]*` et non `\s*` : `\s` accepte le saut de ligne, donc le motif pouvait
 * s ancrer sur une ligne ANTÉRIEURE faite de blancs et la traverser — le décalage
 * saute aux yeux depuis le masquage des commentaires, qui transforme chaque ligne
 * de commentaire en une ligne de pures espaces. Mesuré : 266 annoncé pour un
 * `@utility` réellement en 268. Le numéro de ligne doit désigner la déclaration,
 * pas le blanc qui la précède.
 */
function utilitaires(source, file) {
  return [...source.matchAll(/^[ \t]*@utility\s+([a-zA-Z0-9-]+)/gm)].map((m) => ({
    nom: m[1],
    file,
    ligne: source.slice(0, m.index).split('\n').length,
  }));
}

/* Collecte GLOBALE, pas fichier par fichier : le jeton peut vivre dans un fichier
   et l utilitaire dans un autre. La collision, elle, est à l échelle de la
   feuille de style compilée. */
const cles = new Set();
const utils = [];
for (const file of walk(ROOT)) {
  /* Masquage AVANT toute analyse : ni un `@theme` ni un `@utility` cité dans un
     commentaire ne doit compter comme une déclaration. */
  const source = sansCommentaires(readFileSync(file, 'utf8'));
  for (const c of clesDeTheme(source)) cles.add(c);
  utils.push(...utilitaires(source, relative(ICI, file)));
}

/* Garde-fou du garde-fou : si le contrôle ne lit plus rien, il passerait au vert
   à vide. Un déplacement de theme.css doit casser bruyamment, pas se taire. */
if (cles.size === 0) {
  console.error('\n✗ aucun bloc @theme trouvé sous src/styles — chemin cassé ?');
  console.error('  Le contrôle ne peut rien garantir dans cet état.\n');
  process.exit(1);
}

const collisions = [];
for (const { nom, file, ligne } of utils) {
  for (const [namespace, prefixes] of Object.entries(NAMESPACES)) {
    for (const prefixe of prefixes) {
      if (!nom.startsWith(prefixe + '-')) continue;
      const cle = namespace + '-' + nom.slice(prefixe.length + 1);
      if (cles.has(cle)) collisions.push({ file, ligne, nom, cle: '--' + cle, prefixe });
    }
  }
}

/* ══════════════════════════════════════════════════════════════════════════════
 * SECONDE FAMILLE — les classes du socle face aux utilitaires NATIFS de Tailwind.
 * ══════════════════════════════════════════════════════════════════════════════ */

/** Les noms de classe DÉCLARÉS par une feuille : ceux des sélecteurs, jamais ceux qu'un
 *  commentaire ou une valeur mentionne. Le prélude de chaque `{` est lu ; les at-rules
 *  (`@media`, `@layer`, `@utility`…) n'en sont pas. */
function classesDeclarees(source) {
  const noms = new Set();
  const propre = sansCommentaires(source);
  const re = /([^{};]*)\{/g;
  let m;
  while ((m = re.exec(propre)) !== null) {
    const prelude = m[1].trim();
    if (!prelude || prelude.startsWith('@')) continue;
    for (const c of prelude.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) noms.add(c[1]);
  }
  return noms;
}

const require = createRequire(import.meta.url);
let compile;
try { ({ compile } = await import('tailwindcss')); }
catch {
  console.error('\n✗ tailwindcss introuvable — le contrôle des noms natifs ne peut pas tourner.\n');
  process.exit(1);
}
async function loadStylesheet(id, base) {
  const chemin = id.startsWith('.') ? resolve(base, id) : require.resolve(id, { paths: [base] });
  return { path: chemin, base: dirname(chemin), content: readFileSync(chemin, 'utf8') };
}
const THEME = join(ROOT, 'theme.css');
async function compilateur(css) {
  return compile(css, { base: ROOT, loadStylesheet });
}
/** Les noms, parmi `noms`, pour lesquels le compilateur sort une règle `.nom{…}`. */
function natifs(compiled, noms) {
  const sortie = compiled.build([...noms]);
  const pris = new Set();
  for (const m of sortie.matchAll(/(?:^|[\s,}])\.([\w-]+)\s*\{/g)) if (noms.has(m[1])) pris.add(m[1]);
  return pris;
}

/* Le jumeau de falsification — rejoué à chaque appel, AVANT de juger le dépôt. */
const themeSource = readFileSync(THEME, 'utf8');
const sansInterdits = themeSource.replace(/^[ \t]*@source\s+not\s+inline\([^)]*\);?/gm, '');
const temoin = await compilateur(sansInterdits);
const casTemoins = new Set(['flex', 'hidden', 'overline', 'ds-overline', 'eyebrow', 'accent']);
const vusTemoins = natifs(temoin, casTemoins);
const extraits = classesDeclarees('/* .commentaire{} */ .a,.b:hover>.c{x:1} @media (x){.d{y:2}} @utility e{z:3}');
const falsification = [
  ['`flex` reconnu natif', vusTemoins.has('flex')],
  ['`hidden` reconnu natif', vusTemoins.has('hidden')],
  ['`overline` reconnu natif sans interdiction', vusTemoins.has('overline')],
  ['`ds-overline` reconnu libre', !vusTemoins.has('ds-overline')],
  ['`eyebrow` reconnu libre', !vusTemoins.has('eyebrow')],
  ['`accent` nu reconnu libre', !vusTemoins.has('accent')],
  ['extracteur : a, b, c, d — et ni commentaire ni @utility', ['a', 'b', 'c', 'd'].every((n) => extraits.has(n)) && !extraits.has('commentaire') && !extraits.has('e')],
];
const rate = falsification.filter(([, ok]) => !ok);
if (rate.length) {
  console.error('\n✗ jumeau de falsification — le détecteur de noms natifs ne voit plus juste :');
  for (const [cas] of rate) console.error('    ' + cas);
  console.error('  Un détecteur aveugle rend le garde toujours vert : corrige-le avant tout.\n');
  process.exit(1);
}

/* Le jugement : les classes déclarées par le CSS du socle, compilées contre theme.css TEL
   QU'UNE APP LE REÇOIT — interdictions comprises. */
const declarees = new Map();
for (const file of walk(ROOT)) {
  for (const nom of classesDeclarees(readFileSync(file, 'utf8'))) {
    if (!declarees.has(nom)) declarees.set(nom, relative(ICI, file));
  }
}
const reel = await compilateur(themeSource);
const prises = natifs(reel, new Set(declarees.keys()));
const tolerees = [...natifs(temoin, new Set(declarees.keys()))].filter((n) => !prises.has(n));

if (collisions.length === 0 && prises.size === 0) {
  console.log(
    `✓ utilitaires : aucun des ${utils.length} @utility ne recouvre une classe générée ` +
      `par l un des ${cles.size} jetons de thème · aucune des ${declarees.size} classes du socle ` +
      `ne porte le nom d un utilitaire natif` +
      (tolerees.length ? ` (${tolerees.map((n) => '.' + n).join(', ')} : interdit au scanner, alias à durée limitée)` : '') +
      ` · jumeau prouvé sur ${falsification.length} cas`,
  );
  process.exit(0);
}

for (const nom of prises) {
  console.error(
    `\n✗ ${declarees.get(nom)} déclare la classe « .${nom} » — c'est AUSSI un utilitaire natif de Tailwind.\n` +
      `    Chez l'app, dès que le mot apparaît dans son code, Tailwind génère l'utilitaire en\n` +
      `    layer(utilities) : il gagne sur la classe du socle, en silence (le cas .overline, v0.23.0).\n` +
      `    Renomme-la avec le préfixe « ds- ». Un ancien nom ne survit qu'en alias, une version,\n` +
      `    avec @source not inline("${nom}") dans theme.css.`,
  );
}
if (prises.size && collisions.length === 0) { console.error(''); process.exit(1); }

if (collisions.length === 0) {
  console.log(
    `✓ utilitaires : aucun des ${utils.length} @utility ne recouvre une classe générée ` +
      `par l un des ${cles.size} jetons de thème`,
  );
  process.exit(0);
}

console.error(`\n✗ ${collisions.length} collision(s) @utility / namespace de thème\n`);
for (const c of collisions) {
  console.error(
    `  ${c.file}:${c.ligne}  @utility ${c.nom}\n` +
      `    ${c.cle} génère déjà « ${c.nom} » (préfixe « ${c.prefixe}- »).\n` +
      `    Les deux déclarations FUSIONNENT dans la même règle et la dernière gagne :\n` +
      `    ta déclaration disparaît en silence.\n`,
  );
}
console.error(
  `  Renomme l utilitaire (suffixe explicite, ex. « ${collisions[0].nom}-dense »),\n` +
    `  ou passe par un jeton de thème au lieu d un @utility.\n`,
);
process.exit(1);
