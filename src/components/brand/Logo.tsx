import type { CSSProperties, HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { BRAND_MONOGRAM, BRAND_WORDMARK_LINES } from '../../brand';

/**
 * La marque, rendue en CSS : capitales de `--font-display` + une pastille carrée à
 * coins arrondis en dégradé (côté ~0.21em, rayon 25 %, lueur `--shadow-logo-dot` —
 * voir tokens/base.css). La pastille garde le dégradé de marque sur tous les fonds ;
 * seules les lettres s'inversent.
 *
 * PARAMÉTRÉ POUR LE TEMPLATE. Le mot-marque, le monogramme, la pastille et le libellé
 * accessible sont des props ; aucun nom n'est codé en dur dans une règle CSS.
 *
 *     <Logo wordmark={['Acme','Studio']} />
 *     <Logo wordmark="Acme" dot={false} />
 *     <Logo wordmark="Acme" dot={<img src="/mark.svg" alt="" height={12} />} />
 *
 * LES DÉFAUTS VIENNENT DE `src/brand.ts` — le seul endroit du paquet où une identité
 * textuelle est écrite. Un projet client remplace ce fichier-là, pas celui-ci.
 *
 * Ne jamais fausse-grasser, contourer ni interlettrer le mot-marque : la casse et la
 * graisse suivent --heading-transform / --heading-weight, comme tout le titrage.
 *
 * CENTRÉ SUR L'ENCRE (v0.25.1). Le texte est rendu dans `.ds-logo__text`, rogné de la
 * hauteur de capitale à la ligne de base (`text-box: trim-both cap alphabetic`) : la boîte
 * du logo EST l'encre des capitales, et un parent qui la centre centre les lettres — pas
 * une boîte de ligne qui garde, vide, la place des jambages. La pastille se pose sur la
 * ligne de base. Repli sans `text-box` (Firefox) : tokens/base.css.
 */
export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `dot` (v0.21.0) : LA PASTILLE SEULE, sans lettre — le point de marque en tête d'un
   * `Rail`. C'est le même nœud `.ds-logo__dot` (même dégradé, même rayon 25 %, même
   * lueur), dimensionné à `height` au lieu de suivre un corps de texte. Relevé sur les
   * maquettes v2 d'une app : 1.75rem en tête du rail. Pas un second dessin de la marque.
   */
  variant?: 'wordmark' | 'stacked' | 'monogram' | 'dot';
  /**
   * Force la couleur des LETTRES : `dark` = lettres sombres (sur une surface claire),
   * `light` = lettres claires (sur une surface sombre). Omise, elles suivent le
   * `--foreground` de la surface et s'inversent toutes seules — c'est le défaut.
   *
   * Elle s'appelait autrement en v0.4, avec des valeurs qui nommaient une matière.
   * Renommée en v0.5.0, sur trois motifs : l'ancienne valeur sombre ne renvoyait plus à
   * aucun jeton depuis que les neutres se nomment
   * `--tone-dark` / `--tone-light` ; `tone` portait deux sens dans l'API publique —
   * sémantique sur Badge, Toast, Banner et Pastille, matière ici ; et `letters="light"`
   * n'a qu'une lecture possible, là où `tone="light"` sur un logo peut se lire
   * « mode sombre ».
   */
  letters?: 'dark' | 'light';
  /** Longueur CSS, toujours en rem — hauteur totale de la marque (le font-size en découle). */
  height?: string;
  /**
   * Le mot-marque. Une chaîne, ou un mot par ligne pour la variante `stacked`.
   * Défaut : `BRAND_WORDMARK_LINES` de `src/brand.ts`.
   */
  wordmark?: string | readonly string[];
  /** Le monogramme. Défaut : `BRAND_MONOGRAM` de `src/brand.ts`, ou les initiales si un
   *  autre mot-marque est passé. */
  monogram?: string;
  /** La pastille. `false` la retire ; un nœud la remplace. Défaut : la pastille CSS en dégradé. */
  dot?: ReactNode | false;
  /** Libellé accessible. Défaut : le mot-marque, mots joints par une espace. */
  label?: string;
}

export function Logo({
  variant = 'wordmark', letters, height = '1.75rem',
  wordmark = BRAND_WORDMARK_LINES, monogram, dot, label,
  className = '', style, ...rest
}: LogoProps): JSX.Element {
  const words = typeof wordmark === 'string' ? [wordmark] : [...wordmark];
  const name = label ?? words.join(' ');
  /* Le monogramme se DÉRIVE des initiales dès qu'un appel fournit son propre mot-marque ;
     celui de `src/brand.ts` a le sien, écrit — des initiales déduites ne sont pas toujours
     celles qu'une marque emploie. */
  const initials = monogram
    ?? (wordmark === BRAND_WORDMARK_LINES ? BRAND_MONOGRAM : words.map((w) => w.slice(0, 1)).join(''));
  const color = letters === 'light' ? 'var(--tone-light)' : letters === 'dark' ? 'var(--tone-dark)' : 'var(--foreground)';
  /* `dot === undefined` = la pastille par défaut ; `false` = aucune ; sinon le nœud fourni. */
  const mark = dot === false ? null
    : dot === undefined ? <span aria-hidden="true" className="ds-logo__dot" />
    : dot;
  const base: CSSProperties = { fontSize: 'calc(' + height + ' * 1.25)', color, ...style };

  if (variant === 'dot') {
    /* Le font-size EST la hauteur : .ds-logo--dot pose la pastille à 1em (tokens/base.css).
       role="img" + le libellé : la pastille seule est une image de la marque, pas un texte. */
    return (
      <span className={cn('ds-logo', 'ds-logo--dot', className)} style={{ fontSize: height, color, ...style }} role="img" aria-label={name} {...rest}>
        {mark}
      </span>
    );
  }
  if (variant === 'monogram') {
    return (
      <span className={cn('ds-logo', className)} style={base} aria-label={name} {...rest}>
        <span className="ds-logo__text">{initials}</span>{mark}
      </span>
    );
  }
  if (variant === 'stacked') {
    /* Seuls les BORDS du bloc sont rognés — le haut de la première ligne, le bas de la
       dernière : l'écart entre les lignes ne bouge pas. */
    const n = words.length;
    const rogne = (i: number) => n === 1 ? 'ds-logo__text'
      : i === 0 ? 'ds-logo__text ds-logo__text--haut'
      : i === n - 1 ? 'ds-logo__text ds-logo__text--bas'
      : 'ds-logo__text ds-logo__text--milieu';
    return (
      <span
        className={cn('ds-logo', className)}
        style={{ ...base, flexDirection: 'column', alignItems: 'flex-start', gap: '0.08em' }}
        aria-label={name}
        {...rest}
      >
        {words.slice(0, -1).map((w, i) => <span key={w} className={rogne(i)}>{w}</span>)}
        <span style={{ display: 'inline-flex', alignItems: 'flex-end' }}><span className={rogne(n - 1)}>{words[n - 1]}</span>{mark}</span>
      </span>
    );
  }
  return (
    <span className={cn('ds-logo', className)} style={base} aria-label={name} {...rest}>
      <span className="ds-logo__text">{words.join(' ')}</span>{mark}
    </span>
  );
}
