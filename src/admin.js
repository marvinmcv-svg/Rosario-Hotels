import '@fontsource-variable/instrument-sans/index.css';
import '@fontsource-variable/bodoni-moda/opsz.css';
import './admin.css';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DATA = JSON.parse($('#adm-data').textContent);
const HOTEL = Object.fromEntries(DATA.hotels.map((h) => [h.id, h]));

/* ---------- Rosario mark ---------- */
const MARK = [['b', 'M1.5 17V1.5H12.5V12'], ['b', 'M28.5 12V1.5H39.5V17'], ['b', 'M1.5 18V33.5H12.5V23'], ['b', 'M28.5 23V33.5H39.5V18'], ['o', 'M7.5 5V15.5H18.5V0'], ['g', 'M23.5 0V15.5H34.5V5'], ['g', 'M7.5 30V19.5H18.5V35'], ['o', 'M23.5 35V19.5H34.5V30']];
$$('[data-mark]').forEach((svg) => { svg.innerHTML = MARK.map(([c, d]) => `<path class="${c}" d="${d}"/>`).join(''); });

/* ---------- i18n ---------- */
const I18N = {
  es: {
    loginSub: 'Portal de administración', password: 'Contraseña', signIn: 'Entrar', badPw: 'Contraseña incorrecta.', notConfigured: 'Falta configurar ADMIN_PASSWORD en Vercel.',
    bookings: 'Reservas', arrivals: 'Llegadas', refresh: 'Actualizar', newBooking: 'Nueva reserva', logout: 'Salir',
    search: 'Buscar: nombre, código, teléfono…', allHotels: 'Todos los hoteles', allChannels: 'Todos los canales', export: 'Exportar CSV',
    ref: 'Código', guest: 'Huésped', hotel: 'Hotel', dates: 'Fechas', guests: 'Pax', channel: 'Canal', status: 'Estado', received: 'Recibida',
    room: 'Habitación', checkIn: 'Llegada', checkOut: 'Salida', adults: 'Adultos', children: 'Niños', name: 'Nombre', phone: 'Teléfono / WhatsApp', email: 'Correo', country: 'País', notes: 'Notas', save: 'Guardar',
    all: 'Todas', s_pending: 'Pendiente', s_confirmed: 'Confirmada', s_checked_in: 'En el hotel', s_completed: 'Completada', s_cancelled: 'Cancelada',
    c_web: 'Web', c_whatsapp: 'WhatsApp', c_phone: 'Teléfono', c_walk_in: 'Presencial', c_email: 'Correo',
    stPending: 'Por responder', stArriving: 'Llegan en 7 días', stInHouse: 'En el hotel', stNights: 'Noches confirmadas este mes',
    empty: 'No hay reservas con estos filtros.', emptyAll: 'Todavía no hay reservas. Las solicitudes del sitio web y de WhatsApp aparecerán aquí.',
    noArrivals: 'Sin llegadas en los próximos 14 días.', today: 'Hoy', tomorrow: 'Mañana',
    anyRoom: 'Cualquier habitación', nights: 'noches', extras: 'Pedidos', price: 'Precio acordado', pricePh: 'p. ej. US$ 240', addNote: 'Agregar nota interna…', saveNote: 'Guardar nota',
    waGuest: 'WhatsApp al huésped', emailGuest: 'Correo al huésped', copy: 'Copiar código', copied: 'Copiado', saved: 'Guardado', created: 'Reserva creada', history: 'Historial', contact: 'Contacto', stay: 'Estadía',
    delete: 'Eliminar', confirmDelete: '¿Eliminar {ref} definitivamente? Úsalo solo para spam o pruebas.', deleted: 'Eliminada',
    errLoad: 'No se pudieron cargar las reservas.', errSave: 'No se pudo guardar.', error: 'Revisa los datos', session: 'Tu sesión expiró. Vuelve a entrar.',
  },
  en: {
    loginSub: 'Admin portal', password: 'Password', signIn: 'Sign in', badPw: 'Wrong password.', notConfigured: 'ADMIN_PASSWORD is not set in Vercel.',
    bookings: 'Bookings', arrivals: 'Arrivals', refresh: 'Refresh', newBooking: 'New booking', logout: 'Sign out',
    search: 'Search: name, reference, phone…', allHotels: 'All hotels', allChannels: 'All channels', export: 'Export CSV',
    ref: 'Ref', guest: 'Guest', hotel: 'Hotel', dates: 'Dates', guests: 'Pax', channel: 'Channel', status: 'Status', received: 'Received',
    room: 'Room', checkIn: 'Arrive', checkOut: 'Depart', adults: 'Adults', children: 'Children', name: 'Name', phone: 'Phone / WhatsApp', email: 'Email', country: 'Country', notes: 'Notes', save: 'Save',
    all: 'All', s_pending: 'Pending', s_confirmed: 'Confirmed', s_checked_in: 'In house', s_completed: 'Completed', s_cancelled: 'Cancelled',
    c_web: 'Web', c_whatsapp: 'WhatsApp', c_phone: 'Phone', c_walk_in: 'Walk-in', c_email: 'Email',
    stPending: 'Awaiting reply', stArriving: 'Arriving in 7 days', stInHouse: 'In house', stNights: 'Confirmed nights this month',
    empty: 'No bookings match these filters.', emptyAll: 'No bookings yet. Requests from the website and WhatsApp will appear here.',
    noArrivals: 'No arrivals in the next 14 days.', today: 'Today', tomorrow: 'Tomorrow',
    anyRoom: 'Any room', nights: 'nights', extras: 'Requests', price: 'Agreed price', pricePh: 'e.g. US$ 240', addNote: 'Add an internal note…', saveNote: 'Save note',
    waGuest: 'WhatsApp guest', emailGuest: 'Email guest', copy: 'Copy reference', copied: 'Copied', saved: 'Saved', created: 'Booking created', history: 'History', contact: 'Contact', stay: 'Stay',
    delete: 'Delete', confirmDelete: 'Delete {ref} permanently? Use only for spam or tests.', deleted: 'Deleted',
    errLoad: 'Couldn’t load bookings.', errSave: 'Couldn’t save.', error: 'Check the details', session: 'Your session expired. Please sign in again.',
  },
};
const EXTRA = { transfer: { es: 'Recojo aeropuerto/terminal', en: 'Airport/terminal pickup' }, early_checkin: { es: 'Check-in temprano', en: 'Early check-in' }, late_checkout: { es: 'Check-out tardío', en: 'Late check-out' }, celebration: { es: 'Celebración', en: 'Celebration' }, halfboard: { es: 'Media pensión', en: 'Half board' } };
const STATUSES = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'];
const CHANNELS = ['web', 'whatsapp', 'phone', 'walk_in', 'email'];
let lang = localStorage.getItem('adm-lang') || (navigator.language.startsWith('es') ? 'es' : 'en');
const tr = (k) => I18N[lang][k] ?? k;

