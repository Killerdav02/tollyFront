import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { reservas } from '@/app/data/mockData';
import { CreditCard, Download, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function ClientePagos() {
  const misReservas = reservas.filter(r => r.clienteId === '3');
  const reservasConPago = misReservas.filter(r => r.metodoPago);
  const totalGastado = misReservas.reduce((sum, r) => sum + r.precioTotal, 0);
  const [selectedReserva, setSelectedReserva] = useState<typeof reservas[0] | null>(null);

  const handlePago = (metodoPago: string) => {
    if (!selectedReserva) return;
    toast.success(`Pago procesado exitosamente con ${metodoPago}`);
    setSelectedReserva(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
        <p className="text-gray-600 mt-1">Gestiona tus pagos y facturación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Gastado
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGastado.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">{reservasConPago.length}</div>
            <p className="text-xs text-gray-500 mt-1">Transacciones exitosas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Próximo Pago
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-gray-500 mt-1">Sin pagos pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago Guardados</CardTitle>
          <CardDescription>Gestiona tus métodos de pago</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium">Tarjeta de Crédito</p>
                  <p className="text-sm text-gray-500">•••• •••• •••• 4242</p>
                </div>
              </div>
              <Badge variant="default">Principal</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-sm text-gray-500">cliente@example.com</p>
                </div>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  + Agregar Método de Pago
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Método de Pago</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos de tu tarjeta o cuenta
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Fecha de expiración</Label>
                      <Input id="expiry" placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre en la tarjeta</Label>
                    <Input id="name" placeholder="Juan Pérez" />
                  </div>
                  <Button type="submit" className="w-full">
                    Guardar Método
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>Todas tus transacciones</CardDescription>
        </CardHeader>
        <CardContent>
          {reservasConPago.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Factura</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Herramienta</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Método</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reservasConPago.map((reserva) => (
                    <tr key={reserva.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">#{reserva.id.padStart(5, '0')}</td>
                      <td className="py-3 px-4 font-medium">{reserva.herramientaNombre}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{reserva.metodoPago}</td>
                      <td className="py-3 px-4 text-right font-medium">${reserva.precioTotal}</td>
                      <td className="py-3 px-4">
                        <Badge variant="default">Completado</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.success('Factura descargada')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
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
      {misReservas.filter(r => !r.metodoPago && r.estado === 'pendiente').length > 0 && (
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
              {misReservas
                .filter(r => !r.metodoPago && r.estado === 'pendiente')
                .map((reserva) => (
                  <div key={reserva.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{reserva.herramientaNombre}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - 
                        {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-gray-900">${reserva.precioTotal}</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedReserva(reserva)}>
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
                                <span className="text-gray-600">Herramienta:</span>
                                <span className="font-medium">{reserva.herramientaNombre}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Periodo:</span>
                                <span className="font-medium">
                                  {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - 
                                  {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-semibold">Total:</span>
                                <span className="text-xl font-bold text-blue-600">${reserva.precioTotal}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Selecciona método de pago:</Label>
                              <div className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handlePago('Tarjeta de Crédito')}
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Tarjeta de Crédito (••• 4242)
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handlePago('PayPal')}
                                >
                                  PayPal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
