# Hoteles Rosario — website

The bilingual (EN/ES) website for Hoteles Rosario: Lago Titicaca, Uyuni, La Paz Sur and La Paz Centro. It includes **Rosar-IA**, an AI concierge. See [PLAN.md](PLAN.md) for the original audit and creative direction.

**Stack:** Vite, GSAP (ScrollTrigger and SplitText), Lenis and Three.js on the front end. Rosar-IA is a Vercel Function (`api/chat.js`) that calls Claude through the Anthropic SDK.

```bash
npm install
npm run dev      # generates the pages, then starts the dev server
npm run build    # generates the pages, then builds the static site into dist/
```

## How pages are made
- `site/content.js` is the single source of truth for hotels, rooms, offers, FAQ, contacts and UI strings, in both languages.
- `site/layout.js` holds the shared shell: head, nav, footer, booking band and chat widget.
- `site/pages.js` holds the page templates: home, hotel, rooms, dining, offers, gallery and contact.
- `scripts/generate.mjs` writes the 20 pages (10 routes × 2 languages) as HTML, plus `sitemap.xml` and `robots.txt`.

The generated `index.html`, `es/`, `hotels/`, `rooms/` and similar files are build output and are git-ignored. To change text, edit `site/content.js` or `site/pages.js`.

## Rosar-IA
- The prompt is built from `site/content.js` (see `site/knowledge.js`), so the bot always matches the site.
- The model is Claude Opus 5.5. The function uses `ANTHROPIC_API_KEY` if that environment variable is set in Vercel. Otherwise it goes through the Vercel AI Gateway with the deployment's OIDC token, so no key is needed.
- The chat widget keeps the conversation in `sessionStorage`. The server keeps the last 20 messages and caps each one at 1,500 characters.
