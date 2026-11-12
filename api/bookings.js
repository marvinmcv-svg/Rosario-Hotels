// Public endpoint: a guest requests a booking (website or WhatsApp flow).
import { validateBooking, createBooking, listBookings, notifyStaff, json } from './_lib/bookings.js';
import { getSettings, quote } from './_lib/inventory.js';

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
    const [settings, bookings] = await Promise.all([getSettings(), listBookings()]);
    if (booking.room !== null) {
      const q = quote(settings, bookings, { hotel: booking.hotel, checkIn: booking.checkIn, checkOut: booking.checkOut, guests: booking.adults + booking.children })[booking.room];
      if (!q?.fits) return json({ error: 'capacity' }, 409);
      if (!q.left) return json({ error: 'sold_out' }, 409);
      booking.quote = { rate: q.rate, total: q.total, currency: settings.currency, sample: settings.sample };
    }
    const saved = await createBooking(booking);
    await notifyStaff(saved);
    return json({ ok: true, ref: saved.ref, quote: saved.quote || null }, 201);
  } catch (err) {
    console.error('booking save failed', err?.message ?? err);
    return json({ error: 'storage' }, 503);
  }
}
