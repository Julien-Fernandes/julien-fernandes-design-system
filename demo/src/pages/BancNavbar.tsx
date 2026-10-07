import { useEffect, useState } from 'react';
import { Button, Card, Navbar, Switch } from '@julienfernandes/ds';
import { IDENTITY } from '../identity';

/* LE BANC DE LA NAVBAR — v0.25.0. Une page à part (`?banc=navbar`), parce qu'une barre
   se mesure dans la page qu'elle tient, pas dans une carte de vitrine : pleine largeur,
   collante en haut, menu replié sous 64rem, des ancres à suivre.
   Il prouve trois choses, en direct :
     · la marque est centrée dans la barre (Logo par défaut, ET une marque personnalisée
       faite d'un SVG en ligne et d'un texte) — écart en px entre les deux centres ;
     · le burger est une icône nue, 44×44 au moins, collée à droite ;
     · une app qui redéclare `--navbar-h` (une règle `:root` dans SA feuille, hors couche,
       exactement comme elle le ferait) voit TOUT suivre : la barre, le haut du panneau
       du menu, et le `scroll-padding-top` des ancres. */

const LIENS = [
  { label: 'Contenus', href: '#banc-1', active: true },
  { label: 'Projets', href: '#banc-2' },
  { label: 'Contact', href: '#banc-3' },
];

/* Une marque PERSONNALISÉE délibérément hostile au centrage : un SVG en ligne (qui se
   poserait sur la ligne de base) suivi d'un texte au corps du site. */
function MarquePerso() {
  return (
    <span className="inline-flex items-center gap-space-2 font-display text-heading-sm">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill="currentColor" />
      </svg>
      Marque perso
    </span>
  );
}

type Mesures = Record<string, string>;

function mesurer(): Mesures {
  const nav = document.querySelector<HTMLElement>('.banc-navbar .ds-navbar');
  if (!nav) return {};
  const c = (r: DOMRect) => r.top + r.height / 2;
  const innerEl = nav.querySelector('.ds-navbar__inner')!;
  const inner = innerEl.getBoundingClientRect();
  const bordContenu = inner.right - parseFloat(getComputedStyle(innerEl).paddingRight);
  const lien = nav.querySelector('.ds-navbar__inner > a')!;
  const marque = lien.firstElementChild!.getBoundingClientRect();
  const burger = nav.querySelector<HTMLElement>('.ds-navbar__burger');
  const panneau = nav.querySelector<HTMLElement>('.ds-navbar__menu');
  const visible = (el: HTMLElement | null) => !!el && getComputedStyle(el).display !== 'none';
  const b = visible(burger) ? burger!.getBoundingClientRect() : null;
  const bs = burger ? getComputedStyle(burger) : null;
  const ouvert = panneau?.matches(':popover-open');
  return {
    'largeur de fenêtre': innerWidth + ' px',
    'hauteur de la barre': inner.height.toFixed(2) + ' px',
    'centre marque − centre barre': (c(marque) - c(inner)).toFixed(2) + ' px',
    'hauteur du lien de marque': lien.getBoundingClientRect().height.toFixed(2) + ' px',
    'burger': b ? `${b.width}×${b.height} px · fond ${bs!.backgroundColor} · bordure ${bs!.borderTopWidth}` : 'masqué (≥ 64rem)',
    'burger, centre − centre barre': b ? (c(b) - c(inner)).toFixed(2) + ' px' : '—',
    'burger, glyphe : bord droit − bord du contenu': b ? (burger!.querySelector('svg')!.getBoundingClientRect().right - bordContenu).toFixed(2) + ' px' : '—',
    'panneau ouvert : haut − bas de la barre': ouvert
      ? (panneau!.getBoundingClientRect().top - nav.getBoundingClientRect().bottom).toFixed(2) + ' px'
      : 'fermé — ouvre le burger',
    'scroll-padding-top (racine)': getComputedStyle(document.documentElement).scrollPaddingTop,
    '--navbar-h (racine)': getComputedStyle(document.documentElement).getPropertyValue('--navbar-h').trim(),
  };
}

export function BancNavbar() {
  const [perso, setPerso] = useState(false);
  const [surcharge, setSurcharge] = useState(false);
  const [mesures, setMesures] = useState<Mesures>({});

  /* La surcharge est posée COMME UNE APP LA POSE : une règle `:root` dans une feuille,
     hors de toute couche, chargée après le DS. Pas un style inline. */
  useEffect(() => {
    if (!surcharge) return;
    const el = document.createElement('style');
    el.textContent = ':root{--navbar-h:4rem}';
    document.head.appendChild(el);
    return () => el.remove();
  }, [surcharge]);

  useEffect(() => {
    let id = 0;
    const boucle = () => { setMesures(mesurer()); id = window.setTimeout(boucle, 250); };
    boucle();
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="banc-navbar min-h-screen bg-background text-foreground">
      <Navbar
        menu
        homeHref="?banc=navbar"
        homeLabel={`${IDENTITY.personne} — accueil`}
        brand={perso ? <MarquePerso /> : undefined}
        links={LIENS}
        cta={<Button as="a" href="#banc-3" size="sm">Parle-moi de ton idée</Button>}
      />
      <main className="page flex flex-col gap-space-6 py-space-6">
        <Card className="flex flex-col gap-space-4">
          <div className="flex flex-col gap-space-1">
            <span className="eyebrow">Banc · Navbar</span>
            <h1>Centrage, burger, hauteur</h1>
            <p className="caption">Mesures lues en direct (getBoundingClientRect). Redimensionne la fenêtre : sous 64rem, le burger remplace les liens.</p>
          </div>
          <div className="flex flex-wrap gap-space-5">
            <Switch label="Marque personnalisée (SVG en ligne + texte)" checked={perso} onChange={e => setPerso(e.target.checked)} />
            <Switch label="Surcharger --navbar-h à 4rem (:root, comme une app)" checked={surcharge} onChange={e => setSurcharge(e.target.checked)} />
          </div>
          <dl className="grid grid-cols-1 gap-x-space-5 gap-y-space-2 sm:grid-cols-[auto_1fr]" data-banc-mesures>
            {Object.entries(mesures).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="caption">{k}</dt>
                <dd className="mono text-caption" data-cle={k}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="caption"><a href="./">← Retour à la vitrine</a></p>
        </Card>
        {LIENS.map((l, i) => (
          <section key={l.href} id={l.href.slice(1)} className="flex min-h-[80vh] flex-col gap-space-3">
            <h2>{i + 1}. {l.label}</h2>
            <p>Suis le lien « {l.label} » dans la barre : le titre doit s'arrêter SOUS la barre, à --navbar-h + --space-4 du haut, quelle que soit la hauteur de barre choisie.</p>
          </section>
        ))}
      </main>
    </div>
  );
}
