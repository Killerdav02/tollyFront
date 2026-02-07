import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { reservas, facturacionData } from '@/app/data/mockData';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

export function AdminPagos() {
  const reservasConPago = reservas.filter(r => r.metodoPago);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
        <p className="text-gray-600 mt-1">Control de transacciones y facturación</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${facturacionData.ingresosTotal.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Acumulado histórico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Este Mes
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${facturacionData.ingresosMes.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+15% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Transacciones
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservasConPago.length}</div>
            <p className="text-xs text-gray-500 mt-1">Pagos procesados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Promedio Pago
            </CardTitle>
            <CreditCard className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(facturacionData.ingresosMes / reservasConPago.length)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Por transacción</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
            <CardDescription>Distribución por tipo de pago</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metodo: 'Tarjeta de Crédito', cantidad: 1, porcentaje: 50 },
                { metodo: 'PayPal', cantidad: 1, porcentaje: 50 },
                { metodo: 'Transferencia', cantidad: 0, porcentaje: 0 },
              ].map((item) => (
                <div key={item.metodo} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.metodo}</span>
                    <span className="text-sm text-gray-600">{item.cantidad} ({item.porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Pagos</CardTitle>
            <CardDescription>Resumen por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Pagos Completados</p>
                  <p className="text-sm text-green-600">Transacciones exitosas</p>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {reservasConPago.length}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Pendientes</p>
                  <p className="text-sm text-yellow-600">Esperando confirmación</p>
                </div>
                <div className="text-2xl font-bold text-yellow-900">
                  {reservas.filter(r => !r.metodoPago).length}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">Fallidos</p>
                  <p className="text-sm text-red-600">Transacciones rechazadas</p>
                </div>
                <div className="text-2xl font-bold text-red-900">0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimos pagos procesados en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Herramienta</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Método</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasConPago.map((reserva) => (
                  <tr key={reserva.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">#{reserva.id}</td>
                    <td className="py-3 px-4 font-medium">{reserva.clienteNombre}</td>
                    <td className="py-3 px-4 text-gray-600">{reserva.herramientaNombre}</td>
                    <td className="py-3 px-4 text-gray-600">{reserva.metodoPago}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      ${reserva.precioTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default">Completado</Badge>
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
