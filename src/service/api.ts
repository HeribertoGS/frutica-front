import axios, { AxiosError } from 'axios';
import { saveUserSession, getUserSession, getUserId, getToken } from './secureStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

API.interceptors.request.use(async (config) => {
  const token = await getUserSession();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza errores (status + message)
function unwrapAxiosError(err: unknown): never {
  const ax = err as AxiosError<any>;
  const status = ax.response?.status;
  const message =
    ax.response?.data?.message ||
    ax.message ||
    'Error inesperado. Intenta de nuevo.';
  const e = new Error(message) as Error & { status?: number };
  e.status = status;
  throw e;
}

interface RegistroData {
  nombre: string;
  apellido_paterno: string;
  sexo: string;
  role: 'user' | 'admin';
  correo_electronico: string;
  contrasena: string;
}

export const registrarUsuario = async (data: RegistroData) => {
  const res = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo registrar');

  const json = await res.json();
  console.log('🎉 Usuario registrado:', json.usuario);
  console.log('🟢 JWT recibido del backend:', json.jwtToken);
  return json;
};

// -------- Login de usuario --------
export const loginUsuario = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    // lee la respuesta y arma un Error con status
    let msg = 'Error al iniciar sesión';
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {
      const text = await res.text().catch(() => '');
      if (text) msg = text;
    }
    const e: any = new Error(msg);
    e.status = res.status;   // <-- AQUÍ guardamos el 403
    throw e;
  }
  const data = await res.json();
  return data;
};

// Nuevo login con Google
export const loginConGoogle = async (idTokenFirebase: string) => {
  const res = await fetch(`${API_URL}/auth/google`, {  
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: idTokenFirebase }),
  });

  // Manejo de errores con mensaje del backend y status
  if (!res.ok) {
    let msg = 'No se pudo iniciar sesión con Google';
    try {
      const body = await res.json();
      msg = body?.message || msg;
    } catch {}
    const e: any = new Error(msg);
    e.status = res.status;
    throw e;
  }

  // Respuesta: soporta { jwtToken, user } y también { jwtToken, usuario }
  const data = await res.json();
  const user = data.user ?? data.usuario ?? null;
  const role = user?.role ?? data.role ?? null;
  const jwtToken = data.jwtToken ?? null;

  if (!jwtToken || !user) {
    // El backend debería devolver ambos; si no, falla para que el front muestre error
    const e: any = new Error('Respuesta inválida del servidor');
    e.status = 500;
    throw e;
  }
  await saveUserSession(jwtToken, role);
  // Devuelve una forma normalizada
  return { jwtToken, user };
};



// ✅ Consultar si el usuario ya completó registro
export const verificarDireccionUsuario = async (token: string) => {
  const res = await fetch('http://localhost:4000/api/direccion/mia', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null; // No tiene dirección
    }
    throw new Error('Error al consultar dirección del usuario');
  }

  return await res.json(); // Si existe, devuelve la dirección
};

export const buscarCorreo = async (correo: string) => {
  const res = await fetch(`http://localhost:4000/api/credenciales/buscar-por-correo/${correo}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('No se encontró el correo');
  }

  return await res.json();
};
// verificarCorreoGoogle.ts
export const verificarCorreoGoogle = async (correo: string) => {
  const res = await fetch(`${API_URL}/credenciales/buscar-por-correo/${correo}`);
  if (!res.ok) {
    // No existe el correo
    return false;
  }
  const data = await res.json();
  return !!data;
};

// -------- Obtener productos (requiere token) --------
// 1. Obtener todos los productos
export const obtenerProductos = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/productos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los productos');
  return res.json();
};
export const obtenerCategorias = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/categoria`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener las categorías');
  return res.json();
};

// 2. Obtener un producto por ID
export const obtenerProductoPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener el producto');
  return res.json();
};

