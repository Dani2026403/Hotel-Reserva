/* ==========================================================
   HOTEL LUXURY PRO
   Archivo: assets/js/app.js

   Funciona abriendo index.html directamente en el navegador.
   Registro, login, perfil, reservas y favoritos se guardan
   en localStorage. Es una simulación frontend.
   ========================================================== */

const habitaciones = [
  {
    id: 1,
    numero: "101",
    tipo: "Simple",
    precio: 120000,
    capacidad: 1,
    tamano: "24 m²",
    vista: "Vista interior",
    descripcion: "Habitación cómoda para viajes cortos, con escritorio, cama sencilla y baño privado.",
    imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Wi-Fi", "TV", "Escritorio", "Baño privado"]
  },
  {
    id: 2,
    numero: "102",
    tipo: "Doble",
    precio: 180000,
    capacidad: 2,
    tamano: "32 m²",
    vista: "Vista ciudad",
    descripcion: "Espacio moderno para parejas, amigos o viajes de trabajo. Incluye cama doble y zona de descanso.",
    imagen: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Wi-Fi", "Minibar", "Aire acondicionado", "Caja fuerte"]
  },
  {
    id: 3,
    numero: "201",
    tipo: "Suite",
    precio: 350000,
    capacidad: 3,
    tamano: "48 m²",
    vista: "Vista panorámica",
    descripcion: "Suite elegante con sala privada, cama king, iluminación cálida y detalles de lujo.",
    imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop",
    amenities: ["King bed", "Sala privada", "Bañera", "Café premium"]
  },
  {
    id: 4,
    numero: "205",
    tipo: "Familiar",
    precio: 420000,
    capacidad: 5,
    tamano: "58 m²",
    vista: "Vista jardín",
    descripcion: "Habitación amplia para familias, con dos ambientes, sofá cama y espacio para niños.",
    imagen: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Dos ambientes", "Sofá cama", "Nevera", "Zona infantil"]
  },
  {
    id: 5,
    numero: "301",
    tipo: "Presidencial",
    precio: 800000,
    capacidad: 4,
    tamano: "86 m²",
    vista: "Vista premium",
    descripcion: "La habitación más exclusiva del hotel, con terraza, sala, jacuzzi y atención VIP.",
    imagen: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Jacuzzi", "Terraza", "Servicio VIP", "Sala privada"]
  },
  {
    id: 6,
    numero: "401",
    tipo: "Suite",
    precio: 560000,
    capacidad: 2,
    tamano: "54 m²",
    vista: "Vista montaña",
    descripcion: "Suite romántica con balcón, bañera y ambiente ideal para celebraciones especiales.",
    imagen: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Balcón", "Bañera", "Decoración premium", "Room service"]
  }
];

