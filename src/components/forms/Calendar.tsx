import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, JSX, KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';

/**
 * Month view, Monday-first, fr locale by default. Native Date + Intl only.
 * Selected day = --primary fill; today = --primary bold. Single date — no range.
 *
 * L'ACCESSIBILITÉ — v0.24.0. Jusqu'à la v0.23.0, les jours vivaient dans un
 * `role="grid"` sans lignes ni cellules : ARIA invalide (Lighthouse
 * `aria-required-children`), et annoncé de travers. La grille est désormais ce qu'elle
 * est : un GROUPE de boutons, nommé par le mois affiché. Chaque jour annonce sa date
 * COMPLÈTE (« lundi 13 octobre 2026 », dans la `locale`), l'état sélectionné
 * (`aria-pressed`), le jour courant (`aria-current="date"`) et l'indisponibilité (le
 * `disabled` natif). Les en-têtes de semaine sont décoratifs (`aria-hidden`) : le nom du
 * jour est dans chaque libellé.
 * Le CLAVIER : un seul arrêt de tabulation dans les jours (le jour choisi, sinon
 * aujourd'hui, sinon le premier jour disponible) ; les flèches déplacent d'un jour ou
 * d'une semaine, Début/Fin vont au lundi/dimanche, PageHaut/PageBas changent de mois
 * (+ Maj : d'année) — en sautant les jours indisponibles, en changeant de mois au
 * besoin, sans jamais sortir de `min` / `max`. Entrée ou Espace choisit.
 * Aucun changement visuel : même DOM de mise en page, mêmes classes.
 */
export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  disabledDates?: Date[];
  /** BCP 47 tag. Default 'fr-FR'. */
  locale?: string;
  /** Strips the card chrome (used inside DatePicker's popover). */
  bare?: boolean;
  /**
   * PLEINE LARGEUR (v0.23.0) : le calendrier prend la largeur de son conteneur et ses sept
   * colonnes se la partagent — un widget de réservation posé dans une carte. La hauteur
   * des cases ne change pas.
   */
  fluid?: boolean;
  /**
   * « AUJOURD'HUI », INJECTABLE (v0.23.0). Il sert au marquage `is-today` et au mois
   * affiché d'entrée quand aucune `value` n'est passée. Défaut : l'horloge de la machine
   * au moment du rendu — le comportement d'avant.
   * ⚠️ RENDU CÔTÉ SERVEUR : sans cette prop, « aujourd'hui » est le jour du BUILD (ou de la
   * requête), dans le fuseau du SERVEUR, et l'hydratation chez le visiteur ne corrige pas
   * les attributs divergents. Passez la date du jour du visiteur, ou montez le calendrier
   * côté client seulement.
   */
  today?: Date;
}

const strip = (d?: Date | null): Date | null =>
  d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
const key = (d?: Date | null): string =>
  d ? d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() : '';
const plusJours = (d: Date, n: number): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const plusMois = (d: Date, n: number): Date => {
  const dernier = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), dernier));
};

