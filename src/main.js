import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
root.classList.add('has-js');
if (reduced) root.classList.add('reduced');

/* ---------- Rosario mark (vectorised from the logo, 41x35 grid) ---------- */
const MARK = [
  ['b', 'M1.5 17V1.5H12.5V12'], ['b', 'M28.5 12V1.5H39.5V17'],
  ['b', 'M1.5 18V33.5H12.5V23'], ['b', 'M28.5 23V33.5H39.5V18'],
  ['o', 'M7.5 5V15.5H18.5V0'], ['g', 'M23.5 0V15.5H34.5V5'],
  ['g', 'M7.5 30V19.5H18.5V35'], ['o', 'M23.5 35V19.5H34.5V30'],
];
$$('[data-mark]').forEach((svg) => {
  svg.innerHTML = MARK.map(([c, d]) => `<path class="${c}" d="${d}" pathLength="1"/>`).join('');
});

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

function scrollToTarget(target, onDone) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: onDone });
  else { (typeof target === 'number' ? window.scrollTo(0, target) : target.scrollIntoView()); onDone?.(); }
}

/* ---------- Hero WebGL ---------- */
const HERO_IMAGES = ['/media/img/tt-hero.webp', '/media/img/uy-hero.webp', '/media/img/sur-city.webp', '/media/img/tt-night.webp'];
let hero = null;
async function initHeroGL() {
  if (reduced) return null;
  const canvas = $('[data-hero-gl]');
  try {
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl'))) return null;
    const { createHero } = await import('./hero-gl.js');
    const h = createHero(canvas, HERO_IMAGES);
    await h.ready;
    root.classList.add('has-gl');
    gsap.ticker.add((t) => h.render(t));
    return h;
  } catch (e) {
    console.warn('Hero WebGL unavailable, using still image.', e);
    return null;
  }
}

/* ---------- Themes (whole page shifts night → salt → adobe) ---------- */
const THEMES = {
  night: { '--bg': '#0e1116', '--fg': '#f2eee6', '--muted': 'rgba(242,238,230,0.66)', '--line': 'rgba(242,238,230,0.18)', '--accent': '#e0a35a' },
  salt: { '--bg': '#f2eee6', '--fg': '#16181c', '--muted': 'rgba(22,24,28,0.7)', '--line': 'rgba(22,24,28,0.16)', '--accent': '#9a5410' },
  adobe: { '--bg': '#c7743a', '--fg': '#1b130d', '--muted': 'rgba(27,19,13,0.82)', '--line': 'rgba(27,19,13,0.24)', '--accent': '#1b130d' },
};
let currentTheme = 'night';
function setTheme(name) {
  if (name === currentTheme) return;
  currentTheme = name;
  gsap.to(root, { ...THEMES[name], duration: reduced ? 0 : 0.9, ease: 'power2.out', overwrite: 'auto' });
  root.style.colorScheme = name === 'night' ? 'dark' : 'light';
}
// created last (after the pinned sections) so their positions include pin spacing
function themes() {
  $$('[data-theme]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setTheme(sec.dataset.theme); },
    });
  });
}

/* ---------- Nav ---------- */
const nav = $('[data-nav]');
ScrollTrigger.create({
  start: () => window.innerHeight * 0.9, end: 'max',
  onUpdate: (self) => {
    nav.classList.toggle('is-solid', self.progress > 0);
    if (!menuOpen) nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > window.innerHeight * 1.2);
  },
  onLeaveBack: () => nav.classList.remove('is-solid', 'is-hidden'),
});

let menuOpen = false;
const menu = $('[data-menu]');
const menuToggle = $('[data-menu-toggle]');
function toggleMenu(open = !menuOpen) {
  menuOpen = open;
  menuToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    menu.hidden = false;
    nav.classList.remove('is-hidden');
    nav.style.color = 'var(--salt)';
    lenis?.stop();
    gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' });
    gsap.from($$('nav a', menu), { yPercent: 60, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'expo.out', delay: 0.1 });
  } else {
    nav.style.color = '';
    lenis?.start();
    gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: () => { menu.hidden = true; } });
  }
}
menuToggle.addEventListener('click', () => toggleMenu());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });

