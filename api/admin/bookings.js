// Admin bookings API: list (GET), create manual booking (POST), update (PATCH).
import { isAdmin, isJson } from '../_lib/auth.js';
import { listBookings, getBooking, saveBooking, createBooking, deleteBooking, validateBooking, STATUSES, json } from '../_lib/bookings.js';

const deny = () => json({ error: 'unauthorized' }, 401);

export async function GET(request) {
  if (!isAdmin(request)) return deny();
  try {
    return json({ bookings: await listBookings() });
  } catch (err) {
    console.error('admin list failed', err?.message ?? err);
    return json({ error: 'storage' }, 503);
  }
}

export async function POST(request) {
  if (!isAdmin(request)) return deny();
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const { booking, error } = validateBooking(await request.json().catch(() => ({})), { admin: true });
  if (error) return json({ error }, 422);
  return json({ booking: await createBooking(booking) }, 201);
}

export async function PATCH(request) {
  if (!isAdmin(request)) return deny();
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const body = await request.json().catch(() => ({}));
  if (typeof body.ref !== 'string' || !/^RH-[A-Z0-9]{6}$/.test(body.ref)) return json({ error: 'ref' }, 400);
  const b = await getBooking(body.ref);
  if (!b) return json({ error: 'not_found' }, 404);
  const now = new Date().toISOString();
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return json({ error: 'status' }, 422);
    if (body.status !== b.status) b.log.push({ at: now, by: 'admin', text: `Status: ${b.status} → ${body.status}` });
    b.status = body.status;
  }
  if (typeof body.note === 'string' && body.note.trim()) b.log.push({ at: now, by: 'admin', text: body.note.trim().slice(0, 1000) });
  if (typeof body.price === 'string') b.price = body.price.trim().slice(0, 40);
  if (typeof body.roomName === 'string') b.roomName = body.roomName.trim().slice(0, 120) || b.roomName;
  b.updatedAt = now;
  return json({ booking: await saveBooking(b) });
}

export async function DELETE(request) {
  if (!isAdmin(request)) return deny();
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const { ref } = await request.json().catch(() => ({}));
  if (typeof ref !== 'string' || !/^RH-[A-Z0-9]{6}$/.test(ref)) return json({ error: 'ref' }, 400);
  await deleteBooking(ref);
  return json({ deleted: ref });
}