export function Calendar({
  value, onChange, min, max, disabledDates = [], locale = 'fr-FR', bare = false, fluid = false,
  today: todayProp, className = '', ...rest
}: CalendarProps): JSX.Element {
  const today = strip(todayProp ?? new Date())!;
  const [view, setView] = useState(() => { const b = value || today; return new Date(b.getFullYear(), b.getMonth(), 1); });
  useEffect(() => { if (value) setView(new Date(value.getFullYear(), value.getMonth(), 1)); }, [key(value)]);
  const fmtMonth = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // Monday-first headers — 2024-01-01 is a Monday
  const heads = Array.from({ length: 7 }, (_, i) => fmtDay.format(new Date(2024, 0, 1 + i)).replace('.', ''));
  const offset = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
  const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const badKeys = new Set(disabledDates.map(d => key(strip(d))));
  const lo = strip(min), hi = strip(max);
  const isDisabled = (d: Date) => (!!lo && d < lo) || (!!hi && d > hi) || badKeys.has(key(d));
  const move = (m?: number, y?: number) => setView(v => new Date(v.getFullYear() + (y || 0), v.getMonth() + (m || 0), 1));
  const selKey = key(strip(value));
  const fmtComplet = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const idMois = 'ds-cal' + useId().replace(/[^a-zA-Z0-9_-]/g, '') + '-mois';

  /* LE JOUR QUI PORTE L'ARRÊT DE TABULATION (tabindex 0) — tous les autres sont à -1.
     Le dernier jour focalisé s'il est dans la vue, sinon le jour choisi, sinon aujourd'hui,
     sinon le premier jour disponible du mois. */
  const [actif, setActif] = useState<string | null>(null);
  const jours = Array.from({ length: count }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1));
  const libres = jours.filter(d => !isDisabled(d)).map(key);
  const arret = [actif, selKey, key(today)].find(k => k && libres.includes(k)) ?? libres[0];

  /* Un déplacement au clavier vers un autre mois change la vue, PUIS rend le focus au jour
     visé — après le rendu, quand son bouton existe. */
  const boutons = useRef(new Map<string, HTMLButtonElement>());
  const aFocaliser = useRef<string | null>(null);
  useEffect(() => {
    if (!aFocaliser.current) return;
    boutons.current.get(aFocaliser.current)?.focus();
    aFocaliser.current = null;
  });

  const clavier = (e: KeyboardEvent<HTMLButtonElement>, d: Date): void => {
    let cible: Date;
    let pas: 1 | -1;
    switch (e.key) {
      case 'ArrowLeft': cible = plusJours(d, -1); pas = -1; break;
      case 'ArrowRight': cible = plusJours(d, 1); pas = 1; break;
      case 'ArrowUp': cible = plusJours(d, -7); pas = -1; break;
      case 'ArrowDown': cible = plusJours(d, 7); pas = 1; break;
      case 'Home': cible = plusJours(d, -((d.getDay() + 6) % 7)); pas = 1; break;
      case 'End': cible = plusJours(d, 6 - ((d.getDay() + 6) % 7)); pas = -1; break;
      case 'PageUp': cible = plusMois(d, e.shiftKey ? -12 : -1); pas = 1; break;
      case 'PageDown': cible = plusMois(d, e.shiftKey ? 12 : 1); pas = 1; break;
      default: return;
    }
    e.preventDefault();
    /* Un jour indisponible se saute, dans le sens du déplacement — jamais au-delà des
       bornes, jamais plus d'un an : au pire, le focus ne bouge pas. */
    for (let n = 0; n < 366 && isDisabled(cible); n++) {
      if ((lo && cible < lo && pas < 0) || (hi && cible > hi && pas > 0)) return;
      cible = plusJours(cible, pas);
    }
    if (isDisabled(cible)) return;
    const k = key(cible);
    setActif(k);
    if (cible.getMonth() !== view.getMonth() || cible.getFullYear() !== view.getFullYear()) {
      aFocaliser.current = k;
      setView(new Date(cible.getFullYear(), cible.getMonth(), 1));
    } else {
      boutons.current.get(k)?.focus();
    }
  };

  return (
    <div className={cn('ds-cal', bare && 'ds-cal--bare', fluid && 'ds-cal--fluid', className)} {...rest}>
      <div className="ds-cal__head">
        <button type="button" className="ds-cal__nav" aria-label="Année précédente" onClick={() => move(0, -1)}><Icon name="chevrons-left" size="1rem" /></button>
        <button type="button" className="ds-cal__nav" aria-label="Mois précédent" onClick={() => move(-1, 0)}><Icon name="chevron-left" size="1rem" /></button>
        <span className="ds-cal__label" id={idMois} aria-live="polite">{fmtMonth.format(view)}</span>
        <button type="button" className="ds-cal__nav" aria-label="Mois suivant" onClick={() => move(1, 0)}><Icon name="chevron-right" size="1rem" /></button>
        <button type="button" className="ds-cal__nav" aria-label="Année suivante" onClick={() => move(0, 1)}><Icon name="chevrons-right" size="1rem" /></button>
      </div>
      <div className="ds-cal__grid" role="group" aria-labelledby={idMois}>
        {heads.map(h => <span key={h} className="ds-cal__wd" aria-hidden="true">{h}</span>)}
        {Array.from({ length: offset }, (_, i) => <span key={'b' + i} aria-hidden="true" />)}
        {jours.map((d, i) => {
          const k = key(d);
          const estAujourdhui = k === key(today);
          const cls = cn('ds-cal__day', k === selKey && 'is-selected', estAujourdhui && 'is-today');
          return (
            <button
              key={k}
              ref={el => { if (el) boutons.current.set(k, el); else boutons.current.delete(k); }}
              type="button"
              className={cls}
              disabled={isDisabled(d)}
              tabIndex={k === arret ? 0 : -1}
              aria-label={fmtComplet.format(d)}
              aria-pressed={k === selKey || undefined}
              aria-current={estAujourdhui ? 'date' : undefined}
              onClick={() => onChange && onChange(d)}
              onFocus={() => setActif(k)}
              onKeyDown={e => clavier(e, d)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