// 3. Crear producto (con múltiples imágenes)
export const crearProducto = async (producto: any, fotos: File[]) => {
  const token = await getUserSession();
  const formData = new FormData();

  fotos.forEach((file) => {
    formData.append('foto', file); // debe coincidir con el nombre en FilesInterceptor
  });

  for (const key in producto) {
    const valor = producto[key];
    if (typeof valor === 'boolean') {
      formData.append(key, valor ? 'true' : 'false');
    } else if (valor !== undefined && valor !== null) {
      formData.append(key, valor.toString());
    }
  }

  const res = await fetch(`${API_URL}/productos/crear`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('No se pudo crear el producto');
  return res.json();
};

// 4. Actualizar producto (sin imagen)
export const actualizarProducto = async (id: number, data: any) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el producto');
  return res.json();
};

// 5. Subir imagen para producto individual (opcional, si ya tienes un producto y subes imagen después)
export const subirImagenProducto = async (id: number, archivo: File) => {
  const token = await getUserSession();
  const formData = new FormData();
  formData.append('file', archivo); // debe coincidir con `@UploadedFile('file')`

  const res = await fetch(`${API_URL}/productos/${id}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('No se pudo subir la imagen');
  return res.json();
};

// 6. Eliminar producto
export const eliminarProducto = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar el producto');
  return res.json();
};


// 2. Crear nueva categoría
export const crearCategoria = async (nombre: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/categoria`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  });
  if (!res.ok) throw new Error('No se pudo crear la categoría');
  return res.json();
};

// 3. Obtener categoría por ID
export const obtenerCategoriaPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/categoria/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener la categoría');
  return res.json();
};

// 4. Actualizar categoría por ID
export const actualizarCategoria = async (id: number, nuevoNombre: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/categoria/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre: nuevoNombre }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar la categoría');
  return res.json();
};

// 5. Eliminar categoría
export const eliminarCategoria = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/categoria/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar la categoría');
  return res.json();
};

// ----------- COMENTARIOS -----------

export interface ComentarioData {
  titulo: string;
  descripcion: string;
  email?: string;
  web?: string;
  megusta?: boolean;
  pedidoId?: number;
  usuarioId?: number;
  respuestaId?: number;
}

// 1. Crear comentario
export const crearComentario = async (data: ComentarioData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/comentario`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo crear el comentario');
  return res.json();
};

// 2. Obtener todos los comentarios (solo admin)
export const obtenerComentarios = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/comentario`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los comentarios');
  return res.json();
};

// 3. Obtener comentario por ID
export const obtenerComentarioPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/comentario/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener el comentario');
  return res.json();
};

// 4. Actualizar comentario
export const actualizarComentario = async (id: number, data: Partial<ComentarioData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/comentario/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el comentario');
  return res.json();
};

// 5. Eliminar comentario
export const eliminarComentario = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/comentario/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar el comentario');
  return res.json();
};
/*Modificar datos de cuenta*/

export const actualizarContrasena = async (credencialId: number, nueva: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/credenciales/${credencialId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ contrasena: nueva }),
  });

  if (!res.ok) throw new Error('No se pudo actualizar la contraseña');
  return res.json();
};

// ----------- DATOS PERSONALES -----------

export interface DatosPersonalesData {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  // Agrega los campos que tenga tu DTO
}

// 1. Crear datos personales
export const crearDatosPersonales = async (data: DatosPersonalesData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/datos-personales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudieron crear los datos personales');
  return res.json();
};

// 2. Obtener todos (solo admin)
export const obtenerDatosPersonales = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/datos-personales`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los datos personales');
  return res.json();
};

// 3. Obtener datos personales por ID
export const obtenerDatosPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/datos-personales/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los datos del usuario');
  return res.json();
};

// 4. Actualizar datos personales
export const actualizarDatosPersonales = async (id: number, data: DatosPersonalesData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/datos-personales/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudieron actualizar los datos personales');
  return res.json();
};

// 5. Eliminar datos personales
export const eliminarDatosPersonales = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/datos-personales/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron eliminar los datos personales');
  return res.json();
};

// ----------- DETALLE PEDIDO -----------

export interface DetallePedidoData {
  productoId: number;
  pedidoId: number;
  cantidad: number;
  precio_unitario: number;
  tamano?: string;
  peso_total?: number;
  // Agrega otros campos si tu DTO los incluye
}

// 1. Crear detalle de pedido
export const crearDetallePedido = async (data: DetallePedidoData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detallepedido`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo crear el detalle del pedido');
  return res.json();
};

