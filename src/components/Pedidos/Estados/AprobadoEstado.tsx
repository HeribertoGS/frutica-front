import React, { useState } from 'react';
import '../Detalles.css';
import '../HistorialPedidos.css';
import ModalProductos from '../../ModalProductos/ModalProductos';

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
    productos: Producto[]; // importante

  };
}

const AprobadoEstado: React.FC<Props> = ({ pedido }) => {
    const [mostrarModal, setMostrarModal] = useState(false);
  
  const handlePagoConTarjeta = async () => {
    try {
      const response = await fetch('http://localhost:3000/stripe/crear-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId: pedido.id })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('No se pudo iniciar el pago.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión de pago:', error);
    }
  };

  return (
    <>
      <div className="detalle-contenedor">
        {/* Card principal */}
        <div className="detalle-card">
          <div className="detalle-id">
            <span>Pedido:</span> <span>#{pedido.id}</span>
          </div>
          <img
            src="src/assets/img/Aprobado.png"
            alt="Aprobado"
            className="detalle-img"
          />
          <div className="detalle-estado">Aprobado</div>
          <div className="detalle-barra"></div>
        </div>

        {/* Detalles del pedido */}
        <div className="detalle-box">
          <p><span>Tipo de entrega:</span> {pedido.tipoEntrega}</p>
          <p><span>Fecha de pedido:</span> {pedido.fechaPedido}</p>
          <p><span>Dirección:</span> {pedido.direccion}</p>
          <p><span>Método de pago:</span> {pedido.metodoPago}</p>
          <p>
            <span className="productos-label">Estado de pago:</span>
            <span className={`badge-estado badge-${pedido.estadoPago.toLowerCase()}`}>
              {pedido.estadoPago}
            </span>
          </p>
          <p><span>Total:</span> <span className="detalle-total">${pedido.total}.00</span></p>

          <div className="detalle-productos">
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
          Ver productos
        </button>            
        <button className="btn-modificar">Modificar detalles</button>
          </div>
        </div>
        {/* Si es efectivo, muestra sección para comprobante */}
        {pedido.metodoPago === 'Efectivo' && (
  
            <div className="detalle-productos">
              <button className="btn-modificar">Cambiar método</button>
              <button className="btn-ver-productos">Continuar</button>
            </div>

        )}
        {/* Si es transferencia, muestra sección para comprobante */}
        {pedido.metodoPago === 'Transferencia' && (
          <div className="detalle-box comprobante-card">
            <h3 className="comprobante-titulo"><i className="fas fa-file-upload"></i> Subir comprobante</h3>
            <p className="comprobante-descripcion">
              Sube tu comprobante de pago donde realizaste la transferencia<br />
              <small>(2 imágenes máximo).</small>
            </p>
            <input type="file" multiple accept="image/*" className="comprobante-input" />
            <div className="detalle-productos">
              <button className="btn-modificar">Cambiar método</button>
              <button className="btn-ver-productos">Subir</button>
            </div>
          </div>
        )}

        {/* Si es tarjeta, muestra botón de pago */}
        {pedido.metodoPago === 'Tarjeta' && (
  <div className="detalle-box comprobante-card">
    <h3 className="comprobante-titulo">
      <i className="fas fa-credit-card"></i> Realizar pago
    </h3>
    <p className="comprobante-descripcion">
      Al hacer clic, serás redirigido para completar el pago con tu tarjeta de forma segura.
    </p>
    <div className="detalle-productos">
              <button className="btn-modificar">Cambiar método</button>
              <button className="btn-ver-productos" onClick={() => {
        console.log('💳 Iríamos a Stripe con el pedido:', pedido.id);
        alert(`Simulación de pago para el pedido #${pedido.id}`);
      }}>Pagar</button>
            </div>
 
  </div>
)}
      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />
      </div>
    </>
  );
};

export default AprobadoEstado;
