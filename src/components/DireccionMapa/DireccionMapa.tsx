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
    municipio?: string;
    estado?: string;
  };
  redirigirA?: string;
}

const DireccionMapa: React.FC<Props> = ({ isOpen, onClose, onSelectLocation, direccion, redirigirA }) => {
  const history = useHistory();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCW4laHb9ldKwqNeQxfY1NPeO0frm_lGfM', // Tu API Key de Google Maps
  });

  const [position, setPosition] = useState<{ lat: number; lng: number }>(defaultCenter);

  // ⚡ Esta función busca coordenadas si solo hay municipio y estado (cuando cambias CP)
  const buscarCoordenadasDesdeTexto = async (municipio: string, estado: string) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(municipio + ', ' + estado)}&key=AIzaSyCW4laHb9ldKwqNeQxfY1NPeO0frm_lGfM`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    } catch (error) {
      console.error('Error buscando coordenadas:', error);
      return null;
    }
  };

  // ⚡ Esta función extrae latitud y longitud de una URL de Google Maps
  const extraerCoordsDeUrl = (url: string): { lat: number; lng: number } | null => {
    const match = url.match(/q=([-\d.]+),([-\d.]+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  };

  // 🧠 Cuando cambia la dirección
  useEffect(() => {
    const cargarCoordenadas = async () => {
      if (direccion?.lat !== undefined && direccion?.lng !== undefined && isFinite(direccion.lat) && isFinite(direccion.lng)) {
        setPosition({ lat: direccion.lat, lng: direccion.lng });
      } else if (direccion?.maps_url) {
        const coords = extraerCoordsDeUrl(direccion.maps_url);
        if (coords) {
          setPosition(coords);
        } else {
          setPosition(defaultCenter);
        }
      } else if (direccion?.municipio && direccion?.estado) {
        const coords = await buscarCoordenadasDesdeTexto(direccion.municipio, direccion.estado);
        if (coords) {
          setPosition(coords);
        } else {
          setPosition(defaultCenter);
        }
      } else {
        setPosition(defaultCenter);
      }
    };

    cargarCoordenadas();
  }, [direccion]);

  // 🧠 Cuando haces click en el mapa
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
              onClose(); // 🔥 Cerrar modal después de seleccionar
            }}
          >
            Usar esta ubicación
          </IonButton>

          <IonButton
            expand="block"
            color="medium"
            style={{ marginTop: '10px' }}
            onClick={onClose}
          >
            Cancelar
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
};

export default DireccionMapa;
