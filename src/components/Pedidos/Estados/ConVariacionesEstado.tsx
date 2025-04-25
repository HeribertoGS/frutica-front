import React, { useState } from 'react';
import '../Detalles.css';
import ModalProductos from '../../ModalProductos/ModalProductos';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog';

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
    comentario: string; // motivo de variación
    productos: Producto[];
  };
}

const ConVariacionesEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const cancelarPedido = () => {
    setMostrarConfirmacion(false);
    console.log('✅ Pedido cancelado con variaciones');
    // Aquí va la lógica para cancelar pedido
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id"><span>Pedido:</span> <span>#{pedido.id}</span></div>
        <img src="src/assets/img/espera.png" alt="Con variaciones" className="detalle-img" />
        <div className="detalle-estado">Con variaciones</div>
        <div className="detalle-barra"></div>
        <div className="detalle-productos">
          <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(true)}>Cancelar</button>
          <button className="btn-ver-productos">Continuar</button>
        </div>
      </div>

      <div className="detalle-aviso">{pedido.comentario}</div>

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

      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />

      <ConfirmDialog
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={cancelarPedido}
        mensaje="¿Deseas cancelar este pedido?"
        detalle="Esta acción no se puede deshacer."
        textoConfirmar="Sí, cancelar"
        textoCancelar="No"
      />
    </div>
  );
};

export default ConVariacionesEstado;
