// Single source of truth for the site AND for Rosar-IA's knowledge.
// Every fact here comes from gruporosario.com or @hotelesrosariobolivia.

export const LANGS = ['en', 'es'];

export const ROUTES = {
  home: { en: '/', es: '/es/' },
  titicaca: { en: '/hotels/lago-titicaca/', es: '/es/hoteles/lago-titicaca/' },
  uyuni: { en: '/hotels/uyuni/', es: '/es/hoteles/uyuni/' },
  sur: { en: '/hotels/la-paz-sur/', es: '/es/hoteles/la-paz-sur/' },
  centro: { en: '/hotels/la-paz-centro/', es: '/es/hoteles/la-paz-centro/' },
  rooms: { en: '/rooms/', es: '/es/habitaciones/' },
  dining: { en: '/dining/', es: '/es/gastronomia/' },
  offers: { en: '/offers/', es: '/es/ofertas/' },
  gallery: { en: '/gallery/', es: '/es/galeria/' },
  contact: { en: '/contact/', es: '/es/contacto/' },
  book: { en: '/book/', es: '/es/reservar/' },
};

// WhatsApp numbers that receive booking requests, per hotel (digits only, for wa.me).
export const WHATSAPP_BOOKING = { titicaca: '59176254988', uyuni: '59177006375', sur: '59176254988', centro: '59176254988', default: '59176254988' };

export const CONTACT = {
  phone: '+591 7625 4988',
  tel: '+59176254988',
  email: 'reservas@gruporosario.travel',
  whatsapp: 'https://wa.me/59176254988',
  office: { en: '16 de Calacoto Street, corner of Los Sauces Avenue No. 20, La Paz', es: 'Calle 16 de Calacoto esq. Av. Los Sauces Nº 20, La Paz' },
  instagram: 'https://www.instagram.com/hotelesrosariobolivia/',
  facebook: 'https://www.facebook.com/hotel.rosario',
  youtube: 'https://www.youtube.com/channel/UCDe9UGszt67UJluKoqZREgQ/',
};

export const bookingUrl = (id, extra = '') =>
  `https://www.gruporosario.com/en/reservations/?action=c_1&hotel_id=${id}&guide_id=910${extra}`;

const L = (en, es) => ({ en, es });

