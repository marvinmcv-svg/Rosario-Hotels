// Admin login (POST), session check (GET) and logout (DELETE).
import { checkPassword, sessionCookie, clearCookie, isAdmin, configured, isJson } from '../_lib/auth.js';
import { json } from '../_lib/bookings.js';

export function GET(request) {
  return json({ authenticated: isAdmin(request), configured: configured() });
}

export async function POST(request) {
  if (!isJson(request)) return json({ error: 'type' }, 415);
  let pw = '';
  try { ({ password: pw } = await request.json()); } catch { /* empty */ }
  if (!checkPassword(pw)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return json({ error: configured() ? 'invalid' : 'not_configured' }, 401);
  }
  return json({ authenticated: true }, 200, { 'set-cookie': sessionCookie() });
}

export function DELETE() {
  return json({ authenticated: false }, 200, { 'set-cookie': clearCookie() });
}
