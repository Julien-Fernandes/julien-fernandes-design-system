import type { JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Logo } from '../brand/Logo';

/**
 * Site footer — une STRUCTURE à emplacements, rien d'autre : la zone de marque (la
 * marque, une ligne sous elle), N colonnes, une rangée sociale, une ligne du bas.
 * Le socle ne porte AUCUN contenu : ni adresse, ni réseau, ni mention légale, ni libellé.
 * Tout ce qui s'y lit vient du projet.
 */
export interface FooterColumn {
  title: string;
  /** Les liens de la colonne, en `.ds-footer__link`. Optionnels depuis la v0.23.0 : une
   *  colonne peut ne porter que du `content`. */
  links?: { label: string; href?: string }[];
  /**
   * Contenu LIBRE, rendu après les liens (v0.23.0) — une rangée d'icônes sociales, un
   * bouton, une ligne de texte. La colonne l'empile avec le même écart que ses liens.
   */
  content?: ReactNode;
}

export interface FooterProps {
  columns?: FooterColumn[];
  social?: ReactNode;
  /** La marque. Défaut : le `Logo` du paquet. Un projet passe la sienne. */
  brand?: ReactNode;
  /** Force la couleur des lettres du `Logo` par défaut — voir `LogoProps.letters`.
   *  Sans effet si vous passez votre propre `brand`. */
  letters?: 'dark' | 'light';
  /**
   * Ligne sous la marque — lieu, signature, adresse de contact. Le point médian sert de
   * séparateur. AUCUNE valeur par défaut : elle portait une ville en dur, dans un composant
   * du SOCLE — un projet ne pouvait pas la retirer sans passer une chaîne vide. Omise, la
   * ligne n'est pas rendue du tout.
   * Un nœud depuis la v0.23.0 (une chaîne reste valable) : un lien `mailto:` y tient. Elle
   * est rendue dans un <p> — du contenu EN LIGNE (texte, lien), pas des blocs.
   */
  note?: ReactNode;
  /**
   * La ligne du BAS (v0.23.0), sous les colonnes et la rangée sociale : ©, mention
   * légale, liens de pied de page. Omise, la ligne n'est pas rendue.
   */
  bottom?: ReactNode;
  className?: string;
}

export function Footer({
  columns = [], social, brand, letters, note, bottom, className = '',
}: FooterProps): JSX.Element {
  return (
    <footer className={cn('ds-footer', className)}>
      <div className="page ds-footer__inner">
        <div className="ds-footer__brand">
          {brand ?? <Logo variant="wordmark" letters={letters} height="1.25rem" />}
          {note ? <p className="ds-footer__note">{note}</p> : null}
        </div>
        <div className="ds-footer__cols">
          {columns.map(col => (
            <div key={col.title} className="ds-footer__col">
              <span className="eyebrow">{col.title}</span>
              {(col.links ?? []).map(l => (
                <a key={l.label} href={l.href || '#'} className="ds-footer__link">
                  {l.label}
                </a>
              ))}
              {col.content}
            </div>
          ))}
        </div>
      </div>
      {social ? (
        <div className="page ds-footer__social">
          {social}
        </div>
      ) : null}
      {bottom ? (
        <div className="page ds-footer__bottom">
          {bottom}
        </div>
      ) : null}
    </footer>
  );
}