export const HOTELS = [
  {
    id: 'titicaca',
    bookingId: '3338',
    name: 'Lago Titicaca',
    collection: 'Collection',
    fullName: 'Hotel Rosario Lago Titicaca Collection',
    stars: 4,
    place: L('Copacabana · Lake Titicaca', 'Copacabana · Lago Titicaca'),
    altitude: '3,812 m',
    coords: '16.17° S · 69.09° W',
    status: 'open',
    phone: '+591 6700 9227',
    tel: '+59167009227',
    whatsapp: 'https://wa.link/1fnnfa',
    address: L('Av. Costanera, corner of Rigoberto Paredes, Copacabana', 'Av. Costanera esq. Rigoberto Paredes, Copacabana'),
    maps: 'https://www.google.com/maps/search/?api=1&query=Hotel+Rosario+Lago+Titicaca+Copacabana',
    hero: 'tt-panorama',
    card: 'tt-arches',
    thumbs: ['tt-room-lake', 'tt-night'],
    tagline: L('On the shore of the highest navigable lake on earth.', 'A orillas del lago navegable más alto del mundo.'),
    lead: L(
      'A four-star retreat with personality and cultural identity, set right on the shore of Lake Titicaca in Copacabana. Arched terraces, garden blocks and balconies turned to the water, and no two rooms dressed alike.',
      'Un refugio de cuatro estrellas con personalidad e identidad cultural, a orillas del Lago Titicaca en Copacabana. Terrazas con arcos, bloques entre jardines y balcones abiertos al agua, y ninguna habitación decorada igual que otra.'
    ),
    body: L(
      'Every space carries exquisite Andean décor, the charm that only Rosario has. Our team is at your disposal for a warm, memorable stay. Beyond our walls you can walk the town with a guide or cross to the ancient ruins of Isla del Sol.',
      'Cada espacio luce una exquisita decoración andina, el encanto propio de Rosario. Nuestro equipo está a tu disposición para que la estadía sea cálida y memorable. Fuera del hotel puedes recorrer el pueblo con guía o cruzar a las ruinas ancestrales de la Isla del Sol.'
    ),
    highlights: [
      L('Balconies with panoramic lake views', 'Balcones con vista panorámica al lago'),
      L('Themed rooms: Cholitas, Chuspas, Lluchus, Soles, Muñecos', 'Habitaciones temáticas: Cholitas, Chuspas, Lluchus, Soles, Muñecos'),
      L('Restaurant beneath the lake-view arches', 'Restaurante bajo los arcos con vista al lago'),
      L('Guided walks and trips to Isla del Sol', 'Caminatas guiadas y visitas a la Isla del Sol'),
    ],
    services: [
      L('Breakfast included', 'Desayuno incluido'),
      L('Restaurant', 'Restaurante'),
      L('Complimentary herbal teas', 'Infusiones de cortesía'),
      L('Parking (15 spaces)', 'Parqueo (15 espacios)'),
      L('Luggage storage', 'Guardaequipaje'),
      L('Taxi service (fee applies)', 'Servicio de taxi (con costo)'),
      L('Laundry (fee applies)', 'Lavandería (con costo)'),
      L('Pet friendly (fee applies)', 'Acepta mascotas (con costo)'),
    ],
    rooms: [
      { name: L('Room · Two Queen Beds', 'Habitación · Dos camas Queen'), img: 'tt-r-two-queen', view: L('Calvario and partial lake view', 'Vista al Calvario y parcial al lago'), where: L('Garden Block', 'Bloque Jardín'), desc: L('A spacious room with Andean-inspired décor looking out to the Calvario hill.', 'Amplia habitación con decoración de inspiración andina, mirando al cerro Calvario.') },
      { name: L('Standard Double Room', 'Habitación Doble Estándar'), img: 'th-chuspas', view: L('Lake view from the living area', 'Vista al lago desde la sala'), where: L('Garden Block', 'Bloque Jardín'), desc: L('Comfortable and bright, with the typical decoration of the Andean region.', 'Cómoda y luminosa, con la decoración típica de la región andina.') },
      { name: L('Premium Room · 1 King Bed', 'Habitación Premium · 1 cama King'), img: 'tt-r-premium-king', view: L('Panoramic lake view from the balcony', 'Vista panorámica al lago desde el balcón'), where: L('Main Block, floors 1–3', 'Bloque Principal, pisos 1–3'), desc: L('Wake up with the whole bay of Copacabana in front of you.', 'Despierta con toda la bahía de Copacabana frente a ti.') },
      { name: L('Premium Room · Two Queen Beds', 'Habitación Premium · Dos camas Queen'), img: 'tt-r-premium-two-queen', view: L('Panoramic lake view from the balcony', 'Vista panorámica al lago desde el balcón'), where: L('Main Block, floors 1–3', 'Bloque Principal, pisos 1–3'), desc: L('Room for friends or family, and a balcony for everyone.', 'Espacio para amigos o familia, y un balcón para todos.') },
      { name: L('Premium Triple · Three Twin Beds', 'Triple Premium · Tres camas Twin'), img: 'th-munecos', view: L('Panoramic lake view from the balcony', 'Vista panorámica al lago desde el balcón'), where: L('Main Block, floors 2–3', 'Bloque Principal, pisos 2–3'), desc: L('Three beds, hand-sewn Andean dolls and the lake on the other side of the glass.', 'Tres camas, muñecos andinos cosidos a mano y el lago al otro lado del vidrio.') },
      { name: L('King Suite', 'Suite King'), img: 'tt-r-king-suite', view: L('Lake view from a small living room', 'Vista al lago desde una pequeña sala'), where: L('Garden Block, private access', 'Bloque Jardín, acceso privado'), desc: L('A reserved location with its own entrance, made for couples.', 'Una ubicación reservada con entrada propia, pensada para parejas.') },
      { name: L('Junior Suite · Two Bedrooms', 'Junior Suite · Dos dormitorios'), img: 'tt-r-junior', view: L('Lake view from the living-room balcony', 'Vista al lago desde el balcón de la sala'), where: L('Main Block, end of 1st floor', 'Bloque Principal, final del 1er piso'), desc: L('Two bedrooms and a shared living room opening onto the lake.', 'Dos dormitorios y una sala común abierta al lago.') },
      { name: L('Family Suite · Two Bedrooms', 'Suite Familiar · Dos dormitorios'), img: 'th-antique', view: L('Lake view from bedrooms and living room', 'Vista al lago desde dormitorios y sala'), where: L('Main Block, 2nd floor mezzanine', 'Bloque Principal, mezanine del 2º piso'), desc: L('Reached by a wooden spiral staircase, with the lake in every room.', 'Se llega por una escalera caracol de madera, con el lago en cada ambiente.') },
      { name: L('Cottage Suite · Two Bedrooms', 'Suite Cabaña · Dos dormitorios'), img: 'th-cabana', view: L('Lake view', 'Vista al lago'), where: L('Garden Block', 'Bloque Jardín'), desc: L('Two duplex rooms reached from a shared living room, under timber beams.', 'Dos habitaciones dúplex con acceso desde la sala, bajo vigas de madera.') },
      { name: L('Deluxe Suite · Jacuzzi & Terrace', 'Suite Deluxe · Jacuzzi y Terraza'), img: 'th-deluxe', view: L('Exceptional lake view from the terrace', 'Vista excepcional al lago desde la terraza'), where: L('Main Block, 2nd floor', 'Bloque Principal, 2º piso'), desc: L('Two bedrooms, a large living room and terrace, and a circular jacuzzi facing a wide window.', 'Dos dormitorios, sala amplia con terraza y un jacuzzi circular frente a un gran ventanal.') },
    ],
    gallery: ['tt-hero', 'tt-terrace', 'tt-arches', 'tt-night', 'tt-aerial', 'tt-restaurant', 'tt-lobby', 'tt-room-lake', 'th-soles', 'th-lluchus', 'th-cholitas'],
    gettingHere: [
      L('From La Paz: any tourist transport reaches Copacabana. We recommend the daily shared service of Turisbus (WhatsApp +591 7896 5638), which can also arrange private transfers from El Alto airport or the city.', 'Desde La Paz: cualquier transporte turístico llega a Copacabana. Recomendamos el servicio compartido diario de Turisbus (WhatsApp +591 7896 5638), que también organiza traslados privados desde el aeropuerto de El Alto o la ciudad.'),
      L('From Puno (Peru): take tourist transport from the Puno bus station.', 'Desde Puno (Perú): toma transporte turístico desde la terminal de buses de Puno.'),
      L('Already in Copacabana: walk along Av. 16 de Julio to Rigoberto Paredes and go half a block down towards the beach, or take a taxi from the main square (about Bs 10).', 'Ya en Copacabana: camina por la Av. 16 de Julio hasta la calle Rigoberto Paredes y baja media cuadra hacia la playa, o toma un taxi desde la plaza principal (aprox. Bs 10).'),
    ],
  },
  {
    id: 'uyuni',
    bookingId: '3454',
    name: 'Uyuni',
    collection: 'Collection',
    fullName: 'Hotel Rosario Uyuni Collection',
    stars: 4,
    place: L('Uyuni · Gateway to the Salar', 'Uyuni · Puerta del Salar'),
    altitude: '3,656 m',
    coords: '20.46° S · 66.83° W',
    status: 'open',
    phone: '+591 7700 6375',
    tel: '+59177006375',
    whatsapp: 'https://wa.me/59177006375',
    address: L('Av. Arce, corner of Fernando Alonzo, Uyuni', 'Av. Arce esq. Fernando Alonzo, Uyuni'),
    maps: 'https://www.google.com/maps?q=-20.4585101+-66.8299016',
    hero: 'uy-hero',
    card: 'uy-hero',
    thumbs: ['uy-room-sunset', 'uy-restaurant'],
    tagline: L('A themed eco-hotel at the edge of the largest salt flat on earth.', 'Un eco-hotel temático al borde del salar más grande del mundo.'),
    lead: L(
      'A themed eco-hotel in Uyuni that reflects the richness of Andean culture and the traditions of the Altiplano. 44 rooms with underfloor heating keep you warm through the desert night.',
      'Un eco-hotel temático en Uyuni que refleja la riqueza de la cultura andina y las tradiciones del Altiplano. 44 habitaciones con calefacción por piso radiante te mantienen abrigado durante la noche del desierto.'
    ),
    body: L(
      'Solar panels supply our energy, out of respect for the purity of the Salar. Round off the day in our high-end restaurant, designed for good food and rest after hours on the white.',
      'Paneles solares abastecen nuestra energía, por respeto a la pureza del Salar. Cierra el día en nuestro restaurante de alto nivel, pensado para comer bien y descansar después de horas sobre el blanco.'
    ),
    highlights: [
      L('44 rooms with underfloor heating', '44 habitaciones con piso radiante'),
      L('Solar-powered, eco-friendly building', 'Edificio ecológico con energía solar'),
      L('High-end restaurant and buffet breakfast', 'Restaurante de alto nivel y desayuno buffet'),
      L('5–10 minutes from Uyuni airport', 'A 5–10 minutos del aeropuerto de Uyuni'),
    ],
    services: [
      L('Buffet breakfast included', 'Desayuno buffet incluido'),
      L('Free Wi-Fi', 'Wi-Fi gratuito'),
      L('Free luggage storage', 'Guardaequipaje gratuito'),
      L('Free parking for guests', 'Parqueo gratuito para huéspedes'),
      L('Taxi service (at cost)', 'Servicio de taxi (con costo)'),
      L('Laundry (at cost)', 'Lavandería (con costo)'),
    ],
    rooms: [
      { name: L('Single Room', 'Habitación Simple'), img: 'uy-r-single', size: '24 m²', beds: L('1 Queen bed', '1 cama Queen'), view: L('Street / interior', 'Calle / interior'), where: L('Floors 2–3', 'Pisos 2–3'), desc: L('Made for the solo traveller: aguayo touches in the lamps and paintings, a walk-in shower and a reading corner by the window.', 'Pensada para quien viaja solo: toques de aguayo en lámparas y cuadros, ducha walk-in y un rincón junto a la ventana.') },
      { name: L('Double Room · Two Queen Beds', 'Habitación Doble · Dos camas Queen'), img: 'uy-room-sunset', size: '32 m²', beds: L('2 Queen beds', '2 camas Queen'), view: L('Street / interior', 'Calle / interior'), where: L('Floors 1–3', 'Pisos 1–3'), desc: L('Sleeps up to four, with décor inspired by regional textiles and a small living area.', 'Hasta cuatro personas, con decoración inspirada en textiles de la región y una pequeña sala.') },
      { name: L('King Room', 'Habitación King'), img: 'uy-r-king', size: '32 m²', beds: L('1 King bed (180×200 cm)', '1 cama King (180×200 cm)'), view: L('Street / city', 'Calle / ciudad'), where: L('Floors 1–3', 'Pisos 1–3'), desc: L('For couples: aguayo woven into art and lighting, a king-size bed and a corner to unwind.', 'Para parejas: aguayo tejido en arte e iluminación, cama king y un rincón para relajarse.') },
    ],
    gallery: ['uy-hero', 'uy-gate', 'uy-dusk', 'uy-deco', 'uy-room-light', 'uy-room', 'uy-restaurant', 'uy-breakfast', 'uy-dessert', 'uy-r-single'],
    gettingHere: [
      L('From Joya Andina airport (UYU): only 5–10 minutes away. Take a certified taxi, or request our private transfer by sending your flight details to reservas@gruporosario.travel.', 'Desde el aeropuerto Joya Andina (UYU): a solo 5–10 minutos. Toma un taxi certificado o solicita nuestro traslado privado enviando tus datos de vuelo a reservas@gruporosario.travel.'),
      L('From the bus terminal: under 5 minutes by taxi, or a 15–20 minute walk depending on your luggage.', 'Desde la terminal de buses: menos de 5 minutos en taxi, o 15–20 minutos a pie según tu equipaje.'),
      L('By car: head to the centre, to the corner of Av. Progreso and Calle Fernando Alonzo. Parking is free for guests.', 'En auto: dirígete al centro, a la esquina de Av. Progreso y Calle Fernando Alonzo. Parqueo gratuito para huéspedes.'),
    ],
    offers: [
      { title: L('Last minute · 10% off', 'Último minuto · 10% de descuento'), text: L('For stays within the next 5 days. Non-refundable; payment via the link in your confirmation.', 'Para viajes dentro de los próximos 5 días. No reembolsable; pago mediante el enlace de tu confirmación.') },
      { title: L('Long stay (3+ nights) · 20% off', 'Estadía larga (3+ noches) · 20% de descuento'), text: L('Minimum three nights. Non-refundable; pay right after booking.', 'Mínimo tres noches. No reembolsable; pago inmediato tras reservar.') },
      { title: L('Prepaid savings · 20% off', 'Ahorro prepago · 20% de descuento'), text: L('Lock in the lowest price with full payment today.', 'Asegura el mejor precio con el pago total hoy.') },
      { title: L('Flexible rate · 5% off', 'Tarifa flexible · 5% de descuento'), text: L('Free cancellation up to 14 days before check-in.', 'Cancelación gratuita hasta 14 días antes del check-in.') },
    ],
  },
  {
    id: 'sur',
    bookingId: '3337',
    name: 'La Paz Sur',
    collection: 'Collection',
    fullName: 'Hotel Boutique Rosario La Paz Sur Collection',
    stars: 4,
    place: L('La Paz · Calacoto, South Zone', 'La Paz · Calacoto, Zona Sur'),
    altitude: '3,300 m',
    coords: '16.54° S · 68.08° W',
    status: 'open',
    phone: '+591 6700 9964',
    tel: '+59167009964',
    whatsapp: 'https://wa.me/59176254988',
    address: L('Calle 16 de Calacoto, corner of Av. Los Sauces No. 20, La Paz', 'Calle 16 de Calacoto esq. Av. Los Sauces Nº 20, La Paz'),
    maps: 'https://www.google.com/maps/search/?api=1&query=Hotel+Boutique+Rosario+Sur+Calacoto+La+Paz',
    hero: 'sur-view',
    card: 'sur-city',
    thumbs: ['sur-suite', 'sur-hero'],
    tagline: L('A nine-storey tower in the warm, quiet south of La Paz.', 'Una torre de nueve pisos en el sur cálido y tranquilo de La Paz.'),
    lead: L(
      'Set at 3,300 metres in the residential Calacoto district, our South Zone hotel welcomes you with peaceful streets, a milder climate and a lively open-air mall on the doorstep.',
      'A 3.300 metros, en el barrio residencial de Calacoto, nuestro hotel de la Zona Sur te recibe con calles tranquilas, un clima más templado y un animado centro comercial al aire libre a pasos de la puerta.'
    ),
    body: L(
      'Suites with kitchenettes, panoramic windows over the city and some of the best restaurants in La Paz around the corner. The Teleférico takes you uptown: Green Line to Irpavi, or the Yellow and Light Blue lines at Curva de Holguín.',
      'Suites con kitchenette, ventanales panorámicos sobre la ciudad y algunos de los mejores restaurantes de La Paz a la vuelta. El Teleférico te lleva al centro: Línea Verde hasta Irpavi, o las líneas Amarilla y Celeste en Curva de Holguín.'
    ),
    highlights: [
      L('Lower altitude and a warmer climate', 'Menor altitud y clima más templado'),
      L('Suites with kitchenettes and city views', 'Suites con kitchenette y vista a la ciudad'),
      L('Teleférico connection to the centre', 'Conexión en Teleférico al centro'),
      L('24-hour complimentary tea station', 'Estación de té de cortesía 24 horas'),
    ],
    services: [
      L('Buffet breakfast included', 'Desayuno buffet incluido'),
      L('Free Wi-Fi', 'Wi-Fi gratuito'),
      L('Free luggage storage', 'Guardaequipaje gratuito'),
      L('Complimentary 24h tea station', 'Estación de té 24h de cortesía'),
      L('Parking (subject to availability)', 'Parqueo (sujeto a disponibilidad)'),
      L('Taxi service (extra charge)', 'Servicio de taxi (costo adicional)'),
      L('Laundry (extra charge)', 'Lavandería (costo adicional)'),
    ],
    rooms: [
      { name: L('Single · Garden View', 'Simple · Vista al jardín'), img: 'sur-r-single', view: L('Garden', 'Jardín'), desc: L('A quiet room over the garden for the solo traveller.', 'Una habitación tranquila sobre el jardín para quien viaja solo.') },
      { name: L('Junior Suite · Two Queen Beds', 'Junior Suite · Dos camas Queen'), img: 'sur-r-js-queen', view: L('Garden', 'Jardín'), desc: L('Two queen beds and an Andean mountain mural.', 'Dos camas queen y un mural de montañas andinas.') },
      { name: L('Junior Suite · King', 'Junior Suite · King'), img: 'sur-r-js-king', view: L('Garden', 'Jardín'), desc: L('A king bed against a warm stone wall.', 'Cama king junto a un cálido muro de piedra.') },
      { name: L('Deluxe Junior Suite · King', 'Junior Suite Deluxe · King'), img: 'sur-r-deluxe-king', view: L('City', 'Ciudad'), desc: L('Wide windows over La Paz and a wall of hanging chuspas.', 'Grandes ventanales sobre La Paz y una pared de chuspas colgantes.') },
      { name: L('Deluxe Junior Suite · Two Queen Beds', 'Junior Suite Deluxe · Dos camas Queen'), img: 'sur-room', view: L('Panoramic', 'Panorámica'), desc: L('Floor-to-ceiling glass and the whole valley in view.', 'Vidrio de piso a techo y todo el valle a la vista.') },
      { name: L('Superior Suite · King', 'Suite Superior · King'), img: 'sur-r-superior-king', view: L('City · kitchenette', 'Ciudad · kitchenette'), desc: L('Space to settle in, with a kitchenette for longer stays.', 'Espacio para quedarse, con kitchenette para estadías largas.') },
      { name: L('Superior Double Suite · Two Queen Beds', 'Suite Superior Doble · Dos camas Queen'), img: 'sur-r-superior-double', view: L('City · kitchenette', 'Ciudad · kitchenette'), desc: L('Two queen beds, a sitting area by the window and a kitchenette.', 'Dos camas queen, sala junto a la ventana y kitchenette.') },
      { name: L('Matrimonial Suite · Jacuzzi & Terrace', 'Suite Matrimonial · Jacuzzi y Terraza'), img: 'sur-r-matrimonial', view: L('Terrace', 'Terraza'), desc: L('Our most romantic room, with its own jacuzzi and terrace.', 'Nuestra habitación más romántica, con jacuzzi y terraza propios.') },
    ],
    gallery: ['sur-hero', 'sur-city', 'sur-suite', 'sur-tower', 'sur-room', 'sur-r-js-queen', 'sur-r-matrimonial'],
    gettingHere: [
      L('From El Alto airport: take an official airport taxi (Bs 90–100, about USD 13–15), or ask us to arrange a driver waiting at arrivals with your name (Bs 150 for 1–4 people).', 'Desde el aeropuerto de El Alto: toma un taxi oficial (Bs 90–100, aprox. USD 13–15) o pídenos un conductor que te espere en llegadas con tu nombre (Bs 150 para 1–4 personas).'),
      L('We do not recommend minibuses: they leave you five long blocks from the hotel.', 'No recomendamos minibuses: te dejan a cinco cuadras largas del hotel.'),
      L('From the bus terminal: take a radio taxi with the company name and phone on the roof (Bs 40–50).', 'Desde la terminal de buses: toma un radio taxi con el nombre y teléfono de la empresa en el techo (Bs 40–50).'),
      L('By Teleférico: Green Line to Irpavi station, or Curva de Holguín on the Yellow and Light Blue lines.', 'En Teleférico: Línea Verde hasta la estación Irpavi, o Curva de Holguín en las líneas Amarilla y Celeste.'),
    ],
  },
  {
    id: 'centro',
    bookingId: '3337',
    name: 'La Paz Centro',
    collection: 'Classic',
    fullName: 'Hotel Rosario La Paz Centro Classic',
    stars: 3,
    place: L('La Paz · Historic centre, Av. Illampu', 'La Paz · Centro histórico, Av. Illampu'),
    altitude: '3,640 m',
    coords: '16.50° S · 68.14° W',
    status: 'closed',
    phone: '+591 6700 5551',
    tel: '+59167005551',
    whatsapp: 'https://wa.me/59176254988',
    address: L('Av. Illampu 704, between Aroma and Graneros, La Paz', 'Av. Illampu 704, entre Aroma y Graneros, La Paz'),
    maps: 'https://www.google.com/maps/search/?api=1&query=Av.+Illampu+704+La+Paz+Bolivia',
    hero: 'lp-room2',
    card: 'lp-room2',
    thumbs: ['lp-room', 'amenities'],
    tagline: L('The house where it all began, now being renewed.', 'La casa donde todo empezó, hoy en renovación.'),
    lead: L(
      'In the vibrant heart of La Paz, our original house blends comfort and tradition: exclusive décor in every room and sunny interior patios that offer a calm escape from the city.',
      'En el corazón vibrante de La Paz, nuestra casa original combina comodidad y tradición: decoración exclusiva en cada habitación y soleados patios interiores que ofrecen un respiro de la ciudad.'
    ),
    body: L(
      'We are temporarily closed for a full infrastructure renovation, with the goal of reopening at a higher rating. Until then, stay at Hotel Boutique Rosario Sur with a 10% voucher and free Teleférico rides from the South Zone to the centre and back. It is quieter, warmer, lower, and surrounded by excellent restaurants.',
      'Estamos temporalmente cerrados por obras integrales de infraestructura, con el objetivo de reabrir con una categoría mayor. Mientras tanto, hospédate en el Hotel Boutique Rosario Sur con un voucher del 10% y Teleférico gratuito de la Zona Sur al centro, ida y vuelta. Es más tranquilo, más templado, de menor altitud y rodeado de excelentes restaurantes.'
    ),
    highlights: [
      L('Historic centre, steps from the markets', 'Centro histórico, a pasos de los mercados'),
      L('Sunny interior patios', 'Soleados patios interiores'),
      L('Reopening after a full renovation', 'Reapertura tras una renovación integral'),
      L('10% voucher at Rosario Sur meanwhile', 'Voucher de 10% en Rosario Sur mientras tanto'),
    ],
    services: [],
    rooms: [],
    gallery: ['lp-room', 'lp-room2', 'amenities'],
    gettingHere: [
      L('From El Alto airport: an official airport taxi costs Bs 70–80 (about USD 10–12).', 'Desde el aeropuerto de El Alto: un taxi oficial cuesta Bs 70–80 (aprox. USD 10–12).'),
      L('From the bus terminal: about 15 minutes by radio taxi (Bs 15–20).', 'Desde la terminal de buses: unos 15 minutos en radio taxi (Bs 15–20).'),
    ],
  },
];

