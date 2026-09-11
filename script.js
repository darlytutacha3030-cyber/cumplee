/* =====================================================
   LISTA DE MENSAJES, IMÁGENES Y GIF
===================================================== */

const premios = [
  {
    tipo: "texto",
    texto: "Me encanta que podamos reírnos de las mismas cosas cuando vemos películas o lo que sea es algo simple, pero me gusta demasiado."
  },
  {
    tipo: "texto",
    texto: "¿Te acuerdas de aquella vez que dormimos en llamada y pusiste música clásica? JAJAJA. No sé por qué, pero ese momento se me quedó guardado. ❤️"
  },
  {
    tipo: "texto",
    texto: "Tus patacones siguen siendo de los mejores que he probado y espero seguir probándolos por mucho tiempo más."
  },
  {
    tipo: "texto",
    texto: "No necesito hacer nada especial contigo. Simplemente estar juntos me hace sentir demasiado feliz."
  },
  {
    tipo: "texto",
    texto: "Me sorprende muchísimo que en tan poco tiempo hayas llegado a ser una persona tan importante para mí. Te quiero muchísimo."
  },
  {
    tipo: "texto",
    texto: "Ahora que estás lejos me doy cuenta de cuánto me gusta tenerte cerca y poder abrazarlo."
  },
  {
    tipo: "texto",
    texto: "Extraño todo de ti mi vida y ya quiero volver a verte."
  },
  {
    tipo: "texto",
    texto: "Primero te creo algo y despues te hackeo precioso jsjsj."
  },
  {
    tipo: "texto",
    texto: "Nunca te he dicho nada de esto, pero espero que entiendas que te amo mucho. ¡FELIZ CUMPLEAÑOS, MI PRECIOSO!"
  },
  {
    tipo: "texto",
    texto: "Te extraño mucho, pero espero que sepas lo mucho que te quiero y se lo demuestro asi."
  },
  {
    tipo: "gif",
    texto: "❤️",
    archivo: "assets/sorpresa1.gif"
  },
  {
    tipo: "gif",
    texto: "🎁",
    archivo: "assets/sorpresa2.gif"
  }
];


/* =====================================================
   ELEMENTOS DE LA PÁGINA
===================================================== */

const perilla = document.getElementById("perilla");
const salida = document.getElementById("salida");
const capsulaSalida = document.getElementById("capsulaSalida");

const modal = document.getElementById("modal");
const mensaje = document.getElementById("mensaje");
const imagenPremio = document.getElementById("imagenPremio");

const cerrarMensaje = document.getElementById("cerrarMensaje");
const cerrarX = document.getElementById("cerrarX");
const textoGirar = document.querySelector(".texto-girar");


/* =====================================================
   VARIABLES DE CONTROL
===================================================== */

let maquinaOcupada = false;
let ordenPendiente = [];
let ultimoIndice = -1;


/* =====================================================
   MEZCLAR PREMIOS ALEATORIAMENTE
===================================================== */

function mezclarPremios() {
  const indices = premios.map((premio, indice) => indice);

  for (let i = indices.length - 1; i > 0; i--) {
    const posicionAleatoria = Math.floor(
      Math.random() * (i + 1)
    );

    [indices[i], indices[posicionAleatoria]] =
      [indices[posicionAleatoria], indices[i]];
  }

  /*
    Evita que el último premio de una ronda sea igual
    al primer premio de la ronda siguiente.
  */

  if (
    indices.length > 1 &&
    indices[0] === ultimoIndice
  ) {
    [indices[0], indices[1]] =
      [indices[1], indices[0]];
  }

  ordenPendiente = indices;
}


/* =====================================================
   SELECCIONAR UN PREMIO SIN REPETIR
===================================================== */

function seleccionarPremio() {
  if (ordenPendiente.length === 0) {
    mezclarPremios();
  }

  const indiceSeleccionado = ordenPendiente.shift();

  ultimoIndice = indiceSeleccionado;

  return premios[indiceSeleccionado];
}


/* =====================================================
   SONIDOS DE LA MÁQUINA
===================================================== */

