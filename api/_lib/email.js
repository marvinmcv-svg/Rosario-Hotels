// Transactional email through Resend (https://resend.com) — set RESEND_API_KEY in Vercel.
// Without a domain verified in Resend, the default sender can only deliver to the
// email address that owns the Resend account.
const SITE = 'https://rosario-hotels.vercel.app';
const FROM = () => process.env.NOTIFY_FROM || 'Hoteles Rosario <onboarding@resend.dev>';
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (iso, lang) => new Date(iso + 'T12:00:00Z').toLocaleDateString(lang === 'es' ? 'es-BO' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Sends one email. Returns { ok, id?, error? } and never throws. */
export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!emailConfigured()) return { ok: false, error: 'not_configured' };
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return { ok: false, error: 'no_recipients' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: FROM(), to: recipients, subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.message || `http_${res.status}` };
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err?.message || 'network' };
  }
}

function layout(title, rows, footer) {
  return `<!doctype html><html><body style="margin:0;background:#f2eee6;font-family:Helvetica,Arial,sans-serif;color:#16181c">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fbf9f5;border-radius:12px;overflow:hidden">
    <tr><td style="background:#0e1116;color:#f2eee6;padding:20px 28px;font-family:Georgia,serif;font-size:20px;letter-spacing:.04em">HOTELES <span style="color:#e0a35a">ROSARIO</span></td></tr>
    <tr><td style="padding:28px"><h1 style="font-family:Georgia,serif;font-weight:400;font-size:26px;margin:0 0 18px">${title}</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 0;border-top:1px solid #e4dfd5;color:#6b6a65;width:140px;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #e4dfd5">${v}</td></tr>`).join('')}
      </table>${footer || ''}</td></tr>
  </table></td></tr></table></body></html>`;
}

const money = (n, cur = 'USD') => (n || n === 0 ? `${cur === 'USD' ? 'US$' : cur} ${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '—');

/** Email to staff about a new booking request. */
export function staffNewBooking(b) {
  const wa = String(b.guest?.phone || '').replace(/\D/g, '');
  const rows = [
    ['Reference', `<strong>${esc(b.ref)}</strong>`],
    ['Hotel', esc(b.hotelName)],
    ['Room', esc(b.roomName || 'Any room — to assign')],
    ['Dates', `${fmt(b.checkIn, 'en')} → ${fmt(b.checkOut, 'en')} · ${b.nights} night(s)`],
    ['Guests', `${b.adults} adult(s)${b.children ? `, ${b.children} child(ren)` : ''}`],
    ['Estimate', b.quote ? `${money(b.quote.total)} (${money(b.quote.rate)}/night)` : '—'],
    ['Guest', `${esc(b.guest?.name)}<br>${esc(b.guest?.phone)}${b.guest?.email ? `<br>${esc(b.guest.email)}` : ''}${b.guest?.country ? `<br>${esc(b.guest.country)}` : ''}`],
    ['Channel', `${esc(b.channel)} · ${esc(String(b.lang).toUpperCase())}`],
    ...(b.extras?.length ? [['Requests', esc(b.extras.join(', '))]] : []),
    ...(b.notes ? [['Notes', esc(b.notes).replace(/\n/g, '<br>')]] : []),
  ];
  const footer = `<p style="margin:24px 0 0"><a href="${SITE}/admin/" style="background:#c9781f;color:#17110a;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Open in admin</a>
    ${wa ? `&nbsp; <a href="https://wa.me/${wa}" style="color:#1f9d55;font-weight:bold">WhatsApp guest</a>` : ''}</p>`;
  return {
    subject: `New booking request ${b.ref} · ${b.hotelName.replace('Hotel ', '')} · ${b.checkIn}`,
    html: layout('New booking request', rows, footer),
    text: rows.map(([k, v]) => `${k}: ${String(v).replace(/<br>/g, ', ').replace(/<[^>]+>/g, '')}`).join('\n') + `\n\nAdmin: ${SITE}/admin/`,
  };
}

/** Email to the guest when staff confirm the booking. */
export function guestConfirmation(b) {
  const es = b.lang === 'es';
  const rows = [
    [es ? 'Código' : 'Reference', `<strong>${esc(b.ref)}</strong>`],
    ['Hotel', esc(b.hotelName)],
    [es ? 'Habitación' : 'Room', esc(b.roomName || (es ? 'Por asignar' : 'To be assigned'))],
    [es ? 'Fechas' : 'Dates', `${fmt(b.checkIn, b.lang)} → ${fmt(b.checkOut, b.lang)} · ${b.nights} ${es ? 'noche(s)' : 'night(s)'}`],
    [es ? 'Huéspedes' : 'Guests', `${b.adults}${b.children ? ` + ${b.children}` : ''}`],
    ...(b.price || b.quote ? [[es ? 'Total' : 'Total', esc(b.price || money(b.quote.total))]] : []),
  ];
  const footer = `<p style="margin:24px 0 0;font-size:14px;color:#6b6a65">${es ? '¿Preguntas? Responde a este correo o escríbenos por WhatsApp al' : 'Questions? Reply to this email or message us on WhatsApp at'} <a href="https://wa.me/59176254988" style="color:#1f9d55">+591 7625 4988</a>.</p>`;
  return {
    subject: es ? `Reserva confirmada ${b.ref} · Hoteles Rosario` : `Booking confirmed ${b.ref} · Hoteles Rosario`,
    html: layout(es ? `¡Te esperamos, ${esc(b.guest?.name?.split(' ')[0])}!` : `We look forward to welcoming you, ${esc(b.guest?.name?.split(' ')[0])}!`, rows, footer),
    text: rows.map(([k, v]) => `${k}: ${String(v).replace(/<[^>]+>/g, '')}`).join('\n'),
  };
}
