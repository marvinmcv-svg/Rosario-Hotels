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

## Booking system (prototype)
- **Guests** book at `/book/` (EN) or `/es/reservar/` (ES). The page shows live availability and an estimated price per room type (`/api/availability`), then sends the request online or on WhatsApp (`/api/bookings`). The server re-checks inventory, so a room can't be double-booked.
- **Inventory:** every room type has a number of units, a nightly rate and a maximum number of guests. Bookings that are `pending`, `confirmed` or `checked_in` hold a unit for each night they cover. The defaults are sample values; the owner sets the real ones in Admin → Settings.
- **Admin** at `/admin/`, signing in with a username and password:
  - The `admin` owner account uses the password in the `ADMIN_PASSWORD` environment variable until the owner changes it in Settings.
  - Owners manage rates, notifications and users. Staff manage bookings.
  - Views: Bookings, Arrivals, a Calendar (occupancy per room type per night) and Settings.
- **Email** is sent through [Resend](https://resend.com):
  - Set `RESEND_API_KEY` (and optionally `NOTIFY_FROM`) in Vercel. Staff recipients are set in Admin → Settings, or with `STAFF_EMAILS`.
  - Staff get an email for every new request. Guests get one when their booking is confirmed.
- **Storage:** bookings, settings and users are JSON files in a private Vercel Blob store. Move them to Postgres or Supabase before real traffic, because Blob writes aren't transactional.
