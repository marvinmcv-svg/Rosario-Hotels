import { HOTELS, WHATSAPP_BOOKING } from './content.js';
import { page, img, esc } from './layout.js';

export const BT = {
  en: {
    title: 'Book your stay — Hoteles Rosario',
    description: 'Request your stay at Hoteles Rosario in four steps and send it straight to our team on WhatsApp or online.',
    h1: 'Book your <em>stay</em>',
    kicker: 'Direct booking · WhatsApp or online',
    steps: ['Hotel', 'Dates & room', 'Your details', 'Send'],
    s1: 'Where would you like to stay?',
    s2: 'When, and which room?',
    s3: 'Who is travelling?',
    s4: 'Review and send',
    arrive: 'Arrive', depart: 'Depart', adults: 'Adults', children: 'Children',
    room: 'Room', anyRoom: 'Any room: recommend me one',
    extras: 'Requests', extra: { transfer: 'Airport / terminal pickup', early_checkin: 'Early check-in', late_checkout: 'Late check-out', celebration: 'Celebrating something', halfboard: 'Dinner included (half board)' },
    notes: 'Anything else we should know?', notesPh: 'Arrival time, dietary needs, a surprise for someone…',
    name: 'Full name', email: 'Email', phone: 'WhatsApp / phone', phonePh: '+591 7…', country: 'Country',
    back: 'Back', next: 'Continue',
    sendWa: 'Send on WhatsApp', sendWeb: 'Send request online',
    privacy: 'We only use your details to answer this request. Nothing is charged now: our team confirms availability and price with you.',
    nights: (n) => `${n} night${n === 1 ? '' : 's'}`,
    guests: (a, c) => `${a} adult${a === 1 ? '' : 's'}${c ? `, ${c} child${c === 1 ? '' : 'ren'}` : ''}`,
    err: { hotel: 'Choose a hotel to continue.', dates: 'Check your dates: departure must be after arrival, and arrival can’t be in the past.', name: 'Please tell us your name.', phone: 'Add a phone or WhatsApp number so we can reach you.', email: 'That email doesn’t look right.', storage: 'We couldn’t save your request just now. Please send it on WhatsApp instead.', generic: 'Something went wrong. Please try WhatsApp or call +591 7625 4988.' },
    doneTitle: 'Request received',
    doneText: (ref) => `Your reference is <strong>${ref}</strong>. Our team will confirm availability and price with you shortly, usually within a few hours.`,
    doneWa: 'WhatsApp didn’t open? Send the message again',
    another: 'Make another request',
    phone_header: 'Hoteles Rosario', phone_status: 'online', phone_today: 'Today',
    greeting: 'Hello! 👋 This is Hoteles Rosario. Tell us about your trip and we’ll reply right away.',
    msg: { hello: 'Hello Hoteles Rosario! I’d like to book:', hotel: 'Hotel', dates: 'Dates', room: 'Room', guests: 'Guests', extras: 'Requests', notes: 'Notes', name: 'Name', ref: 'Reference', thanks: 'Thank you!' },
    typing: 'Your message appears here as you fill in the form.',
  },
  es: {
    title: 'Reserva tu estadía — Hoteles Rosario',
    description: 'Solicita tu estadía en Hoteles Rosario en cuatro pasos y envíala directo a nuestro equipo por WhatsApp o en línea.',
    h1: 'Reserva tu <em>estadía</em>',
    kicker: 'Reserva directa · WhatsApp o en línea',
    steps: ['Hotel', 'Fechas y habitación', 'Tus datos', 'Enviar'],
    s1: '¿Dónde te gustaría hospedarte?',
    s2: '¿Cuándo y en qué habitación?',
    s3: '¿Quién viaja?',
    s4: 'Revisa y envía',
    arrive: 'Llegada', depart: 'Salida', adults: 'Adultos', children: 'Niños',
    room: 'Habitación', anyRoom: 'Cualquiera: recomiéndenme una',
    extras: 'Pedidos', extra: { transfer: 'Recojo del aeropuerto / terminal', early_checkin: 'Check-in temprano', late_checkout: 'Check-out tardío', celebration: 'Celebramos algo', halfboard: 'Cena incluida (media pensión)' },
    notes: '¿Algo más que debamos saber?', notesPh: 'Hora de llegada, alimentación, una sorpresa para alguien…',
    name: 'Nombre completo', email: 'Correo', phone: 'WhatsApp / teléfono', phonePh: '+591 7…', country: 'País',
    back: 'Atrás', next: 'Continuar',
    sendWa: 'Enviar por WhatsApp', sendWeb: 'Enviar solicitud en línea',
    privacy: 'Solo usamos tus datos para responder esta solicitud. No se cobra nada ahora: nuestro equipo confirma disponibilidad y precio contigo.',
    nights: (n) => `${n} noche${n === 1 ? '' : 's'}`,
    guests: (a, c) => `${a} adulto${a === 1 ? '' : 's'}${c ? `, ${c} niño${c === 1 ? '' : 's'}` : ''}`,
    err: { hotel: 'Elige un hotel para continuar.', dates: 'Revisa tus fechas: la salida debe ser posterior a la llegada y la llegada no puede ser en el pasado.', name: 'Por favor dinos tu nombre.', phone: 'Agrega un teléfono o WhatsApp para poder contactarte.', email: 'Ese correo no parece correcto.', storage: 'No pudimos guardar tu solicitud ahora. Por favor envíala por WhatsApp.', generic: 'Algo salió mal. Prueba por WhatsApp o llama al +591 7625 4988.' },
    doneTitle: 'Solicitud recibida',
    doneText: (ref) => `Tu código es <strong>${ref}</strong>. Nuestro equipo confirmará disponibilidad y precio contigo en breve, normalmente en pocas horas.`,
    doneWa: '¿No se abrió WhatsApp? Envía el mensaje otra vez',
    another: 'Hacer otra solicitud',
    phone_header: 'Hoteles Rosario', phone_status: 'en línea', phone_today: 'Hoy',
    greeting: '¡Hola! 👋 Somos Hoteles Rosario. Cuéntanos sobre tu viaje y te respondemos enseguida.',
    msg: { hello: '¡Hola Hoteles Rosario! Quisiera reservar:', hotel: 'Hotel', dates: 'Fechas', room: 'Habitación', guests: 'Huéspedes', extras: 'Pedidos', notes: 'Notas', name: 'Nombre', ref: 'Código', thanks: '¡Gracias!' },
    typing: 'Tu mensaje aparece aquí mientras completas el formulario.',
  },
};

