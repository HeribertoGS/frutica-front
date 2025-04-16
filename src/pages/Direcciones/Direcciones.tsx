import React, { useState } from 'react';
import {IonButton, IonCard, IonCardContent, IonContent,IonIcon,  IonModal} from '@ionic/react';
import {addCircleOutline, checkmarkCircleOutline, createOutline, locationOutline,trashOutline,} from 'ionicons/icons';
import './Direcciones.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import DireccionForm, { Direccion } from '../../components/DireccionForm/DireccionForm';
import DireccionMapa from '../../components/DireccionMapa/DireccionMapa';

type DireccionConCoord = Direccion & {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    lat?: number;
    lng?: number;
};

const Direcciones: React.FC = () => {
    const [direccionActual, setDireccionActual] = useState<number | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
    const [direccionAEditar, setDireccionAEditar] = useState<DireccionConCoord | null>(null);
    const [direccionTemp, setDireccionTemp] = useState<DireccionConCoord | null>(null);
    const [direcciones, setDirecciones] = useState<DireccionConCoord[]>([]);
    const [mostrarMapa, setMostrarMapa] = useState(false);

    const marcarComoActual = (id: number) => setDireccionActual(id);
    const eliminarDireccion = (id: number) =>
        setDirecciones((prev) => prev.filter((d) => d.id !== id));

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

    return (
        <FruticaLayout>
            <h2 className="titulo-direcciones">Mis direcciones</h2>

            <IonContent className="ion-padding">
                <div className="grid-direcciones">
                    {/* Agregar dirección */}
                    <div className="item-direccion">
                        <div className="card-agregar-direccion" onClick={abrirModalCrear}>
                            <IonIcon icon={addCircleOutline} className="icono-agregar" />
                            <div className="texto-agregar">Agregar dirección</div>
                        </div>
                    </div>

                    {/* Lista de direcciones */}
                    {direcciones.map((direccion) => (
                        <div className="item-direccion" key={direccion.id}>
                            <IonCard className={`direccion-card ${direccionActual === direccion.id ? 'predeterminada' : ''}`}>
                                <IonCardContent>
                                    <div className="direccion-header">
                                        <strong>{direccion.nombre} {direccion.apellido}</strong>
                                        <span className="telefono">Teléfono: {direccion.telefono}</span>
                                    </div>
                                    <p className="direccion-texto">
                                        <IonIcon icon={locationOutline} className="icono-ubicacion" />
                                        {`${direccion.calle} ${direccion.numero}, ${direccion.colonia}, ${direccion.municipio}, ${direccion.estado}, CP ${direccion.codigoPostal}. Referencias: ${direccion.referencias}`}
                                    </p>
                                    {direccion.lat !== undefined && direccion.lng !== undefined && (
                                        <p className="direccion-coordenadas">
                                            📍 Lat: {direccion.lat.toFixed(4)}, Lng: {direccion.lng.toFixed(4)}
                                        </p>
                                    )}
                                    <div className="botones-direccion">
                                        <IonButton color="danger" size="small" onClick={() => eliminarDireccion(direccion.id)}>
                                            <IonIcon icon={trashOutline} slot="start" />
                                            Eliminar
                                        </IonButton>
                                        <IonButton color="warning" size="small" onClick={() => abrirModalEditar(direccion)}>
                                            <IonIcon icon={createOutline} slot="start" />
                                            Editar
                                        </IonButton>
                                        <IonButton
                                            color="success"
                                            size="small"
                                            onClick={() => marcarComoActual(direccion.id)}
                                            fill={direccionActual === direccion.id ? 'solid' : 'outline'}
                                        >
                                            <IonIcon icon={checkmarkCircleOutline} slot="start" />
                                            {direccionActual === direccion.id ? 'Actual' : 'Elegir como ubicación actual'}
                                        </IonButton>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    ))}
                </div>
            </IonContent>

            {/* Modal con formulario */}
            <IonModal isOpen={mostrarFormulario} onDidDismiss={() => setMostrarFormulario(false)}>
                <div className="contenedor-modal">
                    <DireccionForm
                        modo={modoFormulario}
                        direccionInicial={direccionAEditar || undefined}
                        onCancelar={() => {
                            setMostrarFormulario(false);
                            setDireccionAEditar(null);
                        }}
                        onGuardar={(direccionNueva) => {
                            const id = modoFormulario === 'crear' ? Date.now() : direccionAEditar!.id;
                            const direccionCompleta: DireccionConCoord = {
                                ...direccionNueva,
                                id,
                                nombre: 'Nombre demo',
                                apellido: 'Apellido demo',
                                telefono: direccionNueva.telefono,
                            };

                            setDireccionTemp(direccionCompleta);
                            setMostrarFormulario(false);
                            setMostrarMapa(true);
                        }}
                    />
                </div>
            </IonModal>

            {/* Modal de mapa */}
            {direccionTemp && (
                <DireccionMapa
                    isOpen={mostrarMapa}
                    direccion={direccionTemp}
                    onClose={() => setMostrarMapa(false)}
                    onSelectLocation={({ lat, lng }) => {
                        const direccionFinal = { ...direccionTemp, lat, lng };
                        if (modoFormulario === 'crear') {
                            setDirecciones((prev) => [...prev, direccionFinal]);
                        } else {
                            setDirecciones((prev) =>
                                prev.map((d) => (d.id === direccionFinal.id ? direccionFinal : d))
                            );
                        }
                        setMostrarMapa(false);
                        setDireccionTemp(null);
                    }}
                />
            )}
        </FruticaLayout>
    );
};

export default Direcciones;
