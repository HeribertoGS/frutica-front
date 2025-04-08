// MandarinaCard.tsx
import React, { useState } from 'react';
import { IonButton, IonCard, IonCardHeader, IonCardTitle,  IonCardContent,  IonImg,  IonSegment, IonSegmentButton,  IonLabel,IonIcon,} from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useIsMobile } from '../../hooks/useIsMobile';



const ProductoCard: React.FC = () => {
    // Estado para unidad de venta: 'pieza' o 'kg'
    const [unidad, setUnidad] = useState<'pieza' | 'kg'>('pieza');
    // Estado para cantidad seleccionada
    const [cantidad, setCantidad] = useState(1);
    // Estado para la imagen activa en vista escritorio
    const [imagenActiva, setImagenActiva] = useState(0);
    // Detectar si el dispositivo es móvil
    const isMobile = useIsMobile();

    const imagenes = [
        "https://www.mexicodesconocido.com.mx/wp-content/uploads/2019/09/mandarina.jpg",
        "https://www.allnaturalbilbao.com/wp-content/uploads/2020/11/01284B58-8141-417D-BEBB-A1AC77C36734.jpeg",
        "https://diarioroatan.com/wp-content/uploads/2018/10/mandarinas-1.jpg",
        "https://super-masymas.com/wp-content/uploads/2021/01/tangerines-on-branch-scaled.jpg",
        "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/filefield_paths/datos-sobre-la-mandarina-en-mexico-6_0.jpg",
    ];

    const precioPorKg = 30;
    const precioPorPieza = 6;
    const totalKg = unidad === 'pieza' ? cantidad * 1 : cantidad;
    const precioFinal = unidad === 'pieza' ? cantidad * precioPorPieza : cantidad * precioPorKg;

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <IonCard style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
                {/* === CABECERA DEL PRODUCTO === */}
                <IonCardHeader style={{ textAlign: 'center' }}>
                    <IonCardTitle style={{ fontSize: '28px', fontWeight: 'extrabold' }}>Mandarinas</IonCardTitle>
                    <p style={{ fontSize: '14px', color: '#555' }}>
                        Las mejores mandarinas de la ciudad de Huajuapan de León a la puerta de tu casa se entregará esto un buen
                    </p>
                </IonCardHeader>

                {/* === VISTA MÓVIL === */}
                {isMobile ? (
                    <>
                        {/* Carrusel de imágenes */}
                        <Swiper
                            style={{ width: '100%', borderRadius: '12px', marginBottom: '10px', maxHeight: '320px' }}>
                            {imagenes.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <IonImg
                                        src={img}
                                        alt={`Mandarina ${i + 1}`}
                                        style={{ objectFit: 'cover', borderRadius: '12px', height: '280px' }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Sección de interacción */}
                        <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '12px' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
                                {unidad === 'pieza' ? '$6.00 por pieza' : '$30.00 por kg'}
                            </p>

                            {/* Segmento para elegir unidad */}
                            <IonSegment value={unidad} onIonChange={e => setUnidad(e.detail.value as 'pieza' | 'kg')}>
                                <IonSegmentButton value="pieza">
                                    <IonLabel>Pieza</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value="kg">
                                    <IonLabel>KG</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>

                            {/* Contador de cantidad */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
                                <IonButton onClick={() => setCantidad(Math.max(1, cantidad - 1))} color="light">
                                    <IonIcon icon={remove} />
                                </IonButton>
                                <span style={{ fontSize: '18px' }}>{cantidad}</span>
                                <IonButton onClick={() => setCantidad(cantidad + 1)} color="light">
                                    <IonIcon icon={add} />
                                </IonButton>
                            </div>

                            {/* Cantidad total seleccionada */}
                            <div style={{ backgroundColor: '#ddd', padding: '8px', borderRadius: '8px', textAlign: 'center', marginBottom: '10px' }}>
                                {unidad === 'pieza' ? `${cantidad} Pieza(s)` : `${totalKg} Kilogramo(s)`}
                            </div>

                            {/* Botón y total */}
                            <IonButton expand="block" color="success">
                                Agregar al carrito
                            </IonButton>
                            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                <strong>Precio:</strong> ${precioFinal.toFixed(2)}
                            </div>
                        </div>
                    </>
                ) : (
                    // === VISTA ESCRITORIO ===
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
                        {/* Miniaturas */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '500px' }}>
                            {imagenes.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`thumb-${i}`}
                                    onClick={() => setImagenActiva(i)}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: 'cover',
                                        border: i === imagenActiva ? '2px solid red' : '1px solid #ccc',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Imagen grande */}
                        <div>
                            <img
                                src={imagenes[imagenActiva]}
                                alt="Producto grande"
                                style={{ borderRadius: '12px', maxWidth: '750px', maxHeight: '450px', width: '100%', objectFit: 'contain' }}
                            />
                            <div style={{ marginTop: '14px', fontSize: '15px', color: '#444' }}>
                                <p><strong>Color:</strong> Naranja</p>
                                <p><strong>Proveedor:</strong> Huajuapan Market</p>
                                <p><strong>Tamaño:</strong> Mediano</p>
                            </div>
                        </div>

                        {/* Card de interacción */}
                        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '12px', width: '400px' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
                                {unidad === 'pieza' ? '$6.00 por pieza' : '$30.00 por kg'}
                            </p>

                            <IonSegment value={unidad} onIonChange={e => setUnidad(e.detail.value as 'pieza' | 'kg')}>
                                <IonSegmentButton value="pieza">
                                    <IonLabel>Pieza</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value="kg">
                                    <IonLabel>KG</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
                                <IonButton onClick={() => setCantidad(Math.max(1, cantidad - 1))} color="light">
                                    <IonIcon icon={remove} />
                                </IonButton>
                                <span style={{ fontSize: '18px' }}>{cantidad}</span>
                                <IonButton onClick={() => setCantidad(cantidad + 1)} color="light">
                                    <IonIcon icon={add} />
                                </IonButton>
                            </div>

                            <div style={{ backgroundColor: '#ddd', padding: '8px', borderRadius: '8px', textAlign: 'center', marginBottom: '10px' }}>
                                {unidad === 'pieza' ? `${cantidad} Pieza(s)` : `${totalKg} Kilogramo(s)`}
                            </div>

                            <IonButton expand="block" color="success">
                                Agregar al carrito
                            </IonButton>

                            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                                <strong>Precio:</strong> ${precioFinal.toFixed(2)}
                            </div>
                        </div>
                    </div>
                )}
            </IonCard>
        </div>
    );
};

export default ProductoCard;