// 2. Obtener todos los detalles (admin)
export const obtenerDetallesPedidos = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detallepedido`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener los detalles de pedido');
  return res.json();
};

// 3. Obtener detalle por ID
export const obtenerPedidoPorId = async (pedidoId: number) => {
  try {
    const token = await getUserSession();
    const response = await fetch(`http://localhost:4000/api/pedidos/${pedidoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al cargar el pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Error cargando pedido real:', error);
    throw error;
  }
};
// 4. Actualizar detalle de pedido
export const actualizarDetallePedido = async (id: number, data: Partial<DetallePedidoData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detallepedido/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo actualizar el detalle del pedido');
  return res.json();
};



// 5. Eliminar detalle de pedido
export const eliminarDetallePedido = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detallepedido/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo eliminar el detalle del pedido');
  return res.json();
};
// ----------- DETALLE FACTURA -----------

export interface DetalleFacturaData {
  facturaId: number;
  concepto: string;
  monto: number;
  // agrega otros campos que incluya tu DTO si aplica
}

// 1. Crear detalle de factura
export const crearDetalleFactura = async (data: DetalleFacturaData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detalle-fact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo crear el detalle de factura');
  return res.json();
};

// 2. Obtener todos los detalles (solo admin)
export const obtenerDetallesFactura = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detalle-fact`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los detalles de factura');
  return res.json();
};

// 3. Obtener detalle por ID
export const obtenerDetalleFacturaPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detalle-fact/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener el detalle de factura');
  return res.json();
};

// 4. Actualizar detalle de factura
export const actualizarDetalleFactura = async (id: number, data: Partial<DetalleFacturaData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detalle-fact/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el detalle de factura');
  return res.json();
};

// 5. Eliminar detalle de factura
export const eliminarDetalleFactura = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detalle-fact/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar el detalle de factura');
  return res.json();
};
// ----------- DIRECCIONES -----------

export interface DireccionData {
  direccion_k?: number; // Agregado porque parece que lo necesitas
  calle: string;
  numero: string;
  colonia: string;
  municipio: string;
  estado: string;
  pais: string;
  cp: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
  maps_url?: string;
  es_publica?: boolean;
  es_predeterminada?: boolean; // Cambiado a opcional si no siempre es requerida
}

// 1. Guardar nueva dirección
export const guardarDireccion = async (data: DireccionData, token?: string) => {
  if (!token) token = await getToken();

  console.log(' Datos que se enviarán al backend:', data);

  const res = await fetch(`${API_URL}/direcciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('❌ Error del backend:', errorText); // Mostrar qué dice el backend
    throw new Error('No se pudo guardar la dirección');
  }

  return res.json();
};


