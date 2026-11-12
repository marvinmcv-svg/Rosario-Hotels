// Staff accounts stored in the private Blob store; passwords hashed with scrypt.
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { readJson, writeJson } from './store.js';

const USERS = 'config/users.json';
export const ROLES = ['owner', 'staff'];
export const OWNER_USERNAME = 'admin';

export function hashPassword(pw) {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString('base64')}$${scryptSync(pw, salt, 32).toString('base64')}`;
}
function checkHash(pw, stored) {
  const [, salt, hash] = String(stored).split('$');
  if (!salt || !hash) return false;
  const a = scryptSync(String(pw), Buffer.from(salt, 'base64'), 32), b = Buffer.from(hash, 'base64');
  return a.length === b.length && timingSafeEqual(a, b);
}

export const listUsers = async () => (await readJson(USERS, { users: [] }).catch(() => ({ users: [] }))).users;
const saveUsers = (users) => writeJson(USERS, { users });
export const publicUser = (u) => ({ username: u.username, name: u.name, role: u.role, createdAt: u.createdAt });

export const validUsername = (u) => typeof u === 'string' && /^[a-z0-9._-]{3,32}$/.test(u);
export const validPassword = (p) => typeof p === 'string' && p.length >= 8 && p.length <= 200;

/**
 * Verifies a login. The owner account "admin" is bootstrapped from the
 * ADMIN_PASSWORD environment variable until the owner sets their own password.
 */
export async function authenticate(username, password) {
  username = String(username || '').trim().toLowerCase();
  const users = await listUsers();
  const user = users.find((u) => u.username === username);
  if (user) return checkHash(password, user.hash) ? user : null;
  if (username === OWNER_USERNAME && process.env.ADMIN_PASSWORD) {
    const a = Buffer.from(String(password)), b = Buffer.from(process.env.ADMIN_PASSWORD);
    if (a.length === b.length && timingSafeEqual(a, b)) return { username: OWNER_USERNAME, name: 'Owner', role: 'owner' };
  }
  return null;
}

export async function addUser({ username, name, role, password }) {
  const users = await listUsers();
  if (username === OWNER_USERNAME || users.some((u) => u.username === username)) throw new Error('exists');
  users.push({ username, name: String(name || username).slice(0, 80), role: ROLES.includes(role) ? role : 'staff', hash: hashPassword(password), createdAt: new Date().toISOString() });
  await saveUsers(users);
}

export async function setPassword(username, password) {
  const users = await listUsers();
  let u = users.find((x) => x.username === username);
  if (!u && username === OWNER_USERNAME) { // first time the owner changes the env-based password
    u = { username, name: 'Owner', role: 'owner', createdAt: new Date().toISOString() };
    users.push(u);
  }
  if (!u) throw new Error('not_found');
  u.hash = hashPassword(password);
  await saveUsers(users);
}

export async function removeUser(username) {
  if (username === OWNER_USERNAME) throw new Error('protected');
  await saveUsers((await listUsers()).filter((u) => u.username !== username));
}
