// Rosar-IA backend: streams a concierge answer from Claude.
// Auth: ANTHROPIC_API_KEY (direct to Anthropic) if set; otherwise the
// Vercel AI Gateway using the deployment's OIDC token (no key needed on Vercel).
import Anthropic from '@anthropic-ai/sdk';
import { getVercelOidcToken } from '@vercel/oidc';
import { SYSTEM_PROMPT } from '../site/knowledge.js';

const MAX_MESSAGES = 20;
const MAX_CHARS = 1500;

async function client() {
  if (process.env.ANTHROPIC_API_KEY) {
    return { api: new Anthropic(), model: 'claude-opus-5-5', direct: true };
  }
  const apiKey = process.env.AI_GATEWAY_API_KEY || (await getVercelOidcToken());
  return { api: new Anthropic({ apiKey, baseURL: 'https://ai-gateway.vercel.sh' }), model: 'anthropic/claude-opus-5.5', direct: false };
}

function clean(body) {
  const lang = body?.lang === 'es' ? 'es' : 'en';
  const raw = Array.isArray(body?.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const messages = raw
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== 'user') return null;
  return { lang, messages };
}

const FALLBACK = {
  en: 'Sorry, I can’t answer that right now. Our team will gladly help on [WhatsApp](https://wa.me/59176254988) or at [reservas@gruporosario.travel](mailto:reservas@gruporosario.travel).',
  es: 'Lo siento, no puedo responder eso ahora. Nuestro equipo te ayuda con gusto por [WhatsApp](https://wa.me/59176254988) o en [reservas@gruporosario.travel](mailto:reservas@gruporosario.travel).',
};

export async function POST(request) {
  let input;
  try { input = clean(await request.json()); } catch { input = null; }
  if (!input) return Response.json({ error: 'invalid_request' }, { status: 400 });

  let api, model, direct;
  try {
    ({ api, model, direct } = await client());
  } catch (err) {
    console.error('rosar-ia: no model credentials', err?.message ?? err);
    return new Response(FALLBACK[input.lang], { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  }
  const params = {
    model,
    max_tokens: 4096,
    output_config: { effort: 'low' },
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `The guest is browsing the ${input.lang === 'es' ? 'Spanish' : 'English'} version of the website.` },
    ],
    messages: input.messages,
  };
  // Server-side refusal fallback is enabled when talking to Anthropic directly.
  const stream = direct
    ? api.beta.messages.stream({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' })
    : api.messages.stream(params);

  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      let wrote = false;
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            wrote = true;
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal' || !wrote) controller.enqueue(enc.encode((wrote ? '\n\n' : '') + FALLBACK[input.lang]));
      } catch (err) {
        console.error('rosar-ia error', err?.status ?? '', err?.message ?? err);
        controller.enqueue(enc.encode((wrote ? '\n\n' : '') + FALLBACK[input.lang]));
      }
      controller.close();
    },
    cancel() { stream.abort(); },
  });

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
  });
}