// 2. Obtener todas tus direcciones
export const obtenerMisDirecciones = async () => {
  const token = await getToken(); // asegúrate de usar esta versión
  const res = await fetch(`${API_URL}/direcciones/mis-direcciones`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener las direcciones');
  return res.json();
};

// 3. Obtener dirección por ID
export const obtenerDireccionPorId = async (id: number, token?: string) => {
  if (!token) token = await getToken();
  const res = await fetch(`${API_URL}/direcciones/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener la dirección');
  return res.json();
};

// 4. Obtener la dirección predeterminada
export const obtenerDireccionPredeterminada = async (token?: string) => {
  if (!token) token = await getToken();
  const res = await fetch(`${API_URL}/direcciones/predeterminada`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener la dirección predeterminada');
  return res.json();
};

// 5. Editar/actualizar una dirección
export const editarDireccion = async (
  id: number,
  data: Partial<DireccionData>,
  token?: string
) => {
  if (!token) token = await getToken();
  const res = await fetch(`${API_URL}/direcciones/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo actualizar la dirección');
  return res.json();
};

// 6. Eliminar dirección
export const eliminarDireccion = async (id: number, token?: string) => {
  if (!token) token = await getToken();
  const res = await fetch(`${API_URL}/direcciones/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar la dirección');
  return res.json();
};

// 7. Marcar dirección como predeterminada
export const marcarDireccionPredeterminada = async (id: number, token?: string) => {
  if (!token) token = await getToken();
  const res = await fetch(`${API_URL}/direcciones/${id}/marcar-predeterminada`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo marcar como predeterminada');
  return res.json();
};



///---------------PERFIL------
/// -----------------------------
// Sección: PERFIL DEL USUARIO
// -----------------------------

// Obtener datos personales del usuario
export const obtenerPerfilUsuario = async (token: string) => {
  const res = await API.get("/usuarios/mi-perfil", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Obtener datos de facturación del usuario
export const obtenerDatosFacturacion = async (token: string) => {
  const res = await API.get("/datos-personales/mi-perfil", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Actualizar datos personales (nombre, apellidos, sexo, teléfono)
export const actualizarPerfilUsuario = async (token: string, datos: any) => {
  const res = await API.patch("/usuarios/mi-perfil", datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Actualizar contraseña del usuario
// api.ts
export const actualizarPasswordUsuario = async (
  token: string,
  passwords: { currentPassword: string; newPassword: string } // ajusta si tu backend solo pide newPassword
) => {
  try {
    const { data } = await API.patch(
      '/credenciales/actualizar-password',
      passwords,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data; // ej: { message: 'Contraseña actualizada correctamente' }
  } catch (err: any) {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ??
      (status === 400
        ? 'La contraseña actual no es correcta'
        : status === 403
          ? 'Tu cuenta no está activa'
          : 'No se pudo actualizar la contraseña');

    const e: any = new Error(message);
    e.status = status;
    throw e;
  }
};


// Guardar/Actualizar datos de facturación del usuario
export const guardarFacturacion = async (token: string, datos: { rfc: string; razon_social: string; uso_factura: string; tipo_persona: string }) => {
  const res = await API.post("/datos-personales/guardar-facturacion", datos, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};



// ----------- FACTURAS -----------

export interface FacturaData {
  rfc: string;
  razon_social: string;
  uso_cfdi: string;
  metodo_pago: string;
  forma_pago: string;
  direccion: string;
  tipo_persona: 'FISICA' | 'MORAL';
  usuarioId: number;
  pedidoId: number;
  // Agrega los que correspondan a tu DTO real
}

// 1. Crear factura
export const crearFactura = async (data: FacturaData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo crear la factura');
  return res.json();
};

// 2. Validar RFC
export const validarRFC = async (rfc: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura/validar-rfc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ rfc }),
  });

  if (!res.ok) throw new Error('RFC inválido');
  return res.json();
};

// 3. Obtener todas las facturas (admin)
export const obtenerFacturas = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener las facturas');
  return res.json();
};

// 4. Obtener factura por ID
export const obtenerFacturaPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo obtener la factura');
  return res.json();
};

// 5. Actualizar factura
export const actualizarFactura = async (id: number, data: Partial<FacturaData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo actualizar la factura');
  return res.json();
};

// 6. Eliminar factura
export const eliminarFactura = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo eliminar la factura');
  return res.json();
};

// 7. Descargar PDF (como blob)
export const descargarFacturaPDF = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/factura/pdf/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo generar el PDF');

  const blob = await res.blob();
  return blob;
};
//Obtener es publica
export const obtenerDireccionPublica = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/direcciones/publica`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener la dirección pública');
  return res.json();
};
// ----------- FORMAS DE PAGO -----------

export interface FormaPagoData {
  nombre_forma: string;
  requiere_terminacion: boolean;
  is_internet: boolean;
  logo?: string;
  activo: boolean;
}

// 1. Crear forma de pago (ADMIN)
export const crearFormaPago = async (data: FormaPagoData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/forma-pago`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo crear la forma de pago');
  return res.json();
};

// 2. Obtener todas las formas de pago (admin/user)
export const obtenerFormasPago = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/forma-pago`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener las formas de pago');
  return res.json();
};

// 3. Obtener forma de pago por ID
export const obtenerFormaPagoPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/forma-pago/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo obtener la forma de pago');
  return res.json();
};

// 4. Obtener formas de pago activas (solo admin)
export const obtenerFormasPagoActivas = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/forma-pago/activos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener las formas de pago activas');
  return res.json();
};

// 5. Actualizar forma de pago
export const actualizarFormaPago = async (id: number, data: Partial<FormaPagoData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/forma-pago/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo actualizar la forma de pago');
  return res.json();
};

// 6. Eliminar forma de pago
export const eliminarFormaPago = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/forma-pago/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo eliminar la forma de pago');
  return res.json();
};


