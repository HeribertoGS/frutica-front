// ProductoMandarina.tsx
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import FruticaNavbar from '../../components/Navbar/Navbar';
import MandarinaCard from '../../components/productos/ProductoCard';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import ProductoCard from '../../components/productos/ProductoCard';

const ProductoDetalle: React.FC = () => {
    return (
        <FruticaLayout>
            <ProductoCard/>
        </FruticaLayout>
    );
};

export default ProductoDetalle;
