import { IonButton, IonModal } from "@ionic/react";
import { useEffect, useState } from "react";
import { obtenerFormasPagoActivas } from "../../service/api";
import "./Compra.css";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

interface FormaPago {
  forma_k: number;
  nombre_forma: string;
}

const PasoMetodoPago: React.FC<Props> = ({ onNext, onBack }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [metodoPagoId, setMetodoPagoId] = useState<number | null>(null);
  const [metodoPagoNombre, setMetodoPagoNombre] = useState<string>("");
  const [formasPago, setFormasPago] = useState<FormaPago[]>([]);

  useEffect(() => {
    const cargarFormasPago = async () => {
      try {
        const data = await obtenerFormasPagoActivas();
        setFormasPago(data);
      } catch (error) {
        console.error("❌ Error al cargar formas de pago:", error);
      }
    };

    const metodoGuardadoId = localStorage.getItem("forma_pago_id");
    const metodoGuardadoNombre = localStorage.getItem("forma_pago_nombre");

    if (metodoGuardadoId && metodoGuardadoNombre) {
      setMetodoPagoId(Number(metodoGuardadoId));
      setMetodoPagoNombre(metodoGuardadoNombre);
    }

    cargarFormasPago();
  }, []);

  const seleccionarMetodoPago = (forma: FormaPago) => {
    setMetodoPagoId(forma.forma_k);
    setMetodoPagoNombre(forma.nombre_forma);
    localStorage.setItem("forma_pago_id", forma.forma_k.toString());
    localStorage.setItem("forma_pago_nombre", forma.nombre_forma);
    setMostrarModal(false);
  };

  return (
    <div className="pantalla-compra">
      <h2 className="titulo-pantalla">Selecciona forma de pago</h2>

      <IonButton expand="block" onClick={() => setMostrarModal(true)} className="btn-greenstr">
        Elegir método de pago
      </IonButton>

      {metodoPagoNombre && (
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Método seleccionado: <strong>{metodoPagoNombre}</strong>
        </p>
      )}

      <div className="detalle-productos">
        <button className="btn-modificar" onClick={onBack}>
          Regresar
        </button>
        <button 
          className="btn-ver-productos" 
          onClick={onNext} 
          disabled={!metodoPagoId}
        >
          Continuar
        </button>
      </div>

      <IonModal
        isOpen={mostrarModal}
        onDidDismiss={() => setMostrarModal(false)}
        className="modal-selector-entrega"
      >
        <div className="modal-contenido2">
          <h3>Selecciona forma de pago</h3>

          {formasPago.map((forma) => (
            <IonButton 
              key={forma.forma_k}
              className="btn-entrega" 
              onClick={() => seleccionarMetodoPago(forma)}
            >
              {forma.nombre_forma}
            </IonButton>
          ))}
        </div>
      </IonModal>
    </div>
  );
};

export default PasoMetodoPago;
