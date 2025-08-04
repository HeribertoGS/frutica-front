import {
  IonButton,
  IonIcon,
  IonModal,
  IonSpinner,
  IonAlert
} from '@ionic/react';
import { trashOutline, add, remove, refreshOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import './Carrito.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { useHistory } from 'react-router-dom';
import {
  obtenerCarritoUsuario,
  editarProductoCarrito,
  eliminarProductoCarrito,
  vaciarCarritoUsuario
} from '../../service/api';
import { useIonToast } from '@ionic/react';

const Carrito: React.FC = () => {
  const history = useHistory();
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [present] = useIonToast();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setCargando(true);
      setError(null);
      
      console.log('🛒 Intentando cargar carrito...');
      const data = await obtenerCarritoUsuario();
      console.log('✅ Carrito cargado:', data);
      
      // Manejar diferentes estructuras de respuesta
      if (data && data.items && Array.isArray(data.items)) {
        setCarrito(data.items);
      } else if (data && Array.isArray(data)) {
        setCarrito(data);
      } else if (data && data.carrito && Array.isArray(data.carrito)) {
        setCarrito(data.carrito);
      } else {
        console.log('📦 Carrito vacío o estructura no reconocida');
        setCarrito([]);
      }
    } catch (err: any) {
      console.error('❌ Error al cargar carrito:', err);
      
      // Manejar diferentes tipos de errores
      if (err.message?.includes('404') || err.status === 404) {
        setError('No se encontró tu carrito. Es posible que aún no tengas productos agregados.');
        setCarrito([]); // Carrito vacío si no existe
      } else if (err.message?.includes('401') || err.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setMostrarAlerta(true);
      } else if (err.message?.includes('No se pudo obtener el carrito')) {
        setError('Error del servidor. Intenta nuevamente en unos momentos.');
      } else {
        setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
      
      present({ 
        message: 'No se pudo cargar el carrito', 
        duration: 2000, 
        color: 'warning' 
      });
    } finally {
      setCargando(false);
    }
  };
// DEBUGGING: Agrega esto temporalmente en tus funciones aumentar/disminuir

// DEBUGGING: Agrega esto temporalmente en tus funciones aumentar/disminuir

const aumentar = async (item: any) => {
  try {
    console.log('⬆ Aumentando cantidad para producto:', item.producto.producto_k);
    
    // 🎯 SIMPLE: Solo enviar exactamente lo que ya tiene el item, cambiando solo la cantidad
    await editarProductoCarrito(item.producto.producto_k, {
      nuevaCantidad: item.cantidad + 1,
      tipo_medida: item.tipo_medida,
      tamano: item.tamano, // Usar exactamente el tamaño que ya tiene (puede ser null)
      peso_personalizado: item.peso_personalizado || item.peso_seleccionado
    });
    
    await cargarCarrito();
  } catch (err) {
    console.error('❌ Error al aumentar cantidad:', err);
    present({ 
      message: 'Error al aumentar cantidad', 
      duration: 1500, 
      color: 'danger' 
    });
  }
};

const disminuir = async (item: any) => {
  if (item.cantidad > 1) {
    try {
      console.log('⬇️ Disminuyendo cantidad para producto:', item.producto.producto_k);
      
      // 🎯 SIMPLE: Solo enviar exactamente lo que ya tiene el item, cambiando solo la cantidad
      await editarProductoCarrito(item.producto.producto_k, {
        nuevaCantidad: item.cantidad - 1,
        tipo_medida: item.tipo_medida,
        tamano: item.tamano, // Usar exactamente el tamaño que ya tiene (puede ser null)
        peso_personalizado: item.peso_personalizado || item.peso_seleccionado
      });
      
      await cargarCarrito();
    } catch (err) {
      console.error('❌ Error al disminuir cantidad:', err);
      present({ 
        message: 'Error al disminuir cantidad', 
        duration: 1500, 
        color: 'danger' 
      });
    }
  }
};
const eliminar = async (productoId: number, tipo_medida: 'kg' | 'pieza') => {
  try {
    console.log(' Eliminando producto:', productoId, tipo_medida);
    await eliminarProductoCarrito(productoId, tipo_medida);
    present({ message: 'Producto eliminado del carrito', duration: 1200, color: 'success' });
    await cargarCarrito();
  } catch (err) {
    console.error(' Error al eliminar producto:', err);
    present({ 
      message: 'Error al eliminar producto', 
      duration: 1500, 
      color: 'danger' 
    });
  }
};

  const vaciarCarrito = async () => {
    try {
      console.log('🧹 Vaciando carrito...');
      await vaciarCarritoUsuario();
      present({ message: 'Carrito vaciado exitosamente', duration: 1200, color: 'success' });
      await cargarCarrito();
    } catch (err) {
      console.error(' Error al vaciar carrito:', err);
      present({ 
        message: 'Error al vaciar carrito', 
        duration: 1500, 
        color: 'danger' 
      });
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

  const irALogin = () => {
    setMostrarAlerta(false);
    history.push('/login');
  };

  // Componente de carga
  if (cargando) {
    return (
      <FruticaLayout>
        <div className="carrito-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column'
        }}>
          <IonSpinner name="crescent" />
          <p style={{ marginTop: '1rem' }}>Cargando carrito...</p>
        </div>
      </FruticaLayout>
    );
  }

  return (
    <FruticaLayout>
      <div className="carrito-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="carrito-titulo">Carrito de compras</h2>
          <IonButton fill="clear" onClick={cargarCarrito}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </div>
        
        {/* Mostrar error si existe */}
        {error && (
          <div style={{ 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '1rem', 
            margin: '1rem 0',
            color: '#856404'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>{error}</p>
            <IonButton size="small" fill="outline" onClick={cargarCarrito}>
              <IonIcon icon={refreshOutline} slot="start" />
              Reintentar
            </IonButton>
          </div>
        )}

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
      
      {/* Mostrar tamaño si aplica */}
      {p.tamano && (
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Tamaño: {p.tamano} {p.peso_seleccionado ? `(${p.peso_seleccionado}g)` : ''}
        </p>
      )}

      <div className="carrito-precio-box">
        <strong>
          ${(p.precio_total / p.cantidad).toFixed(2)} por {p.tipo_medida}
        </strong>

        <div className="carrito-controles">
          <IonButton fill="solid" className="contador-boton" onClick={() => disminuir(p)}>
            <IonIcon icon={remove} />
          </IonButton>
          <span className="contador-numero">{p.cantidad}</span>
          <IonButton fill="solid" className="contador-boton" onClick={() => aumentar(p)}>
            <IonIcon icon={add} />
          </IonButton>
        </div>

        <IonButton fill="solid" className="eliminar-boton" onClick={() => eliminar(p.producto.producto_k, p.tipo_medida)}>
          <IonIcon icon={trashOutline} />
        </IonButton>
      </div>
    </div>
  </div>
)) : (
              <div style={{ textAlign: 'center', width: '100%', padding: '3rem 1rem' }}>
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunos productos deliciosos!</p>
                <IonButton fill="solid" onClick={() => history.push('/productos')} style={{ marginTop: '1rem' }}>
                  Ir a comprar
                </IonButton>
              </div>
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

      {/* Alerta para sesión expirada */}
      <IonAlert
        isOpen={mostrarAlerta}
        onDidDismiss={() => setMostrarAlerta(false)}
        header="Sesión expirada"
        message="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        buttons={[
          {
            text: 'Ir a Login',
            handler: irALogin
          }
        ]}
      />
    </FruticaLayout>
  );
};

export default Carrito;