export const hotel = (id) => HOTELS.find((h) => h.id === id);

export const THEMED = [
  { name: 'Cholitas', img: 'th-cholitas', house: 'Titicaca', note: L('For the Aymara women of the highlands, with their bowler hats and layered polleras.', 'Por las mujeres aymaras del altiplano, con su sombrero bombín y sus polleras.') },
  { name: 'Chuspas', img: 'th-chuspas', house: 'Titicaca', note: L('The small woven pouch that carries coca leaves, hung in rows above the bed.', 'La pequeña bolsa tejida para llevar hojas de coca, colgada en filas sobre la cama.') },
  { name: 'Lluchus', img: 'th-lluchus', house: 'Titicaca', note: L('The knitted, ear-flapped hat of the Andes, in every colour of the market.', 'El gorro tejido con orejeras de los Andes, en todos los colores del mercado.') },
  { name: 'Soles', img: 'th-soles', house: 'Titicaca', note: L('Carved sun discs for Inti, who rises every morning over the lake.', 'Discos solares tallados para el Inti, que sale cada mañana sobre el lago.') },
  { name: 'Muñecos', img: 'th-munecos', house: 'Titicaca', note: L('Hand-sewn Andean dolls keep watch from their niches.', 'Muñecos andinos cosidos a mano vigilan desde sus nichos.') },
  { name: 'Cabaña', img: 'th-cabana', house: 'Titicaca', note: L('A two-bedroom duplex cottage in the garden, under timber beams.', 'Una cabaña dúplex de dos dormitorios en el jardín, bajo vigas de madera.') },
  { name: 'Aguayo', img: 'uy-room-light', house: 'Uyuni', note: L('Altiplano textiles woven into lamps and art, with heated floors underfoot.', 'Textiles del altiplano tejidos en lámparas y arte, con piso radiante bajo los pies.') },
];

