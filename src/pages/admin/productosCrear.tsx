import React, { useState, useEffect } from 'react';
import {
    IonButton, IonInput, IonItem, IonLabel, IonSelect,
    IonSelectOption, IonToggle, IonList, IonText, useIonToast
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
        requiere_pesaje: false, // Cambiado a false por defecto
        usa_tamano: false,
        variaciones_precio: false,
        total_existencias: 0, // Agregado campo faltante
    });

    const [imagenes, setImagenes] = useState<File[]>([]);
    const [errores, setErrores] = useState<{ [key: string]: string }>({});
    const [categorias, setCategorias] = useState<any[]>([]);
    const [present] = useIonToast();

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
            [name]: typeof prev[name as keyof ProductoFormData] === 'number' && !isToggle
                ? Number(value) || undefined
                : value
        }));

        // Limpiar errores cuando el usuario modifica el campo
        if (errores[name]) {
            setErrores(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: { [key: string]: string } = {};
        
        if (!form.nombre?.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        }
        
        if (!form.categoriaCategoriaK) {
            nuevosErrores.categoriaCategoriaK = 'Selecciona una categoría';
        }
        
        if (!form.precio_por_kg && !form.precio_por_pieza) {
            nuevosErrores.precio = 'Debes ingresar al menos precio por kg o precio por pieza';
        }

        // Validación de peso estimado solo cuando NO usa tamaño
        if (!form.usa_tamano && (!form.peso_estimado || form.peso_estimado <= 0)) {
            nuevosErrores.peso_estimado = 'Se requiere un peso estimado válido cuando no se usa tamaño';
        }

        // Validación de pesos por tamaño cuando usa_tamano está activo
        if (form.usa_tamano) {
            if (!form.peso_chico || form.peso_chico <= 0) {
                nuevosErrores.peso_chico = 'Se requiere peso para tamaño chico';
            }
            if (!form.peso_mediano || form.peso_mediano <= 0) {
                nuevosErrores.peso_mediano = 'Se requiere peso para tamaño mediano';
            }
            if (!form.peso_grande || form.peso_grande <= 0) {
                nuevosErrores.peso_grande = 'Se requiere peso para tamaño grande';
            }
        }

        if (!form.total_existencias || form.total_existencias < 0) {
            nuevosErrores.total_existencias = 'Las existencias deben ser mayor o igual a 0';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async () => {
        if (validarFormulario()) {
            try {
                // Preparar datos asegurando valores por defecto correctos
                const productoFinal = {
                    ...form,
                    foto: [], // placeholder
                    activo: form.activo ?? true,
                    requiere_pesaje: form.requiere_pesaje ?? false,
                    usa_tamano: form.usa_tamano ?? false,
                    variaciones_precio: form.variaciones_precio ?? false,
                    total_existencias: form.total_existencias || 0,
                };

                console.log("Datos que se enviarán al backend:", productoFinal);
                console.log("Imágenes a subir:", imagenes);

                const res = await crearProducto(productoFinal, imagenes);
                
                present({
                    message: 'Producto creado con éxito',
                    duration: 2200,
                    color: 'success',
                });

                console.log('✅ Producto guardado en BD:', res);
                onGuardar(res, imagenes);
                
                // Limpiar formulario solo si no es edición
                if (!registroEditar) {
                    setForm({
                        nombre: '',
                        unidad_venta: 'kg',
                        activo: true,
                        requiere_pesaje: false,
                        usa_tamano: false,
                        variaciones_precio: false,
                        total_existencias: 0,
                    });
                    setImagenes([]);
                    setErrores({});
                }
            } catch (err) {
                console.error('❌ Error al guardar producto:', err);
                present({
                    message: 'No se pudo crear el producto',
                    duration: 2200,
                    color: 'danger',
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
                    <IonInput 
                        name="nombre" 
                        value={form.nombre} 
                        onIonChange={handleChange} 
                        className="form-prod-input" 
                        placeholder="Ingresa el nombre del producto"
                    />
                </IonItem>
                {errores.nombre && <IonText color="danger"><p className="form-prod-error">{errores.nombre}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Categoría *</IonLabel>
                    <IonSelect
                        name="categoriaCategoriaK"
                        value={form.categoriaCategoriaK}
                        onIonChange={handleChange}
                        className="form-prod-select"
                        placeholder="Selecciona una categoría"
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
                    <IonInput 
                        type="number" 
                        name="precio_por_kg" 
                        value={form.precio_por_kg ?? ''} 
                        onIonChange={handleChange} 
                        className="form-prod-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Precio por pieza (opcional)</IonLabel>
                    <IonInput 
                        type="number" 
                        name="precio_por_pieza" 
                        value={form.precio_por_pieza ?? ''} 
                        onIonChange={handleChange} 
                        className="form-prod-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                    />
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
                    <IonLabel position="stacked">Total de existencias *</IonLabel>
                    <IonInput 
                        type="number" 
                        name="total_existencias" 
                        value={form.total_existencias ?? ''} 
                        onIonChange={handleChange} 
                        className="form-prod-input"
                        placeholder="0"
                        min="0"
                    />
                </IonItem>
                {errores.total_existencias && <IonText color="danger"><p className="form-prod-error">{errores.total_existencias}</p></IonText>}

                <IonItem>
                    <IonLabel position="stacked">Descripción</IonLabel>
                    <IonInput 
                        name="descripcion" 
                        value={form.descripcion ?? ''} 
                        onIonChange={handleChange} 
                        className="form-prod-input"
                        placeholder="Descripción del producto"
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Fotos</IonLabel>
                    <input type="file" multiple accept="image/*" onChange={(e) => {
                        if (e.target.files) setImagenes(Array.from(e.target.files));
                    }} />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Proveedor</IonLabel>
                    <IonInput 
                        name="proveedor" 
                        value={form.proveedor ?? ''} 
                        onIonChange={handleChange} 
                        className="form-prod-input"
                        placeholder="Nombre del proveedor"
                    />
                </IonItem>

                <IonItem>
                    <IonLabel position="stacked">Temporada</IonLabel>
                    <IonInput 
                        name="temporada" 
                        value={form.temporada ?? ''} 
                        onIonChange={handleChange} 
                        className="form-prod-input"
                        placeholder="Ej: Verano, Invierno"
                    />
                </IonItem>

                <IonItem>
                    <IonLabel>Activo</IonLabel>
                    <IonToggle name="activo" checked={form.activo ?? true} onIonChange={handleChange} />
                </IonItem>

                <IonItem>
                    <IonLabel>Requiere pesaje</IonLabel>
                    <IonToggle name="requiere_pesaje" checked={form.requiere_pesaje ?? false} onIonChange={handleChange} />
                </IonItem>

                <IonItem>
                    <IonLabel>Usa tamaño</IonLabel>
                    <IonToggle name="usa_tamano" checked={form.usa_tamano ?? false} onIonChange={handleChange} />
                </IonItem>

                {!form.usa_tamano && (
                    <>
                        <IonItem>
                            <IonLabel position="stacked">Peso estimado *</IonLabel>
                            <IonInput 
                                type="number" 
                                name="peso_estimado" 
                                value={form.peso_estimado ?? ''} 
                                onIonChange={handleChange} 
                                className="form-prod-input"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </IonItem>
                        {errores.peso_estimado && <IonText color="danger"><p className="form-prod-error">{errores.peso_estimado}</p></IonText>}
                    </>
                )}

                {form.usa_tamano && (
                    <>
                        <IonItem>
                            <IonLabel position="stacked">Peso chico *</IonLabel>
                            <IonInput 
                                type="number" 
                                name="peso_chico" 
                                value={form.peso_chico ?? ''} 
                                onIonChange={handleChange} 
                                className="form-prod-input"
                                placeholder="Unicamente en gramos"
                                min="0"
                                step="0.01"
                            />
                        </IonItem>
                        {errores.peso_chico && <IonText color="danger"><p className="form-prod-error">{errores.peso_chico}</p></IonText>}
                        
                        <IonItem>
                            <IonLabel position="stacked">Peso mediano *</IonLabel>
                            <IonInput 
                                type="number" 
                                name="peso_mediano" 
                                value={form.peso_mediano ?? ''} 
                                onIonChange={handleChange} 
                                className="form-prod-input"
                                placeholder="Unicamente en gramos"
                                min="0"
                                step="0.01"
                            />
                        </IonItem>
                        {errores.peso_mediano && <IonText color="danger"><p className="form-prod-error">{errores.peso_mediano}</p></IonText>}
                        
                        <IonItem>
                            <IonLabel position="stacked">Peso grande *</IonLabel>
                            <IonInput 
                                type="number" 
                                name="peso_grande" 
                                value={form.peso_grande ?? ''} 
                                onIonChange={handleChange} 
                                className="form-prod-input"
                                placeholder="Unicamente en gramos"
                                min="0"
                                step="0.01"
                            />
                        </IonItem>
                        {errores.peso_grande && <IonText color="danger"><p className="form-prod-error">{errores.peso_grande}</p></IonText>}
                    </>
                )}

                <IonItem>
                    <IonLabel>Variaciones de precio</IonLabel>
                    <IonToggle name="variaciones_precio" checked={form.variaciones_precio ?? false} onIonChange={handleChange} />
                </IonItem>

                <IonButton expand="block" className="form-prod-button" onClick={handleSubmit}>
                    {registroEditar ? 'Actualizar producto' : 'Guardar producto'}
                </IonButton>
            </IonList>
        </div>
    );
};

export default ProductosCrear;