function applyI18n() {
  document.documentElement.lang = lang;
  $$('[data-i]').forEach((el) => { el.textContent = tr(el.dataset.i); });
  $$('[data-i-ph]').forEach((el) => { el.placeholder = tr(el.dataset.iPh); });
  $('[data-lang-toggle]').textContent = lang === 'es' ? 'EN' : 'ES';
  const ch = $('[data-f="channel"]');
  ch.innerHTML = `<option value="">${tr('allChannels')}</option>` + CHANNELS.map((c) => `<option value="${c}">${tr('c_' + c)}</option>`).join('');
  ch.value = filters.channel;
  $('[name="status"]', $('[data-new-form]')).innerHTML = ['pending', 'confirmed'].map((s) => `<option value="${s}">${tr('s_' + s)}</option>`).join('');
  $('[name="channel"]', $('[data-new-form]')).innerHTML = ['phone', 'whatsapp', 'walk_in', 'email', 'web'].map((c) => `<option value="${c}">${tr('c_' + c)}</option>`).join('');
}

/* ---------- API ---------- */
async function api(path, opts = {}) {
  const res = await fetch(`/api/admin/${path}/`, { credentials: 'same-origin', ...opts, headers: { 'content-type': 'application/json', ...(opts.headers || {}) } });
  if (res.status === 401 && path !== 'session') { showLogin(tr('session')); throw new Error('unauthorized'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'error'), { status: res.status, data });
  return data;
}

/* ---------- state ---------- */
let bookings = [];
const filters = { q: '', status: '', hotel: '', channel: '' };
let view = 'bookings';

