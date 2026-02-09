import { Badge } from "./ui/badge";

export type ToolStatus = "AVAILABLE" | "RENTED" | "UNDER_REPAIR" | "UNAVAILABLE";
export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED"
  | "IN_INCIDENT";
export type ReturnStatus =
  | "PENDING"
  | "SENT"
  | "RECEIVED"
  | "DAMAGED"
  | "CL_DAMAGED"
  | "CL_INCOMPLETE"
  | "SPP_INCOMPLETE";

// Badge para estados de herramientas
export function ToolStatusBadge({ status }: { status: ToolStatus }) {
  const config = {
    AVAILABLE: {
      label: "Disponible",
      variant: "default" as const,
      className: "bg-[#7fb3b0] hover:bg-[#6da39f] text-white",
    },
    RENTED: {
      label: "Alquilada",
      variant: "secondary" as const,
      className: "bg-[#3d5a5a] hover:bg-[#2a4644] text-white",
    },
    UNDER_REPAIR: {
      label: "En Reparación",
      variant: "destructive" as const,
      className: "bg-orange-500 hover:bg-orange-600",
    },
    UNAVAILABLE: {
      label: "No Disponible",
      variant: "destructive" as const,
      className: "bg-red-600 hover:bg-red-700",
    },
  };

  const { label, variant, className } = config[status] || {
    label: status,
    variant: "secondary" as const,
    className: "bg-gray-200 text-gray-800",
  };

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

// Badge para estados de reservas
export function ReservationStatusBadge({
  status,
}: {
  status: ReservationStatus;
}) {
  const config = {
    PENDING: {
      label: "Pendiente",
      variant: "secondary" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    CONFIRMED: {
      label: "Confirmada",
      variant: "default" as const,
      className: "bg-[#3d5a5a] hover:bg-[#2a4644] text-white",
    },
    IN_PROGRESS: {
      label: "En Curso",
      variant: "default" as const,
      className: "bg-[#5a7876] hover:bg-[#4a6866] text-white",
    },
    FINISHED: {
      label: "Finalizada",
      variant: "default" as const,
      className: "bg-[#7fb3b0] hover:bg-[#6da39f] text-white",
    },
    CANCELLED: { label: "Cancelada", variant: "destructive" as const },
    IN_INCIDENT: {
      label: "Con Incidente",
      variant: "destructive" as const,
      className: "bg-red-600 hover:bg-red-700",
    },
  };

  const { label, variant, className } = config[status] || {
    label: "Desconocido",
    variant: "secondary" as const,
    className: "bg-gray-500 text-white",
  };

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

// Badge para estados de devoluciones
export function ReturnStatusBadge({ status }: { status: ReturnStatus }) {
  const config = {
    PENDING: {
      label: "Pendiente",
      variant: "secondary" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    SENT: {
      label: "Enviada",
      variant: "default" as const,
      className: "bg-[#3d5a5a] hover:bg-[#2a4644] text-white",
    },
    RECEIVED: {
      label: "Recibida",
      variant: "default" as const,
      className: "bg-[#7fb3b0] hover:bg-[#6da39f] text-white",
    },
    DAMAGED: {
      label: "Dañada",
      variant: "destructive" as const,
      className: "bg-red-600 hover:bg-red-700",
    },
    CL_DAMAGED: {
      label: "Cliente reporta daño",
      variant: "destructive" as const,
      className: "bg-red-600 hover:bg-red-700",
    },
    CL_INCOMPLETE: {
      label: "Cliente reporta incompleto",
      variant: "secondary" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    SPP_INCOMPLETE: {
      label: "Proveedor confirma incompleto",
      variant: "secondary" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
  };

  const { label, variant, className } = config[status] || {
    label: status,
    variant: "secondary" as const,
    className: "bg-gray-200 text-gray-800",
  };

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

// Mensajes de explicación de estados de reserva
export function getReservationStatusMessage(status: ReservationStatus): string {
  const messages = {
    PENDING: "La reserva está esperando confirmación del proveedor.",
    CONFIRMED: "La reserva ha sido confirmada y está lista para iniciar.",
    IN_PROGRESS: "La reserva está activa, las herramientas están en uso.",
    FINISHED: "La reserva ha finalizado correctamente.",
    CANCELLED: "La reserva fue cancelada.",
    IN_INCIDENT: "La reserva tiene un incidente reportado (daño en devolución).",
  };
  return messages[status];
}

// Mensajes de explicación de estados de devolución
export function getReturnStatusMessage(status: ReturnStatus): string {
  const messages = {
    PENDING: "Devolución pendiente.",
    SENT: "El cliente confirmó el envío. Esperando recepción del proveedor.",
    RECEIVED: "Recibido correctamente.",
    DAMAGED: "Daños confirmados.",
    CL_DAMAGED: "Cliente reporta daño antes de envío.",
    CL_INCOMPLETE: "Cliente reporta devolución incompleta.",
    SPP_INCOMPLETE: "Proveedor confirma devolución incompleta.",
  };
  return messages[status];
}

// Verificar si una reserva permite modificaciones
export function canModifyReservation(status: ReservationStatus): boolean {
  return status !== "CANCELLED" && status !== "FINISHED" && status !== "IN_INCIDENT";
}

// Mensaje de por qué no se puede modificar
export function getModificationBlockedMessage(status: ReservationStatus): string {
  const messages = {
    CANCELLED: "No puedes modificar esta reserva porque está cancelada.",
    FINISHED: "No puedes modificar esta reserva porque ya ha finalizado.",
    IN_INCIDENT: "No puedes modificar esta reserva porque tiene un incidente activo.",
    PENDING: "",
    CONFIRMED: "",
    IN_PROGRESS: "",
  };
  return messages[status];
}
