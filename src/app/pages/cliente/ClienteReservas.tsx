import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { reservas, returns, Return, ReturnDetail, reservationDetails } from '@/app/data/mockData';
import { useAuth } from '../../../auth/useAuth';
import { ReservationStatusBadge, ReturnStatusBadge, canModifyReservation, getModificationBlockedMessage, getReturnStatusMessage } from '@/app/components/StatusBadges';
import { ReturnTimeline } from '@/app/components/ReturnTimeline';
import { Calendar, Package, AlertCircle, PackageCheck, Send, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function ClienteReservas() {
  const { user } = useAuth();
  const [showCreateReturn, setShowCreateReturn] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [showReturnDetails, setShowReturnDetails] = useState<string | null>(null);
  const [returnDetails, setReturnDetails] = useState<Omit<ReturnDetail, 'id' | 'returnId'>[]>([]);
  const [returnNotes, setReturnNotes] = useState('');

  const misReservas = reservas.filter(r => r.clienteId === user?.id);
  const misReturnos = returns.filter(r => r.clienteId === user?.id);

  const handleCreateReturn = (reservationId: string) => {
    const reservation = reservas.find(r => r.id === reservationId);
    if (!reservation) return;

    // Pre-llenar con todos los items de la reserva
    const initialDetails: Omit<ReturnDetail, 'id' | 'returnId'>[] = reservation.details.map(detail => ({
      toolId: detail.toolId,
      toolName: detail.toolName,
      quantityReserved: detail.quantity,
      quantityToReturn: detail.quantity,
      notes: '',
    }));

    setReturnDetails(initialDetails);
    setSelectedReservation(reservationId);
    setShowCreateReturn(true);
  };

  const handleSubmitReturn = () => {
    if (!selectedReservation) return;

    // Validar que todas las cantidades sean válidas
    const hasInvalidQuantity = returnDetails.some(
      detail => detail.quantityToReturn <= 0 || detail.quantityToReturn > detail.quantityReserved
    );

    if (hasInvalidQuantity) {
      toast.error('Las cantidades a devolver deben ser válidas (entre 1 y la cantidad reservada)');
      return;
    }

    toast.success('Devolución creada exitosamente. Estado: PENDING');
    setShowCreateReturn(false);
    setReturnDetails([]);
    setReturnNotes('');
    setSelectedReservation(null);
  };

  const handleConfirmShipment = (returnId: string) => {
    toast.success('Envío confirmado. Estado actualizado a SENT');
  };

  const canCreateReturn = (reservationStatus: string) => {
    return reservationStatus === 'IN_PROGRESS' || reservationStatus === 'CONFIRMED';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p className="text-gray-600 mt-1">Gestiona tus alquileres y devoluciones de herramientas</p>
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
            <CardTitle className="text-sm text-gray-600">Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {misReservas.filter(r => r.estado === 'CONFIRMED' || r.estado === 'IN_PROGRESS').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {misReservas.filter(r => r.estado === 'FINISHED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Gastado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${misReservas.reduce((sum, r) => sum + r.precioTotal, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devoluciones Pendientes */}
      {misReturnos.filter(r => r.status === 'PENDING' || r.status === 'SENT').length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-orange-600" />
              Devoluciones en Proceso
            </CardTitle>
            <CardDescription>
              Devoluciones que requieren tu atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {misReturnos
                .filter(r => r.status === 'PENDING' || r.status === 'SENT')
                .map((ret) => {
                  const reservation = reservas.find(r => r.id === ret.reservationId);
                  return (
                    <div
                      key={ret.id}
                      className="flex flex-col gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100"
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
                            Reserva: #{ret.reservationId}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Herramientas: {ret.details.map(d => d.toolName).join(', ')}
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
                                <DialogTitle>Detalles de Devolución #{ret.id.slice(0, 8)}</DialogTitle>
                                <DialogDescription>
                                  Estado actual: {ret.status}
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
                                  <h4 className="font-medium mb-3">Herramientas a Devolver</h4>
                                  <div className="space-y-2">
                                    {ret.details.map((detail) => (
                                      <div key={detail.id} className="flex justify-between items-start p-3 bg-gray-50 rounded">
                                        <div>
                                          <p className="font-medium">{detail.toolName}</p>
                                          <p className="text-sm text-gray-600">
                                            Cantidad: {detail.quantityToReturn} de {detail.quantityReserved}
                                          </p>
                                          {detail.notes && (
                                            <p className="text-sm text-gray-500 mt-1">{detail.notes}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {ret.status === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmShipment(ret.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Confirmar Envío
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reservas Activas */}
      {misReservas.filter(r => r.estado === 'CONFIRMED' || r.estado === 'IN_PROGRESS').length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Reservas Activas
            </CardTitle>
            <CardDescription>
              Herramientas que tienes alquiladas actualmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {misReservas
                .filter(r => r.estado === 'CONFIRMED' || r.estado === 'IN_PROGRESS')
                .map((reserva) => (
                  <div
                    key={reserva.id}
                    className="flex flex-col gap-4 p-4 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">Reserva #{reserva.id}</h3>
                          <ReservationStatusBadge status={reserva.estado} />
                        </div>
                        <div className="space-y-1 mb-3">
                          {reserva.details.map(detail => (
                            <p key={detail.id} className="text-sm text-gray-700">
                              • {detail.toolName} x{detail.quantity} - ${detail.subtotal}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Periodo: {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Total: ${reserva.precioTotal}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleCreateReturn(reserva.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <PackageCheck className="w-4 h-4 mr-1" />
                          Crear Devolución
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Reservas</CardTitle>
          <CardDescription>Todas tus reservas y su estado actual</CardDescription>
        </CardHeader>
        <CardContent>
          {misReservas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Herramientas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Periodo</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
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
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">${reserva.precioTotal}</td>
                      <td className="py-3 px-4">
                        <ReservationStatusBadge status={reserva.estado} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {canCreateReturn(reserva.estado) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateReturn(reserva.id)}
                          >
                            <PackageCheck className="w-4 h-4 mr-1" />
                            Devolver
                          </Button>
                        )}
                        {!canModifyReservation(reserva.estado) && (
                          <span className="text-sm text-gray-500">
                            {reserva.estado === 'FINISHED' ? 'Finalizada' : 
                             reserva.estado === 'CANCELLED' ? 'Cancelada' : 
                             'En Incidente'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No tienes reservas todavía</p>
              <Button>Explorar Herramientas</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog: Crear Devolución */}
      <Dialog open={showCreateReturn} onOpenChange={setShowCreateReturn}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Devolución</DialogTitle>
            <DialogDescription>
              Completa los detalles de las herramientas que vas a devolver. Cliente actual se toma automáticamente.
            </DialogDescription>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Las cantidades a devolver no pueden exceder las cantidades reservadas. Verifica la condición de cada herramienta.
            </AlertDescription>
          </Alert>
          <div className="space-y-6">
            {returnDetails.map((detail, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{detail.toolName}</h4>
                    <p className="text-sm text-gray-500">Reservado: {detail.quantityReserved} unidades</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cantidad a Devolver *</Label>
                    <Input
                      type="number"
                      min={1}
                      max={detail.quantityReserved}
                      value={detail.quantityToReturn}
                      onChange={(e) => {
                        const newDetails = [...returnDetails];
                        newDetails[index].quantityToReturn = Math.min(
                          Math.max(1, parseInt(e.target.value) || 1),
                          detail.quantityReserved
                        );
                        setReturnDetails(newDetails);
                      }}
                    />
                    {detail.quantityToReturn > detail.quantityReserved && (
                      <p className="text-xs text-red-600 mt-1">
                        No puedes devolver más de lo reservado
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Notas</Label>
                  <Textarea
                    placeholder="Observaciones sobre esta herramienta..."
                    value={detail.notes || ''}
                    onChange={(e) => {
                      const newDetails = [...returnDetails];
                      newDetails[index].notes = e.target.value;
                      setReturnDetails(newDetails);
                    }}
                  />
                </div>
              </div>
            ))}
            <div>
              <Label>Notas Generales de la Devolución</Label>
              <Textarea
                placeholder="Observaciones generales..."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateReturn(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitReturn}>
              Crear Devolución (Estado: PENDING)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}