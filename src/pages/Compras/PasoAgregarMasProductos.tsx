import { IonButton, IonIcon } from '@ionic/react';
import { add, remove, cart } from 'ionicons/icons';
import './Compra.css';

const PasoAgregarMasProductos = () => {
  return (
    <div className="pantalla-compra">
      <h2>Selecciona frutas y verduras</h2>

      {['Fresas', 'Zanahoria', 'Aguacate', 'Uva'].map((nombre, idx) => (
        <div className="product-card-compra" key={idx}>
          <img src={`/assets/${nombre.toLowerCase()}.jpg`} />
          <div>
            <h4>{nombre}</h4>
            <p>Medida: <select><option>Piezas</option><option>KG</option></select></p>
            <p>
              Cantidad:
              <IonButton size="small"><IonIcon icon={remove} /></IonButton>
              <span> 1 </span>
              <IonButton size="small"><IonIcon icon={add} /></IonButton>
            </p>
            <p>Precio: $20.00</p>
            <IonButton color="success"><IonIcon icon={cart} /></IonButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasoAgregarMasProductos;
