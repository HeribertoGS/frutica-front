import { IonButton, IonModal } from "@ionic/react";
import { useEffect, useState } from "react";
import "./Compra.css";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const PasoMetodoPago: React.FC<Props> = ({ onNext, onBack }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");

  useEffect(() => {
    const metodoGuardado = localStorage.getItem("metodo_pago");
    if (metodoGuardado) {
      setMetodoPago(metodoGuardado);
    }
  }, []);

  const seleccionarMetodoPago = (metodo: string) => {
    setMetodoPago(metodo);
    localStorage.setItem("metodo_pago", metodo);
    setMostrarModal(false);
  };

  return (
    <div className="pantalla-compra">
      <h2 className="titulo-pantalla">Selecciona forma de pago</h2>

      <IonButton expand="block" onClick={() => setMostrarModal(true)} className="btn-greenstr">
        Elegir método de pago
      </IonButton>

      {metodoPago && (
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          Método seleccionado: <strong>{metodoPago}</strong>
        </p>
      )}
        <div className="detalle-productos">
          <button className="btn-modificar" onClick={onBack} >
          Regresar
        </button>            
        <button className="btn-ver-productos" onClick={onNext} disabled={!metodoPago}>Continuar</button>
          </div>


      <IonModal
        isOpen={mostrarModal}
        onDidDismiss={() => setMostrarModal(false)}
        className="modal-selector-entrega"
      >
        <div className="modal-contenido2">
          <h3>Selecciona forma de pago</h3>
          <IonButton
  className="btn-entrega"
  onClick={() => seleccionarMetodoPago("Efectivo")}
>
  💸 Efectivo
</IonButton>

<IonButton
  className="btn-entrega"
  onClick={() => seleccionarMetodoPago("Transferencia")}
>
  🪙 Transferencia
</IonButton>

<IonButton
  className="btn-entrega"
  onClick={() => seleccionarMetodoPago("Tarjeta")}
>
  💳 Tarjeta (Stripe)
</IonButton>

        </div>
      </IonModal>
    </div>
  );
};

export default PasoMetodoPago;
