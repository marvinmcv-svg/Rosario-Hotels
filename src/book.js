// Booking wizard: 4 steps, live WhatsApp preview, saves the request and/or opens WhatsApp.
import gsap from 'gsap';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initBooking() {
  const root = $('[data-booking]');
  if (!root) return;
  const D = JSON.parse($('#bk-data').textContent);
  const t = D.t;
  const es = D.lang === 'es';
  const nightsTxt = (n) => (es ? `${n} noche${n === 1 ? '' : 's'}` : `${n} night${n === 1 ? '' : 's'}`);
  const guestsTxt = (a, c) => es
    ? `${a} adulto${a === 1 ? '' : 's'}${c ? `, ${c} niño${c === 1 ? '' : 's'}` : ''}`
    : `${a} adult${a === 1 ? '' : 's'}${c ? `, ${c} child${c === 1 ? '' : 'ren'}` : ''}`;
  const fmtDate = (iso) => iso ? new Date(iso + 'T12:00:00').toLocaleDateString(es ? 'es-BO' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const form = $('[data-bk-form]', root);
  const steps = $$('[data-step]', form);
  const tabs = $$('[data-step-tab]', form);
  const err = $('[data-bk-error]', form);
  const next = $('[data-bk-next]', form), back = $('[data-bk-back]', form), navBar = $('[data-bk-nav]', form);
  const msgEl = $('[data-phone-msg]', root);
  const chat = $('[data-phone-chat]', root);
  let step = 0;
  let sending = false;

  $$('[data-now]', root).forEach((el) => { el.textContent = new Date().toLocaleTimeString(es ? 'es-BO' : 'en-GB', { hour: '2-digit', minute: '2-digit' }); });

  // dates: tomorrow → +2
  const iso = (d) => d.toISOString().slice(0, 10);
  const day = (n) => { const d = new Date(); d.setHours(12); d.setDate(d.getDate() + n); return d; };
  form.checkIn.min = iso(day(0)); form.checkIn.value = iso(day(1));
  form.checkOut.min = iso(day(1)); form.checkOut.value = iso(day(3));
  form.checkIn.addEventListener('change', () => {
    const d = new Date(form.checkIn.value + 'T12:00'); d.setDate(d.getDate() + 1);
    form.checkOut.min = iso(d);
    if (form.checkOut.value <= form.checkIn.value) form.checkOut.value = iso(d);
  });

  const hotel = () => D.hotels.find((h) => h.id === form.hotel.value);

  function renderRooms(selected = -1) {
    const h = hotel();
    const roomsBox = $('[data-bk-rooms]', form), exBox = $('[data-bk-extras]', form);
    if (!h) { roomsBox.innerHTML = ''; exBox.innerHTML = ''; return; }
    roomsBox.innerHTML = `
      <label class="bk__room bk__room--any"><input type="radio" name="room" value="-1"${selected < 0 ? ' checked' : ''} /><span>${esc(t.anyRoom)}</span></label>
      ${h.rooms.map((r, i) => `
      <label class="bk__room"><input type="radio" name="room" value="${i}"${i === selected ? ' checked' : ''} />
        <img src="/media/img/${r.img}-sm.webp" alt="" loading="lazy" />
        <span><strong>${esc(r.name)}</strong>${r.view ? `<small>${esc(r.view)}</small>` : ''}</span>
      </label>`).join('')}`;
    exBox.innerHTML = h.extras.map((x) => `<label class="chipbox"><input type="checkbox" name="extras" value="${x}" /><span>${esc(t.extra[x])}</span></label>`).join('');
  }

  function values() {
    const h = hotel();
    const room = form.room ? Number(form.room.value) : -1;
    return {
      hotel: form.hotel.value,
      hotelName: h?.name || '',
      room: Number.isInteger(room) && room >= 0 ? room : null,
      roomName: h && room >= 0 ? h.rooms[room]?.name : '',
      checkIn: form.checkIn.value, checkOut: form.checkOut.value,
      adults: Number(form.adults.value) || 1, children: Number(form.children.value) || 0,
      extras: $$('input[name="extras"]:checked', form).map((x) => x.value),
      notes: form.notes.value.trim(),
      name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(), country: form.country.value.trim(),
      website: form.website.value,
      lang: D.lang,
    };
  }
  const nights = (v) => (v.checkIn && v.checkOut && v.checkOut > v.checkIn ? Math.round((new Date(v.checkOut) - new Date(v.checkIn)) / 864e5) : 0);

  // WhatsApp message text (uses *bold* WhatsApp markup)
  function message(v, ref) {
    const m = t.msg;
    const lines = [m.hello, ''];
    if (v.hotelName) lines.push(`🏨 *${m.hotel}:* ${v.hotelName}`);
    if (nights(v)) lines.push(`📅 *${m.dates}:* ${fmtDate(v.checkIn)} → ${fmtDate(v.checkOut)} (${nightsTxt(nights(v))})`);
    if (v.hotelName) lines.push(`🛏️ *${m.room}:* ${v.roomName || t.anyRoom}`);
    if (v.hotelName) lines.push(`👥 *${m.guests}:* ${guestsTxt(v.adults, v.children)}`);
    if (v.extras.length) lines.push(`✨ *${m.extras}:* ${v.extras.map((x) => t.extra[x]).join(', ')}`);
    if (v.notes) lines.push(`📝 *${m.notes}:* ${v.notes}`);
    if (v.name) lines.push(`🙋 *${m.name}:* ${v.name}${v.country ? ` (${v.country})` : ''}`);
    if (ref) lines.push(`🔖 *${m.ref}:* ${ref}`);
    lines.push('', m.thanks);
    return lines.join('\n');
  }

  function preview() {
    const v = values();
    if (!v.hotel) { msgEl.innerHTML = `<p class="wa__hint">${esc(t.typing)}</p><time>${$('time', msgEl)?.textContent || ''}</time>`; return; }
    const html = esc(message(v)).replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    const time = $('time', msgEl)?.textContent || '';
    msgEl.innerHTML = `<p>${html}</p><time>${time} <span class="wa__ticks">✓✓</span></time>`;
    chat.scrollTop = chat.scrollHeight;
  }

  function validate(s) {
    const v = values();
    if (s === 0 && !v.hotel) return t.err.hotel;
    if (s === 1 && (!nights(v) || v.checkIn < iso(day(0)))) return t.err.dates;
    if (s === 2) {
      if (v.name.length < 2) return t.err.name;
      if (v.phone.replace(/\D/g, '').length < 7) return t.err.phone;
      if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return t.err.email;
    }
    return '';
  }

  function summary() {
    const v = values();
    const rows = [
      [t.msg.hotel, v.hotelName], [t.msg.dates, `${fmtDate(v.checkIn)} → ${fmtDate(v.checkOut)} · ${nightsTxt(nights(v))}`],
      [t.msg.room, v.roomName || t.anyRoom], [t.msg.guests, guestsTxt(v.adults, v.children)],
      ...(v.extras.length ? [[t.msg.extras, v.extras.map((x) => t.extra[x]).join(', ')]] : []),
      [t.msg.name, `${v.name} · ${v.phone}${v.email ? ` · ${v.email}` : ''}`],
    ];
    $('[data-bk-summary]', form).innerHTML = rows.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('');
  }

  function go(n) {
    err.textContent = '';
    step = n;
    steps.forEach((el, i) => { el.hidden = i !== n; });
    tabs.forEach((el, i) => { el.toggleAttribute('aria-current', i === n); el.classList.toggle('is-done', i < n); });
    if (n === 3) { summary(); }
    back.hidden = n === 0;
    next.hidden = n === 3;
    if (!reduced) gsap.from(steps[n], { y: 24, opacity: 0, duration: 0.6, ease: 'expo.out' });
    const first = $('input:not([type=hidden]), button', steps[n]);
    if (n > 0 && first) first.focus({ preventScroll: true });
  }

  next.addEventListener('click', () => {
    const e = validate(step);
    if (e) { err.textContent = e; return; }
    go(step + 1);
  });
  back.addEventListener('click', () => go(step - 1));
  tabs.forEach((tab, i) => tab.addEventListener('click', () => {
    if (i < step) return go(i);
    for (let s = step; s < i; s++) { const e = validate(s); if (e) { err.textContent = e; return go(s); } }
    go(i);
  }));
  form.addEventListener('change', (e) => {
    if (e.target.name === 'hotel') { renderRooms(); if (step === 0) setTimeout(() => go(1), 250); }
    preview();
  });
  form.addEventListener('input', preview);
  form.addEventListener('submit', (e) => e.preventDefault());

  async function send(channel) {
    if (sending) return;
    for (let s = 0; s < 3; s++) { const e = validate(s); if (e) { err.textContent = e; return go(s); } }
    sending = true;
    err.textContent = '';
    const v = values();
    const number = D.wa[v.hotel] || D.wa.default;
    // open the WhatsApp tab during the click so pop-up blockers allow it
    const win = channel === 'whatsapp' ? window.open('', '_blank') : null;
    let ref = '';
    try {
      const res = await fetch('/api/bookings/', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...v, channel }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'generic');
      ref = data.ref;
    } catch (ex) {
      if (channel === 'web') {
        err.textContent = t.err[ex.message] || t.err.storage;
        sending = false;
        return;
      }
    }
    const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(message(v, ref))}`;
    if (channel === 'whatsapp') {
      if (win) win.location.href = waUrl; else location.href = waUrl;
    }
    done(ref, channel === 'whatsapp' ? waUrl : '');
    sending = false;
  }
  $$('[data-bk-send]', form).forEach((b) => b.addEventListener('click', () => send(b.dataset.bkSend)));

  function done(ref, waUrl) {
    steps.forEach((el) => { el.hidden = true; });
    navBar.hidden = true;
    $('.bk__steps', form).hidden = true;
    const box = $('[data-bk-done]', form);
    box.hidden = false;
    $('[data-bk-done-text]', box).innerHTML = ref
      ? (es ? `Tu código es <strong>${esc(ref)}</strong>. Nuestro equipo confirmará disponibilidad y precio contigo en breve, normalmente en pocas horas.` : `Your reference is <strong>${esc(ref)}</strong>. Our team will confirm availability and price with you shortly, usually within a few hours.`)
      : (es ? 'Tu mensaje está listo en WhatsApp. Nuestro equipo te responderá en breve.' : 'Your message is ready in WhatsApp. Our team will reply shortly.');
    const again = $('[data-bk-wa-again]', box);
    again.hidden = !waUrl; if (waUrl) again.href = waUrl;
    box.focus();
    if (!reduced) gsap.from(box.children, { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out' });
    // show the sent message as delivered in the phone
    msgEl.classList.add('is-sent');
  }

  $('[data-bk-reset]', form).addEventListener('click', () => {
    form.reset();
    form.checkIn.value = iso(day(1)); form.checkOut.value = iso(day(3));
    renderRooms();
    $('[data-bk-done]', form).hidden = true;
    navBar.hidden = false;
    $('.bk__steps', form).hidden = false;
    msgEl.classList.remove('is-sent');
    preview();
    go(0);
  });

  // deep links: /book/?hotel=uyuni&room=1
  const q = new URLSearchParams(location.search);
  const qh = D.hotels.find((h) => h.id === q.get('hotel'));
  if (qh) {
    form.querySelector(`input[name="hotel"][value="${qh.id}"]`).checked = true;
    const r = Number.parseInt(q.get('room'), 10);
    renderRooms(Number.isInteger(r) && qh.rooms[r] ? r : -1);
    go(1);
  } else {
    go(0);
  }
  preview();
}
