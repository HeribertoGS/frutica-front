import React from 'react';
import '../../pages/Fruta/fruta.css'; // Reutilizamos el CSS de frutas
import {
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { useCarrito } from '../../contexts/carritoContext';

const productosOferta = [
    {
        id: 101,
        nombre: 'Aguacate',
        precio: 45.0,
        unidad: 'KG',
        descuento: '50%',
        imagen: 'https://th.bing.com/th/id/R.d3522258fc2709b794e19d55ab0b4a43?rik=7tMcgAfAz7G3Kw&pid=ImgRaw&r=0',
    },
    {
        id: 102,
        nombre: 'Ajo 1ra',
        precio: 45.0,
        unidad: 'KG',
        descuento: '50%',
        imagen: 'https://tse4.mm.bing.net/th/id/OIP.od9GN6cMBZl0uuYQrJT9VQHaE4?rs=1&pid=ImgDetMain',
    },
    {
        id: 103,
        nombre: 'Papaya',
        precio: 45.0,
        unidad: 'KG',
        descuento: '50%',
        imagen: 'https://healthjade.com/wp-content/uploads/2017/12/Papaya.jpg',
    },
];

const Ofertas: React.FC = () => {
    const { agregarAlCarrito } = useCarrito();

    const handleAgregar = (producto: any) => {
        agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1,
        });
    };

    return (
        <FruticaLayout>
            <div className="ion-padding">
                <h2 className="titulo-frutas">Mejores ofertas</h2>
                <IonGrid className="product-grid">
                    <IonRow>
                        {productosOferta.map((producto, index) => (
                            <IonCol key={index} size="12" size-sm="6" size-md="4" size-lg="2">
                                <div className="product-card">
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="product-img"
                                    />

                                    <div className="product-info">
                                        <div className="fruta-title-heart">
                                            <div className="product-title">{producto.nombre}</div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#666', margin: '4px 0' }}>Local: Frutica</p>
                                        <div className="descuento-badge">-{producto.descuento}</div>
                                        <p className="product-price">${producto.precio.toFixed(2)}/{producto.unidad}</p>

                                        <IonButton
                                            size="small"
                                            className="fruta-btn-agregar"
                                            onClick={() => handleAgregar(producto)}
                                        >
                                            <IonIcon icon={addOutline} slot="start" />
                                            Agregar
                                        </IonButton>
                                    </div>
                                </div>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
            </div>
        </FruticaLayout>
    );
};

export default Ofertas;
