import { HOTELS, THEMED, OFFERS, FAQ, CONTACT, T, hotel, bookingUrl } from './content.js';
import { page, img, esc, r, bookForm, ARROW } from './layout.js';

const t = (lang) => T[lang];

/* ---------------- shared blocks ---------------- */

function pageHero(lang, { title, kicker, image, alt, data = '', cta = '' }) {
  return `
    <section class="phero" data-theme="night" data-phero>
      <div class="phero__media" data-phero-media>${img(image, alt, { eager: true })}</div>
      <div class="phero__shade" aria-hidden="true"></div>
      <div class="phero__content">
        <p class="phero__place">${esc(kicker)}</p>
        <h1 class="phero__title" data-phero-title>${title}</h1>
        ${data}
        ${cta}
      </div>
    </section>`;
}

function themedList(lang) {
  return `
      <ul class="rooms__list" data-rooms>
        ${THEMED.map((x) => `
        <li class="room" data-img="/media/img/${x.img}-sm.webp">
          <span class="room__name">${x.name}</span>
          <span class="room__note">${esc(x.note[lang])}</span>
          <span class="room__house">${x.house}</span>
          ${img(x.img, `${x.name}`, { small: true, cls: 'room__img' })}
        </li>`).join('')}
      </ul>
      <div class="rooms__follower" aria-hidden="true" data-follower><div class="rooms__follower-inner"><img alt="" /><img alt="" /></div></div>`;
}

function roomRows(lang, h) {
  const tt = t(lang);
  return h.rooms.map((rm, i) => `
        <article class="rrow${i % 2 ? ' rrow--flip' : ''}" data-reveal>
          <figure class="rrow__media">${img(rm.img, rm.name[lang], { sizes: '(min-width: 900px) 42vw, 100vw' })}</figure>
          <div class="rrow__body">
            <p class="rrow__house">${esc(h.name)}</p>
            <h3>${esc(rm.name[lang])}</h3>
            <p>${esc(rm.desc[lang])}</p>
            <dl class="rrow__data">
              ${rm.size ? `<div><dt>${tt.size}</dt><dd>${rm.size}</dd></div>` : ''}
              ${rm.beds ? `<div><dt>${tt.beds}</dt><dd>${esc(rm.beds[lang])}</dd></div>` : ''}
              ${rm.view ? `<div><dt>${tt.view}</dt><dd>${esc(rm.view[lang])}</dd></div>` : ''}
              ${rm.where ? `<div><dt>${tt.location}</dt><dd>${esc(rm.where[lang])}</dd></div>` : ''}
            </dl>
            <a class="link-arrow" href="${bookingUrl(h.bookingId)}" target="_blank" rel="noopener">${tt.reserve}</a>
          </div>
        </article>`).join('');
}

function galleryStrip(lang, names, label) {
  return `
    <section class="strip" data-theme="night" aria-label="${esc(label)}">
      <div class="strip__track" data-strip>
        ${names.map((n) => `<figure>${img(n, '', { small: true })}</figure>`).join('')}
      </div>
    </section>`;
}

/* ---------------- HOME ---------------- */

