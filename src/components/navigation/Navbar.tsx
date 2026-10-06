import { useEffect, useId, useState, version } from 'react';
import type { CSSProperties, JSX, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';
import { Icon } from '../icons/Icon';
import { IconButton } from '../actions/IconButton';
import { BRAND_NAME } from '../../brand';

/**
 * Sticky top bar: logo left, links centre, CTA right. Sits on --secondary with a
 * hairline bottom border AT ALL TIMES — it is a control detached from the layout,
 * never transparent. On scroll it tints (color-mix on --secondary), adds
 * backdrop-filter blur(10px) and a shadow. Blur is the only place the system uses
 * backdrop-filter. No glassmorphism anywhere else.
 */
export interface NavLink { label: string; href?: string; active?: boolean }

export interface NavbarProps {
  links?: NavLink[];
  cta?: ReactNode;
  /**
   * La marque, à gauche. Défaut : le `Logo` du paquet, à la bonne hauteur.
   * Un projet passe la sienne ici — mot-marque, image, ce qu'il veut — sans ouvrir le socle.
   */
  brand?: ReactNode;
  /** Cible du lien de marque. Défaut '#'. */
  homeHref?: string;
  /** Libellé accessible du lien de marque. Défaut : `BRAND_NAME` de `src/brand.ts`, suivi
   *  de « — accueil ». Aucun nom n'est écrit en dur ici. */
  homeLabel?: string;
  /** Force la couleur des lettres du `Logo` par défaut — voir `LogoProps.letters`.
   *  Sans effet si vous passez votre propre `brand`. */
  letters?: 'dark' | 'light';
  /** Force the scrolled state (specimen cards / screenshots). */
  scrolled?: boolean;
  className?: string;
  /** Rendu dans l'emplacement de DROITE, juste AVANT `cta` — pour poser une action de plus
   *  (bascule de thème, sélecteur de langue) sans avoir à remplacer le CTA. */
  children?: ReactNode;
  /**
   * LE MENU REPLIÉ (v0.23.0) — OPT-IN : omise, la barre rend exactement le DOM d'avant.
   * `true` : sous 64rem, les liens et le `cta` quittent la barre ; un burger ouvre un
   * panneau qui les reprend, en colonne. `'always'` : la même chose à toute largeur.
   *
   * Le panneau est un `popover` NATIF : ouverture, fermeture par Échap ou clic extérieur,
   * focus rendu au burger et état « développé » sont tenus par le NAVIGATEUR. Aucun
   * JavaScript n'est nécessaire — la barre fonctionne rendue côté serveur sans hydratation.
   *
   * Seule limite : un lien d'ANCRE de la même page ne referme pas le panneau tout seul
   * (rien n'est « à l'extérieur »). Hydratée, la barre le referme au clic ; rendue sans
   * JS, c'est au site d'ajouter la ligne qui le fait (voir docs/PROMPTS.md § Navbar).
   */
  menu?: boolean | 'always';
  /** Nom accessible du burger et du panneau. Défaut « Menu ». */
  menuLabel?: string;
  /** Pied du panneau. Défaut : le `cta`, qui y passe en pleine largeur. `null` le retire. */
  menuFooter?: ReactNode;
}

/* `popoverTarget` est l'orthographe de React 19 ; React 18 ne connaît pas la propriété et
   attend l'attribut brut en minuscules. Les deux rendent le même attribut HTML (insensible
   à la casse) — on choisit celle que la version présente reconnaît, pour n'émettre aucun
   avertissement ni dans l'une ni dans l'autre. */
const POPOVER_TARGET = version.startsWith('18.') ? 'popovertarget' : 'popoverTarget';

/* Hydratée, la barre referme son panneau quand on suit un lien — sans ça, une ancre de la
   même page défile SOUS un panneau resté ouvert. */
function fermerPanneau(e: MouseEvent<HTMLAnchorElement>): void {
  const panneau = e.currentTarget.closest('[popover]') as (HTMLElement & { hidePopover?: () => void }) | null;
  panneau?.hidePopover?.();
}

export function Navbar({
  links = [], cta, brand, homeHref = '#', homeLabel = BRAND_NAME + ' — accueil', letters,
  scrolled: forced, className = '', children,
  menu = false, menuLabel = 'Menu', menuFooter,
}: NavbarProps): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (forced !== undefined) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [forced]);
  const isScrolled = forced !== undefined ? forced : scrolled;

  /* `useId` : identique au rendu serveur et à l'hydratation. Il sert d'id au panneau et
     de nom d'ancre CSS — un nom d'ancre est un <dashed-ident>, d'où le nettoyage. */
  const uid = useId();
  const menuId = 'ds-navbar-menu' + uid.replace(/[^a-zA-Z0-9_-]/g, '');
  const anchor = '--' + menuId;
  const avecMenu = menu !== false;
  const pied = menuFooter === undefined ? cta : menuFooter;

  /* aria-current : le lien actif est la page qu'on lit (v0.23.0). La couleur et la graisse
     le disaient aux yeux ; l'attribut le dit au lecteur d'écran. */
  const lien = (l: NavLink, dansPanneau: boolean): JSX.Element => (
    <a
      key={l.label}
      href={l.href || '#'}
      className={cn('ds-navlink', l.active && 'is-active')}
      aria-current={l.active ? 'page' : undefined}
      onClick={dansPanneau ? fermerPanneau : undefined}
    >
      {l.label}
    </a>
  );

  return (
    <header
      className={cn(
        'ds-navbar', isScrolled && 'is-scrolled',
        avecMenu && 'ds-navbar--menu', menu === 'always' && 'ds-navbar--menu-always',
        className,
      )}
      style={avecMenu ? ({ anchorName: anchor } as CSSProperties) : undefined}
    >
      <div className="page ds-navbar__inner">
        <a href={homeHref} aria-label={homeLabel}>
          {brand ?? <Logo variant="wordmark" letters={letters} height="1.375rem" />}
        </a>
        <nav className="ds-navbar__links">
          {links.map(l => lien(l, false))}
        </nav>
        <div className="ds-navbar__cta">
          {children}
          {avecMenu ? (cta ? <div className="ds-navbar__cta-main">{cta}</div> : null) : cta}
          {avecMenu ? (
            <IconButton
              variant="secondary"
              label={menuLabel}
              className="ds-navbar__burger"
              {...{ [POPOVER_TARGET]: menuId }}
            >
              <Icon name="menu" />
            </IconButton>
          ) : null}
        </div>
      </div>
      {avecMenu ? (
        <div
          id={menuId}
          popover="auto"
          className="ds-navbar__menu"
          style={{ positionAnchor: anchor } as CSSProperties}
        >
          <nav className="ds-navbar__menu-links" aria-label={menuLabel}>
            {links.map(l => lien(l, true))}
          </nav>
          {pied ? <div className="ds-navbar__menu-foot">{pied}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
