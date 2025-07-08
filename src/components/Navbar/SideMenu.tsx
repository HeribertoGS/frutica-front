import React, { useState, useEffect } from 'react';
import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonIcon, IonLabel, IonMenuToggle
} from '@ionic/react';
import {
  home, person, cart, heart, pin, card, time, flame, logOut, addCircle
} from 'ionicons/icons';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useHistory } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { clearUserSession, getUserRole } from '../../service/secureStorage';

const FruticaSideMenu: React.FC = () => {
  const isMobile = useIsMobile();
  const history = useHistory();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const cargarRol = async () => {
      const rolGuardado = await getUserRole();
      setRol(rolGuardado);
    };
    cargarRol();
  }, []);

  const cerrarSesion = async () => {
    await clearUserSession();
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('carrito');
    localStorage.removeItem('direccionPredeterminada');
    history.push('/login');
    window.location.reload();
  };

  if (!isMobile) return null;

  return (
    <>
      <IonMenu side="start" menuId="main-menu" contentId="main-content" className="custom-menu">
        <IonHeader>
          <IonToolbar style={{ backgroundColor: '#4CAF50' }}>
            <IonTitle>
              <img src="/src/assets/img/fruticaletras.png" alt="Frutica" style={{ height: '50px' }} />
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList>
            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/fruta" routerDirection="forward">
                <IonIcon slot="start" icon={home} />
                <IonLabel>Inicio</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/perfil" routerDirection="forward">
                <IonIcon slot="start" icon={person} />
                <IonLabel>Mi perfil</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/carrito" routerDirection="forward">
                <IonIcon slot="start" icon={cart} />
                <IonLabel>Carrito de compra</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/LDeseos" routerDirection="forward">
                <IonIcon slot="start" icon={heart} />
                <IonLabel>Lista de deseos</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/direcciones" routerDirection="forward">
                <IonIcon slot="start" icon={pin} />
                <IonLabel>Mis direcciones</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/pagos" routerDirection="forward">
                <IonIcon slot="start" icon={card} />
                <IonLabel>Métodos de Pago</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/pedidos" routerDirection="forward">
                <IonIcon slot="start" icon={time} />
                <IonLabel>Historial de pedidos</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={true}>
              <IonItem button routerLink="/ofertas" routerDirection="forward">
                <IonIcon slot="start" icon={flame} />
                <IonLabel>Mejores ofertas</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {rol === 'admin' && (
              <IonMenuToggle autoHide={true}>
                <IonItem button routerLink="/admin/forms" routerDirection="forward">
                  <IonIcon slot="start" icon={addCircle} />
                  <IonLabel>Agregar producto</IonLabel>
                </IonItem>
              </IonMenuToggle>
            )}

            <IonMenuToggle autoHide={false}>
              <IonItem button onClick={() => setMostrarConfirmacion(true)}>
                <IonIcon slot="start" icon={logOut} />
                <IonLabel>Cerrar sesión</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <ConfirmDialog
        isOpen={mostrarConfirmacion}
        onClose={() => setMostrarConfirmacion(false)}
        onConfirm={cerrarSesion}
        mensaje="¿Deseas cerrar sesión?"
        detalle="Se cerrará tu sesión actual y volverás al inicio"
        textoConfirmar="Sí, cerrar"
        textoCancelar="Cancelar"
      />
    </>
  );
};

export default FruticaSideMenu;
