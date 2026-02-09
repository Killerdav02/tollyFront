import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { facturacionData, herramientas, reservas, usuarios } from '@/app/data/mockData';
import { 
  Users, 
  Wrench, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';

export function AdminDashboard() {
  const reservasPendientes = reservas.filter(r => r.estado === 'PENDING').length;
  const herramientasEnReparacion = herramientas.filter(h => h.status === 'UNDER_REPAIR').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Panel de Administrador</h1>
        <p className="text-gray-600 mt-1">Resumen general de la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuarios Totales
            </CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {usuarios.filter(u => u.estado === 'activo').length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Herramientas
            </CardTitle>
            <Wrench className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{herramientas.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {herramientas.filter(h => h.availableQuantity > 0).length} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reservas Mes
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturacionData.reservasMes}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Mes
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${facturacionData.ingresosMes.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total: ${facturacionData.ingresosTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(reservasPendientes > 0 || herramientasEnReparacion > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Atención Requerida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {reservasPendientes > 0 && (
              <p className="text-orange-800">
                • {reservasPendientes} reserva(s) pendiente(s) de confirmación
              </p>
            )}
            {herramientasEnReparacion > 0 && (
              <p className="text-orange-800">
                • {herramientasEnReparacion} herramienta(s) en reparación
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
            <CardDescription>Últimas reservas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservas.slice(0, 5).map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{reserva.details[0]?.toolName}</p>
                    <p className="text-sm text-gray-500">{reserva.clienteNombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${reserva.precioTotal}</p>
                    {(() => {
                      const estadoLabel = {
                        CONFIRMED: 'confirmada',
                        PENDING: 'pendiente',
                        IN_PROGRESS: 'en progreso',
                        FINISHED: 'finalizada',
                        CANCELLED: 'cancelada',
                        IN_INCIDENT: 'incidente'
                      }[reserva.estado] ?? reserva.estado;
                      return (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          reserva.estado === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          reserva.estado === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {estadoLabel}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Herramientas Más Populares</CardTitle>
            <CardDescription>Equipos con mayor demanda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {herramientas.slice(0, 5).map((herramienta, index) => (
                <div key={herramienta.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{herramienta.nombre}</p>
                      <p className="text-sm text-gray-500">{herramienta.categoria}</p>
                    </div>
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