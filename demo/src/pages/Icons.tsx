import { Icon, IconButton, type IconName } from '@julienfernandes/ds';
import { ContentIcon, type ContentIconName } from '@julienfernandes/ds/brand-content';
import { Block, Section, Spec } from '../ui';

const NAMES: IconName[] = [
  'check', 'x', 'chevron-down', 'chevron-right', 'chevron-left', 'arrow-right',
  'arrow-up-right', 'arrow-down', 'play', 'eye', 'clock', 'calendar', 'copy',
  'search', 'menu', 'mail', 'triangle-alert', 'info', 'circle-check',
  'circle-alert', 'circle-x', 'terminal', 'code', 'zap', 'plus', 'minus', 'trash-2',
  'external-link', 'loader-circle', 'github', 'folder',
  'trending-up', 'user', 'book-open', 'message-square', 'quote', 'rocket', 'file-text',
  'chevrons-left', 'chevrons-right', 'ellipsis', 'panel-left', 'sliders-horizontal',
  'layout-dashboard', 'house', 'video', 'dumbbell', 'settings',
];

/* Les icônes de PLATEFORME ne sont pas dans IconName : elles vivent sur le sous-chemin
   optionnel brand-content, sous ContentIcon. Trois depuis la 0.22.0. */
const PLATEFORMES: ContentIconName[] = ['youtube', 'instagram', 'tiktok'];

export function IconsPage() {
  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Icônes" note="Lucide, exclusivement. Aucun emoji, aucun caractère unicode décoratif — sauf le point médian.">
        <Block label="Tailles" hint="1rem · 1.25rem (défaut) · 1.5rem. Toujours en rem, jamais en px.">
          <Spec token="size=&quot;1rem&quot;"><Icon name="circle-check" size="1rem" /></Spec>
          <Spec token="size=&quot;1.25rem&quot; (défaut)"><Icon name="circle-check" size="1.25rem" /></Spec>
          <Spec token="size=&quot;1.5rem&quot;"><Icon name="circle-check" size="1.5rem" /></Spec>
        </Block>

        <Block label="Graisses" hint="2 standard · 2.5 dans les pills et les toasts · 3 pour le check.">
          <Spec token="strokeWidth={2}"><Icon name="check" size="1.5rem" strokeWidth={2} /></Spec>
          <Spec token="strokeWidth={2.5}"><Icon name="check" size="1.5rem" strokeWidth={2.5} /></Spec>
          <Spec token="strokeWidth={3}"><Icon name="check" size="1.5rem" strokeWidth={3} /></Spec>
        </Block>

        <Block label="Couleur" hint="currentColor — --foreground par défaut, --primary seulement pour une icône active ou un CTA.">
          <div className="flex flex-wrap items-center gap-space-5">
            <Icon name="zap" size="1.5rem" />
            <Icon name="zap" size="1.5rem" style={{ color: 'var(--primary)' }} />
            <Icon name="zap" size="1.5rem" style={{ color: 'var(--text-muted)' }} />
            <Icon name="zap" size="1.5rem" style={{ color: 'var(--destructive)' }} />
          </div>
        </Block>

        <Block label="Jeu complet" hint={`${NAMES.length} icônes disponibles.`}>
          <div className="grid grid-cols-2 gap-space-3 sm:grid-cols-4 lg:grid-cols-6">
            {NAMES.map(name => (
              <div key={name} className="flex flex-col items-center gap-space-2 rounded-md border border-border bg-card p-space-3">
                <Icon name={name} size="1.25rem" />
                <span className="mono text-caption text-text-muted w-full truncate text-center">{name}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block label="Icônes de plateforme — ContentIcon" hint={`${PLATEFORMES.length} icônes, sur le sous-chemin optionnel @julienfernandes/ds/brand-content. Hors d'IconName : un écran d'interface ne les importe pas. Dessinées dans le socle (lucide ne livre plus de logo), en currentColor — aucune couleur de plateforme.`}>
          <div className="grid grid-cols-2 gap-space-3 sm:grid-cols-4 lg:grid-cols-6">
            {PLATEFORMES.map(name => (
              <div key={name} className="flex flex-col items-center gap-space-2 rounded-md border border-border bg-card p-space-3">
                <ContentIcon name={name} size="1.25rem" />
                <span className="mono text-caption text-text-muted w-full truncate text-center">{name}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-space-5">
            {PLATEFORMES.map(name => <ContentIcon key={name} name={name} size="1.5rem" />)}
          </div>
        </Block>

        <Block label="Glyphes pleins — variant=&quot;filled&quot;" hint="v0.24.0. Les logos OFFICIELS en aplat (Simple Icons, CC0) : le YouTube plein est le rectangle arrondi avec le triangle de lecture EN CREUX. Défaut : outline — rien ne change sans la prop. Même créneau de taille (--ds-icon-size), même currentColor : les deux dernières rangées le montrent, l'une en taille de créneau, l'autre dans un bouton-icône.">
          <div className="grid grid-cols-2 gap-space-3 sm:grid-cols-4 lg:grid-cols-6">
            {PLATEFORMES.map(name => (
              <div key={name} className="flex flex-col items-center gap-space-2 rounded-md border border-border bg-card p-space-3">
                <ContentIcon name={name} variant="filled" size="1.25rem" />
                <span className="mono text-caption text-text-muted w-full truncate text-center">{name} · filled</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-space-5">
            {PLATEFORMES.map(name => (
              <span key={name} className="flex items-center gap-space-3">
                <ContentIcon name={name} size="2rem" />
                <ContentIcon name={name} variant="filled" size="2rem" />
              </span>
            ))}
            <span className="flex items-center gap-space-3 text-primary-readable">
              {PLATEFORMES.map(name => <ContentIcon key={name} name={name} variant="filled" />)}
            </span>
            <span className="flex items-center gap-space-2">
              {PLATEFORMES.map(name => (
                <IconButton key={name} variant="secondary" label={name}><ContentIcon name={name} variant="filled" /></IconButton>
              ))}
            </span>
          </div>
        </Block>
      </Section>
    </div>
  );
}