export const OFFERS = [
  {
    hotel: 'titicaca', img: 'tt-room',
    title: L('Wake up over the lake', 'Despierta sobre el lago'),
    sub: L('Premium Double Room with lake view', 'Habitación Doble Premium con vista al lago'),
    price: 'US$100',
    url: bookingUrl('3338', '&price_group=2147483648'),
    cta: L('Book this room', 'Reservar esta habitación'),
  },
  {
    hotel: 'titicaca', img: 'tt-night',
    title: L('Lake escape, half board', 'Escapada al lago, media pensión'),
    sub: L('Three days and two nights in Copacabana with dinner included and the lake out of the window.', 'Tres días y dos noches en Copacabana con cena incluida y el lago en la ventana.'),
    url: 'https://wa.link/1fnnfa',
    cta: L('Ask on WhatsApp', 'Consultar por WhatsApp'),
  },
  {
    hotel: 'sur', img: 'sur-city',
    title: L('Centro guests, come south', 'Huéspedes del Centro, vengan al sur'),
    sub: L('While La Paz Centro is being renovated: a 10% voucher at Rosario Sur plus free Teleférico rides to the centre and back.', 'Mientras renovamos La Paz Centro: un voucher de 10% en Rosario Sur y Teleférico gratis al centro, ida y vuelta.'),
    url: bookingUrl('3337'),
    cta: L('Get the voucher', 'Obtener el voucher'),
  },
];

