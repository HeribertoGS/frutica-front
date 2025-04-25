import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // 👈 Importa useHistory
import '../Detalles.css';
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
    estadoPago: string;
    metodoPago: string;
    total: number;
    tipoEntrega: string;
    fechaPedido: string;
    direccion: string;
    productos: Producto[];
  };
}

const EnValidacionEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const history = useHistory(); // 👈 Hook de navegación

  const irAMensajes = () => {
    history.push(`/mensajes/${pedido.id}`); // 👈 Redirección
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id">
          <span>Pedido:</span> <span>#{pedido.id}</span>
        </div>
        <img src="src/assets/img/validacion.png" alt="Validación" className="detalle-img" />
        <div className="detalle-estado">En validación</div>
        <div className="detalle-barra"></div>
      </div>

      <div className="detalle-box">
        <p><span>Tipo de entrega:</span> {pedido.tipoEntrega}</p>
        <p><span>Fecha de pedido:</span> {pedido.fechaPedido}</p>
        <p><span>Dirección:</span> {pedido.direccion}</p>
        <p><span>Método de pago:</span> {pedido.metodoPago}</p>
        <p>
          <span className="productos-label">Estado de pago:</span>
          <span className="badge-estado badge-enrevision">En revisión</span>
        </p>
        <p><span>Total:</span> <span className="detalle-total">${pedido.total}.00</span></p>
        <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
          Ver productos
        </button>
      </div>

      <div className="detalle-footer">
        <button
          className="btn-ver-productos verde"
          onClick={irAMensajes} // 👈 Aquí se redirige
        >
          Enviar mensaje
        </button>
      </div>

      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />
    </div>
  );
};

export default EnValidacionEstado;
