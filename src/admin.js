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

    username: 'Usuario', calendar: 'Calendario', settings: 'Ajustes', free: 'Libre', partly: 'Parcial', full: 'Lleno', unassigned: 'Sin habitación asignada',
    ratesTitle: 'Tarifas e inventario', ratesSub: 'Habitaciones disponibles, tarifa por noche (USD) y máximo de huéspedes por tipo.', saveRates: 'Guardar tarifas',
    units: 'Unidades', rate: 'Tarifa/noche', maxGuests: 'Máx. huéspedes', notifyTitle: 'Notificaciones por correo', staffEmails: 'Correos del personal (separados por coma)',
    guestEmails: 'Enviar confirmación al huésped cuando la reserva se confirma', testEmail: 'Enviar prueba', usersTitle: 'Usuarios',
    usersSub: 'Cuentas del personal. Los propietarios gestionan tarifas y usuarios; el personal gestiona reservas.', addUser: 'Agregar', myPassword: 'Mi contraseña', changePw: 'Cambiar',
    fullName: 'Nombre', newPw: 'nueva contraseña (8+)', remove: 'Quitar', resetPw: 'Nueva contraseña', notifyStaff: 'Avisar al personal por correo',
    emailOn: 'Correo activo (Resend). Remitente: {from}', emailOff: 'El envío de correos no está activo: agrega RESEND_API_KEY en Vercel → Settings → Environment Variables y vuelve a desplegar.',
    sampleBanner: 'Estás usando tarifas e inventario de ejemplo. Ingresa los reales en Ajustes → Tarifas e inventario.',
    emailBanner: 'Las notificaciones por correo aún no están activas (falta RESEND_API_KEY).',
    soldOutForce: 'Esa habitación no tiene disponibilidad para esas fechas. ¿Guardar de todas formas (sobreventa)?',
    estimate: 'Estimado', sent: 'Enviado', userAdded: 'Usuario agregado', pwChanged: 'Contraseña actualizada', confirmRemoveUser: '¿Quitar al usuario {u}?',
    occupancy: 'Ocupación', errUser: 'Revisa usuario (3–32: a-z 0-9 . _ -) y contraseña (8+).',
    loginSub: 'Portal de administración', password: 'Contraseña', signIn: 'Entrar', badPw: 'Usuario o contraseña incorrectos.', notConfigured: 'Falta configurar ADMIN_PASSWORD en Vercel.',
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

    username: 'Username', calendar: 'Calendar', settings: 'Settings', free: 'Free', partly: 'Partly booked', full: 'Full', unassigned: 'No room assigned',
    ratesTitle: 'Rates & inventory', ratesSub: 'Rooms available, nightly rate (USD) and maximum guests per room type.', saveRates: 'Save rates',
    units: 'Units', rate: 'Rate/night', maxGuests: 'Max guests', notifyTitle: 'Email notifications', staffEmails: 'Staff emails (comma separated)',
    guestEmails: 'Email the guest when their booking is confirmed', testEmail: 'Send test', usersTitle: 'Users',
    usersSub: 'Staff accounts. Owners manage rates and users; staff manage bookings.', addUser: 'Add', myPassword: 'My password', changePw: 'Change',
    fullName: 'Name', newPw: 'new password (8+)', remove: 'Remove', resetPw: 'New password', notifyStaff: 'Notify staff by email',
    emailOn: 'Email is on (Resend). Sender: {from}', emailOff: 'Email sending is off: add RESEND_API_KEY in Vercel → Settings → Environment Variables, then redeploy.',
    sampleBanner: 'You are using sample rates and room counts. Enter the real ones in Settings → Rates & inventory.',
    emailBanner: 'Email notifications are not active yet (RESEND_API_KEY missing).',
    soldOutForce: 'That room has no availability for those dates. Save anyway (overbook)?',
    estimate: 'Estimate', sent: 'Sent', userAdded: 'User added', pwChanged: 'Password updated', confirmRemoveUser: 'Remove user {u}?',
    occupancy: 'Occupancy', errUser: 'Check the username (3–32: a-z 0-9 . _ -) and password (8+).',
    loginSub: 'Admin portal', password: 'Password', signIn: 'Sign in', badPw: 'Wrong username or password.', notConfigured: 'ADMIN_PASSWORD is not set in Vercel.',
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
let settings = null;
let emailInfo = { configured: false, from: '' };
let me = null;
const isOwner = () => me?.role === 'owner';
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
  $('[name="username"]').focus();
}
function showApp() {
  $('[data-login]').hidden = true;
  $('[data-app]').hidden = false;
  $('[data-whoami]').textContent = me ? `${me.name || me.username} · ${me.role}` : '';
  $$('[data-owner-only]').forEach((el) => { el.hidden = !isOwner(); });
  load();
}
$('[data-login-form]').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('button', e.target); btn.disabled = true;
  try {
    const s = await api('session', { method: 'POST', body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value }) });
    e.target.reset();
    me = s.user;
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
    const [data, st] = await Promise.all([api('bookings'), api('settings')]);
    bookings = data.bookings || [];
    settings = st.settings; emailInfo = st.email;
    render();
    renderSettings();
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

