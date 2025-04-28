import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import './HistorialPedidos.css';
import { useHistory } from 'react-router-dom';
import { obtenerPedidosUsuario, obtenerTodosPedidos } from '../../service/api';
import { getUserRole } from '../../service/secureStorage'; // 👈

interface Pedido {
  pedido_k: number;
  estado: string;
  tipoEntrega: {
    metodo_entrega: string;
  } | null;
  formaPago: {
    nombre_forma: string;
  } | null;
  pagos: {
    estado: string;
    metodo: string;
  }[];
  total: number | string;
  fecha_pedido: string;
}

const HistorialPedidos: React.FC = () => {
  const history = useHistory();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const role = await getUserRole();

        if (role === 'admin') {
          const data = await obtenerTodosPedidos(); // 🔥 Si es admin
          setPedidos(data);
        } else {
          const data = await obtenerPedidosUsuario(); // 🔥 Si es usuario normal
          setPedidos(data);
        }
      } catch (error) {
        console.error('❌ Error cargando pedidos:', error);
      }
    };

    cargarPedidos();
  }, []);

  return (
    <FruticaLayout>
      <IonContent className="ion-padding historial-content">
        <h2 className="historial-title">Historial de compras</h2>

        {pedidos.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No tienes pedidos todavía.</p>
        ) : (
          pedidos.map((pedido) => (
            <IonCard key={pedido.pedido_k} className="pedido-card">
              <IonCardContent className="pedido-card-content">
                <img src="src\assets\img\pedidos.png" alt="Icono producto" className="pedido-img" />

                <div className="pedido-info">
                  <div className="pedido-header">
                    <h3>Pedido #{pedido.pedido_k}</h3>
                    <span className={`badge-estado badge-${(pedido.pagos?.[0]?.estado || 'pendiente').toLowerCase().replaceAll(' ', '_')}`}>
                      {pedido.pagos?.[0]?.estado || 'Pendiente'}
                    </span>
                  </div>

                  <p><strong>Método de pago:</strong> {pedido.formaPago?.nombre_forma || 'No especificado'}</p>
                  <p><strong>Entrega:</strong> {pedido.tipoEntrega?.metodo_entrega || 'No especificado'}</p>
                  <p><strong>Total:</strong> ${Number(pedido.total).toFixed(2)}</p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn-verdee"
                      onClick={() => history.push(`/pedido/${pedido.pedido_k}`)}
                    >
                      Ver más…
                    </button>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </FruticaLayout>
  );
};

export default HistorialPedidos;
