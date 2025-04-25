import { IonButton, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { locationOutline, calendarOutline } from "ionicons/icons";
import "./Compra.css";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// Generador de fechas
const obtenerFechas = () => {
  const hoy = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(hoy.getDate() + i);
    const dia = fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" });
    const nombre = i === 0 ? "Hoy" : fecha.toLocaleDateString("es-MX", { weekday: "long" });
    return {
      dia,
      nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
    };
  });
};

// 🕐 Horarios disponibles
const horas = [
  "09:00 am - 12:00 pm",
  "12:00 pm - 15:00 pm",
  "15:00 pm - 18:00 pm",
];

const PasoFechaHoraDireccion: React.FC<Props> = ({ onNext, onBack }) => {
  const fechas = obtenerFechas();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechas[0].dia);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"domicilio" | "recoger">("domicilio");

  useEffect(() => {
    const tipo = localStorage.getItem("tipo_entrega");
    setTipoEntrega(tipo === "recoger" ? "recoger" : "domicilio");
  }, [window.location.search]);

  return (
    <div className="pantalla-compra">
      <h2 className="titulo-pantalla">
        {tipoEntrega === "domicilio"
          ? "Ingresa fecha, hora y dirección para la entrega"
          : "Hora y día para recoger la compra"}
      </h2>

      {/* Fecha y hora */}
      <div className="selector-fecha-hora">
        <div className="subtitulos">
          <IonIcon icon={calendarOutline} style={{ fontSize: 22, marginRight: 8 }} />
          <h3>Selecciona fecha y hora</h3>
        </div>

        <div className="dias">
          {fechas.map((f) => (
            <button
              key={f.dia}
              className={fechaSeleccionada === f.dia ? "activo" : ""}
              onClick={() => setFechaSeleccionada(f.dia)}
            >
              <div>{f.dia}</div>
              <small>{f.nombre}</small>
            </button>
          ))}
        </div>

        <div className="horarios">
          {horas.map((hora, i) => (
            <label key={`hora-${i}`} className="hora-opcion">
              <input
                type="radio"
                name="hora"
                id={`hora-${i}`}
                value={hora}
                checked={horaSeleccionada === hora}
                onChange={() => setHoraSeleccionada(hora)}
              />
       <span className="texto-hora">
  <span className="hora">{hora}</span>
  {tipoEntrega === "domicilio" && <span className="precio-extra">+ $45.00</span>}
</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dirección */}
      <div className="direccion-box">
        <div className="subtitulos">
          <IonIcon icon={locationOutline} style={{ fontSize: "22px" }} />
          <span className="direccion-label">
            {tipoEntrega === "domicilio" ? "Dirección" : "Dirección de tienda"}
          </span>
        </div>

        <p style={{ margin: 0 }}>
          <strong>{tipoEntrega === "domicilio" ? "Ubicación actual" : "Dirección:"}</strong>{' '}
          {tipoEntrega === "domicilio"
            ? "C. Gambusinos #8, col Monserrat. Capulálpam, Oax 68760. Méx"
            : "C. 5 de febrero, num 29, Col centro, Oaxaca, 35567. Méx"}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
  <button className="btn-verdee">
    {tipoEntrega === "domicilio" ? "Cambiar ubicación" : "Ver ubicación"}
  </button>
</div>
      </div>

      {/* Botón continuar */}
      <div className="footer-boton">
        <IonButton expand="block"  className="btn-rojoo" onClick={onNext}>
          CONTINUAR
        </IonButton>
      </div>
    </div>
  );
};

export default PasoFechaHoraDireccion;
