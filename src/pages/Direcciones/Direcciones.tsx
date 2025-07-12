import React, { useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonContent, IonIcon, IonModal
} from '@ionic/react';
import {
  addCircleOutline, checkmarkCircleOutline, createOutline,
  locationOutline, trashOutline, eyeOutline
} from 'ionicons/icons';
import './Direcciones.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import DireccionForm, { Direccion } from '../../components/DireccionForm/DireccionForm';
import DireccionMapa from '../../components/DireccionMapa/DireccionMapa';
import {
  obtenerMisDirecciones,
  eliminarDireccion,
  marcarDireccionPredeterminada,
  editarDireccion,
  guardarDireccion
} from '../../service/api';
import { useIonToast } from '@ionic/react';
import { useLocation } from 'react-router';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
type DireccionConCoord = {
  direccion_k: number;
  es_predeterminada: boolean;
  latitud?: number;
  longitud?: number;
  maps_url?: string;
  municipio: string;
  estado: string;
} & Direccion;


const Direcciones: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [direccionTemp, setDireccionTemp] = useState<DireccionConCoord | null>(null);
  const [direccionAEditar, setDireccionAEditar] = useState<DireccionConCoord | null>(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);
  const [idDireccionAEliminar, setIdDireccionAEliminar] = useState<number | null>(null);
  const [direcciones, setDirecciones] = useState<DireccionConCoord[]>([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [present] = useIonToast();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const origen = query.get('origen');

  const cargarDirecciones = async () => {
    try {
      const data: DireccionConCoord[] = await obtenerMisDirecciones();
      setDirecciones(data);

      const predet = data.find(d => d.es_predeterminada);
      if (predet) {
        localStorage.setItem('direccionPredeterminada', JSON.stringify(predet));
      } else {
        localStorage.removeItem('direccionPredeterminada');
      }

      if (localStorage.getItem('volver_a_compra') && origen !== 'compra') {
        localStorage.removeItem('volver_a_compra');
        window.location.href = '/compra?paso=2';
      }
    } catch (error) {
      console.error('Error cargando direcciones:', error);
      present({ message: 'Error al cargar direcciones', color: 'danger', duration: 2000 });
    }
  };

  useEffect(() => {
    const handler = () => cargarDirecciones();
    window.addEventListener('direccionPredeterminadaCambiada', handler);

    return () => {
      window.removeEventListener('direccionPredeterminadaCambiada', handler);
    };
  }, []);

  useEffect(() => {
    cargarDirecciones();
  }, [location.search]);

  const eliminar = async (id: number) => {
    try {
      await eliminarDireccion(id);
      await cargarDirecciones();
      present({ message: 'Dirección eliminada', color: 'success', duration: 2000 });
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      present({ message: 'Error eliminando dirección', color: 'danger', duration: 2000 });
    }
  };

  const marcarComoActual = async (id: number) => {
    try {
      await marcarDireccionPredeterminada(id);
      setDirecciones(prev => prev.map(d => ({
        ...d,
        es_predeterminada: d.direccion_k === id
      })));

      const nuevaPredeterminada = direcciones.find(d => d.direccion_k === id);
      if (nuevaPredeterminada) {
        localStorage.setItem('direccionPredeterminada', JSON.stringify(nuevaPredeterminada));
        window.dispatchEvent(new CustomEvent('direccionPredeterminadaCambiada'));
      }

      present({ message: 'Dirección marcada como predeterminada', color: 'success', duration: 2000 });

      if (origen === 'compra') {
        localStorage.removeItem('volver_a_compra');
        window.location.href = '/compra?paso=2';
      }
    } catch (error) {
      console.error('Error al marcar como predeterminada:', error);
      present({ message: 'Error marcando como predeterminada', color: 'danger', duration: 2000 });
      cargarDirecciones();
    }
  };

  const abrirModalCrear = () => {
    setModoFormulario('crear');
    setDireccionAEditar(null);
    setMostrarFormulario(true);
  };

  const abrirModalEditar = (direccion: DireccionConCoord) => {
    setModoFormulario('editar');
    setDireccionAEditar(direccion);
    setMostrarFormulario(true);
  };

  const abrirMapaVerUbicacion = (direccion: DireccionConCoord) => {
    setDireccionTemp(direccion);
    setMostrarMapa(true);
  };

  return (
    <FruticaLayout>
      <IonContent className="ion-padding">
        <h2 className="titulo-direcciones">Mis direcciones</h2>

        <div className="grid-direcciones">
          <div className="item-direccion">
            <div className="card-agregar-direccion" onClick={abrirModalCrear}>
              <IonIcon icon={addCircleOutline} className="icono-agregar" />
              <div className="texto-agregar">Agregar dirección</div>
            </div>
          </div>

          {direcciones.map((direccion) => (
            <div className="item-direccion" key={direccion.direccion_k}>
              <IonCard className={`direccion-card ${direccion.es_predeterminada ? 'predeterminada' : ''}`}>
                <IonCardContent>
                  <div className="direccion-header">
                    <strong>{direccion.calle}</strong>
                    {direccion.es_predeterminada && (
                      <span className='etiqueta-predeterminada'>Predeterminada</span>
                    )}
                  </div>
                  <p className="direccion-texto">
                    <IonIcon icon={locationOutline} className="icono-ubicacion" />
                    {`${direccion.calle} ${direccion.numero}, ${direccion.colonia}, ${direccion.municipio}, ${direccion.estado}, CP ${direccion.cp}. Referencias: ${direccion.referencia}`}
                  </p>
                  <div className="botones-direccion">
                    <IonButton color="danger" size="small" onClick={() => {
                      setIdDireccionAEliminar(direccion.direccion_k);
                      setMostrarConfirmEliminar(true);
                    }}>
                      <IonIcon icon={trashOutline} slot="start" />Eliminar
                    </IonButton>
                    <IonButton color="warning" size="small" onClick={() => abrirModalEditar(direccion)}>
                      <IonIcon icon={createOutline} slot="start" />Editar
                    </IonButton>
                    <IonButton color="medium" size="small" onClick={() => abrirMapaVerUbicacion(direccion)}>
                      <IonIcon icon={eyeOutline} slot="start" />Ver ubicación
                    </IonButton>
                    <IonButton
                      color="success"
                      size="small"
                      onClick={() => marcarComoActual(direccion.direccion_k)}
                      fill={direccion.es_predeterminada ? 'solid' : 'outline'}
                    >
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      {direccion.es_predeterminada ? 'Actual' : 'Elegir como actual'}
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          ))}
        </div>
      </IonContent>

      <IonModal isOpen={mostrarFormulario} onDidDismiss={() => setMostrarFormulario(false)}>
        <div className="contenedor-modal">
          <DireccionForm
            modo={modoFormulario}
            direccionInicial={direccionAEditar || undefined}
            onCancelar={() => {
              setMostrarFormulario(false);
              setDireccionAEditar(null);
            }}
            onGuardar={async (direccion) => {
              try {
                if (modoFormulario === 'crear') {
                  const { es_predeterminada, ...direccionLimpia } = direccion;

                  const nueva = await guardarDireccion({
                    ...direccionLimpia,
                    maps_url: '',
                    latitud: 0,
                    longitud: 0,
                    es_publica: false
                  });

                  setDireccionTemp({
                    ...direccion,
                    direccion_k: nueva.direccion_k,
                    municipio: nueva.municipio,
                    estado: nueva.estado,
                    latitud: nueva.latitud,
                    longitud: nueva.longitud,
                    maps_url: nueva.maps_url,
                    es_predeterminada: nueva.es_predeterminada ?? false
                  });

                  setMostrarFormulario(false);
                  setMostrarMapa(true);
                  await cargarDirecciones();

                } else {
                  await editarDireccion(direccionAEditar!.direccion_k, direccion);

                  setDireccionTemp({
                    ...direccion,
                    direccion_k: direccionAEditar!.direccion_k,
                    municipio: direccion.municipio,
                    estado: direccion.estado,
                    es_predeterminada: direccionAEditar!.es_predeterminada,
                    latitud: undefined,
                    longitud: undefined,
                    maps_url: undefined
                  });

                  setMostrarFormulario(false);
                  setMostrarMapa(true);
                  present({ message: 'Dirección actualizada. Selecciona la ubicación en el mapa.', color: 'success', duration: 2000 });
                }
              } catch (error) {
                console.error('Error al guardar/editar dirección:', error);
                present({ message: 'Error al guardar/editar dirección', color: 'danger', duration: 2000 });
              }
            }}
          />
        </div>
      </IonModal>

      {direccionTemp && (
        <DireccionMapa
          isOpen={mostrarMapa}
          direccion={direccionTemp}
          onClose={() => {
            setMostrarMapa(false);
            setDireccionTemp(null);
          }}
          onSelectLocation={async ({ lat, lng, maps_url }) => {
            try {
              await editarDireccion(direccionTemp.direccion_k, { latitud: lat, longitud: lng, maps_url });
              await cargarDirecciones();
              present({ message: 'Ubicación actualizada.', color: 'success', duration: 2000 });
              setMostrarMapa(false);
              setDireccionTemp(null);
            } catch (error) {
              console.error('Error actualizando ubicación:', error);
              present({ message: 'Error actualizando ubicación', color: 'danger', duration: 2000 });
            }
          }}
        />
      )}

      <ConfirmDialog
        isOpen={mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(false)}
        onConfirm={() => {
          if (idDireccionAEliminar !== null) {
            eliminar(idDireccionAEliminar);
          }
          setMostrarConfirmEliminar(false);
        }}
        mensaje="¿Deseas eliminar esta dirección?"
        detalle="Se eliminará la dirección de forma permanente."
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
      />
    </FruticaLayout>
  );
};

export default Direcciones;