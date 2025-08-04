// src/pages/ProductoDetalle/ProductoDetalle.tsx

import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useParams } from 'react-router-dom';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import ProductoCard from '../../components/productos/ProductoCard';

const ProductoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //  Obtenemos el id de la URL

  return (
    <FruticaLayout>
      <ProductoCard id={parseInt(id)} /> {/* Le pasamos el id como prop */}
    </FruticaLayout>
  );
};

export default ProductoDetalle;
