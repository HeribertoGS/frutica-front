import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { IonModal, IonButton } from '@ionic/react';
import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './DireccionMapa.css';

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
  onSelectLocation: (coords: { lat: number; lng: number; maps_url: string }) => void;
  direccion?: {
    lat?: number;
    lng?: number;
    maps_url?: string;
  };
  redirigirA?: string;
}

const DireccionMapa: React.FC<Props> = ({ isOpen, onClose, onSelectLocation, direccion, redirigirA }) => {
  const history = useHistory();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCW4laHb9ldKwqNeQxfY1NPeO0frm_lGfM', // tu clave
  });

  const [position, setPosition] = useState<{ lat: number; lng: number }>(defaultCenter);

  const extraerCoordsDeUrl = (url: string): { lat: number; lng: number } | null => {
    const match = url.match(/q=([-\d.]+),([-\d.]+)/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
    }
    return null;
  };

  useEffect(() => {
    if (direccion?.lat !== undefined && direccion?.lng !== undefined) {
      setPosition({ lat: direccion.lat, lng: direccion.lng });
    } else if (direccion?.maps_url) {
      const coords = extraerCoordsDeUrl(direccion.maps_url);
      if (coords) setPosition(coords);
    }
  }, [direccion]);

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
            <Marker position={position} />
          </GoogleMap>
        </div>

        <div style={{ marginTop: '16px' }}>
          <IonButton
            expand="block"
            color="success"
            onClick={() => {
              const maps_url = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
              onSelectLocation({ ...position, maps_url });
              if (redirigirA) {
                history.push(redirigirA);
              }
            }}
          >
            Usar esta ubicación
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
};

export default DireccionMapa;