export const FAQ = [
  { q: L('How do I book?', '¿Cómo reservo?'), a: L('Use “Book” on any page to check live availability on our official booking engine, or write to reservas@gruporosario.travel or WhatsApp +591 7625 4988.', 'Usa “Reservar” en cualquier página para ver disponibilidad en nuestro motor oficial, o escribe a reservas@gruporosario.travel o al WhatsApp +591 7625 4988.') },
  { q: L('Is breakfast included?', '¿El desayuno está incluido?'), a: L('Yes. Breakfast is included at all our open hotels; Uyuni and La Paz Sur serve a buffet.', 'Sí. El desayuno está incluido en todos nuestros hoteles abiertos; Uyuni y La Paz Sur sirven buffet.') },
  { q: L('Can you pick me up at the airport?', '¿Pueden recogerme en el aeropuerto?'), a: L('In Uyuni we offer a private transfer on request. In La Paz we can arrange a driver waiting with your name. For Copacabana, Turisbus runs shared and private transfers from La Paz.', 'En Uyuni ofrecemos traslado privado a solicitud. En La Paz podemos coordinar un conductor que te espere con tu nombre. Para Copacabana, Turisbus ofrece traslados compartidos y privados desde La Paz.') },
  { q: L('Is there parking?', '¿Hay parqueo?'), a: L('Yes: free for guests in Uyuni, 15 spaces in Copacabana, and subject to availability in La Paz Sur.', 'Sí: gratuito para huéspedes en Uyuni, 15 espacios en Copacabana y sujeto a disponibilidad en La Paz Sur.') },
  { q: L('Do you accept pets?', '¿Aceptan mascotas?'), a: L('Hotel Rosario Lago Titicaca is pet friendly (a fee applies). Contact us for the other hotels.', 'El Hotel Rosario Lago Titicaca acepta mascotas (con costo). Consúltanos por los demás hoteles.') },
  { q: L('Is La Paz Centro open?', '¿Está abierto La Paz Centro?'), a: L('It is temporarily closed for renovation. Meanwhile we offer a 10% voucher at Rosario Sur with free Teleférico rides to the centre.', 'Está cerrado temporalmente por renovación. Mientras tanto ofrecemos un voucher de 10% en Rosario Sur con Teleférico gratis al centro.') },
];

