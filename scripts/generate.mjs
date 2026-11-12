// Renders every page (EN + ES) to static HTML that Vite then bundles.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS, ROUTES } from '../site/content.js';
import { SITE } from '../site/layout.js';
import * as P from '../site/pages.js';
import { bookPage } from '../site/booking.js';
import { adminPage } from '../site/admin.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const render = {
  home: P.home,
  titicaca: (l) => P.hotelPage(l, 'titicaca'),
  uyuni: (l) => P.hotelPage(l, 'uyuni'),
  sur: (l) => P.hotelPage(l, 'sur'),
  centro: (l) => P.hotelPage(l, 'centro'),
  rooms: P.roomsPage,
  dining: P.diningPage,
  offers: P.offersPage,
  gallery: P.galleryPage,
  contact: P.contactPage,
  book: bookPage,
};

export const routeFile = (route) => join(root, route.replace(/^\//, ''), 'index.html');

const urls = [];
for (const [key, fn] of Object.entries(render)) {
  for (const lang of LANGS) {
    const route = ROUTES[key][lang];
    const file = routeFile(route);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, fn(lang));
    urls.push(`${SITE}${route}`);
  }
}

mkdirSync(join(root, 'admin'), { recursive: true });
writeFileSync(join(root, 'admin/index.html'), adminPage());

writeFileSync(join(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`generated ${urls.length} pages`);