/* ---------- Anchor links ---------- */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = id === '#book' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (menuOpen) toggleMenu(false);
    scrollToTarget(target, () => { if (id === '#book') $('[data-book-form] select')?.focus({ preventScroll: true }); });
  });
});

/* ---------- Booking bar ---------- */
(function booking() {
  const form = $('[data-book-form]');
  const err = $('[data-book-error]');
  const fin = form.elements.in, fout = form.elements.out;
  const iso = (d) => d.toISOString().slice(0, 10);
  const today = new Date(); today.setHours(12);
  const plus = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };
  fin.min = iso(today); fout.min = iso(plus(1));
  fin.value = iso(plus(1)); fout.value = iso(plus(3));
  fin.addEventListener('change', () => {
    const d = new Date(fin.value + 'T12:00'); d.setDate(d.getDate() + 1);
    fout.min = iso(d);
    if (fout.value <= fin.value) fout.value = iso(d);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    err.textContent = '';
    if (!fin.value || !fout.value || fout.value <= fin.value) {
      err.textContent = 'Your departure date needs to be after your arrival date.';
      return;
    }
    const nights = Math.round((new Date(fout.value) - new Date(fin.value)) / 864e5);
    const url = new URL('https://www.gruporosario.com/en/reservations/');
    url.search = new URLSearchParams({
      action: 'c_1', hotel_id: form.elements.hotel.value, guide_id: '910',
      adults: form.elements.adults.value, date_in: fin.value, nights: String(nights),
    }).toString();
    window.open(url.toString(), '_blank', 'noopener');
  });
})();

/* ---------- Split-heading reveals ---------- */
function revealHeadings() {
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }),
    });
  });
}

/* ---------- Manifesto: words light up as you read ---------- */
function manifesto() {
  const el = $('[data-words]');
  const split = SplitText.create(el, { type: 'words', wordsClass: 'w' });
  gsap.to(split.words, {
    opacity: 1, stagger: 0.08, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true },
  });
  gsap.from($$('.chip', el), {
    width: 0, ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 75%', end: 'center 50%', scrub: true },
  });
}

/* ---------- Houses: pinned horizontal journey ---------- */
function houses(mm) {
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const track = $('[data-track]');
    const pin = $('.houses__pin');
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: pin, pin: true, scrub: 0.8, start: 'top top',
        end: () => '+=' + distance(), invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('[data-houses-bar]', { scaleX: self.progress }),
      },
    });
    $$('[data-house]').forEach((house) => {
      const img = $('[data-parallax-x]', house);
      gsap.fromTo(img, { xPercent: -8 }, {
        xPercent: 8, ease: 'none',
        scrollTrigger: { trigger: house, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
      });
      gsap.from($$('.house__body > *', house), {
        y: 40, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: house, containerAnimation: tween, start: 'left 65%', once: true },
      });
    });
  });
  mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    $$('[data-house]').forEach((house) => {
      gsap.from($$('.house__body > *', house), {
        y: 30, opacity: 0, stagger: 0.05, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: house, start: 'top 75%', once: true },
      });
    });
  });
}

