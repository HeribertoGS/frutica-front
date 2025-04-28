import React, { useState, useEffect } from 'react';
import {
    IonButton, IonInput, IonItem, IonLabel, IonList, IonText,
    IonToggle, IonDatetime, IonSelect, IonSelectOption
} from '@ionic/react';
import './productosCrear.css';
import { obtenerProductos, crearOferta } from '../../service/api'; // 👈 Importa tu API

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
        productoId: 0,
        precio_oferta: 0,
        inicio: '',
        fin: '',
        activa: true,
    });

    const [productos, setProductos] = useState<any[]>([]);
    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await obtenerProductos();
                setProductos(data);
            } catch (err) {
                console.error('❌ Error al cargar productos:', err);
            }
        };
        cargarProductos();
    }, []);

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
        const nuevosErrores: { [key: string]: string } = {};
        if (!form.productoId || form.productoId <= 0) nuevosErrores.productoId = 'Selecciona un producto';
        if (!form.precio_oferta || form.precio_oferta <= 0) nuevosErrores.precio_oferta = 'El precio debe ser mayor a 0';
        if (!form.inicio) nuevosErrores.inicio = 'Fecha de inicio obligatoria';
        if (!form.fin) nuevosErrores.fin = 'Fecha de fin obligatoria';
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async () => {
        if (validarFormulario()) {
            try {
                const ofertaFinal = {
                    ...form,
                    porcentaje_descuento: form.porcentaje_descuento ? Number(form.porcentaje_descuento) : undefined,
                    descripcion: form.descripcion?.trim() || undefined,
                    activa: form.activa,
                };
                const res = await crearOferta(ofertaFinal);
                console.log('✅ Oferta guardada en BD:', res);
                alert('Oferta creada exitosamente');

                // Reiniciar formulario
                setForm({
                    productoId: 0,
                    precio_oferta: 0,
                    inicio: '',
                    fin: '',
                    activa: true,
                });
            } catch (err) {
                console.error('❌ Error al guardar oferta:', err);
                alert('Error al crear oferta');
            }
        }
    };

    return (
        <div className="form-prod-container">
            <h2 className="form-prod-titulo">Agregar oferta</h2>
            <IonList className="form-prod-lista">

                <IonItem>
                    <IonLabel position="stacked">Producto *</IonLabel>
                    <IonSelect name="productoId" value={form.productoId} onIonChange={handleChange}>
                        <IonSelectOption value={0}>-- Selecciona un producto --</IonSelectOption>
                        {productos.map((prod) => (
                            <IonSelectOption key={prod.producto_k} value={prod.producto_k}>
                                {prod.nombre}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {errores.productoId && <IonText color="danger"><p className="form-prod-error">{errores.productoId}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Precio oferta *</IonLabel>
                    <IonInput type="number" name="precio_oferta" value={form.precio_oferta} onIonChange={handleChange} />
                </IonItem>
                {errores.precio_oferta && <IonText color="danger"><p className="form-prod-error">{errores.precio_oferta}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Porcentaje de descuento</IonLabel>
                    <IonInput type="number" name="porcentaje_descuento" value={form.porcentaje_descuento ?? ''} onIonChange={handleChange} />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Fecha de inicio *</IonLabel>
                    <IonDatetime presentation="date-time" name="inicio" value={form.inicio} onIonChange={handleChange} />
                </IonItem>
                {errores.inicio && <IonText color="danger"><p className="form-prod-error">{errores.inicio}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Fecha de fin *</IonLabel>
                    <IonDatetime presentation="date-time" name="fin" value={form.fin} onIonChange={handleChange} />
                </IonItem>
                {errores.fin && <IonText color="danger"><p className="form-prod-error">{errores.fin}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Descripción</IonLabel>
                    <IonInput name="descripcion" value={form.descripcion ?? ''} onIonChange={handleChange} />
                </IonItem>

                <IonItem>
                    <IonLabel>Activa</IonLabel>
                    <IonToggle name="activa" checked={form.activa} onIonChange={handleChange} />
                </IonItem>

                <IonButton expand="block" onClick={handleSubmit}>
                    Guardar oferta
                </IonButton>

            </IonList>
        </div>
    );
};

export default OfertaCrear;