function render() { renderBanner(); renderStats(); renderSeg(); renderTable(); renderArrivals(); renderCalendar(); }

function renderBanner() {
  const msgs = [];
  if (settings?.sample) msgs.push(tr('sampleBanner'));
  if (!emailInfo.configured) msgs.push(tr('emailBanner'));
  const el = $('[data-banner]');
  el.hidden = !msgs.length;
  el.textContent = msgs.join(' ');
}

/* ---------- calendar ---------- */
const calHotel = $('[data-cal-hotel]'), calFrom = $('[data-cal-from]');
calFrom.value = new Date().toLocaleDateString('en-CA');
function renderCalendar() {
  if (!settings) return;
  const hotel = calHotel.value, days = 21;
  const dates = Array.from({ length: days }, (_, i) => addDays(calFrom.value, i));
  const rooms = settings.rooms[hotel] || [];
  const holding = bookings.filter((b) => b.hotel === hotel && ['pending', 'confirmed', 'checked_in'].includes(b.status));
  const cell = (r, i, d) => {
    const bs = holding.filter((b) => b.room === i && b.checkIn <= d && b.checkOut > d);
    const lvl = !bs.length ? 0 : bs.length >= r.units ? 2 : 1;
    return `<td class="cal c${lvl}" title="${esc(bs.map((b) => `${b.ref} ${b.guest?.name}`).join('\n'))}"${bs[0] ? ` data-ref="${esc(bs[0].ref)}"` : ''}>${bs.length}/${r.units}</td>`;
  };
  const unassigned = dates.map((d) => holding.filter((b) => (b.room === null || b.room === undefined) && b.checkIn <= d && b.checkOut > d).length);
  $('[data-cal]').innerHTML = `<table class="adm-table adm-cal"><thead><tr><th>${tr('room')}</th>${dates.map((d) => `<th class="num${d === todayIso() ? ' is-today' : ''}">${fmt(d, { weekday: 'narrow' })}<br>${d.slice(8)}</th>`).join('')}</tr></thead>
    <tbody>${rooms.map((r, i) => `<tr><td>${esc(r.name)}</td>${dates.map((d) => cell(r, i, d)).join('')}</tr>`).join('')}
    ${unassigned.some(Boolean) ? `<tr><td><em>${tr('unassigned')}</em></td>${unassigned.map((n) => `<td class="cal ${n ? 'c1' : 'c0'}">${n || ''}</td>`).join('')}</tr>` : ''}</tbody></table>`;
  $$('[data-cal] [data-ref]').forEach((td) => td.addEventListener('click', () => openDrawer(td.dataset.ref)));
}
calHotel.addEventListener('change', renderCalendar);
calFrom.addEventListener('change', renderCalendar);
$('[data-cal-prev]').addEventListener('click', () => { calFrom.value = addDays(calFrom.value, -7); renderCalendar(); });
$('[data-cal-next]').addEventListener('click', () => { calFrom.value = addDays(calFrom.value, 7); renderCalendar(); });

