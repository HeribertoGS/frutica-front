import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cambiarEstadoPedido } from '../../../service/api'; // Importamos el servicio
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
    comentario: string;
    productos: Producto[];
  };
}

const EnPreparacionEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const history = useHistory();

  const cancelarPedido = async () => {
    setMostrarConfirmacion(false);
    try {
      await cambiarEstadoPedido(pedido.id, 'cancelado'); //  Ahora sí cambia en el backend
      alert('✅ Pedido cancelado exitosamente');
      window.location.reload(); //  Opcional: recarga la página para ver cambios
    } catch (error) {
      console.error('❌ Error al cancelar el pedido:', error);
      alert('Error al cancelar pedido');
    }
  };

  const irAMensajes = () => {
    history.push(`/mensajes/${pedido.id}`);
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id">
          <span>Pedido:</span> <span>#{pedido.id}</span>
        </div>
        <img src="src\assets\img\Preparacion.png" alt="En preparación" className="detalle-img" />
        <div className="detalle-estado">En preparación</div>

        <div className="barra-progreso-container">
          <div className="barra-base">
            <div className="barra-relleno" style={{ width: '35%' }}></div>
          </div>
        </div>

        <div className="barra-boton-cancelar">
          <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(true)}>
            Cancelar pedido
          </button>
        </div>
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

      <ConfirmDialog
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={cancelarPedido}
        mensaje="¿Deseas cancelar el pedido?"
        detalle="Una vez cancelado, se perderá todo el proceso de preparación."
        textoCancelar="No, volver"
        textoConfirmar="Sí, cancelar"
      />
    </div>
  );
};

export default EnPreparacionEstado;
