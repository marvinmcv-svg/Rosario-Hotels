// Staff accounts. Owner: list/add/remove/reset anyone. Staff: change own password.
import { getSession, isJson } from '../_lib/auth.js';
import { listUsers, addUser, setPassword, removeUser, publicUser, validUsername, validPassword, OWNER_USERNAME } from '../_lib/users.js';
import { json } from '../_lib/store.js';

export async function GET(request) {
  const user = getSession(request);
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (user.role !== 'owner') return json({ users: [user] });
  const users = (await listUsers()).map(publicUser);
  if (!users.some((u) => u.username === OWNER_USERNAME)) users.unshift({ username: OWNER_USERNAME, name: 'Owner', role: 'owner' });
  return json({ users });
}

export async function POST(request) {
  const user = getSession(request);
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (user.role !== 'owner') return json({ error: 'forbidden' }, 403);
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const b = await request.json().catch(() => ({}));
  const username = String(b.username || '').trim().toLowerCase();
  if (!validUsername(username)) return json({ error: 'username' }, 422);
  if (!validPassword(b.password)) return json({ error: 'password' }, 422);
  try { await addUser({ username, name: b.name, role: b.role, password: b.password }); } catch (e) { return json({ error: e.message }, 409); }
  return json({ ok: true }, 201);
}

export async function PATCH(request) {
  const user = getSession(request);
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const b = await request.json().catch(() => ({}));
  const target = String(b.username || user.username).toLowerCase();
  if (target !== user.username && user.role !== 'owner') return json({ error: 'forbidden' }, 403);
  if (!validPassword(b.password)) return json({ error: 'password' }, 422);
  try { await setPassword(target, b.password); } catch (e) { return json({ error: e.message }, 404); }
  return json({ ok: true });
}

export async function DELETE(request) {
  const user = getSession(request);
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (user.role !== 'owner') return json({ error: 'forbidden' }, 403);
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const { username } = await request.json().catch(() => ({}));
  if (username === user.username) return json({ error: 'self' }, 422);
  try { await removeUser(String(username || '')); } catch (e) { return json({ error: e.message }, 422); }
  return json({ ok: true });
}
