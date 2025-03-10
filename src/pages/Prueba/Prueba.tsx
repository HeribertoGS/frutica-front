import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/react";
import { menuOutline, heartOutline, arrowBackOutline, addOutline } from "ionicons/icons";
import "./Prueba.css"; // Solo para pequeños ajustes

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

const PruebaFrutas: React.FC = () => {
  return (
    <IonPage>
      {/* 🟢 Barra superior bien alineada */}
      <IonHeader>
        <IonToolbar className="ion-toolbar"> 
          <IonButton slot="start" fill="clear" className="btn-green">
            <IonIcon icon={menuOutline} size="large" />
          </IonButton>

          {/* 🟡 Barra de búsqueda centrada */}
          <div className="search-container">
            <IonSearchbar placeholder="Buscar frutas o verduras"></IonSearchbar>
          </div>

          <IonButton slot="end" fill="clear" className="btn-green">
            <IonIcon icon={arrowBackOutline} size="large" />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      {/* 🍏 Contenido */}
      <IonContent fullscreen className="content">
        <h2>Frutas</h2>
        <IonGrid>
        <IonRow className="product-grid">
            {productos.map((producto) => (
              <IonCol size="12" size-md="4" size-lg="auto" key={producto.id}>
              <IonCard className="product-card">
                  {/* 🖼️ Imagen del Producto */}
                  <img src={producto.imagen} alt={producto.nombre} className="product-img" />

                  <IonCardHeader className="product-info">
                    <IonCardTitle className="product-title">{producto.nombre}</IonCardTitle>
                    <IonIcon icon={heartOutline} className="heart-icon" />
                    <p className="product-price">${producto.precio}.00 kg</p>
                  </IonCardHeader>
                  <IonCardContent>
                  <IonButton className="btn-greenstr">
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
    </IonPage>
  );
};

export default PruebaFrutas;
