import React from 'react';
import '/src/global.css';
import { IonRouterLink } from '@ionic/react';
import { useIsMobile } from '../../hooks/useIsMobile';

const FruticaDesktopHeader: React.FC = () => {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <div className="desktop-header">
      <div className="top-bar-row">

        {/* LOGO */}
        <div className="left-section">
          <IonRouterLink routerLink="/home" className="bottom-link">
            <img src="/src/assets/img/fruticaletras.png" alt="Frutica" className="logo" />
          </IonRouterLink>
        </div>

        {/* BÚSQUEDA */}
        <div className="center-section">
          <div className="search-container">
            <span className="material-icons search-icon">search</span>
            <input
              type="text"
              placeholder="Busca frutas, verduras y más"
              className="search-bar"
            />
          </div>
        </div>

        {/* ICONOS DERECHA */}
        <div className="right-section">

          <div className="envio">
            <span className="envio-label">Envío gratis en</span>
            <span className="envio-cp">CP 68000</span>
            <span className="material-icons icon-white">place</span>
          </div>

          <IonRouterLink routerLink="/carrito" className="bottom-link">
            <div className="cart-summary">
              <span className="material-icons">shopping_cart</span>
              <div className="cart-info">
                <strong>$0.0</strong>
                <span>Ahorras -$0.0</span>
              </div>
            </div>
          </IonRouterLink>

          <IonRouterLink routerLink="/perfil" className="bottom-link">
            <span className="material-icons icon-white">person</span>
          </IonRouterLink>

          <IonRouterLink routerLink="/logout">
            <span className="material-icons icon-white">logout</span>
          </IonRouterLink>
        </div>
      </div>

      <hr className="divider" />

      {/* MENÚ INFERIOR */}
      <div className="bottom-bar">
        <IonRouterLink routerLink="/ofertas" className="bottom-link">
          <span><span className="material-icons">sell</span> ¡Mejores ofertas!</span>
        </IonRouterLink>

        <IonRouterLink routerLink="/LDeseos" className="bottom-link">
          <span><span className="material-icons">favorite</span> Lista de deseos</span>
        </IonRouterLink>

        <IonRouterLink routerLink="/direcciones" className="bottom-link">
          <span><span className="material-icons">pin_drop</span> Mis direcciones</span>
        </IonRouterLink>

        <IonRouterLink routerLink="/historial" className="bottom-link">
          <span><span className="material-icons">history</span> Historial de compras</span>
        </IonRouterLink>
      </div>
    </div>
  );
};

export default FruticaDesktopHeader;
