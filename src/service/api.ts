// src/services/api.ts
import { saveUserSession, getUserSession } from './secureStorage';
import axios from 'axios';
const API_URL = 'http://localhost:4000/api';

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});
interface RegistroData {
  nombre: string;
  apellido_paterno: string;
  sexo: string;
  role: 'user' | 'admin'; // asegúrate de que esté bien tipeado
  correo_electronico: string;
  contrasena: string;
}

export const registrarUsuario = async (data: any) => {
  const res = await fetch(`http://localhost:4000/api/auth/registro`, {
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
// Suponiendo que tu login es con el mismo DTO (si es diferente avísame)
export const loginUsuario = async (correo: string, contrasena: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo_electronico: correo, contrasena }),
  });

  if (!res.ok) throw new Error('Credenciales incorrectas');
  const json = await res.json();
  if (json.jwtToken) {
    await saveUserSession(json.jwtToken);
  }

  return json;
};

// -------- Obtener productos (requiere token) --------
export const obtenerProductos = async () => {
  const token = await getUserSession();
  if (!token) throw new Error('No hay token');

  const res = await fetch(`${API_URL}/productos`, {
    method: 'GET',
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
    formData.append(key, producto[key]);
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
export const obtenerDetallePedidoPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/detallepedido/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo obtener el detalle del pedido');
  return res.json();
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
  calle: string;
  numero: string;
  colonia: string;
  municipio: string;
  estado: string;
  codigoPostal: string;
  referencias?: string;
  latitud?: number;
  longitud?: number;
  maps_url?: string;
  es_publica?: boolean;
}



// 1. Crear dirección

export const guardarDireccion = async (data: any, token: string) => {
  const res = await fetch('http://localhost:4000/api/direcciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Error guardando dirección: ${JSON.stringify(error)}`);
  }

  return await res.json();
};



// 2. Obtener direcciones del usuario
export const obtenerDirecciones = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/direcciones`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener las direcciones');
  return res.json();
};

// 3. Obtener dirección por ID
export const obtenerDireccionPorId = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/direcciones/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo obtener la dirección');
  return res.json();
};

// 4. Actualizar dirección
export const actualizarDireccion = async (id: number, data: Partial<DireccionData>) => {
  const token = await getUserSession();
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

// 5. Eliminar dirección
export const eliminarDireccion = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/direcciones/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudo eliminar la dirección');
  return res.json();
};

// 6. Marcar dirección como predeterminada
export const marcarDireccionPredeterminada = async (id: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/direcciones/${id}/predeterminada`, {
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
export const actualizarPasswordUsuario = async (token: string, passwords: { currentPassword: string; newPassword: string }) => {
  const res = await API.patch("/credenciales/actualizar-password", passwords, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
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
  pedidoId: number;
  clienteId: number;   // "clienteId" (DatosPersonales)
  formaPagoId: number;
  total: number;
  estado: 'emitida' | 'pagada' | 'cancelada';
  rfc: string;
  razon_social: string;
  uso_cfdi: string;
  metodo_pago: string;
  tipo_persona: 'FISICA' | 'MORAL';
}


// 1. Crear factura
export const crearFactura = async (data: FacturaData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/facturas`, {
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
  const res = await fetch(`${API_URL}/facturas/validar-rfc`, {
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
  const res = await fetch(`${API_URL}/facturas`, {
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
  const res = await fetch(`${API_URL}/facturas/${id}`, {
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
  const res = await fetch(`${API_URL}/facturas/${id}`, {
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
  const res = await fetch(`${API_URL}/facturas/${id}`, {
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
  const res = await fetch(`${API_URL}/facturas/pdf/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo generar el PDF');

  const blob = await res.blob();
  return blob;
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
      'Authorization': `Bearer ${token}`,
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

// 1. Agregar producto a la lista de deseos
export const agregarProductoListaDeseos = async (productoId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/lista-deseos/${productoId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo agregar a la lista de deseos');
  return res.json();
};

// 2. Quitar producto de la lista de deseos
export const quitarProductoListaDeseos = async (productoId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/lista-deseos/${productoId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo quitar de la lista de deseos');
  return res.json();
};

// 3. Obtener lista de deseos del usuario
export const obtenerListaDeseos = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/lista-deseos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo obtener la lista de deseos');
  return res.json();
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
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

// 1. Crear oferta (admin)
export const crearOferta = async (data: OfertaData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/ofertas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo crear la oferta');
  return res.json();
};

// 2. Obtener todas las ofertas (admin)
export const obtenerOfertas = async () => {
  const token = await getUserSession();
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
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudieron obtener las ofertas activas');
  return res.json();
};

// 4. Obtener oferta por ID
export const obtenerOfertaPorId = async (id: number) => {
  const token = await getUserSession();
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
  const res = await fetch(`${API_URL}/ofertas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('No se pudo actualizar la oferta');
  return res.json();
};

// 6. Eliminar oferta (admin)
export const eliminarOferta = async (id: number) => {
  const token = await getUserSession();
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

  const res = await fetch(`${API_URL}/pagos/subir-comprobante/${pagoId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('No se pudo subir el comprobante');
  return res.json();
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

// 1. Crear pedido
export const crearPedido = async (data: PedidoData) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('No se pudo crear el pedido');
  return res.json();
};

// 2. Obtener pedidos por usuario (admin/user)
export const obtenerPedidosUsuario = async (usuarioId: number) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos/ver_pedidos_usuario/${usuarioId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener los pedidos del usuario');
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
export const obtenerTodosLosPedidos = async () => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('No se pudieron obtener todos los pedidos');
  return res.json();
};

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
export const cambiarEstadoPedido = async (pedidoId: number, estado: string, comentario?: string) => {
  const token = await getUserSession();
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}/cambiar-estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ estado, comentario }),
  });
  if (!res.ok) throw new Error('No se pudo cambiar el estado del pedido');
  return res.json();
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
