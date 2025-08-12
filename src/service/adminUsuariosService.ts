// src/service/adminUsuariosService.ts
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

const normalizeUser = (u: any): Usuario => ({
    usuario_k: u.usuario_k ?? u.id,
    nombre: u.nombre ?? '',
    apellido_paterno: u.apellido_paterno ?? '',
    email: u.email ?? u.correo_electronico ?? u.credencial?.email ?? '',
    user_verificado: u.user_verificado ?? u.verificado ?? false,
    role: (u.role ?? u.rol ?? 'user') as 'user' | 'admin',
});

export const adminUsuariosService = {
    getAll: async (): Promise<Usuario[]> => {
        const token = await getUserSession();
        const res = await fetch(`${API_BASE}/usuarios`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`GET /usuarios -> ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data.map(normalizeUser) : [];
    },

    create: async (body: UpsertUsuarioPayload) => {
        const token = await getUserSession();
        const payload: any = { ...body };
        if (!payload.correo_electronico) payload.correo_electronico = body.email;

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