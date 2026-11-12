import { ROUTES, HOTELS, CONTACT, T } from './content.js';

export const SITE = 'https://rosario-hotels.vercel.app';

export const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const r = (key, lang) => ROUTES[key][lang];

/** Responsive image from /media/img (960 + 2000 widths). */
export function img(name, alt, { sizes = '100vw', cls = '', eager = false, small = false, attrs = '' } = {}) {
  const sm = `/media/img/${name}-sm.webp`;
  const src = small ? sm : sm;
  const srcset = small ? '' : ` srcset="${sm} 960w, /media/img/${name}.webp 2000w" sizes="${sizes}"`;
  return `<img src="${src}"${srcset} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" ${attrs}/>`;
}

export const WA_ICON = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.2A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M9 8.6c.2 1.8 2.4 4.4 4.6 5.4l1.2-1.1 1.8.9-.4 1.6c-3 .4-7.4-3.6-7.6-6.6l1.5-.6.9 1.7Z"/></svg>';

export const ARROW = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';

function head({ lang, title, description, key, ogImage = 'tt-hero' }) {
  const other = lang === 'en' ? 'es' : 'en';
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="theme-color" content="#0e1116" />
  <link rel="canonical" href="${SITE}${r(key, lang)}" />
  <link rel="alternate" hreflang="${lang}" href="${SITE}${r(key, lang)}" />
  <link rel="alternate" hreflang="${other}" href="${SITE}${r(key, other)}" />
  <link rel="alternate" hreflang="x-default" href="${SITE}${r(key, 'en')}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${SITE}/media/img/${ogImage}.webp" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${lang === 'es' ? 'es_BO' : 'en_US'}" />
  <link rel="icon" type="image/png" href="/media/favicon.png" />
</head>`;
}

function nav(lang, key) {
  const t = T[lang];
  const other = lang === 'en' ? 'es' : 'en';
  const hotelLinks = HOTELS.map((h) => `
        <a href="${r(h.id, lang)}" class="hotels-menu__item">
          ${img(h.card, '', { small: true })}
          <span><strong>${esc(h.name)}</strong><small>${esc(h.place[lang])}</small></span>
        </a>`).join('');
  const link = (k) => `<a href="${r(k, lang)}"${k === key ? ' aria-current="page"' : ''}>${t.nav[k]}</a>`;
  return `
  <a class="skip" href="#main">${t.skip}</a>
  <header class="nav" data-nav>
    <a class="nav__brand" href="${r('home', lang)}" aria-label="Hoteles Rosario — ${t.nav.home}">
      <svg class="mark" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg>
      <span class="nav__word"><span>Hoteles</span><span>Rosario</span></span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <div class="nav__drop" data-drop>
        <button type="button" aria-expanded="false" aria-controls="hotels-menu" data-drop-btn${HOTELS.some((h) => h.id === key) ? ' aria-current="page"' : ''}>${t.nav.hotels}<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="hotels-menu" id="hotels-menu" data-drop-panel>${hotelLinks}
        </div>
      </div>
      ${link('rooms')}${link('dining')}${link('offers')}${link('gallery')}${link('contact')}
    </nav>
    <div class="nav__end">
      <a class="nav__lang" href="${r(key, other)}" hreflang="${other}" lang="${other}" aria-label="${t.otherLangName}">${t.otherLang}</a>
      <a class="btn btn--small" href="${r('book', lang)}">${t.nav.book}</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu" data-menu-toggle>
        <span></span><span></span><span class="sr-only">${t.nav.menu}</span>
      </button>
    </div>
  </header>

  <div class="menu" id="menu" hidden data-menu>
    <nav aria-label="Mobile">
      ${HOTELS.map((h) => `<a href="${r(h.id, lang)}" class="menu__hotel">${esc(h.name)}</a>`).join('')}
      <span class="menu__rule"></span>
      ${['rooms', 'dining', 'offers', 'gallery', 'contact'].map((k) => `<a href="${r(k, lang)}">${t.nav[k]}</a>`).join('')}
    </nav>
    <p class="menu__foot"><a href="${r(key, other)}" hreflang="${other}">${t.otherLangName}</a> · <a href="tel:${CONTACT.tel}">${CONTACT.phone}</a> · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p>
  </div>`;
}

export function bookForm(lang, { hotelId = '', cls = '' } = {}) {
  const t = T[lang].book;
  const opts = HOTELS.filter((h) => h.status === 'open')
    .map((h) => `<option value="${h.bookingId}"${h.id === hotelId ? ' selected' : ''}>${esc(h.name)} · ${esc(h.place[lang].split(' · ')[0])}</option>`).join('');
  return `
      <form class="book ${cls}" data-book-form>
        <label class="book__field">
          <span>${t.destination}</span>
          <select name="hotel" required>${opts}</select>
        </label>
        <label class="book__field"><span>${t.arrive}</span><input type="date" name="in" required /></label>
        <label class="book__field"><span>${t.depart}</span><input type="date" name="out" required /></label>
        <label class="book__field book__field--sm"><span>${t.guests}</span>
          <select name="adults"><option>1</option><option selected>2</option><option>3</option><option>4</option></select>
        </label>
        <button class="btn btn--solid" type="submit">${t.submit}</button>
        <p class="book__error" role="alert" data-book-error data-msg="${esc(t.error)}"></p>
      </form>`;
}

function bookBand(lang, hotelId) {
  return `
  <section class="book-band" id="book" data-theme="night" aria-label="${T[lang].book.title}">
    <div class="book-band__head">
      <h2 class="display" data-split>${T[lang].book.title}</h2>
      <a class="btn btn--wa" href="${r('book', lang)}${hotelId && hotelId !== 'centro' ? `?hotel=${hotelId}` : ''}">${WA_ICON}${lang === 'es' ? 'Reservar por WhatsApp' : 'Book on WhatsApp'}</a>
    </div>
    ${bookForm(lang, { hotelId, cls: 'book--band' })}
  </section>`;
}

function footer(lang) {
  const t = T[lang];
  const addr = HOTELS.map((h) => `
      <address>
        <h3><a href="${r(h.id, lang)}">${esc(h.name)}</a></h3>
        <p>${esc(h.address[lang])}${h.status === 'closed' ? `<br />${t.reopening}` : ''}</p>
        <a href="tel:${h.tel}">${h.phone}</a>
      </address>`).join('');
  return `
  <footer class="footer" id="contact-footer" data-theme="night">
    <div class="footer__cta">
      <p class="display">${t.footer.cta}</p>
      <div class="footer__actions">
        <a class="btn btn--solid" href="${r('book', lang)}">${t.footer.bookDirect}</a>
        <a class="btn" href="${CONTACT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
    <div class="footer__grid">${addr}
      <address>
        <h3>${t.footer.office}</h3>
        <p>${esc(CONTACT.office[lang])}</p>
        <a href="tel:${CONTACT.tel}">${CONTACT.phone}</a><br />
        <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
      </address>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      ${['rooms', 'dining', 'offers', 'gallery', 'contact'].map((k) => `<a href="${r(k, lang)}">${t.nav[k]}</a>`).join('')}
    </nav>
    <p class="footer__word" aria-hidden="true" data-footer-word>Rosario</p>
    <div class="footer__base">
      <p>© <span data-year>2026</span> ${t.footer.rights}</p>
      <nav aria-label="${t.footer.social}">
        <a href="${CONTACT.instagram}" target="_blank" rel="noopener">Instagram</a>
        <a href="${CONTACT.facebook}" target="_blank" rel="noopener">Facebook</a>
        <a href="${CONTACT.youtube}" target="_blank" rel="noopener">YouTube</a>
      </nav>
      <nav aria-label="${t.footer.languages}">
        <a href="/" hreflang="en" lang="en">English</a>
        <a href="/es/" hreflang="es" lang="es">Español</a>
      </nav>
    </div>
  </footer>`;
}

function chat(lang) {
  const s = lang === 'es'
    ? { open: 'Hablar con Rosar-IA', title: 'Rosar-IA', sub: 'Tu concierge andina · responde al instante', close: 'Cerrar chat', placeholder: 'Escribe tu pregunta…', send: 'Enviar', hello: '¡Hola! Soy Rosar-IA, la concierge virtual de Hoteles Rosario. Puedo ayudarte a elegir hotel, contarte sobre habitaciones, servicios y cómo llegar. ¿En qué te ayudo?', chips: ['¿Qué hotel me recomiendas?', '¿Cómo llego a Copacabana?', '¿El desayuno está incluido?', 'Ofertas en Uyuni'], note: 'Rosar-IA es una IA y puede equivocarse. Confirma precios y disponibilidad al reservar.', reset: 'Nueva conversación' }
    : { open: 'Chat with Rosar-IA', title: 'Rosar-IA', sub: 'Your Andean concierge · instant answers', close: 'Close chat', placeholder: 'Ask me anything…', send: 'Send', hello: 'Hi! I’m Rosar-IA, the virtual concierge of Hoteles Rosario. I can help you choose a hotel, and tell you about rooms, services and how to get here. How can I help?', chips: ['Which hotel suits me?', 'How do I get to Copacabana?', 'Is breakfast included?', 'Uyuni offers'], note: 'Rosar-IA is an AI and can make mistakes. Confirm prices and availability when booking.', reset: 'New conversation' };
  return `
  <div class="chat" data-chat data-lang="${lang}">
    <button class="chat__fab" type="button" aria-expanded="false" aria-controls="chat-panel" data-chat-open>
      <svg class="mark mark--chat" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg>
      <span>${s.title}</span>
    </button>
    <section class="chat__panel" id="chat-panel" role="dialog" aria-label="${s.title}" hidden data-chat-panel>
      <header class="chat__head">
        <svg class="mark" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg>
        <div><h2>${s.title}</h2><p>${s.sub}</p></div>
        <button type="button" class="chat__icon" data-chat-reset aria-label="${s.reset}" title="${s.reset}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg></button>
        <button type="button" class="chat__icon" data-chat-close aria-label="${s.close}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </header>
      <div class="chat__log" data-chat-log aria-live="polite" data-hello="${esc(s.hello)}"></div>
      <div class="chat__chips" data-chat-chips>${s.chips.map((c) => `<button type="button">${esc(c)}</button>`).join('')}</div>
      <form class="chat__form" data-chat-form>
        <label class="sr-only" for="chat-input">${s.placeholder}</label>
        <textarea id="chat-input" rows="1" maxlength="1200" placeholder="${s.placeholder}" data-chat-input></textarea>
        <button type="submit" class="chat__send" aria-label="${s.send}"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></button>
      </form>
      <p class="chat__note">${s.note}</p>
    </section>
  </div>`;
}

function waFab(lang) {
  const es = lang === 'es';
  const hello = encodeURIComponent(es ? '¡Hola Hoteles Rosario! Tengo una consulta.' : 'Hello Hoteles Rosario! I have a question.');
  return `
  <div class="wafab" data-wafab>
    <div class="wafab__pop" id="wafab-pop" hidden data-wafab-pop>
      <p class="wafab__title">${es ? 'Escríbenos por WhatsApp' : 'Message us on WhatsApp'}</p>
      <a href="${r('book', lang)}" class="wafab__opt"><strong>${es ? 'Reservar una estadía' : 'Book a stay'}</strong><small>${es ? 'Arma tu solicitud en 4 pasos' : 'Build your request in 4 steps'}</small></a>
      <a href="https://wa.me/${CONTACT.tel.replace('+', '')}?text=${hello}" target="_blank" rel="noopener" class="wafab__opt"><strong>${es ? 'Hacer una pregunta' : 'Ask a question'}</strong><small>${CONTACT.phone}</small></a>
      <a href="https://wa.me/59177006375?text=${hello}" target="_blank" rel="noopener" class="wafab__opt"><strong>${es ? 'Hotel en Uyuni' : 'Uyuni hotel'}</strong><small>+591 7700 6375</small></a>
    </div>
    <button type="button" class="wafab__btn" aria-expanded="false" aria-controls="wafab-pop" aria-label="WhatsApp" data-wafab-btn>${WA_ICON}</button>
  </div>`;
}

export function page({ lang, key, title, description, body, hotelId = '', ogImage, book = true }) {
  return `${head({ lang, title, description, key, ogImage })}
<body class="page page--${key}">
${nav(lang, key)}
  <main id="main">
${body}
${book ? bookBand(lang, hotelId) : ''}
  </main>
${footer(lang)}
${chat(lang)}
${waFab(lang)}
  <div class="cursor" aria-hidden="true" data-cursor><span data-cursor-label></span></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`;
}
