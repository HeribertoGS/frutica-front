// ProductoMandarina.tsx
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import FruticaNavbar from '../../components/Navbar/Navbar';
import ProductoCard from '../../components/productos/ProductoCard';
import FruticaLayout from '../../components/Layout/FruticaLayout';

const productos: React.FC = () => {
    return (
        <FruticaLayout>
            <ProductoCard />
        </FruticaLayout>
    );
};

export default productos;
