import { useState } from 'react';
import { ContentIcon } from '@julienfernandes/ds/brand-content';
import { IDENTITY } from '../identity';
import { AppShell, Avatar, Button, Footer, Icon, IconButton, Navbar, Pagination, Rail, Sidebar, Tabs, Logo } from '@julienfernandes/ds';
import { Block, Row, Section } from '../ui';

const LINKS = [{ label: 'Vidéos', active: true }, { label: 'Séries' }, { label: 'À propos' }];
const SERIES = [
  { value: 'all', label: 'Tout' },
  { value: 'build', label: 'Build' },
  { value: 'tuto', label: 'Tuto' },
  { value: 'coulisses', label: 'Coulisses' },
];

export function NavigationPage() {
  const [tab, setTab] = useState('build');
  const [page, setPage] = useState(4);
  const [longPage, setLongPage] = useState(12);

  return (
    <div className="flex flex-col gap-space-7">
      <Section title="Navbar" note="Posée sur --secondary avec une bordure basse en permanence — c'est un contrôle détaché du layout, jamais transparent. Au scroll elle se teinte, prend un blur(10px) et une ombre. Seul endroit du système qui utilise backdrop-filter.">
        <Block label="Au repos">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled={false} links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
        </Block>
        <Block label="État scrollé" hint="Teinte color-mix sur --secondary + blur + ombre.">
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
        </Block>
        <Block label="Tons du logo" hint="Sans la prop letters, les lettres suivent --foreground : sur une surface sombre elles s'éclaircissent toutes seules. letters ne sert qu'à forcer.">
          <div className="dark overflow-x-auto rounded-xl border border-border bg-background">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <div className="dark overflow-x-auto rounded-xl border border-border bg-background">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} letters="dark" height="1.375rem" />} scrolled letters="dark" links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <p className="caption">Le premier suit la surface ; le second force letters=&quot;dark&quot; sur fond sombre, pour montrer ce que fait la prop.</p>
        </Block>
        <Block label="Lien actif — aria-current" hint="v0.23.0. Le lien active porte aria-current=&quot;page&quot; : la couleur --active et la graisse le disent aux yeux, l'attribut le dit au lecteur d'écran. Inspecte « Vidéos » dans la barre au repos ci-dessus.">
          <p className="caption">Aucun changement visuel : c'est la même barre, avec l'attribut en plus.</p>
        </Block>
        <Block label="Menu replié — menu=&quot;always&quot;" hint="v0.23.0, opt-in. Avec menu (true), les liens et le CTA quittent la barre SOUS 64rem ; « always » le fait à toute largeur, c'est ce qu'on voit ici. Le panneau est un popover NATIF : clic sur le burger pour ouvrir, Échap ou clic extérieur pour fermer, le focus revient au burger — sans JavaScript. Le CTA passe en pleine largeur dans le pied du panneau.">
          <div className="rounded-xl border border-border">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled={false} menu="always" links={LINKS} cta={<Button size="sm">La newsletter</Button>} />
          </div>
          <p className="caption">Au clavier : Tab jusqu'au burger, Entrée — Tab entre dans le panneau juste après le burger, Échap le referme et rend le focus. Là où l'ancrage CSS existe, le panneau s'ancre sous SA barre ; ailleurs il se pose sous le haut de la fenêtre, à --navbar-h — juste pour une barre collante.</p>
        </Block>
        <Block label="Bouton secondaire dans la barre" hint="v0.23.0. La barre est une PORTEUSE, comme la carte : un bouton ou un burger secondaire posé dedans prend --background au lieu de --secondary, sinon il s'y fondrait (écart 1,000). Le slot children se rend à droite, avant le CTA.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Navbar homeLabel={`${IDENTITY.personne} — accueil`} brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.375rem" />} scrolled={false} links={LINKS} cta={<Button size="sm">La newsletter</Button>}>
              <Button variant="secondary" size="sm" icon={<Icon name="chevron-left" />}>Retour</Button>
            </Navbar>
          </div>
        </Block>
      </Section>

      <Section title="Tabs" note="Groupe d'onglets segmenté sur le rail de contrôle. Rectangle (barre 0.875rem · onglet --radius-sm) — jamais un pill. L'onglet SÉLECTIONNÉ est une plaque --accent, libellé en --active — LA couleur de tout ce qui est actif (v0.21.0), sans contour. Le survol reste couleur seule, sans fond : c'est ce qui le distingue de la sélection, puisqu'en clair --accent et --surface-alt sont la même couleur.">
        <Block label="Interactif">
          <Row><Tabs items={SERIES} value={tab} onChange={setTab} /></Row>
          <p className="caption">Onglet actif : {SERIES.find(s => s.value === tab)?.label}</p>
        </Block>
        <Block label="onCard" hint="La barre contraste avec sa surface porteuse : --secondary sur la page, --background sur une card (déduit, ou forcé par onCard). L'onglet sélectionné, lui, est la MÊME plaque accent partout — sur la page, sur une card, en clair, en sombre. Vérifie les deux thèmes.">
          <Row label="sur la page (défaut)"><Tabs items={SERIES} value="build" onChange={() => undefined} /></Row>
          <Row label="sur une card — onCard">
            <span className="inline-flex rounded-lg border border-border bg-card p-space-4">
              <Tabs onCard items={SERIES} value="build" onChange={() => undefined} />
            </span>
          </Row>
        </Block>
        <Block label="États">
          <Row label="sélection sur chaque item">
            <Tabs items={SERIES} value="all" onChange={() => undefined} />
          </Row>
          <Row label="survol forcé sur le deuxième item">
            <div className="ds-tabs">
              <button type="button" className="ds-tab" aria-selected="true">Tout</button>
              <button type="button" className="ds-tab is-hover">Build</button>
              <button type="button" className="ds-tab">Tuto</button>
            </div>
          </Row>
        </Block>
      </Section>

      <Section title="Pagination" note="Contrôlée. Barre --secondary, même traitement que les onglets ; la page courante reprend l'onglet actif. Au-delà de 7 pages, une ellipsis en icône — jamais le caractère.">
        <Block label="Peu de pages">
          <Row><Pagination page={page} pageCount={5} onPageChange={setPage} /></Row>
          <p className="caption">Page {page} sur 5.</p>
        </Block>
        <Block label="Beaucoup de pages" hint="Ellipsis des deux côtés selon la position.">
          <Row><Pagination page={longPage} pageCount={40} onPageChange={setLongPage} /></Row>
          <Row label="première page"><Pagination page={1} pageCount={40} onPageChange={() => undefined} /></Row>
          <Row label="dernière page"><Pagination page={40} pageCount={40} onPageChange={() => undefined} /></Row>
        </Block>
        <Block label="Page unique" hint="Les deux flèches sont désactivées.">
          <Row><Pagination page={1} pageCount={1} onPageChange={() => undefined} /></Row>
        </Block>
      </Section>

      <Section title="AppShell et Sidebar" note="Le squelette des outils internes : grille [barre latérale | contenu]. La barre est sur --secondary, repliable en icônes seules, et l'état est persisté en localStorage. L'entrée ACTIVE est d'une seule couleur, icône et libellé — --active, la couleur de tout ce qui est actif (v0.21.0), sur --surface-alt. RAIL OU SIDEBAR : sidebar = libellés, repliable ; rail = icônes seules, largeur fixe, jamais de repli — voir la section suivante.">
        <Block label="Complet" hint="responsive={false} et staticLayout épinglent la mise en page à deux colonnes pour la vitrine. Chaque section est un groupe : 16px les séparent, avec ou sans titre — le dernier groupe, sans titre, ne se colle plus au précédent.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Sidebar
                  brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
                  brandCollapsed={<Logo variant="monogram" wordmark={IDENTITY.wordmark} height="1.5rem" />}
                  staticLayout
                  storageKey="ds-demo-sidebar"
                  sections={[
                    { title: 'Pilotage', items: [
                      { label: 'Accueil', icon: <Icon name="house" />, active: true },
                      { label: 'Vidéos', icon: <Icon name="video" /> },
                      { label: 'Séries', icon: <Icon name="folder" /> },
                    ] },
                    { title: 'Perso', items: [
                      { label: 'Sport', icon: <Icon name="dumbbell" /> },
                    ] },
                    { items: [
                      { label: 'Réglages', icon: <Icon name="settings" /> },
                    ] },
                  ]}
                  footer={
                    <span className="flex items-center gap-space-3">
                      <Avatar size="2rem" halo={false} initials={IDENTITY.monogram} alt={IDENTITY.personne} />
                      <span className="flex flex-col">
                        <span className="text-caption font-semibold">{IDENTITY.personne}</span>
                        <span className="caption">{IDENTITY.lieu}</span>
                      </span>
                    </span>
                  }
                />
              }
            >
              <div className="flex flex-col gap-space-4 p-space-5">
                <h3>Accueil</h3>
                <p className="caption">Le contenu de l'outil vit ici. Replie la barre avec le bouton en tête pour voir le mode icônes seules — l'état est retenu.</p>
                <Row><Button size="sm" icon={<Icon name="plus" />}>Nouveau build</Button></Row>
              </div>
            </AppShell>
          </div>
        </Block>
        <Block label="Sidebar repliée" hint="defaultCollapsed force l'état initial sans toucher au localStorage.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Sidebar
                  brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
                  brandCollapsed={<Logo variant="monogram" wordmark={IDENTITY.wordmark} height="1.5rem" />}
                  staticLayout
                  defaultCollapsed
                  collapsible={false}
                  storageKey="ds-demo-sidebar-collapsed"
                  sections={[{ items: [
                    { label: 'Accueil', icon: <Icon name="house" />, active: true },
                    { label: 'Vidéos', icon: <Icon name="video" /> },
                    { label: 'Réglages', icon: <Icon name="settings" /> },
                  ] }]}
                />
              }
            >
              <div className="p-space-5"><p className="caption">Mode icônes seules : le libellé est masqué, il passe en title.</p></div>
            </AppShell>
          </div>
        </Block>
      </Section>

      <Section title="Rail" note="Le rail d'icônes (v0.21.0) : une colonne de --rail-w (3.75rem) sur --secondary, filet droit. Le point de marque (Logo variant=&quot;dot&quot;, 1.75rem) en tête, des entrées en icône SEULE — leur libellé est leur title et leur nom accessible —, un ressort, les entrées de pied, l'avatar. Ce n'est PAS la Sidebar repliée : 3.75rem contre 4.5, des carrés d'icône contre des pilules, pas de bouton de repli. Rail = icônes seules, largeur fixe, jamais de repli · Sidebar = libellés, repliable. Une app choisit l'un.">
        <Block label="Dans l'AppShell" hint="Une entrée est un IconButton par ses classes : ghost au repos (--text-muted, encre au survol), accent quand elle est active — plaque --accent, icône --active (3,00 / 3,94, seuil 3 des graphiques). Pas de forme tiroir : responsive={false}, obligatoire — AppShell le signale en console sinon.">
          <div className="overflow-hidden rounded-xl border border-border">
            <AppShell
              responsive={false}
              sidebar={
                <Rail
                  items={[
                    { label: 'Accueil — la liste des vidéos', icon: <Icon name="house" />, active: true, href: '#' },
                    { label: 'Pipeline — la vidéo ouverte', icon: <Icon name="video" />, href: '#' },
                    { label: 'Studio — le process maître', icon: <Icon name="sliders-horizontal" />, href: '#' },
                  ]}
                  footerItems={[{ label: "Réglages de l'application", icon: <Icon name="settings" />, href: '#' }]}
                  footer={<Avatar size="1.75rem" halo={false} initials={IDENTITY.monogram} alt={IDENTITY.personne} />}
                />
              }
            >
              <div className="flex min-h-80 flex-col gap-space-4 p-space-5">
                <h3>Accueil</h3>
                <p className="caption">Le contenu de l'outil vit ici. Survole les entrées : le libellé arrive en title.</p>
              </div>
            </AppShell>
          </div>
        </Block>
        <Block label="Les états d'une entrée" hint="Repos · survol forcé · active · focus. Le rail ne redessine rien : ce sont les états d'IconButton ghost et accent.">
          <Row>
            <Rail className="h-72 rounded-md border border-border" items={[
              { label: 'Repos', icon: <Icon name="house" />, href: '#' },
              { label: 'Survol', icon: <Icon name="video" />, href: '#', onClick: e => e.preventDefault() },
              { label: 'Active', icon: <Icon name="sliders-horizontal" />, href: '#', active: true },
            ]} />
            <span className="caption">Les états d'une entrée sont ceux du bouton-icône : va les voir sur la page Actions.</span>
          </Row>
        </Block>
      </Section>

      <Section title="Footer" note={`La ligne de localisation utilise le point médian : ${IDENTITY.lieu}. Elle n'a plus de valeur par défaut : le socle en portait une, codée en dur, et un projet ne pouvait pas la retirer.`}>
        <Block label="Complet" hint="Comme la Navbar, le logo suit --foreground sans tone.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Footer
              brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
              note={IDENTITY.lieu}
              columns={[
                { title: 'Séries', links: [{ label: 'Build' }, { label: 'Tuto' }, { label: 'Coulisses' }] },
                { title: 'Ressources', links: [{ label: 'La newsletter' }, { label: 'Les prompts' }] },
                { title: 'Marque', links: [{ label: 'À propos' }, { label: 'Contact' }] },
              ]}
              social={<>
                <IconButton label="YouTube"><ContentIcon name="youtube" /></IconButton>
                <IconButton label="Instagram"><ContentIcon name="instagram" /></IconButton>
                <IconButton label="TikTok"><ContentIcon name="tiktok" /></IconButton>
                <IconButton label="GitHub"><Icon name="github" /></IconButton>
              </>}
            />
          </div>
        </Block>
        <Block label="Les emplacements — v0.23.0" hint="Le pied est une STRUCTURE : marque, une ligne sous elle (note, un nœud — un lien y tient), N colonnes (links et/ou content libre), rangée sociale, ligne du bas (bottom). Le socle ne porte aucun contenu : tout ce qui se lit ici est fourni par l'appelant.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <Footer
              brand={<Logo variant="wordmark" wordmark={IDENTITY.wordmark} height="1.25rem" />}
              note={<a href="#">contact@exemple.fr</a>}
              columns={[
                { title: 'Ressources', links: [{ label: 'La newsletter' }] },
                { title: 'Réseaux', content: (
                  <span className="flex gap-space-2">
                    <IconButton variant="secondary" label="YouTube" as="a" href="#"><ContentIcon name="youtube" /></IconButton>
                    <IconButton variant="secondary" label="Instagram" as="a" href="#"><ContentIcon name="instagram" /></IconButton>
                  </span>
                ) },
                { title: 'Infos', links: [{ label: 'Mentions légales' }, { label: 'Confidentialité' }] },
              ]}
              bottom={<span>© {IDENTITY.personne}</span>}
            />
          </div>
        </Block>
      </Section>
    </div>
  );
}
