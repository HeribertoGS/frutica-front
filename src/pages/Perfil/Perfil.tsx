import { IonButton, IonCard, IonCardContent, IonContent, IonItem, IonLabel, IonInput, IonRadio, IonRadioGroup, IonToast, IonIcon, IonSpinner } from "@ionic/react";
import "./Perfil.css";
import FruticaLayout from "../../components/Layout/FruticaLayout";
import { useState, useEffect } from "react";
import { eye, eyeOff } from "ionicons/icons";
import { obtenerPerfilUsuario, actualizarPerfilUsuario, actualizarPasswordUsuario, obtenerDatosFacturacion, guardarFacturacion } from '../../service/api';
import { getUserSession } from "../../service/secureStorage";

const Perfil: React.FC = () => {
    const [nombre, setNombre] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [telefono, setTelefono] = useState("");
    const [sexo, setSexo] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [rfc, setRfc] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [usoFactura, setUsoFactura] = useState("");
    const [tipoPersona, setTipoPersona] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showToast, setShowToast] = useState<{ show: boolean; message: string; color: 'success' | 'danger' }>({ show: false, message: '', color: 'success' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        setLoading(true);
        try {
            const token = await getUserSession();
            if (!token) throw new Error('No se encontró token de sesión');

            const perfil = await obtenerPerfilUsuario(token);
            if (perfil) {
                setNombre(perfil.nombre || "");
                setApellidoPaterno(perfil.apellido_paterno || "");
                setApellidoMaterno(perfil.apellido_materno || "");
                setTelefono(perfil.telefono || "");
                setSexo(perfil.sexo || "");
                setEmail(perfil.email || "");
            }

            const facturacion = await obtenerDatosFacturacion(token);
            if (facturacion) {
                setRfc(facturacion.rfc || "");
                setRazonSocial(facturacion.razon_social || "");
                setUsoFactura(facturacion.uso_factura || "");
                setTipoPersona(facturacion.tipo_persona || "");
            }
        } catch (error) {
            console.error('Error cargando perfil:', error);
            setShowToast({ show: true, message: "Error al cargar perfil", color: "danger" });
        }
        setLoading(false);
    };

    const handleGuardarPerfil = async () => {
        setLoading(true);
        try {
            const token = await getUserSession();
            if (!token) throw new Error('No se encontró token de sesión');

            await actualizarPerfilUsuario(token, {
                nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                telefono,
                sexo,
            });

            setShowToast({ show: true, message: 'Datos personales actualizados correctamente', color: 'success' });
        } catch (error) {
            console.error(error);
            setShowToast({ show: true, message: 'Error al actualizar datos personales', color: 'danger' });
        }
        setLoading(false);
    };

    const handleGuardarPassword = async () => {
        setLoading(true);
        try {
            if (newPassword !== confirmPassword) {
                setShowToast({ show: true, message: 'Las contraseñas no coinciden', color: 'danger' });
                return;
            }

            const token = await getUserSession();
            if (!token) throw new Error('No se encontró token de sesión');

            await actualizarPasswordUsuario(token, { currentPassword, newPassword });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowToast({ show: true, message: 'Contraseña actualizada correctamente', color: 'success' });
        } catch (error) {
            console.error(error);
            setShowToast({ show: true, message: 'Error al actualizar contraseña', color: 'danger' });
        }
        setLoading(false);
    };

    const handleGuardarFacturacion = async () => {
        setLoading(true);
        try {
            const token = await getUserSession();
            if (!token) throw new Error('No se encontró token de sesión');

            await guardarFacturacion(token, {
                rfc,
                razon_social: razonSocial,
                uso_factura: usoFactura,
                tipo_persona: tipoPersona,
            });

            setShowToast({ show: true, message: 'Datos de facturación guardados correctamente', color: 'success' });
        } catch (error) {
            console.error(error);
            setShowToast({ show: true, message: 'Error al guardar datos de facturación', color: 'danger' });
        }
        setLoading(false);
    };

    return (
        <FruticaLayout>
            <IonContent fullscreen className="perfil-container">
                <IonCard>
                    <IonCardContent>
                        {/* DATOS PERSONALES */}
                        <div className="profile-section">
                            <h2>Datos personales</h2>
                            <IonInput label="Nombres:" value={nombre} onIonChange={(e) => setNombre(e.detail.value!)} labelPlacement="stacked" />
                            <IonInput label="Apellido paterno:" value={apellidoPaterno} onIonChange={(e) => setApellidoPaterno(e.detail.value!)} labelPlacement="stacked" />
                            <IonInput label="Apellido materno:" value={apellidoMaterno} onIonChange={(e) => setApellidoMaterno(e.detail.value!)} labelPlacement="stacked" />
                            <IonInput label="Celular:" value={telefono} onIonChange={(e) => setTelefono(e.detail.value!)} labelPlacement="stacked" />

                            <IonLabel>Sexo:</IonLabel>
                            <IonRadioGroup value={sexo} onIonChange={(e) => setSexo(e.detail.value)}>
                                <div className="radio-inline-group">
                                    <IonItem className="radio-inline-item">
                                        <IonRadio value="hombre" /> <IonLabel>Hombre</IonLabel>
                                    </IonItem>
                                    <IonItem className="radio-inline-item">
                                        <IonRadio value="mujer" /> <IonLabel>Mujer</IonLabel>
                                    </IonItem>
                                </div>
                            </IonRadioGroup>
                            <IonButton expand="block" onClick={handleGuardarPerfil} color="success">
                                {loading ? <IonSpinner name="crescent" /> : 'Guardar cambios'}
                            </IonButton>
                        </div>

                        {/* DATOS DE CUENTA */}
                        <div className="profile-section">
                            <h2>Datos de la cuenta</h2>
                            <IonInput label="Correo electrónico" value={email} readonly labelPlacement="stacked" />
                            <IonInput label="Contraseña actual" value={currentPassword} type={showPassword ? 'text' : 'password'} onIonChange={(e) => setCurrentPassword(e.detail.value!)}>
                                <IonIcon icon={showPassword ? eyeOff : eye} slot="end" onClick={() => setShowPassword(!showPassword)} />
                            </IonInput>
                            <IonInput label="Nueva contraseña" value={newPassword} type={showNewPassword ? 'text' : 'password'} onIonChange={(e) => setNewPassword(e.detail.value!)}>
                                <IonIcon icon={showNewPassword ? eyeOff : eye} slot="end" onClick={() => setShowNewPassword(!showNewPassword)} />
                            </IonInput>
                            <IonInput label="Confirmar nueva contraseña" value={confirmPassword} type={showConfirmPassword ? 'text' : 'password'} onIonChange={(e) => setConfirmPassword(e.detail.value!)}>
                                <IonIcon icon={showConfirmPassword ? eyeOff : eye} slot="end" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                            </IonInput>
                            <IonButton expand="block" onClick={handleGuardarPassword} color="warning">
                                {loading ? <IonSpinner name="crescent" /> : 'Actualizar contraseña'}
                            </IonButton>
                        </div>

                        {/* DATOS FACTURACIÓN */}
                        <div className="profile-section">
                            <h2>Datos de facturación</h2>
                            <IonInput label="RFC" value={rfc} onIonChange={(e) => setRfc(e.detail.value!)} labelPlacement="stacked" />
                            <IonInput label="Razón social" value={razonSocial} onIonChange={(e) => setRazonSocial(e.detail.value!)} labelPlacement="stacked" />
                            <IonInput label="Uso de factura" value={usoFactura} onIonChange={(e) => setUsoFactura(e.detail.value!)} labelPlacement="stacked" />
                            <IonInput label="Tipo de persona" value={tipoPersona} onIonChange={(e) => setTipoPersona(e.detail.value!)} labelPlacement="stacked" />

                            <IonButton expand="block" onClick={handleGuardarFacturacion} color="primary">
                                {loading ? <IonSpinner name="crescent" /> : 'Guardar facturación'}
                            </IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonToast
                    isOpen={showToast.show}
                    message={showToast.message}
                    duration={2500}
                    color={showToast.color}
                    onDidDismiss={() => setShowToast({ show: false, message: '', color: 'success' })}
                />
            </IonContent>
        </FruticaLayout>
    );
};

export default Perfil;
