// Staff login (POST {username, password}), session check (GET) and logout (DELETE).
import { sessionCookie, clearCookie, getSession, configured, isJson } from '../_lib/auth.js';
import { authenticate } from '../_lib/users.js';
import { json } from '../_lib/store.js';

export function GET(request) {
  const user = getSession(request);
  return json({ authenticated: Boolean(user), user, configured: configured() });
}

export async function POST(request) {
  if (!isJson(request)) return json({ error: 'type' }, 415);
  if (!configured()) return json({ error: 'not_configured' }, 503);
  const { username = '', password = '' } = await request.json().catch(() => ({}));
  const user = await authenticate(username, password).catch(() => null);
  if (!user) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return json({ error: 'invalid' }, 401);
  }
  const pub = { username: user.username, name: user.name, role: user.role };
  return json({ authenticated: true, user: pub }, 200, { 'set-cookie': sessionCookie(pub) });
}

export function DELETE() {
  return json({ authenticated: false }, 200, { 'set-cookie': clearCookie() });
}
