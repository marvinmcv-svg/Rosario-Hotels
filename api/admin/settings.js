// Rates, inventory and notification settings. Read: any staff. Write: owner.
import { getSession, isJson } from '../_lib/auth.js';
import { getSettings, saveSettings } from '../_lib/inventory.js';
import { emailConfigured, sendEmail } from '../_lib/email.js';
import { json } from '../_lib/store.js';

export async function GET(request) {
  if (!getSession(request)) return json({ error: 'unauthorized' }, 401);
  return json({ settings: await getSettings(), email: { configured: emailConfigured(), from: process.env.NOTIFY_FROM || 'Hoteles Rosario <onboarding@resend.dev>' } });
}

export async function PUT(request) {
  const user = getSession(request);
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (user.role !== 'owner') return json({ error: 'forbidden' }, 403);
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const body = await request.json().catch(() => ({}));
  return json({ settings: await saveSettings(body, await getSettings()) });
}

/** POST: send a test email to the staff list. */
export async function POST(request) {
  const user = getSession(request);
  if (!user) return json({ error: 'unauthorized' }, 401);
  if (!isJson(request)) return json({ error: 'type' }, 415);
  const s = await getSettings();
  const r = await sendEmail({
    to: s.notify.staffEmails,
    subject: 'Test notification · Hoteles Rosario admin',
    html: `<p>This is a test from the Hoteles Rosario admin portal, sent by <strong>${user.username}</strong>. New booking requests will arrive like this.</p>`,
    text: 'Test notification from the Hoteles Rosario admin portal.',
  });
  return json(r, r.ok ? 200 : 502);
}
