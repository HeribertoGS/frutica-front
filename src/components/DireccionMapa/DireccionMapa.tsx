/*import React, { useEffect, useRef, useState } from 'react';
import { IonButton } from '@ionic/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './DireccionMapa.css';
import { LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LeafletEvent } from 'leaflet';

// Icono del marcador
const icon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface Props {
    onGuardar: (coords: { lat: number; lng: number }) => void;
    onCancelar: () => void;
}

const DireccionMapa: React.FC<Props> = ({ onGuardar, onCancelar }) => {
    const [coordenadas, setCoordenadas] = useState({ lat: 17.06, lng: -96.72 });
    const mapRef = useRef<LeafletMap | null>(null);

    // Forzar redibujado del mapa cuando se monta
    useEffect(() => {
        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        }, 300);
    }, []);

    const ClickMapHandler = () => {
        useMapEvents({
            click(e: LeafletMouseEvent) {
                setCoordenadas(e.latlng);
            }
        });
        return null;
    };

    return (
        <div className="mapa-container">
            <h2>Agregar dirección exacta</h2>

            <MapContainer
                center={[coordenadas.lat, coordenadas.lng]}
                zoom={15}
                scrollWheelZoom={false}
                className="mapa-leaflet"
                whenReady={(event) => {
                    mapRef.current = event.target;
                  }}>
                <ClickMapHandler />
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coordenadas.lat, coordenadas.lng]} icon={icon} />
            </MapContainer>

            <IonButton expand="block" color="success" onClick={() => onGuardar(coordenadas)}>
                Guardar
            </IonButton>
            <IonButton expand="block" color="warning" onClick={onCancelar}>
                Volver
            </IonButton>
        </div>
    );
};

export default DireccionMapa;*/
