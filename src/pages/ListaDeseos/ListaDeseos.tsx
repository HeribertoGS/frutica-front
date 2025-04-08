import {
    IonPage,
    IonContent,
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
import {
    heartOutline,
    heart,
    addOutline,
} from "ionicons/icons";
import '../../global.css';
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useState } from "react";

const initialProductos = [
    { id: 1, nombre: "Fresas", precio: 60, imagen: "https://www.gob.mx/cms/uploads/article/main_image/30427/fresa-blog.jpg" },
    { id: 2, nombre: "Duraznos", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMOSRUPupDzll7ZKsYKsGhr_X5ZSIQp-ApA&s" },
    { id: 3, nombre: "Peras", precio: 60, imagen: "https://www.saborusa.com/cr/wp-content/uploads/sites/14/2023/12/propiedades-de-la-pera-salud-belleza.jpg" },
    { id: 4, nombre: "Mandarina", precio: 60, imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxwctBQcBp0VZ4S9eZ8CKw9e9zQXw-47a0pQ&s" },
];

const ListaDeseos: React.FC = () => {
    const [productos, setProductos] = useState(initialProductos);
    const [eliminados, setEliminados] = useState<number[]>([]);

    const eliminarDeDeseos = (id: number) => {
        setEliminados([...eliminados, id]);
        setTimeout(() => {
            setProductos(prev => prev.filter(p => p.id !== id));
        }, 500); // permite animación si deseas
    };

    return (
        <FruticaLayout>
                <IonContent fullscreen className="content">
                    <h2>Lista de deseos</h2>
                    <IonGrid>
                        <IonRow className="product-grid">
                            {productos.map((producto) => (
                                <IonCol size="12" size-md="4" size-lg="auto" key={producto.id}>
                                    <IonCard className="product-card" routerLink="/producto">
                                        <img src={producto.imagen} alt={producto.nombre} className="product-img" />

                                        <IonCardHeader className="product-info">
                                            <IonCardTitle className="product-title">{producto.nombre}</IonCardTitle>

                                            <IonIcon
                                                icon={eliminados.includes(producto.id) ? heartOutline : heart}
                                                className={`heart-icon ${eliminados.includes(producto.id) ? 'removed' : 'active'}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    eliminarDeDeseos(producto.id);
                                                }}
                                            />

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
        </FruticaLayout>
    );
};

export default ListaDeseos;
