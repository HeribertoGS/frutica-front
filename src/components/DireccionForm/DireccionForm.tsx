import React, { useState, useEffect } from 'react';
import { IonButton, IonInput, useIonToast } from '@ionic/react';
import './DireccionForm.css';
import { guardarDireccion } from '../../service/api';
import { getUserSession } from '../../service/secureStorage';

export interface Direccion {
  calle: string;
  numero: string;
  colonia: string;
  municipio: string;
  estado: string;
  codigoPostal: string;
  referencias: string;
  telefono: string;
  lat?: number;
  lng?: number;
  maps_url?: string;
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
    codigoPostal: '',
    referencias: '',
    telefono: '',
  });

  const [camposVacios, setCamposVacios] = useState<(keyof Direccion)[]>([]);

  useEffect(() => {
    if (direccionInicial) setForm(direccionInicial);
  }, [direccionInicial]);

  const handleChange = (field: keyof Direccion, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleCodigoPostal = async (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 5);
    setForm(prev => ({ ...prev, codigoPostal: soloNumeros }));

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
  const handleSubmit = async () => {
    const obligatorios: (keyof Direccion)[] = ['calle', 'numero', 'colonia', 'codigoPostal', 'telefono'];
    const vacios = obligatorios.filter(campo => !form[campo] || (campo === 'codigoPostal' && form[campo].length !== 5));
  
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
  
    try {
      const token = await getUserSession();
  
      const direccionToSend = {
        calle: form.calle,
        numero: form.numero,
        colonia: form.colonia,
        cp: form.codigoPostal,
        pais: 'México',
        estado: form.estado,
        municipio: form.municipio,
        referencia: form.referencias,
        localidad: '',
        maps_url: '',
        latitud: 0,
        longitud: 0,
        es_publica: false,
      };
  
      const respuesta = await guardarDireccion(direccionToSend, token!);
  
      presentToast({ message: 'Dirección guardada exitosamente.', duration: 2000, color: 'success' });
  
      onGuardar({
        ...form,
        lat: parseFloat(respuesta.latitud),
        lng: parseFloat(respuesta.longitud),
        maps_url: respuesta.maps_url,
      });
  
    } catch (err: any) {
      console.error('❌ Error al guardar dirección:', err);
      presentToast({ message: err.message || 'Error al guardar dirección', duration: 2000, color: 'danger' });
    }
  };
  

  return (
    <div className="formulario-direccion">
      <h3 className="titulo-formulario">{modo === 'crear' ? 'Agregar dirección' : 'Editar dirección'}</h3>
      <div className="contenedor-campos">
        <div className="columna">
          <div>
            <IonInput
              className={camposVacios.includes('calle') ? 'input-error' : ''}
              label="Calle: "
              value={form.calle}
              placeholder="Ingresa el nombre de tu calle"
              onIonChange={(e) => handleChange('calle', e.detail.value!)}
            />
            {camposVacios.includes('calle') && <div className="mensaje-error">Campo obligatorio</div>}
          </div>

          <div>
            <IonInput
              className={camposVacios.includes('colonia') ? 'input-error' : ''}
              label="Colonia: "
              value={form.colonia}
              placeholder="Ingresa el nombre de tu colonia"
              onIonChange={(e) => handleChange('colonia', e.detail.value!)}
            />
            {camposVacios.includes('colonia') && <div className="mensaje-error">Campo obligatorio</div>}
          </div>

          <div>
            <IonInput label="Municipio: " value={form.municipio} readonly placeholder="(Automatico)"/>
          </div>

          <div>
            <IonInput
              label="Referencias: "
              value={form.referencias}
              placeholder="Ingresa tus referencias"
              onIonChange={(e) => handleChange('referencias', e.detail.value!)}
            />
          </div>
        </div>

        <div className="columna">
          <div>
            <IonInput
              className={camposVacios.includes('numero') ? 'input-error' : ''}
              label="Número: "
              type="number"
              value={form.numero}
              placeholder="Número exterior"
              onIonChange={(e) => handleChange('numero', e.detail.value!)}
            />
            {camposVacios.includes('numero') && <div className="mensaje-error">Campo obligatorio</div>}
          </div>

          <div>
            <IonInput
              className={camposVacios.includes('codigoPostal') ? 'input-error' : ''}
              label="Código postal: "
              type="text"
              inputMode="numeric"
              maxlength={5}
              value={form.codigoPostal}
              placeholder="Ej. 68000"
              onIonChange={(e) => handleCodigoPostal(e.detail.value || '')}
            />
            {camposVacios.includes('codigoPostal') && <div className="mensaje-error">Campo obligatorio</div>}
          </div>

          <div>
            <IonInput label="Estado: " value={form.estado} readonly />
          </div>

          <div>
            <IonInput
              label="Teléfono: "
              type="tel"
              maxlength={10}
              value={form.telefono}
              placeholder="Ej. 9511234567"
              onIonChange={(e) => handleChange('telefono', (e.detail.value || '').replace(/\D/g, '').slice(0, 10))}
              className={!form.telefono || form.telefono.length !== 10 ? 'campo-obligatorio' : ''}
            />
          </div>
        </div>
      </div>

      <div className="botones-formulario">
        <IonButton color="warning" onClick={onCancelar}>Volver</IonButton>
        <IonButton color="success" onClick={handleSubmit}>Guardar</IonButton>
      </div>
    </div>
  );
};

export default DireccionForm;