const HOME = {
  en: {
    title: 'Hoteles Rosario — Andean boutique hotels in Copacabana, Uyuni & La Paz',
    description: 'Four-star thematic, eco-friendly hotels on the roof of the Andes: Lake Titicaca, the Uyuni Salt Flat and La Paz. Handcrafted Andean rooms, warm Bolivian hospitality. Book direct.',
    h1: ['Four houses', 'on the <em>roof</em>', 'of the Andes'],
    lede: 'Thematic, eco-friendly four-star hotels in Copacabana, Uyuni and La&nbsp;Paz, with every room finished by hand.',
    slides: ['Lago Titicaca', 'Uyuni', 'La Paz Sur', 'Copacabana, night'],
    manifesto: ['True elegance lives in', 'handcrafted detail. Every one of our rooms pays tribute to Andean culture, from the', 'woven aguayo on the bed to the tea waiting at the door. Choose your altitude. We will keep you warm.'],
    meta: ['4 houses · 3 landscapes · 1 way of receiving you', 'Solar-powered in Uyuni. Underfloor heating against the Altiplano night. Herbal tea, always on.'],
    housesTitle: 'Choose your altitude', housesSub: 'Lake, salt or city. Each house is its own world, all of them Rosario.',
    roomsTitle: 'Rooms with a story', roomsSub: 'Our rooms have names, not just numbers. Each one is dressed around a craft, a custom or a character of the Altiplano.', allRooms: 'See every room',
    filmsTitle: 'Filmed by us', filmsSub: 'Straight from <a href="https://www.instagram.com/hotelesrosariobolivia/" target="_blank" rel="noopener">@hotelesrosariobolivia</a>. Tap a film for sound.',
    films: ['Volvamos a descubrir · Uyuni', 'Views of the lake · Copacabana', 'Hospitality · Uyuni', 'Semana Santa · Copacabana'],
    tableTitle: '<span>At the</span> <em>table</em>',
    tableLead: 'A buffet breakfast to set you up for the Salar, a high-end restaurant under the timber roof in Uyuni, and dinner beneath the arches in Copacabana. At altitude, we think eating well is part of the welcome.',
    tableCaps: ['Eggs your way, before the Salar', 'Dessert, after the cold', 'Complimentary herbal tea, all day'],
    diningLink: 'Explore our dining',
    offersLink: 'All offers',
  },
  es: {
    title: 'Hoteles Rosario — Hoteles boutique andinos en Copacabana, Uyuni y La Paz',
    description: 'Hoteles temáticos y ecológicos de cuatro estrellas en el techo de los Andes: Lago Titicaca, Salar de Uyuni y La Paz. Habitaciones hechas a mano y cálida hospitalidad boliviana. Reserva directo.',
    h1: ['Cuatro casas', 'en el <em>techo</em>', 'de los Andes'],
    lede: 'Hoteles temáticos y ecológicos de cuatro estrellas en Copacabana, Uyuni y La&nbsp;Paz, con cada habitación terminada a mano.',
    slides: ['Lago Titicaca', 'Uyuni', 'La Paz Sur', 'Copacabana de noche'],
    manifesto: ['La verdadera elegancia vive en el', 'detalle hecho a mano. Cada una de nuestras habitaciones rinde tributo a la cultura andina, desde el', 'aguayo tejido sobre la cama hasta el té que te espera en la puerta. Elige tu altitud. Nosotros te abrigamos.'],
    meta: ['4 casas · 3 paisajes · 1 manera de recibirte', 'Energía solar en Uyuni. Piso radiante contra la noche del Altiplano. Infusiones, siempre listas.'],
    housesTitle: 'Elige tu altitud', housesSub: 'Lago, sal o ciudad. Cada casa es un mundo propio, todas son Rosario.',
    roomsTitle: 'Habitaciones con historia', roomsSub: 'Nuestras habitaciones tienen nombre, no solo número. Cada una gira en torno a un oficio, una costumbre o un personaje del Altiplano.', allRooms: 'Ver todas las habitaciones',
    filmsTitle: 'Filmado por nosotros', filmsSub: 'Directo desde <a href="https://www.instagram.com/hotelesrosariobolivia/" target="_blank" rel="noopener">@hotelesrosariobolivia</a>. Toca un video para activar el sonido.',
    films: ['Volvamos a descubrir · Uyuni', 'Vistas del lago · Copacabana', 'Hospitalidad · Uyuni', 'Semana Santa · Copacabana'],
    tableTitle: '<span>A la</span> <em>mesa</em>',
    tableLead: 'Un desayuno buffet para empezar el día en el Salar, un restaurante de alto nivel bajo el techo de madera en Uyuni y cenas bajo los arcos en Copacabana. En la altura, comer bien es parte de la bienvenida.',
    tableCaps: ['Huevos a tu gusto, antes del Salar', 'El postre, después del frío', 'Infusiones de cortesía, todo el día'],
    diningLink: 'Conoce nuestra gastronomía',
    offersLink: 'Todas las ofertas',
  },
};

