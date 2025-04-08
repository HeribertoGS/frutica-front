import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,  IonIcon, IonLabel, IonMenuToggle } from '@ionic/react';
import { home, person, cart, heart, pin, card, time, flame, logOut} from 'ionicons/icons';
import { useIsMobile } from '../../hooks/useIsMobile';

const FruticaSideMenu: React.FC = () => {
    const isMobile = useIsMobile();

    if (!isMobile) return null;

    return (
        <IonMenu side="start" menuId="main-menu" contentId="main-content" className="custom-menu">
            <IonHeader>
                <IonToolbar style={{ backgroundColor: '#4CAF50' }} >
                    <IonTitle>
                        <img src="/src/assets/img/fruticaletras.png" alt="Frutica" style={{ height: '50px' }} />
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList>
                    {/* Envuelve cada opción en IonMenuToggle */}
                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/fruta" routerDirection="root">
                            <IonIcon slot="start" icon={home} />
                            <IonLabel>Inicio</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/perfil" routerDirection="root">
                            <IonIcon slot="start" icon={person} />
                            <IonLabel>Mi perfil</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/carrito" routerDirection="root">
                            <IonIcon slot="start" icon={cart} />
                            <IonLabel>Carrito de compra</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/LDeseos" routerDirection="root">
                            <IonIcon slot="start" icon={heart} />
                            <IonLabel>Lista de deseos</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/direcciones" routerDirection="root">
                            <IonIcon slot="start" icon={pin} />
                            <IonLabel>Mis direcciones</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/pagos" routerDirection="root">
                            <IonIcon slot="start" icon={card} />
                            <IonLabel>Métodos de Pago</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/historial" routerDirection="root">
                            <IonIcon slot="start" icon={time} />
                            <IonLabel>Historial de pedidos</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/ofertas" routerDirection="root">
                            <IonIcon slot="start" icon={flame} />
                            <IonLabel>Mejores ofertas</IonLabel>
                        </IonItem>
                    </IonMenuToggle>

                    <IonMenuToggle autoHide={true}>
                        <IonItem button routerLink="/logout" routerDirection="root">
                            <IonIcon slot="start" icon={logOut} />
                            <IonLabel>Cerrar sesión</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default FruticaSideMenu;
