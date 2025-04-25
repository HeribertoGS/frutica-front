import { IonButton, IonModal } from '@ionic/react';
import { useHistory } from 'react-router';
import './Compra.css';

const PasoSeleccionEntrega = ({ onNext }: { onNext: () => void }) => {
  const history = useHistory();

  const cerrarModal = () => {
    history.push('/carrito'); // ⬅️ Si tocan fuera del modal, regresa al carrito
  };

  return (
    <IonModal
      isOpen={true}
      backdropDismiss={true}
      onDidDismiss={cerrarModal}
      className="modal-selector-entrega"
    >
      <div className="modal-contenido2">
        <h3 className="modal-titulo">Selecciona forma de entrega</h3>
        <IonButton className="btn-entrega" expand="block" onClick={onNext}>
          <span className="icono-entrega">🚚</span> ENTREGA A DOMICILIO
        </IonButton>
        <IonButton className="btn-entrega" expand="block" onClick={onNext}>
          <span className="icono-entrega">🧍</span> PASAR A RECOGER
        </IonButton>
      </div>
    </IonModal>
  );
};

export default PasoSeleccionEntrega;