const todayIso = () => new Date().toLocaleDateString('en-CA');
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-CA'); };
const fmt = (iso, opts = { day: 'numeric', month: 'short' }) => iso ? new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString(lang === 'es' ? 'es-BO' : 'en-GB', opts) : '';
const fmtTime = (iso) => new Date(iso).toLocaleString(lang === 'es' ? 'es-BO' : 'en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const waDigits = (phone) => { let d = String(phone || '').replace(/\D/g, ''); if (d.length === 8 && /^[67]/.test(d)) d = '591' + d; return d; };

function toast(msg) {
  const el = $('[data-toast]');
  el.textContent = msg; el.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- auth ---------- */
function showLogin(msg = '') {
  $('[data-app]').hidden = true;
  $('[data-login]').hidden = false;
  $('[data-login-err]').textContent = msg;
  $('[name="password"]').focus();
}
function showApp() {
  $('[data-login]').hidden = true;
  $('[data-app]').hidden = false;
  load();
}
$('[data-login-form]').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('button', e.target); btn.disabled = true;
  try {
    await api('session', { method: 'POST', body: JSON.stringify({ password: e.target.password.value }) });
    e.target.reset();
    showApp();
  } catch (err) {
    $('[data-login-err]').textContent = err.message === 'not_configured' || err.data?.error === 'not_configured' ? tr('notConfigured') : tr('badPw');
  }
  btn.disabled = false;
});
$('[data-logout]').addEventListener('click', async () => { await api('session', { method: 'DELETE' }).catch(() => {}); bookings = []; showLogin(); });

/* ---------- load + render ---------- */
async function load() {
  try {
    const data = await api('bookings');
    bookings = data.bookings || [];
    render();
  } catch (e) { if (e.message !== 'unauthorized') toast(tr('errLoad')); }
}

function filtered() {
  const q = filters.q.toLowerCase();
  return bookings.filter((b) =>
    (!filters.status || b.status === filters.status) &&
    (!filters.hotel || b.hotel === filters.hotel) &&
    (!filters.channel || b.channel === filters.channel) &&
    (!q || [b.ref, b.guest?.name, b.guest?.phone, b.guest?.email, b.roomName].join(' ').toLowerCase().includes(q)));
}

function badge(status) { return `<span class="badge badge--${status}">${esc(tr('s_' + status))}</span>`; }

function renderStats() {
  const t = todayIso(), wk = addDays(t, 7), month = t.slice(0, 7);
  const live = bookings.filter((b) => b.status !== 'cancelled');
  const stats = [
    [tr('stPending'), bookings.filter((b) => b.status === 'pending').length, 'pending'],
    [tr('stArriving'), live.filter((b) => ['pending', 'confirmed'].includes(b.status) && b.checkIn >= t && b.checkIn <= wk).length],
    [tr('stInHouse'), bookings.filter((b) => b.status === 'checked_in').length],
    [tr('stNights'), live.filter((b) => ['confirmed', 'checked_in', 'completed'].includes(b.status) && b.checkIn.startsWith(month)).reduce((n, b) => n + (b.nights || 0), 0)],
  ];
  $('[data-stats]').innerHTML = stats.map(([label, n, s]) => `<button type="button" class="stat"${s ? ` data-stat="${s}"` : ''}><span>${esc(label)}</span><strong>${n}</strong></button>`).join('');
  $$('[data-stat]').forEach((b) => b.addEventListener('click', () => { filters.status = b.dataset.stat; renderSeg(); renderTable(); }));
}

function renderSeg() {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, bookings.filter((b) => b.status === s).length]));
  $('[data-f-status]').innerHTML = [['', tr('all'), bookings.length], ...STATUSES.map((s) => [s, tr('s_' + s), counts[s]])]
    .map(([v, l, n]) => `<button type="button" aria-pressed="${filters.status === v}" data-status="${v}">${esc(l)} <small>${n}</small></button>`).join('');
  $$('[data-status]').forEach((b) => b.addEventListener('click', () => { filters.status = b.dataset.status; renderSeg(); renderTable(); }));
}

