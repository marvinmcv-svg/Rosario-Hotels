# Hoteles Rosario — Website Rebuild Plan

Planned with the Karpathy guidelines (think first, keep it simple, change only what's needed, set checks you can verify) and the Impeccable design principles (Persuade mode, a craft floor, no template look).

## 1. What the current site gets wrong (gruporosario.com/en)

| Area | Today | Effect |
|---|---|---|
| Identity | A generic Bookassist template. The `<title>` says "Hotel Rosario La Paz" and all alt text says "Main Office Booking Department" | It reads as a booking widget, not a hotel brand, and the SEO signals are wrong |
| Story | 4 hotels in 4 identical text-and-carousel blocks | Copacabana, the Salar and La Paz all look the same |
| Imagery | Excellent photography squeezed into 864×648 carousels | The best thing the group owns goes unseen |
| Hierarchy | A closure notice for La Paz Centro is the first thing visitors read | It opens with bad news |
| Craft | Themed rooms (Cholitas, Chuspas, Lluchus, Soles, Muñecos) are never named on the homepage | The group's real differentiator is hidden |
| Social | Instagram is a footer icon, and it links to an old handle | Reels and promotions never reach site visitors |
| Conversion | A datepicker modal and a "See more" that goes to a truncated Bookassist URL | Getting to a booking takes extra steps |

## 2. Content that carries over (product truth)

- **4-star thematic eco hotels.** Handcrafted Andean detail and personal service.
- **Rosario Lago Titicaca Collection.** Copacabana, on the lake shore. Arched terraces, garden blocks, themed rooms, restaurant, trips to Isla del Sol. Booking `hotel_id=3338`. From US$100 for a Premium Double with lake view.
- **Rosario Uyuni Collection.** The gateway to the Salar. 44 rooms, underfloor heating, solar panels, high-end restaurant, buffet breakfast. `hotel_id=3454`.
- **Rosario La Paz Sur Collection.** Calacoto, 3,300 m. A nine-storey tower with city views and a Teleférico connection. `hotel_id=3337`.
- **Rosario La Paz Centro Classic.** Av. Illampu 704, historic centre. **Temporarily closed for renovation.** Guests are pointed to Sur with a 10% voucher and free Teleférico rides.
- Contacts, addresses, phone numbers, the reservations email, and WhatsApp booking links (taken from Instagram captions).

## 3. Creative direction — "Altiplano, handwoven"

- **Mode:** Persuade. The visitor decides and books.
- **Palette:** taken directly from the logo mark. Slate-lake blue `#6A86A3`, adobe ochre `#C9781F`, quinoa sage `#989F7E`. These sit on *Salar night* `#0E1116` (deep blue-black) and *salt* `#F2EEE6`. The page starts at night (Uyuni stars, lake dusk) and warms into daylight adobe as you scroll; GSAP animates the colour change across the whole document.
- **Type:** Bodoni Moda (variable, with optical sizes) for display. Its high contrast echoes the serif used on the brand's Instagram. Instrument Sans for body text. Both are self-hosted through Fontsource.
- **Signature motif:** the Rosario mark, vectorised from the logo onto its 41×35 grid as 8 stroked paths. It draws itself in the preloader and acts as a scroll-progress mark.
- **No AI-slop rules:** no eyebrow kickers, no icon-card grids, no gradient text, no glassmorphism, no stats-hero. Numbers appear only where they are real data: altitude, coordinates, price.

## 4. Information architecture (single long-form home)

1. **Preloader.** The mark draws stroke by stroke and a count runs to 100. The page then opens with a clip-path wipe.
2. **Hero (Three.js).** A full-bleed WebGL plane that crossfades the four houses with a liquid "salt-water" displacement shader. It responds to the cursor and the image advances on scroll or click. The headline is set with SplitText. A booking bar sits at the bottom (destination, then Bookassist).
3. **Manifesto.** The brand statement reveals word by word as you scroll.
4. **Four houses.** A pinned horizontal journey with one full panel per hotel: parallax photography, altitude and coordinates, copy and a CTA. La Paz Centro is shown honestly as "Reopening" with the Sur voucher.
5. **Rooms with a story.** An interactive list of themed rooms. Hovering a name brings up its photograph, which follows the cursor with velocity skew. On touch devices it becomes a stacked list.
6. **Filmed by us.** The 4 Instagram reels play muted in tilted vertical frames that straighten on scroll. Tapping a reel toggles sound.
7. **Table.** Tambo/restaurant and Uyuni dining photos in a clip-path expanding image sequence.
8. **The offer.** Premium Double with lake view from US$100, plus the half-board lake escape sent through WhatsApp.
9. **Instagram strip.** An infinite marquee of real posts that links to @hotelesrosariobolivia.
10. **Footer.** A huge wordmark, the 4 houses with phone numbers and addresses, the central office, and languages.

## 5. Tech

- **Vite** as a static build. It deploys to any host (Vercel, Netlify, or the current server).
- **GSAP 3.15** (ScrollTrigger and SplitText, both free now). **Lenis** handles smooth scrolling and is synced to the GSAP ticker. **Three.js** runs the hero shader.
- `prefers-reduced-motion` turns off smooth scrolling, pinning, WebGL and parallax. All content stays readable.
- Images are WebP in 2 sizes (960 and 2000) and lazy-loaded. Videos are re-encoded H.264 with faststart and posters, and play only while on screen.

## 6. Done = verified

1. `npm run build` passes with no errors. Verify: build output.
2. Playwright screenshots at 1440, 1024 and 390 wide. Verify: no overflow, readable contrast, and every section is present.
3. No console errors. Booking links resolve to the correct `hotel_id`.
4. Reduced-motion run shows all content.

## 7. Open items for the owner

- Confirm the Bookassist deep-link parameters for dates (the current site truncates them). For now the bar sends guests to each hotel's official reservations page.
- Supply original-resolution reel files. The Instagram exports are 360–720p, so they are used only in phone-sized frames.
- Spanish, German and French copy. The structure is ready for i18n.
