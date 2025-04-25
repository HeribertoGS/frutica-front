import { IonContent, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, useIonToast, IonCard, } from "@ionic/react";
import { heartOutline, heart, addOutline, removeOutline } from "ionicons/icons";
import "../../pages/Fruta/fruta.css";
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useWishlist } from "../../contexts/WishlistContext";
import { useCarrito } from "../../contexts/carritoContext";
import { useHistory } from 'react-router-dom';


const productos = [
  { id: 1, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
  { id: 2, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },
  { id: 3, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
  { id: 4, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },
  { id: 5, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
  { id: 6, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },

];

const Fruta: React.FC = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [present] = useIonToast();
  const { carrito, agregarAlCarrito, actualizarCantidad } = useCarrito();

  const handleClickHeart = (producto: any) => {
    toggleWishlist(producto);
    present({
      message: isInWishlist(producto.id)
        ? `${producto.nombre} eliminado de la lista de deseos`
        : `${producto.nombre} agregado a la lista de deseos`,
      duration: 1500,
      color: "medium",
    });
  };

  const handleAgregar = (producto: any) => {
    agregarAlCarrito({ ...producto, cantidad: 1 });
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

  const history = useHistory();
  const irADetalle = () => {
    history.push('/producto');
  };


  return (
    <FruticaLayout>
      <IonContent className="ion-padding">
        <h2 className="fruta-titulo-principal">Frutas</h2>
        <IonGrid>
          <IonRow className="fruta-product-grid">
            {productos.map((producto) => (
              <IonCol key={producto.id} size="12" size-sm="6" size-md="4" size-lg="2">
                <IonCard className="fruta-product-card" >
                  <img src={producto.imagen} alt={producto.nombre} className="fruta-product-img" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    irADetalle();
                  }} />

                  <IonCardHeader className="fruta-product-info">
                    <div className="fruta-title-heart">
                      <IonCardTitle className="fruta-product-title">{producto.nombre}</IonCardTitle>
                      <IonIcon
                        icon={isInWishlist(producto.id) ? heart : heartOutline}
                        className="fruta-heart-icon"
                        style={{ color: isInWishlist(producto.id) ? "#FFB347" : "orange" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClickHeart(producto);
                        }}
                      />
                    </div>
                    <p className="fruta-product-price">${producto.precio}.00 kg</p>
                  </IonCardHeader>

                  <IonCardContent>
                    {carrito.find((p) => p.id === producto.id) ? (

                      <div className="fruta-controles">
                        <IonButton size="small" fill="solid" onClick={() => disminuir(producto.id)} className="fruta-boton-contador">
                              -
                        </IonButton>
                        <span className="fruta-cantidad">{carrito.find(p => p.id === producto.id)?.cantidad || 1}</span>

                        <IonButton size="small" fill="solid" onClick={() => aumentar(producto.id)} className="fruta-boton-contador">
                            
                        </IonButton>
                      </div>
                    ) : (
                      <IonButton className="fruta-btn-agregar" expand="block" onClick={() => agregarAlCarrito({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, cantidad: 1 })}>
                        <IonIcon icon={addOutline} slot="start" />
                        Agregar
                      </IonButton>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </FruticaLayout>
  );
};

export default Fruta;
