import { Children, cloneElement, isValidElement, useId } from 'react';
import type { JSX, ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from '../icons/Icon';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';

/**
 * Label + control + help/error wrapper. An error replaces the help text and is
 * always colour + icon + text — never colour alone.
 *
 * LE CÂBLAGE EST AUTOMATIQUE (v0.24.0). Quand l'enfant est UN contrôle — `Input`,
 * `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, ou un `<input>` / `<select>` /
 * `<textarea>` natif —, FormField pose sur lui :
 *   · `id` s'il n'en a pas (repris de `htmlFor`, sinon généré), et le libellé le vise ;
 *   · `aria-describedby` vers l'erreur, ou à défaut vers l'aide — AJOUTÉ à celui que
 *     l'enfant porte déjà, jamais à sa place ;
 *   · `aria-invalid="true"` quand il y a une erreur.
 * Le lecteur d'écran annonce donc le message en même temps que le champ, et l'état
 * invalide — sans une ligne de câblage chez l'appelant.
 * Tout autre enfant (une liste, un groupe, un composant d'app) est laissé tel quel :
 * rien ne prouve qu'il transmet ces attributs à un contrôle. L'aide et l'erreur portent
 * quand même un `id` stable (`<id du champ>-aide` / `-erreur`), à relier à la main.
 */
export interface FormFieldProps {
  label?: ReactNode;
  htmlFor?: string;
  help?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children?: ReactNode;
}

/* Les contrôles que FormField sait câbler : ceux du socle, qui étalent leurs props sur
   l'élément natif, et les éléments natifs eux-mêmes. */
const CONTROLES_DS: unknown[] = [Input, Textarea, Select, Checkbox, Radio, Switch];
const CONTROLES_NATIFS = new Set(['input', 'select', 'textarea']);

type ProprietesControle = { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: unknown };

function estControle(enfant: ReactNode): enfant is ReactElement<ProprietesControle> {
  if (!isValidElement(enfant)) return false;
  return typeof enfant.type === 'string'
    ? CONTROLES_NATIFS.has(enfant.type)
    : CONTROLES_DS.includes(enfant.type);
}

export function FormField({
  label, htmlFor, help, error, required = false, className = '', children,
}: FormFieldProps): JSX.Element {
  const auto = useId();
  /* Un seul enfant, et c'est un contrôle : c'est le seul cas où le câblage est sûr. */
  const seul = Children.count(children) === 1 ? Children.toArray(children)[0] : undefined;
  const controle = estControle(seul) ? seul : undefined;
  const idControle = controle?.props.id ?? htmlFor ?? 'ds-field' + auto.replace(/[^a-zA-Z0-9_-]/g, '');
  const idAide = idControle + '-aide';
  const idErreur = idControle + '-erreur';
  const decrit = error ? idErreur : help ? idAide : undefined;

  let contenu: ReactNode = children;
  if (controle) {
    const existant = controle.props['aria-describedby'];
    const ids = [...(existant ? existant.split(/\s+/) : []), ...(decrit ? [decrit] : [])];
    contenu = cloneElement(controle, {
      id: idControle,
      'aria-describedby': ids.length ? [...new Set(ids)].join(' ') : undefined,
      ...(error ? { 'aria-invalid': true } : null),
    });
  }

  return (
    <div className={cn('ds-field', className)}>
      {label ? (
        <label className="ds-label" htmlFor={htmlFor ?? (controle ? idControle : undefined)}>
          {label}{required ? <span className="ds-label__required"> *</span> : null}
        </label>
      ) : null}
      {contenu}
      {error ? (
        <span className="ds-error" id={idErreur}><Icon name="circle-alert" size="0.875rem" strokeWidth={2.5} />{error}</span>
      ) : help ? <span className="ds-help" id={idAide}>{help}</span> : null}
    </div>
  );
}
