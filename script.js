const cancionesClancy = [
  "Overcompensate",
  "Next Semester",
  "Backslide",
  "Midwest Indigo",
  "Routines In the Night",
  "Vignette",
  "The Craving (Jenna’s Version)",
  "Lavish",
  "Navigating",
  "Snap Back",
  "Oldies Station",
  "At the Risk of Feeling Dumb",
  "Paladin Strait",
];

const longitudMax = 2;
const visorNumeros = document.querySelector(".visor-numeros");
const columnaCanciones = document.querySelector(".columna-canciones");
const entradaNumero = document.querySelector(".entrada-numero");
const botonInicio = document.querySelector(".boton-inicio");

let estaContando = false;

const duracionAnimacion = 600;
const pausaEntrePasos = 1;

const inicializar = () => {
  visorNumeros.innerHTML = "";
  for (let i = 0; i < longitudMax; i++) {
    const col = document.createElement("section");
    col.className = "columna-numero";
    col.style.setProperty("--indice", 0);
    for (let j = 0; j <= 10; j++) {
      const span = document.createElement("span");
      span.className = "digito";
      span.textContent = j % 10;
      col.appendChild(span);
    }
    visorNumeros.appendChild(col);
  }

  columnaCanciones.innerHTML = "";
  cancionesClancy.forEach((pista) => {
    const section = document.createElement("section");
    section.className = "item-cancion";
    section.textContent = pista;
    columnaCanciones.appendChild(section);
  });
};

const actualizarTodo = async (valor, animar = true) => {
  const valorTexto = valor.toString().padStart(longitudMax, "0");
  const columnasNum = document.querySelectorAll(".columna-numero");

  const estiloTransicion = animar
    ? `translate ${duracionAnimacion}ms cubic-bezier(0.4, 0, 0.2, 1)`
    : "none";

  columnasNum.forEach((col, indice) => {
    const nuevoDigito = parseInt(valorTexto[indice]);
    const posicionActual =
      parseFloat(col.style.getPropertyValue("--indice")) || 0;

    if (animar && nuevoDigito === 0 && posicionActual === 9) {
      col.style.transition = estiloTransicion;
      col.style.setProperty("--indice", 10);
      setTimeout(() => {
        col.style.transition = "none";
        col.style.setProperty("--indice", 0);
      }, duracionAnimacion);
    } else {
      col.style.transition = estiloTransicion;
      col.style.setProperty("--indice", nuevoDigito);
    }
  });

  const indiceCancion = Math.max(0, valor - 1);
  columnaCanciones.style.transition = estiloTransicion;
  columnaCanciones.style.setProperty("--indice", indiceCancion);

  if (animar) {
    await new Promise((resolver) => setTimeout(resolver, duracionAnimacion));
  }
};

const iniciarConteo = async () => {
  if (estaContando) return;

  const objetivo = Math.min(
    parseInt(entradaNumero.value) || 1,
    cancionesClancy.length,
  );

  estaContando = true;
  botonInicio.disabled = true;

  await actualizarTodo(1, false);

  for (let i = 1; i <= objetivo; i++) {
    await actualizarTodo(i, true);
    let retrasoDinamico = pausaEntrePasos;

    const faltan = objetivo - i;
    if (faltan <= 5 && objetivo > 1) {
      retrasoDinamico = pausaEntrePasos + (5 - faltan) * 120;
    }

    await new Promise((resolver) => setTimeout(resolver, retrasoDinamico));
  }

  estaContando = false;
  botonInicio.disabled = false;
};

botonInicio.addEventListener("click", iniciarConteo);

inicializar();
actualizarTodo(1, false);

const UI = {
  superior: {
    fechaElemento: document.querySelector(".f-superior"),
    diaElemento: document.querySelector(".d-superior"),
    horaElemento: document.querySelector(".h-superior"),
    esMilitar: true,
    adelantoHoras: 1,
  },
  centro: {
    fechaElemento: document.querySelector(".f-centro"),
    diaElemento: document.querySelector(".d-centro"),
    horaElemento: document.querySelector(".h-centro"),
    esMilitar: true,
    adelantoHoras: 0,
  },
  inferior: {
    fechaElemento: document.querySelector(".f-inferior"),
    diaElemento: document.querySelector(".d-inferior"),
    horaElemento: document.querySelector(".h-inferior"),
    esMilitar: true,
    adelantoHoras: 0,
  },
  contador: {
    elemento: document.querySelector(".contador"),
    valor: -1, // El contador vive aquí
  },
  fechaLargaElemento: document.querySelector(".fecha-completa"),
};

