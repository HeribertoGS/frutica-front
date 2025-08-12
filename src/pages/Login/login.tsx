import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import '../Register/Register.css';
import LogoFrutica from '../../assets/img/logofrutica.png';
import { loginUsuario } from '../../service/api';
import { saveUserSession } from '../../service/secureStorage';
import jwtDecode from 'jwt-decode';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { buscarCorreo, loginConGoogle, verificarCorreoGoogle } from '../../service/api';
import { useIonToast } from '@ionic/react';

// Firebase config
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

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [present] = useIonToast();
    const history = useHistory();

    const togglePassword = () => setShowPassword(!showPassword);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Correo inválido');
            return;
        }

        setLoading(true);
        try {
            const res = await loginUsuario(email, password); // <- debe propagar err.status en api.ts
            await saveUserSession(res.jwtToken, res.role);
            present({ message: '¡Bienvenido!', color: 'success', duration: 1200 });
            history.push('/fruta');
        } catch (err: any) {
            console.error('Error al iniciar sesión:', err);
            if (err.status === 403) {
                present({
                    message: err.message || 'Tu cuenta no está activa.',
                    color: 'warning',
                    duration: 2500,
                });
            } else {
                present({
                    message: err.message || 'Credenciales incorrectas',
                    color: 'danger',
                    duration: 2000,
                });
            }
            setError(err.message || 'Error en el inicio de sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoadingGoogle(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user) throw new Error('No se pudo obtener usuario de Google');

            const idToken = await user.getIdToken();
            const loginResponse = await loginConGoogle(idToken); // ideal: también propaga err.status=403

            if (loginResponse.jwtToken && loginResponse.usuario?.role) {
                await saveUserSession(loginResponse.jwtToken, loginResponse.usuario.role);
                present({ message: '¡Bienvenido!', color: 'success', duration: 1200 });
                history.push('/fruta');
            } else {
                present({
                    message: 'Tu cuenta de Google no está registrada. Por favor regístrate primero.',
                    color: 'medium',
                    duration: 2500,
                });
            }
        } catch (err: any) {
            console.error('Error Google login:', err);
            if (err.status === 403) {
                present({
                    message: err.message || 'Tu cuenta no está activa.',
                    color: 'warning',
                    duration: 2500,
                });
            } else {
                present({
                    message: 'Error al iniciar sesión con Google',
                    color: 'danger',
                    duration: 2000,
                });
            }
        } finally {
            setLoadingGoogle(false);
        }
    };

    return (
        <div className="registro-wrapper">
            <form className="form-wrapper" onSubmit={handleLogin}>
                <img src={LogoFrutica} alt="Frutica" className="logo" />

                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        onClick={togglePassword}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '12px',
                            cursor: 'pointer',
                            color: '#999'
                        }}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </span>
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="btn-verdeee" disabled={loading}>
                    {loading ? 'Entrando…' : 'Entrar'}
                </button>

                <div className="social-login">
                    <button
                        type="button"
                        className="google"
                        onClick={handleGoogleLogin}
                        disabled={loadingGoogle}
                    >
                        {loadingGoogle ? 'Cargando...' : (
                            <>
                                <i className="fa-brands fa-google icon"></i> Continuar con Google
                            </>
                        )}
                    </button>
                </div>

                <p className="login-link">
                    ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;