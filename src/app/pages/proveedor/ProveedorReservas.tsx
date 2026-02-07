import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { reservas, returns } from '@/app/data/mockData';
import { useAuth } from '../../../auth/useAuth';
import { ReservationStatusBadge, ReturnStatusBadge, getReturnStatusMessage } from '@/app/components/StatusBadges';
import { ReturnTimeline } from '@/app/components/ReturnTimeline';
import { Check, X, Calendar, Package, PackageCheck, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function ProveedorReservas() {
  const { user } = useAuth();
  const [showReturnDetails, setShowReturnDetails] = useState<string | null>(null);
  const [damageNotes, setDamageNotes] = useState('');

  const misReservas = reservas.filter(r => r.proveedorId === user?.id);
  const misReturnos = returns.filter(r => r.proveedorId === user?.id);

  const handleAceptar = (id: string) => {
    toast.success('Reserva aceptada y confirmada');
  };

  const handleRechazar = (id: string) => {
    toast.error('Reserva rechazada');
  };

  const handleReceiveOk = (returnId: string) => {
    toast.success('Devolución recibida OK. Reserva finalizada y herramientas disponibles nuevamente.');
  };

  const handleReceiveDamaged = (returnId: string) => {
    if (!damageNotes.trim()) {
      toast.error('Debes proporcionar notas sobre el daño');
      return;
    }
    toast.error('Devolución recibida con daño. Reserva pasó a IN_INCIDENT y herramientas a UNDER_REPAIR.');
    setDamageNotes('');
    setShowReturnDetails(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Mis Reservas</h1>
        <p className="text-gray-600 mt-1">Gestiona las solicitudes de alquiler</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{misReservas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {misReservas.filter(r => r.estado === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#7fb3b0]">
              {misReservas.filter(r => r.estado === 'CONFIRMED' || r.estado === 'IN_PROGRESS').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3d5a5a]">
              {misReservas.filter(r => r.estado === 'FINISHED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devoluciones para Recibir */}
      {misReturnos.filter(r => r.status === 'SENT').length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Devoluciones por Recibir
            </CardTitle>
            <CardDescription>
              Los clientes han enviado estas herramientas. Debes confirmar su recepción.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Al recibir, verifica el estado de las herramientas. Si están en buen estado, marca como "Recibido OK". Si hay daños, reporta el daño.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              {misReturnos
                .filter(r => r.status === 'SENT')
                .map((ret) => {
                  const reservation = reservas.find(r => r.id === ret.reservationId);
                  return (
                    <div
                      key={ret.id}
                      className="flex flex-col gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              Devolución #{ret.id.slice(0, 8)}
                            </h3>
                            <ReturnStatusBadge status={ret.status} />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Cliente: {ret.clienteNombre}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Herramientas: {ret.details.map(d => `${d.toolName} (x${d.quantityToReturn})`).join(', ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {getReturnStatusMessage(ret.status)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setShowReturnDetails(ret.id)}>
                                <Eye className="w-4 h-4 mr-1" />
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Recibir Devolución #{ret.id.slice(0, 8)}</DialogTitle>
                                <DialogDescription>
                                  Verifica el estado de las herramientas y confirma la recepción
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <ReturnTimeline
                                  status={ret.status}
                                  createdAt={ret.createdAt}
                                  sentAt={ret.sentAt}
                                  receivedAt={ret.receivedAt}
                                />
                                <div>
                                  <h4 className="font-medium mb-3">Herramientas Devueltas</h4>
                                  <div className="space-y-2">
                                    {ret.details.map((detail) => (
                                      <div key={detail.id} className="p-3 bg-gray-50 rounded border">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <p className="font-medium">{detail.toolName}</p>
                                            <p className="text-sm text-gray-600">
                                              Cantidad devuelta: {detail.quantityToReturn} de {detail.quantityReserved}
                                            </p>
                                          </div>
                                        </div>
                                        {detail.notes && (
                                          <div className="mt-2 p-2 bg-white rounded">
                                            <p className="text-xs text-gray-500 mb-1">Notas del cliente:</p>
                                            <p className="text-sm text-gray-600">{detail.notes}</p>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Alert>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    Si hay daño, escribe notas detalladas abajo. La reserva pasará a estado IN_INCIDENT y las herramientas a UNDER_REPAIR.
                                  </AlertDescription>
                                </Alert>
                                <div>
                                  <Label>Notas sobre Daño (si aplica)</Label>
                                  <Textarea
                                    placeholder="Describe los daños encontrados..."
                                    value={damageNotes}
                                    onChange={(e) => setDamageNotes(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowReturnDetails(null);
                                    setDamageNotes('');
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReceiveDamaged(ret.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  Reportar Daño
                                </Button>
                                <Button
                                  onClick={() => handleReceiveOk(ret.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <PackageCheck className="w-4 h-4 mr-1" />
                                  Recibir OK
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            onClick={() => handleReceiveOk(ret.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <PackageCheck className="w-4 h-4 mr-1" />
                            Recibir OK
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservas Pendientes */}
      {misReservas.filter(r => r.estado === 'PENDING').length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
              Reservas Pendientes de Confirmación
            </CardTitle>
            <CardDescription>
              Estas reservas requieren tu aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {misReservas
                .filter(r => r.estado === 'PENDING')
                .map((reserva) => (
                  <div
                    key={reserva.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-yellow-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">Reserva #{reserva.id}</h3>
                        <ReservationStatusBadge status={reserva.estado} />
                      </div>
                      <div className="space-y-1 mb-2">
                        {reserva.details.map(detail => (
                          <p key={detail.id} className="text-sm text-gray-700">
                            • {detail.toolName} x{detail.quantity}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Cliente: {reserva.clienteNombre}</p>
                      <p className="text-sm text-gray-500">
                        Periodo: {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        Total: ${reserva.precioTotal}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAceptar(reserva.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRechazar(reserva.id)}
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todas las Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Reservas</CardTitle>
          <CardDescription>Historial completo de reservas de tus herramientas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Herramientas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Periodo</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {misReservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">#{reserva.id}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {reserva.details.map(detail => (
                          <p key={detail.id} className="text-sm">
                            {detail.toolName} (x{detail.quantity})
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{reserva.clienteNombre}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">${reserva.precioTotal}</td>
                    <td className="py-3 px-4">
                      <ReservationStatusBadge status={reserva.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}