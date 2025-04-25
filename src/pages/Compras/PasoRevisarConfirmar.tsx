import { IonButton } from '@ionic/react';
import './Compra.css';
import ModalProductos from '../../components/ModalProductos/ModalProductos';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { useState } from 'react';

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

const PasoRevisarConfirmar: React.FC<{ onBack: () => void; pedido: Props['pedido'] }> = ({ onBack, pedido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [confirmarCompra, setConfirmarCompra] = useState(false);

  const handleCompra = () => {
    console.log('✅ Compra confirmada');
    // Aquí podrías ejecutar la lógica para registrar el pedido
  };

  return (
    <div className="resumen-box">
      <h2 className="resumen-titulo">Revisa y confirma</h2>
      <p className="resumen-sub">Revisa que los detalles de tu compra sean correctos.</p>

      <div className="resumen-card">
        <h3 className="resumen-subtitulo">Costo de la compra</h3>
        <div className="resumen-linea">
          <strong>Productos:</strong> <span>$ 600.00</span>
        </div>
        <div className="resumen-linea">
          <strong>Envío:</strong> <span>$ 45.00</span>
        </div>
        <div className="resumen-linea">
          <strong>Total:</strong> <span className="total-precio">$645.00</span>
        </div>

        <div className="detalle-productos">
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
            Ver productos
          </button>
          <button className="btn-modificar">Modificar detalles</button>
        </div>
      </div>

      <div className="resumen-card">
        <h3 className="resumen-subtitulo">Detalles de la compra</h3>
        <p><strong>Fecha de entrega:</strong> 05 de enero del 2025</p>
        <p><strong>Método de Pago:</strong> {pedido.metodoPago}</p>
        <p><strong>Dirección:</strong> {pedido.direccion}</p>
        <p><strong>Forma de entrega:</strong> {pedido.tipoEntrega}</p>
      </div>

      <IonButton expand="block" className="btn-rojoo" onClick={() => setConfirmarCompra(true)}>
        COMPRAR
      </IonButton>

      {/* Modal de confirmación */}
      <ConfirmDialog
        isOpen={confirmarCompra}
        onClose={() => setConfirmarCompra(false)}
        onConfirm={() => {
          setConfirmarCompra(false);
          handleCompra();
        }}
        mensaje="¿Continuar con la compra?"
        detalle="Una vez realizada, se iniciará el proceso de entrega"
        textoConfirmar="Sí, comprar"
        textoCancelar="Volver"
      />

      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={pedido.productos}
      />
    </div>
  );
};

export default PasoRevisarConfirmar;
