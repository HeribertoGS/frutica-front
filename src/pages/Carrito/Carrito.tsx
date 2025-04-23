import {
    IonButton,
    IonIcon
} from '@ionic/react';
import { trashOutline, add, remove } from 'ionicons/icons';
import { useState } from 'react';
import './Carrito.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { useCarrito } from '../../contexts/carritoContext';
import { useHistory } from 'react-router-dom';


const Carrito: React.FC = () => {
    const { carrito, eliminarDelCarrito, actualizarCantidad } = useCarrito();

    const aumentar = (id: number, actual: number) => {
        actualizarCantidad(id, actual + 1);
    };

    const disminuir = (id: number, actual: number) => {
        if (actual > 1) actualizarCantidad(id, actual - 1);
    };

    const calcularTotal = () => {
        return carrito.reduce((total, p) => total + (p.precio * p.cantidad), 0).toFixed(2);
    };

    const history = useHistory();


    return (
        <FruticaLayout>
            <div className="carrito-container">
                <h2 className="carrito-titulo">Carrito de compras</h2>
                <div className="carrito-grid">
                    <div className="carrito-lista">
                        {carrito.map((p, i) => (
                            <div className="carrito-item" key={p.id}>
                                <img src={p.imagen} className="carrito-imagen" alt={p.nombre} />

                                <div className="carrito-detalle">
                                    <h3>{p.nombre}</h3>
                                    <p>
                                        Disfruta de nuestras {p.nombre.toLowerCase()} frescas, sin conservantes. Perfectas para snacks y postres.
                                    </p>

                                    <div className="carrito-precio-box">
                                        <strong>${p.precio}.00/KG</strong>

                                        <div className="carrito-controles">
                                            <IonButton fill="solid" className="contador-boton" onClick={() => disminuir(p.id, p.cantidad)}>
                                                <IonIcon icon={remove} />
                                            </IonButton>
                                            <span className="contador-numero">{p.cantidad}</span>
                                            <IonButton fill="solid" className="contador-boton" onClick={() => aumentar(p.id, p.cantidad)}>
                                                <IonIcon icon={add} />
                                            </IonButton>
                                        </div>

                                        <IonButton fill="solid" className="eliminar-boton" onClick={() => eliminarDelCarrito(p.id)}>
                                            <IonIcon icon={trashOutline} />
                                        </IonButton>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            className="boton-pagars"
                            disabled={carrito.length === 0}
                            onClick={() => history.push('/metodpago')}
                        >
                            IR A PAGAR
                        </IonButton>


                    </div>
                </div>
            </div>
        </FruticaLayout>
    );
};

export default Carrito;

