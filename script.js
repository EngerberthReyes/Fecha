const UI = {
  superior: {
    fechaElemento: document.querySelector(".f-superior"),
    diaElemento: document.querySelector(".d-superior"),
    horaElemento: document.querySelector(".h-superior"),
    esMilitar: true,
    adelantoHoras: 1,
  },
  inferior: {
    fechaElemento: document.querySelector(".f-inferior"),
    diaElemento: document.querySelector(".d-inferior"),
    horaElemento: document.querySelector(".h-inferior"),
    esMilitar: true,
    adelantoHoras: 0,
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
    const textoDia = this.objetoFecha
      .toLocaleDateString("es-ES", { weekday: "short" })
      .replace(".", "");
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

    const partes = fechaTexto.split(" de ");
    if (partes.length > 1) {
      partes[1] = partes[1].charAt(0).toUpperCase() + partes[1].slice(1);
      fechaTexto = partes.join(" de ");
    }

    const resultadoFinal =
      fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);

    return `${resultadoFinal} - Semana ${numeroSemana}`;
  };
}

const ejecutarRenderizacion = () => {
  const ahora = new Date();

  [UI.superior, UI.inferior].forEach((reloj) => {
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

  if (UI.fechaLargaElemento) {
    UI.fechaLargaElemento.textContent = new Fecha(ahora).obtenerFechaLarga();
  }
};

[UI.superior, UI.inferior].forEach((reloj) => {
  if (reloj.horaElemento) {
    reloj.horaElemento.style.cursor = "pointer";
    reloj.horaElemento.onclick = () => {
      reloj.esMilitar = !reloj.esMilitar;
      ejecutarRenderizacion();
    };
  }
});

ejecutarRenderizacion();
setInterval(ejecutarRenderizacion, 1000);