// ----------- LISTA DE DESEOS -----------

export const agregarAListaDeseos = async (productoId: number) => {
  const token = await getUserSession();
  const userId = await getUserId(); // lo cargas del secureStorage

  const res = await fetch(`${API_URL}/lista-deseos/${productoId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }), // aunque tu controller no lo pide explícito, algunos setups lo requieren
  });

  if (!res.ok) {
    throw new Error('No se pudo agregar a la lista de deseos');
  }
  return await res.json();
};

export const quitarDeListaDeseos = async (productoId: number) => {
  const token = await getUserSession();
  const userId = await getUserId();

  const res = await fetch(`${API_URL}/lista-deseos/${productoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('No se pudo eliminar de la lista de deseos');
  }
  return await res.json();
};
export const obtenerListaDeseos = async () => {
  const token = await getUserSession();
  const userId = await getUserId();

  const res = await fetch(`${API_URL}/lista-deseos`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('No se pudo obtener la lista de deseos');
  }
  return await res.json();
};

// ----------- NOTIFICACIONES -----------

export interface NotificacionData {
  titulo: string;
  mensaje: string;
  tipo: string; // Ej: 'estado_pedido', 'sistema', etc.
  usuarioId?: number;
  leida?: boolean;
}

// 1. Crear notificación
export const crearNotificacion = async (data: NotificacionData) => {
  const res = await fetch(`${API_URL}/notificaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo crear la notificación');
  return res.json();
};

// 2. Obtener todas las notificaciones
export const obtenerNotificaciones = async () => {
  const res = await fetch(`${API_URL}/notificaciones`);
  if (!res.ok) throw new Error('No se pudieron obtener las notificaciones');
  return res.json();
};

// 3. Obtener notificación por ID
export const obtenerNotificacionPorId = async (id: number) => {
  const res = await fetch(`${API_URL}/notificaciones/${id}`);
  if (!res.ok) throw new Error('No se pudo obtener la notificación');
  return res.json();
};

// 4. Actualizar notificación
export const actualizarNotificacion = async (id: number, data: Partial<NotificacionData>) => {
  const res = await fetch(`${API_URL}/notificaciones/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo actualizar la notificación');
  return res.json();
};

// 5. Eliminar notificación
export const eliminarNotificacion = async (id: number) => {
  const res = await fetch(`${API_URL}/notificaciones/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('No se pudo eliminar la notificación');
  return res.json();
};
// ----------- OFERTAS -----------

export interface OfertaData {
  productoId: number;
  precio_oferta: number;
  porcentaje_descuento?: number;
  inicio: string;
  fin: string;
  descripcion?: string;
  activa?: boolean;
}

// 1. Crear nueva oferta (admin)
export const crearOferta = async (data: OfertaData) => {
  const token = await getUserSession();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/ofertas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error detalle:', errorText);
    throw new Error('No se pudo crear la oferta');
  }

  return res.json();
};

// 2. Obtener todas las ofertas (admin)
export const obtenerOfertas = async () => {
  const token = await getUserSession();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/ofertas`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener las ofertas');
  return res.json();
};

// 3. Obtener ofertas activas (user/admin)
export const obtenerOfertasActivas = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/ofertas/activas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener las ofertas activas');
  return res.json();
};


// 4. Obtener oferta por ID
export const obtenerOfertaPorId = async (id: number) => {
  const token = await getUserSession();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/ofertas/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo obtener la oferta');
  return res.json();
};

// 5. Actualizar oferta (admin)
export const actualizarOferta = async (id: number, data: Partial<OfertaData>) => {
  const token = await getUserSession();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/ofertas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error detalle:', errorText);
    throw new Error('No se pudo actualizar la oferta');
  }

  return res.json();
};

// 6. Eliminar oferta (admin)
export const eliminarOferta = async (id: number) => {
  const token = await getUserSession();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/ofertas/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo eliminar la oferta');
  return res.json();
};

// ----------- TIPO DE ENTREGA -----------

export interface TipoEntregaData {
  metodo_entrega: 'Entrega a domicilio' | 'Pasar a recoger';
  fecha_creacion_envio?: string;
  fecha_estimada_entrega?: string;
  hora_estimada_entrega?: string;
  costo_envio?: number;
  estado?: string;
  direccionId?: number;
  repartidorId?: number;
}

// 1. Crear tipo de entrega
export const crearTipoEntrega = async (data: TipoEntregaData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/tipo-entrega`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo crear el tipo de entrega');
  return res.json();
};

// 2. Obtener todos los tipos de entrega
export const obtenerTiposEntrega = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/tipo-entrega`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener los tipos de entrega');
  return res.json();
};

// 3. Obtener tipo de entrega por ID
export const obtenerTipoEntregaPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/tipo-entrega/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo obtener el tipo de entrega');
  return res.json();
};

