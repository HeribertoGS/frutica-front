import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import FruticaNavbar from '../Navbar/Navbar';
import FruticaMobileHeader from '../Navbar/MobileHeader';
import FruticaSideMenu from '../Navbar/SideMenu'; 
import { useIsMobile } from '../../hooks/useIsMobile';

const FruticaLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();

  // Estimamos altura del header según dispositivo
  const headerHeight = isMobile ? 72 : 84;

  return (
    <>
      <FruticaSideMenu />

      <IonPage id="main-content">
        {/* Header fijo según dispositivo */}
        {isMobile ? <FruticaMobileHeader /> : <FruticaNavbar />}

        {/* Contenido principal con espacio superior para evitar que lo tape el header */}
        <IonContent fullscreen style={{ paddingTop: `${headerHeight}px` }}>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
};

export default FruticaLayout;