/** Strings the browser needs (functions are rebuilt client-side from these). */
function clientData(lang) {
  const t = BT[lang];
  return {
    lang,
    wa: WHATSAPP_BOOKING,
    hotels: HOTELS.filter((h) => h.status === 'open').map((h) => ({
      id: h.id, name: h.fullName, short: h.name, place: h.place[lang],
      extras: h.id === 'titicaca' ? ['transfer', 'early_checkin', 'late_checkout', 'celebration', 'halfboard'] : ['transfer', 'early_checkin', 'late_checkout', 'celebration'],
      rooms: h.rooms.map((r) => ({ name: r.name[lang], img: r.img, view: r.view?.[lang] || '' })),
    })),
    t: { ...t, nights: undefined, guests: undefined, doneText: undefined, title: undefined, description: undefined },
  };
}

export function bookPage(lang) {
  const t = BT[lang];
  const open = HOTELS.filter((h) => h.status === 'open');
  const body = `
    <section class="bk" data-theme="night" data-booking>
      <header class="bk__head">
        <p class="phero__place">${t.kicker}</p>
        <h1 class="display" data-split>${t.h1}</h1>
      </header>

      <div class="bk__grid">
        <form class="bk__form" novalidate data-bk-form>
          <ol class="bk__steps" aria-label="Steps">
            ${t.steps.map((s, i) => `<li${i === 0 ? ' aria-current="step"' : ''} data-step-tab="${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s}</li>`).join('')}
          </ol>

          <fieldset class="bk__step" data-step="0">
            <legend class="bk__legend">${t.s1}</legend>
            <div class="bk__hotels">
              ${open.map((h) => `
              <label class="bk__hotel">
                <input type="radio" name="hotel" value="${h.id}" />
                ${img(h.card, '', { small: true })}
                <span class="bk__hotel-txt"><strong>${esc(h.name)}</strong><small>${esc(h.place[lang])}</small><small>${h.altitude}</small></span>
              </label>`).join('')}
            </div>
          </fieldset>

          <fieldset class="bk__step" data-step="1" hidden>
            <legend class="bk__legend">${t.s2}</legend>
            <div class="bk__row">
              <label class="field"><span>${t.arrive}</span><input type="date" name="checkIn" required /></label>
              <label class="field"><span>${t.depart}</span><input type="date" name="checkOut" required /></label>
              <label class="field field--sm"><span>${t.adults}</span><input type="number" name="adults" min="1" max="12" value="2" /></label>
              <label class="field field--sm"><span>${t.children}</span><input type="number" name="children" min="0" max="8" value="0" /></label>
            </div>
            <p class="bk__label">${t.room}</p>
            <div class="bk__rooms" data-bk-rooms></div>
            <p class="bk__label">${t.extras}</p>
            <div class="bk__extras" data-bk-extras></div>
            <label class="field"><span>${t.notes}</span><textarea name="notes" rows="3" maxlength="1500" placeholder="${esc(t.notesPh)}"></textarea></label>
          </fieldset>

          <fieldset class="bk__step" data-step="2" hidden>
            <legend class="bk__legend">${t.s3}</legend>
            <div class="bk__row bk__row--2">
              <label class="field"><span>${t.name}</span><input name="name" autocomplete="name" required maxlength="120" /></label>
              <label class="field"><span>${t.phone}</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="${t.phonePh}" required maxlength="40" /></label>
              <label class="field"><span>${t.email}</span><input name="email" type="email" autocomplete="email" maxlength="160" /></label>
              <label class="field"><span>${t.country}</span><input name="country" autocomplete="country-name" maxlength="60" /></label>
            </div>
            <label class="bk__hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
          </fieldset>

          <fieldset class="bk__step" data-step="3" hidden>
            <legend class="bk__legend">${t.s4}</legend>
            <dl class="bk__summary" data-bk-summary></dl>
            <div class="bk__send">
              <button type="button" class="btn btn--wa" data-bk-send="whatsapp">
                <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.2A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M9 8.6c.2 1.8 2.4 4.4 4.6 5.4l1.2-1.1 1.8.9-.4 1.6c-3 .4-7.4-3.6-7.6-6.6l1.5-.6.9 1.7Z"/></svg>
                ${t.sendWa}</button>
              <button type="button" class="btn" data-bk-send="web">${t.sendWeb}</button>
            </div>
            <p class="bk__privacy">${t.privacy}</p>
          </fieldset>

          <div class="bk__done" data-bk-done hidden tabindex="-1">
            <svg class="mark" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg>
            <h2 class="display">${t.doneTitle}</h2>
            <p data-bk-done-text></p>
            <a class="link-arrow" href="#" data-bk-wa-again target="_blank" rel="noopener" hidden>${t.doneWa}</a>
            <button type="button" class="btn" data-bk-reset>${t.another}</button>
          </div>

          <p class="bk__error" role="alert" data-bk-error></p>
          <div class="bk__nav" data-bk-nav>
            <button type="button" class="btn" data-bk-back hidden>${t.back}</button>
            <button type="button" class="btn btn--solid" data-bk-next>${t.next}</button>
          </div>
        </form>

        <aside class="phone" aria-label="WhatsApp preview">
          <div class="phone__frame">
            <div class="phone__notch"></div>
            <div class="phone__bar">
              <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>
              <span class="phone__avatar"><svg class="mark" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg></span>
              <span class="phone__who"><strong>${t.phone_header}</strong><small>${t.phone_status}</small></span>
            </div>
            <div class="phone__chat" data-phone-chat>
              <span class="phone__day">${t.phone_today}</span>
              <div class="wa wa--in"><p>${t.greeting}</p><time data-now></time></div>
              <div class="wa wa--out" data-phone-msg><p class="wa__hint">${t.typing}</p><time data-now></time></div>
            </div>
            <div class="phone__input"><span>${lang === 'es' ? 'Mensaje' : 'Message'}</span><i><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></i></div>
          </div>
        </aside>
      </div>
      <script type="application/json" id="bk-data">${JSON.stringify(clientData(lang)).replace(/</g, '\\u003c')}</script>
    </section>`;
  return page({ lang, key: 'book', title: t.title, description: t.description, body, book: false, ogImage: 'tt-room' });
}
