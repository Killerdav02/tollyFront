import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { herramientas, reservas } from '@/app/data/mockData';
import { Search, Calendar, CreditCard, Wrench, ArrowRight } from 'lucide-react';

export function ClienteDashboard() {
  const misReservas = reservas.filter(r => r.clienteId === '3');
  const reservasActivas = misReservas.filter(r => r.estado === 'confirmada' || r.estado === 'en-uso');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Bienvenido</h1>
        <p className="text-gray-600 mt-1">Encuentra y alquila las herramientas que necesitas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/cliente/explorar">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#7fb3b0] bg-[#e8f2f1]">
            <CardHeader>
              <Search className="w-8 h-8 text-[#3d5a5a] mb-2" />
              <CardTitle className="text-[#3d5a5a]">Explorar Herramientas</CardTitle>
              <CardDescription className="text-[#5a7876]">
                Busca entre nuestro catálogo completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="text-[#7fb3b0] hover:text-[#6da39f]">
                Ver catálogo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/cliente/reservas">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#7fb3b0] bg-[#e8f2f1]">
            <CardHeader>
              <Calendar className="w-8 h-8 text-[#3d5a5a] mb-2" />
              <CardTitle className="text-[#3d5a5a]">Mis Reservas</CardTitle>
              <CardDescription className="text-[#5a7876]">
                Gestiona tus alquileres activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="text-[#7fb3b0] hover:text-[#6da39f]">
                Ver reservas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/cliente/pagos">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#7fb3b0] bg-[#e8f2f1]">
            <CardHeader>
              <CreditCard className="w-8 h-8 text-[#3d5a5a] mb-2" />
              <CardTitle className="text-[#3d5a5a]">Pagos</CardTitle>
              <CardDescription className="text-[#5a7876]">
                Revisa tu historial de pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="text-[#7fb3b0] hover:text-[#6da39f]">
                Ver pagos <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Reservations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Reservas Activas
          </CardTitle>
          <CardDescription>Herramientas que tienes alquiladas actualmente</CardDescription>
        </CardHeader>
        <CardContent>
          {reservasActivas.length > 0 ? (
            <div className="space-y-4">
              {reservasActivas.map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-[#e8f2f1] border border-[#7fb3b0] rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#3d5a5a]">{reserva.herramientaNombre}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Desde: {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')} - 
                      Hasta: {new Date(reserva.fechaFin).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-sm font-medium text-[#7fb3b0] mt-1">
                      Estado: {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#7fb3b0] text-[#3d5a5a] hover:bg-[#e8f2f1]">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No tienes reservas activas</p>
              <Link to="/cliente/explorar">
                <Button variant="outline" className="mt-4">
                  Explorar Herramientas
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Herramientas Destacadas</CardTitle>
          <CardDescription>Equipos populares disponibles para alquilar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {herramientas.filter(h => h.disponible).slice(0, 3).map((herramienta) => (
              <div key={herramienta.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-200 overflow-hidden">
                  <img
                    src={herramienta.imagen}
                    alt={herramienta.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{herramienta.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-3">{herramienta.categoria}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Precio</p>
                      <p className="font-bold text-[#7fb3b0]">${herramienta.precioDia}/día</p>
                    </div>
                    <Link to="/cliente/explorar">
                      <Button size="sm" className="bg-[#3d5a5a] hover:bg-[#2a4644]">Alquilar</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {misReservas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial Reciente</CardTitle>
            <CardDescription>Tus últimos alquileres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {misReservas.slice(0, 3).map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{reserva.herramientaNombre}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(reserva.fechaInicio).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${reserva.precioTotal}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reserva.estado === 'completada' ? 'bg-green-100 text-green-800' :
                      reserva.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
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
      )}
    </div>
  );
}