export function home(lang) {
  const c = HOME[lang];
  const tt = t(lang);
  const houses = HOTELS.map((h) => `
          <article class="house${h.status === 'closed' ? ' house--closed' : ''}" data-house>
            <figure class="house__media">
              <div class="house__img" data-parallax-x>${img(h.card, h.fullName, { sizes: '(min-width: 900px) 58vw, 100vw' })}</div>
              ${h.status === 'closed' ? `<span class="stamp">${tt.reopening}</span>` : ''}
            </figure>
            <div class="house__body">
              <p class="house__place">${esc(h.place[lang])}</p>
              <h3 class="house__name"><a href="${r(h.id, lang)}">${esc(h.name)} <em>${h.collection}</em></a></h3>
              <dl class="house__data">
                <div><dt>${tt.altitude}</dt><dd>${h.altitude}</dd></div>
                <div><dt>${h.status === 'closed' ? tt.status : tt.position}</dt><dd>${h.status === 'closed' ? tt.underRenovation : h.coords}</dd></div>
              </dl>
              <p class="house__copy">${esc(h.lead[lang])}</p>
              <div class="house__thumbs">${h.thumbs.map((n) => img(n, '', { small: true })).join('')}</div>
              <div class="house__ctas">
                <a class="btn btn--small" href="${r(h.id, lang)}">${tt.discover}</a>
                ${h.status === 'open' ? `<a class="link-arrow" href="${bookingUrl(h.bookingId)}" target="_blank" rel="noopener">${tt.reserve}</a>` : ''}
              </div>
            </div>
          </article>`).join('');

  const body = `
    <div class="loader" aria-hidden="true">
      <div class="loader__inner">
        <svg class="mark mark--loader" viewBox="-1 -1 43 37" data-mark></svg>
        <p class="loader__word">Hoteles Rosario</p>
      </div>
      <p class="loader__count"><span data-count>0</span></p>
    </div>
    <section class="hero" id="top" data-theme="night">
      <div class="hero__media" data-hero>
        <img class="hero__fallback" src="/media/img/tt-hero.webp" alt="" fetchpriority="high" />
        <canvas class="hero__gl" data-hero-gl aria-hidden="true"></canvas>
      </div>
      <div class="hero__shade" aria-hidden="true"></div>
      <div class="hero__content">
        <h1 class="hero__title" data-hero-title>${c.h1.map((l) => `<span class="line">${l}</span>`).join('')}</h1>
        <p class="hero__lede" data-hero-fade>${c.lede}</p>
      </div>
      <div class="hero__slides" data-hero-fade aria-live="polite">
        ${c.slides.map((s, i) => `<button type="button" class="hero__slide${i ? '' : ' is-active'}" data-slide="${i}"><span class="hero__slide-bar"><i></i></span><span>${s}</span></button>`).join('')}
      </div>
      <div id="book" data-hero-fade>${bookForm(lang)}</div>
      <div class="hero__scroll" aria-hidden="true" data-hero-fade><span>Scroll</span><i></i></div>
    </section>

    <section class="manifesto" data-theme="night">
      <p class="manifesto__text" data-words>
        ${c.manifesto[0]} <span class="chip"><img src="/media/img/uy-deco-sm.webp" alt="" loading="lazy" /></span>
        ${c.manifesto[1]} <span class="chip"><img src="/media/img/th-chuspas-sm.webp" alt="" loading="lazy" /></span>
        ${c.manifesto[2]}
      </p>
      <div class="manifesto__meta"><p>${c.meta[0]}</p><p>${c.meta[1]}</p></div>
    </section>

    <section class="houses" id="houses" data-theme="salt">
      <div class="houses__intro">
        <h2 class="display" data-split>${c.housesTitle}</h2>
        <p>${c.housesSub}</p>
      </div>
      <div class="houses__pin">
        <div class="houses__track" data-track>${houses}
        </div>
        <ol class="houses__progress" aria-hidden="true">
          ${HOTELS.map((h) => `<li>${esc(h.name)}</li>`).join('')}
          <span class="houses__bar"><i data-houses-bar></i></span>
        </ol>
      </div>
    </section>

    <section class="rooms" id="rooms" data-theme="adobe">
      <div class="rooms__head">
        <h2 class="display" data-split>${c.roomsTitle}</h2>
        <p>${c.roomsSub}<br /><a class="link-arrow" href="${r('rooms', lang)}">${c.allRooms}</a></p>
      </div>
      ${themedList(lang)}
    </section>

    <section class="films" id="films" data-theme="night">
      <div class="films__head">
        <h2 class="display" data-split>${c.filmsTitle}</h2>
        <p>${c.filmsSub}</p>
      </div>
      <div class="films__row" data-films>
        ${['ig-reel-reopening', 'ig-reel-titicaca-views', 'ig-reel-uyuni', 'ig-reel-copacabana'].map((v, i) => `
        <figure class="film">
          <video muted loop playsinline preload="none" poster="/media/video/${v}.jpg" src="/media/video/${v}.mp4" aria-label="${esc(c.films[i])}"></video>
          <figcaption>${c.films[i]}</figcaption>
          <span class="film__sound" aria-hidden="true"></span>
        </figure>`).join('')}
      </div>
    </section>

    <section class="table" id="table" data-theme="night">
      <div class="table__stage" data-table>
        <div class="table__frame" data-table-frame>${img('tt-restaurant', '', {})}</div>
        <div class="table__title"><h2 class="display display--xl">${c.tableTitle}</h2></div>
      </div>
      <div class="table__copy">
        <p class="lead">${c.tableLead}</p>
        <div class="table__grid">
          <figure>${img('uy-breakfast', c.tableCaps[0], { small: true })}<figcaption>${c.tableCaps[0]}</figcaption></figure>
          <figure>${img('uy-dessert', c.tableCaps[1], { small: true })}<figcaption>${c.tableCaps[1]}</figcaption></figure>
          <figure>${img('tt-lobby', c.tableCaps[2], { small: true })}<figcaption>${c.tableCaps[2]}</figcaption></figure>
        </div>
        <a class="link-arrow" href="${r('dining', lang)}">${c.diningLink}</a>
      </div>
    </section>

    ${offersBlock(lang, c.offersLink)}

    <section class="gram" data-theme="salt" aria-label="Instagram">
      <a class="gram__handle" href="${CONTACT.instagram}" target="_blank" rel="noopener">@hotelesrosariobolivia</a>
      <div class="gram__marquee" data-marquee>
        <div class="gram__track">
          ${['ig-uyuni-time', 'ig-copa-beach', 'ig-uyuni-refuge', 'ig-copa-view', 'ig-uyuni-breakfast', 'ig-uyuni-rest', 'ig-uyuni-salar', 'ig-bolivia'].map((n) => `<img src="/media/ig/${n}.webp" alt="Instagram @hotelesrosariobolivia" loading="lazy" />`).join('')}
        </div>
      </div>
    </section>`;
  return page({ lang, key: 'home', title: c.title, description: c.description, body, book: false });
}

