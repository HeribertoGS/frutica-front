import './navbar.css';
import { IonRouterLink } from '@ionic/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import React, { useEffect, useState } from 'react';
import { useCarrito } from '../../contexts/carritoContext';


const FruticaDesktopHeader: React.FC = () => {
  const isMobile = useIsMobile();

  const [codigoPostal, setCodigoPostal] = useState('00000'); // Valor por defecto
  const { carrito } = useCarrito();
  useEffect(() => {
    const direccion = localStorage.getItem('direccionPredeterminada');
    if (direccion) {
      try {
        const data = JSON.parse(direccion);
        if (data.codigoPostal) {
          setCodigoPostal(data.codigoPostal);
        }
      } catch (err) {
        console.error('Error al leer dirección predeterminada:', err);
      }
    }
  }, []);
  if (isMobile) return null;

  const calcularTotal = () => {
    return carrito.reduce((total, p) => total + (p.precio * p.cantidad), 0).toFixed(2);
  };

  return (
    <div className="desktop-header">
      <div className="top-bar-row">

        {/* LOGO */}
        <div className="left-section">
          <IonRouterLink routerLink="/fruta" className="bottom-link">
            <img src="/src/assets/img/fruticaletras.png" alt="Frutica" className="logotexto" />
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
            <span className="envio-label">Envío en</span>
            <span className="envio-cp">CP {codigoPostal}</span>
            <span className="material-icons icon-white">place</span>
          </div>

          <IonRouterLink routerLink="/carrito" className="bottom-link">
            <div className="cart-summary">
              <span className="material-icons">shopping_cart</span>
              <div className="cart-info">
                <strong>${calcularTotal()}</strong>
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
