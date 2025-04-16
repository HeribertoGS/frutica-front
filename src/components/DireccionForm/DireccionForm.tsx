import React, { useState, useEffect } from 'react';
import { IonButton, IonInput, useIonToast } from '@ionic/react';
import './DireccionForm.css';

export interface Direccion {
    calle: string;
    numero: string;
    colonia: string;
    municipio: string;
    estado: string;
    codigoPostal: string;
    referencias: string;
    telefono: string;
    
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
        telefono:'',
    });

    const [camposVacios, setCamposVacios] = useState<(keyof Direccion)[]>([]);

    useEffect(() => {
        if (direccionInicial) setForm(direccionInicial);
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
            'telefono'
        ];

        const vacios = camposObligatorios.filter((campo) => {
            const valor = form[campo];
            return !valor || valor.trim() === '' || (campo === 'codigoPostal' && valor.length !== 5);
        });

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
                        <IonInput
                            className={camposVacios.includes('municipio') ? 'input-error' : ''}
                            label="Municipio: "
                            value={form.municipio}
                            placeholder="Ingresa el nombre de tu municipio"
                            onIonChange={(e) => handleChange('municipio', e.detail.value!)}
                        />
                        {camposVacios.includes('municipio') && <div className="mensaje-error">Campo obligatorio</div>}
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
                            placeholder="Ingresa el número exterior"
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
                            placeholder="Ingresa los 5 números de tu código postal"
                            onIonChange={(e) => {
                                const value = e.detail.value || '';
                                const soloNumeros = value.replace(/\D/g, '').slice(0, 5);
                                handleChange('codigoPostal', soloNumeros);
                            }}
                        />
                        {camposVacios.includes('codigoPostal') && <div className="mensaje-error">Campo obligatorio</div>}
                    </div>

                    <div>
                        <IonInput
                            className={camposVacios.includes('estado') ? 'input-error' : ''}
                            label="Estado: "
                            value={form.estado}
                            readonly
                        />
                        {camposVacios.includes('estado') && <div className="mensaje-error">Campo obligatorio</div>}
                    </div>
                    <div>
                        <IonInput
                            label="Teléfono: "
                            type="tel"
                            inputmode="tel"
                            maxlength={10}
                            value={form.telefono}
                            placeholder="Ej. 9511234567"
                            onIonChange={(e) => {
                                const value = e.detail.value || '';
                                const soloNumeros = value.replace(/\D/g, '').slice(0, 10);
                                handleChange('telefono', soloNumeros);
                            }}
                            className={!form.telefono || form.telefono.length !== 10 ? 'campo-obligatorio' : ''}
                        />

                    </div>
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