class Fecha {
  constructor(base, adelantoHoras = 0) {
    this.objetoFecha = new Date(base.getTime() + adelantoHoras * 3600000);
  }

  obtenerHoraMinutoSegundo = (esMilitar) => {
    let horas = this.objetoFecha.getHours();
    const ampm = !esMilitar ? (horas >= 12 ? " PM" : " AM") : "";
    if (!esMilitar) horas = horas % 12 || 12;

    const [hh, mm, ss] = [
      horas,
      this.objetoFecha.getMinutes(),
      this.objetoFecha.getSeconds(),
    ].map((numero) => String(numero).padStart(2, "0"));

    return `${hh}:${mm}:${ss}${ampm}`;
  };

  obtenerFechaCorta = () => {
    const dia = String(this.objetoFecha.getDate()).padStart(2, "0");
    const mes = String(this.objetoFecha.getMonth() + 1).padStart(2, "0");
    const anio = this.objetoFecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  obtenerDiaSemanaCorto = () => {
    let textoDia = this.objetoFecha.toLocaleDateString("es-ES", {
      weekday: "short",
    });
    textoDia = textoDia.replace(".", "");
    return textoDia.charAt(0).toUpperCase() + textoDia.slice(1, 3);
  };

  obtenerFechaLarga = () => {
    const inicioAnio = new Date(this.objetoFecha.getFullYear(), 0, 1);
    const numeroSemana = String(
      Math.ceil(
        (Math.floor((this.objetoFecha - inicioAnio) / 86400000) +
          inicioAnio.getDay() +
          1) /
          7,
      ),
    ).padStart(2, "0");

    let fechaTexto = this.objetoFecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Capitalizar meses (ej. "de Enero")
    fechaTexto = fechaTexto.replace(
      /de (\w)/g,
      (match, p1) => `de ${p1.toUpperCase()}`,
    );
    const resultadoFinal =
      fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);

    return `${resultadoFinal} - Semana ${numeroSemana}`;
  };
}

const ejecutarRenderizacion = () => {
  const ahora = new Date();

  // 1. Actualizar Contador (Suma 1 cada segundo)
  if (UI.contador.elemento && UI.contador.valor < 22) {
    UI.contador.valor++;
    UI.contador.elemento.textContent = String(UI.contador.valor).padStart(
      2,
      "0",
    );
  }

  // 2. Renderizar los 3 relojes (Corregido el array)
  [UI.superior, UI.centro, UI.inferior].forEach((reloj) => {
    const instanciaFecha = new Fecha(ahora, reloj.adelantoHoras);

    if (reloj.fechaElemento)
      reloj.fechaElemento.textContent = instanciaFecha.obtenerFechaCorta();
    if (reloj.diaElemento)
      reloj.diaElemento.textContent = instanciaFecha.obtenerDiaSemanaCorto();
    if (reloj.horaElemento)
      reloj.horaElemento.textContent = instanciaFecha.obtenerHoraMinutoSegundo(
        reloj.esMilitar,
      );
  });

  // 3. Fecha completa inferior
  if (UI.fechaLargaElemento) {
    UI.fechaLargaElemento.textContent = new Fecha(ahora).obtenerFechaLarga();
  }
};

// Eventos de click para cambiar formato 12h/24h
[UI.superior, UI.centro, UI.inferior].forEach((reloj) => {
  if (reloj.horaElemento) {
    reloj.horaElemento.style.cursor = "pointer";
    reloj.horaElemento.onclick = () => {
      reloj.esMilitar = !reloj.esMilitar;
      ejecutarRenderizacion(); // Refrescar al instante
    };
  }
});

// Iniciar ciclo
ejecutarRenderizacion();
setInterval(ejecutarRenderizacion, 1000);
