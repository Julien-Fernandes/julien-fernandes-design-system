import type { CSSProperties, HTMLAttributes, JSX } from 'react';
import { cn } from '../../lib/cn';

/**
 * Halo radial — l'atmosphère de la marque. Ancré en bas par défaut, jamais plein écran,
 * jamais un grand aplat dégradé. À poser dans une section `position:relative`, derrière
 * le contenu.
 * Les dégradés viennent des utilitaires `.halo` / `.halo-top` / `.halo-center` de
 * tokens/base.css — aucune valeur n'est réécrite ici.
 *
 * Le mode `hot` N'EST PLUS ICI : c'est un halo de MINIATURE, pas d'interface. Il vit dans
 * l'extension métier, sous `HaloHot`, sur `@julienfernandes/ds/brand-content`.
 */
export interface HaloProps extends HTMLAttributes<HTMLSpanElement> {
  placement?: 'bottom' | 'top' | 'center';
  /** Multiplicateur d'opacité, 0 à 1. Défaut 1. */
  intensity?: number;
  /**
   * L'ÉTENDUE (v0.23.0). `section` (défaut) = le halo de la marque tel quel, en pour-cent
   * de la section. `wide` = 1,6 fois plus large et plus haut : il couvre une section courte.
   * `contained` = plafonné à la colonne de page (`--container-shell`) : sur grand écran il
   * reste sous le contenu au lieu de suivre la fenêtre. Mêmes couleurs dans les trois cas —
   * c'est le dégradé de la marque, redimensionné ; aucune valeur n'est écrite ici.
   */
  extent?: 'section' | 'wide' | 'contained';
}

export function Halo({
  placement = 'bottom', intensity = 1, extent = 'section', className = '', style, ...rest
}: HaloProps): JSX.Element {
  const base: CSSProperties = {
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: intensity, ...style,
  };
  return (
    <span
      aria-hidden="true"
      className={cn(
        'halo', placement === 'top' && 'halo-top', placement === 'center' && 'halo-center',
        extent === 'wide' && 'halo--wide', extent === 'contained' && 'halo--contained', className,
      )}
      style={base}
      {...rest}
    />
  );
}
