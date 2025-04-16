import { IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, useIonToast, } from "@ionic/react";
import { heartOutline, heart, addOutline, } from "ionicons/icons";
import '../../global.css';
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useWishlist } from "../../contexts/WishlistContext";
const initialProductos = [
    { id: 1, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
    { id: 2, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },
    { id: 3, nombre: "Peras", precio: 60, imagen: "https://www.saborusa.com/cr/wp-content/uploads/sites/14/2023/12/propiedades-de-la-pera-salud-belleza.jpg" },
    { id: 4, nombre: "Mandarina", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwctBQcBp0VZ4S9eZ8CKw9e9zQXw-47a0pQ&s" },
];

const ListaDeseos: React.FC = () => {
    const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
    const [present] = useIonToast();

    const handleToggle = (producto: any) => {
        toggleWishlist(producto);
        present({
            message: `${producto.nombre} fue eliminado de la lista de deseos`,
            duration: 1500,
            color: "medium",
        });
    };

    return (
        <FruticaLayout>
            <IonContent fullscreen className="content">
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>Lista de deseos</h2>
                <IonGrid>
                    <IonRow className="product-grid">
                        {wishlist.length === 0 ? (
                            <p style={{ marginLeft: "16px" }}>No hay productos en tu lista de deseos.</p>
                        ) : (
                            wishlist.map((producto, index) => (
                                <IonCol key={index} size="12" size-md="4" size-lg="auto">
                                    <IonCard className="product-card" routerLink="/producto">
                                        <img src={producto.imagen} alt={producto.nombre} className="product-img" />

                                        <IonCardHeader className="product-info">
                                            <div className="title-heart">
                                                <IonCardTitle className="product-title">{producto.nombre}</IonCardTitle>
                                                <IonIcon
                                                    icon={isInWishlist(producto.id) ? heart : heartOutline}
                                                    className={`heart-icon ${isInWishlist(producto.id) ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleToggle(producto);
                                                    }}
                                                />
                                            </div>
                                            <p className="product-price">${producto.precio}.00 kg</p>
                                        </IonCardHeader>

                                        <IonCardContent>
                                            <IonButton className="btn-greenstr" expand="block">
                                                <IonIcon icon={addOutline} slot="start" />
                                                Agregar al carrito
                                            </IonButton>
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