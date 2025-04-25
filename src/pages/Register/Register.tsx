import React, { useState } from 'react';
import './Register.css';
import LogoFrutica from '../../assets/img/logofrutica.png';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import DireccionForm, { Direccion } from '../../components/DireccionForm/DireccionForm';
import DireccionMapa from '../../components/DireccionMapa/DireccionMapa';
import { IonModal } from '@ionic/react';
import { registrarUsuario } from "../../service/api";
import { saveUserSession } from "../../service/secureStorage"
import { eye, eyeOff } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const firebaseConfig = {
  apiKey: "AIzaSyAtzQ17oaS5hQ0sFsrvDKMdNwb9z4gPW8",
  authDomain: "frutica-app.firebaseapp.com",
  projectId: "frutica-app",
  storageBucket: "frutica-app.firebasestorage.app",
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
        role: form.role,
        correo_electronico: form.correo,
        contrasena: form.contrasena,
        contrasenaRepetida: form.repetirContrasena,
        telefono: form.telefono,
        login_normal: true,
        registrado_desde: 'aplicacion',
      };

      try {
        const res = await registrarUsuario(data);

        if (!res.jwtToken) {
          console.warn('⚠️ No se recibió JWT en la respuesta');
          throw new Error('JWT faltante');
        }

        await saveUserSession(res.jwtToken);
        console.log('🔐 Token guardado en secureStorage');
        setMostrarDireccionForm(true);
      } catch (err) {
        console.error("❌ Error al registrar usuario:", err);
      }
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
          <button type="button" className="google" onClick={() => alert('Google login aún no conectado')}>
            <i className="fa-brands fa-google icon"></i> Continuar con Google
          </button>
        </div>

        <p className="login-link">¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
      </form>

      <IonModal isOpen={mostrarDireccionForm} onDidDismiss={() => setMostrarDireccionForm(false)}>
        <div style={{ padding: '1rem' }}>
          <DireccionForm
            modo="crear"
            direccionInicial={direccionGuardada ?? undefined}
            onCancelar={() => setMostrarDireccionForm(false)}
            onGuardar={(direccion) => {
              setDireccionGuardada(direccion);
              setMostrarDireccionForm(false);
              setMostrarMapa(true);
            }}
          />
        </div>
      </IonModal>

      <DireccionMapa
        isOpen={mostrarMapa}
        onClose={() => setMostrarMapa(false)}
        onSelectLocation={(coords) => {
          setCoordenadas(coords);
          setMostrarMapa(false);
          if (direccionGuardada) {
            setDireccionGuardada({
              ...direccionGuardada,
              lat: coords.lat,
              lng: coords.lng,
              maps_url: coords.maps_url,
            });
          }

          console.log('Registro completo:', {
            usuario: form,
            direccion: direccionGuardada,
            ubicacion: coords,
          });
        }}
        direccion={direccionGuardada ?? undefined}
        redirigirA="/fruta"
      />
    </div>
  );
};

export default Register;

