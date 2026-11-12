// Booking storage (one private Vercel Blob per booking) and validation.
import { put, get, list, del } from '@vercel/blob';
import { randomInt } from 'node:crypto';
import { HOTELS } from '../../site/content.js';

const PREFIX = 'bookings/';
export const STATUSES = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'];
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const newRef = () => 'RH-' + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
const path = (ref) => `${PREFIX}${ref}.json`;

export async function saveBooking(b, { create = false } = {}) {
  await put(path(b.ref), JSON.stringify(b), {
    access: 'private', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: !create, cacheControlMaxAge: 60,
  });
  return b;
}

export async function createBooking(data) {
  for (let i = 0; i < 4; i++) {
    const b = { ...data, ref: newRef() };
    try { return await saveBooking(b, { create: true }); } catch (e) {
      if (!/exist/i.test(String(e?.message))) throw e; // retry only on a ref collision
    }
  }
  throw new Error('could not allocate a booking reference');
}

async function readJson(pathname) {
  const res = await get(pathname, { access: 'private', useCache: false });
  if (!res) return null;
  return JSON.parse(await new Response(res.stream).text());
}

export const getBooking = (ref) => readJson(path(ref));
export const deleteBooking = (ref) => del(path(ref));

export async function listBookings() {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const out = [];
  for (let i = 0; i < blobs.length; i += 12) {
    const chunk = await Promise.all(blobs.slice(i, i + 12).map((b) => readJson(b.pathname).catch(() => null)));
    out.push(...chunk.filter(Boolean));
  }
  return out.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

/* ---------------- validation ---------------- */

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T12:00:00Z'));
const int = (v, min, max) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min; };
const EXTRAS = ['transfer', 'early_checkin', 'late_checkout', 'celebration', 'halfboard'];

/** Returns { booking } or { error }. `admin` relaxes the past-date check for manual entries. */
export function validateBooking(body, { admin = false } = {}) {
  const hotel = HOTELS.find((h) => h.id === body?.hotel && (admin || h.status === 'open'));
  if (!hotel) return { error: 'hotel' };
  const checkIn = str(body.checkIn, 10), checkOut = str(body.checkOut, 10);
  if (!isDate(checkIn) || !isDate(checkOut) || checkOut <= checkIn) return { error: 'dates' };
  const today = new Date().toISOString().slice(0, 10);
  if (!admin && checkIn < today) return { error: 'dates' };
  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 864e5);
  if (nights > 60) return { error: 'dates' };
  const name = str(body.name, 120);
  const phone = str(body.phone, 40).replace(/[^\d+ ()-]/g, '');
  const email = str(body.email, 160);
  if (name.length < 2) return { error: 'name' };
  if (!admin && phone.replace(/\D/g, '').length < 7) return { error: 'phone' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'email' };
  const roomIndex = Number.isInteger(body.room) && hotel.rooms[body.room] ? body.room : null;
  const now = new Date().toISOString();
  return {
    booking: {
      hotel: hotel.id,
      hotelName: hotel.fullName,
      room: roomIndex === null ? null : roomIndex,
      roomName: roomIndex === null ? str(body.roomName, 120) || null : hotel.rooms[roomIndex].name.en,
      checkIn, checkOut, nights,
      adults: int(body.adults, 1, 12),
      children: int(body.children, 0, 8),
      extras: Array.isArray(body.extras) ? body.extras.filter((x) => EXTRAS.includes(x)) : [],
      notes: str(body.notes, 1500),
      guest: { name, email, phone, country: str(body.country, 60) },
      lang: body.lang === 'es' ? 'es' : 'en',
      channel: ['whatsapp', 'web', 'phone', 'walk_in', 'email'].includes(body.channel) ? body.channel : 'web',
      status: admin && STATUSES.includes(body.status) ? body.status : 'pending',
      createdAt: now,
      updatedAt: now,
      log: [{ at: now, by: admin ? 'admin' : 'guest', text: admin ? 'Created by staff' : `Requested via ${body.channel === 'whatsapp' ? 'WhatsApp' : 'website'}` }],
    },
  };
}

export const json = (data, status = 200, headers = {}) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store', ...headers } });