// UI strings
export const T = {
  en: {
    nav: { hotels: 'Hotels', rooms: 'Rooms', dining: 'Dining', offers: 'Offers', gallery: 'Gallery', contact: 'Contact', book: 'Book', menu: 'Menu', home: 'Home' },
    skip: 'Skip to content',
    langName: 'English', otherLang: 'ES', otherLangName: 'Español',
    book: { title: 'Plan your stay', destination: 'Destination', arrive: 'Arrive', depart: 'Depart', guests: 'Guests', submit: 'Check availability', error: 'Your departure date needs to be after your arrival date.' },
    reserve: 'Reserve', reserveAt: 'Reserve at', discover: 'Discover the hotel', altitude: 'Altitude', position: 'Position', status: 'Status', underRenovation: 'Under renovation', reopening: 'Reopening',
    roomsTitle: 'Rooms & suites', services: 'Services', gettingHere: 'Getting here', openMaps: 'Open in Google Maps', gallery: 'Gallery', offersTitle: 'Offers', nextHotel: 'Next hotel', size: 'Size', beds: 'Beds', view: 'View', location: 'Location', call: 'Call', whatsapp: 'WhatsApp', email: 'Email',
    footer: { cta: 'Your room is <em>waiting</em>.', bookDirect: 'Book direct', office: 'Central reservations', social: 'Social', languages: 'Languages', rights: 'Hoteles Rosario, Bolivia' },
    from: 'from',
  },
  es: {
    nav: { hotels: 'Hoteles', rooms: 'Habitaciones', dining: 'Gastronomía', offers: 'Ofertas', gallery: 'Galería', contact: 'Contacto', book: 'Reservar', menu: 'Menú', home: 'Inicio' },
    skip: 'Ir al contenido',
    langName: 'Español', otherLang: 'EN', otherLangName: 'English',
    book: { title: 'Planifica tu estadía', destination: 'Destino', arrive: 'Llegada', depart: 'Salida', guests: 'Huéspedes', submit: 'Ver disponibilidad', error: 'La fecha de salida debe ser posterior a la de llegada.' },
    reserve: 'Reservar', reserveAt: 'Reservar en', discover: 'Conocer el hotel', altitude: 'Altitud', position: 'Ubicación', status: 'Estado', underRenovation: 'En renovación', reopening: 'Reapertura',
    roomsTitle: 'Habitaciones y suites', services: 'Servicios', gettingHere: 'Cómo llegar', openMaps: 'Abrir en Google Maps', gallery: 'Galería', offersTitle: 'Ofertas', nextHotel: 'Siguiente hotel', size: 'Tamaño', beds: 'Camas', view: 'Vista', location: 'Ubicación', call: 'Llamar', whatsapp: 'WhatsApp', email: 'Correo',
    footer: { cta: 'Tu habitación te <em>espera</em>.', bookDirect: 'Reserva directa', office: 'Reservas centrales', social: 'Redes', languages: 'Idiomas', rights: 'Hoteles Rosario, Bolivia' },
    from: 'desde',
  },
};
