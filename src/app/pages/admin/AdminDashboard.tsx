
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Users, Wrench, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import apiClient from '@/api/apiClient';

type User = { id: number; nombre: string; estado: string; };
type Herramienta = { id: number; nombre: string; categoria: string; status: string; availableQuantity: number; };
type Reserva = { id: number; clienteNombre: string; precioTotal: number; estado: string; details: { toolName: string }[] };
type Facturacion = { reservasMes: number; ingresosMes: number; ingresosTotal: number };
type TopTool = { toolId: number; toolName: string; totalQuantity: number };

function useFetch<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then(setData)
      .catch(e => setError(e.message || 'Error al cargar datos'))
      .finally(() => setLoading(false));
  }, deps);
  return { data, loading, error };
}

// Fetchers listos para conectar a la API real
const fetchUsuarios = async (): Promise<User[]> => {
  const res = await apiClient.get('/users');
  return res.data;
};

const fetchHerramientas = async (): Promise<Herramienta[]> => {
  // TODO: Conectar a la API real de herramientas
  throw new Error('Conectar fetchHerramientas a la API real');
};

const fetchReservas = async (): Promise<Reserva[]> => {
  // TODO: Conectar a la API real de reservas
  throw new Error('Conectar fetchReservas a la API real');
};

const fetchFacturacion = async (): Promise<Facturacion> => {
  // TODO: Conectar a la API real de facturación
  throw new Error('Conectar fetchFacturacion a la API real');
};

const fetchTopTools = async (): Promise<TopTool[]> => {
  const res = await apiClient.get('/admin/reports/top-tools');
  return res.data;
};

export function AdminDashboard() {
  // Fetch de todos los datos
  const { data: usuarios, loading: loadingUsuarios, error: errorUsuarios } = useFetch(fetchUsuarios, []);
  const { data: herramientas, loading: loadingHerramientas, error: errorHerramientas } = useFetch(fetchHerramientas, []);
  const { data: reservas, loading: loadingReservas, error: errorReservas } = useFetch(fetchReservas, []);
  const { data: facturacion, loading: loadingFacturacion, error: errorFacturacion } = useFetch(fetchFacturacion, []);
  const { data: topTools, loading: loadingTopTools, error: errorTopTools } = useFetch(fetchTopTools, []);

  // Helpers para loading/error global
  const anyLoading = loadingUsuarios || loadingHerramientas || loadingReservas || loadingFacturacion;
  const anyError = errorUsuarios || errorHerramientas || errorReservas || errorFacturacion;

  // Métricas para alertas
  const reservasPendientes = reservas?.filter(r => r.estado === 'PENDING').length || 0;
  const herramientasEnReparacion = herramientas?.filter(h => h.status === 'UNDER_REPAIR').length || 0;

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
            {loadingUsuarios ? (
              <div className="h-8 flex items-center">Cargando...</div>
            ) : errorUsuarios ? (
              <div className="text-red-600 text-xs">{errorUsuarios}</div>
            ) : usuarios ? (
              <>
                <div className="text-2xl font-bold">{usuarios.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {usuarios.filter(u => u.estado === 'activo').length} activos
                </p>
              </>
            ) : null}
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
            {loadingHerramientas ? (
              <div className="h-8 flex items-center">Cargando...</div>
            ) : errorHerramientas ? (
              <div className="text-red-600 text-xs">{errorHerramientas}</div>
            ) : herramientas ? (
              <>
                <div className="text-2xl font-bold">{herramientas.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {herramientas.filter(h => h.availableQuantity > 0).length} disponibles
                </p>
              </>
            ) : null}
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
            {loadingFacturacion ? (
              <div className="h-8 flex items-center">Cargando...</div>
            ) : errorFacturacion ? (
              <div className="text-red-600 text-xs">{errorFacturacion}</div>
            ) : facturacion ? (
              <>
                <div className="text-2xl font-bold">{facturacion.reservasMes}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs mes anterior
                </p>
              </>
            ) : null}
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
            {loadingFacturacion ? (
              <div className="h-8 flex items-center">Cargando...</div>
            ) : errorFacturacion ? (
              <div className="text-red-600 text-xs">{errorFacturacion}</div>
            ) : facturacion ? (
              <>
                <div className="text-2xl font-bold">${facturacion.ingresosMes.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Total: ${facturacion.ingresosTotal.toLocaleString()}
                </p>
              </>
            ) : null}
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
            {loadingReservas ? (
              <div className="h-8 flex items-center">Cargando...</div>
            ) : errorReservas ? (
              <div className="text-red-600 text-xs">{errorReservas}</div>
            ) : reservas && reservas.length > 0 ? (
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
            ) : (
              <div className="text-gray-500 text-sm">No hay reservas recientes.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Herramientas Más Populares</CardTitle>
            <CardDescription>Equipos con mayor demanda</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTopTools ? (
              <div className="h-8 flex items-center">Cargando...</div>
            ) : errorTopTools ? (
              <div className="text-red-600 text-xs">{errorTopTools}</div>
            ) : topTools && topTools.length > 0 ? (
              <div className="space-y-4">
                {topTools.slice(0, 5).map((tool, index) => (
                  <div key={tool.toolId} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tool.toolName}</p>
                        <p className="text-sm text-gray-500">Total: {tool.totalQuantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">No hay datos de herramientas populares.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
