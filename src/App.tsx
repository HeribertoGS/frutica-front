import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Global & Theme */
import './theme/variables.css';
import './global.css';

/* Pages */
import Fruta from './pages/Fruta/Fruta';
import Register from './pages/Register/Register';
import Producto from './pages/ProductoDetalle/ProductoDetalle';
import Perfil from './pages/Perfil/Perfil';
import Carrito from './pages/Carrito/Carrito';
import ListaDeseos from './pages/ListaDeseos/ListaDeseos';
import Direcciones from './pages/Direcciones/Direcciones';
import Ofertas from './pages/Ofertas/ofertas';
import Login from './pages/Login/login';
import MetodosPago from './pages/MetodosPago/MetodosPago';
import Compra from './pages/Compras/Compra';
import HistorialPedidos from './components/Pedidos/HistorialPedidos';
import PedidoDetalle from './components/Pedidos/PedidoDetalle';
import MensajeAclaracion from './pages/Mensajes/MensajeAclaracion';

/* Admin Pages */
import ProductosCrear from './pages/admin/productosCrear';
import CategoriasCrear from './pages/admin/categoriasCrear';
import OfertaCrear from './pages/admin/ofertaCrear';
import Forms from './pages/admin/forms';

/* Context */
import { CarritoProvider } from './contexts/carritoContext';

/* Leaflet CSS */
import 'leaflet/dist/leaflet.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <CarritoProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas principales */}
          <Route path="/fruta" component={Fruta} exact />
          <Route path="/registro" component={Register} exact />
          <Route path="/producto" component={Producto} exact />
          <Route path="/perfil" component={Perfil} exact />
          <Route path="/carrito" component={Carrito} exact />
          <Route path="/LDeseos" component={ListaDeseos} exact />
          <Route path="/direcciones" component={Direcciones} exact />
          <Route path="/ofertas" component={Ofertas} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/metodpago" component={MetodosPago} exact />
          <Route path="/compra" component={Compra} exact />
          <Route path="/pedidos" component={HistorialPedidos} exact />
          <Route path="/pedido/:id" component={PedidoDetalle} exact />
          <Route path="/mensajes/:id" component={MensajeAclaracion} exact />

          {/* Rutas admin */}
          <Route path="/admin/prod" component={ProductosCrear} exact />
          <Route path="/admin/category" component={CategoriasCrear} exact />
          <Route path="/admin/oferta" component={OfertaCrear} exact />
          <Route path="/admin/forms" component={Forms} exact />

        {/* Redirección principal (una sola)
          <Redirect exact from="/" to="/login" />*/}
        </IonRouterOutlet>
      </IonReactRouter>
    </CarritoProvider>
  </IonApp>
);

export default App;