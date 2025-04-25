import React, { useState, useEffect } from 'react';
import {
    IonButton, IonInput, IonItem, IonLabel, IonSelect,
    IonSelectOption, IonToggle, IonList, IonText
} from '@ionic/react';
import './productosCrear.css';

interface ProductoFormData {
    codigo_producto?: string;
    nombre: string;
    descripcion?: string;
    foto?: string;
    unidad_venta: "kg" | "pieza";
    precio_estimado: number;
    peso_estimado?: number;
    total_existencias?: number;
    activo?: boolean;
    requiere_pesaje?: boolean;
    usa_tamano?: boolean;
    tamano?: "Chico" | "Mediano" | "Grande";
    variaciones_precio?: boolean;
    temporada?: string;
    proveedor?: string;
    peso_chico?: number;
    peso_mediano?: number;
    peso_grande?: number;
}

interface ProductosCrearProps {
    onGuardar: (data: any) => void;
    registroEditar?: ProductoFormData | null;
}

const ProductosCrear: React.FC<ProductosCrearProps> = ({ onGuardar, registroEditar }) => {
    const [form, setForm] = useState<ProductoFormData>({
        nombre: '',
        unidad_venta: 'kg',
        precio_estimado: 0,
        activo: true,
        requiere_pesaje: false,
        usa_tamano: false,
        variaciones_precio: false,
    });

    useEffect(() => {
        if (registroEditar) {
            setForm(registroEditar);
        }
    }, [registroEditar]);

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    const handleChange = (e: CustomEvent) => {
        const name = (e.target as HTMLInputElement).name;
        const isToggle = typeof e.detail.checked === 'boolean';
        const value = isToggle ? e.detail.checked : e.detail.value;

        setForm(prev => ({
            ...prev,
            [name]: typeof prev[name as keyof ProductoFormData] === 'number'
                ? Number(value)
                : value
        }));
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: { [key: string]: string } = {};
        if (!form.nombre?.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
        if (!form.precio_estimado || form.precio_estimado <= 0) nuevosErrores.precio_estimado = 'El precio debe ser mayor a 0';
        if (form.requiere_pesaje && (!form.peso_estimado || form.peso_estimado <= 0)) {
            nuevosErrores.peso_estimado = 'Se requiere un peso estimado válido';
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = () => {
        if (validarFormulario()) {
            console.log('🟢 Producto válido:', form);
            onGuardar({ ...form });

            // Limpiar si no es edición
            if (!registroEditar) {
                setForm({
                    nombre: '',
                    unidad_venta: 'kg',
                    precio_estimado: 0,
                    activo: true,
                    requiere_pesaje: false,
                    usa_tamano: false,
                    variaciones_precio: false,
                });
            }
        }
    };

    return (
        <div className="form-prod-container">
            <h2 className="form-prod-titulo">{registroEditar ? 'Editar producto' : 'Agregar producto'}</h2>
            <IonList className="form-prod-lista">
                <IonItem>
                    <IonLabel position="stacked">Nombre *</IonLabel>
                    <IonInput name="nombre" value={form.nombre} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>
                {errores.nombre && <IonText color="danger"><p className="form-prod-error">{errores.nombre}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Precio estimado *</IonLabel>
                    <IonInput type="number" name="precio_estimado" value={form.precio_estimado} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>
                {errores.precio_estimado && <IonText color="danger"><p className="form-prod-error">{errores.precio_estimado}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Unidad de venta</IonLabel>
                    <IonSelect name="unidad_venta" value={form.unidad_venta} onIonChange={handleChange} className="form-prod-select">
                        <IonSelectOption value="kg">KG</IonSelectOption>
                        <IonSelectOption value="pieza">Pieza</IonSelectOption>
                    </IonSelect>
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Descripción</IonLabel>
                    <IonInput name="descripcion" value={form.descripcion ?? ''} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Foto (URL)</IonLabel>
                    <IonInput name="foto" value={form.foto ?? ''} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>

                <IonItem>
                    <IonLabel>Activo</IonLabel>
                    <IonToggle name="activo" checked={form.activo} onIonChange={handleChange} />
                </IonItem>

                <IonItem>
                    <IonLabel>Requiere pesaje</IonLabel>
                    <IonToggle name="requiere_pesaje" checked={form.requiere_pesaje} onIonChange={handleChange} />
                </IonItem>

                {form.requiere_pesaje && (
                    <>
                        <IonItem>
                            <IonLabel position="stacked">Peso estimado</IonLabel>
                            <IonInput type="number" name="peso_estimado" value={form.peso_estimado ?? ''} onIonChange={handleChange} className="form-prod-input" />
                        </IonItem>
                        {errores.peso_estimado && <IonText color="danger"><p className="form-prod-error">{errores.peso_estimado}</p></IonText>}
                    </>
                )}

                <IonItem>
                    <IonLabel>Usa tamaño</IonLabel>
                    <IonToggle name="usa_tamano" checked={form.usa_tamano} onIonChange={handleChange} />
                </IonItem>

                {form.usa_tamano && (
                    <>
                        <IonItem>
                            <IonLabel position="stacked">Peso chico</IonLabel>
                            <IonInput type="number" name="peso_chico" value={form.peso_chico ?? ''} onIonChange={handleChange} className="form-prod-input" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Peso mediano</IonLabel>
                            <IonInput type="number" name="peso_mediano" value={form.peso_mediano ?? ''} onIonChange={handleChange} className="form-prod-input" />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Peso grande</IonLabel>
                            <IonInput type="number" name="peso_grande" value={form.peso_grande ?? ''} onIonChange={handleChange} className="form-prod-input" />
                        </IonItem>
                    </>
                )}

                <IonItem>
                    <IonLabel position="stacked">Proveedor</IonLabel>
                    <IonInput name="proveedor" value={form.proveedor ?? ''} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>

                <IonButton expand="block" className="form-prod-button" onClick={handleSubmit}>
                    {registroEditar ? 'Actualizar producto' : 'Guardar producto'}
                </IonButton>
            </IonList>
        </div>
    );
};

export default ProductosCrear;
