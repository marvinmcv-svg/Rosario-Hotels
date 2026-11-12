// Admin bookings API: list (GET), create (POST), update (PATCH), delete (DELETE, owner).
import { getSession, isJson } from '../_lib/auth.js';
import {
  listBookings, getBooking, saveBooking, createBooking, deleteBooking, validateBooking,
  notifyStaff, notifyGuestConfirmed, STATUSES, json,
} from '../_lib/bookings.js';
import { getSettings, quote, HOLDING } from '../_lib/inventory.js';
import { HOTELS } from '../../site/content.js';

const deny = () => json({ error: 'unauthorized' }, 401);

/** Is there a free unit of b.room for b's dates (ignoring b itself)? */
async function roomFree(b) {
  if (b.room === null || b.room === undefined) return true;
  const [settings, bookings] = await Promise.all([getSettings(), listBookings()]);
  const q = quote(settings, bookings, { hotel: b.hotel, checkIn: b.checkIn, checkOut: b.checkOut, guests: 1, exceptRef: b.ref })[b.room];
  return Boolean(q && q.left > 0);
}

export async function GET(request) {
  if (!getSession(request)) return deny();
  try {
    return json({ bookings: await listBookings() });
  } catch (err) {
    console.error('admin list failed', err?.message ?? err);
    return json({ error: 'storage' }, 503);
  }
}

export async function POST(request) {
  const user = getSession(request);
  if (!user) return deny();
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const body = await request.json().catch(() => ({}));
  const { booking, error } = validateBooking(body, { admin: true, by: user.username });
  if (error) return json({ error }, 422);
  if (HOLDING.includes(booking.status) && !body.force && !(await roomFree(booking))) return json({ error: 'sold_out' }, 409);
  const settings = await getSettings();
  const r = booking.room !== null ? settings.rooms[booking.hotel]?.[booking.room] : null;
  if (r) booking.quote = { rate: r.rate, total: r.rate * booking.nights, currency: settings.currency, sample: settings.sample };
  const saved = await createBooking(booking);
  if (body.notify) await notifyStaff(saved);
  if (saved.status === 'confirmed') { await notifyGuestConfirmed(saved); await saveBooking(saved); }
  return json({ booking: saved }, 201);
}

export async function PATCH(request) {
  const user = getSession(request);
  if (!user) return deny();
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const body = await request.json().catch(() => ({}));
  if (typeof body.ref !== 'string' || !/^RH-[A-Z0-9]{6}$/.test(body.ref)) return json({ error: 'ref' }, 400);
  const b = await getBooking(body.ref);
  if (!b) return json({ error: 'not_found' }, 404);
  const now = new Date().toISOString();
  const log = (text) => b.log.push({ at: now, by: user.username, text });
  const before = { status: b.status, room: b.room };

  if (body.room !== undefined) {
    const hotel = HOTELS.find((h) => h.id === b.hotel);
    const room = body.room === null ? null : Number(body.room);
    if (room !== null && !hotel?.rooms[room]) return json({ error: 'room' }, 422);
    b.room = room;
    b.roomName = room === null ? null : hotel.rooms[room].name.en;
    if (before.room !== room) log(`Room: ${b.roomName || 'unassigned'}`);
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return json({ error: 'status' }, 422);
    b.status = body.status;
    if (before.status !== b.status) log(`Status: ${before.status} → ${b.status}`);
  }
  // re-check inventory when the booking newly occupies a room
  const nowHolding = HOLDING.includes(b.status) && b.room !== null;
  const wasHolding = HOLDING.includes(before.status) && before.room === b.room;
  if (nowHolding && !wasHolding && !body.force && !(await roomFree(b))) return json({ error: 'sold_out' }, 409);

  if (typeof body.note === 'string' && body.note.trim()) log(body.note.trim().slice(0, 1000));
  if (typeof body.price === 'string') b.price = body.price.trim().slice(0, 40);
  b.updatedAt = now;
  if (before.status !== 'confirmed' && b.status === 'confirmed') await notifyGuestConfirmed(b);
  return json({ booking: await saveBooking(b) });
}

export async function DELETE(request) {
  const user = getSession(request);
  if (!user) return deny();
  if (user.role !== 'owner') return json({ error: 'forbidden' }, 403);
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const { ref } = await request.json().catch(() => ({}));
  if (typeof ref !== 'string' || !/^RH-[A-Z0-9]{6}$/.test(ref)) return json({ error: 'ref' }, 400);
  await deleteBooking(ref);
  return json({ deleted: ref });
}
