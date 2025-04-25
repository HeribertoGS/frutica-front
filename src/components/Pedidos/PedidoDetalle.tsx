import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonContent } from '@ionic/react';
import FruticaLayout from '../../components/Layout/FruticaLayout';

import SolicitudEstado from './Estados/SolucitudEstado';
import AprobadoEstado from './Estados/AprobadoEstado';
import ConVariacionesEstado from './Estados/ConVariacionesEstado';
import RechazadoEstado from './Estados/RechazadoEstado';
import EnValidacionEstado from './Estados/EnValidacionEstado';
import EnPreparacionEstado from './Estados/EnPreparacionEstado';
import EnCaminoEstado from './Estados/EnCaminoEstado';
import FinalizadoEstado from './Estados/FinalizadoEstado';
import CanceladoEstado from './Estados/CanceladoEstado';

interface Producto {
  nombre: string;
  cantidad: string;
  precio: number;
  img: string;
}

type Pedido = {
  id: number;
  estado: string;
  estadoPago: string;
  metodoPago: string;
  total: number;
  tipoEntrega: string;
  fechaPedido: string;
  direccion: string;
  comentario: string;
  productos: Producto[];
};

const PedidoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    const productosEjemplo: Producto[] = [
      { nombre: 'Mandarina', cantidad: '10 kg', precio: 145, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4H8Xrnfzs-cwXvaCvfOdscQUrHlFODkmpAg&s' },
      { nombre: 'Berenjena', cantidad: '5 kg', precio: 100, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXljnQv48PBQh5JkswfrZRJmJwxUk48p3HQ&s' },
      { nombre: 'Morrón', cantidad: '3 kg', precio: 100, img: 'https://www.sportlife.es/uploads/s1/76/27/32/6/article-10-beneficios-deportivos-pimientos-morrones-57d8036f67393.jpeg' },
      { nombre: 'Pera', cantidad: '10 kg', precio: 145, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSgN12j6ol50X3Nz_w7Pmo3WiX1gB44pq9pA&s' },
      { nombre: 'Tomate', cantidad: '12 kg', precio: 145, img: 'https://150855064.v2.pressablecdn.com/wp-content/uploads/2020/09/tomate-1024x680-1.jpg' },
    ];

    const mockPedidos: Pedido[] = [
      { id: 145, estado: 'solicitado', estadoPago: 'pendiente', metodoPago: 'Transferencia', total: 1033, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: '', productos: productosEjemplo },
      { id: 146, estado: 'aprobado', estadoPago: 'pendiente', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: '', productos: productosEjemplo },
      { id: 147, estado: 'aprobado', estadoPago: 'pendiente', metodoPago: 'Tarjeta', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: '', productos: productosEjemplo },
      { id: 148, estado: 'aprobado', estadoPago: 'pendiente', metodoPago: 'Efectivo', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: '', productos: productosEjemplo },
      { id: 149, estado: 'con_variaciones', estadoPago: 'pendiente', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Tu pedido subio de precio ya que el tomate peso 100 gramos más', productos: productosEjemplo },
      { id: 150, estado: 'rechazado', estadoPago: 'pendiente', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Pago incompleto faltaron 25 pesos en la compra desea continuar y pagar el resto', productos: productosEjemplo },
      { id: 151, estado: 'en_validacion', estadoPago: 'En revision', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Pago incompleto faltaron 25 pesos en la compra desea continuar y pagar el resto', productos: productosEjemplo },
      { id: 152, estado: 'en_preparacion', estadoPago: 'Aceptado', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Pago incompleto faltaron 25 pesos en la compra desea continuar y pagar el resto', productos: productosEjemplo },
      { id: 153, estado: 'en_camino', estadoPago: 'Aceptado', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Pago incompleto faltaron 25 pesos en la compra desea continuar y pagar el resto', productos: productosEjemplo },
      { id: 154, estado: 'finalizado', estadoPago: 'Aceptado', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Pago incompleto faltaron 25 pesos en la compra desea continuar y pagar el resto', productos: productosEjemplo },
      { id: 155, estado: 'cancelado', estadoPago: 'Aceptado', metodoPago: 'Transferencia', total: 950, tipoEntrega: 'A domicilio', fechaPedido: '03 de enero del 2025', direccion: 'C. Gambusinos #8, Oaxaca', comentario: 'Pago incompleto faltaron 25 pesos en la compra desea continuar y pagar el resto', productos: productosEjemplo },
    ];

    const encontrado = mockPedidos.find(p => p.id === parseInt(id));
    if (encontrado) {
      setPedido(encontrado);
    }
  }, [id]);

  const renderContenido = () => {
    if (!pedido) return null;

    switch (pedido.estado) {
      case 'solicitado':
        return <SolicitudEstado pedido={pedido} />;
      case 'aprobado':
        return <AprobadoEstado pedido={pedido} />;
      case 'con_variaciones':
        return <ConVariacionesEstado pedido={pedido} />;
      case 'rechazado':
        return <RechazadoEstado pedido={pedido} />;
      case 'en_validacion':
        return <EnValidacionEstado pedido={pedido} />;
      case 'en_preparacion':
        return <EnPreparacionEstado pedido={pedido} />;
      case 'en_camino':
        return <EnCaminoEstado pedido={pedido} />;
      case 'finalizado':
        return <FinalizadoEstado pedido={pedido} />;
      case 'cancelado':
        return <CanceladoEstado pedido={pedido} />;
      default:
        return <p>Estado no reconocido.</p>;
    }
  };

  return (
    <IonPage>
      <FruticaLayout>
        <IonContent className="ion-padding">
          <h2 className="detalle-titulo">Información de la compra</h2>
          {renderContenido()}
        </IonContent>
      </FruticaLayout>
    </IonPage>
  );
};

export default PedidoDetalle;
