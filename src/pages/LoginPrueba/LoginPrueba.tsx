import React from 'react';
import './LoginPrueba.css'; // Asegúrate de importar tu CSS global
import LogoFrutica from '../../assets/img/logofrutica.png';



const RegisterForm = () => {
    return (
        <div className="main-container">
            <div className="form-wrapper">
            <img src={LogoFrutica} alt="Frutica" className="logo" />
            <input type="text" placeholder="Nombre" />
                <input type="text" placeholder="Apellidos" />
                <input type="email" placeholder="Correo electrónico" />
                <select>
                    <option value="">Sexo</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                </select>
                <input type="tel" placeholder="Número telefónico" />
                <input type="password" placeholder="Contraseña" />
                <input type="password" placeholder="Repite contraseña" />
                
                <button className="button">Crear cuenta</button>

                <div className="social-login">
                    <button className="facebook">
                        <i className="fa-brands fa-facebook icon"></i>
                        Continuar con Facebook
                    </button>
                    <button className="google">
                        <i className="fa-brands fa-google icon"></i>
                        Continuar con Google
                    </button>
                </div>

                <p className="login-link">¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
            </div>
        </div>
    );
}

export default RegisterForm;