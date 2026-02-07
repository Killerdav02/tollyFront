// Datos de ejemplo para la aplicación

// Estados de herramientas
export type ToolStatus = 'AVAILABLE' | 'RENTED' | 'UNDER_REPAIR';

// Estados de reservas
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED' | 'IN_INCIDENT';

// Estados de devoluciones
export type ReturnStatus = 'PENDING' | 'SENT' | 'RECEIVED' | 'DAMAGED';

export interface Herramienta {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precioDia: number;
  totalQuantity: number; // Cantidad total en inventario
  availableQuantity: number; // Cantidad disponible para alquilar
  status: ToolStatus; // Estado general de la herramienta
  proveedorId: string;
  proveedorNombre: string;
  imagen: string;
}

export interface ReservationDetail {
  id: string;
  reservationId: string;
  toolId: string;
  toolName: string;
  quantity: number;
  pricePerDay: number;
  subtotal: number;
}

export interface Reserva {
  id: string;
  clienteId: string;
  clienteNombre: string;
  proveedorId: string;
  proveedorNombre: string;
  fechaInicio: string;
  fechaFin: string;
  precioTotal: number;
  estado: ReservationStatus;
  metodoPago?: string;
  details: ReservationDetail[]; // Detalles de herramientas en la reserva
}

export interface ReturnDetail {
  id: string;
  returnId: string;
  toolId: string;
  toolName: string;
  quantityReserved: number; // Cantidad que se reservó
  quantityToReturn: number; // Cantidad que se está devolviendo
  notes?: string;
}

export interface Return {
  id: string;
  reservationId: string;
  clienteId: string;
  clienteNombre: string;
  proveedorId: string;
  proveedorNombre: string;
  status: ReturnStatus;
  createdAt: string;
  sentAt?: string; // Fecha cuando cliente confirmó envío
  receivedAt?: string; // Fecha cuando proveedor recibió
  details: ReturnDetail[];
  notes?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'proveedor' | 'cliente';
  fechaRegistro: string;
  estado: 'activo' | 'inactivo';
}

export const herramientas: Herramienta[] = [
  {
    id: '1',
    nombre: 'Taladro Eléctrico DeWalt',
    categoria: 'Herramientas Eléctricas',
    descripcion: 'Taladro profesional de 850W con velocidad variable',
    precioDia: 25,
    totalQuantity: 5,
    availableQuantity: 4,
    status: 'RENTED',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    imagen: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    nombre: 'Sierra Circular Makita',
    categoria: 'Herramientas Eléctricas',
    descripcion: 'Sierra circular de 7 1/4" para cortes precisos',
    precioDia: 30,
    totalQuantity: 3,
    availableQuantity: 3,
    status: 'AVAILABLE',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    imagen: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    nombre: 'Compresor de Aire',
    categoria: 'Compresores',
    descripcion: 'Compresor portátil 50L, ideal para pintura',
    precioDia: 40,
    totalQuantity: 2,
    availableQuantity: 0,
    status: 'RENTED',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    imagen: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    nombre: 'Escalera Extensible',
    categoria: 'Acceso',
    descripcion: 'Escalera de aluminio extensible hasta 6 metros',
    precioDia: 15,
    totalQuantity: 4,
    availableQuantity: 4,
    status: 'AVAILABLE',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    imagen: 'https://images.unsplash.com/photo-1581092160607-ee67eb3c1e19?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    nombre: 'Lijadora Orbital',
    categoria: 'Herramientas Eléctricas',
    descripcion: 'Lijadora orbital profesional con aspiración',
    precioDia: 20,
    totalQuantity: 6,
    availableQuantity: 6,
    status: 'AVAILABLE',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    imagen: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    nombre: 'Carretilla Industrial',
    categoria: 'Transporte',
    descripcion: 'Carretilla de carga pesada 200kg',
    precioDia: 10,
    totalQuantity: 8,
    availableQuantity: 7,
    status: 'RENTED',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    imagen: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
  },
];

