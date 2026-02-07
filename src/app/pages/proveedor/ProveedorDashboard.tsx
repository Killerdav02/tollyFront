import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { herramientas, reservas } from '@/app/data/mockData';
import { Package, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

export function ProveedorDashboard() {
  const misReservas = reservas;
  const misHerramientas = herramientas;
  const reservasPendientes = misReservas.filter(r => r.estado === 'PENDING').length;
  const ingresosEsteMes = misReservas
    .filter(r => r.estado === 'FINISHED' || r.estado === 'CONFIRMED')
    .reduce((sum, r) => sum + r.precioTotal, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Panel de Proveedor</h1>
        <p className="text-gray-600 mt-1">Gestiona tu inventario y reservas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mis Herramientas
            </CardTitle>
            <Package className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{misHerramientas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {misHerramientas.filter(h => h.availableQuantity > 0).length} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reservas Activas
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{misReservas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {reservasPendientes} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Este Mes
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ingresosEsteMes.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+18% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tasa Ocupación
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-gray-500 mt-1">Promedio mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {reservasPendientes > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Acción Requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800">
              Tienes {reservasPendientes} reserva(s) pendiente(s) de confirmación. 
              Revisa la sección de Reservas para gestionarlas.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
            <CardDescription>Últimas solicitudes de alquiler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {misReservas.slice(0, 5).map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{reserva.herramientaNombre}</p>
                    <p className="text-sm text-gray-500">{reserva.clienteNombre}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${reserva.precioTotal}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                      reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reserva.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Inventario</CardTitle>
            <CardDescription>Resumen de tus herramientas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {misHerramientas.slice(0, 5).map((herramienta) => (
                <div key={herramienta.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{herramienta.nombre}</p>
                    <p className="text-sm text-gray-500">{herramienta.categoria}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      herramienta.availableQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {herramienta.availableQuantity > 0 ? 'Disponible' : 'No disponible'}
                    </span>
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