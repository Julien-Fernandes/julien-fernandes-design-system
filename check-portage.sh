#!/usr/bin/env bash
# Contrôle d'APRÈS-PORTAGE.
#
# Un portage depuis Claude Design régénère la marque et peut régénérer patterns.css.
# Sept corrections posées le 27/08/2026 y vivent — dont cinq dans patterns.css. Elles
# sautent en SILENCE : rien ne casse, l'écran change juste d'apparence, et personne ne
# sait pourquoi trois mois plus tard.
#
# À lancer après chaque portage, avant le bump de version :   bash check-portage.sh
set -u
ko=0
v() { # v <libellé> <fichier> <motif>
  if grep -q -- "$3" "$2" 2>/dev/null; then printf '  ✓ %s\n' "$1"
  else printf '  ✗ %s   PERDU  (%s)\n' "$1" "$2"; ko=$((ko+1)); fi
}

echo "── Correctifs de compatibilité ──"
n=$(grep -rl "import type {.*JSX.*} from 'react'" src/components src/*.tsx 2>/dev/null | wc -l | tr -d ' ')
if [ "$n" -ge 37 ]; then printf '  ✓ JSX importé depuis react (%s fichiers)\n' "$n"
else printf '  ✗ JSX importé depuis react : %s fichiers seulement, 37 attendus\n' "$n"; ko=$((ko+1)); fi
v "brand-glyphs : github/youtube/instagram dessinés ici" src/components/icons/brand-glyphs.ts "createLucideIcon"
v "brand-glyphs : tiktok dessinée ici (0.22.0)"          src/components/icons/brand-glyphs.ts "createLucideIcon('Tiktok'"
v "ContentIcon connaît tiktok"                          src/brand-content.tsx                "'tiktok': Tiktok"
v "Icon n'importe plus Github de lucide"                 src/components/icons/Icon.tsx        "from './brand-glyphs'"
v "house dessinée ici (nom lucide instable)"            src/components/icons/compat-glyphs.ts "createLucideIcon('House'"
v "l'entrée d'accueil porte house"                      src/components/icons/Icon.tsx        "'house': House"

echo "── Le dégradé, partout où la marque se remplit ──"
v "barre de progression"          src/styles/patterns.css ".ds-progress__bar{.*--brand-gradient"
v "case à cocher"                 src/styles/patterns.css ".ds-choice__box{background:var(--brand-gradient)"
v "pastille du radio"             src/styles/patterns.css ".ds-choice__dot{.*--brand-gradient"
v "piste de l'interrupteur"       src/styles/patterns.css ".ds-switch__track{background:var(--brand-gradient)"
v "jour sélectionné du calendrier" src/styles/patterns.css ".ds-cal__day.is-selected{background:var(--brand-gradient)"

echo "── La coque ──"
v "barre latérale collante"              src/styles/patterns.css "align-self:start"
v "nav active d'une seule couleur, --active (0.21.0)" src/styles/patterns.css ".ds-sidenav.is-active{background:var(--surface-alt);color:var(--active)"
v "onglet sélectionné sur accent, --active (0.21.0)"  src/styles/patterns.css ".ds-tab\[aria-selected=\"true\"\],.ds-tab.is-selected{background:var(--accent);color:var(--active)}"
v "le jeton --active au contrat"                     src/styles/brand.template.css "^  --active:;"
v "le rail d'icônes (0.21.0)"               src/styles/patterns.css "^.ds-rail{"
v "Rail : composant"                        src/components/navigation/Rail.tsx "export function Rail"
v "pied de navigation"                   src/styles/patterns.css ".ds-sidebar__footnav"
v "Sidebar : prop linkAs"                src/components/navigation/Sidebar.tsx "linkAs"
v "Sidebar : prop footerItems"           src/components/navigation/Sidebar.tsx "footerItems"

echo "── La coque, suite ──"
v "retrait de boîte de la barre latérale à --space-4" src/styles/patterns.css "padding:var(--space-5) var(--space-4);box-sizing:border-box;transition:width"

echo "── Le lot de la 0.23.0 — site public ──"
v "menu replié : display posé SEULEMENT à l'ouverture"  src/styles/patterns.css  ".ds-navbar__menu:popover-open{display:flex"
v "carte-lien : couleur de carte, focus visible"         src/styles/patterns.css  ".ds-card--link{display:block;color:var(--card-foreground)"
v "calendrier pleine largeur"                            src/styles/patterns.css  ".ds-cal--fluid .ds-cal__grid{grid-template-columns:repeat(7,minmax(0,1fr))"
v "typographie de flux, puces rétablies"                 src/styles/patterns.css  ".ds-prose :is(ul,ol){padding-left:var(--space-5);list-style:revert}"
v "sur-titre neutre, sans pochoir — .ds-overline (0.24.0)" src/styles/tokens/base.css "^.ds-overline,.overline{"
v "ancres sous une barre collante"                       src/styles/tokens/base.css ":root:has(.ds-navbar){scroll-padding-top"
v "la barre est une porteuse (déduction de surface)"   src/styles/patterns.css  ".ds-navbar .ds-btn--secondary,.ds-navbar .ds-icon-btn--secondary{background:var(--background)}"

echo "── Le lot de la 0.24.0 — noms et accessibilité ──"
v "l'alias .overline interdit au scanner Tailwind"        src/styles/theme.css       '@source not inline("overline");'

echo "── Le lot de la 0.25.0 — la Navbar ──"
v "lien de marque centré (inline-flex, plus de ligne de base)" src/styles/patterns.css ".ds-navbar__brand{display:inline-flex;align-items:center"
v "burger : cible du rail tactile, alignement optique"         src/styles/patterns.css ".ds-navbar__burger{display:none;width:var(--control-md);height:var(--control-md)"
v "burger en IconButton ghost"                                src/components/navigation/Navbar.tsx 'variant="ghost"'

echo "── Le reset ──"
v "preflight versé dans le dépôt"    src/styles/core.css          "tokens/preflight.css' layer(base)"
v "couleur de bordure par défaut"    src/styles/tokens/base.css   "border-color:var(--border,currentColor)"

echo "── L'échelle d'app ──"
if grep -q -- "--text-" src/styles/app-scale.css; then
  printf '  ✗ app-scale.css retouche un palier typo — retiré en v0.5.5, ne pas réintroduire\n'; ko=$((ko+1))
else printf '  ✓ app-scale.css ne retouche aucun palier typo\n'; fi

echo
if [ "$ko" -eq 0 ]; then echo "✓ portage — les 36 correctifs sont intacts"; exit 0
else echo "✗ portage — $ko correctif(s) perdu(s). Les rejouer AVANT de taguer."; exit 1; fi
