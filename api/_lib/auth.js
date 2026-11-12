// Admin session: password check + HMAC-signed, HttpOnly cookie.
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'rh_admin';
const TTL = 12 * 60 * 60; // seconds

const b64 = (s) => Buffer.from(s).toString('base64url');
const sign = (data) => createHmac('sha256', process.env.ADMIN_SECRET).update(data).digest('base64url');
const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export const configured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
export const checkPassword = (pw) => configured() && typeof pw === 'string' && same(pw, process.env.ADMIN_PASSWORD);

export function sessionCookie() {
  const payload = b64(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + TTL }));
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function isAdmin(request) {
  if (!configured()) return false;
  const raw = (request.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return false;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig || !same(sig, sign(payload))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now() / 1000; } catch { return false; }
}

/** Mutating admin requests must be JSON (blocks cross-site form posts on top of SameSite). */
export const isJson = (request) => (request.headers.get('content-type') || '').includes('application/json');
