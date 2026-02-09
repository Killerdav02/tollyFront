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
import { useCart } from "@/app/context/CartContext";
import apiClient from "@/api/apiClient";

interface ReservaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReservaModal: React.FC<ReservaModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [confirmDates, setConfirmDates] = useState({ inicio: "", fin: "" });
  const [isLoadingReserva, setIsLoadingReserva] = useState(false);
  const { items, clearCart } = useCart();

  const handleConfirmReserva = async () => {
    setIsLoadingReserva(true);
    try {
      // 1. Crear reserva principal
      const reservaPayload = {
        startDate: confirmDates.inicio,
        endDate: confirmDates.fin,
      };
      const reservaRes = await apiClient.post(
        "/api/reservations",
        reservaPayload,
      );
      const reservationId = reservaRes.data.id;

      // 2. Crear detalles por cada herramienta
      for (const item of items) {
        await apiClient.post("/api/reservations/details", {
          reservationId,
          toolId: item.herramienta.id,
          quantity: item.quantity,
        });
      }
      toast.success("Reserva creada correctamente");
      clearCart();
      onOpenChange(false);
    } catch (err) {
      toast.error("Error al crear la reserva");
    } finally {
      setIsLoadingReserva(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogDescription>
            Las fechas se aplicarán a todos los items del carrito
          </DialogDescription>
        </DialogHeader>
        {/* Resumen de items */}
        {items.map((item) => (
          <div key={item.herramienta.id}>
            {item.herramienta.nombre} x{item.quantity}
          </div>
        ))}
        {/* Fechas */}
        <Input
          type="date"
          value={confirmDates.inicio}
          onChange={(e) =>
            setConfirmDates({ ...confirmDates, inicio: e.target.value })
          }
          required
        />
        <Input
          type="date"
          value={confirmDates.fin}
          onChange={(e) =>
            setConfirmDates({ ...confirmDates, fin: e.target.value })
          }
          required
        />
        <Button
          onClick={handleConfirmReserva}
          disabled={isLoadingReserva || items.length === 0}
        >
          {isLoadingReserva ? "Guardando..." : "Confirmar Reserva"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
