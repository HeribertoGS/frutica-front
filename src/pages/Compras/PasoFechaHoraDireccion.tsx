import { IonButton, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { locationOutline, calendarOutline } from "ionicons/icons";
import { obtenerDireccionPredeterminada, obtenerDireccionPublica } from "../../service/api";
import "./Compra.css";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const horas = [
  "09:00 am - 12:00 pm",
  "12:00 pm - 15:00 pm",
  "15:00 pm - 18:00 pm",
];

const PasoFechaHoraDireccion: React.FC<Props> = ({ onNext, onBack }) => {
  const history = useHistory();
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"domicilio" | "recoger">("domicilio");
  const [direccionActual, setDireccionActual] = useState<string>("");
  const [mapsUrl, setMapsUrl] = useState<string>("");

  useEffect(() => {
    const cargarDatos = async () => {
      const tipo = localStorage.getItem("tipo_entrega");
      setTipoEntrega(tipo === "recoger" ? "recoger" : "domicilio");

      try {
        if (tipo === "recoger") {
          const dir = await obtenerDireccionPublica();
          const direccionCompleta = `${dir.calle} ${dir.numero}, ${dir.colonia}, ${dir.municipio}, ${dir.estado}, CP ${dir.cp}`;
          setDireccionActual(direccionCompleta);
          localStorage.setItem("direccion_id", dir.direccion_k.toString());
          localStorage.setItem("direccion_texto", direccionCompleta);
          setMapsUrl(dir.maps_url || "");
        } else {
          const dir = await obtenerDireccionPredeterminada();
          const direccionCompleta = `${dir.calle} ${dir.numero}, ${dir.colonia}, ${dir.municipio}, ${dir.estado}, CP ${dir.cp}`;
          setDireccionActual(direccionCompleta);
          localStorage.setItem("direccion_id", dir.direccion_k.toString());
          localStorage.setItem("direccion_texto", direccionCompleta);
        }
      } catch (error) {
        console.error("Error cargando dirección", error);
      }
    };

    const hoy = new Date();
    const fechaISO = hoy.toISOString().split('T')[0];
    setFechaSeleccionada(fechaISO);

    cargarDatos();
  }, []);

  const seleccionarFechaHora = () => {
    localStorage.setItem('fecha_entrega', fechaSeleccionada);
    localStorage.setItem('hora_entrega', horaSeleccionada);
    onNext();
  };

  const cambiarUbicacion = () => {
    localStorage.setItem('volver_a_compra', 'true');
    window.location.href = '/direcciones?origen=compra';
  };

  const verUbicacionMapa = () => {
    if (mapsUrl) {
      window.open(mapsUrl, '_blank');
    }
  };

  const obtenerFechas = () => {
    const hoy = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      return fecha.toISOString().split('T')[0];
    });
  };

  return (
    <div className="pantalla-compra">
      <h2 className="titulo-pantalla">
        {tipoEntrega === "domicilio" ? "Fecha, hora y dirección para entrega" : "Fecha y hora para recoger"}
      </h2>

      <div className="selector-fecha-hora">
        <div className="subtitulos">
          <IonIcon icon={calendarOutline} style={{ fontSize: 22, marginRight: 8 }} />
          <h3>Selecciona fecha y hora</h3>
        </div>

        <div className="dias">
          {obtenerFechas().map((fecha) => (
            <button
              key={fecha}
              className={fechaSeleccionada === fecha ? "activo" : ""}
              onClick={() => setFechaSeleccionada(fecha)}
            >
              <div>{fecha}</div>
            </button>
          ))}
        </div>

        <div className="horarios">
          {horas.map((hora, i) => (
            <label key={i} className="hora-opcion">
              <input
                type="radio"
                name="hora"
                value={hora}
                checked={horaSeleccionada === hora}
                onChange={() => setHoraSeleccionada(hora)}
              />
              <span>{hora}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="direccion-box">
        <div className="subtitulos">
          <IonIcon icon={locationOutline} style={{ fontSize: "22px" }} />
          <span>{tipoEntrega === "domicilio" ? "Dirección de entrega" : "Dirección del local"}</span>
        </div>
        <p><strong>{direccionActual}</strong></p>

        {tipoEntrega === "domicilio" ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-verdee" onClick={cambiarUbicacion}>
              Cambiar ubicación
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn-verdee" onClick={verUbicacionMapa}>
              Ver ubicación
            </button>
          </div>
        )}
      </div>

      <div className="footer-boton">
        <IonButton expand="block" className="btn-rojoo" onClick={seleccionarFechaHora}>
          CONTINUAR
        </IonButton>
      </div>
    </div>
  );
};

export default PasoFechaHoraDireccion;
