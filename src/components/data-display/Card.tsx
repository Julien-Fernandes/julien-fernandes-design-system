import { useEffect, useRef } from 'react';
import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react';
import { cva } from 'class-variance-authority';

/**
 * The signature surface: tinted --card fill, 1px --border, generous padding, tinted shadow.
 * Never pure white. Interactive cards lift translateY(-2px) to --shadow-md on hover.
 * Passing any header slot renders the header block; passing none renders exactly as before.
 */

/* ---------------------------------------------------------------------------
   L'EN-TÊTE — UN SEUL AU SOCLE, v0.21.0.
   Il vivait dans le JSX de Card. Il en sort en composant nommé, exporté depuis ce
   fichier, pour deux raisons : Modal le rend (pastille · titre + sous-titre · croix sur
   UNE ligne, ce que les maquettes v2 d'une app dessinent), et une app peut le poser
   seule en tête d'une zone qui n'est pas une Card. Card continue de le composer par ses
   props — l'API de Card ne bouge pas.
   Un réglage nouveau, relevé sur ces maquettes : `flush` — le mode à FILET, padding propre
   (--space-4 --space-5) et border-bottom, marge basse à zéro. C'est l'en-tête d'une
   `Card flush`, dont le corps porte son propre padding.
   PAS DE CRAN DE TITRE SUPPLÉMENTAIRE : les crans restent `sm` (--text-heading-sm,
   1.125rem, le plus petit palier de la display) et `lg`. Les maquettes posent leur h3 à
   --text-control, un palier de CONTRÔLE — c'est une approximation de l'outil, pas une
   décision de marque, et l'interdit « jamais --font-display sous 1.125rem » tient.
   --------------------------------------------------------------------------- */
export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header slot — gradient caps line above the title. */
  eyebrow?: ReactNode;
  /**
   * Le ton du sur-titre (v0.23.0). `brand` (défaut) = `.eyebrow`, le dégradé de marque ;
   * `neutral` = `.overline`, le même gabarit à l'encre (`currentColor`) — le libellé de
   * section d'une carte de réglages, d'une fiche. Un seul des deux par nœud, jamais les deux.
   */
  eyebrowTone?: 'brand' | 'neutral';
  /** Header slot — pass a <Pastille size="carte"> (or size="dialogue" in a Modal). */
  icon?: ReactNode;
  /** Header slot — display face, casse et graisse selon --heading-transform / --heading-weight, jamais sous 1.125rem. */
  title?: ReactNode;
  /** Header slot — one muted line under the title. */
  subtitle?: ReactNode;
  /** Header slot — trailing control (IconButton, Button, chevron, the close button of a Modal), pushed right. */
  action?: ReactNode;
  /** sm = --text-heading-sm (default) · lg = --text-subheading. Never below 1.125rem. */
  titleSize?: 'sm' | 'lg';
  /** normal = --space-4 gutter under the header · airy = --space-6, for a card of blocks. Ignored by `flush`. */
  headerGap?: 'normal' | 'airy';
  /**
   * Le mode à FILET (v0.21.0) : padding --space-4 --space-5, border-bottom --border, aucune
   * marge basse — l'en-tête d'une `Card flush`, dont le corps porte son propre padding.
   * Relevé sur quinze en-têtes de carte des maquettes v2 d'une app.
   */
  flush?: boolean;
}

