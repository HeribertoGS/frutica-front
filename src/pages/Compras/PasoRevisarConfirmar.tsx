import { IonButton, useIonToast } from '@ionic/react';
import './Compra.css';
import ModalProductos from '../../components/ModalProductos/ModalProductos';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { useEffect, useState } from 'react';
import { crearPedidoFrutica, obtenerCarritoUsuario, vaciarCarritoUsuario } from '../../service/api';
import { useHistory } from 'react-router-dom';
import { getUserId } from '../../service/secureStorage';

const PasoRevisarConfirmar: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const history = useHistory();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [confirmarCompra, setConfirmarCompra] = useState(false);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();

  // ⬇️ Ahora metodoPagoNombre y direccionTexto son estados para forzar actualización
  const [metodoPagoNombre, setMetodoPagoNombre] = useState('');
  const [direccionTexto, setDireccionTexto] = useState('');

  const tipoEntrega = localStorage.getItem('tipo_entrega') || '';
  const fechaEntrega = localStorage.getItem('fecha_entrega') || '';
  const horaEntrega = localStorage.getItem('hora_entrega') || '';
  const metodoPagoId = localStorage.getItem('forma_pago_id');
  const direccionId = localStorage.getItem('direccion_id');

  useEffect(() => {
    const cargarDatos = async () => {
      const metodo = localStorage.getItem('forma_pago_nombre') || '';
      const direccion = localStorage.getItem('direccion_texto') || '';
      setMetodoPagoNombre(metodo);
      setDireccionTexto(direccion);
    };

    const cargarCarrito = async () => {
      try {
        const data = await obtenerCarritoUsuario();
        setCarrito(data.items || []);
      } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
      }
    };

    cargarDatos();
    cargarCarrito();
  }, []);

  const calcularSubtotal = () => carrito.reduce((total, item) => total + (item.precio_total || 0), 0);
  const calcularCostoEnvio = () => (tipoEntrega === 'domicilio' ? 45 : 0);
  const calcularTotal = () => calcularSubtotal() + calcularCostoEnvio();

  const handleCompra = async () => {
    try {
      setLoading(true);

      const usuarioId = await getUserId();

      const dataPedido = {
        tipo_entrega: (tipoEntrega === 'domicilio' ? 'Entrega a domicilio' : 'Pasar a recoger') as "Entrega a domicilio" | "Pasar a recoger",
        formaPagoId: metodoPagoId ? Number(metodoPagoId) : 0,
        direccionId: direccionId ? Number(direccionId) : undefined,
        fecha_entrega: fechaEntrega,
        horario_entrega: horaEntrega,
        costo_envio: calcularCostoEnvio(),
        usuarioId: usuarioId,
      };

      console.log('📦 Datos que se enviarán a crearPedidoFrutica:', dataPedido);

      await crearPedidoFrutica(dataPedido);
      await vaciarCarritoUsuario();

      localStorage.removeItem('tipo_entrega');
      localStorage.removeItem('forma_pago_id');
      localStorage.removeItem('forma_pago_nombre');
      localStorage.removeItem('fecha_entrega');
      localStorage.removeItem('hora_entrega');
      localStorage.removeItem('direccion_id');
      localStorage.removeItem('direccion_texto');

      history.push('/pedidos');
    } catch (error: any) {
      console.error('❌ Error al crear pedido:', error);

      const mensaje = error?.response?.data?.message || error?.message || 'Error desconocido al crear el pedido.';

      presentToast({
        message: mensaje,
        duration: 3000,
        color: 'danger',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resumen-box">
      <h2 className="resumen-titulo">Revisa y confirma</h2>
      <p className="resumen-sub">Revisa que los detalles de tu compra sean correctos.</p>

      <div className="resumen-card">
        <h3 className="resumen-subtitulo">Costo de la compra</h3>
        <div className="resumen-linea">
          <strong>Productos:</strong> <span>${calcularSubtotal().toFixed(2)}</span>
        </div>
        <div className="resumen-linea">
          <strong>Envío:</strong> <span>${calcularCostoEnvio().toFixed(2)}</span>
        </div>
        <div className="resumen-linea">
          <strong>Total:</strong> <span className="total-precio">${calcularTotal().toFixed(2)}</span>
        </div>

        <div className="detalle-productos">
          <button className="btn-ver-productos" onClick={() => setMostrarModal(true)}>
            Ver productos
          </button>
          <button className="btn-modificar" onClick={onBack}>
            Modificar detalles
          </button>
        </div>
      </div>

      <div className="resumen-card">
        <h3 className="resumen-subtitulo">Detalles de la compra</h3>
        <p><strong>Fecha de entrega:</strong> {fechaEntrega}</p>
        <p><strong>Horario de entrega:</strong> {horaEntrega}</p>
        <p><strong>Método de Pago:</strong> {metodoPagoNombre}</p>
        <p><strong>Dirección:</strong> {direccionTexto}</p>
        <p><strong>Forma de entrega:</strong> {tipoEntrega === 'domicilio' ? 'Entrega a domicilio' : 'Pasar a recoger'}</p>
      </div>

      <IonButton expand="block" className="btn-rojoo" onClick={() => setConfirmarCompra(true)} disabled={loading}>
        {loading ? 'Procesando...' : 'COMPRAR'}
      </IonButton>

      <ConfirmDialog
        isOpen={confirmarCompra}
        onClose={() => setConfirmarCompra(false)}
        onConfirm={handleCompra}
        mensaje="¿Continuar con la compra?"
        detalle="Una vez realizada, se iniciará el proceso de entrega"
        textoConfirmar="Sí, comprar"
        textoCancelar="Volver"
      />

      <ModalProductos
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        productos={carrito.map((item) => ({
          nombre: item.producto.nombre,
          cantidad: `${item.cantidad} ${item.tipo_medida}`,
          precio: item.precio_total,
          img: item.producto.foto?.[0] || '',
        }))}
      />
    </div>
  );
};

export default PasoRevisarConfirmar;
