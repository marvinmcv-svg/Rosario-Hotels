// Public: live availability and price quote for one hotel and date range.
import { getSettings, quote } from './_lib/inventory.js';
import { listBookings, validDates, json } from './_lib/bookings.js';
import { HOTELS } from '../site/content.js';

export async function GET(request) {
  const q = new URL(request.url).searchParams;
  const hotel = HOTELS.find((h) => h.id === q.get('hotel') && h.status === 'open');
  const checkIn = q.get('checkIn') || '', checkOut = q.get('checkOut') || '';
  const guests = Math.max(1, Math.min(12, Number.parseInt(q.get('guests'), 10) || 1));
  if (!hotel) return json({ error: 'hotel' }, 400);
  if (!validDates(checkIn, checkOut)) return json({ error: 'dates' }, 400);
  try {
    const [settings, bookings] = await Promise.all([getSettings(), listBookings()]);
    const rooms = quote(settings, bookings, { hotel: hotel.id, checkIn, checkOut, guests })
      .map(({ units, ...r }) => ({ ...r, left: r.left <= 3 ? r.left : null })); // only reveal scarcity
    return json({ hotel: hotel.id, checkIn, checkOut, guests, currency: settings.currency, rooms });
  } catch (err) {
    console.error('availability failed', err?.message ?? err);
    return json({ error: 'storage' }, 503);
  }
}
