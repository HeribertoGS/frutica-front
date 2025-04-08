import React, { useState, useEffect } from 'react';
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
} from '@ionic/react';
import './DireccionForm.css';

export interface Direccion {
    calle: string;
    numero: string;
    colonia: string;
    municipio: string;
    estado: string;
    codigoPostal: string;
    referencias: string;
}

interface DireccionFormProps {
    modo: 'crear' | 'editar';
    direccionInicial?: Direccion;
    onCancelar: () => void;
    onGuardar: (direccion: Direccion) => void;
}

const DireccionForm: React.FC<DireccionFormProps> = ({
    modo,
    direccionInicial,
    onCancelar,
    onGuardar,
}) => {
    const [form, setForm] = useState<Direccion>({
        calle: '',
        numero: '',
        colonia: '',
        municipio: '',
        estado: '',
        codigoPostal: '',
        referencias: '',
    });

    useEffect(() => {
        if (direccionInicial) {
            setForm(direccionInicial);
        }
    }, [direccionInicial]);

    const handleChange = (field: keyof Direccion, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = () => {
        const camposObligatorios: (keyof Direccion)[] = [
            'calle',
            'numero',
            'colonia',
            'municipio',
            'estado',
            'codigoPostal',
        ];

        const camposVacios = camposObligatorios.filter(
            (campo) => !form[campo] || form[campo].trim() === ''
        );

        if (camposVacios.length > 0) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        onGuardar(form);
    };


    return (
        <div className="formulario-direccion">
            <h3 className="titulo-formulario">
                {modo === 'crear' ? 'Agregar dirección' : 'Editar dirección'}
            </h3>

            <div className="contenedor-campos">
                <div className="columna">
                    <IonInput
                        label="Calle: "
                        value={form.calle}
                        placeholder="Ingresa el nombre de tu calle"
                        onIonChange={(e) => handleChange('calle', e.detail.value!)}
                    />
                    <IonInput
                        label="Colonia: "
                        value={form.colonia}
                        placeholder="Ingresa el nombre de tu colonia"
                        onIonChange={(e) => handleChange('colonia', e.detail.value!)}
                    />
                    <IonInput
                        label="Municipio: "
                        value={form.municipio}
                        placeholder="Ingresa el nombre de tu municipio"
                        onIonChange={(e) => handleChange('municipio', e.detail.value!)}
                    />
                    <IonInput
                        label="Referencias: "
                        value={form.referencias}
                        placeholder="Ingresa el nombre de tus referencias"
                        onIonChange={(e) => handleChange('referencias', e.detail.value!)}
                    />
                </div>

                <div className="columna">
                    <IonInput
                        label="Número: "
                        type="number"
                        value={form.numero}
                        placeholder=" Ingresa el número de tu calle"
                        onIonChange={(e) => handleChange('numero', e.detail.value!)}
                    />
                    <IonInput
                        label="Código postal: "
                        type="text"
                        inputmode="numeric"
                        pattern="[0-9]{5}"
                        maxlength={5}
                        required
                        placeholder="Ingresa los 6 dígitos de código postal"
                        value={form.codigoPostal}
                        onIonChange={(e) => handleChange('codigoPostal', e.detail.value!)}
                    />
                    <IonInput
                        value="Oaxaca"
                        readonly
                        label="Estado: " />
                </div>
            </div>

            <div className="botones-formulario">
                <IonButton color="warning" onClick={onCancelar}>
                    Volver
                </IonButton>
                <IonButton color="success" onClick={handleSubmit}>
                    Guardar
                </IonButton>
            </div>
        </div>
    );
};

export default DireccionForm;
