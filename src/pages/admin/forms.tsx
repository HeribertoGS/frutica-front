import React, { useState } from 'react';
import {
  IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonButton, IonIcon
} from '@ionic/react';
import {
  trashOutline,
  pencilOutline,
  checkmarkCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';

import './productosCrear.css';
import ProductosCrear from './productosCrear';
import CategoriasCrear from './categoriasCrear';
import OfertaCrear from './ofertaCrear';
import FruticaLayout from '../../components/Layout/FruticaLayout';

type FormTipo = 'productos' | 'categorias' | 'ofertas';

const Forms: React.FC = () => {
  const [formActual, setFormActual] = useState<FormTipo>('productos');

  // Simulación de registros
  const [registros, setRegistros] = useState<any[]>([
    { id: 1, nombre: 'Ejemplo A', activo: true },
    { id: 2, nombre: 'Ejemplo B', activo: false },
  ]);

  const eliminar = (id: number) => {
    setRegistros(prev => prev.filter(reg => reg.id !== id));
  };

  const alternarActivo = (id: number) => {
    setRegistros(prev =>
      prev.map(reg =>
        reg.id === id ? { ...reg, activo: !reg.activo } : reg
      )
    );
  };

  const renderFormulario = () => {
    switch (formActual) {
      case 'productos':
        return <ProductosCrear />;
      case 'categorias':
        return <CategoriasCrear />;
      case 'ofertas':
        return <OfertaCrear />;
      default:
        return null;
    }
  };

  return (
    <FruticaLayout>
      <div className="form-prod-scroll">
        {/* CONTENEDOR DEL FORMULARIO */}
        <div className="form-prod-container">
          <IonList className="form-prod-lista">
            <IonItem>
              <IonLabel position="stacked">Seleccionar tipo de formulario</IonLabel>
              <IonSelect
                value={formActual}
                onIonChange={(e) => setFormActual(e.detail.value)}
              >
                <IonSelectOption value="productos">Productos</IonSelectOption>
                <IonSelectOption value="categorias">Categorías</IonSelectOption>
                <IonSelectOption value="ofertas">Ofertas</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          <div style={{ marginTop: '20px' }}>
            {renderFormulario()}
          </div>
        </div>

        {/* REGISTROS DE EJEMPLO */}
        <div style={{ margin: '40px auto 60px', maxWidth: '700px', padding: '0 12px' }}>
          <h3 className="form-prod-titulo">Registros de ejemplo</h3>
          {registros.map((reg) => (
            <div
              key={reg.id}
              className="form-prod-lista"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #ccc',
              }}
            >
              <span>{reg.nombre}</span>
              <div>
                <IonButton
                  size="small"
                  color={reg.activo ? 'success' : 'medium'}
                  onClick={() => alternarActivo(reg.id)}
                >
                  <IonIcon icon={reg.activo ? checkmarkCircleOutline : closeCircleOutline} />
                </IonButton>
                <IonButton size="small" color="primary">
                  <IonIcon icon={pencilOutline} />
                </IonButton>
                <IonButton
                  size="small"
                  color="danger"
                  onClick={() => eliminar(reg.id)}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FruticaLayout>
  );
};

export default Forms;
