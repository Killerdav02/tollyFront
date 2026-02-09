import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { CreditCard, Download, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/auth/useAuth";

export function ClientePagos() {
  const { user } = useAuth();
  type ReservaUI = {
    id: string;
    herramientaNombre: string;
    fechaInicio?: string;
    fechaFin?: string;
    precioTotal: number;
    estado: string;
  };

  type PagoUI = {
    id: string;
    reservationId: string;
    metodoPago?: string;
    monto: number;
    estado?: string;
    fecha?: string;
  };

  const [reservas, setReservas] = useState<ReservaUI[]>([]);
  const [pagos, setPagos] = useState<PagoUI[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [selectedPago, setSelectedPago] = useState<PagoUI | null>(null);
  const [showPagoDialog, setShowPagoDialog] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<ReservaUI | null>(
    null,
  );
  const [loadingPago, setLoadingPago] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReservaId, setCancelReservaId] = useState<string | null>(null);

  const normalizeStatus = (status?: string) =>
    status ? status.toUpperCase() : "";

  const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString("es-ES") : "-";

  const fetchPagosData = useCallback(async () => {
    const clientId = user?.client?.id;
    if (!clientId) return;
    setLoadingData(true);
    setErrorData(null);
    try {
      const [reservasRes, pagosRes] = await Promise.all([
        apiClient.get(`/api/reservations/client/${clientId}`),
        apiClient.get(`/payments/client/${clientId}`),
      ]);

      const reservasData: ReservaUI[] = Array.isArray(reservasRes.data)
        ? reservasRes.data.map((reserva: any) => {
            const toolName =
              reserva.toolName ||
              reserva.tool?.name ||
              reserva.details?.[0]?.toolName ||
              reserva.tools?.[0]?.name ||
              `Reserva #${reserva.id}`;
            return {
              id: String(reserva.id),
              herramientaNombre: toolName,
              fechaInicio:
                reserva.startDate || reserva.fechaInicio || reserva.start_date,
              fechaFin: reserva.endDate || reserva.fechaFin || reserva.end_date,
              precioTotal: Number(
                reserva.totalPrice ??
                  reserva.precioTotal ??
                  reserva.total_price ??
                  0,
              ),
              estado: normalizeStatus(
                reserva.statusName || reserva.status || reserva.estado,
              ),
            };
          })
        : [];

      const pagosData: PagoUI[] = Array.isArray(pagosRes.data)
        ? pagosRes.data.map((pago: any) => ({
            id: String(pago.id),
            reservationId: String(
              pago.reservationId ||
                pago.reservaId ||
                pago.reservation?.id ||
                "",
            ),
            metodoPago:
              pago.paymentMethod || pago.metodoPago || pago.method || "",
            monto: Number(pago.amount ?? pago.monto ?? 0),
            estado: normalizeStatus(
              pago.statusName || pago.status || pago.estado,
            ),
            fecha:
              pago.paymentDate ||
              pago.createdAt ||
              pago.created_at ||
              pago.fechaPago,
          }))
        : [];

      setReservas(reservasData);
      setPagos(pagosData);
    } catch (error: any) {
      setErrorData("No se pudieron cargar los pagos");
      setReservas([]);
      setPagos([]);
    } finally {
      setLoadingData(false);
    }
  }, [user?.client?.id]);

  useEffect(() => {
    fetchPagosData();
  }, [fetchPagosData]);

  const reservationById = useMemo(
    () => new Map(reservas.map((reserva) => [reserva.id, reserva])),
    [reservas],
  );

  const reservasConPago = useMemo(
    () =>
      pagos.map((pago) => {
        const reserva = reservationById.get(pago.reservationId);
        return {
          ...pago,
          herramientaNombre:
            reserva?.herramientaNombre || `Reserva #${pago.reservationId}`,
          fechaInicio: reserva?.fechaInicio,
          fechaFin: reserva?.fechaFin,
          precioTotal: reserva?.precioTotal ?? pago.monto,
        };
      }),
    [pagos, reservationById],
  );

  const pagosCompletados = useMemo(
    () => pagos.filter((pago) => pago.estado === "PAID").length,
    [pagos],
  );

  const totalGastado = useMemo(
    () => pagos.reduce((sum, pago) => sum + pago.monto, 0),
    [pagos],
  );

  const reservasPendientes = useMemo(() => {
    const paidReservationIds = new Set(pagos.map((pago) => pago.reservationId));
    return reservas.filter((reserva) => {
      const status = normalizeStatus(reserva.estado);
      const isPayable =
        status !== "CANCELLED" && status !== "FINISHED" && status !== "PAID";
      return isPayable && !paidReservationIds.has(reserva.id);
    });
  }, [pagos, reservas]);

  const handlePago = async (metodoPago: string) => {
    if (!selectedReserva) return;
    setLoadingPago(true);
    try {
      await apiClient.post(`/payments/reservation/${selectedReserva.id}/pay`, {
        paymentMethod: metodoPago,
        amount: selectedReserva.precioTotal,
      });
      toast.success(`Pago procesado exitosamente con ${metodoPago}`);
      setSelectedReserva(null);
      fetchPagosData();
    } catch (error: any) {
      toast.error("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoadingPago(false);
    }
  };

  const isFutureStartDate = (value?: string) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  const handleCancelReserva = async (reservaId: string) => {
    setLoadingPago(true);
    try {
      await apiClient.put(`/api/reservations/${reservaId}/cancel`);
      toast.success("Reserva cancelada exitosamente");
      fetchPagosData();
    } catch (error: any) {
      toast.error("No se pudo cancelar la reserva");
    } finally {
      setLoadingPago(false);
    }
  };

  const handlePagoPendiente = async () => {
    const reservationId = Number(selectedPago?.reservationId);
    if (!reservationId) {
      toast.error("No se encontro la reserva para el pago");
      return;
    }
    setLoadingPago(true);
    try {
      const detailsRes = await apiClient.get(
        `/api/reservations/details/reservation/${reservationId}`,
      );
      if (!Array.isArray(detailsRes.data) || detailsRes.data.length === 0) {
        toast.error("La reserva no tiene detalles para facturar");
        return;
      }
      await apiClient.post(`/payments/reservation/${reservationId}/pay`, {});
      toast.success("Pago procesado exitosamente");
      setShowPagoDialog(false);
      setSelectedPago(null);
      fetchPagosData();
    } catch (error: any) {
      toast.error("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setLoadingPago(false);
    }
  };

  const handleDownloadPdf = async (paymentId: string) => {
    if (!paymentId) {
      toast.error("No se encontro el id del pago");
      return;
    }
    try {
      const invoiceRes = await apiClient.get(`/invoices/payment/${paymentId}`);
      const invoiceId = invoiceRes.data?.id;
      if (!invoiceId) {
        toast.error("No se encontro la factura");
        return;
      }
      const pdfRes = await apiClient.get(`/invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      });
      const blob = new Blob([pdfRes.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      toast.error("No se pudo descargar la factura");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
        <p className="text-gray-600 mt-1">Gestiona tus pagos y facturación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Gastado
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalGastado.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">En total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pagos Completados
            </CardTitle>
            <CreditCard className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagosCompletados}</div>
            <p className="text-xs text-gray-500 mt-1">Transacciones exitosas</p>
          </CardContent>
        </Card>
      </div>

      {errorData && <div className="text-sm text-red-600">{errorData}</div>}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>Todas tus transacciones</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="text-center py-12 text-gray-500">
              Cargando pagos...
            </div>
          ) : reservasConPago.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Factura
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Herramienta
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Monto
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Estado
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">
                      Cancelar
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservasConPago.map((pago) => (
                    <tr key={pago.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">
                        #
                        {String(pago.reservationId || pago.id).padStart(5, "0")}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {pago.herramientaNombre}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(pago.fecha || pago.fechaInicio)}
                      </td>
                      <td className="py-3 px-4 text-left font-medium">
                        ${pago.monto}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">
                          {pago.estado || "Completado"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {pago.estado === "PENDING" && pago.reservationId && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setCancelReservaId(pago.reservationId);
                              setShowCancelDialog(true);
                            }}
                            disabled={loadingPago}
                          >
                            Cancelar
                          </Button>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {pago.estado === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPago(pago);
                                setShowPagoDialog(true);
                              }}
                            >
                              Pagar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadPdf(pago.id)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            PDF
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay pagos registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Make Payment Section */}
      {reservasPendientes.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <CreditCard className="w-5 h-5 mr-2" />
              Pagos Pendientes
            </CardTitle>
            <CardDescription>
              Completa los pagos de las siguientes reservas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservasPendientes.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {reserva.herramientaNombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(reserva.fechaInicio)} -{" "}
                      {formatDate(reserva.fechaFin)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold text-gray-900">
                      ${reserva.precioTotal}
                    </p>
                    {reserva.estado === "PENDING" &&
                      isFutureStartDate(reserva.fechaInicio) && (
                        <Button
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setCancelReservaId(reserva.id);
                            setShowCancelDialog(true);
                          }}
                          disabled={loadingPago}
                        >
                          Cancelar
                        </Button>
                      )}
                    {reserva.estado !== "CANCELLED" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedReserva(reserva)}
                            disabled={loadingPago}
                          >
                            Pagar Ahora
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Realizar Pago</DialogTitle>
                            <DialogDescription>
                              Completa el pago para {reserva.herramientaNombre}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">
                                  Herramienta:
                                </span>
                                <span className="font-medium">
                                  {reserva.herramientaNombre}
                                </span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Periodo:</span>
                                <span className="font-medium">
                                  {formatDate(reserva.fechaInicio)} -{" "}
                                  {formatDate(reserva.fechaFin)}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-semibold">Total:</span>
                                <span className="text-xl font-bold text-blue-600">
                                  ${reserva.precioTotal}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Selecciona método de pago:</Label>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() =>
                                    handlePago("Tarjeta de Crédito")
                                  }
                                  disabled={loadingPago}
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Tarjeta de Crédito (••• 4242)
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handlePago("PayPal")}
                                  disabled={loadingPago}
                                >
                                  PayPal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cancelacion</DialogTitle>
            <DialogDescription>
              Esta accion cancelara la reserva seleccionada. ¿Deseas continuar?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCancelDialog(false)}
              disabled={loadingPago}
            >
              Volver
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (cancelReservaId) {
                  handleCancelReserva(cancelReservaId);
                }
                setShowCancelDialog(false);
                setCancelReservaId(null);
              }}
              disabled={loadingPago}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPagoDialog} onOpenChange={setShowPagoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Pago</DialogTitle>
            <DialogDescription>¿Deseas pagar este monto?</DialogDescription>
          </DialogHeader>
          <div className="text-2xl font-bold text-gray-900">
            ${selectedPago?.monto ?? 0}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPagoDialog(false)}
              disabled={loadingPago}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handlePagoPendiente}
              disabled={loadingPago}
            >
              {loadingPago ? "Procesando..." : "Aceptar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