function renderTable() {
  const rows = filtered();
  $('[data-rows]').innerHTML = rows.map((b) => `
    <tr data-ref="${esc(b.ref)}" tabindex="0">
      <td class="mono">${esc(b.ref)}</td>
      <td><strong>${esc(b.guest?.name)}</strong><small>${esc(b.guest?.phone || b.guest?.email || '')}</small></td>
      <td>${esc(HOTEL[b.hotel]?.name || b.hotel)}<small>${esc(b.roomName || tr('anyRoom'))}</small></td>
      <td class="num">${fmt(b.checkIn)} → ${fmt(b.checkOut)}<small>${b.nights} ${tr('nights')}</small></td>
      <td class="num">${b.adults}${b.children ? `+${b.children}` : ''}</td>
      <td>${esc(tr('c_' + b.channel))}</td>
      <td>${badge(b.status)}</td>
      <td class="num"><small>${fmtTime(b.createdAt)}</small></td>
    </tr>`).join('');
  const empty = $('[data-empty]');
  empty.hidden = rows.length > 0;
  empty.textContent = bookings.length ? tr('empty') : tr('emptyAll');
  $$('[data-rows] tr').forEach((tr_) => {
    tr_.addEventListener('click', () => openDrawer(tr_.dataset.ref));
    tr_.addEventListener('keydown', (e) => { if (e.key === 'Enter') openDrawer(tr_.dataset.ref); });
  });
}

function renderArrivals() {
  const t = todayIso();
  const days = Array.from({ length: 14 }, (_, i) => addDays(t, i));
  const list = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status));
  const html = days.map((d, i) => {
    const arr = list.filter((b) => b.checkIn === d);
    if (!arr.length) return '';
    const label = i === 0 ? tr('today') : i === 1 ? tr('tomorrow') : fmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
    return `<div class="arr-day"><h3>${esc(label)}</h3>${arr.map((b) => `
      <button type="button" class="arr" data-ref="${esc(b.ref)}">
        <span>${badge(b.status)}</span>
        <strong>${esc(b.guest?.name)}</strong>
        <span>${esc(HOTEL[b.hotel]?.name)} · ${esc(b.roomName || tr('anyRoom'))}</span>
        <span class="num">${b.nights} ${tr('nights')} · ${b.adults}${b.children ? `+${b.children}` : ''} pax</span>
      </button>`).join('')}</div>`;
  }).join('');
  $('[data-arrivals]').innerHTML = html || `<p class="adm-empty">${tr('noArrivals')}</p>`;
  $$('[data-arrivals] [data-ref]').forEach((b) => b.addEventListener('click', () => openDrawer(b.dataset.ref)));
}

function render() { renderStats(); renderSeg(); renderTable(); renderArrivals(); }

