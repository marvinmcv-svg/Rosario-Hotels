// Public endpoint: a guest requests a booking (website or WhatsApp flow).
import { validateBooking, createBooking, json } from './_lib/bookings.js';

export async function POST(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ error: 'type' }, 415);
  const text = await request.text();
  if (text.length > 8000) return json({ error: 'size' }, 413);
  let body;
  try { body = JSON.parse(text); } catch { return json({ error: 'json' }, 400); }
  if (body.website) return json({ ok: true, ref: 'RH-000000' }); // honeypot: bots fill hidden fields

  const { booking, error } = validateBooking(body);
  if (error) return json({ error }, 422);
  try {
    const saved = await createBooking(booking);
    return json({ ok: true, ref: saved.ref }, 201);
  } catch (err) {
    console.error('booking save failed', err?.message ?? err);
    return json({ error: 'storage' }, 503);
  }
}
