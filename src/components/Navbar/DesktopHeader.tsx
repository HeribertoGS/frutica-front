import './navbar.css';
import { IonRouterLink } from '@ionic/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import React, { useEffect, useState } from 'react';
import { useCarrito } from '../../contexts/carritoContext';
import { useHistory } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { clearUserSession, getUserRole } from '../../service/secureStorage';

const FruticaDesktopHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const history = useHistory();
  const { carrito } = useCarrito();
  const [cp, setCp] = useState('00000');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [rol, setRol] = useState<string | null>(null);

  // Función para actualizar CP desde localStorage
  const actualizarCP = () => {
    const direccion = localStorage.getItem('direccionPredeterminada');
    if (direccion) {
      try {
        const data = JSON.parse(direccion);
        if (data.cp) setCp(data.cp);
      } catch (err) {
        console.error('Error leyendo dirección predeterminada:', err);
      }
    }
  };

  useEffect(() => {
    // 1. Cargar rol de usuario
    getUserRole().then(setRol);

    // 2. Cargar CP inicial y configurar listener
    actualizarCP();
    window.addEventListener('direccionPredeterminadaCambiada', actualizarCP);

    return () => {
      window.removeEventListener('direccionPredeterminadaCambiada', actualizarCP);
    };
  }, []);

  const calcularTotal = () => {
    return carrito.reduce((total, p) => total + (p.precio * p.cantidad), 0).toFixed(2);
  };

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

  if (isMobile) return null;

  return (
    <>
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
              <span className="envio-cp">CP {cp}</span>
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

            {rol === 'admin' && (
              <>
                  <span className="material-icons icon-white"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/admin/usuarios')}
                  title="Formularios">supervisor_account</span>
                

                <span
                  className="material-icons icon-white bottom-link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/admin/forms')}
                  title="Formularios"
                >
                  add_circle
                </span>
              </>
            )}

            <span
              className="material-icons icon-white bottom-link"
              style={{ cursor: 'pointer' }}
              onClick={() => setMostrarConfirmacion(true)}
            >
              logout
            </span>
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

          <IonRouterLink routerLink="/pedidos" className="bottom-link">
            <span><span className="material-icons">history</span> Historial de compras</span>
          </IonRouterLink>

        
        </div>
      </div>

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

export default FruticaDesktopHeader;