function offersBlock(lang, linkLabel) {
  const [main, ...rest] = OFFERS;
  const tt = t(lang);
  return `
    <section class="offers" id="offers" data-theme="salt">
      <div class="offer">
        <figure class="offer__media">${img(main.img, main.sub[lang], { sizes: '(min-width: 900px) 50vw, 100vw', attrs: 'data-reveal-img' })}</figure>
        <div class="offer__body">
          <h2 class="display" data-split>${main.title[lang]}</h2>
          <p>${main.sub[lang]}<br />${esc(hotel(main.hotel).fullName)}</p>
          <p class="price"><span>${tt.from}</span> ${main.price}</p>
          <a class="btn btn--solid" href="${main.url}" target="_blank" rel="noopener">${main.cta[lang]}</a>
        </div>
      </div>
      <ul class="offers__list">
        ${rest.map((o) => `
        <li>
          <h3>${o.title[lang]}</h3>
          <p>${o.sub[lang]}</p>
          <a class="link-arrow" href="${o.url}" target="_blank" rel="noopener">${o.cta[lang]}</a>
        </li>`).join('')}
        <li>
          <h3>${lang === 'es' ? 'Quédate más en Uyuni' : 'Stay longer in Uyuni'}</h3>
          <p>${lang === 'es' ? '20% de descuento desde tres noches. 10% en reservas de último minuto.' : 'Save 20% on three nights or more, and 10% on last-minute stays.'}</p>
          <a class="link-arrow" href="${linkLabel ? r('offers', lang) : r('uyuni', lang)}">${linkLabel || (lang === 'es' ? 'Ver Uyuni' : 'See Uyuni')}</a>
        </li>
      </ul>
    </section>`;
}

/* ---------------- HOTEL ---------------- */

