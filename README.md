# Hoteles Rosario — website

The new marketing site for Hoteles Rosario: Lago Titicaca, Uyuni, La Paz Sur and La Paz Centro. See [PLAN.md](PLAN.md) for the audit of the current site, the creative direction and the open items.

**Stack:** Vite, GSAP 3.15 (ScrollTrigger and SplitText), Lenis smooth scroll, and Three.js for the hero shader. The site is plain HTML/CSS/JS with no framework.

```bash
npm install
npm run dev      # local dev server
npm run build    # static build into dist/
npm run preview  # serve the build
```

`dist/` can be deployed to any static host (Vercel, Netlify, or the current server).

## Media
- `public/media/img` holds hotel photography from gruporosario.com, re-encoded to WebP at 960 and 2000 px.
- `public/media/video` holds reels from @hotelesrosariobolivia, re-encoded to H.264 with posters.
- `public/media/ig` holds Instagram post images used in the marquee.

## Booking
Every "Reserve" and "Book" link points to the official Bookassist reservation pages (`hotel_id` 3338 Titicaca, 3454 Uyuni, 3337 La Paz Sur). The booking bar also sends `date_in`, `nights` and `adults`. Confirm those parameter names with Bookassist.
