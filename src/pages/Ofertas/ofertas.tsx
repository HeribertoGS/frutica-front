import React, { useEffect, useState } from 'react';
import './ofertas.css';
import {
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    useIonToast
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { useCarrito } from '../../contexts/carritoContext';
import { obtenerOfertasActivas } from '../../service/api'; // <- 👈 conectamos API

const Ofertas: React.FC = () => {
    const { agregarAlCarrito } = useCarrito();
    const [ofertas, setOfertas] = useState<any[]>([]);
    const [present] = useIonToast();

    useEffect(() => {
        const cargarOfertas = async () => {
            try {
                const data = await obtenerOfertasActivas();
                setOfertas(data);
            } catch (error) {
                console.error('❌ Error al cargar ofertas:', error);
                present({ message: 'Error al cargar ofertas', duration: 2000, color: 'danger' });
            }
        };

        cargarOfertas();
    }, []);

    const handleAgregar = (producto: any) => {
        agregarAlCarrito({
            id: producto.producto.producto_k,
            nombre: producto.producto.nombre,
            precio: producto.precio_oferta,
            imagen: producto.producto.foto?.[0] || '',
            cantidad: 1,
        });
        present({ message: 'Producto agregado al carrito', duration: 1200, color: 'success' });
    };

    return (
        <FruticaLayout>
            <div className="ion-padding">
                <h2 className="ofertas-titulo-principal">Mejores ofertas</h2>
                <IonGrid className="ofertas-product-grid">
                    <IonRow>
                        {ofertas.map((oferta, index) => (
                            <IonCol key={index} size="12" size-sm="6" size-md="4" size-lg="2">
                                <div className="ofertas-product-card">
                                    <img
                                        src={oferta.producto.foto?.[0] || 'https://via.placeholder.com/150'}
                                        alt={oferta.producto.nombre}
                                        className="ofertas-product-img"
                                    />

                                    <div className="ofertas-product-info">
                                        <div className="fruta-title-heart">
                                            <div className="ofertas-product-title">{oferta.producto.nombre}</div>
                                        </div>
                                        <p className="ofertas-product-local">Local: Frutica</p>
                                        <div className="ofertas-product-descuento">-{oferta.porcentaje_descuento || 0}%</div>
                                        <p className="ofertas-product-price">
                                            ${oferta.precio_oferta.toFixed(2)}/{oferta.producto.unidad_venta}
                                        </p>

                                        <IonButton
                                            size="small"
                                            className="ofertas-btn-agregar"
                                            onClick={() => handleAgregar(oferta)}
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