export function hotelPage(lang, id) {
  const h = hotel(id);
  const tt = t(lang);
  const idx = HOTELS.indexOf(h);
  const next = HOTELS[(idx + 1) % HOTELS.length];
  const open = h.status === 'open';

  const data = `
        <dl class="phero__data">
          <div><dt>${tt.altitude}</dt><dd>${h.altitude}</dd></div>
          <div><dt>${open ? tt.position : tt.status}</dt><dd>${open ? h.coords : tt.underRenovation}</dd></div>
          <div><dt>★</dt><dd>${h.stars} ${lang === 'es' ? 'estrellas' : 'stars'}</dd></div>
        </dl>`;
  const cta = open
    ? `<div class="phero__ctas"><a class="btn btn--solid" href="${bookingUrl(h.bookingId)}" target="_blank" rel="noopener">${tt.reserveAt} ${esc(h.name)}</a><a class="btn" href="#rooms-list">${tt.roomsTitle}</a></div>`
    : `<div class="phero__ctas"><a class="btn btn--solid" href="${r('sur', lang)}">${lang === 'es' ? 'Hospédate en Rosario Sur' : 'Stay at Rosario Sur'}</a></div>`;

  const body = `
    ${pageHero(lang, { title: `${esc(h.name)} <em>${h.collection}</em>`, kicker: h.place[lang], image: h.hero, alt: h.fullName, data, cta })}

    <section class="intro" data-theme="salt">
      <p class="lead intro__lead" data-reveal>${esc(h.lead[lang])}</p>
      <div class="intro__cols">
        <p data-reveal>${esc(h.body[lang])}</p>
        <ul class="intro__list" data-reveal>${h.highlights.map((x) => `<li>${esc(x[lang])}</li>`).join('')}</ul>
      </div>
    </section>

    ${h.rooms.length ? `
    <section class="rlist" id="rooms-list" data-theme="salt">
      <h2 class="display" data-split>${tt.roomsTitle}</h2>
      ${roomRows(lang, h)}
    </section>` : ''}

    ${galleryStrip(lang, h.gallery, tt.gallery)}

    ${h.offers ? `
    <section class="hoffers" data-theme="adobe">
      <h2 class="display" data-split>${tt.offersTitle}</h2>
      <ul>${h.offers.map((o) => `<li data-reveal><h3>${esc(o.title[lang])}</h3><p>${esc(o.text[lang])}</p></li>`).join('')}</ul>
      <a class="btn btn--dark" href="https://www.gruporosario.com/en/reservas/?hotel_id=${h.bookingId}" target="_blank" rel="noopener">${tt.reserve}</a>
    </section>` : ''}

    <section class="info" data-theme="salt">
      ${h.services.length ? `
      <div class="info__col">
        <h2 class="h3">${tt.services}</h2>
        <ul class="ticks">${h.services.map((s) => `<li>${esc(s[lang])}</li>`).join('')}</ul>
      </div>` : ''}
      <div class="info__col">
        <h2 class="h3">${tt.gettingHere}</h2>
        <ol class="steps">${h.gettingHere.map((s) => `<li>${esc(s[lang])}</li>`).join('')}</ol>
        <p class="info__contact">${esc(h.address[lang])}<br />
          <a href="tel:${h.tel}">${h.phone}</a> · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p>
        <a class="link-arrow" href="${h.maps}" target="_blank" rel="noopener">${tt.openMaps}</a>
      </div>
    </section>

    <a class="next" href="${r(next.id, lang)}" data-theme="night">
      <span class="next__label">${tt.nextHotel}</span>
      <span class="next__name">${esc(next.name)} <em>${next.collection}</em></span>
      <span class="next__img">${img(next.card, '', { small: true })}</span>
    </a>`;

  const titleSuffix = lang === 'es' ? 'Hoteles Rosario' : 'Hoteles Rosario';
  return page({
    lang, key: id, hotelId: id, ogImage: h.hero,
    title: `${h.fullName} — ${h.place[lang]} | ${titleSuffix}`,
    description: `${h.tagline[lang]} ${h.lead[lang]}`.slice(0, 300),
    body,
  });
}

/* ---------------- ROOMS ---------------- */