/* ---------- drawer ---------- */
function guestMessage(b) {
  const es = b.lang === 'es';
  const h = HOTEL[b.hotel]?.full || b.hotelName;
  const dates = `${fmt(b.checkIn, { day: 'numeric', month: 'long' })} → ${fmt(b.checkOut, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  const first = (b.guest?.name || '').split(' ')[0];
  if (b.status === 'confirmed') return es
    ? `¡Hola ${first}! Tu reserva *${b.ref}* en ${h} está *confirmada* ✨\n📅 ${dates} (${b.nights} noches)\n🛏️ ${b.roomName || 'Habitación por asignar'}${b.price ? `\n💳 Total: ${b.price}` : ''}\n\nTe esperamos. — Hoteles Rosario`
    : `Hi ${first}! Your booking *${b.ref}* at ${h} is *confirmed* ✨\n📅 ${dates} (${b.nights} nights)\n🛏️ ${b.roomName || 'Room to be assigned'}${b.price ? `\n💳 Total: ${b.price}` : ''}\n\nWe look forward to welcoming you. — Hoteles Rosario`;
  if (b.status === 'cancelled') return es
    ? `Hola ${first}, te escribimos sobre tu solicitud ${b.ref} en ${h}. Lamentablemente no podemos confirmarla para ${dates}. ¿Te ayudamos con otras fechas u otro hotel? — Hoteles Rosario`
    : `Hi ${first}, about your request ${b.ref} at ${h}: unfortunately we can’t confirm it for ${dates}. Could we help with other dates or another hotel? — Hoteles Rosario`;
  return es
    ? `¡Hola ${first}! Gracias por tu solicitud *${b.ref}* en ${h} para ${dates}. Te escribimos para confirmar disponibilidad y tarifa.`
    : `Hi ${first}! Thank you for your request *${b.ref}* at ${h} for ${dates}. We’re writing to confirm availability and rate.`;
}

function openDrawer(ref) {
  const b = bookings.find((x) => x.ref === ref);
  if (!b) return;
  const dlg = $('[data-drawer]');
  const wa = waDigits(b.guest?.phone);
  $('[data-drawer-body]', dlg).innerHTML = `
    <header class="dr-head">
      <div><p class="mono">${esc(b.ref)}</p><h2>${esc(b.guest?.name)}</h2>${badge(b.status)}</div>
      <button class="abtn abtn--ghost" data-close aria-label="Close">✕</button>
    </header>
    <div class="dr-status">${STATUSES.map((s) => `<button type="button" class="abtn${b.status === s ? ' is-on' : ''}" data-set-status="${s}">${esc(tr('s_' + s))}</button>`).join('')}</div>
    <div class="dr-actions">
      ${wa ? `<a class="abtn abtn--wa" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(guestMessage(b))}">${tr('waGuest')}</a>` : ''}
      ${b.guest?.email ? `<a class="abtn" href="mailto:${esc(b.guest.email)}?subject=${encodeURIComponent(`Hoteles Rosario · ${b.ref}`)}&body=${encodeURIComponent(guestMessage(b).replace(/\*/g, ''))}">${tr('emailGuest')}</a>` : ''}
      <button type="button" class="abtn" data-copy>${tr('copy')}</button>
      <button type="button" class="abtn abtn--danger" data-delete>${tr('delete')}</button>
    </div>
    <dl class="dr-list">
      <div><dt>${tr('hotel')}</dt><dd>${esc(HOTEL[b.hotel]?.full || b.hotelName)}</dd></div>
      <div><dt>${tr('room')}</dt><dd>${esc(b.roomName || tr('anyRoom'))}</dd></div>
      <div><dt>${tr('stay')}</dt><dd>${fmt(b.checkIn, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} → ${fmt(b.checkOut, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · ${b.nights} ${tr('nights')}</dd></div>
      <div><dt>${tr('guests')}</dt><dd>${b.adults} ${tr('adults').toLowerCase()}${b.children ? ` · ${b.children} ${tr('children').toLowerCase()}` : ''}</dd></div>
      <div><dt>${tr('contact')}</dt><dd>${esc(b.guest?.phone || '—')}${b.guest?.email ? `<br>${esc(b.guest.email)}` : ''}${b.guest?.country ? `<br>${esc(b.guest.country)}` : ''}</dd></div>
      <div><dt>${tr('channel')}</dt><dd>${esc(tr('c_' + b.channel))} · ${b.lang?.toUpperCase()}</dd></div>
      ${b.extras?.length ? `<div><dt>${tr('extras')}</dt><dd>${b.extras.map((x) => esc(EXTRA[x]?.[lang] || x)).join(', ')}</dd></div>` : ''}
      ${b.notes ? `<div><dt>${tr('notes')}</dt><dd class="pre">${esc(b.notes)}</dd></div>` : ''}
    </dl>
    <label class="dr-field"><span>${tr('price')}</span><input data-price value="${esc(b.price || '')}" placeholder="${esc(tr('pricePh'))}" /></label>
    <form class="dr-note" data-note-form>
      <textarea rows="2" placeholder="${esc(tr('addNote'))}" data-note></textarea>
      <button class="abtn abtn--solid" type="submit">${tr('saveNote')}</button>
    </form>
    <h3 class="dr-h">${tr('history')}</h3>
    <ol class="dr-log">${[...(b.log || [])].reverse().map((l) => `<li><time>${fmtTime(l.at)}</time><span>${esc(l.text)}</span><small>${esc(l.by)}</small></li>`).join('')}</ol>`;
  const body = $('[data-drawer-body]', dlg);
  $('[data-close]', body).addEventListener('click', () => dlg.close());
  $('[data-copy]', body).addEventListener('click', () => navigator.clipboard?.writeText(b.ref).then(() => toast(tr('copied'))));
  $('[data-delete]', body).addEventListener('click', async () => {
    if (!confirm(tr('confirmDelete').replace('{ref}', b.ref))) return;
    try {
      await api('bookings', { method: 'DELETE', body: JSON.stringify({ ref: b.ref }) });
      bookings = bookings.filter((x) => x.ref !== b.ref);
      dlg.close(); render(); toast(tr('deleted'));
    } catch (e) { if (e.message !== 'unauthorized') toast(tr('errSave')); }
  });
  $$('[data-set-status]', body).forEach((btn) => btn.addEventListener('click', () => update(b.ref, { status: btn.dataset.setStatus })));
  $('[data-price]', body).addEventListener('change', (e) => update(b.ref, { price: e.target.value }));
  $('[data-note-form]', body).addEventListener('submit', (e) => {
    e.preventDefault();
    const note = $('[data-note]', body).value.trim();
    if (note) update(b.ref, { note });
  });
  if (!dlg.open) dlg.showModal();
}
$('[data-drawer]').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

async function update(ref, patch) {
  try {
    const { booking } = await api('bookings', { method: 'PATCH', body: JSON.stringify({ ref, ...patch }) });
    bookings = bookings.map((x) => (x.ref === ref ? booking : x));
    render();
    openDrawer(ref);
    toast(tr('saved'));
  } catch (e) { if (e.message !== 'unauthorized') toast(tr('errSave')); }
}

/* ---------- new booking ---------- */
const modal = $('[data-modal]');
const newForm = $('[data-new-form]');
function fillRooms() {
  const h = HOTEL[newForm.hotel.value];
  newForm.room.innerHTML = `<option value="">${tr('anyRoom')}</option>` + (h?.rooms || []).map((r, i) => `<option value="${i}">${esc(r)}</option>`).join('');
}
newForm.hotel.addEventListener('change', fillRooms);
$('[data-new]').addEventListener('click', () => {
  newForm.reset(); fillRooms();
  newForm.checkIn.value = todayIso(); newForm.checkOut.value = addDays(todayIso(), 1);
  $('[data-new-err]').textContent = '';
  modal.showModal();
});
newForm.addEventListener('submit', async (e) => {
  if (e.submitter?.value !== 'save') return;
  e.preventDefault();
  const f = Object.fromEntries(new FormData(newForm));
  const body = { ...f, room: f.room === '' ? null : Number(f.room), adults: Number(f.adults), children: Number(f.children), lang };
  try {
    const { booking } = await api('bookings', { method: 'POST', body: JSON.stringify(body) });
    bookings.unshift(booking);
    modal.close();
    render();
    toast(`${tr('created')}: ${booking.ref}`);
  } catch (err) {
    if (err.message !== 'unauthorized') $('[data-new-err]').textContent = `${tr('error')}: ${err.message}`;
  }
});

/* ---------- filters, tabs, export ---------- */
$('[data-f="q"]').addEventListener('input', (e) => { filters.q = e.target.value; renderTable(); });
$('[data-f="hotel"]').addEventListener('change', (e) => { filters.hotel = e.target.value; renderTable(); });
$('[data-f="channel"]').addEventListener('change', (e) => { filters.channel = e.target.value; renderTable(); });
$$('[data-view]').forEach((b) => b.addEventListener('click', () => {
  view = b.dataset.view;
  $$('[data-view]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  $$('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== view; });
}));
$('[data-refresh]').addEventListener('click', load);
$('[data-lang-toggle]').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; localStorage.setItem('adm-lang', lang); applyI18n(); render(); });
$('[data-export]').addEventListener('click', () => {
  const cols = ['ref', 'status', 'hotel', 'roomName', 'checkIn', 'checkOut', 'nights', 'adults', 'children', 'name', 'phone', 'email', 'country', 'channel', 'lang', 'extras', 'price', 'notes', 'createdAt'];
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = filtered().map((b) => [b.ref, b.status, b.hotelName, b.roomName, b.checkIn, b.checkOut, b.nights, b.adults, b.children, b.guest?.name, b.guest?.phone, b.guest?.email, b.guest?.country, b.channel, b.lang, (b.extras || []).join('|'), b.price, b.notes, b.createdAt].map(cell).join(','));
  const blob = new Blob(['﻿' + [cols.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `rosario-bookings-${todayIso()}.csv` });
  a.click(); URL.revokeObjectURL(a.href);
});
setInterval(() => { if (!$('[data-app]').hidden && !document.hidden && !$('[data-drawer]').open && !modal.open) load(); }, 60000);

/* ---------- boot ---------- */
applyI18n();
api('session').then((s) => (s.authenticated ? showApp() : showLogin(s.configured ? '' : tr('notConfigured')))).catch(() => showLogin());
