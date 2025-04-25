// src/components/FormularioCrearProducto.tsx
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonTextarea, IonContent, IonPage } from '@ionic/react';
import { crearProducto } from '../../service/api';

const FormularioCrearProducto: React.FC = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    unidad_venta: 'kg', // o pieza
    categoriaCategoriaK: '',
  });

  const [fotos, setFotos] = useState<File[]>([]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await crearProducto(producto, fotos);
      console.log('Producto creado:', res);
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear producto');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput name="nombre" value={producto.nombre} onIonChange={handleInputChange} required />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonTextarea name="descripcion" value={producto.descripcion} onIonChange={handleInputChange} required />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Precio</IonLabel>
            <IonInput type="number" name="precio" value={producto.precio} onIonChange={handleInputChange} required />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Unidad de venta</IonLabel>
            <IonInput name="unidad_venta" value={producto.unidad_venta} onIonChange={handleInputChange} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">ID Categoría</IonLabel>
            <IonInput name="categoriaCategoriaK" value={producto.categoriaCategoriaK} onIonChange={handleInputChange} required />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Imágenes (puedes seleccionar varias)</IonLabel>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          </IonItem>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <IonButton type="submit" expand="block" color="primary">
              Crear Producto
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default FormularioCrearProducto;
