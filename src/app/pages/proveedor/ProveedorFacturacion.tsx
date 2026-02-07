import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { reservas } from '@/app/data/mockData';
import { Download, DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';

export function ProveedorFacturacion() {
  const reservasCompletadas = reservas.filter(r => r.estado === 'completada' || r.estado === 'confirmada');
  const ingresosTotales = reservasCompletadas.reduce((sum, r) => sum + r.precioTotal, 0);
  const ingresosMesActual = reservasCompletadas
    .filter(r => new Date(r.fechaInicio).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + r.precioTotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-600 mt-1">Gestiona tus ingresos y genera reportes</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
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
            <div className="text-2xl font-bold">${ingresosTotales.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Acumulado histórico</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mes Actual
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${ingresosMesActual.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">+18% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Alquileres
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservasCompletadas.length}</div>
            <p className="text-xs text-gray-500 mt-1">Transacciones completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingreso Promedio
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(ingresosTotales / reservasCompletadas.length)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Por alquiler</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings by Month */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>Resumen de tus ganancias por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { mes: 'Enero 2026', ingresos: 3250, alquileres: 8 },
              { mes: 'Diciembre 2025', ingresos: 2800, alquileres: 7 },
              { mes: 'Noviembre 2025', ingresos: 2450, alquileres: 6 },
              { mes: 'Octubre 2025', ingresos: 2100, alquileres: 5 },
            ].map((item) => (
              <div key={item.mes} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.mes}</p>
                  <p className="text-sm text-gray-500">{item.alquileres} alquileres</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">${item.ingresos.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Generadas</CardTitle>
          <CardDescription>Listado de todas las facturas de alquileres</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Factura #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Herramienta</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Método Pago</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservasCompletadas.map((reserva) => (
                  <tr key={reserva.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">INV-{reserva.id.padStart(5, '0')}</td>
                    <td className="py-3 px-4 font-medium">{reserva.clienteNombre}</td>
                    <td className="py-3 px-4 text-gray-600">{reserva.herramientaNombre}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-600">
                      ${reserva.precioTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {reserva.metodoPago || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago Recibidos</CardTitle>
            <CardDescription>Distribución de pagos por método</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metodo: 'Tarjeta de Crédito', cantidad: 1, monto: 120, porcentaje: 57 },
                { metodo: 'PayPal', cantidad: 1, monto: 90, porcentaje: 43 },
                { metodo: 'Transferencia', cantidad: 0, monto: 0, porcentaje: 0 },
              ].map((item) => (
                <div key={item.metodo} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.metodo}</span>
                    <span className="text-sm text-gray-600">
                      {item.cantidad} pagos • ${item.monto}
                    </span>
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
            <CardTitle>Herramientas Más Rentables</CardTitle>
            <CardDescription>Top equipos por ingresos generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { herramienta: 'Compresor de Aire', ingresos: 120, alquileres: 3 },
                { herramienta: 'Sierra Circular Makita', ingresos: 90, alquileres: 3 },
                { herramienta: 'Taladro Eléctrico DeWalt', ingresos: 75, alquileres: 3 },
              ].map((item, index) => (
                <div key={item.herramienta} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.herramienta}</p>
                      <p className="text-sm text-gray-500">{item.alquileres} alquileres</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${item.ingresos}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
