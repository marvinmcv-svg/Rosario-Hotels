// Rosar-IA — the Hoteles Rosario concierge chat widget.
import gsap from 'gsap';

const STORE = 'rosaria-chat-v1';
const MAX_TURNS = 20;

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Minimal, safe markdown: escape first, then links, bold, line breaks, bullets.
function render(md) {
  let h = escapeHtml(md);
  h = h.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|mailto:[^\s)]+|tel:[^\s)]+)\)/g,
    (_, text, url) => `<a href="${url}"${url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`);
  h = h.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/^[-•] (.+)$/gm, '<li>$1</li>').replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');
  h = h.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  return `<p>${h}</p>`.replace(/<p><\/p>/g, '');
}

export function initChat() {
  const box = document.querySelector('[data-chat]');
  if (!box) return;
  const lang = box.dataset.lang;
  const fab = box.querySelector('[data-chat-open]');
  const panel = box.querySelector('[data-chat-panel]');
  const log = box.querySelector('[data-chat-log]');
  const form = box.querySelector('[data-chat-form]');
  const input = box.querySelector('[data-chat-input]');
  const chips = box.querySelector('[data-chat-chips]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let history = [];
  let busy = false;

  try { history = JSON.parse(sessionStorage.getItem(STORE) || '[]'); } catch { history = []; }
  const save = () => sessionStorage.setItem(STORE, JSON.stringify(history.slice(-MAX_TURNS)));

  function bubble(role, text) {
    const el = document.createElement('div');
    el.className = `msg msg--${role}`;
    el.innerHTML = role === 'user' ? `<p>${escapeHtml(text)}</p>` : render(text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function paint() {
    log.innerHTML = '';
    bubble('assistant', log.dataset.hello);
    history.forEach((m) => bubble(m.role, m.content));
    chips.hidden = history.length > 0;
  }

  function open() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    box.classList.add('is-open');
    if (!log.children.length) paint();
    if (!reduced) gsap.fromTo(panel, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' });
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    const done = () => { panel.hidden = true; box.classList.remove('is-open'); fab.setAttribute('aria-expanded', 'false'); fab.focus(); };
    if (reduced) return done();
    gsap.to(panel, { opacity: 0, y: 16, duration: 0.3, ease: 'power2.in', onComplete: done });
  }

  fab.addEventListener('click', () => (panel.hidden ? open() : close()));
  box.querySelector('[data-chat-close]').addEventListener('click', close);
  box.querySelector('[data-chat-reset]').addEventListener('click', () => { history = []; save(); paint(); input.focus(); });
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) send(b.textContent);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) send(text);
  });

  async function send(text) {
    if (busy) return;
    busy = true;
    chips.hidden = true;
    input.value = ''; input.style.height = 'auto';
    history.push({ role: 'user', content: text });
    bubble('user', text);
    const out = bubble('assistant', '');
    out.classList.add('is-typing');
    out.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
    let reply = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lang, messages: history.slice(-MAX_TURNS) }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += dec.decode(value, { stream: true });
        out.classList.remove('is-typing');
        out.innerHTML = render(reply);
        log.scrollTop = log.scrollHeight;
      }
      if (!reply.trim()) throw new Error('empty');
      history.push({ role: 'assistant', content: reply });
    } catch {
      reply = lang === 'es'
        ? 'Lo siento, no pude responder en este momento. Escríbenos por [WhatsApp](https://wa.me/59176254988) o a [reservas@gruporosario.travel](mailto:reservas@gruporosario.travel) y te ayudamos enseguida.'
        : 'Sorry, I couldn’t answer just now. Message us on [WhatsApp](https://wa.me/59176254988) or at [reservas@gruporosario.travel](mailto:reservas@gruporosario.travel) and we’ll help right away.';
      out.classList.remove('is-typing');
      out.innerHTML = render(reply);
      history.pop(); // don't keep the failed question in the transcript sent to the model
    }
    save();
    busy = false;
    input.focus();
  }

}
