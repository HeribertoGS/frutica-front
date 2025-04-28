import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, useIonToast } from '@ionic/react';
import { useParams } from 'react-router-dom';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import { obtenerPedidoPorId, cambiarEstadoPedido } from '../../service/api';
import { getUserRole } from '../../service/secureStorage';

import SolicitudEstado from './Estados/SolucitudEstado';
import AprobadoEstado from './Estados/AprobadoEstado';
import ConVariacionesEstado from './Estados/ConVariacionesEstado';
import RechazadoEstado from './Estados/RechazadoEstado';
import EnValidacionEstado from './Estados/EnValidacionEstado';
import EnPreparacionEstado from './Estados/EnPreparacionEstado';
import EnCaminoEstado from './Estados/EnCaminoEstado';
import FinalizadoEstado from './Estados/FinalizadoEstado';
import CanceladoEstado from './Estados/CanceladoEstado';

import './HistorialPedidos.css';
import './Detalles.css';

interface Producto {
  nombre: string;
  cantidad: string;
  precio: number;
  img: string;
}

interface Pedido {
  pedido_k: number;
  estado: string;
  total: number;
  fecha_pedido: string;
  formaPago?: { nombre_forma: string };
  tipoEntrega?: { metodo_entrega: string; direccion?: { calle: string; numero: string; colonia: string; municipio: string; estado: string; cp: string } };
  pagos?: { estado: string; metodo: string }[];
  detalles?: { productoNombre: string; cantidad: number; precioUnitario: number; img: string }[];
  comentario?: { descripcion: string };
}

const PedidoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [rolUsuario, setRolUsuario] = useState<string | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');
  const [presentarToast] = useIonToast();

  useEffect(() => {
    cargarPedido();
  }, [id]);

  const cargarPedido = async () => {
    try {
      const role = await getUserRole();
      setRolUsuario(role);
      const data = await obtenerPedidoPorId(Number(id));
      setPedido(data);
    } catch (error) {
      console.error('❌ Error cargando pedido:', error);
    }
  };

  const handleActualizarEstado = async (estado: string) => {
    if (!estado || !pedido) {
      presentarToast({
        message: '⚠️ Por favor selecciona un estado válido.',
        duration: 2000,
        color: 'warning',
      });
      return;
    }
  
    try {
      console.log('Cambiando estado a:', estado);
      
      // Para estados que podrían requerir comentario
      let comentario = null;
      if (['rechazado', 'cancelado', 'con_variaciones'].includes(estado)) {
        // Opcional: podrías pedir un comentario al usuario
        // Por ahora usamos uno genérico para pruebas
        comentario = "Cambio de estado realizado por admin";
      }
      
      await cambiarEstadoPedido(pedido.pedido_k, estado);
      
      presentarToast({
        message: '✅ Estado actualizado correctamente.',
        duration: 2000,
        color: 'success',
      });
      setNuevoEstado('');
      await cargarPedido(); // Recargar el pedido para reflejar cambios
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      presentarToast({
        message: `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        duration: 3000,
        color: 'danger',
      });
    }
  };
  const obtenerOpcionesCambioEstado = (estadoActual: string, metodoPago: string, estadoPago: string): string[] => {
    switch (estadoActual) {
      case 'solicitado':
        return ['aprobado', 'con_variaciones']; // Corregido para coincidir con el backend
      case 'con_variaciones':
        return ['aprobado', 'cancelado'];
      case 'aprobado':
        if (metodoPago === 'transferencia') return ['en_validacion'];
        if (metodoPago === 'tarjeta' && estadoPago === 'realizado') return ['en_preparacion'];
        if (metodoPago === 'efectivo') return ['en_preparacion'];
        // Si no cumple ninguna condición específica
        return ['en_validacion', 'en_preparacion']; // Opciones generales
      case 'en_validacion':
        return ['en_preparacion', 'rechazado'];
      case 'en_preparacion':
        return ['en_camino', 'entregado', 'cancelado'];
      case 'en_camino':
        return ['entregado'];
      case 'entregado':
        return ['finalizado'];
      default:
        return [];
    }
  };

  const renderContenido = () => {
    if (!pedido) return null;

    const direccionCompleta = pedido.tipoEntrega?.direccion
      ? `${pedido.tipoEntrega.direccion.calle} ${pedido.tipoEntrega.direccion.numero}, ${pedido.tipoEntrega.direccion.colonia}, ${pedido.tipoEntrega.direccion.municipio}, ${pedido.tipoEntrega.direccion.estado}, CP ${pedido.tipoEntrega.direccion.cp}`
      : 'Dirección no disponible';

    const pedidoAdaptado = {
      id: pedido.pedido_k,
      estado: pedido.estado,
      estadoPago: pedido.pagos?.[0]?.estado || 'pendiente',
      metodoPago: pedido.formaPago?.nombre_forma || 'Desconocido',
      total: pedido.total,
      tipoEntrega: pedido.tipoEntrega?.metodo_entrega || 'Desconocido',
      fechaPedido: new Date(pedido.fecha_pedido).toLocaleDateString(),
      direccion: direccionCompleta,
      comentario: pedido.comentario?.descripcion || '',
      productos: pedido.detalles?.map((d) => ({
        nombre: d.productoNombre,
        cantidad: `${d.cantidad} kg`,
        precio: d.precioUnitario,
        img: d.img || '/assets/img/fruta.png',
      })) || [],
    };

    switch (pedidoAdaptado.estado) {
      case 'solicitado': return <SolicitudEstado pedido={pedidoAdaptado} />;
      case 'aprobado': return <AprobadoEstado pedido={pedidoAdaptado} />;
      case 'con_variaciones': return <ConVariacionesEstado pedido={pedidoAdaptado} />;
      case 'rechazado': return <RechazadoEstado pedido={pedidoAdaptado} />;
      case 'en_validacion': return <EnValidacionEstado pedido={pedidoAdaptado} />;
      case 'en_preparacion': return <EnPreparacionEstado pedido={pedidoAdaptado} />;
      case 'en_camino': return <EnCaminoEstado pedido={pedidoAdaptado} />;
      case 'finalizado': return <FinalizadoEstado pedido={pedidoAdaptado} />;
      case 'cancelado': return <CanceladoEstado pedido={pedidoAdaptado} />;
      default: return <p>Estado no reconocido</p>;
    }
  };

  const opcionesCambio = pedido
    ? obtenerOpcionesCambioEstado(
        pedido.estado,
        pedido.formaPago?.nombre_forma || '',
        pedido.pagos?.[0]?.estado || ''
      )
    : [];

  return (
    <IonPage>
      <FruticaLayout>
        <IonContent className="ion-padding">
          <h2 className="detalle-titulo">Información de la compra</h2>
          {renderContenido()}

          {rolUsuario === 'admin' && pedido && opcionesCambio.length > 0 && (
            <div className="opciones-cambio-estado">
              <h3>Cambiar estado a:</h3>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="select-estado"
              >
                <option value="">Selecciona una opción</option>
                {opcionesCambio.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <button
                className="btn-cambiar-estado"
                onClick={() => handleActualizarEstado(nuevoEstado)}
              >
                Actualizar estado
              </button>
            </div>
          )}
        </IonContent>
      </FruticaLayout>
    </IonPage>
  );
};

export default PedidoDetalle;
