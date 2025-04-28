import React, { useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonImg, IonSegment, IonSegmentButton, IonLabel, IonIcon,
  IonItem, IonSelect, IonSelectOption, useIonToast
} from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useIsMobile } from '../../hooks/useIsMobile';
import { agregarProductoAlCarrito, obtenerProductoPorId } from '../../service/api';
import { useParams } from 'react-router-dom';

interface ProductoCardProps {
  id: number;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ id }) => {
  const [producto, setProducto] = useState<any>(null);
  const [unidad, setUnidad] = useState<'pieza' | 'kg'>('pieza');
  const [cantidad, setCantidad] = useState(1);
  const [tamano, setTamano] = useState<'Chico' | 'Mediano' | 'Grande' | null>(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [present] = useIonToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await obtenerProductoPorId(id);
        setProducto(data);
        if (data.unidad_venta) setUnidad(data.unidad_venta);
      } catch (err) {
        console.error('Error al obtener producto:', err);
      }
    };
    cargarProducto();
  }, [id]);

  if (!producto) return <p style={{ textAlign: 'center' }}>Cargando producto...</p>;

  const precio = unidad === 'kg' && producto.precio_por_kg
    ? producto.precio_por_kg
    : producto.precio_por_pieza || 0;

  const pesoSeleccionado = producto.usa_tamano && tamano
    ? tamano === 'Chico' ? producto.peso_chico
      : tamano === 'Mediano' ? producto.peso_mediano
      : producto.peso_grande
    : null;

  const precioFinal = cantidad * precio;

  const handleAgregar = async () => {
    try {
      await agregarProductoAlCarrito({
        productoId: producto.producto_k,
        cantidad,
        tipo_medida: unidad,
        tamano: producto.usa_tamano ? (tamano ?? undefined) : undefined,
        peso_personalizado: undefined,
      });
  
      present({
        message: 'Producto agregado al carrito',
        duration: 1200,
        color: 'success',
      });
    } catch (err) {
      console.error('❌ Error al agregar:', err);
      present({
        message: 'No se pudo agregar al carrito',
        duration: 1500,
        color: 'danger',
      });
    }
  };
  

  const imagenes = producto.foto?.length ? producto.foto : [
    'https://via.placeholder.com/500x300?text=Sin+imagen'
  ];

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <IonCard style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px' }}>
        <IonCardHeader style={{ textAlign: 'center' }}>
          <IonCardTitle style={{ fontSize: '28px', fontWeight: 'bold' }}>{producto.nombre}</IonCardTitle>
          <p style={{ fontSize: '14px', color: '#555' }}>{producto.descripcion || 'Sin descripción'}</p>
        </IonCardHeader>

        {isMobile ? (
          <>
            <Swiper style={{ width: '100%', borderRadius: '12px', marginBottom: '10px', maxHeight: '320px' }}>
              {imagenes.map((img: string, i: number) => (
                <SwiperSlide key={i}>
                  <IonImg src={img} alt={`img-${i}`} style={{ objectFit: 'cover', height: '280px' }} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '12px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {precio ? `$${precio} por ${unidad}` : 'Precio no disponible'}
              </p>

              <IonSegment value={unidad} onIonChange={e => setUnidad(e.detail.value as 'pieza' | 'kg')}>
                <IonSegmentButton value="pieza"><IonLabel>Pieza</IonLabel></IonSegmentButton>
                <IonSegmentButton value="kg"><IonLabel>KG</IonLabel></IonSegmentButton>
              </IonSegment>

              {producto.usa_tamano && (
                <IonItem>
                  <IonLabel position="stacked">Tamaño</IonLabel>
                  <IonSelect value={tamano} onIonChange={(e) => setTamano(e.detail.value)}>
                    <IonSelectOption value="Chico">Chico</IonSelectOption>
                    <IonSelectOption value="Mediano">Mediano</IonSelectOption>
                    <IonSelectOption value="Grande">Grande</IonSelectOption>
                  </IonSelect>
                </IonItem>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '16px 0' }}>
                <IonButton onClick={() => setCantidad(Math.max(1, cantidad - 1))} color="light"><IonIcon icon={remove} /></IonButton>
                <span>{cantidad}</span>
                <IonButton onClick={() => setCantidad(cantidad + 1)} color="light"><IonIcon icon={add} /></IonButton>
              </div>

              <IonButton expand="block" color="success" onClick={handleAgregar}>Agregar al carrito</IonButton>
              <div style={{ marginTop: '10px', textAlign: 'right' }}><strong>Precio:</strong> ${precioFinal.toFixed(2)}</div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', maxHeight: '500px' }}>
              {imagenes.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setImagenActiva(i)}
                  style={{ width: 70, height: 70, objectFit: 'cover', border: i === imagenActiva ? '2px solid red' : '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' }}
                />
              ))}
            </div>

            <div>
              <img
                src={imagenes[imagenActiva]}
                alt="Producto grande"
                style={{ borderRadius: '12px', maxWidth: '750px', maxHeight: '450px', width: '100%', objectFit: 'contain' }}
              />
              <div style={{ marginTop: '14px', fontSize: '15px', color: '#444' }}>
                <p><strong>Proveedor:</strong> {producto.proveedor || 'Sin proveedor'}</p>
                <p><strong>Unidad de venta:</strong> {producto.unidad_venta}</p>
              </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '12px', width: '400px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {precio ? `$${precio} por ${unidad}` : 'Precio no disponible'}
              </p>

              <IonSegment value={unidad} onIonChange={e => setUnidad(e.detail.value as 'pieza' | 'kg')}>
                <IonSegmentButton value="pieza"><IonLabel>Pieza</IonLabel></IonSegmentButton>
                <IonSegmentButton value="kg"><IonLabel>KG</IonLabel></IonSegmentButton>
              </IonSegment>

              {producto.usa_tamano && (
                <IonItem>
                  <IonLabel position="stacked">Tamaño</IonLabel>
                  <IonSelect value={tamano} onIonChange={(e) => setTamano(e.detail.value)}>
                    <IonSelectOption value="Chico">Chico</IonSelectOption>
                    <IonSelectOption value="Mediano">Mediano</IonSelectOption>
                    <IonSelectOption value="Grande">Grande</IonSelectOption>
                  </IonSelect>
                </IonItem>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '16px 0' }}>
                <IonButton onClick={() => setCantidad(Math.max(1, cantidad - 1))} color="light"><IonIcon icon={remove} /></IonButton>
                <span>{cantidad}</span>
                <IonButton onClick={() => setCantidad(cantidad + 1)} color="light"><IonIcon icon={add} /></IonButton>
              </div>

              <IonButton expand="block" color="success" onClick={handleAgregar}>Agregar al carrito</IonButton>
              <div style={{ marginTop: '10px', textAlign: 'right' }}><strong>Precio:</strong> ${precioFinal.toFixed(2)}</div>
            </div>
          </div>
        )}
      </IonCard>
    </div>
  );
};

export default ProductoCard;
