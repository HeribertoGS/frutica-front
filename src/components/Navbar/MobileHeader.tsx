import React from 'react';
import { IonIcon, IonMenuButton } from '@ionic/react';
import { menu, arrowBack, search } from 'ionicons/icons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useHistory } from 'react-router-dom';

const FruticaMobileHeader: React.FC = () => {
    const isMobile = useIsMobile();
    const history = useHistory();

    if (!isMobile) return null;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#4CAF50',
                padding: '8px',
                gap: '8px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}
        >
            {/* Menú lateral */}
            <IonMenuButton
                menu="main-menu"
                autoHide={false}
                style={{
                    borderRadius: '10px',
                    padding: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                    //background: '#e6f3e6',
                }}
            >
                <IonIcon icon={menu} size="large" style={{ color: '#e6f3e6' }} />
            </IonMenuButton>

            {/* Barra de búsqueda */}
            <div
                style={{
                    flex: 1,
                    background: '#e6f3e6',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 10px',
                    width: '36px',
                    height: '36px',
                }}
            >
                <IonIcon icon={search} color="medium" />
                <input
                    type="text"
                    placeholder="Buscar frutas o verduras"
                    style={{
                        border: 'none',
                        //outline: 'none',
                        width: '100%',
                        marginLeft: '8px',
                        fontSize: '14px',
                        background: 'transparent',
                        color: '#333',
                        padding: 0,            
                        boxShadow: 'none',
                    }}
                />
            </div>

            {/* Botón de regreso */}
            <div
                onClick={() => history.goBack()}
                style={{
                    //background: '#e6f3e6',
                    borderRadius: '10px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px',
                }}
            >
                <IonIcon icon={arrowBack} size="large" style={{ color: '#e6f3e6' }} />
            </div>
        </div>
    );
};

export default FruticaMobileHeader;
