import React, { useState, useEffect } from 'react';
import {
    IonButton, IonInput, IonItem, IonLabel, IonSelect,
    IonSelectOption, IonToggle, IonList, IonText
} from '@ionic/react';
import './productosCrear.css';
import { crearProducto, obtenerCategorias } from '../../service/api';

interface ProductoFormData {
    codigo_producto?: string;
    nombre: string;
    descripcion?: string;
    foto?: string[];
    unidad_venta: "kg" | "pieza";
    precio_por_kg?: number;
    precio_por_pieza?: number;
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
    categoriaCategoriaK?: number;
}

interface ProductosCrearProps {
    onGuardar: (producto: ProductoFormData, fotos: File[]) => void;
    registroEditar?: ProductoFormData | null;
}

const ProductosCrear: React.FC<ProductosCrearProps> = ({ onGuardar, registroEditar }) => {
    const [form, setForm] = useState<ProductoFormData>({
        nombre: '',
        unidad_venta: 'kg',
        activo: true,
        requiere_pesaje: false,
        usa_tamano: false,
        variaciones_precio: false,
    });

    const [imagenes, setImagenes] = useState<File[]>([]);
    const [errores, setErrores] = useState<{ [key: string]: string }>({});
    const [categorias, setCategorias] = useState<any[]>([]);

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const data = await obtenerCategorias();
                setCategorias(data);
            } catch (err) {
                console.error('❌ Error al cargar categorías:', err);
            }
        };
        cargarCategorias();
    }, []);

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
            [name]: typeof prev[name as keyof ProductoFormData] === 'number'
                ? Number(value)
                : value
        }));
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: { [key: string]: string } = {};
        if (!form.nombre?.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
        if (!form.categoriaCategoriaK) nuevosErrores.categoriaCategoriaK = 'Selecciona una categoría';
        if (!form.precio_por_kg && !form.precio_por_pieza) {
            nuevosErrores.precio = 'Debes ingresar al menos precio por kg o precio por pieza';
        }
        if (form.requiere_pesaje && (!form.peso_estimado || form.peso_estimado <= 0)) {
            nuevosErrores.peso_estimado = 'Se requiere un peso estimado válido';
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async () => {
        if (validarFormulario()) {
            try {
                const productoFinal = {
                    ...form,
                    foto: [] // placeholder
                };

                const res = await crearProducto(productoFinal, imagenes);
                console.log('✅ Producto guardado en BD:', res);

                onGuardar(res, imagenes);

                if (!registroEditar) {
                    setForm({
                        nombre: '',
                        unidad_venta: 'kg',
                        activo: true,
                        requiere_pesaje: false,
                        usa_tamano: false,
                        variaciones_precio: false,
                    });
                    setImagenes([]);
                }
            } catch (err) {
                console.error('❌ Error al guardar producto:', err);
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
                    <IonLabel position="stacked">Categoría *</IonLabel>
                    <IonSelect
                        name="categoriaCategoriaK"
                        value={form.categoriaCategoriaK}
                        onIonChange={handleChange}
                        className="form-prod-select"
                    >
                        {categorias.map((cat) => (
                            <IonSelectOption key={cat.categoria_k} value={cat.categoria_k}>
                                {cat.nombre}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {errores.categoriaCategoriaK && <IonText color="danger"><p className="form-prod-error">{errores.categoriaCategoriaK}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Precio por kg (opcional)</IonLabel>
                    <IonInput type="number" name="precio_por_kg" value={form.precio_por_kg ?? ''} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Precio por pieza (opcional)</IonLabel>
                    <IonInput type="number" name="precio_por_pieza" value={form.precio_por_pieza ?? ''} onIonChange={handleChange} className="form-prod-input" />
                </IonItem>
                {errores.precio && <IonText color="danger"><p className="form-prod-error">{errores.precio}</p></IonText>}

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
                    <IonLabel position="stacked">Fotos</IonLabel>
                    <input type="file" multiple accept="image/*" onChange={(e) => {
                        if (e.target.files) setImagenes(Array.from(e.target.files));
                    }} />
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
