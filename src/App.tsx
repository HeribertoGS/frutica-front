import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './global.css';
import Fruta from './pages/Fruta/Fruta';
import Register from './pages/Register/Register';
import Producto from './pages/Producto/ProductoDetalle';
import Perfil from './pages/Perfil/Perfil';
import Carrito from './pages/Carrito/Carrito';
import ListaDeseos from './pages/ListaDeseos/ListaDeseos';
import Direcciones from './pages/Direcciones/Direcciones';



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Ruta a la página */}
        <Route path="/fruta" component={Fruta} exact />
        <Route path="/registro" component={Register} exact />

        {/* Redirigir a otra ruta si la URL no coincide */}
        <Redirect exact from="/" to="/fruta" />

        {/*ruta a producto detalle*/}
        <Route path="/producto" component={Producto} exact />
        <Redirect exact from="/" to="/producto" />

        {/*ruta a perfil*/}
        <Route path="/perfil" component={Perfil} exact />
        <Redirect exact from="/" to="/perfil" />

        {/*ruta a carrito*/}
        <Route path="/carrito" component={Carrito} exact />
        <Redirect exact from="/" to="/carrito" />

        {/*ruta a Lista de Deseos*/}
        <Route path="/LDeseos" component={ListaDeseos} exact />
        <Redirect exact from="/" to="/LDeseos" />

        {/*ruta a Direcciones */}
        <Route path="/direcciones" component={Direcciones} exact />
        <Redirect exact from="/" to="/direcciones" />


      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