export function roomsPage(lang) {
  const tt = t(lang);
  const open = HOTELS.filter((h) => h.rooms.length);
  const body = `
    ${pageHero(lang, { title: lang === 'es' ? 'Habitaciones <em>con historia</em>' : 'Rooms <em>with a story</em>', kicker: lang === 'es' ? 'Habitaciones y suites' : 'Rooms & suites', image: 'th-soles', alt: '' })}

    <section class="rooms rooms--page" data-theme="adobe">
      <div class="rooms__head">
        <h2 class="display" data-split>${lang === 'es' ? 'Temáticas' : 'Themed rooms'}</h2>
        <p>${lang === 'es' ? 'Cada habitación temática gira en torno a un oficio, una costumbre o un personaje del Altiplano.' : 'Each themed room is dressed around a craft, a custom or a character of the Altiplano.'}</p>
      </div>
      ${themedList(lang)}
    </section>

    <section class="rlist" data-theme="salt">
      <div class="tabs" role="tablist" data-tabs>
        <button role="tab" aria-selected="true" data-filter="all">${lang === 'es' ? 'Todas' : 'All'}</button>
        ${open.map((h) => `<button role="tab" aria-selected="false" data-filter="${h.id}">${esc(h.name)}</button>`).join('')}
      </div>
      ${open.map((h) => `
      <div class="rgroup" data-group="${h.id}">
        <div class="rgroup__head">
          <h2 class="display"><a href="${r(h.id, lang)}">${esc(h.name)} <em>${h.collection}</em></a></h2>
          <p>${esc(h.place[lang])} · ${h.altitude}</p>
        </div>
        ${roomRows(lang, h)}
      </div>`).join('')}
    </section>`;
  return page({
    lang, key: 'rooms', ogImage: 'th-soles',
    title: lang === 'es' ? 'Habitaciones y suites — Hoteles Rosario' : 'Rooms & suites — Hoteles Rosario',
    description: lang === 'es' ? 'Habitaciones temáticas andinas y suites con vista al lago, al salar y a la ciudad en Copacabana, Uyuni y La Paz.' : 'Themed Andean rooms and suites with lake, salt-flat and city views in Copacabana, Uyuni and La Paz.',
    body,
  });
}

/* ---------------- DINING ---------------- */

export function diningPage(lang) {
  const es = lang === 'es';
  const blocks = [
    { img: 'tt-restaurant', title: es ? 'Bajo los arcos del lago' : 'Beneath the lake arches', house: 'Lago Titicaca', text: es ? 'El restaurante del Hotel Rosario Lago Titicaca se abre en arcos hacia la bahía de Copacabana. Desayuno incluido para todos los huéspedes, infusiones de cortesía y la mesa puesta para ver caer la tarde sobre el lago.' : 'The restaurant at Hotel Rosario Lago Titicaca opens through arches onto the bay of Copacabana. Breakfast is included for every guest, herbal teas are on the house, and the tables are set to watch the evening fall over the lake.', link: 'titicaca' },
    { img: 'uy-restaurant', title: es ? 'Fuego después del blanco' : 'Fire after the white', house: 'Uyuni', text: es ? 'Nuestro restaurante de alto nivel en Uyuni, bajo un techo de madera con grandes ventanales, está pensado para comer bien y descansar después de un día en el Salar.' : 'Our high-end restaurant in Uyuni, under a timber roof with wide windows, is designed for eating well and resting after a day on the Salar.', link: 'uyuni' },
    { img: 'uy-breakfast', title: es ? 'Desayuno antes del amanecer' : 'Breakfast before sunrise', house: 'Uyuni · La Paz Sur', text: es ? 'Desayuno buffet incluido en Uyuni y La Paz Sur, con huevos preparados a tu gusto, para empezar temprano la ruta hacia el Salar o la ciudad.' : 'A buffet breakfast is included in Uyuni and La Paz Sur, with eggs cooked to order, for an early start towards the Salar or the city.', link: 'sur' },
  ];
  const body = `
    ${pageHero(lang, { title: es ? 'A la <em>mesa</em>' : 'At the <em>table</em>', kicker: es ? 'Gastronomía' : 'Dining', image: 'tt-restaurant', alt: '' })}
    <section class="intro" data-theme="salt">
      <p class="lead intro__lead" data-reveal>${es ? 'En la altura, comer bien es parte de la bienvenida. Desayunos para empezar temprano, cenas con vista y una taza de té siempre lista.' : 'At altitude, eating well is part of the welcome. Breakfasts for an early start, dinners with a view and a cup of tea always ready.'}</p>
    </section>
    <section class="dine" data-theme="salt">
      ${blocks.map((b, i) => `
      <article class="dine__item${i % 2 ? ' dine__item--flip' : ''}" data-reveal>
        <figure>${img(b.img, b.title, { sizes: '(min-width: 900px) 55vw, 100vw' })}</figure>
        <div>
          <p class="rrow__house">${b.house}</p>
          <h2 class="display">${b.title}</h2>
          <p>${b.text}</p>
          <a class="link-arrow" href="${r(b.link, lang)}">${es ? 'Ver el hotel' : 'See the hotel'}</a>
        </div>
      </article>`).join('')}
    </section>
    ${galleryStrip(lang, ['uy-dessert', 'tt-lobby', 'uy-breakfast', 'tt-restaurant', 'uy-restaurant', 'amenities'], es ? 'Galería' : 'Gallery')}`;
  return page({
    lang, key: 'dining', ogImage: 'tt-restaurant',
    title: es ? 'Gastronomía — Hoteles Rosario' : 'Dining — Hoteles Rosario',
    description: es ? 'Restaurantes y desayunos en Hoteles Rosario: cenas bajo los arcos del Lago Titicaca y restaurante de alto nivel en Uyuni.' : 'Restaurants and breakfasts at Hoteles Rosario: dinner beneath the Lake Titicaca arches and a high-end restaurant in Uyuni.',
    body,
  });
}

