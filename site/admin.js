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
      <label><span data-i="username">Usuario</span><input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus /></label>
      <label><span data-i="password">Contraseña</span><input type="password" name="password" autocomplete="current-password" required /></label>
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
        <button role="tab" aria-selected="false" data-view="calendar" data-i="calendar">Calendario</button>
        <button role="tab" aria-selected="false" data-view="settings" data-i="settings">Ajustes</button>
      </nav>
      <div class="adm-top__end">
        <button class="abtn abtn--ghost" type="button" data-lang-toggle>EN</button>
        <button class="abtn abtn--ghost" type="button" data-refresh data-i="refresh">Actualizar</button>
        <button class="abtn abtn--solid" type="button" data-new data-i="newBooking">Nueva reserva</button>
        <span class="adm-user" data-whoami></span>
        <button class="abtn abtn--ghost" type="button" data-logout data-i="logout">Salir</button>
      </div>
    </header>

    <main class="adm-main">
      <p class="adm-banner" data-banner hidden></p>
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

      <section data-panel="calendar" hidden>
        <div class="adm-filters">
          <select data-cal-hotel>${hotels.filter((h) => h.rooms.length).map((h) => `<option value="${h.id}">${esc(h.name)}</option>`).join('')}</select>
          <button class="abtn" type="button" data-cal-prev>←</button>
          <input type="date" data-cal-from />
          <button class="abtn" type="button" data-cal-next>→</button>
          <span class="adm-legend"><i class="l0"></i><span data-i="free">Libre</span><i class="l1"></i><span data-i="partly">Parcial</span><i class="l2"></i><span data-i="full">Lleno</span></span>
        </div>
        <div class="adm-tablewrap" data-cal></div>
      </section>

      <section data-panel="settings" hidden>
        <div class="adm-settings">
          <article class="adm-card" data-owner-only>
            <header><h2 data-i="ratesTitle">Tarifas e inventario</h2><p data-i="ratesSub">Habitaciones disponibles, tarifa por noche (USD) y máximo de huéspedes por tipo.</p></header>
            <div data-rates></div>
            <footer><button class="abtn abtn--solid" type="button" data-save-rates data-i="saveRates">Guardar tarifas</button></footer>
          </article>
          <article class="adm-card" data-owner-only>
            <header><h2 data-i="notifyTitle">Notificaciones por correo</h2><p data-email-status></p></header>
            <label class="adm-field"><span data-i="staffEmails">Correos del personal (separados por coma)</span><input data-staff-emails placeholder="reservas@…, gerente@…" /></label>
            <label class="adm-check"><input type="checkbox" data-guest-emails /> <span data-i="guestEmails">Enviar confirmación al huésped cuando la reserva se confirma</span></label>
            <footer><button class="abtn" type="button" data-test-email data-i="testEmail">Enviar prueba</button><button class="abtn abtn--solid" type="button" data-save-notify data-i="save">Guardar</button></footer>
          </article>
          <article class="adm-card" data-owner-only>
            <header><h2 data-i="usersTitle">Usuarios</h2><p data-i="usersSub">Cuentas del personal. Los propietarios gestionan tarifas y usuarios; el personal gestiona reservas.</p></header>
            <div data-users></div>
            <form class="adm-inline" data-add-user>
              <input name="username" placeholder="usuario" autocapitalize="none" required pattern="[a-z0-9._-]{3,32}" />
              <input name="name" placeholder="Nombre" data-i-ph="fullName" />
              <select name="role"><option value="staff">staff</option><option value="owner">owner</option></select>
              <input name="password" type="password" placeholder="contraseña (8+)" minlength="8" required data-i-ph="newPw" />
              <button class="abtn abtn--solid" data-i="addUser">Agregar</button>
            </form>
          </article>
          <article class="adm-card">
            <header><h2 data-i="myPassword">Mi contraseña</h2></header>
            <form class="adm-inline" data-my-pw>
              <input name="password" type="password" minlength="8" required placeholder="nueva contraseña (8+)" data-i-ph="newPw" autocomplete="new-password" />
              <button class="abtn abtn--solid" data-i="changePw">Cambiar</button>
            </form>
          </article>
        </div>
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
        <label><span data-i="price">Precio acordado</span><input name="price" /></label>
        <label class="adm-check"><input type="checkbox" name="notify" value="1" /> <span data-i="notifyStaff">Avisar al personal por correo</span></label>
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
