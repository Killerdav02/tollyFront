import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { ReservationStatusBadge, ReturnStatusBadge } from '@/app/components/StatusBadges';
import { AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { listReturns, receiveReturn, getReturnById } from '../../../services/returnService';
import { listReservationsBySupplier } from '../../../services/reservationService';
import { listTools } from '../../../services/toolService';
import type { ReturnResponse, Reservation, PageResponse } from '../../../services/types';

const SUPPLIER_ID_KEY = 'tolly_supplier_id';

const returnStatusLabels: Record<string, string> = {
  PENDING: 'Pendiente',
  SENT: 'Enviada',
  RECEIVED: 'Recibida',
  DAMAGED: 'Dañada',
  CL_DAMAGED: 'Cliente reporta daño',
  CL_INCOMPLETE: 'Cliente reporta incompleto',
  SPP_INCOMPLETE: 'Proveedor confirma incompleto',
};

const proveedorAcciones = [
  { code: 'RECEIVED', label: 'Recibir sin novedades' },
  { code: 'DAMAGED', label: 'Recibir con daño' },
  { code: 'SPP_INCOMPLETE', label: 'Recibir incompleto' },
];

function normalizeReturnStatus(status?: string): 'PENDING' | 'SENT' | 'RECEIVED' | 'DAMAGED' | 'CL_DAMAGED' | 'CL_INCOMPLETE' | 'SPP_INCOMPLETE' {
  const normalized = (status || '').toUpperCase();
  if (['CL_DAMAGED', 'CL_INCOMPLETE', 'SPP_INCOMPLETE'].includes(normalized)) return normalized as any;
  if (['SENT', 'ENVIADA', 'ENVIADO'].includes(normalized)) return 'SENT';
  if (['RECEIVED', 'RECIBIDA', 'RECIBIDO'].includes(normalized)) return 'RECEIVED';
  if (['DAMAGED', 'DANADA', 'DAÑADA'].includes(normalized)) return 'DAMAGED';
  return 'PENDING';
}

function normalizeReservationStatus(status?: string) {
  const normalized = (status || '').toUpperCase();
  if (['PENDING', 'PENDIENTE'].includes(normalized)) return 'PENDING';
  if (['CONFIRMED', 'CONFIRMADA'].includes(normalized)) return 'CONFIRMED';
  if (['IN_PROGRESS', 'EN_CURSO'].includes(normalized)) return 'IN_PROGRESS';
  if (['FINISHED', 'FINALIZADA'].includes(normalized)) return 'FINISHED';
  if (['CANCELLED', 'CANCELADA'].includes(normalized)) return 'CANCELLED';
  if (['IN_INCIDENT', 'INCIDENCIA'].includes(normalized)) return 'IN_INCIDENT';
  return 'PENDING';
}

export function ProveedorReservas() {
  const [returns, setReturns] = useState<ReturnResponse[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationPage, setReservationPage] = useState<PageResponse<Reservation> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<ReturnResponse | null>(null);
  const [detailReturn, setDetailReturn] = useState<ReturnResponse | null>(null);
  const [observations, setObservations] = useState('');
  const [selectedAction, setSelectedAction] = useState<'RECEIVED' | 'DAMAGED' | 'SPP_INCOMPLETE' | ''>('');

  const [filters, setFilters] = useState({
    statusName: 'all',
    from: '',
    to: '',
  });

  const supplierId = useMemo(() => {
    const stored = localStorage.getItem(SUPPLIER_ID_KEY);
    if (stored && !Number.isNaN(Number(stored))) return Number(stored);
    return null;
  }, []);

  const resolveSupplierIdFromTools = async (): Promise<number | null> => {
    const tools = await listTools();
    const unique = Array.from(new Set(tools.map((tool) => tool.supplierId)));
    if (unique.length === 1) {
      localStorage.setItem(SUPPLIER_ID_KEY, String(unique[0]));
      return unique[0];
    }
    return null;
  };

  const loadReservations = async (page = 0) => {
    let resolvedSupplierId = supplierId;
    if (!resolvedSupplierId) {
      try {
        resolvedSupplierId = await resolveSupplierIdFromTools();
      } catch {
        resolvedSupplierId = null;
      }
    }
    if (!resolvedSupplierId) {
      setError('No se pudo determinar tu proveedor. Crea una herramienta primero.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const from = filters.from ? `${filters.from}T00:00:00` : undefined;
      const to = filters.to ? `${filters.to}T23:59:59` : undefined;
      const data = await listReservationsBySupplier({
        supplierId: resolvedSupplierId,
        statusName: filters.statusName === 'all' ? undefined : filters.statusName,
        from,
        to,
        page,
        size: 10,
        sort: 'createdAt,desc',
      });
      setReservations(data.content || []);
      setReservationPage(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudieron cargar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadReturns = async () => {
      try {
        const data = await listReturns();
        setReturns(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'No se pudieron cargar las devoluciones.');
      }
    };
    loadReturns();
    loadReservations(0);
  }, [supplierId]);

  const pendingReturns = useMemo(
    () => returns.filter((ret) => ['SENT', 'CL_DAMAGED', 'CL_INCOMPLETE'].includes(normalizeReturnStatus(ret.returnStatusName))),
    [returns]
  );

  const openManageReturn = async (ret: ReturnResponse) => {
    if (!['SENT', 'CL_DAMAGED', 'CL_INCOMPLETE'].includes(normalizeReturnStatus(ret.returnStatusName))) {
      toast.error('Solo puedes recibir devoluciones en estado SENT o con reporte del cliente.');
      return;
    }
    setSelectedReturn(ret);
    setSelectedAction('');
    setObservations('');
    try {
      const detail = await getReturnById(ret.id);
      setDetailReturn(detail);
    } catch {
      setDetailReturn(ret);
    }
  };

  const handleReceive = async () => {
    if (!selectedReturn) return;
    if (!selectedAction) {
      toast.error('Selecciona el estado final de la devolución.');
      return;
    }
    try {
      await receiveReturn(selectedReturn.id, {
        returnStatusName: selectedAction,
        observations: observations || undefined,
      });
      toast.success(returnStatusLabels[selectedAction] || 'Acción registrada.');
      setSelectedReturn(null);
      setDetailReturn(null);
      setObservations('');
      setSelectedAction('');
      const updated = await listReturns();
      setReturns(updated);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudo actualizar la devolución.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Mis Reservas</h1>
        <p className="text-gray-600 mt-1">Gestiona reservas y devoluciones de tus herramientas</p>
      </div>

      {error && (
        <Alert className="border-red-200">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filtros de reservas</CardTitle>
          <CardDescription>Filtra por estado o rango de fechas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="text-sm">Estado</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={filters.statusName}
                onChange={(e) => setFilters((prev) => ({ ...prev, statusName: e.target.value }))}
              >
                <option value="all">Todos</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONFIRMED">Confirmada</option>
                <option value="IN_PROGRESS">En curso</option>
                <option value="FINISHED">Finalizada</option>
                <option value="CANCELLED">Cancelada</option>
                <option value="IN_INCIDENT">Incidente</option>
              </select>
            </div>
            <div>
              <Label className="text-sm">Desde</Label>
              <Input type="date" value={filters.from} onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm">Hasta</Label>
              <Input type="date" value={filters.to} onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))} />
            </div>
            <Button onClick={() => loadReservations(0)} className="bg-[#7fb3b0] hover:bg-[#6da39f]">
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reservas del Proveedor</CardTitle>
          <CardDescription>Listado paginado de reservas asociadas a tus herramientas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Periodo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reserva) => (
                  <tr key={reserva.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">#{reserva.id}</td>
                    <td className="py-3 px-4 text-gray-600">#{reserva.clientId}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(reserva.startDate).toLocaleDateString('es-ES')} - {new Date(reserva.endDate).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-gray-600">${Number(reserva.total).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <ReservationStatusBadge status={normalizeReservationStatus(reserva.statusName)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && reservations.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">No hay reservas para los filtros seleccionados.</p>
          )}
          {reservationPage && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Página {reservationPage.number + 1} de {reservationPage.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reservationPage.first}
                  onClick={() => loadReservations(reservationPage.number - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reservationPage.last}
                  onClick={() => loadReservations(reservationPage.number + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Devoluciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingReturns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Recibidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#7fb3b0]">
              {returns.filter((ret) => normalizeReturnStatus(ret.returnStatusName) === 'RECEIVED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {pendingReturns.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
              Devoluciones por Recibir
            </CardTitle>
            <CardDescription>
              El proveedor solo puede recibir devoluciones en estado SENT o reportadas por el cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Si la devolución es parcial la reserva sigue IN_PROGRESS. Si es total: RECEIVED ? FINISHED, DAMAGED o SPP_INCOMPLETE ? IN_INCIDENT.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              {pendingReturns.map((ret) => (
                <div
                  key={ret.id}
                  className="flex flex-col gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Devolución #{ret.id}</h3>
                        <ReturnStatusBadge status={normalizeReturnStatus(ret.returnStatusName)} />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Reserva: #{ret.reservationId}</p>
                      <p className="text-sm text-gray-500">Estado: {returnStatusLabels[normalizeReturnStatus(ret.returnStatusName)]}</p>
                      <p className="text-sm text-gray-500">Observaciones: {ret.observations || 'Sin observaciones'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openManageReturn(ret)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Gestionar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de Devoluciones</CardTitle>
          <CardDescription>Registro completo de devoluciones asociadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Reserva</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((ret) => (
                  <tr key={ret.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">#{ret.id}</td>
                    <td className="py-3 px-4 text-gray-600">#{ret.reservationId}</td>
                    <td className="py-3 px-4">
                      <ReturnStatusBadge status={normalizeReturnStatus(ret.returnStatusName)} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {ret.returnDate ? new Date(ret.returnDate).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <p className="text-sm text-gray-500 mt-4">Cargando devoluciones...</p>}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedReturn)} onOpenChange={(open) => !open && setSelectedReturn(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recibir devolución #{selectedReturn?.id}</DialogTitle>
            <DialogDescription>
              Selecciona el estado final y registra observaciones generales.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Estado actual</Label>
              <p className="text-sm text-gray-600">{detailReturn ? returnStatusLabels[normalizeReturnStatus(detailReturn.returnStatusName)] : 'Cargando...'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Herramientas reportadas (solo lectura)</Label>
              <div className="mt-2 space-y-2">
                {detailReturn?.details && detailReturn.details.length > 0 ? (
                  detailReturn.details.map((detail, index) => (
                    <div key={`${detail.toolId}-${index}`} className="p-3 border rounded-md bg-gray-50">
                      <p className="text-sm text-gray-700">Tool ID: {detail.toolId}</p>
                      <p className="text-sm text-gray-700">Cantidad: {detail.quantity}</p>
                      <p className="text-sm text-gray-500">Observaciones: {detail.observations || 'Sin observaciones'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay herramientas reportadas.</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Estado final (obligatorio)</Label>
              <div className="flex flex-col gap-2 mt-2">
                {proveedorAcciones.map((accion) => (
                  <label key={accion.code} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="returnStatus"
                      value={accion.code}
                      checked={selectedAction === accion.code}
                      onChange={() => setSelectedAction(accion.code as any)}
                    />
                    {accion.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Observaciones generales (opcional)</Label>
              <Textarea
                placeholder="Observaciones generales..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedReturn(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleReceive}
              className="bg-[#7fb3b0] hover:bg-[#6da39f]"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