/* ---------------- OFFERS ---------------- */

export function offersPage(lang) {
  const es = lang === 'es';
  const uy = hotel('uyuni');
  const body = `
    ${pageHero(lang, { title: es ? 'Ofertas y <em>escapadas</em>' : 'Offers & <em>escapes</em>', kicker: es ? 'Reserva directo, ahorra más' : 'Book direct, save more', image: 'tt-room-lake', alt: '' })}
    ${offersBlock(lang, '')}
    <section class="hoffers" data-theme="adobe">
      <h2 class="display" data-split>${es ? 'Tarifas en Uyuni' : 'Rates in Uyuni'}</h2>
      <ul>${uy.offers.map((o) => `<li data-reveal><h3>${esc(o.title[lang])}</h3><p>${esc(o.text[lang])}</p></li>`).join('')}</ul>
      <a class="btn btn--dark" href="https://www.gruporosario.com/en/reservas/?hotel_id=${uy.bookingId}" target="_blank" rel="noopener">${es ? 'Ver disponibilidad en Uyuni' : 'Check Uyuni availability'}</a>
    </section>`;
  return page({
    lang, key: 'offers', ogImage: 'tt-room',
    title: es ? 'Ofertas — Hoteles Rosario' : 'Offers — Hoteles Rosario',
    description: es ? 'Ofertas de Hoteles Rosario: habitación con vista al Lago Titicaca desde US$100, escapadas con media pensión y descuentos en Uyuni.' : 'Hoteles Rosario offers: lake-view room on Lake Titicaca from US$100, half-board escapes and Uyuni discounts.',
    body,
  });
}

/* ---------------- GALLERY ---------------- */

export function galleryPage(lang) {
  const es = lang === 'es';
  const items = HOTELS.flatMap((h) => h.gallery.map((n) => ({ n, h })));
  const seen = new Set();
  const uniq = items.filter((x) => (seen.has(x.n) ? false : seen.add(x.n)));
  const body = `
    ${pageHero(lang, { title: es ? 'Galería' : 'Gallery', kicker: es ? 'Lago, sal y ciudad' : 'Lake, salt and city', image: 'tt-aerial', alt: '' })}
    <section class="gallery" data-theme="night">
      <div class="tabs tabs--dark" role="tablist" data-tabs>
        <button role="tab" aria-selected="true" data-filter="all">${es ? 'Todo' : 'All'}</button>
        ${HOTELS.map((h) => `<button role="tab" aria-selected="false" data-filter="${h.id}">${esc(h.name)}</button>`).join('')}
      </div>
      <div class="gallery__grid" data-gallery>
        ${uniq.map(({ n, h }) => `<button type="button" class="gallery__item" data-group="${h.id}" data-full="/media/img/${n}.webp" aria-label="${esc(h.name)}">${img(n, h.fullName, { small: true })}</button>`).join('')}
      </div>
    </section>
    <dialog class="lightbox" data-lightbox>
      <img alt="" />
      <button type="button" class="lightbox__close" aria-label="${es ? 'Cerrar' : 'Close'}" data-lightbox-close><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="${es ? 'Anterior' : 'Previous'}" data-lightbox-prev><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5m6-6-6 6 6 6"/></svg></button>
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="${es ? 'Siguiente' : 'Next'}" data-lightbox-next>${ARROW}</button>
    </dialog>`;
  return page({
    lang, key: 'gallery', ogImage: 'tt-aerial',
    title: es ? 'Galería — Hoteles Rosario' : 'Gallery — Hoteles Rosario',
    description: es ? 'Fotos de Hoteles Rosario en Copacabana, Uyuni y La Paz.' : 'Photos of Hoteles Rosario in Copacabana, Uyuni and La Paz.',
    body,
  });
}

