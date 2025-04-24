import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonText, IonToggle, IonDatetime } from '@ionic/react';
import './productosCrear.css';
import FruticaLayout from '../../components/Layout/FruticaLayout';

interface OfertaFormData {
    productoId: number;
    precio_oferta: number;
    porcentaje_descuento?: number;
    inicio: string;
    fin: string;
    descripcion?: string;
    activa?: boolean;
}

const OfertaCrear: React.FC = () => {
    const [form, setForm] = useState<OfertaFormData>({
        productoId: 1,
        precio_oferta: 0,
        inicio: '',
        fin: '',
        activa: true,
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    const handleChange = (e: CustomEvent) => {
        const name = (e.target as HTMLInputElement).name;
        const isToggle = typeof e.detail.checked === 'boolean';
        const value = isToggle ? e.detail.checked : e.detail.value;

        setForm(prev => ({
            ...prev,
            [name]: typeof prev[name as keyof OfertaFormData] === 'number'
                ? Number(value)
                : value
        }));
    };

    const validarFormulario = (): boolean => {
        const errores: { [key: string]: string } = {};
        if (!form.productoId || form.productoId <= 0) errores.productoId = 'ID de producto obligatorio';
        if (!form.precio_oferta || form.precio_oferta <= 0) errores.precio_oferta = 'El precio debe ser mayor a 0';
        if (!form.inicio) errores.inicio = 'Fecha de inicio obligatoria';
        if (!form.fin) errores.fin = 'Fecha de fin obligatoria';
        setErrores(errores);
        return Object.keys(errores).length === 0;
    };

    const handleSubmit = () => {
        if (validarFormulario()) {
            console.log('🟢 Oferta válida:', form);
        }
    };

    return (
        <FruticaLayout>
            <div className="form-prod-scroll">
                <div className="form-prod-container">
                    <h2 className="form-prod-titulo">Agregar oferta</h2>

                    <IonList className="form-prod-lista">
                        <IonItem>
                            <IonLabel position="stacked">ID del producto *</IonLabel>
                            <IonInput className="form-prod-input" type="number" name="productoId" value={form.productoId} onIonChange={handleChange} />
                        </IonItem>
                        {errores.productoId && <IonText color="danger"><p className="form-prod-error">{errores.productoId}</p></IonText>}

                        <IonItem>
                            <IonLabel position="stacked">Precio oferta *</IonLabel>
                            <IonInput className="form-prod-input" type="number" name="precio_oferta" value={form.precio_oferta} onIonChange={handleChange} />
                        </IonItem>
                        {errores.precio_oferta && <IonText color="danger"><p className="form-prod-error">{errores.precio_oferta}</p></IonText>}

                        <IonItem>
                            <IonLabel position="stacked">Porcentaje de descuento (opcional)</IonLabel>
                            <IonInput className="form-prod-input" type="number" name="porcentaje_descuento" value={form.porcentaje_descuento ?? ''} onIonChange={handleChange} />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Inicio *</IonLabel>
                            <IonDatetime
                                presentation="date-time"
                                name="inicio"
                                value={form.inicio}
                                onIonChange={handleChange}
                                className="form-prod-input"
                            />
                        </IonItem>
                        {errores.inicio && <IonText color="danger"><p className="form-prod-error">{errores.inicio}</p></IonText>}

                        <IonItem>
                            <IonLabel position="stacked">Fin *</IonLabel>
                            <IonDatetime
                                presentation="date-time"
                                name="fin"
                                value={form.fin}
                                onIonChange={handleChange}
                                className="form-prod-input"
                            />
                        </IonItem>
                        {errores.fin && <IonText color="danger"><p className="form-prod-error">{errores.fin}</p></IonText>}

                        <IonItem>
                            <IonLabel position="stacked">Descripción (opcional)</IonLabel>
                            <IonInput className="form-prod-input" name="descripcion" value={form.descripcion ?? ''} onIonChange={handleChange} />
                        </IonItem>

                        <IonItem>
                            <IonLabel>Activa</IonLabel>
                            <IonToggle name="activa" checked={form.activa} onIonChange={handleChange} />
                        </IonItem>

                        <IonButton expand="block" className="form-prod-button" onClick={handleSubmit}>
                            Guardar oferta
                        </IonButton>
                    </IonList>
                </div>
            </div>
        </FruticaLayout>
    );
};

export default OfertaCrear;
