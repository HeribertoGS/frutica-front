import React, { useState } from 'react';
import {
  IonSelect, IonSelectOption, IonItem, IonLabel, IonList,
  IonButton, IonIcon
} from '@ionic/react';
import {
  trashOutline, pencilOutline,
  checkmarkCircleOutline, closeCircleOutline
} from 'ionicons/icons';

import './productosCrear.css';
import ProductosCrear from './productosCrear';
import CategoriasCrear from './categoriasCrear';
import OfertaCrear from './ofertaCrear';
import FruticaLayout from '../../components/Layout/FruticaLayout';

type FormTipo = 'productos' | 'categorias' | 'ofertas';

const Forms: React.FC = () => {
  const [formActual, setFormActual] = useState<FormTipo>('productos');
  const [registros, setRegistros] = useState<any[]>([
    { id: 1, nombre: 'Producto A', activo: true },
    { id: 2, nombre: 'Producto B', activo: false },
  ]);
  const [nextId, setNextId] = useState<number>(3);
  const [registroEditar, setRegistroEditar] = useState<any | null>(null);

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

  const agregarRegistro = (data: any) => {
    if (registroEditar) {
      setRegistros(prev =>
        prev.map(r => r.id === registroEditar.id ? { ...registroEditar, ...data } : r)
      );
      setRegistroEditar(null);
    } else {
      setRegistros(prev => [...prev, { ...data, id: nextId }]);
      setNextId(prev => prev + 1);
    }
  };

  const renderFormulario = () => {
    const props = { onGuardar: agregarRegistro, registroEditar };
    switch (formActual) {
      case 'productos':
        return <ProductosCrear {...props} />;
      case 'categorias':
        return <CategoriasCrear {...props} />;
      case 'ofertas':
        return <OfertaCrear {...props} />;
      default:
        return null;
    }
  };

  return (
    <FruticaLayout>
      <div className="form-prod-scroll">
        {/* Formulario y selector */}
        <div className="form-prod-container">
          <IonList className="form-prod-lista">
            <IonItem>
              <IonLabel position="stacked">Seleccionar tipo de formulario</IonLabel>
              <IonSelect
                value={formActual}
                onIonChange={(e) => {
                  setFormActual(e.detail.value);
                  setRegistroEditar(null);
                }}
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

        {/* Tabla de registros */}
        <div style={{ margin: '40px auto 80px', maxWidth: '900px', padding: '0 16px' }}>
          <h3 className="form-prod-titulo">Registros de ejemplo</h3>

          <div className="tabla-registros">
            <div className="tabla-header">
              <span>Nombre</span>
              <span>Estado</span>
              <span>Editar</span>
              <span>Eliminar</span>
            </div>

            {registros.map(reg => (
              <div key={reg.id} className="tabla-fila">
                <span>{reg.nombre}</span>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <IonButton
                    size="small"
                    color={reg.activo ? 'success' : 'medium'}
                    onClick={() => alternarActivo(reg.id)}
                  >
                    <IonIcon icon={reg.activo ? checkmarkCircleOutline : closeCircleOutline} />
                  </IonButton>
                </span>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <IonButton size="small" className="btn-editar-icon" onClick={() => setRegistroEditar(reg)}>
                    <IonIcon icon={pencilOutline} />
                  </IonButton>
                </span>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <IonButton size="small" className="btn-eliminar-icon" onClick={() => eliminar(reg.id)}>
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FruticaLayout>
  );
};

export default Forms;
