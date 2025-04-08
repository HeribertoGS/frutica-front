import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRadio, IonRadioGroup, IonTitle, IonToast, IonToolbar, } from "@ionic/react";
import "./Perfil.css";
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useState } from 'react';
import { eye, eyeOff } from "ionicons/icons";

const Perfil: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [email, setEmail] = useState("usuario@ejemplo.com");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [toastMessage, setToastMessage] = useState("");


    const [savedPassword, setSavedPassword] = useState("Ale");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = () => {
        if (currentPassword !== savedPassword) {
            setToastMessage("La contraseña actual es incorrecta");
            return;
        }

        if (newPassword !== confirmPassword) {
            setToastMessage("Las nuevas contraseñas no coinciden");
            return;
        }

        // Validación de seguridad
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setToastMessage("La nueva contraseña debe tener al menos 8 caracteres, una mayúscula y un número");
            return;
        }

        setSavedPassword(newPassword);
        setShowModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setToastMessage("¡Cuenta actualizada correctamente!");
    };


    return (
        <FruticaLayout>
                <IonContent className="perfil-container" fullscreen={true}>
                    <IonCard style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <IonCardContent>
                            {/* ✅ Datos personales */}
                            <div className="profile-section">
                                <div className="titulo-seccion">
                                <h2 style={{ marginTop: '12px', fontSize: '20px', fontWeight: 'bold' }}>Datos personales</h2>

                                </div>

                                <IonInput
                                    label="Nombres:" placeholder="Escribe tu(s) nombre(s)"
                                    labelPlacement="stacked" className="input-alineado" />
                                <IonInput
                                    label="Apellidos:"  placeholder="Escribe tu(s) apellido(s)"
                                    labelPlacement="stacked"  className="input-alineado" />
                                <IonInput
                                    label="Celular:" placeholder="Digita tu número de celular"
                                    labelPlacement="stacked" className="input-alineado" />

                                <div style={{ marginTop: "16px" }} />

                                <IonInput label="Sexo:" />
                                <IonRadioGroup className="radio-inline-group">
                                    <div className="radio-inline-item">
                                        <IonRadio value="hombre" />
                                        <IonLabel>Hombre</IonLabel>
                                    </div>
                                    <div className="radio-inline-item">
                                        <IonRadio value="mujer" />
                                        <IonLabel>Mujer</IonLabel>
                                    </div>
                                </IonRadioGroup>
                            </div>

                            {/* ✅ Datos de la cuenta */}
                            <div className="profile-section datos-cuenta">
                                <h2>Datos de la cuenta</h2>

                                <IonInput
                                    label="Email" type="email"
                                    readonly  value={email}
                                    labelPlacement="stacked" className="input-alineado" />

                                <IonItem lines="inset" className="input-contraseña">
                                    <IonLabel position="stacked">Contraseña</IonLabel>
                                    <IonInput
                                        type={showPassword ? "text" : "password"}
                                        value={savedPassword} >
                                        <IonIcon
                                            icon={showPassword ? eyeOff : eye}  slot="end"
                                            className="eye-icon" onClick={() => setShowPassword(!showPassword)}  />
                                    </IonInput>
                                </IonItem>

                                <IonButton
                                    color="warning" className="btn-editar"
                                    onClick={() => setShowModal(true)} >
                                    Modificar
                                </IonButton>
                            </div>

                            {/* ✅ Datos de facturación */}
                            <div className="profile-section datos-facturacion">
                                <h2>Datos de facturación</h2>
                                <p>
                                    Para realizar facturas necesitas ingresar tus datos de razón
                                    social
                                </p>
                                <div className="botones-factura">
                                    <IonButton color="warning">Ver datos</IonButton>
                                    <IonButton color="success">Agregar datos</IonButton>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>

                    {/* ✅ Modal flotante */}
                    <IonModal
                        isOpen={showModal} onDidDismiss={() => setShowModal(false)}
                        className="custom-modal" >
                        <div className="modal-content">
                            <h2 style={{ textAlign: "center" }}>Editar cuenta</h2>

                            <IonInput
                                label="Correo electrónico" type="email"
                                value={email} onIonChange={(e) => setEmail(e.detail.value!)}
                                labelPlacement="stacked" />

                            <IonInput
                                label="Contraseña actual"  type="password"
                                value={currentPassword} onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                                labelPlacement="stacked" />

                            <IonItem lines="none">
                                <IonLabel position="stacked">Nueva contraseña</IonLabel>
                                <IonInput
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onIonChange={(e) => setNewPassword(e.detail.value!)} >
                                    <IonIcon
                                        icon={showNewPassword ? eyeOff : eye}  slot="end"
                                        className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)} />
                                </IonInput>
                            </IonItem>

                            <IonItem lines="none">
                                <IonLabel position="stacked">
                                    Confirmar nueva contraseña
                                </IonLabel>
                                <IonInput
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                >
                                    <IonIcon
                                        icon={showConfirmPassword ? eyeOff : eye}
                                        slot="end"
                                        className="eye-icon"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                </IonInput>
                            </IonItem>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                }}
                            >
                                <IonButton color="medium" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </IonButton>
                                <IonButton color="success" onClick={handleSave}>
                                    Aceptar
                                </IonButton>
                            </div>
                        </div>
                    </IonModal>

                    {/* ✅ Toast para alertas */}
                    <IonToast
                        isOpen={!!toastMessage}
                        message={toastMessage}
                        duration={2500}
                        color="danger"
                        onDidDismiss={() => setToastMessage("")}
                    />
                </IonContent>
         
        </FruticaLayout>
    );
};

export default Perfil;