function reproducirSonido(
  frecuencia,
  duracion,
  tipo = "sine"
) {
  const AudioContext =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const contexto = new AudioContext();
  const oscilador = contexto.createOscillator();
  const volumen = contexto.createGain();

  oscilador.type = tipo;

  oscilador.frequency.setValueAtTime(
    frecuencia,
    contexto.currentTime
  );

  volumen.gain.setValueAtTime(
    0.08,
    contexto.currentTime
  );

  volumen.gain.exponentialRampToValueAtTime(
    0.001,
    contexto.currentTime + duracion
  );

  oscilador.connect(volumen);
  volumen.connect(contexto.destination);

  oscilador.start();
  oscilador.stop(contexto.currentTime + duracion);
}


/* =====================================================
   GIRAR LA PERILLA
===================================================== */

perilla.addEventListener("click", () => {
  if (maquinaOcupada) {
    return;
  }

  maquinaOcupada = true;
  perilla.disabled = true;
  salida.disabled = true;

  textoGirar.textContent = "GIRANDO...";

  perilla.classList.remove("girando");
  capsulaSalida.classList.remove("cayendo");

  /*
    Fuerza al navegador a reiniciar las animaciones.
  */

  void perilla.offsetWidth;

  perilla.classList.add("girando");

  reproducirSonido(260, 0.12, "square");

  setTimeout(() => {
    reproducirSonido(310, 0.1, "square");
  }, 250);

  setTimeout(() => {
    reproducirSonido(360, 0.1, "square");
  }, 500);

  /*
    Hacer caer la cápsula.
  */

  setTimeout(() => {
    capsulaSalida.classList.add("cayendo");

    reproducirSonido(
      130,
      0.3,
      "triangle"
    );
  }, 950);

  /*
    Permitir abrir la cápsula.
  */

  setTimeout(() => {
    salida.disabled = false;

    textoGirar.textContent =
      "TOCA LA CÁPSULA";
  }, 1750);
});


/* =====================================================
   ABRIR LA CÁPSULA Y MOSTRAR EL PREMIO
===================================================== */

salida.addEventListener("click", () => {
  if (salida.disabled) {
    return;
  }

  const premioSeleccionado = seleccionarPremio();

  mensaje.textContent = premioSeleccionado.texto;

  if (
    premioSeleccionado.tipo === "gif" ||
    premioSeleccionado.tipo === "imagen"
  ) {
    imagenPremio.hidden = false;
    imagenPremio.alt = premioSeleccionado.texto;

    /*
      Date.now() permite reiniciar el GIF cada vez
      que vuelva a aparecer.
    */

    imagenPremio.src =
      premioSeleccionado.archivo +
      "?v=" +
      Date.now();
  } else {
    imagenPremio.hidden = true;
    imagenPremio.removeAttribute("src");
  }

  modal.classList.add("visible");
  modal.setAttribute("aria-hidden", "false");

  reproducirSonido(520, 0.18);
});


/* =====================================================
   MOSTRAR ERROR SI EL GIF NO SE ENCUENTRA
===================================================== */

imagenPremio.addEventListener("error", () => {
  const rutaIncorrecta = imagenPremio.getAttribute("src");

  imagenPremio.hidden = true;
  imagenPremio.removeAttribute("src");

  mensaje.textContent =
    "No se pudo cargar el GIF. Revisa esta ruta: " +
    rutaIncorrecta;
});


/* =====================================================
   CERRAR LA VENTANA Y REINICIAR LA MÁQUINA
===================================================== */

function cerrarVentana() {
  modal.classList.remove("visible");
  modal.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    imagenPremio.hidden = true;
    imagenPremio.removeAttribute("src");

    capsulaSalida.classList.remove("cayendo");
    perilla.classList.remove("girando");

    perilla.disabled = false;
    salida.disabled = true;

    maquinaOcupada = false;

    textoGirar.textContent =
      "TOCA PARA GIRAR";
  }, 350);
}


/* =====================================================
   BOTONES PARA CERRAR
===================================================== */

cerrarMensaje.addEventListener(
  "click",
  cerrarVentana
);

cerrarX.addEventListener(
  "click",
  cerrarVentana
);


/* =====================================================
   CERRAR AL PRESIONAR FUERA DE LA TARJETA
===================================================== */

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    cerrarVentana();
  }
});


/* =====================================================
   CERRAR CON LA TECLA ESCAPE
===================================================== */

document.addEventListener("keydown", (evento) => {
  if (
    evento.key === "Escape" &&
    modal.classList.contains("visible")
  ) {
    cerrarVentana();
  }
});