/* ---------------- CONTACT ---------------- */

export function contactPage(lang) {
  const es = lang === 'es';
  const tt = t(lang);
  const body = `
    ${pageHero(lang, { title: es ? 'Hablemos' : 'Let’s <em>talk</em>', kicker: es ? 'Contacto y cómo llegar' : 'Contact & getting here', image: 'tt-lobby', alt: '' })}

    <section class="contact" data-theme="salt">
      <div class="contact__main">
        <h2 class="display" data-split>${es ? 'Reservas centrales' : 'Central reservations'}</h2>
        <p class="lead">${es ? 'Nuestro equipo responde por WhatsApp, teléfono y correo.' : 'Our team answers on WhatsApp, phone and email.'}</p>
        <ul class="contact__ways">
          <li><span>${tt.whatsapp}</span><a href="${CONTACT.whatsapp}" target="_blank" rel="noopener">${CONTACT.phone}</a></li>
          <li><span>${tt.call}</span><a href="tel:${CONTACT.tel}">${CONTACT.phone}</a></li>
          <li><span>${tt.email}</span><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
          <li><span>${es ? 'Oficina' : 'Office'}</span><p>${esc(CONTACT.office[lang])}</p></li>
        </ul>
      </div>
      <form class="compose" data-compose data-to="${CONTACT.email}" data-wa="${CONTACT.whatsapp.replace('https://wa.me/', '')}">
        <h3>${es ? 'Escríbenos' : 'Write to us'}</h3>
        <label><span>${es ? 'Nombre' : 'Name'}</span><input name="name" required autocomplete="name" /></label>
        <label><span>${es ? 'Hotel' : 'Hotel'}</span>
          <select name="hotel">${HOTELS.map((h) => `<option>${esc(h.fullName)}</option>`).join('')}</select>
        </label>
        <label><span>${es ? 'Mensaje' : 'Message'}</span><textarea name="message" rows="5" required></textarea></label>
        <div class="compose__actions">
          <button class="btn btn--solid" type="submit" value="wa">${es ? 'Enviar por WhatsApp' : 'Send on WhatsApp'}</button>
          <button class="btn" type="submit" value="mail">${es ? 'Enviar por correo' : 'Send by email'}</button>
        </div>
      </form>
    </section>

    <section class="hotels-contact" data-theme="salt">
      ${HOTELS.map((h) => `
      <article class="hc" data-reveal>
        <figure>${img(h.card, h.fullName, { small: true })}</figure>
        <div>
          <h3><a href="${r(h.id, lang)}">${esc(h.name)} <em>${h.collection}</em></a></h3>
          <p>${esc(h.address[lang])}${h.status === 'closed' ? ` · <strong>${tt.underRenovation}</strong>` : ''}</p>
          <p><a href="tel:${h.tel}">${h.phone}</a> · <a href="${h.maps}" target="_blank" rel="noopener">${tt.openMaps}</a></p>
          <details>
            <summary>${tt.gettingHere}</summary>
            <ol class="steps">${h.gettingHere.map((s) => `<li>${esc(s[lang])}</li>`).join('')}</ol>
          </details>
        </div>
      </article>`).join('')}
    </section>

    <section class="faq" data-theme="adobe">
      <h2 class="display" data-split>${es ? 'Preguntas frecuentes' : 'Questions'}</h2>
      <div class="faq__list">
        ${FAQ.map((f) => `<details><summary>${esc(f.q[lang])}</summary><p>${esc(f.a[lang])}</p></details>`).join('')}
      </div>
    </section>`;
  return page({
    lang, key: 'contact', ogImage: 'tt-lobby',
    title: es ? 'Contacto y cómo llegar — Hoteles Rosario' : 'Contact & getting here — Hoteles Rosario',
    description: es ? 'Contacta a Hoteles Rosario por WhatsApp, teléfono o correo, y descubre cómo llegar a Copacabana, Uyuni y La Paz.' : 'Contact Hoteles Rosario by WhatsApp, phone or email, and find out how to reach Copacabana, Uyuni and La Paz.',
    body,
  });
}