// 4. Actualizar tipo de entrega (solo admin)
export const actualizarTipoEntrega = async (id: number, data: Partial<TipoEntregaData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/tipo-entrega/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo actualizar el tipo de entrega');
  return res.json();
};

// 5. Eliminar tipo de entrega
export const eliminarTipoEntrega = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/tipo-entrega/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo eliminar el tipo de entrega');
  return res.json();
};

// ----------- PAGOS -----------

export interface CreatePagoData {
  userId: number;
  metodo: string;
  pedidoId: number;
}

// 1. Crear un pago para un pedido
export const crearPago = async (data: CreatePagoData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pagos/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo crear el pago');
  return res.json();
};

// 2. Confirmar pago con tarjeta (Stripe)
export const confirmarPagoStripe = async (paymentIntentId: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pagos/confirm-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ paymentIntentId }),
  });
  if (!res.ok) throw new Error('No se pudo confirmar el pago con Stripe');
  return res.json();
};

/*///////xxxxxxxxdddddddddddddddd///////*/

export const iniciarPagoTarjeta = async (pedidoId: number) => {
  try {
    const token = await getToken(); // Obtenemos el token de secureStorage
    const response = await fetch(`${API_URL}/pagos/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Solo si tu backend requiere JWT
      },
      body: JSON.stringify({
        pedidoId: pedidoId,
        metodo: 'tarjeta',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar pago');
    }

    const data = await response.json();
    return data; // { clientSecret, paymentId, estadoPago, totalCompra }
  } catch (error) {
    console.error('Error al iniciar pago con tarjeta:', error);
    throw error;
  }
};


// 3. Obtener detalles de un pago por ID
export const obtenerDetallesPago = async (paymentId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pagos/detalles/${paymentId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los detalles del pago');
  return res.json();
};

// 4. Obtener pagos por usuario
export const obtenerPagosPorUsuario = async (userId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pagos/usuario/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los pagos del usuario');
  return res.json();
};

// 5. Actualizar estado del pago (admin)
export const actualizarEstadoPago = async (id: number, nuevoEstado: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pagos/update-status/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ state: nuevoEstado }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el estado del pago');
  return res.json();
};

// 6. Subir comprobante de pago (Cloudinary)
export const subirComprobantePago = async (pagoId: number, archivo: File) => {
  const token = await getUserSession();
  const formData = new FormData();
  formData.append('file', archivo);

  console.log(`Enviando archivo a: ${API_URL}/pagos/subir-comprobante/${pagoId}`);
  console.log('Tamaño del archivo:', (archivo.size / 1024).toFixed(2), 'KB');
  console.log('Tipo de archivo:', archivo.type);

  try {
    const res = await fetch(`${API_URL}/pagos/subir-comprobante/${pagoId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // No incluir Content-Type aquí, el navegador lo configura automáticamente con FormData
      },
      body: formData,
    });

    // Depuración de la respuesta
    console.log('Respuesta del servidor:', res.status, res.statusText);

    if (!res.ok) {
      // Intentar leer la respuesta del error
      const errorData = await res.json().catch(() => ({}));
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.message || 'No se pudo subir el comprobante');
    }

    return res.json();
  } catch (error) {
    console.error('Error completo:', error);
    throw error;
  }
};
// ----------- PEDIDOS -----------