/* ---------- Rooms: image follows the cursor ---------- */
function rooms() {
  if (!finePointer) return;
  const list = $('[data-rooms]');
  const follower = $('[data-follower]');
  const [a, b] = $$('img', follower);
  let front = a, back = b, current = '';
  const xTo = gsap.quickTo(follower, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(follower, 'y', { duration: 0.6, ease: 'power3' });
  const rTo = gsap.quickTo(follower, 'rotation', { duration: 0.8, ease: 'power3' });
  let lastX = 0;
  window.addEventListener('pointermove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  }, { passive: true });
  list.addEventListener('pointerleave', () => {
    gsap.to(follower, { opacity: 0, scale: 0.85, duration: 0.5, ease: 'power3' });
    current = '';
  });
  $$('.room', list).forEach((row) => {
    row.addEventListener('pointerenter', () => {
      const src = row.dataset.img;
      gsap.to(follower, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' });
      if (src === current) return;
      current = src;
      back.src = src;
      gsap.set(back, { zIndex: 2 });
      gsap.set(front, { zIndex: 1 });
      gsap.fromTo(back, { clipPath: 'inset(100% 0 0 0)', scale: 1.25 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 0.8, ease: 'expo.out' });
      [front, back] = [back, front];
    });
  });
}

/* ---------- Films ---------- */
function films() {
  const cards = $$('[data-films] .film');
  cards.forEach((card) => {
    const v = $('video', card);
    card.dataset.cursor = 'Sound';
    ScrollTrigger.create({
      trigger: card, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => {
        if (self.isActive) { v.preload = 'auto'; v.play().catch(() => {}); }
        else v.pause();
      },
    });
    card.addEventListener('click', () => {
      const unmute = v.muted;
      cards.forEach((c) => { $('video', c).muted = true; c.classList.remove('is-sound'); });
      v.muted = !unmute;
      card.classList.toggle('is-sound', unmute);
      if (unmute) v.play().catch(() => {});
    });
  });
  if (reduced) return;
  gsap.fromTo(cards, { rotation: (i) => [-7, 5, -4, 8][i], yPercent: (i) => [18, 30, 12, 26][i] }, {
    rotation: 0, yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-films]', start: 'top bottom', end: 'center 55%', scrub: 1 },
  });
}

/* ---------- Table: image opens to full bleed ---------- */
function table() {
  if (reduced) return;
  const stage = $('[data-table]');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: stage, start: 'top top', end: '+=120%', pin: true, scrub: 1 },
  });
  tl.to('[data-table-frame]', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut' }, 0)
    .to('[data-table-frame] img', { scale: 1, ease: 'power2.inOut' }, 0)
    .from('.table__title span', { xPercent: -30, ease: 'power2.out' }, 0)
    .from('.table__title em', { xPercent: 30, ease: 'power2.out' }, 0);
  $$('.table__grid figure').forEach((f, i) => {
    gsap.from(f, { y: 80 + i * 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 92%', once: true } });
  });
}

/* ---------- Image reveals ---------- */
function imageReveals() {
  if (reduced) return;
  $$('[data-reveal-img]').forEach((img) => {
    gsap.fromTo(img, { clipPath: 'inset(0 0 100% 0)', scale: 1.2 }, {
      clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: img, start: 'top 80%', once: true },
    });
  });
  $$('.offers__list li').forEach((li, i) => {
    gsap.from(li, { y: 50, opacity: 0, duration: 1.2, delay: i * 0.08, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 90%', once: true } });
  });
}

/* ---------- Instagram marquee (speed follows scroll velocity) ---------- */
function marquee() {
  const track = $('[data-marquee] .gram__track');
  track.innerHTML += track.innerHTML;
  $$('img', track).slice(track.children.length / 2).forEach((img) => { img.alt = ''; img.setAttribute('aria-hidden', 'true'); });
  if (reduced) return;
  const loop = gsap.to(track, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 });
  let boost = 1;
  lenis?.on('scroll', ({ velocity }) => {
    boost = 1 + Math.min(Math.abs(velocity) * 0.25, 6);
    loop.timeScale(velocity < 0 ? -boost : boost);
    gsap.to(loop, { timeScale: velocity < 0 ? -1 : 1, duration: 1.2, ease: 'power2.out', overwrite: true, delay: 0.05 });
  });
}

/* ---------- Footer wordmark ---------- */
function footer() {
  $('[data-year]').textContent = new Date().getFullYear();
  if (reduced) return;
  const word = $('[data-footer-word]');
  const split = SplitText.create(word, { type: 'chars', charsClass: 'c', mask: 'chars' });
  gsap.from(split.chars, {
    yPercent: 100, stagger: 0.05, ease: 'expo.out', duration: 1.4,
    scrollTrigger: { trigger: word, start: 'top 95%', once: true },
  });
}

/* ---------- Cursor ---------- */
function cursor() {
  if (!finePointer || reduced) return;
  const c = $('[data-cursor]');
  const label = $('[data-cursor-label]');
  const xTo = gsap.quickTo(c, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(c, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, select, input');
    if (!t) { gsap.to(c, { scale: 1, duration: 0.4 }); gsap.to(label, { opacity: 0, scale: 0.2, duration: 0.3 }); return; }
    if (t.dataset.cursor) {
      label.textContent = t.dataset.cursor;
      gsap.to(c, { scale: 8, duration: 0.5, ease: 'expo.out' });
      gsap.to(label, { opacity: 1, scale: 0.125, duration: 0.4 });
    } else {
      gsap.to(c, { scale: 3.2, duration: 0.5, ease: 'expo.out' });
      gsap.to(label, { opacity: 0, duration: 0.2 });
    }
  });
}

/* ---------- Hero slideshow ---------- */
const SLIDE_MS = 6.5;
function heroSlides() {
  const buttons = $$('[data-slide]');
  let index = 0, timer = null, busy = false;
  const fill = (i) => {
    gsap.killTweensOf('.hero__slide-bar i');
    buttons.forEach((b, j) => {
      b.classList.toggle('is-active', j === i);
      gsap.set($('i', b), { scaleX: j < i ? 1 : 0 });
    });
    timer = gsap.to($('i', buttons[i]), { scaleX: 1, duration: SLIDE_MS, ease: 'none', onComplete: () => go((index + 1) % buttons.length) });
  };
  function go(next) {
    if (busy || next === index) return;
    if (!hero) { index = next; fill(index); return; }
    busy = true;
    hero.setPair(index, next);
    hero.uniforms.uProgress.value = 0;
    index = next;
    fill(index);
    gsap.to(hero.uniforms.uProgress, {
      value: 1, duration: 2, ease: 'power2.inOut',
      onComplete: () => { hero.setPair(index, index); hero.uniforms.uProgress.value = 0; busy = false; },
    });
  }
  buttons.forEach((b, i) => b.addEventListener('click', () => go(i)));
  const heroEl = $('.hero');
  if (hero) heroEl.addEventListener('click', (e) => { if (!e.target.closest('form, button, a')) go((index + 1) % buttons.length); });
  ScrollTrigger.create({
    trigger: heroEl, start: 'top top', end: 'bottom top',
    onToggle: (self) => { hero?.setRunning(self.isActive); self.isActive ? timer?.resume() : timer?.pause(); },
    onUpdate: (self) => { if (hero) hero.uniforms.uScroll.value = self.progress; },
  });
  if (reduced) { gsap.set('.hero__slides', { display: 'none' }); return; }
  fill(0);
}

/* ---------- Intro ---------- */
function intro() {
  const title = $('[data-hero-title]');
  const split = SplitText.create(title, { type: 'lines,words', mask: 'lines', linesClass: 'line-m' });
  const tl = gsap.timeline();
  tl.from(split.words, { yPercent: 115, duration: 1.6, ease: 'expo.out', stagger: 0.06 })
    .from('[data-hero-fade]', { y: 30, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.45)
    .from(nav.children, { y: -24, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }, 0.3);
  return tl;
}

async function preloader() {
  const loader = $('.loader');
  if (reduced) { loader.remove(); return; }
  const paths = $$('.mark--loader path');
  const count = $('[data-count]');
  gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
  const state = { v: 0 };
  const draw = gsap.timeline()
    .to(paths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: { each: 0.08, from: 'edges' } })
    .to('.loader__word', { opacity: 1, letterSpacing: '0.22em', duration: 1, ease: 'expo.out' }, 0.6);
  const counting = gsap.to(state, { v: 86, duration: 1.6, ease: 'power2.out', onUpdate: () => { count.textContent = Math.round(state.v); } });

  await Promise.all([document.fonts.ready, initHeroGL().then((h) => { hero = h; }), draw.then(), counting.then()]);
  await gsap.to(state, { v: 100, duration: 0.4, ease: 'power1.out', onUpdate: () => { count.textContent = Math.round(state.v); } }).then();

  const tl = gsap.timeline();
  tl.to('.loader__inner', { scale: 0.92, opacity: 0, duration: 0.7, ease: 'power3.in' })
    .to('.loader__count', { yPercent: 60, opacity: 0, duration: 0.5, ease: 'power3.in' }, 0)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 0.45)
    .add(intro(), 0.85)
    .add(() => { loader.remove(); }, '+=0');
}

/* ---------- Boot ---------- */
async function boot() {
  if (reduced) {
    await document.fonts.ready;
  }
  await preloader();
  heroSlides();
  revealHeadings();
  manifesto();
  houses(gsap.matchMedia());
  rooms();
  films();
  table();
  imageReveals();
  marquee();
  footer();
  cursor();
  themes();
  lenis?.start();
  ScrollTrigger.refresh();
}
boot();
