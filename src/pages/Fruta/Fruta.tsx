import { IonPage, IonHeader, IonToolbar, IonContent, IonSearchbar, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, useIonToast, } from "@ionic/react";
import { menuOutline, heartOutline, arrowBackOutline, addOutline, heart } from "ionicons/icons";
import '../../global.css';
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useWishlist } from "../../contexts/WishlistContext";

const productos = [
  { id: 1, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
  { id: 2, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },
  { id: 3, nombre: "Peras", precio: 60, imagen: "https://www.saborusa.com/cr/wp-content/uploads/sites/14/2023/12/propiedades-de-la-pera-salud-belleza.jpg" },
  { id: 4, nombre: "Mandarina", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwctBQcBp0VZ4S9eZ8CKw9e9zQXw-47a0pQ&s" },
  { id: 5, nombre: "Uvas", precio: 60, imagen: "https://cdn.unotv.com/images/2024/12/uvas-rojas-o-verdes-jpg-133446-1024x576.jpg" },
  { id: 6, nombre: "Manzana", precio: 60, imagen: "https://libera.pe/wp-content/uploads/2021/12/razonescomermanzana-int-1080x650.jpg" },
  { id: 1, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
  { id: 2, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },
  { id: 3, nombre: "Peras", precio: 60, imagen: "https://www.saborusa.com/cr/wp-content/uploads/sites/14/2023/12/propiedades-de-la-pera-salud-belleza.jpg" },
  { id: 4, nombre: "Mandarina", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwctBQcBp0VZ4S9eZ8CKw9e9zQXw-47a0pQ&s" },
  { id: 5, nombre: "Uvas", precio: 60, imagen: "https://cdn.unotv.com/images/2024/12/uvas-rojas-o-verdes-jpg-133446-1024x576.jpg" },
  { id: 6, nombre: "Manzana", precio: 60, imagen: "https://libera.pe/wp-content/uploads/2021/12/razonescomermanzana-int-1080x650.jpg" },
  { id: 3, nombre: "Peras", precio: 60, imagen: "https://www.saborusa.com/cr/wp-content/uploads/sites/14/2023/12/propiedades-de-la-pera-salud-belleza.jpg" },
  { id: 4, nombre: "Mandarina", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwctBQcBp0VZ4S9eZ8CKw9e9zQXw-47a0pQ&s" },
  { id: 5, nombre: "Uvas", precio: 60, imagen: "https://cdn.unotv.com/images/2024/12/uvas-rojas-o-verdes-jpg-133446-1024x576.jpg" },
  { id: 6, nombre: "Manzana", precio: 60, imagen: "https://libera.pe/wp-content/uploads/2021/12/razonescomermanzana-int-1080x650.jpg" },
];

const Fruta: React.FC = () => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [present] = useIonToast();

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

  return (
    <FruticaLayout>
      <IonContent className="content">
        <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Frutas</h2>

        <IonGrid>
          <IonRow className="product-grid">
            {productos.map((producto, index) => (
              <IonCol key={index} size="12" size-md="4" size-lg="auto">
                <IonCard className="product-card" routerLink="/producto">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="product-img"
                  />

                  <IonCardHeader className="product-info">
                    <div className="title-heart">
                      <IonCardTitle className="product-title">{producto.nombre}</IonCardTitle>
                      <IonIcon
                        icon={isInWishlist(producto.id) ? heart : heartOutline}
                        className="heart-icon"
                        style={{
                          color: isInWishlist(producto.id) ? "#FFB347"  : "orange",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClickHeart(producto);
                        }}
                      />
                    </div>
                    <p className="product-price">${producto.precio}.00 kg</p>
                  </IonCardHeader>


                  <IonCardContent>
                    <IonButton className="btn-greenstr" expand="block">
                      <IonIcon icon={addOutline} slot="start" />
                      Agregar
                    </IonButton>
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