export function CardHeader({
  eyebrow, eyebrowTone = 'brand', icon, title, subtitle, action, titleSize = 'sm', headerGap = 'normal',
  flush = false, className = '', ...rest
}: CardHeaderProps): JSX.Element | null {
  /* Aucun slot passé = aucun noeud émis. C'est la condition de non-régression de Card :
     le DOM d'une Card sans en-tête est identique à celui d'avant la v0.4. */
  if (!(eyebrow || icon || title || subtitle || action)) return null;
  return (
    /* L'alignement est DÉCIDÉ ICI, jamais au site d'appel (v0.18.0) : titre simple
       -> centré ; titre + sous-titre -> --stacked (flex-start), l'action s'aligne
       sur le titre au lieu de flotter entre les deux lignes. Voir la règle et son
       relevé au-dessus de .ds-card__header dans patterns.css. */
    <div
      className={[
        'ds-card__header',
        subtitle ? 'ds-card__header--stacked' : '',
        !flush && headerGap === 'airy' ? 'ds-card__header--airy' : '',
        flush ? 'ds-card__header--flush' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon}
      {(eyebrow || title || subtitle) ? (
        <div className="ds-card__header-main">
          {eyebrow ? <span className={eyebrowTone === 'neutral' ? 'overline' : 'eyebrow'}>{eyebrow}</span> : null}
          {title ? (
            <h3 className={['ds-card__title', titleSize === 'lg' ? 'ds-card__title--lg' : ''].filter(Boolean).join(' ')}>
              {title}
            </h3>
          ) : null}
          {subtitle ? <div className="ds-card__subtitle">{subtitle}</div> : null}
        </div>
      ) : null}
      {action ? <div className="ds-card__action">{action}</div> : null}
    </div>
  );
}

/* Omit<'title'> : l'attribut HTML `title` est une string, notre slot est un ReactNode.
   Même traitement que EmptyStateProps, qui a le même conflit depuis la v0.1.0. */
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** default = static · interactive = clickable (lift on hover) · feature = --grad-soft wash + orange border. */
  variant?: 'default' | 'interactive' | 'feature';
  /** md = radius lg / padding 1.5rem · lg = radius xl / padding 1.75rem. */
  size?: 'md' | 'lg';
  /**
   * Removes padding and clips children — for cards with a full-bleed media top, or a
   * table at the edge. With header slots, the header takes its FLUSH mode by itself
   * (v0.21.0): own padding, a rule under it, no gutter — the body carries its padding.
   */
  flush?: boolean;
  /** Header slot — gradient caps line above the title. */
  eyebrow?: ReactNode;
  /** Le ton du sur-titre — voir `CardHeaderProps.eyebrowTone`. Défaut `brand`. */
  eyebrowTone?: 'brand' | 'neutral';
  /** Header slot — pass a <Pastille size="carte">. */
  icon?: ReactNode;
  /** Header slot — display face, casse et graisse selon --heading-transform / --heading-weight, jamais sous 1.125rem. */
  title?: ReactNode;
  /** Header slot — one muted line under the title. */
  subtitle?: ReactNode;
  /** Header slot — trailing control (IconButton, Button, chevron), pushed right. */
  action?: ReactNode;
  /** sm = --text-heading-sm (default) · lg = --text-subheading. */
  titleSize?: 'sm' | 'lg';
  /** normal = --space-4 gutter under the header · airy = --space-6, for a card of blocks. */
  headerGap?: 'normal' | 'airy';
  as?: keyof JSX.IntrinsicElements;
  /**
   * LA CARTE-LIEN (v0.23.0) : la carte ENTIÈRE devient un `<a href>` — une seule cible au
   * clavier, au pointeur et au lecteur d'écran. Elle prend `variant="interactive"` si aucun
   * variant n'est passé, et un anneau de focus visible quel que soit le variant.
   * ⚠️ UN SEUL LIEN : ne posez AUCUN lien ni bouton à l'intérieur (un `<a>` dans un `<a>` est
   * du HTML invalide, et deux cibles imbriquées ne s'atteignent pas au clavier). Le
   * composant le signale en console en développement. Le texte du lien est le contenu de la
   * carte : gardez-le court, un titre suffit au lecteur d'écran.
   */
  href?: string;
  /** Avec `href` seulement. */
  target?: string;
  /** Avec `href` seulement — `noopener noreferrer` pour un `target="_blank"` externe. */
  rel?: string;
  children?: ReactNode;
}

/* Même déclaration que dans ActionSheet : `process.env.NODE_ENV` est remplacé par le
   bundler de l'app, le socle ne dépend pas des types de Node. */
declare const process: { env: { NODE_ENV?: string } };

/* Ce qu'une carte-lien ne doit pas contenir : tout ce qui est soi-même une cible. */
const CIBLES = 'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';

const card = cva('ds-card', {
  variants: {
    variant: { default: '', interactive: 'ds-card--interactive', feature: 'ds-card--feature' },
    size: { md: '', lg: 'ds-card--lg' },
    flush: { true: 'ds-card--flush', false: '' },
  },
  defaultVariants: { variant: 'default', size: 'md', flush: false },
});

export function Card({
  variant, size = 'md', as, flush = false, href, target, rel,
  eyebrow, eyebrowTone = 'brand', icon, title, subtitle, action, titleSize = 'sm', headerGap = 'normal',
  className = '', children, ...rest
}: CardProps): JSX.Element {
  const Tag = (as ?? (href ? 'a' : 'div')) as ElementType;
  const v = variant ?? (href ? 'interactive' : 'default');
  const cls = [card({ variant: v, size, flush }), href ? 'ds-card--link' : '', className].filter(Boolean).join(' ');
  /* Filet de développement : un lien ou un bouton DANS une carte-lien est une seconde
     cible imbriquée — invalide, et inatteignable au clavier. Rien ne casse à l'écran :
     sans ce signal, personne ne le voit. */
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !href || !ref.current) return;
    const imbrique = ref.current.querySelector(CIBLES);
    if (imbrique) {
      console.warn(
        '[ds] Card href : la carte entière est déjà un lien, elle contient pourtant une autre cible ('
        + imbrique.tagName.toLowerCase() + '). Retirez-la, ou retirez `href` et gardez le lien à l\'intérieur.',
      );
    }
  }, [href]);
  return (
    <Tag ref={ref} className={cls} {...(href ? { href, target, rel } : null)} {...rest}>
      {/* Une carte `flush` qui a un en-tête le rend À FILET : c'est la carte qui le
          sait, pas le site d'appel — même logique que l'alignement (v0.18.0). */}
      <CardHeader
        eyebrow={eyebrow} eyebrowTone={eyebrowTone} icon={icon} title={title} subtitle={subtitle}
        action={action} titleSize={titleSize} headerGap={headerGap} flush={flush}
      />
      {children}
    </Tag>
  );
}
