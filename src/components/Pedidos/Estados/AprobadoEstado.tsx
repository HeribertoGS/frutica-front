// AprobadoEstado.tsx
import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonIcon, IonToast } from '@ionic/react';
import { cloudUploadOutline } from 'ionicons/icons';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ModalProductos from '../../ModalProductos/ModalProductos';
import CheckoutForm from '../../Pagos/CheckoutForm';
import { getUserId, getUserSession } from '../../../service/secureStorage';
import { subirComprobantePago } from '../../../service/api';

import '../Detalles.css';
import '../HistorialPedidos.css';

const stripePromise = loadStripe('pk_test_51Q9i8vP5LU0spKieFMdZUhCCEHbmocBZDyfKS6vIvZsM4ocyAKR001nIotZyc4Ohaw8YWVJBHkOu6YvKF0U3qIgm0033EzHEWX');

interface Producto {
  nombre: string;
  cantidad: string;
  precio: number;
  img: string;
}

interface Props {
  pedido: {
    id: number;
    estado: string;
    estadoPago: string;
    metodoPago: string;
    total: number;
    tipoEntrega: string;
    fechaPedido: string;
    direccion: string;
    productos: Producto[];
  };
}

const AprobadoEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productosFormateados = pedido.productos?.map((prod) => ({
    nombre: prod.nombre || '',
    cantidad: prod.cantidad ? `${prod.cantidad}` : '1',
    precio: prod.precio || 0,
    img: prod.img || '/assets/img/no-image.png',
  })) || []; // Si productos viene vacío, evitamos error

  useEffect(() => {
    if (pedido.metodoPago === 'Tarjeta') {
      iniciarPago();
    }
  }, []);

  const iniciarPago = async () => {
    try {
      const userId = await getUserId();
      const response = await fetch('http://localhost:4000/api/pagos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getUserSession()}`,
        },
        body: JSON.stringify({
          userId,
          pedidoId: pedido.id,
          metodo: 'tarjeta',
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        alert('❌ Error al iniciar pago.');
      }
    } catch (error) {
      console.error('Error iniciando pago:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    
    if (!archivo) {
      console.error('❌ No se seleccionó archivo');
      return;
    }
  
    // Validar tamaño de archivo (5MB ejemplo)
    if (archivo.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. Tamaño máximo: 5MB');
      return;
    }
  
    try {
      console.log('🚀 Subiendo comprobante...', archivo.name);
      await subirComprobantePago(pedido.id, archivo);
      console.log('✅ Comprobante subido correctamente');
      setShowToast(true);
    } catch (error) {
      console.error('❌ Error subiendo comprobante:', error);
      alert(`Error al subir comprobante: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      // Limpiar el input file para permitir subir el mismo archivo de nuevo si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id">
          <span>Pedido:</span> <span>#{pedido.id}</span>
        </div>
        <img
          src="src\assets\img\Aprobado.png"
          alt="Aprobado"
          className="detalle-img"
        />
        <div className="detalle-estado">Aprobado</div>
        <div className="detalle-barra"></div>
      </div>

      <div className="detalle-box">
        <p><span>Tipo de entrega:</span> {pedido.tipoEntrega}</p>
        <p><span>Fecha de pedido:</span> {pedido.fechaPedido}</p>
        <p><span>Dirección:</span> {pedido.direccion}</p>
        <p><span>Método de pago:</span> {pedido.metodoPago}</p>
        <p><span>Total:</span> <span className="detalle-total">${pedido.total}.00</span></p>

        {/* 🔥 PAGO CON TARJETA */}
        {pedido.metodoPago === 'Tarjeta' && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        )}

        {/* 🔥 SUBIR COMPROBANTE SI ES TRANSFERENCIA O EFECTIVO */}
        {(pedido.metodoPago === 'Transferencia' || pedido.metodoPago === 'Efectivo') && (
          <div className="comprobante-box">
            <p className="mensaje-cuenta">
              💳 Realiza tu pago a la cuenta:
              <br />
              <strong>Bancomer 0123 4567 8910</strong>
            </p>

            <IonButton expand="block" color="success" onClick={openFileSelector}>
              <IonIcon icon={cloudUploadOutline} slot="start" />
              Subir comprobante
            </IonButton>

            <input
  type="file"
  ref={fileInputRef}
  onChange={handleFileChange}
  accept="image/*,application/pdf"
  style={{ display: 'none' }}
/>
          </div>
        )}

        {/* Botón para ver productos */}
        <div className="detalle-productos">
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
            Ver productos
          </button>
        </div>
      </div>

      {/* Modal mostrando productos */}
      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={productosFormateados}
      />

      {/* Toast bonito cuando sube comprobante */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="✅ Comprobante subido correctamente"
        duration={2000}
        color="success"
        position="top"
      />
    </div>
  );
};

export default AprobadoEstado;
