// Room inventory, rates and availability.
// Units and rates below are PROTOTYPE DEFAULTS, editable by the owner in /admin/ → Settings.
import { HOTELS } from '../../site/content.js';
import { readJson, writeJson } from './store.js';

const CONFIG = 'config/settings.json';
// Statuses that occupy a room for its dates.
export const HOLDING = ['pending', 'confirmed', 'checked_in'];

// [units, nightly rate USD, max guests] per room type, in the order of site/content.js
const DEFAULTS = {
  titicaca: [[6, 90, 4], [6, 80, 2], [8, 100, 2], [6, 110, 4], [4, 130, 3], [2, 140, 2], [2, 160, 4], [1, 180, 5], [2, 170, 4], [1, 220, 4]],
  uyuni: [[10, 70, 1], [20, 110, 4], [14, 100, 2]],
  sur: [[4, 60, 1], [6, 95, 4], [6, 90, 2], [4, 110, 2], [4, 120, 4], [3, 130, 2], [3, 140, 4], [1, 160, 2]],
};

export function defaultSettings() {
  return {
    sample: true, // true until the owner saves real rates
    currency: 'USD',
    rooms: Object.fromEntries(HOTELS.filter((h) => h.rooms.length).map((h) => [
      h.id,
      h.rooms.map((r, i) => {
        const [units, rate, maxGuests] = DEFAULTS[h.id]?.[i] || [2, 100, 2];
        return { name: r.name.en, units, rate, maxGuests };
      }),
    ])),
    notify: { staffEmails: [], guestEmails: true },
    updatedAt: null,
  };
}

export async function getSettings() {
  const saved = await readJson(CONFIG).catch(() => null);
  if (!saved) return defaultSettings();
  // merge so new room types / fields added to the site appear automatically
  const base = defaultSettings();
  for (const id of Object.keys(base.rooms)) {
    base.rooms[id] = base.rooms[id].map((def, i) => ({ ...def, ...(saved.rooms?.[id]?.[i] || {}), name: def.name }));
  }
  return { ...base, ...saved, rooms: base.rooms, notify: { ...base.notify, ...(saved.notify || {}) } };
}

export async function saveSettings(input, current) {
  if (input.reset) return writeJson(CONFIG, { ...defaultSettings(), notify: current.notify, updatedAt: new Date().toISOString() });
  const next = { ...current, sample: false, updatedAt: new Date().toISOString() };
  if (input.rooms) {
    for (const id of Object.keys(next.rooms)) {
      next.rooms[id] = next.rooms[id].map((r, i) => {
        const x = input.rooms?.[id]?.[i] || {};
        const n = (v, min, max, d) => { const k = Number(v); return Number.isFinite(k) ? Math.min(max, Math.max(min, Math.round(k * 100) / 100)) : d; };
        return { ...r, units: n(x.units, 0, 200, r.units), rate: n(x.rate, 0, 100000, r.rate), maxGuests: n(x.maxGuests, 1, 12, r.maxGuests) };
      });
    }
  }
  if (input.notify) {
    const emails = Array.isArray(input.notify.staffEmails) ? input.notify.staffEmails : String(input.notify.staffEmails || '').split(/[\s,;]+/);
    next.notify = {
      staffEmails: [...new Set(emails.map((e) => String(e).trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))].slice(0, 10),
      guestEmails: input.notify.guestEmails !== false,
    };
  }
  return writeJson(CONFIG, next);
}

const nightsOf = (checkIn, checkOut) => {
  const out = [];
  for (let d = new Date(checkIn + 'T12:00:00Z'); d.toISOString().slice(0, 10) < checkOut; d.setUTCDate(d.getUTCDate() + 1)) out.push(d.toISOString().slice(0, 10));
  return out;
};

/** Units of `room` booked on each night of [checkIn, checkOut), ignoring `exceptRef`. */
function bookedPerNight(bookings, hotel, room, nights, exceptRef) {
  return nights.map((night) => bookings.filter((b) =>
    b.ref !== exceptRef && b.hotel === hotel && b.room === room && HOLDING.includes(b.status) &&
    b.checkIn <= night && b.checkOut > night).length);
}

/** Availability + price for every room type of a hotel. */
export function quote(settings, bookings, { hotel, checkIn, checkOut, guests = 1, exceptRef = null }) {
  const rooms = settings.rooms[hotel] || [];
  const nights = nightsOf(checkIn, checkOut);
  return rooms.map((r, i) => {
    const booked = bookedPerNight(bookings, hotel, i, nights, exceptRef);
    const left = Math.max(0, r.units - Math.max(0, ...booked));
    return {
      room: i, name: r.name, units: r.units, left,
      fits: guests <= r.maxGuests, maxGuests: r.maxGuests,
      rate: r.rate, nights: nights.length, total: Math.round(r.rate * nights.length * 100) / 100,
      available: left > 0 && guests <= r.maxGuests,
    };
  });
}

/** Occupancy grid for the admin calendar. */
export function occupancy(settings, bookings, hotel, from, days) {
  const dates = Array.from({ length: days }, (_, i) => { const d = new Date(from + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + i); return d.toISOString().slice(0, 10); });
  return {
    dates,
    rooms: (settings.rooms[hotel] || []).map((r, i) => ({
      name: r.name, units: r.units,
      booked: bookedPerNight(bookings, hotel, i, dates, null),
    })),
  };
}
