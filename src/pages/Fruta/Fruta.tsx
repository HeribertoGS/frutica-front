import { IonContent, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, useIonToast, IonCard } from "@ionic/react";
import { heartOutline, heart, addOutline, removeOutline } from "ionicons/icons";
import "../../pages/Fruta/fruta.css";
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCarrito } from "../../contexts/carritoContext";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import { agregarAListaDeseos, obtenerProductos, quitarDeListaDeseos } from "../../service/api";

const Fruta: React.FC = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { carrito, agregarAlCarrito, actualizarCantidad } = useCarrito();
  const [productos, setProductos] = useState<any[]>([]);
  const [present] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        present({ message: 'Error al cargar productos', duration: 2000, color: 'danger' });
      }
    };

    cargarProductos();
  }, []);
  const handleClickHeart = async (producto: any) => {
    try {
      if (isInWishlist(producto.producto_k)) {
        await quitarDeListaDeseos(producto.producto_k);
      } else {
        await agregarAListaDeseos(producto.producto_k);
      }
  
      await toggleWishlist(producto.producto_k); // 🔥 Que espere terminar de actualizar
  
      present({
        message: isInWishlist(producto.producto_k)
          ? `${producto.nombre} eliminado de la lista de deseos`
          : `${producto.nombre} agregado a la lista de deseos`,
        duration: 1500,
        color: "medium",
      });
    } catch (err) {
      console.error('❌ Error al actualizar lista de deseos:', err);
      present({ message: 'Error en la lista de deseos', duration: 2000, color: 'danger' });
    }
  };

  const handleAgregar = (producto: any) => {
    const precio = producto.precio_por_kg ?? producto.precio_por_pieza ?? 0;

    agregarAlCarrito({
      id: producto.producto_k,
      nombre: producto.nombre,
      precio: precio,
      imagen: producto.foto?.[0] || '',
      cantidad: 1,
    });
  };

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

  const irADetalle = (id: number) => {
    history.push(`/producto/${id}`);
  };

  return (
    <FruticaLayout>
      <IonContent className="ion-padding">
        <h2 className="fruta-titulo-principal">Frutas y Verduras</h2>
        <IonGrid>
          <IonRow className="fruta-product-grid">
            {productos.map((producto) => {
              const precioMostrado = producto.precio_por_kg ?? producto.precio_por_pieza ?? 0;
              const unidadMostrada = producto.precio_por_kg ? 'kg' : 'pieza';

              return (
                <IonCol key={producto.producto_k} size="12" size-sm="6" size-md="4" size-lg="2">
                  <IonCard className="fruta-product-card">
                    <img
                      src={producto.foto?.[0] || 'https://via.placeholder.com/150'}
                      alt={producto.nombre}
                      className="fruta-product-img"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        irADetalle(producto.producto_k);
                      }}
                    />

                    <IonCardHeader className="fruta-product-info">
                      <div className="fruta-title-heart">
                        <IonCardTitle className="fruta-product-title">{producto.nombre}</IonCardTitle>
                        <IonIcon
                          icon={isInWishlist(producto.producto_k) ? heart : heartOutline}
                          className={`fruta-heart-icon ${isInWishlist(producto.producto_k) ? 'relleno' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClickHeart(producto);
                          }}
                        />
                      </div>
                      <p className="fruta-product-price">
                        ${precioMostrado}.00 {unidadMostrada}
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
                        <IonButton className="fruta-btn-agregar" expand="block" onClick={() => handleAgregar(producto)}>
                          <IonIcon icon={addOutline} slot="start" />
                          Agregar
                        </IonButton>
                      )}
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </FruticaLayout>
  );
};

export default Fruta;
