import React from 'react';
import './navbar.css';
import { IonIcon, IonMenuButton } from '@ionic/react';
import { menu, arrowBack, search } from 'ionicons/icons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useHistory } from 'react-router-dom';

const FruticaMobileHeader: React.FC = () => {
    const isMobile = useIsMobile();
    const history = useHistory();

    if (!isMobile) return null;

    return (
        <div className="frutica-mobile-header">
            <div className="left-group">
                <IonMenuButton menu="main-menu" autoHide={false} className="frutica-mobile-menu">
                    <IonIcon icon={menu} />
                </IonMenuButton>
            </div>

            <div className="frutica-mobile-search">
                <IonIcon icon={search} />
                <input type="text" placeholder="Buscar frutas y verduras" />
            </div>

            <div className="frutica-mobile-back" onClick={() => history.goBack()}>
                <IonIcon icon={arrowBack} />
            </div>
        </div>
    );
};

export default FruticaMobileHeader;
