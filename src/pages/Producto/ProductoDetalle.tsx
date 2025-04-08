// ProductoMandarina.tsx
import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import FruticaNavbar from '../../components/Navbar/Navbar';
import MandarinaCard from '../../components/productos/ProductoCard';
import FruticaLayout from '../../components/Layout/FruticaLayout';

const ProductoDetalle: React.FC = () => {
    return (
        <FruticaLayout>
            <MandarinaCard />
        </FruticaLayout>
    );
};

export default ProductoDetalle;
