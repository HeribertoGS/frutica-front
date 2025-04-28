import {
  IonButton,
  IonIcon,
  IonModal
} from '@ionic/react';
import { trashOutline, add, remove } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import './Carrito.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { useHistory } from 'react-router-dom';
import { obtenerCarritoUsuario, editarProductoCarrito, eliminarProductoCarrito, vaciarCarritoUsuario } from '../../service/api';
import { useIonToast } from '@ionic/react';

const Carrito: React.FC = () => {
  const history = useHistory();
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [present] = useIonToast();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      const data = await obtenerCarritoUsuario();
      setCarrito(data.items || []);
    } catch (err) {
      console.error('❌ Error al cargar carrito:', err);
    }
  };

  const aumentar = async (item: any) => {
    try {
      await editarProductoCarrito(
        item.producto.producto_k,
        item.cantidad + 1,
        item.tipo_medida,
        item.producto.usa_tamano ? (item.tamano || 'Mediano') : undefined,
        item.peso_seleccionado || undefined
      );
      cargarCarrito();
    } catch (err) {
      console.error('❌ Error al aumentar cantidad:', err);
    }
  };

  const disminuir = async (item: any) => {
    if (item.cantidad > 1) {
      try {
        await editarProductoCarrito(
          item.producto.producto_k,
          item.cantidad - 1,
          item.tipo_medida,
          item.producto.usa_tamano ? (item.tamano || 'Mediano') : undefined,
          item.peso_seleccionado || undefined
        );
        cargarCarrito();
      } catch (err) {
        console.error('❌ Error al disminuir cantidad:', err);
      }
    }
  };

  const eliminar = async (productoId: number) => {
    try {
      await eliminarProductoCarrito(productoId);
      present({ message: 'Producto eliminado del carrito', duration: 1200, color: 'danger' });
      cargarCarrito();
    } catch (err) {
      console.error('❌ Error al eliminar producto:', err);
    }
  };

  const vaciarCarrito = async () => {
    try {
      await vaciarCarritoUsuario();
      present({ message: 'Carrito vaciado exitosamente', duration: 1200, color: 'danger' });
      cargarCarrito();
    } catch (err) {
      console.error('❌ Error al vaciar carrito:', err);
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, p) => total + (p.precio_total || 0), 0).toFixed(2);
  };

  const seleccionarTipoEntrega = (tipo: string) => {
    localStorage.setItem('tipo_entrega', tipo);
    setMostrarModal(false);
    history.push('/compra?paso=2');
  };

  return (
    <FruticaLayout>
      <div className="carrito-container">
        <h2 className="carrito-titulo">Carrito de compras</h2>
        <div className="carrito-grid">
          <div className="carrito-lista">
            {carrito.length > 0 ? carrito.map((p) => (
              <div className="carrito-item" key={p.id}>
                <img
                  src={p.producto.foto?.[0] || 'https://via.placeholder.com/150'}
                  className="carrito-imagen"
                  alt={p.producto.nombre}
                />
                <div className="carrito-detalle">
                  <h3>{p.producto.nombre}</h3>
                  <p>{p.producto.descripcion || 'Producto fresco de la mejor calidad.'}</p>

                  <div className="carrito-precio-box">
                    <strong>${(p.precio_total / p.cantidad).toFixed(2)} por {p.tipo_medida}</strong>

                    <div className="carrito-controles">
                      <IonButton fill="solid" className="contador-boton" onClick={() => disminuir(p)}>
                        <IonIcon icon={remove} />
                      </IonButton>
                      <span className="contador-numero">{p.cantidad}</span>
                      <IonButton fill="solid" className="contador-boton" onClick={() => aumentar(p)}>
                        <IonIcon icon={add} />
                      </IonButton>
                    </div>

                    <IonButton fill="solid" className="eliminar-boton" onClick={() => eliminar(p.producto.producto_k)}>
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', width: '100%' }}>Tu carrito está vacío</p>
            )}
          </div>

          <div className="carrito-resumen">
            <h3>Resumen</h3>
            <div className="carrito-resumen-item">
              <span>Subtotal ({carrito.length} productos)</span>
              <span>${calcularTotal()}</span>
            </div>
            <hr />
            <div className="carrito-resumen-item">
              <strong>Total</strong>
              <strong>${calcularTotal()}</strong>
            </div>

            <IonButton
              expand="block"
              className="btn-rojoo"
              disabled={carrito.length === 0}
              onClick={() => setMostrarModal(true)}
            >
              IR A PAGAR
            </IonButton>

            <IonButton
              expand="block"
              color="danger"
              className="btn-vaciar"
              onClick={vaciarCarrito}
              style={{ marginTop: '10px' }}
              disabled={carrito.length === 0}
            >
              Vaciar carrito
            </IonButton>
          </div>
        </div>
      </div>

      {/* Modal tipo de entrega */}
      <IonModal
        isOpen={mostrarModal}
        onDidDismiss={() => setMostrarModal(false)}
        backdropDismiss={true}
        className="modal-selector-entrega"
      >
        <div className="modal-contenido2">
          <h3>Selecciona forma de entrega</h3>
          <IonButton className="btn-entrega" onClick={() => seleccionarTipoEntrega('domicilio')}>
            🚛 Entrega a domicilio
          </IonButton>
          <IonButton className="btn-entrega" onClick={() => seleccionarTipoEntrega('recoger')}>
            🧍‍♂️ Pasar a recoger
          </IonButton>
        </div>
      </IonModal>
    </FruticaLayout>
  );
};

export default Carrito;
