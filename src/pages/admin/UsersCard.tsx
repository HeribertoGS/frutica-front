// src/pages/admin/UsersCard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    IonPage, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonBadge, IonIcon, IonSearchbar, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonItem, IonLabel,
    IonInput, IonSpinner, useIonToast, IonText, IonFooter, SearchbarInputEventDetail, InputInputEventDetail
} from '@ionic/react';
import { add, pencil, trash, power } from 'ionicons/icons';
import { adminUsuariosService, Usuario, UpsertUsuarioPayload } from '../../service/adminUsuariosService';
import DesktopHeader from '../../components/Navbar/DesktopHeader';
import MobileHeader from '../../components/Navbar/MobileHeader';

const UsersCard: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [edit, setEdit] = useState<Usuario | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<UpsertUsuarioPayload>({
        nombre: '',
        apellido_paterno: '',
        //correo_electronico: '',
        role: 'user',
        email: ''
    });
    const [present] = useIonToast();

    const notify = (message: string, color: any = 'success') =>
        present({ message, duration: 1600, color });

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await adminUsuariosService.getAll();
            setUsuarios(data);
        } catch (e) {
            console.error(e);
            notify('Error cargando usuarios', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const filtered = useMemo(() => {
        const k = q.trim().toLowerCase();
        if (!k) return usuarios;
        return usuarios.filter(u =>
            `${u.nombre} ${u.apellido_paterno}`.toLowerCase().includes(k) ||
            u.email.toLowerCase().includes(k)
        );
    }, [usuarios, q]);

    const openCreate = () => {
        setEdit(null);
        setForm({
            nombre: '',
            apellido_paterno: '',
            email: '',
            role: 'user',
            contrasena: ''
        });
        setShowModal(true);
    };


    const save = async () => {
        setSaving(true);
        try {
            if (edit) {
                await adminUsuariosService.update(edit.usuario_k, { ...form, contrasena: undefined });
                notify('Usuario actualizado');
            } else {
                await adminUsuariosService.create(form);
                notify('Usuario creado');
            }
            setShowModal(false);
            await cargar();

            const data = await adminUsuariosService.getAll();
            console.log('UsersCard recibe:', data);
            setUsuarios(data);
            

        } catch (e) {
            console.error(e);
            notify('No se pudo guardar', 'danger');
        } finally {
            setSaving(false);
        }
    };

    const removeUser = async (u: Usuario) => {
        const ok = window.confirm(`¿Eliminar a ${u.nombre}?`);
        if (!ok) return;
        try {
            await adminUsuariosService.remove(u.usuario_k);
            notify('Usuario eliminado');
            await cargar();
        } catch (e) {
            console.error(e);
            notify('No se pudo eliminar', 'danger');
        }
    };

    const toggleVerificado = async (u: Usuario) => {
        try {
            await adminUsuariosService.toggleVerificado(u.usuario_k, !u.user_verificado);
            notify(!u.user_verificado ? 'Cuenta activada' : 'Cuenta desactivada');
            setUsuarios(prev =>
                prev.map(p => p.usuario_k === u.usuario_k ? { ...p, user_verificado: !u.user_verificado } : p)
            );
        } catch (e) {
            console.error(e);
            notify('No se pudo cambiar el estado', 'danger');
        }
    };

    return (
        <IonPage>
            <DesktopHeader />
            <MobileHeader />

            <IonContent fullscreen className="ion-padding">
                <IonCard>
                    <IonCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <IonCardTitle>Gestionar Usuarios</IonCardTitle>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <IonSearchbar
                                value={q}
                                onIonInput={(e: CustomEvent<SearchbarInputEventDetail>) => setQ(e.detail.value!)}
                                placeholder="Buscar por nombre o correo"
                                debounce={300}
                                style={{ maxWidth: 320 }}
                            />
                        </div>
                    </IonCardHeader>

                    <IonCardContent>
                        {loading ? (
                            <div style={{ display: 'grid', placeItems: 'center', padding: 24 }}>
                                <IonSpinner name="crescent" />
                            </div>
                        ) : (
                            <IonGrid>
                                <IonRow className="ion-text-center ion-hide-sm-down" style={{ fontWeight: 600 }}>
                                    <IonCol size="3">Nombre</IonCol>
                                    <IonCol size="2">Rol</IonCol>
                                    <IonCol size="3">Correo Electrónico</IonCol>
                                    <IonCol size="2">Estado</IonCol>
                                    <IonCol size="2">Acciones</IonCol>
                                </IonRow>

                                {filtered.map(u => (
                                    <IonRow
                                        key={u.usuario_k}
                                        className="ion-align-items-center ion-text-center"
                                        style={{ borderTop: '1px solid #eee', padding: '8px 0' }}
                                    >
                                        <IonCol size="12" sizeMd="3">
                                            <IonText><strong>{u.nombre} {u.apellido_paterno}</strong></IonText>
                                        </IonCol>
                                        <IonCol size="6" sizeMd="2">
                                            <IonBadge color={String(u.role).toLowerCase() === 'admin' ? 'tertiary' : 'medium'}>
                                                {String(u.role || 'user').toUpperCase()}
                                            </IonBadge>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="3">
                                            <IonText>{u.email}</IonText>
                                        </IonCol>
                                        <IonCol size="6" sizeMd="2">
                                            <IonBadge color={u.user_verificado ? 'success' : 'danger'}>
                                                {u.user_verificado ? 'ACTIVA' : 'INACTIVA'}
                                            </IonBadge>
                                        </IonCol>
                                        <IonCol size="12" sizeMd="2">
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                                <IonButton size="small" fill="outline" onClick={() => toggleVerificado(u)}>
                                                    <IonIcon slot="start" icon={power} />
                                                    {u.user_verificado ? 'Desactivar' : 'Activar'}
                                                </IonButton>

                                                <IonButton size="small" color="danger" fill="clear" onClick={() => removeUser(u)}>
                                                    <IonIcon slot="icon-only" icon={trash} />
                                                </IonButton>
                                            </div>
                                        </IonCol>
                                    </IonRow>
                                ))}

                                {!filtered.length && (
                                    <IonRow>
                                        <IonCol className="ion-text-center" style={{ padding: 24 }}>
                                            <IonText color="medium">No hay usuarios para mostrar.</IonText>
                                        </IonCol>
                                    </IonRow>
                                )}
                            </IonGrid>
                        )}
                    </IonCardContent>
                </IonCard>

                {/* Modal crear/editar */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{edit ? 'Editar usuario' : 'Nuevo usuario'}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>

                    <IonContent className="ion-padding">
                        <IonItem>
                            <IonLabel position="stacked">Nombre</IonLabel>
                            <IonInput
                                value={form.nombre}
                                onIonInput={(e: CustomEvent<InputInputEventDetail>) =>
                                    setForm(f => ({ ...f, nombre: e.detail.value || '' }))
                                }
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Apellido paterno</IonLabel>
                            <IonInput
                                value={form.apellido_paterno}
                                onIonInput={(e: CustomEvent<InputInputEventDetail>) =>
                                    setForm(f => ({ ...f, apellido_paterno: e.detail.value || '' }))
                                }
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Correo electrónico</IonLabel>
                            <IonInput
                                type="email"
                                value={form.email}
                                onIonInput={(e: CustomEvent<InputInputEventDetail>) =>
                                    setForm(f => ({ ...f, email: e.detail.value || '' }))
                                }
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Rol (user/admin)</IonLabel>
                            <IonInput
                                value={form.role}
                                onIonInput={(e: CustomEvent<InputInputEventDetail>) =>
                                    setForm(f => ({ ...f, role: (e.detail.value || 'user') as any }))
                                }
                            />
                        </IonItem>

                        {!edit && (
                            <IonItem>
                                <IonLabel position="stacked">Contraseña</IonLabel>
                                <IonInput
                                    type="password"
                                    value={form.contrasena}
                                    onIonInput={(e: CustomEvent<InputInputEventDetail>) =>
                                        setForm(f => ({ ...f, contrasena: e.detail.value || '' }))
                                    }
                                />
                            </IonItem>
                        )}
                    </IonContent>

                    <IonFooter className="ion-padding">
                        <IonButton expand="block" onClick={save} disabled={saving}>
                            {saving ? <IonSpinner name="dots" /> : 'Guardar'}
                        </IonButton>
                    </IonFooter>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default UsersCard;
