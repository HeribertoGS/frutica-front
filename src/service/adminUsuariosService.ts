import { getUserSession } from './secureStorage';

export interface Usuario {
    usuario_k: number;
    nombre: string;
    apellido_paterno: string;
    email: string;
    user_verificado: boolean;
    role?: 'user' | 'admin';
}

export interface UpsertUsuarioPayload {
    nombre: string;
    apellido_paterno: string;
    email: string;
    role: 'user' | 'admin';
    contrasena?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const toRole = (raw: any): 'user' | 'admin' => {
    if (typeof raw === 'string') return raw.toLowerCase() === 'admin' ? 'admin' : 'user';
    if (typeof raw === 'number') return raw === 1 ? 'admin' : 'user'; // si tu enum es 0=user, 1=admin
    return 'user';
};

const normalizeUser = (u: any): Usuario => ({
    usuario_k: u.usuario_k ?? u.id,
    nombre: u.nombre ?? '',
    apellido_paterno: u.apellido_paterno ?? '',
    email: u.email
        ?? u.correo_electronico
        ?? u?.credenciales?.[0]?.email
        ?? '',

    user_verificado: Boolean(u.user_verificado ?? u.verificado),
    role: (u.role ?? u.rol ?? 'user').toLowerCase() === 'admin' ? 'admin' : 'user',
});

export const adminUsuariosService = {
    getAll: async (): Promise<Usuario[]> => {
        const token = await getUserSession();
        const res = await fetch(`${API_BASE}/usuarios`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`GET /usuarios -> ${res.status}`);
        const api = await res.json();
        console.log('API /usuarios (crudo):', api);

        const list = Array.isArray(api) ? api.map(normalizeUser) : [];
        console.log('API /usuarios (mapeado):', list);
        return list;
    },


    create: async (body: UpsertUsuarioPayload) => {
        const token = await getUserSession();
        // backend espera "correo_electronico"
        const payload: any = { ...body, correo_electronico: body.email };
        delete payload.email;

        const res = await fetch(`${API_BASE}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`POST /usuarios -> ${res.status}`);
        return normalizeUser(await res.json());
    },

    update: async (id: number, body: Partial<UpsertUsuarioPayload>) => {
        const token = await getUserSession();
        const payload: any = { ...body };
        if (payload.email && !payload.correo_electronico) {
            payload.correo_electronico = payload.email;
            delete payload.email;
        }

        const res = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`PATCH /usuarios/${id} -> ${res.status}`);
        return normalizeUser(await res.json());
    },

    remove: async (id: number) => {
        const token = await getUserSession();
        const res = await fetch(`${API_BASE}/usuarios/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`DELETE /usuarios/${id} -> ${res.status}`);
    },

    toggleVerificado: async (id: number, verificado: boolean) => {
        const token = await getUserSession();
        const res = await fetch(`${API_BASE}/usuarios/${id}/verificado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ verificado }),
        });
        if (!res.ok) throw new Error(`PATCH /usuarios/${id}/verificado -> ${res.status}`);
    },
};