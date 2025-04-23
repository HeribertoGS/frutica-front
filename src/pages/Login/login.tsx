import React, { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonText, IonIcon, IonCard, IonCardContent, useIonToast} from '@ionic/react';
import { eyeOutline, eyeOffOutline, logoGoogle } from 'ionicons/icons';
import './login.css';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [present] = useIonToast();
    const history = useHistory();

    const togglePassword = () => setShowPassword(!showPassword);

    const handleLogin = () => {
        if (!email || !password) {
            setError('Todos los campos son obligatorios');
            present({ message: 'Completa todos los campos', duration: 2000, color: 'danger' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Correo inválido');
            present({ message: 'Correo inválido', duration: 2000, color: 'danger' });
            return;
        }

        setError('');
        // Aquí iría autenticación real si tuvieras API
        history.push('/fruta');
    };

    return (
        <IonPage>
            <IonContent className="login-wrapper" fullscreen>
            <div className="login-card-container">
                <IonCard className="login-card">
                    <IonCardContent>
                        <img src="src/assets/img/logofrutica.png" alt="Frutica Logo" className="login-logo" />

                        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                            <IonInput
                                type="email"
                                value={email}
                                placeholder="Correo electrónico"
                                className="login-input"
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            />
                            <div className="login-password-wrapper">
                                <IonInput
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    placeholder="Contraseña"
                                    className="login-input"
                                    onIonChange={(e) => setPassword(e.detail.value!)}
                                />
                                <IonIcon
                                    icon={showPassword ? eyeOffOutline : eyeOutline}
                                    onClick={togglePassword}
                                    className="login-eye"
                                />
                            </div>

                            {error && <IonText color="danger"><small>{error}</small></IonText>}

                            <IonText className="login-forgot">¿Olvidaste la contraseña?</IonText>

                            <IonButton expand="block" className="login-button" onClick={handleLogin}>
                                Entrar
                            </IonButton>

                            <IonText className="login-or">O iniciar con</IonText>

                            <IonButton expand="block" className="login-social-button login-google">
                                <IonIcon icon={logoGoogle} slot="start" />
                                Continuar con Google
                            </IonButton>

                            <div className="login-footer">
                                ¿No tiene cuenta?
                                <span className="login-register-link"> Regístrate</span>
                            </div>
                        </form>
                    </IonCardContent>
                </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;