export interface PedidoData {
  usuarioId: number;
  tipoEntregaId: number;
  formaPagoId: number;
  comentarioId?: number;
  total: number;
  subtotal: number;
  detalles: any[];
}

export interface FiltroPedidos {
  estados: string[];
  usuarioId?: number;
  desde?: Date;
  hasta?: Date;
  metodoPago?: string;
}
//Crear pedido 
export const crearPedidoFrutica = async (data: {
  tipo_entrega: "Entrega a domicilio" | "Pasar a recoger";
  formaPagoId: number;
  direccionId?: number;
  fecha_entrega: string;
  horario_entrega: string;
  costo_envio: number;
  usuarioId: number;
}) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    console.error('📜 Error del servidor:', responseData);
    throw new Error(responseData.message || ' No se pudo crear el pedido');
  }

  return responseData;
};


// 2. Obtener pedidos por usuario (admin/user)
export const obtenerPedidosUsuario = async () => {
  const token = await getUserSession();
  const userId = await getUserId();

  if (!token || !userId) {
    throw new Error('Usuario no autenticado');
  }

  const res = await fetch(`${API_URL}/pedidos/ver_pedidos_usuario/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error(' Error al obtener pedidos:', errorData);
    throw new Error(errorData.message || 'Error al obtener pedidos');
  }

  return res.json();
};

// 3. Obtener pedidos por estado
export const obtenerPedidosPorEstado = async (estados: string[]) => {
  const token = await getUserSession();
  const estadoParam = estados.join(',');
  const res = await fetch(`${API_URL}/pedidos/por-estado?estado=${estadoParam}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los pedidos por estado');
  return res.json();
};

// 4. Filtro avanzado (admin)
export const obtenerPedidosPorFiltros = async (filtros: FiltroPedidos) => {
  const token = await getUserSession();
  const query = new URLSearchParams();
  if (filtros.estados.length) query.append('estado', filtros.estados.join(','));
  if (filtros.usuarioId) query.append('usuario', filtros.usuarioId.toString());
  if (filtros.desde) query.append('desde', filtros.desde.toISOString());
  if (filtros.hasta) query.append('hasta', filtros.hasta.toISOString());
  if (filtros.metodoPago) query.append('metodoPago', filtros.metodoPago);

  const res = await fetch(`${API_URL}/pedidos/filtro?${query.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener los pedidos filtrados');
  return res.json();
};

// 5. Obtener todos los pedidos (admin)
export async function obtenerTodosPedidos() {
  try {
    const token = await getToken(); // Aquí usamos tu función
    const response = await fetch(`${API_URL}/pedidos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener todos los pedidos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo todos los pedidos:', error);
    throw error;
  }
}


// 6. Obtener detalle de un pedido
export const obtenerDetallePedido = async (pedidoId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener el detalle del pedido');
  return res.json();
};

// 7. Actualizar pedido (admin/user)
export const actualizarPedido = async (pedidoId: number, data: Partial<PedidoData>) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el pedido');
  return res.json();
};