/* ---------- settings ---------- */
async function renderSettings() {
  if (!settings) return;
  $('[data-email-status]').textContent = emailInfo.configured ? tr('emailOn').replace('{from}', emailInfo.from) : tr('emailOff');
  $('[data-email-status]').className = emailInfo.configured ? 'ok' : 'warn';
  if (!isOwner()) return;
  $('[data-rates]').innerHTML = Object.entries(settings.rooms).map(([id, rooms]) => `
    <h3 class="adm-h3">${esc(HOTEL[id]?.name || id)}</h3>
    <table class="adm-table adm-rates"><thead><tr><th>${tr('room')}</th><th>${tr('units')}</th><th>${tr('rate')}</th><th>${tr('maxGuests')}</th></tr></thead><tbody>
    ${rooms.map((r, i) => `<tr><td>${esc(r.name)}</td>
      <td><input type="number" min="0" max="200" value="${r.units}" data-rate="${id}.${i}.units" /></td>
      <td><input type="number" min="0" step="1" value="${r.rate}" data-rate="${id}.${i}.rate" /></td>
      <td><input type="number" min="1" max="12" value="${r.maxGuests}" data-rate="${id}.${i}.maxGuests" /></td></tr>`).join('')}
    </tbody></table>`).join('');
  $('[data-staff-emails]').value = (settings.notify.staffEmails || []).join(', ');
  $('[data-guest-emails]').checked = settings.notify.guestEmails !== false;
  try {
    const { users } = await api('users');
    $('[data-users]').innerHTML = `<table class="adm-table"><tbody>${users.map((u) => `<tr><td><strong>${esc(u.username)}</strong><small>${esc(u.name || '')}</small></td><td>${esc(u.role)}</td>
      <td class="adm-row-actions"><button class="abtn" data-reset-user="${esc(u.username)}">${tr('resetPw')}</button>${u.username !== me.username && u.username !== 'admin' ? `<button class="abtn abtn--danger" data-remove-user="${esc(u.username)}">${tr('remove')}</button>` : ''}</td></tr>`).join('')}</tbody></table>`;
    $$('[data-reset-user]').forEach((b) => b.addEventListener('click', async () => {
      const pw = prompt(`${tr('resetPw')} — ${b.dataset.resetUser} (8+)`);
      if (!pw) return;
      try { await api('users', { method: 'PATCH', body: JSON.stringify({ username: b.dataset.resetUser, password: pw }) }); toast(tr('pwChanged')); } catch { toast(tr('errUser')); }
    }));
    $$('[data-remove-user]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(tr('confirmRemoveUser').replace('{u}', b.dataset.removeUser))) return;
      try { await api('users', { method: 'DELETE', body: JSON.stringify({ username: b.dataset.removeUser }) }); renderSettings(); } catch { toast(tr('errSave')); }
    }));
  } catch { /* ignore */ }
}
$('[data-save-rates]').addEventListener('click', async () => {
  const rooms = structuredClone(settings.rooms);
  $$('[data-rate]').forEach((inp) => { const [id, i, k] = inp.dataset.rate.split('.'); rooms[id][i][k] = Number(inp.value); });
  try { ({ settings } = await api('settings', { method: 'PUT', body: JSON.stringify({ rooms }) })); toast(tr('saved')); render(); renderSettings(); } catch { toast(tr('errSave')); }
});
$('[data-save-notify]').addEventListener('click', async () => {
  const notify = { staffEmails: $('[data-staff-emails]').value, guestEmails: $('[data-guest-emails]').checked };
  try { ({ settings } = await api('settings', { method: 'PUT', body: JSON.stringify({ notify }) })); toast(tr('saved')); renderSettings(); } catch { toast(tr('errSave')); }
});
$('[data-test-email]').addEventListener('click', async () => {
  try { await api('settings', { method: 'POST', body: '{}' }); toast(tr('sent')); } catch (e) { toast(`${tr('errSave')} ${e.data?.error || ''}`); }
});
$('[data-add-user]').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  try { await api('users', { method: 'POST', body: JSON.stringify(f) }); e.target.reset(); toast(tr('userAdded')); renderSettings(); } catch { toast(tr('errUser')); }
});
$('[data-my-pw]').addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await api('users', { method: 'PATCH', body: JSON.stringify({ password: e.target.password.value }) }); e.target.reset(); toast(tr('pwChanged')); } catch { toast(tr('errUser')); }
});

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
      ${isOwner() ? `<button type="button" class="abtn abtn--danger" data-delete>${tr('delete')}</button>` : ''}
    </div>
    <dl class="dr-list">
      <div><dt>${tr('hotel')}</dt><dd>${esc(HOTEL[b.hotel]?.full || b.hotelName)}</dd></div>
      <div><dt>${tr('room')}</dt><dd><select data-room-select><option value="">${tr('unassigned')}</option>${(HOTEL[b.hotel]?.rooms || []).map((r, i) => `<option value="${i}"${b.room === i ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select></dd></div>
      ${b.quote ? `<div><dt>${tr('estimate')}</dt><dd class="num">US$ ${b.quote.total} · US$ ${b.quote.rate} × ${b.nights}${b.quote.sample ? ' (sample rate)' : ''}</dd></div>` : ''}
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
  $('[data-room-select]', body).addEventListener('change', (e) => update(b.ref, { room: e.target.value === '' ? null : Number(e.target.value) }));
  $('[data-delete]', body)?.addEventListener('click', async () => {
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
    let res;
    try {
      res = await api('bookings', { method: 'PATCH', body: JSON.stringify({ ref, ...patch }) });
    } catch (e) {
      if (e.status !== 409 || !confirm(tr('soldOutForce'))) { if (e.status === 409) openDrawer(ref); throw e; }
      res = await api('bookings', { method: 'PATCH', body: JSON.stringify({ ref, ...patch, force: true }) });
    }
    const { booking } = res;
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
  const body = { ...f, room: f.room === '' ? null : Number(f.room), adults: Number(f.adults), children: Number(f.children), lang, notify: f.notify === '1' };
  try {
    let res;
    try { res = await api('bookings', { method: 'POST', body: JSON.stringify(body) }); } catch (e2) {
      if (e2.status !== 409 || !confirm(tr('soldOutForce'))) throw e2;
      res = await api('bookings', { method: 'POST', body: JSON.stringify({ ...body, force: true }) });
    }
    const { booking } = res;
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
$('[data-lang-toggle]').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; localStorage.setItem('adm-lang', lang); applyI18n(); render(); renderSettings(); });
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
api('session').then((s) => { me = s.user; return s.authenticated ? showApp() : showLogin(s.configured ? '' : tr('notConfigured')); }).catch(() => showLogin());
