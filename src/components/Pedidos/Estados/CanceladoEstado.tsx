import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // 👈 Cambiado
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
    comentario: string;
    productos: Producto[];
  };
}

const CanceladoEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const history = useHistory(); // 👈 Hook de navegación para React Router v5

  const irAMensajes = () => {
    history.push(`/mensajes/${pedido.id}`); // 👈 Redirección clásica
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id"><span>Pedido:</span> <span>#{pedido.id}</span></div>
        <img src="src/assets/img/Cancelado.png" alt="Cancelado" className="detalle-img" />
        <div className="detalle-estado">Cancelado</div>
        <div className="barra-progreso-container">
          <div className="barra-base">
            <div className="barra-relleno cancelado" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      <div className="detalle-box">
        <p><span>Tipo de entrega:</span> {pedido.tipoEntrega}</p>
        <p><span>Fecha de pedido:</span> {pedido.fechaPedido}</p>
        <p><span>Dirección:</span> {pedido.direccion}</p>
        <p><span>Método de pago:</span> {pedido.metodoPago}</p>
        <p>
          <span className="productos-label">Estado de pago:</span>
          <span className="badge-estado badge-reembolsado">Reembolsado</span>
        </p>
        <p><span>Total:</span> <span className="detalle-total">${pedido.total}.00</span></p>
        <div className="detalle-productos">
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
            Ver productos
          </button>
        </div>
      </div>

      <button
        className="btn-ver-productos verde"
        style={{ marginTop: '12px' }}
        onClick={irAMensajes}
      >
        Enviar mensaje
      </button>

      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />
    </div>
  );
};

export default CanceladoEstado;
