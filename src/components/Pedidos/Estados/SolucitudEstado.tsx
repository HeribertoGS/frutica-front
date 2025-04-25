import React, { useState } from 'react';
import { IonModal } from '@ionic/react';
import ModalProductos from '../../ModalProductos/ModalProductos';
import '../Detalles.css';
import '../HistorialPedidos.css';

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

const SolicitudEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id">
          <span>Pedido:</span> <span>#{pedido.id}</span>
        </div>
        <img
          src="src/assets/img/Solicitado.png"
          alt="Solicitado"
          className="detalle-img"
        />
        <div className="detalle-estado">Solicitado</div>
        <div className="detalle-barra"></div>
      </div>

      <div className="detalle-aviso">
        Por favor espera, estamos verificando existencias para posteriormente preparar el pedido.
      </div>

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
          <span className="productos-label">Productos:</span>
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
            Ver productos
          </button>
        </div>
      </div>

      {/* MODAL COMPONENTE REUTILIZABLE */}
      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />
    </div>
  );
};

export default SolicitudEstado;
