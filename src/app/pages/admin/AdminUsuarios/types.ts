export type UiRole = 'admin' | 'proveedor' | 'cliente';
export type UiStatus = 'activo' | 'inactivo' | 'bloqueado' | 'suspendido';

export interface UiUser {
    id: string;
    email: string;
    rol: UiRole;
    estado: UiStatus;
    nombre: string;
    client?: {
        firstName: string;
        lastName: string;
        address: string;
        document: string;
        phone: string;
    };
    supplier?: {
        company: string;
        contactName: string;
        identification: string;
        phone: string;
    };
}
