import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/* Les fondations en JS, la couche Tailwind en CSS (voir styles.css) — le montage
   exact d'une app consommatrice.
   `virtual:ds-entry` est résolu à la construction par vite.config.ts, sur le montage
   de la vitrine : socle + marque, via `demo/brand-entry.css`. Pour essayer une autre
   marque, on repointe l'import de ce fichier — aucune ligne du socle ne change. */
import 'virtual:ds-entry';
import './styles.css';
import { App } from './App';
import { BancNavbar } from './pages/BancNavbar';

/* `?banc=navbar` ouvre le banc de la Navbar, une page à part (v0.25.0) : une barre se
   mesure dans la page qu'elle tient, pleine largeur et collante, pas dans une carte. */
const banc = new URLSearchParams(location.search).get('banc');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {banc === 'navbar' ? <BancNavbar /> : <App />}
  </StrictMode>,
);
