import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // 👈 Importar useHistory
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

const RechazadoEstado: React.FC<Props> = ({ pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] = useState(false);
  const [mostrarConfirmacionContinuar, setMostrarConfirmacionContinuar] = useState(false);

  const history = useHistory(); // 👈 Hook de navegación

  const cancelarPedido = () => {
    setMostrarConfirmacionCancelar(false);
    console.log(`Pedido #${pedido.id} cancelado ❌`);
  };

  const continuarPedido = () => {
    setMostrarConfirmacionContinuar(false);
    console.log(`Se continuará con el pedido #${pedido.id} ✅`);
  };

  const irAMensajes = () => {
    history.push(`/mensajes/${pedido.id}`);
  };

  return (
    <div className="detalle-contenedor">
      <div className="detalle-card">
        <div className="detalle-id"><span>Pedido:</span> <span>#{pedido.id}</span></div>
        <img src="src/assets/img/espera.png" alt="Rechazado" className="detalle-img" />
        <div className="detalle-estado">Rechazado</div>
        <div className="detalle-barra"></div>
        <div className="detalle-productos">
          <button className="btn-cancelar" onClick={() => setMostrarConfirmacionCancelar(true)}>Cancelar</button>
          <button className="btn-ver-productos" onClick={() => setMostrarConfirmacionContinuar(true)}>Continuar</button>
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
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
            Ver productos
          </button>  
          <button className="btn-ver-productos verde" onClick={irAMensajes}>Enviar mensaje</button>
        </div>
      </div>

      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />

      <ConfirmDialog
        isOpen={mostrarConfirmacionCancelar}
        onClose={() => setMostrarConfirmacionCancelar(false)}
        onConfirm={cancelarPedido}
        mensaje="¿Desea cancelar el pedido?"
        detalle="Recuerda una vez cancelado el pedido se perderá todo el proceso"
        textoCancelar="No"
        textoConfirmar="Sí"
      />

      <ConfirmDialog
        isOpen={mostrarConfirmacionContinuar}
        onClose={() => setMostrarConfirmacionContinuar(false)}
        onConfirm={continuarPedido}
        mensaje="¿Desea continuar con la compra?"
        detalle="Se realizará con los productos disponibles o ajustados."
        textoCancelar="No"
        textoConfirmar="Sí"
      />
    </div>
  );
};

export default RechazadoEstado;
