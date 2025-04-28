import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, useIonToast } from '@ionic/react';
import { heartOutline, heart, addOutline, removeOutline } from 'ionicons/icons';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCarrito } from '../../contexts/carritoContext';
import { useEffect, useState } from 'react';
import { obtenerProductos } from '../../service/api';
import './ListaDeseos.css';

const ListaDeseos: React.FC = () => {
  const { wishlist } = useWishlist();
  const { carrito, agregarAlCarrito, actualizarCantidad } = useCarrito();
  const [productos, setProductos] = useState<any[]>([]);
  const [present] = useIonToast();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        present({ message: 'Error al cargar productos', duration: 2000, color: 'danger' });
      }
    };
    fetchProductos();
  }, []);

  // 🔥 Refrescar lista si cambia wishlist
  useEffect(() => {
    setProductos(prev => [...prev]);
  }, [wishlist]);

  const productosEnLista = productos.filter(p => wishlist.includes(p.producto_k));

  const aumentar = (id: number) => {
    const actual = carrito.find(p => p.id === id)?.cantidad || 1;
    actualizarCantidad(id, actual + 1);
  };

  const disminuir = (id: number) => {
    const actual = carrito.find(p => p.id === id)?.cantidad || 1;
    if (actual > 1) {
      actualizarCantidad(id, actual - 1);
    }
  };

  return (
    <FruticaLayout>
      <IonContent className="ion-padding">
        <h2 className="titulo-frutas">Lista de deseos</h2>
        <IonGrid>
          <IonRow className="product-grid">
            {productosEnLista.length === 0 ? (
              <p>No tienes productos en tu lista de deseos.</p>
            ) : (
              productosEnLista.map((producto) => (
                <IonCol key={producto.producto_k} size="12" size-md="4" size-lg="2">
                  <IonCard className="fruta-product-card">
                    <img
                      src={producto.foto?.[0] || 'https://via.placeholder.com/150'}
                      alt={producto.nombre}
                      className="fruta-product-img"
                    />

                    <IonCardHeader className="fruta-product-info">
                      <div className="fruta-title-heart">
                        <IonCardTitle className="fruta-product-title">{producto.nombre}</IonCardTitle>
                      </div>
                      <p className="fruta-product-price">
                        ${producto.precio_por_kg ?? producto.precio_por_pieza ?? 0}.00 {producto.precio_por_kg ? 'kg' : 'pieza'}
                      </p>
                    </IonCardHeader>

                    <IonCardContent>
                      {carrito.find((p) => p.id === producto.producto_k) ? (
                        <div className="fruta-controles">
                          <IonButton size="small" fill="solid" onClick={() => disminuir(producto.producto_k)} className="fruta-boton-contador">
                            <IonIcon icon={removeOutline} />
                          </IonButton>
                          <span className="fruta-cantidad">{carrito.find(p => p.id === producto.producto_k)?.cantidad || 1}</span>
                          <IonButton size="small" fill="solid" onClick={() => aumentar(producto.producto_k)} className="fruta-boton-contador">
                            <IonIcon icon={addOutline} />
                          </IonButton>
                        </div>
                      ) : (
                        <IonButton className="fruta-btn-agregar" expand="block" onClick={() => agregarAlCarrito({
                          id: producto.producto_k,
                          nombre: producto.nombre,
                          precio: producto.precio_por_kg ?? producto.precio_por_pieza ?? 0,
                          imagen: producto.foto?.[0] || '',
                          cantidad: 1,
                        })}>
                          <IonIcon icon={addOutline} slot="start" />
                          Agregar
                        </IonButton>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </FruticaLayout>
  );
};

export default ListaDeseos;
