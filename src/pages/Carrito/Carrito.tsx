import { IonButton, IonCard, IonCardContent, IonContent, IonPage, IonImg } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { trashOutline, add, remove } from 'ionicons/icons';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import './Carrito.css';
import { useState } from 'react';

const productos = [
    {
        nombre: 'Mandarina',
        local: 'Frutica',
        precioTotal: '$45.00/KG',
        imagen: '/src/assets/img/durazno1.jpg',
    },
    {
        nombre: 'Berenjena',
        local: 'Frutica',
        precioTotal: '$100.00/KG',
        imagen: '/src/assets/img/durazno1.jpg',
    },
    {
        nombre: 'Morron',
        local: 'Frutica',
        precioTotal: '$100.00/KG',
        imagen: '/src/assets/img/pera.png',
    },
];

const Carrito: React.FC = () => {
    const [productos, setProductos] = useState([
        {
            nombre: 'Mandarina',
            local: 'Frutica',
            precioTotal: '$45.00/KG',
            imagen: '/src/assets/img/durazno1.jpg',
        },
        {
            nombre: 'Berenjena',
            local: 'Frutica',
            precioTotal: '$100.00/KG',
            imagen: '/src/assets/img/durazno1.jpg',
        },
        {
            nombre: 'Morron',
            local: 'Frutica',
            precioTotal: '$100.00/KG',
            imagen: '/src/assets/img/pera.png',
        },
    ]);

    const [cantidades, setCantidades] = useState<number[]>(productos.map(() => 1));

    const aumentar = (i: number) => {
        const nuevas = [...cantidades];
        nuevas[i]++;
        setCantidades(nuevas);
    };

    const disminuir = (i: number) => {
        const nuevas = [...cantidades];
        if (nuevas[i] > 1) nuevas[i]--;
        setCantidades(nuevas);
    };

    const eliminarProducto = (index: number) => {
        const nuevosProductos = productos.filter((_, i) => i !== index);
        const nuevasCantidades = cantidades.filter((_, i) => i !== index);
        setProductos(nuevosProductos);
        setCantidades(nuevasCantidades);
    };

    const calcularTotal = () => {
        return productos.reduce((total, producto, index) => {
            const precio = parseFloat(producto.precioTotal.replace(/[^0-9.]/g, ''));
            return total + precio * cantidades[index];
        }, 0).toFixed(2);
    };

    return (
        <FruticaLayout>
            <div className="carrito-wrapper">
                <div className="carrito-lista">
                    <h2 className="carrito-titulo centrado">Carrito de compras</h2>

                    {productos.map((p, i) => {
                        const precioUnitario = parseFloat(p.precioTotal.replace(/[^0-9.]/g, ''));
                        const precioTotal = (precioUnitario * cantidades[i]).toFixed(2);

                        return (
                            <IonCard key={i} className="producto-card">
                                <IonCardContent className="producto-card-content">
                                    <div className="producto-horizontal">
                                        <img src={p.imagen} className="producto-imagen-lateral" alt={p.nombre} />

                                        <div className="producto-info">
                                            <strong className="producto-nombre">{p.nombre}</strong>
                                            <p className="producto-descripcion">
                                                Disfruta de nuestras {p.nombre.toLowerCase()} frescas, sin conservantes.
                                                Perfectas para snacks y postres.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="producto-precio-box">
                                        <div className="producto-precio-top">
                                            <strong>${precioTotal} Kg</strong>
                                            <IonButton fill="clear" size="small" color="dark" onClick={() => eliminarProducto(i)}>
                                                <IonIcon icon={trashOutline} />
                                            </IonButton>
                                        </div>
                                        <div className="producto-contador">
                                            <div className="contador-box">
                                                <IonButton size="small" fill="clear" onClick={() => disminuir(i)}>
                                                    <IonIcon icon={remove} />
                                                </IonButton>
                                                <span>{cantidades[i]}</span>
                                                <IonButton size="small" fill="clear" onClick={() => aumentar(i)}>
                                                    <IonIcon icon={add} />
                                                </IonButton>
                                            </div>
                                        </div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        );
                    })}
                </div>

                {/* 💳 Resumen */}
                <div className="carrito-resumen resumen-centrado">
                    <h3>Resumen</h3>
                    <div className="carrito-resumen-card">
                        <div className="resumen-item">
                            <span>Subtotal ({productos.length} productos)</span>
                            <span>${calcularTotal()}</span>
                        </div>
                        <hr />
                        <div className="resumen-item resumen-total">
                            <span><strong>Total</strong></span>
                            <span><strong>${calcularTotal()}</strong></span>
                        </div>
                    </div>
                    <IonButton expand="block" color="danger" className="boton-comprar">
                        Ir a Pagar
                    </IonButton>
                </div>
            </div>
        </FruticaLayout>
    );
};

export default Carrito;
