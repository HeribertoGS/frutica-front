import React from 'react';
import { isPlatform } from '@ionic/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import FruticaDesktopHeader from './DesktopHeader';
import FruticaMobileHeader from './MobileHeader';
import FruticaSideMenu from './SideMenu';

const FruticaNavbar: React.FC = () => {
    //const isMobile = isPlatform('mobile') || window.innerWidth < 768;
    const isMobile = useIsMobile();

    return (
        <>
            <FruticaDesktopHeader />
            <FruticaMobileHeader />
            <FruticaSideMenu />
        </>
    );
};

export default FruticaNavbar;
