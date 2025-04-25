import React, { useEffect, useState } from 'react';
import {
    IonButton, IonInput, IonItem, IonLabel, IonList, IonText, IonToggle
} from '@ionic/react';
import './productosCrear.css';

interface CategoriaFormData {
    nombre?: string;
    tabla: string;
    orden: number;
    descripcion: string;
    clave?: number;
    activo?: boolean;
}

interface CategoriasCrearProps {
    onGuardar: (data: CategoriaFormData) => void;
    registroEditar?: CategoriaFormData | null;
}

const CategoriasCrear: React.FC<CategoriasCrearProps> = ({ onGuardar, registroEditar }) => {
    const [form, setForm] = useState<CategoriaFormData>({
        tabla: '',
        orden: 1,
        descripcion: '',
        activo: true,
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (registroEditar) {
            setForm(registroEditar);
        }
    }, [registroEditar]);

    const handleChange = (e: CustomEvent) => {
        const name = (e.target as HTMLInputElement).name;
        const isToggle = typeof e.detail.checked === 'boolean';
        const value = isToggle ? e.detail.checked : e.detail.value;

        setForm(prev => ({
            ...prev,
            [name]: typeof prev[name as keyof CategoriaFormData] === 'number'
                ? Number(value)
                : value
        }));
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: { [key: string]: string } = {};
        if (!form.tabla?.trim()) nuevosErrores.tabla = 'La tabla es obligatoria';
        if (!form.descripcion?.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria';
        if (form.orden === undefined || form.orden < 0) nuevosErrores.orden = 'El orden debe ser un número válido';

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = () => {
        if (validarFormulario()) {
            console.log('✅ Categoría válida:', form);
            onGuardar(form);
            if (!registroEditar) {
                setForm({
                    tabla: '',
                    orden: 1,
                    descripcion: '',
                    activo: true,
                    nombre: '',
                    clave: undefined,
                });
            }
        }
    };

    return (
        <div className="form-prod-container">
            <h2 className="form-prod-titulo">
                {registroEditar ? 'Editar categoría' : 'Agregar categoría'}
            </h2>
            <IonList className="form-prod-lista">
                <IonItem>
                    <IonLabel position="stacked">Nombre (opcional)</IonLabel>
                    <IonInput
                        className="form-prod-input"
                        name="nombre"
                        value={form.nombre ?? ''}
                        onIonChange={handleChange}
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Tabla *</IonLabel>
                    <IonInput
                        className="form-prod-input"
                        name="tabla"
                        value={form.tabla}
                        onIonChange={handleChange}
                    />
                </IonItem>
                {errores.tabla && <IonText color="danger"><p className="form-prod-error">{errores.tabla}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Orden *</IonLabel>
                    <IonInput
                        className="form-prod-input"
                        type="number"
                        name="orden"
                        value={form.orden}
                        onIonChange={handleChange}
                    />
                </IonItem>
                {errores.orden && <IonText color="danger"><p className="form-prod-error">{errores.orden}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Descripción *</IonLabel>
                    <IonInput
                        className="form-prod-input"
                        name="descripcion"
                        value={form.descripcion}
                        onIonChange={handleChange}
                    />
                </IonItem>
                {errores.descripcion && <IonText color="danger"><p className="form-prod-error">{errores.descripcion}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Clave (opcional)</IonLabel>
                    <IonInput
                        className="form-prod-input"
                        type="number"
                        name="clave"
                        value={form.clave ?? ''}
                        onIonChange={handleChange}
                    />
                </IonItem>

                <IonItem>
                    <IonLabel>Activo</IonLabel>
                    <IonToggle
                        name="activo"
                        checked={form.activo}
                        onIonChange={handleChange}
                    />
                </IonItem>

                <IonButton expand="block" className="form-prod-button" onClick={handleSubmit}>
                    {registroEditar ? 'Actualizar categoría' : 'Guardar categoría'}
                </IonButton>
            </IonList>
        </div>
    );
};

export default CategoriasCrear;
