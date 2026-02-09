import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/auth/useAuth";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/api/apiClient";

interface CartSidebarProps {
  isFloating?: boolean;
}

export function CartSidebar({ isFloating = false }: CartSidebarProps) {
  const { user, loading } = useAuth();
  const {
    items,
    removeItem,
    updateItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [reservationDates, setReservationDates] = useState({
    start: "",
    end: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Si está cargando o no hay usuario, no mostrar nada
  if (loading || !user) {
    return null;
  }

  const handleReserve = async () => {
    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!reservationDates.start || !reservationDates.end) {
      toast.error("Por favor selecciona las fechas de inicio y fin");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const totalDays =
        Math.ceil(
          (new Date(reservationDates.end).getTime() -
            new Date(reservationDates.start).getTime()) /
            (1000 * 3600 * 24),
        ) + 1;

      const total = items.reduce(
        (sum, item) =>
          sum + item.herramienta.precioDia * item.quantity * totalDays,
        0,
      );

      const reservaPayload = {
        startDate: reservationDates.start,
        endDate: reservationDates.end,
        totalPrice: total,
        statusName: "IN_PROGRESS",
      };

      const reservaRes = await apiClient.post(
        "/api/reservations",
        reservaPayload,
      );
      const reservationId = reservaRes.data?.id;
      if (!reservationId) {
        throw new Error("No se recibio el id de la reserva");
      }

      for (const item of items) {
        await apiClient.post("/api/reservations/details", {
          toolId: item.herramienta.id,
          reservationId,
          quantity: item.quantity,
        });
      }

      toast.success(
        `Reserva creada por ${totalDays} dia(s). Total: $${total}. Redirigiendo a pagos...`,
      );

      setIsOpen(false);
      clearCart();

      setTimeout(() => {
        navigate("/cliente/pagos");
      }, 2000);
    } catch (error) {
      toast.error("Error al crear la reserva. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const triggerButton = (
    <Button
      size={isFloating ? "lg" : "sm"}
      className={
        isFloating
          ? "fixed top-20 right-8 rounded-full bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 border-2 border-[#7fb3b0] hover:shadow-none transition-colors"
          : "bg-white border-2 border-[#7fb3b0] text-gray-900 hover:bg-gray-100 hover:text-gray-900 hover:shadow-none transition-colors"
      }
      variant={isFloating ? "default" : "outline"}
    >
      <ShoppingCart className="w-5 h-5 mr-2 text-[#3d5a5a]" />
      {isFloating && (
        <span className="font-bold bg-red-500 text-white px-2.5 py-1 rounded-full text-sm">
          {totalItems}
        </span>
      )}
      {!isFloating && (
        <>
          <span>Carrito</span>
          <span className="font-bold bg-red-500 text-white px-2 py-0.5 rounded-full text-xs ml-2">
            {totalItems}
          </span>
        </>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[450px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mi Carrito
            {totalItems > 0 && (
              <span className="ml-auto bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-semibold">
                {totalItems}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 mt-1">
                Añade herramientas para comenzar
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="flex-1 overflow-y-auto space-y-3 my-6">
              {items.map((item) => {
                const inicio = new Date(item.fechaInicio);
                const fin = new Date(item.fechaFin);
                const dias =
                  Math.ceil(
                    (fin.getTime() - inicio.getTime()) / (1000 * 3600 * 24),
                  ) + 1;
                const subtotal =
                  dias * item.herramienta.precioDia * item.quantity;

                return (
                  <Card key={item.herramienta.id} className="overflow-hidden">
                    <CardContent className="p-3 space-y-3">
                      {/* Encabezado */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {item.herramienta.nombre}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ${item.herramienta.precioDia} x día
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.herramienta.id)}
                          className="text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Fechas */}
                      <div className="bg-gray-50 p-2 rounded text-xs">
                        <p className="text-gray-600">
                          {inicio.toLocaleDateString()} →{" "}
                          {fin.toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 mt-1">{dias} día(s)</p>
                      </div>

                      {/* Cantidad */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                          Cantidad:
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateItem(
                                item.herramienta.id,
                                Math.max(1, item.quantity - 1),
                                item.fechaInicio,
                                item.fechaFin,
                              )
                            }
                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.herramienta.availableQuantity}
                            value={item.quantity}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value) || 1;
                              if (
                                newValue <=
                                  item.herramienta.availableQuantity &&
                                newValue > 0
                              ) {
                                updateItem(
                                  item.herramienta.id,
                                  newValue,
                                  item.fechaInicio,
                                  item.fechaFin,
                                );
                              }
                            }}
                            className="w-10 text-center border border-gray-300 rounded text-xs py-1"
                          />
                          <button
                            onClick={() =>
                              updateItem(
                                item.herramienta.id,
                                Math.min(
                                  item.herramienta.availableQuantity,
                                  item.quantity + 1,
                                ),
                                item.fechaInicio,
                                item.fechaFin,
                              )
                            }
                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="border-t pt-2 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700">
                          Subtotal:
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          ${subtotal}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Resumen y botones */}
            <div className="border-t pt-4 space-y-4">
              {/* Total */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-medium">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalPrice}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {totalItems} artículo{totalItems > 1 ? "s" : ""}
                </p>
              </div>

              {/* Dialog para confirmar reserva */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    Proceder a Reservar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirmar Reserva</DialogTitle>
                    <DialogDescription>
                      Las fechas se aplicarán a todos los items del carrito
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Resumen de items */}
                    <div className="bg-gray-50 p-3 rounded">
                      <h4 className="font-semibold text-sm mb-2 text-gray-900">
                        Items en carrito:
                      </h4>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <div
                            key={item.herramienta.id}
                            className="flex justify-between text-xs"
                          >
                            <span>{item.herramienta.nombre}</span>
                            <span className="text-gray-600">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="fechaInicio" className="text-sm">
                          Fecha de inicio
                        </Label>
                        <Input
                          id="fechaInicio"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={reservationDates.start}
                          onChange={(e) =>
                            setReservationDates({
                              ...reservationDates,
                              start: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaFin" className="text-sm">
                          Fecha de fin
                        </Label>
                        <Input
                          id="fechaFin"
                          type="date"
                          min={
                            reservationDates.start ||
                            new Date().toISOString().split("T")[0]
                          }
                          value={reservationDates.end}
                          onChange={(e) =>
                            setReservationDates({
                              ...reservationDates,
                              end: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Mostrar cálculo de días y total */}
                    {reservationDates.start && reservationDates.end && (
                      <div className="bg-blue-50 p-3 rounded">
                        {(() => {
                          const dias =
                            Math.ceil(
                              (new Date(reservationDates.end).getTime() -
                                new Date(reservationDates.start).getTime()) /
                                (1000 * 3600 * 24),
                            ) + 1;
                          const total = items.reduce((sum, item) => {
                            return (
                              sum +
                              dias * item.herramienta.precioDia * item.quantity
                            );
                          }, 0);
                          return (
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">
                                Duración:{" "}
                                <span className="font-semibold">
                                  {dias} día(s)
                                </span>
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                Total: ${total}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        Cancelar
                      </Button>
                    </DialogTrigger>
                    <Button
                      onClick={handleReserve}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Confirmar Reserva
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Botón para limpiar carrito */}
              <Button variant="outline" className="w-full" onClick={clearCart}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
