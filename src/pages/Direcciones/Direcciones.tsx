import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonContent, IonIcon, IonModal } from '@ionic/react';
import { addCircleOutline, checkmarkCircleOutline, createOutline, locationOutline, trashOutline, eyeOutline } from 'ionicons/icons';
import './Direcciones.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import DireccionForm, { Direccion } from '../../components/DireccionForm/DireccionForm';
import DireccionMapa from '../../components/DireccionMapa/DireccionMapa';
import { obtenerMisDirecciones, eliminarDireccion as eliminarDireccionApi, marcarDireccionPredeterminada, editarDireccion, guardarDireccion } from '../../service/api';
import { getUserSession } from '../../service/secureStorage';
import { useIonToast } from '@ionic/react';
import { useLocation } from 'react-router';

type DireccionConCoord = Direccion & { direccion_k: number };

const Direcciones: React.FC = () => {
  const [direccionActual, setDireccionActual] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
  const [direccionTemp, setDireccionTemp] = useState<DireccionConCoord | null>(null);
  const [direccionAEditar, setDireccionAEditar] = useState<DireccionConCoord | null>(null);
  const [direcciones, setDirecciones] = useState<DireccionConCoord[]>([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [present] = useIonToast();

  const cargarDirecciones = async () => {
    try {
      const token = await getUserSession();
      if (!token) return;
      const data = await obtenerMisDirecciones(token);
      setDirecciones(data);
      const predet = data.find((d: any) => d.predeterminada === true);
      if (predet) setDireccionActual(predet.direccion_k);
    } catch (error) {
      console.error('Error cargando direcciones:', error);
    }
  };
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const origen = query.get('origen');


useEffect(() => {
  const cargarDirecciones = async () => {
    try {
      const token = await getUserSession();
      if (!token) return;
      const data = await obtenerMisDirecciones(token);
      setDirecciones(data);
      const predet = data.find((d: any) => d.predeterminada === true);
      if (predet) setDireccionActual(predet.direccion_k);

      // 🚀 Revisar si hay que regresar al flujo de compra
      if (localStorage.getItem('volver_a_compra') && origen !== 'compra') {
        localStorage.removeItem('volver_a_compra');
        window.location.href = '/compra?paso=2';
      }
      
    } catch (error) {
      console.error('Error cargando direcciones:', error);
    }
  };

  cargarDirecciones();
}, [location.search]);

  /**Verificar user efect de arriba */

  const eliminarDireccion = async (id: number) => {
    try {
      const token = await getUserSession();
      if (!token) return;
      await eliminarDireccionApi(id, token);
      await cargarDirecciones();
      present({ message: 'Dirección eliminada', color: 'success', duration: 2000 });
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      present({ message: 'Error eliminando dirección', color: 'danger', duration: 2000 });
    }
  };

  const marcarComoActual = async (id: number) => {
    try {
      const token = await getUserSession();
      if (!token) return;
      await marcarDireccionPredeterminada(id, token);
      await cargarDirecciones();
      present({ message: 'Dirección marcada como predeterminada', color: 'success', duration: 2000 });
  
      // 🚀 NUEVO: si venías de compra, redirigir de regreso
      const origen = new URLSearchParams(window.location.search).get('origen');
      if (origen === 'compra') {
        localStorage.removeItem('volver_a_compra');
        window.location.href = '/compra?paso=2';
      }
    } catch (error) {
      console.error('Error al marcar como predeterminada:', error);
      present({ message: 'Error marcando como predeterminada', color: 'danger', duration: 2000 });
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
              <IonCard className={`direccion-card ${direccionActual === direccion.direccion_k ? 'predeterminada' : ''}`}>
                <IonCardContent>
                  <div className="direccion-header">
                    <strong>{direccion.calle}</strong>
                    <span className="telefono">Tel: {direccion.telefono}</span>
                  </div>
                  <p className="direccion-texto">
                    <IonIcon icon={locationOutline} className="icono-ubicacion" />
                    {`${direccion.calle} ${direccion.numero}, ${direccion.colonia}, ${direccion.municipio}, ${direccion.estado}, CP ${direccion.cp}. Referencias: ${direccion.referencia}`}
                  </p>
                  <div className="botones-direccion">
                    <IonButton color="danger" size="small" onClick={() => eliminarDireccion(direccion.direccion_k)}>
                      <IonIcon icon={trashOutline} slot="start" />Eliminar
                    </IonButton>
                    <IonButton color="warning" size="small" onClick={() => abrirModalEditar(direccion)}>
                      <IonIcon icon={createOutline} slot="start" />Editar
                    </IonButton>
                    <IonButton color="medium" size="small" onClick={() => abrirMapaVerUbicacion(direccion)}>
                      <IonIcon icon={eyeOutline} slot="start" />Ver ubicación
                    </IonButton>
                    <IonButton color="success" size="small" onClick={() => marcarComoActual(direccion.direccion_k)} fill={direccionActual === direccion.direccion_k ? 'solid' : 'outline'}>
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      {direccionActual === direccion.direccion_k ? 'Actual' : 'Elegir como actual'}
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          ))}
        </div>
      </IonContent>

      {/* Modal formulario */}
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
                const token = await getUserSession();
                if (!token) return;

                if (modoFormulario === 'crear') {
                  const nuevaDireccion = await guardarDireccion({
                    calle: direccion.calle,
                    numero: direccion.numero,
                    colonia: direccion.colonia,
                    municipio: direccion.municipio,
                    estado: direccion.estado,
                    cp: direccion.cp,
                    pais: direccion.pais,
                    referencia: direccion.referencia,
                    localidad: '',
                    maps_url: '',
                    latitud: 0,
                    longitud: 0,
                    es_publica: false,
                  }, token);

                  setDireccionTemp({
                    ...direccion,
                    direccion_k: nuevaDireccion.direccion_k,
                    municipio: nuevaDireccion.municipio,
                    estado: nuevaDireccion.estado,
                  });

                  setMostrarFormulario(false);
                  setMostrarMapa(true);
                } else {
                  // modo editar
                  await editarDireccion(direccionAEditar!.direccion_k, {
                    calle: direccion.calle,
                    numero: direccion.numero,
                    colonia: direccion.colonia,
                    municipio: direccion.municipio,
                    estado: direccion.estado,
                    cp: direccion.cp,
                    pais: direccion.pais,
                    referencia: direccion.referencia,
                  }, token);

                  present({ message: 'Dirección actualizada.', color: 'success', duration: 2000 });
                  setMostrarFormulario(false);
                  cargarDirecciones();
                }

              } catch (error) {
                console.error('Error al guardar/editar dirección:', error);
                present({ message: 'Error al guardar/editar dirección', color: 'danger', duration: 2000 });
              }
            }}
          />
        </div>
      </IonModal>

      {/* Modal mapa */}
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
              const token = await getUserSession();
              if (!token) return;

              await editarDireccion(direccionTemp.direccion_k, { latitud: lat, longitud: lng, maps_url }, token);
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
    </FruticaLayout>
  );
};

export default Direcciones;
