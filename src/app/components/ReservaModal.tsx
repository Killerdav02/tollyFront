import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/api/apiClient";

interface ReservaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<{ id: string; nombre: string; cantidad: number }>;
}

export const ReservaModal: React.FC<ReservaModalProps> = ({
  open,
  onOpenChange,
  items,
}) => {
  const [fechas, setFechas] = useState({ inicio: "", fin: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmReserva = async () => {
    setIsLoading(true);
    try {
      // 1. Crear reserva principal
      const reservaRes = await apiClient.post("/api/reservations", {
        startDate: fechas.inicio,
        endDate: fechas.fin,
      });
      const reservationId = reservaRes.data.id;

      // 2. Crear detalles por cada herramienta seleccionada
      for (const item of items) {
        await apiClient.post("/api/reservations/details", {
          reservationId,
          toolId: item.id,
          quantity: item.cantidad,
        });
      }
      toast.success("Reserva creada correctamente");
      onOpenChange(false);
    } catch (err) {
      toast.error("Error al crear la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogDescription>
            Las fechas se aplicarán a todos los items seleccionados
          </DialogDescription>
        </DialogHeader>
        {/* Resumen de items */}
        {items.map((item) => (
          <div key={item.id}>
            {item.nombre} x{item.cantidad}
          </div>
        ))}
        {/* Fechas */}
        <Input
          type="date"
          value={fechas.inicio}
          onChange={(e) => setFechas({ ...fechas, inicio: e.target.value })}
          required
        />
        <Input
          type="date"
          value={fechas.fin}
          onChange={(e) => setFechas({ ...fechas, fin: e.target.value })}
          required
        />
        <Button
          onClick={handleConfirmReserva}
          disabled={isLoading || items.length === 0}
        >
          {isLoading ? "Guardando..." : "Confirmar Reserva"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
