// Bookings: storage, validation and notifications.
import { randomInt } from 'node:crypto';
import { HOTELS } from '../../site/content.js';
import { readJson, writeJson, readAll, remove, json } from './store.js';
import { getSettings } from './inventory.js';
import { sendEmail, staffNewBooking, guestConfirmation } from './email.js';

export { json };
const PREFIX = 'bookings/';
export const STATUSES = ['pending', 'confirmed', 'checked_in', 'completed', 'cancelled'];
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const newRef = () => 'RH-' + Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
const path = (ref) => `${PREFIX}${ref}.json`;

export const saveBooking = (b, opts) => writeJson(path(b.ref), b, opts);
export const getBooking = (ref) => readJson(path(ref));
export const deleteBooking = (ref) => remove(path(ref));
export const listBookings = async () => (await readAll(PREFIX)).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

export async function createBooking(data) {
  for (let i = 0; i < 4; i++) {
    const b = { ...data, ref: newRef() };
    try { return await saveBooking(b, { create: true }); } catch (e) {
      if (!/exist/i.test(String(e?.message))) throw e; // retry only on a ref collision
    }
  }
  throw new Error('could not allocate a booking reference');
}

/* ---------------- notifications ---------------- */

const logEmail = (b, what, r) => b.log.push({ at: new Date().toISOString(), by: 'system', text: r.ok ? `Email sent: ${what}` : `Email not sent (${what}): ${r.error}` });

/** Emails staff about a new booking; records the outcome in the booking log and saves it. */
export async function notifyStaff(b) {
  const settings = await getSettings().catch(() => null);
  const to = [...new Set([...(settings?.notify?.staffEmails || []), ...String(process.env.STAFF_EMAILS || '').split(/[\s,;]+/).filter(Boolean)])];
  const r = await sendEmail({ to, ...staffNewBooking(b), replyTo: b.guest?.email || undefined });
  logEmail(b, `staff (${to.length})`, r);
  await saveBooking(b).catch(() => {});
  return r;
}

/** Emails the guest that the booking is confirmed (if enabled and they gave an email). */
export async function notifyGuestConfirmed(b) {
  if (!b.guest?.email) return null;
  const settings = await getSettings().catch(() => null);
  if (settings && settings.notify?.guestEmails === false) return null;
  const r = await sendEmail({ to: b.guest.email, ...guestConfirmation(b), replyTo: 'reservas@gruporosario.travel' });
  logEmail(b, 'guest confirmation', r);
  return r;
}

/* ---------------- validation ---------------- */

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T12:00:00Z'));
const int = (v, min, max) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min; };
const EXTRAS = ['transfer', 'early_checkin', 'late_checkout', 'celebration', 'halfboard'];
export const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' });

export function validDates(checkIn, checkOut, { allowPast = false } = {}) {
  if (!isDate(checkIn) || !isDate(checkOut) || checkOut <= checkIn) return false;
  if (!allowPast && checkIn < today()) return false;
  return Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 864e5) <= 60;
}

/** Returns { booking } or { error }. `admin` allows past dates, the closed hotel and a chosen status. */
export function validateBooking(body, { admin = false, by = 'guest' } = {}) {
  const hotel = HOTELS.find((h) => h.id === body?.hotel && (admin || h.status === 'open'));
  if (!hotel) return { error: 'hotel' };
  const checkIn = str(body.checkIn, 10), checkOut = str(body.checkOut, 10);
  if (!validDates(checkIn, checkOut, { allowPast: admin })) return { error: 'dates' };
  const nights = Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 864e5);
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
      room: roomIndex,
      roomName: roomIndex === null ? null : hotel.rooms[roomIndex].name.en,
      checkIn, checkOut, nights,
      adults: int(body.adults, 1, 12),
      children: int(body.children, 0, 8),
      extras: Array.isArray(body.extras) ? body.extras.filter((x) => EXTRAS.includes(x)) : [],
      notes: str(body.notes, 1500),
      guest: { name, email, phone, country: str(body.country, 60) },
      lang: body.lang === 'es' ? 'es' : 'en',
      channel: ['whatsapp', 'web', 'phone', 'walk_in', 'email'].includes(body.channel) ? body.channel : 'web',
      status: admin && STATUSES.includes(body.status) ? body.status : 'pending',
      price: admin ? str(body.price, 40) : '',
      createdAt: now,
      updatedAt: now,
      log: [{ at: now, by, text: admin ? 'Created by staff' : `Requested via ${body.channel === 'whatsapp' ? 'WhatsApp' : 'website'}` }],
    },
  };
}