export const reservationDetails: ReservationDetail[] = [
  {
    id: 'rd1',
    reservationId: '1',
    toolId: '3',
    toolName: 'Compresor de Aire',
    quantity: 2,
    pricePerDay: 40,
    subtotal: 240, // 2 unidades x 40 x 3 días
  },
  {
    id: 'rd2',
    reservationId: '2',
    toolId: '1',
    toolName: 'Taladro Eléctrico DeWalt',
    quantity: 1,
    pricePerDay: 25,
    subtotal: 25,
  },
  {
    id: 'rd3',
    reservationId: '3',
    toolId: '2',
    toolName: 'Sierra Circular Makita',
    quantity: 1,
    pricePerDay: 30,
    subtotal: 90,
  },
  {
    id: 'rd4',
    reservationId: '4',
    toolId: '6',
    toolName: 'Carretilla Industrial',
    quantity: 1,
    pricePerDay: 10,
    subtotal: 50,
  },
];

export const reservas: Reserva[] = [
  {
    id: '1',
    clienteId: '3',
    clienteNombre: 'María García',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    fechaInicio: '2026-02-01',
    fechaFin: '2026-02-03',
    precioTotal: 240,
    estado: 'IN_PROGRESS',
    metodoPago: 'Tarjeta de Crédito',
    details: [reservationDetails[0]],
  },
  {
    id: '2',
    clienteId: '4',
    clienteNombre: 'Carlos Rodríguez',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    fechaInicio: '2026-02-05',
    fechaFin: '2026-02-05',
    precioTotal: 25,
    estado: 'PENDING',
    details: [reservationDetails[1]],
  },
  {
    id: '3',
    clienteId: '3',
    clienteNombre: 'María García',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    fechaInicio: '2026-01-28',
    fechaFin: '2026-01-30',
    precioTotal: 90,
    estado: 'FINISHED',
    metodoPago: 'PayPal',
    details: [reservationDetails[2]],
  },
  {
    id: '4',
    clienteId: '3',
    clienteNombre: 'María García',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    fechaInicio: '2026-02-04',
    fechaFin: '2026-02-08',
    precioTotal: 50,
    estado: 'CONFIRMED',
    metodoPago: 'Tarjeta de Crédito',
    details: [reservationDetails[3]],
  },
];

// Devoluciones de ejemplo
export const returns: Return[] = [
  {
    id: 'ret1',
    reservationId: '1',
    clienteId: '3',
    clienteNombre: 'María García',
    proveedorId: '2',
    proveedorNombre: 'Juan Pérez',
    status: 'PENDING',
    createdAt: '2026-02-07T10:30:00',
    details: [
      {
        id: 'retd1',
        returnId: 'ret1',
        toolId: '3',
        toolName: 'Compresor de Aire',
        quantityReserved: 2,
        quantityToReturn: 2,
        notes: 'En perfectas condiciones',
      },
    ],
    notes: 'Devolución programada según contrato',
  },
];

export const usuarios: Usuario[] = [
  {
    id: '1',
    nombre: 'Administrador General',
    email: 'admin@toolrental.com',
    rol: 'admin',
    fechaRegistro: '2025-01-01',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Juan Pérez',
    email: 'proveedor@toolrental.com',
    rol: 'proveedor',
    fechaRegistro: '2025-06-15',
    estado: 'activo',
  },
  {
    id: '3',
    nombre: 'María García',
    email: 'cliente@example.com',
    rol: 'cliente',
    fechaRegistro: '2025-08-20',
    estado: 'activo',
  },
  {
    id: '4',
    nombre: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    rol: 'cliente',
    fechaRegistro: '2025-10-05',
    estado: 'activo',
  },
  {
    id: '5',
    nombre: 'Ana Martínez',
    email: 'ana@example.com',
    rol: 'cliente',
    fechaRegistro: '2025-11-12',
    estado: 'inactivo',
  },
];

export const facturacionData = {
  ingresosTotal: 15450,
  ingresosMes: 3250,
  reservasMes: 47,
  reservasTotal: 234,
  herramientasActivas: 6,
  proveedoresActivos: 1,
  clientesActivos: 4,
};

export const reportesData = {
  herramientasMasAlquiladas: [
    { nombre: 'Taladro Eléctrico', alquileres: 45 },
    { nombre: 'Sierra Circular', alquileres: 38 },
    { nombre: 'Compresor', alquileres: 32 },
    { nombre: 'Lijadora', alquileres: 28 },
    { nombre: 'Escalera', alquileres: 25 },
  ],
  rentabilidadMensual: [
    { mes: 'Ago', ingresos: 2100 },
    { mes: 'Sep', ingresos: 2450 },
    { mes: 'Oct', ingresos: 2800 },
    { mes: 'Nov', ingresos: 2650 },
    { mes: 'Dic', ingresos: 3200 },
    { mes: 'Ene', ingresos: 3250 },
  ],
};