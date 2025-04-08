import React from 'react';
import './Register.css'; // Asegúrate de importar tu CSS global
import LogoFrutica from '../../assets/img/logofrutica.png';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAtzQ17oaS5hQ0sFsrVDkMdNbWp8z4gPW8",
    authDomain: "frutica-app.firebaseapp.com",
    projectId: "frutica-app",
    storageBucket: "frutica-app.firebasestorage.app",
    messagingSenderId: "424567185813",
    appId: "1:424567185813:web:c945cf0c3599391bda169c",
    measurementId: "G-KSY1DKBMDQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🔹 Nueva función para el login con Google
function call_login_google() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;

            if (!user.email) {
                console.error("❌ Error: El usuario de Google no tiene un email.");
                return;
            }

            console.log("✅ Usuario autenticado con Google:", user);

            const displayName = user.displayName || "Usuario Desconocido";
            const nameParts = displayName.split(" ");

            const userData = {
                correo_electronico: user.email,  // 🔹 Cambiado para coincidir con el DTO
                nombre: nameParts[0] || "",
                apellido_paterno: nameParts[1] || "",
                apellido_materno: nameParts[2] || "",
                telefono: user.phoneNumber || "",
                sexo: "Otro",  // Puedes mejorarlo si Firebase devuelve este dato
            };

            // 🔹 Enviar los datos al backend para guardarlos en la BD
            fetch("http://localhost:4000/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            })
            .then(response => response.json())
            .then(data => console.log("✅ Usuario guardado en BD:", data))
            .catch(error => console.error("❌ Error al registrar usuario en BD:", error));
        })
        .catch((error) => {
            console.error("❌ Error en la autenticación con Google:", error.message);
        });
}

const Register = () => {
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
                    <button className="google" onClick={call_login_google}>
                        <i className="fa-brands fa-google icon"></i>
                        Continuar con Google
                    </button>
                </div>

                <p className="login-link">¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>
            </div>
        </div>
    );
}

export default Register;
