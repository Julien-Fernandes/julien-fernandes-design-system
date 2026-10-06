import { createLucideIcon, type LucideIcon } from 'lucide-react';

/**
 * LES QUATRE ICÔNES DE MARQUE, DESSINÉES ICI — et pas importées de lucide. (Plus, depuis
 * la v0.24.0, les trois glyphes PLEINS des plateformes : voir en bas du fichier.)
 *
 * POURQUOI. lucide-react a RETIRÉ toutes ses icônes de marque en v1 : GitHub, YouTube,
 * Instagram, X… Ce n’est pas une régression, c’est une décision juridique — ces logos sont
 * des marques déposées et lucide a cessé de les redistribuer. Le socle en employait trois,
 * en import de MODULE : le bundle du paquet cassait donc chez toute app en lucide v1, même
 * une app qui ne s’en sert jamais. Le peer `lucide-react: ">=0.400"` était devenu un
 * mensonge, et le symptôme arrivait au build de l’app, jamais ici.
 *
 * CE QUE ÇA N’EST PAS. Aucune bibliothèque d’icônes n’a été ajoutée. Ce fichier ne porte que
 * les COORDONNÉES des dessins, reconstruites par `createLucideIcon`, l’usine que lucide
 * expose toujours. Trois sont relevées sur lucide 0.469, la dernière version à les livrer ;
 * la quatrième, TikTok, lucide ne l’a JAMAIS livrée — elle est dessinée à la main, sur la
 * même grille 24, avec le même trait de 2 (voir sa notice). Le résultat est un `LucideIcon`
 * ordinaire : il traverse le même `Glyph`, hérite des mêmes règles de taille et d’épaisseur,
 * et rien ne change pour l’appelant.
 *
 * CE QUE ÇA COÛTE. Ces quatre dessins sont désormais à nous : si une de ces marques change
 * son logo, c’est ici qu’on le met à jour. Aucune mise à jour de lucide ne le fera plus.
 */

export const Github: LucideIcon = createLucideIcon('Github', [
  ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', key: 'tonef' }],
  ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: '9comsn' }],
]);

export const Youtube: LucideIcon = createLucideIcon('Youtube', [
  ['path', { d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17', key: '1q2vi4' }],
  ['path', { d: 'm10 15 5-3-5-3z', key: '1jp15x' }],
]);

export const Instagram: LucideIcon = createLucideIcon('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '2e1cvw' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '9exkf1' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'r4j83e' }],
]);

/**
 * TIKTOK — v0.22.0, dessinée à la main : lucide n’a jamais eu ce glyphe, il n’y a rien à
 * relever. Le contour de la note, en un seul tracé fermé, sur la grille 24 avec 2 de marge
 * et un trait de 2 comme les trois autres — et 2 de jour partout entre deux traits :
 *   · la HAMPE, une bande verticale de 12 à 16, du haut (3) au flanc droit du corps ;
 *   · le CROCHET, un quart d’anneau centré en (21,3), rayons 5 et 9, dont la pointe tombe
 *     verticale de 8 à 12 — c’est la concavité du logo, pas un drapeau de croche ;
 *   · le CORPS, un anneau centré en (9.5,14.5), rayons 6.5 et 2.5, ouvert en haut à gauche
 *     par une coupe verticale à x=8 — le « C » qui sépare TikTok d’une note ordinaire.
 * Aucune couleur : comme les deux autres icônes de plateforme, elle rend en currentColor.
 */
export const Tiktok: LucideIcon = createLucideIcon('Tiktok', [
  ['path', { d: 'M12 3h4a5 5 0 0 0 5 5v4a9 9 0 0 1-5-1.52v4.02a6.5 6.5 0 1 1-8-6.32v4.32a2.5 2.5 0 1 0 4 2z', key: 'tiktok' }],
]);

/**
 * LES TROIS GLYPHES PLEINS — v0.24.0 (`<ContentIcon variant="filled">`).
 * Ce ne sont PAS des contours remplis : ce sont les glyphes OFFICIELS de chaque plateforme,
 * tels que leurs chartes les dessinent en aplat — le YouTube plein est le rectangle arrondi
 * avec le triangle de lecture EN CREUX, l'Instagram plein l'appareil en anneau, le TikTok
 * plein la note. Tracés relevés sur Simple Icons 16.34.0 (licence CC0 1.0, domaine public),
 * dans la même grille 24 que les contours.
 * Le creux tient par la règle de remplissage par défaut (nonzero) : les sous-tracés
 * intérieurs tournent en sens inverse. Chaque tracé porte `fill: currentColor` et
 * `stroke: none` — ils écrasent le `fill="none"` / `stroke="currentColor"` que
 * `createLucideIcon` pose sur le <svg>. Même usine, même `Glyph`, même créneau de taille
 * (--ds-icon-size) : seule la manière de peindre change. Toujours aucune couleur de
 * plateforme — currentColor, comme les contours.
 */
const PLEIN = { fill: 'currentColor', stroke: 'none' } as const;

export const YoutubeFilled: LucideIcon = createLucideIcon('YoutubeFilled', [
  ['path', { d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', ...PLEIN, key: 'youtube-filled' }],
]);

export const InstagramFilled: LucideIcon = createLucideIcon('InstagramFilled', [
  ['path', { d: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077', ...PLEIN, key: 'instagram-filled' }],
]);

export const TiktokFilled: LucideIcon = createLucideIcon('TiktokFilled', [
  ['path', { d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z', ...PLEIN, key: 'tiktok-filled' }],
]);
