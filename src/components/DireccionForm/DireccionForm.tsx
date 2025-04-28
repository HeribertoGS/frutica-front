import React, { useState, useEffect } from 'react';
import { IonButton, IonInput, useIonToast } from '@ionic/react';
import './DireccionForm.css';

export interface Direccion {
  calle: string;
  numero: string;
  colonia: string;
  municipio: string;
  estado: string;
  cp: string;
  pais: string;
  referencia: string;
  telefono: string;
  maps_url?: string;
  lat?: number;
  lng?: number;
}

interface DireccionFormProps {
  modo: 'crear' | 'editar';
  direccionInicial?: Direccion;
  onCancelar: () => void;
  onGuardar: (direccion: Direccion) => void;
}

const DireccionForm: React.FC<DireccionFormProps> = ({ modo, direccionInicial, onCancelar, onGuardar }) => {
  const [presentToast] = useIonToast();

  const [form, setForm] = useState<Direccion>({
    calle: '',
    numero: '',
    colonia: '',
    municipio: '',
    estado: 'Oaxaca',
    cp: '',
    pais: 'Mexico',
    referencia: '',
    telefono: '',
  });

  const [camposVacios, setCamposVacios] = useState<(keyof Direccion)[]>([]);

  useEffect(() => {
    if (direccionInicial) {
      setForm(direccionInicial);
    }
  }, [direccionInicial]);

  const handleChange = (field: keyof Direccion, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCodigoPostal = async (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 5);
    setForm(prev => ({ ...prev, cp: soloNumeros }));

    if (soloNumeros.length === 5) {
      try {
        const response = await fetch(`https://api.copomex.com/query/info_cp/${soloNumeros}?token=5db2d8bd-ebe4-4302-8123-a9a50748dfe3`);
        const data = await response.json();
        const resultado = data?.response;
        if (resultado?.municipio && resultado?.estado) {
          setForm(prev => ({
            ...prev,
            municipio: resultado.municipio,
            estado: resultado.estado,
          }));
        } else {
          presentToast({ message: 'Código postal no válido', duration: 2000, color: 'warning' });
        }
      } catch (error) {
        presentToast({ message: 'Error consultando COPOMEX', duration: 2000, color: 'danger' });
      }
    }
  };

  const handleSubmit = () => {
    const obligatorios: (keyof Direccion)[] = ['calle', 'numero', 'colonia', 'cp', 'telefono'];
    const vacios = obligatorios.filter(campo => !form[campo] || (campo === 'cp' && form[campo].length !== 5));

    setCamposVacios(vacios);

    if (vacios.length > 0) {
      presentToast({
        message: 'Por favor completa todos los campos obligatorios.',
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    onGuardar(form);
  };

  return (
    <div className="formulario-direccion">
      <h3 className="titulo-formulario">{modo === 'crear' ? 'Agregar dirección' : 'Editar dirección'}</h3>
      <div className="contenedor-campos">
        <div className="columna">
          <IonInput
            label="Calle:"
            value={form.calle}
            placeholder="Ingresa el nombre de tu calle"
            onIonChange={(e) => handleChange('calle', e.detail.value!)}
            className={camposVacios.includes('calle') ? 'input-error' : ''}
          />
          <IonInput
            label="Colonia:"
            value={form.colonia}
            placeholder="Ingresa tu colonia"
            onIonChange={(e) => handleChange('colonia', e.detail.value!)}
            className={camposVacios.includes('colonia') ? 'input-error' : ''}
          />
          <IonInput
            label="Municipio:"
            value={form.municipio}
            readonly
            placeholder="(Se llena automáticamente)"
          />
          <IonInput
            label="Referencias:"
            value={form.referencia}
            placeholder="Opcional"
            onIonChange={(e) => handleChange('referencia', e.detail.value!)}
          />
        </div>

        <div className="columna">
          <IonInput
            label="Número:"
            value={form.numero}
            type="number"
            placeholder="Número exterior"
            onIonChange={(e) => handleChange('numero', e.detail.value!)}
            className={camposVacios.includes('numero') ? 'input-error' : ''}
          />
          <IonInput
            label="Código Postal:"
            inputMode="numeric"
            value={form.cp}
            maxlength={5}
            placeholder="Ej. 68000"
            onIonChange={(e) => handleCodigoPostal(e.detail.value || '')}
            className={camposVacios.includes('cp') ? 'input-error' : ''}
          />
          <IonInput
            label="Estado:"
            value={form.estado}
            readonly
          />
          <IonInput
            label="Teléfono:"
            inputMode="tel"
            value={form.telefono}
            maxlength={10}
            placeholder="Ej. 9511234567"
            onIonChange={(e) => handleChange('telefono', (e.detail.value || '').replace(/\D/g, '').slice(0, 10))}
            className={!form.telefono || form.telefono.length !== 10 ? 'input-error' : ''}
          />
        </div>
      </div>

      <div className="botones-formulario">
        <IonButton color="warning" onClick={onCancelar}>Volver</IonButton>
        <IonButton color="success" onClick={handleSubmit}>Guardar y seleccionar ubicación</IonButton>
      </div>
    </div>
  );
};

export default DireccionForm;