// 8. Cambiar estado del pedido (admin)


export const cambiarEstadoPedido = async (pedidoId: number, nuevoEstado: string, comentario?: string) => {
  const token = await getUserSession();
  const response = await fetch(`${API_URL}/pedidos/${pedidoId}/cambiar-estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nuevoEstado,
      comentario
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error al cambiar estado:', errorData);
    throw new Error(errorData.message || 'Error al cambiar estado del pedido');
  }

  return await response.json();
};

// 9. Eliminar pedido (admin)
export const eliminarPedido = async (pedidoId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar el pedido');
  return res.json();
};

///***CARRITO** */
export interface CrearProductoCarritoDto {
  usuarioId: number;
  productoId: number;
  cantidad: number;
  tipo_medida: 'kg' | 'pieza';
  peso_personalizado?: number;
  tamano?: 'Chico' | 'Mediano' | 'Grande';
}

// 1. Obtener el carrito de un usuario

// Reemplaza tu función obtenerCarritoUsuario en api.ts con esta versión

export const obtenerCarritoUsuario = async () => {
  const userId = await getUserId();
  const token = await getUserSession();

  console.log('Obteniendo carrito para usuario:', userId);

  const res = await fetch(`${API_URL}/carrito/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Si el carrito no existe (404), devolver un carrito vacío
  if (res.status === 404) {
    console.log('Carrito no existe para usuario', userId, '- devolviendo carrito vacío');
    return {
      items: [],
      usuario_id: userId,
      total: 0
    };
  }

  // Si hay otros errores, lanzar la excepción
  if (!res.ok) {
    console.error(' Error en obtenerCarritoUsuario:', res.status, res.statusText);
    throw new Error(`Error ${res.status}: No se pudo obtener el carrito`);
  }

  const data = await res.json();
  console.log('Carrito obtenido exitosamente:', data);
  return data;
};

// 2. Agregar producto al carrito
export const agregarProductoAlCarrito = async (data: CrearProductoCarritoDto) => {
  const token = await getUserSession();

  const res = await fetch(`${API_URL}/carrito/agregar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo agregar producto al carrito');
  return res.json();
};

// 3. Agregar todos los productos desde la lista de deseos
export const agregarTodosDesdeLista = async () => {
  const token = await getUserSession();

  const res = await fetch(`${API_URL}/carrito/desde-deseos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo agregar desde la lista de deseos');
  return res.json();
};

// 4. Editar producto del carrito
export const editarProductoCarrito = async (
  productoId: number,
  data: {
    nuevaCantidad: number;
    tipo_medida: 'kg' | 'pieza';
    tamano?: 'Chico' | 'Mediano' | 'Grande';
    peso_personalizado?: number;
  }
) => {
  const userId = await getUserId();
  const token = await getUserSession();

  const res = await fetch(`${API_URL}/carrito/${userId}/${productoId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo editar el producto del carrito');
  return res.json();
};

// 5. Vaciar carrito
export const vaciarCarritoUsuario = async () => {
  const userId = await getUserId();
  const token = await getUserSession();

  const res = await fetch(`${API_URL}/carrito/vaciar/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo vaciar el carrito');
  return res.json();
};

// 6. Eliminar producto del carrito
export const eliminarProductoCarrito = async (
  productoId: number,
  tipo_medida: 'kg' | 'pieza'
) => {
  const userId = await getUserId();
  const token = await getUserSession();

  const res = await fetch(`${API_URL}/carrito/${userId}/${productoId}/${tipo_medida}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo eliminar el producto del carrito');
  return res.json();
};
