import React, { useState } from 'react';
import './Register.css';
import LogoFrutica from '../../assets/img/logofrutica.png';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import DireccionForm, { Direccion } from '../../components/DireccionForm/DireccionForm';
import DireccionMapa from '../../components/DireccionMapa/DireccionMapa';
import { IonModal } from '@ionic/react';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAtzQ17oaS5hQ0sFsrVDkMdNbWp8z4gPW8",
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
        apellidos: '',
        correo: '',
        sexo: '',
        telefono: '',
        contrasena: '',
        repetirContrasena: ''
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});
    const [mostrarDireccionForm, setMostrarDireccionForm] = useState(false);
    const [mostrarMapa, setMostrarMapa] = useState(false);
    const [direccionGuardada, setDireccionGuardada] = useState<Direccion | null>(null);
    const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validar = () => {
        const errs: { [key: string]: string } = {};
        if (!form.nombre) errs.nombre = 'Nombre requerido';
        if (!form.apellidos) errs.apellidos = 'Apellidos requeridos';
        if (!form.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.correo = 'Correo inválido';
        if (!form.sexo) errs.sexo = 'Selecciona el sexo';
        if (!form.telefono.match(/^\d{10}$/)) errs.telefono = 'Teléfono inválido (10 dígitos)';
        if (form.contrasena.length < 6) errs.contrasena = 'Mínimo 6 caracteres';
        if (form.contrasena !== form.repetirContrasena) errs.repetirContrasena = 'Las contraseñas no coinciden';
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validar();
        setErrores(errs);
        if (Object.keys(errs).length === 0) {
            setMostrarDireccionForm(true);
        }
    };

    const call_login_google = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                if (!user.email) return console.error("❌ No hay email en Google");

                const nameParts = (user.displayName || "").split(" ");
                const userData = {
                    correo_electronico: user.email,
                    nombre: nameParts[0] || "",
                    apellido_paterno: nameParts[1] || "",
                    apellido_materno: nameParts[2] || "",
                    telefono: user.phoneNumber || "",
                    sexo: "Otro"
                };

                fetch("http://localhost:4000/auth/google-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                })
                    .then(res => res.json())
                    .then(data => console.log("✅ Registrado en backend", data))
                    .catch(err => console.error("❌ Error backend:", err));
            })
            .catch((error) => console.error("❌ Error con Google:", error.message));
    };

    return (
        <div className="main-container">
            <form className="form-wrapper" onSubmit={handleSubmit}>
                <img src={LogoFrutica} alt="Frutica" className="logo" />

                <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                {errores.nombre && <p className="error">{errores.nombre}</p>}

                <input type="text" name="apellidos" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
                {errores.apellidos && <p className="error">{errores.apellidos}</p>}

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

                <input type="password" name="contrasena" placeholder="Contraseña" value={form.contrasena} onChange={handleChange} />
                {errores.contrasena && <p className="error">{errores.contrasena}</p>}

                <input type="password" name="repetirContrasena" placeholder="Repite contraseña" value={form.repetirContrasena} onChange={handleChange} />
                {errores.repetirContrasena && <p className="error">{errores.repetirContrasena}</p>}

                <button type="submit" className="button">Crear cuenta</button>

                <div className="social-login">
                    <button type="button" className="google" onClick={call_login_google}>
                        <i className="fa-brands fa-google icon"></i> Continuar con Google
                    </button>
                </div>

                <p className="login-link">¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
            </form>

            {/* Paso 1: Dirección */}
            <IonModal isOpen={mostrarDireccionForm} onDidDismiss={() => setMostrarDireccionForm(false)}>
                <div style={{ padding: '1rem' }}>
                    <DireccionForm
                        modo="crear"
                        onCancelar={() => setMostrarDireccionForm(false)}
                        onGuardar={(direccion) => {
                            setDireccionGuardada(direccion);
                            setMostrarDireccionForm(false);
                            setMostrarMapa(true);
                        }}
                    />
                </div>
            </IonModal>


            {/* Paso 2: Mapa */}
            <DireccionMapa
                isOpen={mostrarMapa}
                onClose={() => setMostrarMapa(false)}
                onSelectLocation={(coords) => {
                    setCoordenadas(coords);
                    setMostrarMapa(false);

                    // Aquí podrías hacer el registro final
                    console.log('Registro completo:', {
                        usuario: form,
                        direccion: direccionGuardada,
                        ubicacion: coords
                    });

                    // Aquí podrías hacer un fetch al backend
                    // fetch('http://localhost:4000/registro-completo', {...})
                }}
            //direccion={direccionGuardada || undefined}
            />
        </div>
    );
};

export default Register;
