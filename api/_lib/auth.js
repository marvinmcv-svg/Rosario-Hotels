// Staff session: HMAC-signed, HttpOnly cookie carrying { u, role, exp }.
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'rh_admin';
const TTL = 12 * 60 * 60; // seconds

const sign = (data) => createHmac('sha256', process.env.ADMIN_SECRET).update(data).digest('base64url');
const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

export const configured = () => Boolean(process.env.ADMIN_SECRET && process.env.ADMIN_PASSWORD);

export function sessionCookie(user) {
  const payload = Buffer.from(JSON.stringify({ u: user.username, n: user.name, role: user.role, exp: Math.floor(Date.now() / 1000) + TTL })).toString('base64url');
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

/** Returns { username, name, role } for a valid session, else null. */
export function getSession(request) {
  if (!configured()) return null;
  const raw = (request.headers.get('cookie') || '').split(/;\s*/).find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return null;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig || !same(sig, sign(payload))) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return s.exp > Date.now() / 1000 ? { username: s.u, name: s.n, role: s.role } : null;
  } catch { return null; }
}

/** Mutating admin requests must be JSON (blocks cross-site form posts on top of SameSite). */
export const isJson = (request) => (request.headers.get('content-type') || '').includes('application/json');