const KEYS = {
  usuarios: "hlp_usuarios",
  sesion: "hlp_sesion",
  reservas: "hlp_reservas",
  favoritos: "hlp_favoritos",
  oferta: "hlp_oferta"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const roomsGrid = $("#roomsGrid");
const reservasLista = $("#reservasLista");
const favoritosLista = $("#favoritosLista");
const toast = $("#toast");

const filtroTexto = $("#filtroTexto");
const filtroTipo = $("#filtroTipo");
const filtroPrecio = $("#filtroPrecio");
const filtroEstado = $("#filtroEstado");

const authModal = $("#authModal");
const perfilModal = $("#perfilModal");
const roomModal = $("#roomModal");
const bookingModal = $("#bookingModal");

const loginForm = $("#loginForm");
const registroForm = $("#registroForm");
const perfilForm = $("#perfilForm");
const bookingForm = $("#bookingForm");

function obtener(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function guardar(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function dinero(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);
}

function fechaActualISO() {
  return new Date().toISOString().split("T")[0];
}

function sumarDiasISO(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().split("T")[0];
}

function nochesEntre(entrada, salida) {
  const inicio = new Date(entrada);
  const fin = new Date(salida);
  return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
}

function mostrarToast(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function usuarioActual() {
  const sesion = obtener(KEYS.sesion, null);
  if (!sesion) return null;

  const usuarios = obtener(KEYS.usuarios, []);
  return usuarios.find((usuario) => usuario.id === sesion.id) || null;
}

function reservas() {
  return obtener(KEYS.reservas, []);
}

function favoritos() {
  return obtener(KEYS.favoritos, []);
}

function reservasDelUsuario() {
  const usuario = usuarioActual();
  if (!usuario) return [];

  return reservas().filter((reserva) => reserva.usuario_id === usuario.id);
}

function favoritosDelUsuario() {
  const usuario = usuarioActual();
  if (!usuario) return [];

  return favoritos().filter((favorito) => favorito.usuario_id === usuario.id);
}

function habitacionDisponible(idHabitacion) {
  return !reservas().some((reserva) => reserva.habitacion_id === idHabitacion && reserva.estado === "Confirmada");
}

function habitacionFavorita(idHabitacion) {
  return favoritosDelUsuario().some((favorito) => favorito.habitacion_id === idHabitacion);
}

function iniciales(nombre) {
  return (nombre || "Usuario")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

function abrirModal(modal) {
  modal.showModal();
}

function cerrarModal(modal) {
  modal.close();
}

function mostrarAuth(modo = "login") {
  abrirModal(authModal);
  cambiarTabAuth(modo);
}

function cambiarTabAuth(modo) {
  const esLogin = modo === "login";

  $("#tabLogin").classList.toggle("active", esLogin);
  $("#tabRegistro").classList.toggle("active", !esLogin);

  loginForm.classList.toggle("hidden", !esLogin);
  registroForm.classList.toggle("hidden", esLogin);
}

function actualizarSesionUI() {
  const usuario = usuarioActual();

  const btnLogin = $("#btnLogin");
  const btnRegistro = $("#btnRegistro");
  const profileChip = $("#profileChip");

  if (usuario) {
    btnLogin.classList.add("hidden");
    btnRegistro.classList.add("hidden");
    profileChip.classList.remove("hidden");

    $("#avatarInicial").textContent = iniciales(usuario.nombre);
    $("#nombreSesion").textContent = usuario.nombre.split(" ")[0];
  } else {
    btnLogin.classList.remove("hidden");
    btnRegistro.classList.remove("hidden");
    profileChip.classList.add("hidden");
  }
}

function registrarUsuario(event) {
  event.preventDefault();

  const usuarios = obtener(KEYS.usuarios, []);

  const email = $("#registroEmail").value.trim().toLowerCase();

  if (usuarios.some((usuario) => usuario.email === email)) {
    mostrarToast("Ya existe una cuenta con ese correo.");
    return;
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre: $("#registroNombre").value.trim(),
    email,
    telefono: $("#registroTelefono").value.trim(),
    documento: $("#registroDocumento").value.trim(),
    password: $("#registroPassword").value,
    preferencia: $("#registroPreferencia").value,
    creado_en: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  guardar(KEYS.usuarios, usuarios);
  guardar(KEYS.sesion, { id: nuevoUsuario.id });

  registroForm.reset();
  cerrarModal(authModal);
  actualizarTodo();

  mostrarToast("Cuenta creada correctamente. Ya tienes sesión iniciada.");
}

function iniciarSesion(event) {
  event.preventDefault();

  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;

  const usuarios = obtener(KEYS.usuarios, []);
  const usuario = usuarios.find((item) => item.email === email && item.password === password);

  if (!usuario) {
    mostrarToast("Correo o contraseña incorrectos.");
    return;
  }

  guardar(KEYS.sesion, { id: usuario.id });
  loginForm.reset();
  cerrarModal(authModal);
  actualizarTodo();

  mostrarToast(`Bienvenido, ${usuario.nombre.split(" ")[0]}.`);
}

function cerrarSesion() {
  localStorage.removeItem(KEYS.sesion);
  actualizarTodo();
  mostrarToast("Sesión cerrada.");
}

function abrirPerfil() {
  const usuario = usuarioActual();

  if (!usuario) {
    mostrarAuth("login");
    return;
  }

  $("#perfilAvatar").textContent = iniciales(usuario.nombre);
  $("#perfilNombreTitulo").textContent = usuario.nombre;
  $("#perfilEmailTitulo").textContent = usuario.email;

  $("#perfilNombre").value = usuario.nombre;
  $("#perfilEmail").value = usuario.email;
  $("#perfilTelefono").value = usuario.telefono;
  $("#perfilDocumento").value = usuario.documento;
  $("#perfilPreferencia").value = usuario.preferencia;

  abrirModal(perfilModal);
}

function guardarPerfil(event) {
  event.preventDefault();

  const usuario = usuarioActual();
  if (!usuario) return;

  const usuarios = obtener(KEYS.usuarios, []);
  const emailNuevo = $("#perfilEmail").value.trim().toLowerCase();

  const emailOcupado = usuarios.some((item) => item.email === emailNuevo && item.id !== usuario.id);
  if (emailOcupado) {
    mostrarToast("Ese correo ya está en uso por otro usuario.");
    return;
  }

  const actualizados = usuarios.map((item) => {
    if (item.id !== usuario.id) return item;

    return {
      ...item,
      nombre: $("#perfilNombre").value.trim(),
      email: emailNuevo,
      telefono: $("#perfilTelefono").value.trim(),
      documento: $("#perfilDocumento").value.trim(),
      preferencia: $("#perfilPreferencia").value
    };
  });

  guardar(KEYS.usuarios, actualizados);
  cerrarModal(perfilModal);
  actualizarTodo();

  mostrarToast("Perfil actualizado.");
}

function renderHabitaciones() {
  const texto = filtroTexto.value.trim().toLowerCase();
  const tipo = filtroTipo.value;
  const precioMaximo = Number(filtroPrecio.value);
  const estado = filtroEstado.value;

  const favoritosUsuario = favoritosDelUsuario().map((favorito) => favorito.habitacion_id);

  let lista = habitaciones.filter((habitacion) => {
    const disponible = habitacionDisponible(habitacion.id);
    const favorito = favoritosUsuario.includes(habitacion.id);

    const coincideTexto = `${habitacion.numero} ${habitacion.tipo} ${habitacion.descripcion} ${habitacion.vista}`
      .toLowerCase()
      .includes(texto);

    const coincideTipo = tipo === "todas" || habitacion.tipo === tipo;
    const coincidePrecio = habitacion.precio <= precioMaximo;

    const coincideEstado =
      estado === "todas" ||
      (estado === "disponibles" && disponible) ||
      (estado === "ocupadas" && !disponible) ||
      (estado === "favoritas" && favorito);

    return coincideTexto && coincideTipo && coincidePrecio && coincideEstado;
  });

  if (lista.length === 0) {
    roomsGrid.innerHTML = `
      <div class="empty-state">
        <h3>No encontramos habitaciones</h3>
        <p>Cambia los filtros o inicia sesión para ver tus favoritas.</p>
      </div>
    `;
    return;
  }

  roomsGrid.innerHTML = lista
    .map((habitacion) => {
      const disponible = habitacionDisponible(habitacion.id);
      const favorita = habitacionFavorita(habitacion.id);

      return `
        <article class="room-card">
          <div class="room-image" style="background-image: url('${habitacion.imagen}')">
            <span class="room-badge ${disponible ? "available" : "busy"}">
              ${disponible ? "Disponible" : "Ocupada"}
            </span>

            <button
              class="favorite-btn ${favorita ? "active" : ""}"
              type="button"
              onclick="toggleFavorito(${habitacion.id})"
              aria-label="Guardar favorito"
            >
              ${favorita ? "♥" : "♡"}
            </button>
          </div>

          <div class="room-content">
            <h3>Habitación ${habitacion.numero}</h3>

            <div class="room-meta">
              <span><strong>Tipo:</strong> ${habitacion.tipo}</span>
              <span><strong>Capacidad:</strong> ${habitacion.capacidad} huésped(es)</span>
              <span><strong>Vista:</strong> ${habitacion.vista}</span>
              <span>${habitacion.descripcion}</span>
            </div>

            <div class="amenities">
              ${habitacion.amenities.slice(0, 3).map((item) => `<span>${item}</span>`).join("")}
            </div>

            <div class="room-price">
              ${dinero(habitacion.precio)} <small>/ noche</small>
            </div>

            <div class="room-actions">
              <button class="btn btn-outline" type="button" onclick="verDetalleHabitacion(${habitacion.id})">
                Ver detalle
              </button>

              <button
                class="btn btn-gold"
                type="button"
                ${disponible ? "" : "disabled"}
                onclick="abrirReserva(${habitacion.id})"
              >
                Reservar
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function toggleFavorito(idHabitacion) {
  const usuario = usuarioActual();

  if (!usuario) {
    mostrarAuth("login");
    mostrarToast("Inicia sesión para guardar favoritos.");
    return;
  }

  const lista = favoritos();
  const existe = lista.some((favorito) => favorito.usuario_id === usuario.id && favorito.habitacion_id === idHabitacion);

  const nuevaLista = existe
    ? lista.filter((favorito) => !(favorito.usuario_id === usuario.id && favorito.habitacion_id === idHabitacion))
    : [...lista, { id: Date.now(), usuario_id: usuario.id, habitacion_id: idHabitacion }];

  guardar(KEYS.favoritos, nuevaLista);
  actualizarTodo();

  mostrarToast(existe ? "Habitación eliminada de favoritos." : "Habitación guardada en favoritos.");
}

function verDetalleHabitacion(idHabitacion) {
  const habitacion = habitaciones.find((item) => item.id === idHabitacion);
  if (!habitacion) return;

  const disponible = habitacionDisponible(habitacion.id);

  $("#roomDetailContent").innerHTML = `
    <div class="room-detail-grid">
      <div class="detail-image" style="background-image: url('${habitacion.imagen}')"></div>

      <div class="detail-info">
        <span class="eyebrow">Habitación ${habitacion.numero}</span>
        <h2>${habitacion.tipo}</h2>
        <p>${habitacion.descripcion}</p>

        <div class="detail-list">
          <span><strong>Precio:</strong> ${dinero(habitacion.precio)} por noche</span>
          <span><strong>Capacidad:</strong> ${habitacion.capacidad} huésped(es)</span>
          <span><strong>Tamaño:</strong> ${habitacion.tamano}</span>
          <span><strong>Vista:</strong> ${habitacion.vista}</span>
          <span><strong>Estado:</strong> ${disponible ? "Disponible" : "Ocupada"}</span>
        </div>

        <div class="amenities">
          ${habitacion.amenities.map((item) => `<span>${item}</span>`).join("")}
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" type="button" onclick="toggleFavorito(${habitacion.id})">Guardar favorito</button>
          <button
            class="btn btn-gold"
            type="button"
            ${disponible ? "" : "disabled"}
            onclick="cerrarModal(roomModal); abrirReserva(${habitacion.id})"
          >
            Reservar ahora
          </button>
        </div>
      </div>
    </div>
  `;

  abrirModal(roomModal);
}

function abrirReserva(idHabitacion) {
  const usuario = usuarioActual();

  if (!usuario) {
    mostrarAuth("login");
    mostrarToast("Primero debes iniciar sesión o registrarte.");
    return;
  }

  const habitacion = habitaciones.find((item) => item.id === idHabitacion);

  if (!habitacion || !habitacionDisponible(idHabitacion)) {
    mostrarToast("Esta habitación no está disponible.");
    return;
  }

  $("#bookingRoomId").value = habitacion.id;
  $("#bookingTitle").textContent = `Reservar habitación ${habitacion.numero}`;
  $("#bookingDescription").textContent = `${habitacion.tipo} · ${habitacion.vista} · ${dinero(habitacion.precio)} por noche`;

  $("#bookingEntrada").value = $("#busquedaEntrada").value || fechaActualISO();
  $("#bookingSalida").value = $("#busquedaSalida").value || sumarDiasISO(1);
  $("#bookingHuespedes").value = String(Math.min(habitacion.capacidad, Number($("#busquedaHuespedes").value || 1)));

  $$(".extras input[type='checkbox']").forEach((input) => {
    input.checked = false;
  });

  actualizarResumenReserva();
  abrirModal(bookingModal);
}

function actualizarResumenReserva() {
  const idHabitacion = Number($("#bookingRoomId").value);
  const habitacion = habitaciones.find((item) => item.id === idHabitacion);

  if (!habitacion) return;

  const entrada = $("#bookingEntrada").value || fechaActualISO();
  const salida = $("#bookingSalida").value || sumarDiasISO(1);
  const noches = Math.max(nochesEntre(entrada, salida), 0);

  const extrasSeleccionados = Array.from($$(".extras input[type='checkbox']:checked"));
  const totalExtras = extrasSeleccionados.reduce((total, item) => {
    const precio = Number(item.dataset.price);

    if (item.value === "Desayuno premium") {
      return total + precio * Math.max(noches, 1);
    }

    return total + precio;
  }, 0);

  const subtotal = habitacion.precio * noches;
  const impuestos = Math.round((subtotal + totalExtras) * 0.19);
  const total = subtotal + totalExtras + impuestos;

  $("#bookingSummary").innerHTML = `
    <div class="summary-row">
      <span>Habitación</span>
      <strong>${habitacion.numero} - ${habitacion.tipo}</strong>
    </div>

    <div class="summary-row">
      <span>Noches</span>
      <strong>${noches}</strong>
    </div>

    <div class="summary-row">
      <span>Hospedaje</span>
      <strong>${dinero(subtotal)}</strong>
    </div>

    <div class="summary-row">
      <span>Extras</span>
      <strong>${dinero(totalExtras)}</strong>
    </div>

    <div class="summary-row">
      <span>Impuestos estimados</span>
      <strong>${dinero(impuestos)}</strong>
    </div>

    <div class="summary-row total">
      <span>Total</span>
      <strong>${dinero(total)}</strong>
    </div>
  `;
}

function confirmarReserva(event) {
  event.preventDefault();

  const usuario = usuarioActual();

  if (!usuario) {
    mostrarAuth("login");
    return;
  }

  const idHabitacion = Number($("#bookingRoomId").value);
  const habitacion = habitaciones.find((item) => item.id === idHabitacion);

  if (!habitacion || !habitacionDisponible(idHabitacion)) {
    mostrarToast("La habitación ya no está disponible.");
    cerrarModal(bookingModal);
    actualizarTodo();
    return;
  }

  const entrada = $("#bookingEntrada").value;
  const salida = $("#bookingSalida").value;
  const noches = nochesEntre(entrada, salida);

  if (noches <= 0) {
    mostrarToast("La fecha de salida debe ser posterior a la entrada.");
    return;
  }

  const huespedes = Number($("#bookingHuespedes").value);

  if (huespedes > habitacion.capacidad) {
    mostrarToast("La cantidad de huéspedes supera la capacidad de la habitación.");
    return;
  }

  const extrasSeleccionados = Array.from($$(".extras input[type='checkbox']:checked")).map((input) => ({
    nombre: input.value,
    precio: Number(input.dataset.price)
  }));

  const totalExtras = extrasSeleccionados.reduce((total, extra) => {
    if (extra.nombre === "Desayuno premium") {
      return total + extra.precio * noches;
    }
    return total + extra.precio;
  }, 0);

  const subtotal = habitacion.precio * noches;
  const impuestos = Math.round((subtotal + totalExtras) * 0.19);
  const total = subtotal + totalExtras + impuestos;

  const nuevaReserva = {
    id: Date.now(),
    usuario_id: usuario.id,
    habitacion_id: habitacion.id,
    habitacion: {
      numero: habitacion.numero,
      tipo: habitacion.tipo,
      precio: habitacion.precio
    },
    cliente: {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      documento: usuario.documento
    },
    entrada,
    salida,
    noches,
    huespedes,
    pago: $("#bookingPago").value,
    extras: extrasSeleccionados,
    subtotal,
    impuestos,
    total,
    estado: "Confirmada",
    creada_en: new Date().toISOString()
  };

  guardar(KEYS.reservas, [...reservas(), nuevaReserva]);

  bookingForm.reset();
  cerrarModal(bookingModal);
  actualizarTodo();

  mostrarToast("Reserva confirmada correctamente.");
  location.hash = "#mis-reservas";
}

function cancelarReserva(idReserva) {
  const confirmar = confirm("¿Seguro que quieres cancelar esta reserva?");
  if (!confirmar) return;

  const nuevasReservas = reservas().map((reserva) => {
    if (reserva.id !== idReserva) return reserva;
    return { ...reserva, estado: "Cancelada" };
  });

  guardar(KEYS.reservas, nuevasReservas);
  actualizarTodo();
  mostrarToast("Reserva cancelada.");
}

function renderReservas() {
  const usuario = usuarioActual();

  $("#contadorReservas").textContent = reservasDelUsuario().length;

  if (!usuario) {
    reservasLista.innerHTML = `
      <div class="empty-state">
        <h3>Inicia sesión</h3>
        <p>Debes crear una cuenta o ingresar para ver tus reservas.</p>
      </div>
    `;
    return;
  }

  const lista = reservasDelUsuario();

  if (lista.length === 0) {
    reservasLista.innerHTML = `
      <div class="empty-state">
        <h3>No tienes reservas</h3>
        <p>Cuando confirmes una habitación, aparecerá aquí.</p>
      </div>
    `;
    return;
  }

  reservasLista.innerHTML = lista
    .slice()
    .reverse()
    .map((reserva) => {
      const extras = reserva.extras.length
        ? reserva.extras.map((extra) => extra.nombre).join(", ")
        : "Sin extras";

      return `
        <article class="list-card">
          <h4>Habitación ${reserva.habitacion.numero} · ${reserva.habitacion.tipo}</h4>
          <p><strong>Estado:</strong> ${reserva.estado}</p>
          <p><strong>Fechas:</strong> ${reserva.entrada} a ${reserva.salida} · ${reserva.noches} noche(s)</p>
          <p><strong>Huéspedes:</strong> ${reserva.huespedes}</p>
          <p><strong>Extras:</strong> ${extras}</p>
          <p><strong>Pago:</strong> ${reserva.pago}</p>
          <p><strong>Total:</strong> ${dinero(reserva.total)}</p>

          <div class="list-actions">
            ${
              reserva.estado === "Confirmada"
                ? `<button class="btn btn-danger" type="button" onclick="cancelarReserva(${reserva.id})">Cancelar reserva</button>`
                : `<button class="btn btn-outline" type="button" disabled>Reserva cancelada</button>`
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFavoritos() {
  const usuario = usuarioActual();

  const favoritosUsuario = favoritosDelUsuario();
  $("#contadorFavoritos").textContent = favoritosUsuario.length;

  if (!usuario) {
    favoritosLista.innerHTML = `
      <div class="empty-state">
        <h3>Sin sesión</h3>
        <p>Inicia sesión para guardar habitaciones favoritas.</p>
      </div>
    `;
    return;
  }

  if (favoritosUsuario.length === 0) {
    favoritosLista.innerHTML = `
      <div class="empty-state">
        <h3>No tienes favoritos</h3>
        <p>Presiona el corazón de una habitación para guardarla.</p>
      </div>
    `;
    return;
  }

  favoritosLista.innerHTML = favoritosUsuario
    .map((favorito) => habitaciones.find((habitacion) => habitacion.id === favorito.habitacion_id))
    .filter(Boolean)
    .map((habitacion) => `
      <article class="list-card">
        <h4>Habitación ${habitacion.numero}</h4>
        <p>${habitacion.tipo} · ${habitacion.vista}</p>
        <p><strong>${dinero(habitacion.precio)}</strong> por noche</p>

        <div class="list-actions">
          <button class="btn btn-outline" type="button" onclick="verDetalleHabitacion(${habitacion.id})">Ver</button>
          <button class="btn btn-gold" type="button" onclick="abrirReserva(${habitacion.id})">Reservar</button>
        </div>
      </article>
    `)
    .join("");
}

function actualizarStats() {
  const usuarios = obtener(KEYS.usuarios, []);
  const reservasActivas = reservas().filter((reserva) => reserva.estado === "Confirmada");

  $("#statHabitaciones").textContent = habitaciones.length;
  $("#statDisponibles").textContent = habitaciones.filter((habitacion) => habitacionDisponible(habitacion.id)).length;
  $("#statUsuarios").textContent = usuarios.length;
  $("#statReservas").textContent = reservasActivas.length;
}

function aplicarBusquedaRapida() {
  const huespedes = Number($("#busquedaHuespedes").value);

  filtroEstado.value = "disponibles";
  filtroPrecio.value = "99999999";
  filtroTipo.value = "todas";
  filtroTexto.value = "";

  renderHabitaciones();

  const disponibles = habitaciones.filter((habitacion) => habitacionDisponible(habitacion.id) && habitacion.capacidad >= huespedes);

  if (disponibles.length === 0) {
    mostrarToast("No encontramos habitaciones disponibles para esa cantidad de huéspedes.");
  } else {
    mostrarToast(`Encontramos ${disponibles.length} habitación(es) disponibles.`);
  }

  location.hash = "#habitaciones";
}

function aplicarOferta(nombreOferta) {
  guardar(KEYS.oferta, nombreOferta);
  filtroEstado.value = "disponibles";

  if (nombreOferta.includes("romántica")) {
    filtroTipo.value = "Suite";
  } else if (nombreOferta.includes("ejecutivo")) {
    filtroTexto.value = "business";
    filtroTipo.value = "todas";
  } else if (nombreOferta.includes("familiar")) {
    filtroTipo.value = "Familiar";
  }

  renderHabitaciones();
  mostrarToast(`Oferta aplicada: ${nombreOferta}.`);
  location.hash = "#habitaciones";
}

function exportarReservas() {
  const usuario = usuarioActual();

  if (!usuario) {
    mostrarAuth("login");
    mostrarToast("Inicia sesión para exportar tus reservas.");
    return;
  }

  const data = reservasDelUsuario();

  if (data.length === 0) {
    mostrarToast("No tienes reservas para exportar.");
    return;
  }

  const contenido = JSON.stringify(data, null, 2);
  const blob = new Blob([contenido], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "mis-reservas-hotel-luxury.json";
  enlace.click();

  URL.revokeObjectURL(url);
  mostrarToast("Reservas exportadas.");
}

function enviarContacto(event) {
  event.preventDefault();

  $("#contactForm").reset();
  mostrarToast("Mensaje enviado. Un asesor se comunicará contigo.");
}

function cargarDemoPerfil() {
  const usuarios = obtener(KEYS.usuarios, []);
  let demo = usuarios.find((usuario) => usuario.email === "demo@hotelluxury.com");

  if (!demo) {
    demo = {
      id: 1001,
      nombre: "Usuario Demo",
      email: "demo@hotelluxury.com",
      telefono: "300 000 0000",
      documento: "123456789",
      password: "1234",
      preferencia: "Vista panorámica",
      creado_en: new Date().toISOString()
    };

    guardar(KEYS.usuarios, [...usuarios, demo]);
  }

  guardar(KEYS.sesion, { id: demo.id });
  actualizarTodo();
  mostrarToast("Entraste con un perfil demo.");
}

function actualizarTodo() {
  actualizarSesionUI();
  renderHabitaciones();
  renderReservas();
  renderFavoritos();
  actualizarStats();
}

function configurarEventos() {
  $("#menuToggle").addEventListener("click", () => {
    $("#navLinks").classList.toggle("open");
  });

  $("#btnLogin").addEventListener("click", () => mostrarAuth("login"));
  $("#btnRegistro").addEventListener("click", () => mostrarAuth("registro"));
  $("#btnVerDemo").addEventListener("click", cargarDemoPerfil);
  $("#btnPerfil").addEventListener("click", abrirPerfil);
  $("#btnCerrarSesion").addEventListener("click", cerrarSesion);

  $("#tabLogin").addEventListener("click", () => cambiarTabAuth("login"));
  $("#tabRegistro").addEventListener("click", () => cambiarTabAuth("registro"));

  loginForm.addEventListener("submit", iniciarSesion);
  registroForm.addEventListener("submit", registrarUsuario);
  perfilForm.addEventListener("submit", guardarPerfil);
  bookingForm.addEventListener("submit", confirmarReserva);

  filtroTexto.addEventListener("input", renderHabitaciones);
  filtroTipo.addEventListener("change", renderHabitaciones);
  filtroPrecio.addEventListener("change", renderHabitaciones);
  filtroEstado.addEventListener("change", renderHabitaciones);

  $("#btnBuscarDisponibilidad").addEventListener("click", aplicarBusquedaRapida);
  $("#btnExportar").addEventListener("click", exportarReservas);
  $("#contactForm").addEventListener("submit", enviarContacto);

  $$("[data-close]").forEach((boton) => {
    boton.addEventListener("click", () => {
      cerrarModal($(`#${boton.dataset.close}`));
    });
  });

  $$("[data-offer]").forEach((boton) => {
    boton.addEventListener("click", () => aplicarOferta(boton.dataset.offer));
  });

  $("#bookingEntrada").addEventListener("change", actualizarResumenReserva);
  $("#bookingSalida").addEventListener("change", actualizarResumenReserva);
  $("#bookingHuespedes").addEventListener("change", actualizarResumenReserva);
  $$(".extras input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", actualizarResumenReserva);
  });
}

function iniciarApp() {
  $("#busquedaEntrada").value = fechaActualISO();
  $("#busquedaSalida").value = sumarDiasISO(1);

  configurarEventos();
  actualizarTodo();
}

window.toggleFavorito = toggleFavorito;
window.verDetalleHabitacion = verDetalleHabitacion;
window.abrirReserva = abrirReserva;
window.cancelarReserva = cancelarReserva;
window.cerrarModal = cerrarModal;
window.roomModal = roomModal;

iniciarApp();
