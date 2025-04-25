import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import './HistorialPedidos.css';
import { useHistory } from 'react-router-dom';

const pedidos = [
  { id: 145, estadoPago: 'Pendiente', entrega: 'A domicilio', metodoPago: 'Transferencia', total: 950, fechaPedido: '01 de enero del 2025', direccion: 'Calle 1' },
  { id: 146, estadoPago: 'Realizado', entrega: 'A domicilio', metodoPago: 'Transferencia', total: 650, fechaPedido: '03 de enero del 2025', direccion: 'Calle 2' },
  { id: 147, estadoPago: 'Cancelado', entrega: 'Pasar a recoger', metodoPago: 'Efectivo', total: 430, fechaPedido: '05 de enero del 2025', direccion: 'Calle 3' },
  { id: 148, estadoPago: 'En proceso', entrega: 'A domicilio', metodoPago: 'SPEI', total: 500, fechaPedido: '07 de enero del 2025', direccion: 'Calle 4' },
];

const HistorialPedidos: React.FC = () => {
  const history = useHistory();

  return (
    <FruticaLayout>
      <IonContent className="ion-padding historial-content">
        <h2 className="historial-title">Historial de compras</h2>
        {pedidos.map((pedido, index) => (
          <IonCard key={index} className="pedido-card">
            <IonCardContent className="pedido-card-content">
              <img src="src/assets/img/pedidos.png" alt="Icono producto" className="pedido-img" />
              <div className="pedido-info">
                <div className="pedido-header">
                  <h3>Pedido #{pedido.id}</h3>
                  <span className={`badge-estado badge-${pedido.estadoPago.toLowerCase().replaceAll(' ', '_')}`}>
                    {pedido.estadoPago}
                  </span>
                </div>
                <p><span>Entrega:</span> {pedido.entrega}</p>
                <p><strong>Estado del pago:</strong> <span className="estado-texto">{pedido.estadoPago}</span></p>
                <button
                  className="btn-verdee"
                  onClick={() => history.push(`/pedido/${pedido.id}`)}
                >
                  Ver más…
                </button>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </FruticaLayout>
  );
};

export default HistorialPedidos;
