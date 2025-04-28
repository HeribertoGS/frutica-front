import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../Register/Register.css';
import LogoFrutica from '../../assets/img/logofrutica.png';
import { loginUsuario } from '../../service/api';
import { saveUserSession } from '../../service/secureStorage';
import jwtDecode from 'jwt-decode';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    const togglePassword = () => setShowPassword(!showPassword);

    const handleLogin = async (e: React.FormEvent) => {
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

        try {
            const res = await loginUsuario(email, password);
            await saveUserSession(res.jwtToken, res.role);
            console.log('Sesión iniciada como:', res.role);
            history.push('/fruta');
        } catch (err: any) {
            console.error('Error al iniciar sesión:', err);
            setError(err.message || 'Error en el inicio de sesión');
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
                    <button type="button" className="google">
                        <i className="fa-brands fa-google icon"></i> Continuar con Google
                    </button>
                </div>

                <p className="login-link">¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
            </form>
        </div>
    );
};

export default Login;
