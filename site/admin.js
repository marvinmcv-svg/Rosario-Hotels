import { HOTELS } from './content.js';
import { esc } from './layout.js';

/** Staff portal shell. Everything inside is rendered by src/admin.js after login. */
export function adminPage() {
  const hotels = HOTELS.map((h) => ({ id: h.id, name: h.name, full: h.fullName, status: h.status, rooms: h.rooms.map((r) => r.name.en) }));
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Admin — Hoteles Rosario</title>
  <link rel="icon" type="image/png" href="/media/favicon.png" />
</head>
<body class="adm">
  <div class="adm-login" data-login hidden>
    <form class="adm-login__card" data-login-form>
      <svg class="mark" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg>
      <h1>Hoteles Rosario</h1>
      <p data-i="loginSub">Portal de administración</p>
      <label><span data-i="password">Contraseña</span><input type="password" name="password" autocomplete="current-password" required autofocus /></label>
      <button class="abtn abtn--solid" type="submit" data-i="signIn">Entrar</button>
      <p class="adm-err" role="alert" data-login-err></p>
    </form>
  </div>

  <div class="adm-app" data-app hidden>
    <header class="adm-top">
      <a class="adm-brand" href="/" target="_blank" rel="noopener"><svg class="mark" viewBox="-1 -1 43 37" data-mark aria-hidden="true"></svg><span>Rosario <em>Admin</em></span></a>
      <nav class="adm-tabs" role="tablist">
        <button role="tab" aria-selected="true" data-view="bookings" data-i="bookings">Reservas</button>
        <button role="tab" aria-selected="false" data-view="arrivals" data-i="arrivals">Llegadas</button>
      </nav>
      <div class="adm-top__end">
        <button class="abtn abtn--ghost" type="button" data-lang-toggle>EN</button>
        <button class="abtn abtn--ghost" type="button" data-refresh data-i="refresh">Actualizar</button>
        <button class="abtn abtn--solid" type="button" data-new data-i="newBooking">Nueva reserva</button>
        <button class="abtn abtn--ghost" type="button" data-logout data-i="logout">Salir</button>
      </div>
    </header>

    <main class="adm-main">
      <section class="adm-stats" data-stats aria-live="polite"></section>

      <section data-panel="bookings">
        <div class="adm-filters">
          <input type="search" placeholder="Buscar: nombre, código, teléfono…" data-i-ph="search" data-f="q" />
          <div class="adm-seg" data-f-status></div>
          <select data-f="hotel"><option value="" data-i="allHotels">Todos los hoteles</option>${hotels.map((h) => `<option value="${h.id}">${esc(h.name)}</option>`).join('')}</select>
          <select data-f="channel"><option value="" data-i="allChannels">Todos los canales</option></select>
          <button class="abtn abtn--ghost" type="button" data-export data-i="export">Exportar CSV</button>
        </div>
        <div class="adm-tablewrap">
          <table class="adm-table">
            <thead><tr>
              <th data-i="ref">Código</th><th data-i="guest">Huésped</th><th data-i="hotel">Hotel</th><th data-i="dates">Fechas</th><th data-i="guests">Pax</th><th data-i="channel">Canal</th><th data-i="status">Estado</th><th data-i="received">Recibida</th>
            </tr></thead>
            <tbody data-rows></tbody>
          </table>
          <p class="adm-empty" data-empty hidden></p>
        </div>
      </section>

      <section data-panel="arrivals" hidden>
        <div class="adm-arrivals" data-arrivals></div>
      </section>
    </main>
  </div>

  <dialog class="adm-drawer" data-drawer><div data-drawer-body></div></dialog>

  <dialog class="adm-modal" data-modal>
    <form method="dialog" class="adm-form" data-new-form>
      <header><h2 data-i="newBooking">Nueva reserva</h2><button class="abtn abtn--ghost" value="cancel" formnovalidate aria-label="Close">✕</button></header>
      <div class="adm-grid">
        <label><span data-i="hotel">Hotel</span><select name="hotel" required data-new-hotel>${hotels.map((h) => `<option value="${h.id}">${esc(h.name)}</option>`).join('')}</select></label>
        <label><span data-i="room">Habitación</span><select name="room" data-new-room></select></label>
        <label><span data-i="checkIn">Llegada</span><input type="date" name="checkIn" required /></label>
        <label><span data-i="checkOut">Salida</span><input type="date" name="checkOut" required /></label>
        <label><span data-i="adults">Adultos</span><input type="number" name="adults" min="1" max="12" value="2" /></label>
        <label><span data-i="children">Niños</span><input type="number" name="children" min="0" max="8" value="0" /></label>
        <label><span data-i="name">Nombre</span><input name="name" required /></label>
        <label><span data-i="phone">Teléfono / WhatsApp</span><input name="phone" type="tel" /></label>
        <label><span data-i="email">Correo</span><input name="email" type="email" /></label>
        <label><span data-i="country">País</span><input name="country" /></label>
        <label><span data-i="channel">Canal</span><select name="channel"><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option><option value="walk_in">Walk-in</option><option value="email">Email</option><option value="web">Web</option></select></label>
        <label><span data-i="status">Estado</span><select name="status"><option value="pending">pending</option><option value="confirmed">confirmed</option></select></label>
        <label class="adm-grid__full"><span data-i="notes">Notas</span><textarea name="notes" rows="3"></textarea></label>
      </div>
      <p class="adm-err" role="alert" data-new-err></p>
      <footer><button class="abtn abtn--solid" value="save" data-i="save">Guardar</button></footer>
    </form>
  </dialog>

  <div class="adm-toast" role="status" data-toast hidden></div>
  <script type="application/json" id="adm-data">${JSON.stringify({ hotels }).replace(/</g, '\\u003c')}</script>
  <script type="module" src="/src/admin.js"></script>
</body>
</html>
`;
}
