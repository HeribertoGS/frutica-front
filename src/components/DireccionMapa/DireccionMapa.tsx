import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { IonModal, IonButton } from '@ionic/react';
import React, { useState, useCallback } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const defaultCenter = {
    lat: 17.06,
    lng: -96.72,
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (coords: { lat: number; lng: number }) => void;
    direccion?: {
        lat?: number;
        lng?: number;
    };
}

const DireccionMapa: React.FC<Props> = ({ isOpen, onClose, onSelectLocation, direccion }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCcjNFR6pTiqE5FkWlAF3-FFcFVSOqCXtE',
    });

    const [position, setPosition] = useState<{ lat: number; lng: number }>(
        direccion?.lat !== undefined && direccion?.lng !== undefined
            ? { lat: direccion.lat, lng: direccion.lng }
            : defaultCenter
    );

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setPosition({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            });
        }
    }, []);

    if (!isLoaded) return <div style={{ padding: '16px' }}>Cargando mapa...</div>;

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h2>Selecciona tu ubicación exacta</h2>

                <div style={{ flex: 1 }}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={position}
                        zoom={15}
                        onClick={handleMapClick}
                    >
                        {/* Renderiza solo si lat/lng son válidos */}
                        {position.lat !== undefined && position.lng !== undefined && (
                            <Marker position={{ lat: position.lat, lng: position.lng }} />
                        )}
                    </GoogleMap>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <IonButton expand="block" color="success" onClick={() => onSelectLocation(position)}>
                        Usar esta ubicación
                    </IonButton>
                    <IonButton expand="block" color="medium" onClick={onClose}>
                        Cancelar
                    </IonButton>
                </div>
            </div>
        </IonModal>
    );
};

export default DireccionMapa;
