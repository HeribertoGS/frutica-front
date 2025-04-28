import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import '../Register/Register.css';
import LogoFrutica from '../../assets/img/logofrutica.png';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { buscarCorreo, loginConGoogle, verificarCorreoGoogle } from '../../service/api';
import { saveUserSession } from '../../service/secureStorage';

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
    const history = useHistory();

    const togglePassword = () => setShowPassword(!showPassword);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Correo inválido');
            return;
        }

        setError('');
        history.push('/fruta');
    };

    const handleGoogleLogin = async () => {
        setLoadingGoogle(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user) throw new Error('No se pudo obtener usuario de Google');

            const idToken = await user.getIdToken();
            const loginResponse = await loginConGoogle(idToken);

            console.log('✅ Login con Google exitoso:', loginResponse);

            if (loginResponse.jwtToken) {
                await saveUserSession(loginResponse.jwtToken);
                history.push('/fruta');
            } else {
                alert('Tu cuenta de Google no está registrada. Por favor regístrate primero.');
            }
        } catch (error) {
            console.error('❌ Error al iniciar sesión con Google:', error);
            alert('Error al iniciar sesión con Google');
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

                <button type="submit" className="btn-verdeee">Entrar</button>

                <div className="social-login">
                    <button type="button" className="google" onClick={handleGoogleLogin} disabled={loadingGoogle}>
                        {loadingGoogle ? 'Cargando...' : (
                            <>
                                <i className="fa-brands fa-google icon"></i> Continuar con Google
                            </>
                        )}
                    </button>
                </div>

                <p className="login-link">
                    ¿No tienes cuenta? <Link to="/registro">Regístrate</Link> {/* 🔥 aquí corregido */}
                </p>
            </form>
        </div>
    );
};

export default Login;
