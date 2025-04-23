import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonRadio, IonRadioGroup, IonTitle, IonToast, IonToolbar, } from "@ionic/react";
import "./Perfil.css";
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useState } from 'react';
import { eye, eyeOff } from "ionicons/icons";
import FacturaForm from "../../components/facturaForm/facturaForm";

const Perfil: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showFacturaModal, setShowFacturaModal] = useState(false);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<any | null>(null);
    const [facturasGuardadas, setFacturasGuardadas] = useState<any[]>([]);
    const [facturaEditando, setFacturaEditando] = useState<any | null>(null);

    const [email, setEmail] = useState("usuario@ejemplo.com");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const [savedPassword, setSavedPassword] = useState("Ale");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showModalVerFactura, setShowModalVerFactura] = useState(false);

    const handleSave = () => {
        if (currentPassword !== savedPassword) {
            setToastMessage("La contraseña actual es incorrecta");
            return;
        }

        if (newPassword !== confirmPassword) {
            setToastMessage("Las nuevas contraseñas no coinciden");
            return;
        }

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

    const handleGuardarFactura = (datos: any) => {
        if (facturaEditando) {
            setFacturasGuardadas(prev => prev.map(f => f.persona === datos.persona ? datos : f));
            setToastMessage("Factura actualizada correctamente");
        } else {
            if (facturasGuardadas.some(f => f.persona === datos.persona)) {
                setToastMessage(`Ya ingresaste una factura para persona ${datos.persona}`);
                return;
            }
            if (facturasGuardadas.length >= 2) {
                setToastMessage("Solo puedes ingresar dos facturas (una por tipo de persona)");
                return;
            }
            setFacturasGuardadas(prev => [...prev, datos]);
            setToastMessage("Factura guardada exitosamente");
        }

        setShowFacturaModal(false);
        setFacturaEditando(null);
    };

    return (
        <FruticaLayout>
            <IonContent className="perfil-container" fullscreen={true}>
                <IonCard style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <IonCardContent>
                        <div className="profile-section">
                            <div className="titulo-seccion">
                                <h2 style={{ marginTop: '12px', fontSize: '20px', fontWeight: 'bold' }}>Datos personales</h2>
                            </div>

                            <IonInput label="Nombres:" placeholder="Escribe tu(s) nombre(s)" labelPlacement="stacked" className="input-alineado" />
                            <IonInput label="Apellidos:" placeholder="Escribe tu(s) apellido(s)" labelPlacement="stacked" className="input-alineado" />
                            <IonInput label="Celular:" placeholder="Digita tu número de celular" labelPlacement="stacked" className="input-alineado" />

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

                        <div className="profile-section datos-cuenta">
                            <h2>Datos de la cuenta</h2>
                            <IonInput label="Email" type="email" readonly value={email} labelPlacement="stacked" className="input-alineado" />
                            <IonItem lines="inset" className="input-contraseña">
                                <IonLabel position="stacked">Contraseña</IonLabel>
                                <IonInput type={showPassword ? "text" : "password"} value={savedPassword} >
                                    <IonIcon icon={showPassword ? eyeOff : eye} slot="end" className="eye-icon" onClick={() => setShowPassword(!showPassword)} />
                                </IonInput>
                            </IonItem>
                            <IonButton color="warning" className="btn-editar" onClick={() => setShowModal(true)}>Modificar</IonButton>
                        </div>

                        <div className="profile-section datos-facturacion">
                            <h2>Datos de facturación</h2>
                            <p>Para realizar facturas necesitas ingresar tus datos de razón social</p>

                            <div className="factura-card-row">
                                {facturasGuardadas.map((factura, index) => (
                                    <div key={index} className="factura-mini-card">
                                        <div className="factura-info">
                                            <strong>{factura.razon}</strong>
                                            <small>{factura.persona.toUpperCase()}</small>
                                        </div>
                                        <div className="factura-actions">
                                            <IonButton size="small" fill="clear" onClick={() => {
                                                setFacturaSeleccionada(factura);
                                                setShowModalVerFactura(true);
                                            }}>
                                                👁️
                                            </IonButton>
                                            <IonButton size="small" fill="clear" onClick={() => {
                                                setFacturaEditando(factura);
                                                setShowFacturaModal(true);
                                            }}>
                                                ✏️
                                            </IonButton>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <IonButton
                                expand="block"
                                size="small"
                                color="success"
                                onClick={() => {
                                    setFacturaEditando(null);
                                    setShowFacturaModal(true);
                                }}
                            >
                                Agregar nueva factura
                            </IonButton>

                            <FacturaForm
                                isOpen={showFacturaModal}
                                onClose={() => {
                                    setShowFacturaModal(false);
                                    setFacturaEditando(null);
                                }}
                                onGuardar={handleGuardarFactura}
                                facturaExistente={facturaEditando}
                            />
                        </div>

                    </IonCardContent>
                </IonCard>

                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className="custom-modal" >
                    <div className="modal-content">
                        <h2 style={{ textAlign: "center" }}>Editar cuenta</h2>
                        <IonInput label="Correo electrónico" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} labelPlacement="stacked" />
                        <IonInput label="Contraseña actual" type="password" value={currentPassword} onIonChange={(e) => setCurrentPassword(e.detail.value!)} labelPlacement="stacked" />
                        <IonItem lines="none">
                            <IonLabel position="stacked">Nueva contraseña</IonLabel>
                            <IonInput type={showNewPassword ? "text" : "password"} value={newPassword} onIonChange={(e) => setNewPassword(e.detail.value!)} >
                                <IonIcon icon={showNewPassword ? eyeOff : eye} slot="end" className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)} />
                            </IonInput>
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel position="stacked">Confirmar nueva contraseña</IonLabel>
                            <IonInput type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onIonChange={(e) => setConfirmPassword(e.detail.value!)}>
                                <IonIcon icon={showConfirmPassword ? eyeOff : eye} slot="end" className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                            </IonInput>
                        </IonItem>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <IonButton color="medium" onClick={() => setShowModal(false)}>Cancelar</IonButton>
                            <IonButton color="success" onClick={handleSave}>Aceptar</IonButton>
                        </div>
                    </div>
                </IonModal>

                <IonModal isOpen={showModalVerFactura} onDidDismiss={() => setShowModalVerFactura(false)} className="custom-modal">
                    <div className="modal-content">
                        <h2 style={{ textAlign: "center" }}>Factura Guardada</h2>
                        {facturaSeleccionada && (
                            <ul>
                                <li><strong>Razón social:</strong> {facturaSeleccionada.razon}</li>
                                <li><strong>RFC:</strong> {facturaSeleccionada.rfc}</li>
                                <li><strong>Tipo:</strong> {facturaSeleccionada.persona}</li>
                                <li><strong>Régimen:</strong> {facturaSeleccionada.regimen}</li>
                                <li><strong>CFDI:</strong> {facturaSeleccionada.usoCfdi}</li>
                                <li><strong>Calle:</strong> {facturaSeleccionada.calle}, #{facturaSeleccionada.numero}</li>
                                <li><strong>Colonia:</strong> {facturaSeleccionada.colonia}</li>
                                <li><strong>Ciudad:</strong> {facturaSeleccionada.ciudad}</li>
                                <li><strong>Estado:</strong> {facturaSeleccionada.estado}</li>
                            </ul>
                        )}
                        <IonButton expand="block" onClick={() => setShowModalVerFactura(false)}>Cerrar</IonButton>
                    </div>
                </IonModal>

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
