import { UiUser, UiRole, UiStatus } from "./types";

export function capLabel(value: string) {
    if (!value) return "-";
    const s = value.trim().toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDateEs(value: string | Date | undefined) {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-ES");
}

export function getUserDate(u: any) {
    return u?.fechaRegistro ?? u?.createdAt ?? u?.created_at ?? null;
}

export function mapApiUserToUiUser(u: any): UiUser {
    let rol: UiRole = "cliente";
    if (Array.isArray(u.roles)) {
        const roleNames = u.roles.map((r: any) => String(r?.name ?? "").toUpperCase());
        if (roleNames.includes("ADMIN")) rol = "admin";
        else if (roleNames.includes("SUPPLIER")) rol = "proveedor";
        else if (roleNames.includes("CLIENT")) rol = "cliente";
        else if (roleNames.includes("USER")) rol = "cliente";
    }
    let estado: UiStatus = "inactivo";
    if (u.status && typeof u.status.name === "string") {
        const s = u.status.name.toUpperCase();
        if (s === "ACTIVE") estado = "activo";
        else if (s === "INACTIVE") estado = "inactivo";
        else if (s === "BLOCKED") estado = "bloqueado";
        else if (s === "SUSPENDED") estado = "suspendido";
    }
    const nombre =
        u?.client?.firstName || u?.client?.lastName
            ? `${u?.client?.firstName ?? ""} ${u?.client?.lastName ?? ""}`.trim()
            : u?.supplier?.company
                ? String(u?.supplier?.company)
                : String(u?.email ?? "");
    return {
        id: u.id,
        email: u.email,
        rol,
        estado,
        nombre,
        client: u.client,
        supplier: u.supplier,
    };
}
