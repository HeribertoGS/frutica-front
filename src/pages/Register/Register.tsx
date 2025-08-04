import React, { useState } from 'react';
import './Register.css';
import LogoFrutica from '../../assets/img/logofrutica.png';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import DireccionForm, { Direccion } from '../../components/DireccionForm/DireccionForm';
import DireccionMapa from '../../components/DireccionMapa/DireccionMapa';
import { IonModal, IonIcon } from '@ionic/react';
import { loginConGoogle, registrarUsuario, guardarDireccion, editarDireccion } from "../../service/api";
import { saveUserSession } from "../../service/secureStorage";
import { eye, eyeOff } from 'ionicons/icons';
import { useHistory, Link } from 'react-router-dom'; 

const firebaseConfig = {
  apiKey: "AIzaSyAtzQ17oaS5hQ0sFsrVDkMdNbWp8z4gPW8",
  authDomain: "frutica-app.firebaseapp.com",
  projectId: "frutica-app",
  storageBucket: "frutica-app.appspot.com",
  messagingSenderId: "424567185813",
  appId: "1:424567185813:web:c945cf0c3599391bda169c",
  measurementId: "G-KSY1DKBMDQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Register: React.FC = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido_paterno: '',
    correo: '',
    sexo: '',
    telefono: '',
    contrasena: '',
    repetirContrasena: '',
    role: 'user'
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarDireccionForm, setMostrarDireccionForm] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [direccionGuardada, setDireccionGuardada] = useState<Direccion | null>(null);
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number; maps_url: string } | null>(null);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs: { [key: string]: string } = {};
    if (!form.nombre) errs.nombre = 'Nombre requerido';
    if (!form.apellido_paterno) errs.apellido_paterno = 'Apellido requerido';
    if (!form.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.correo = 'Correo inválido';
    if (!form.sexo) errs.sexo = 'Selecciona el sexo';
    if (!form.telefono.match(/^\d{10}$/)) errs.telefono = 'Teléfono inválido';
    if (!form.contrasena.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/)) errs.contrasena = 'Debe tener mayúscula, minúscula y número';
    if (form.contrasena !== form.repetirContrasena) errs.repetirContrasena = 'Las contraseñas no coinciden';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validar();
    setErrores(errs);
    if (Object.keys(errs).length === 0) {
      const data = {
        nombre: form.nombre,
        apellido_paterno: form.apellido_paterno,
        sexo: form.sexo,
        role: form.role as 'user' | 'admin',
        correo_electronico: form.correo,
        contrasena: form.contrasena,
        contrasenaRepetida: form.repetirContrasena,
        telefono: form.telefono,
        login_normal: true,
        registrado_desde: 'aplicacion',
      };

      try {
        const res = await registrarUsuario(data);
        await saveUserSession(res.jwtToken, res.role);

        if (!res.jwtToken) {
          console.warn('No se recibió JWT en la respuesta');
          throw new Error('JWT faltante');
        }

        await saveUserSession(res.jwtToken, res.role);
        console.log('Token guardado en secureStorage');
        setMostrarDireccionForm(true);
            // Forzar dirección obligatoria
      localStorage.setItem('firstTime', 'true');
      setMostrarDireccionForm(true);
      } catch (err) {
        console.error("Error al registrar usuario:", err);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user) throw new Error('No se pudo obtener usuario de Google');

      const idToken = await user.getIdToken();
      const loginResponse = await loginConGoogle(idToken);

      console.log('Login con Google exitoso:', loginResponse);

      if (loginResponse.jwtToken && loginResponse.usuario?.role) {
        await saveUserSession(loginResponse.jwtToken, loginResponse.usuario.role);
        history.push('/fruta');
      }else {
        alert('Tu cuenta de Google no está registrada. Por favor regístrate primero.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      alert('Error al iniciar sesión con Google');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="registro-wrapper">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <img src={LogoFrutica} alt="Frutica" className="logo" />

        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        {errores.nombre && <p className="error">{errores.nombre}</p>}

        <input type="text" name="apellido_paterno" placeholder="Apellido" value={form.apellido_paterno} onChange={handleChange} />
        {errores.apellido_paterno && <p className="error">{errores.apellido_paterno}</p>}

        <input type="email" name="correo" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} />
        {errores.correo && <p className="error">{errores.correo}</p>}

        <select name="sexo" value={form.sexo} onChange={handleChange}>
          <option value="">Sexo</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
        {errores.sexo && <p className="error">{errores.sexo}</p>}

        <input type="tel" name="telefono" placeholder="Número telefónico" value={form.telefono} onChange={handleChange} />
        {errores.telefono && <p className="error">{errores.telefono}</p>}

        <div className="password-wrapper">
          <input
            type={mostrarContrasena ? "text" : "password"}
            name="contrasena"
            placeholder="Contraseña"
            value={form.contrasena}
            onChange={handleChange}
          />
          <IonIcon icon={mostrarContrasena ? eyeOff : eye} onClick={() => setMostrarContrasena(!mostrarContrasena)} className="password-toggle" />
        </div>
        {errores.contrasena && <p className="error">{errores.contrasena}</p>}

        <input
          type={mostrarContrasena ? "text" : "password"}
          name="repetirContrasena"
          placeholder="Repite contraseña"
          value={form.repetirContrasena}
          onChange={handleChange}
        />
        {errores.repetirContrasena && <p className="error">{errores.repetirContrasena}</p>}

        <button type="submit" className="btn-verdeee">Crear cuenta</button>

        <div className="social-login">
          <button type="button" className="google" onClick={handleGoogleLogin} disabled={loadingGoogle}>
            {loadingGoogle ? 'Cargando...' : (
              <>
                <i className="fa-brands fa-google icon"></i> Continuar con Google
              </>
            )}
          </button>
        </div>

        <p className="login-link">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link> {/* corregido aquí */}</p>
      </form>

  <IonModal isOpen={mostrarDireccionForm} onDidDismiss={() => setMostrarDireccionForm(false)}>
  <div style={{ padding: '1rem' }}>
    <DireccionForm
      modo="crear"
      direccionInicial={direccionGuardada ?? undefined}
      onCancelar={() => setMostrarDireccionForm(false)}
      onGuardar={async (direccion) => {
        try {
          // Guardamos primero la dirección en backend para que nos regrese el maps_url
      const direccionConUrl = await guardarDireccion(direccion);

          // Guardamos localmente con el maps_url que sí sirve para el mapa
    setDireccionGuardada({
      ...direccionConUrl,
      direccion_k: direccionConUrl.direccion_k,
    });
          setMostrarDireccionForm(false);
          setMostrarMapa(true);
        } catch (error) {
          console.error(" Error al guardar dirección antes de mapa:", error);
        }
      }}
    />
  </div>
</IonModal>


      <DireccionMapa
        isOpen={mostrarMapa}
        onClose={() => setMostrarMapa(false)}
   onSelectLocation={async (coords) => {
  if (direccionGuardada) {
const direccionFinal = {
  ...direccionGuardada,
  id: direccionGuardada.direccion_k, 
  latitud: coords.lat,
  longitud: coords.lng,
  maps_url: coords.maps_url,
};
    try {
await editarDireccion(direccionFinal.id!, {
  latitud: direccionFinal.latitud,
  longitud: direccionFinal.longitud,
  maps_url: direccionFinal.maps_url
});

localStorage.removeItem('firstTime');
      history.push('/fruta');
    } catch (err) {
      console.error(' Error al guardar ubicación precisa:', err);
    }
  }
}}
        direccion={direccionGuardada ?? undefined}
        redirigirA="/fruta"
      />
    </div>
  );
};

export default Register;
