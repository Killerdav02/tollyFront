import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { reportesData, facturacionData } from '@/app/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdminReportes() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600 mt-1">Análisis de rentabilidad y uso de herramientas</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rentabilidad Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${facturacionData.ingresosTotal.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              +24% respecto al año anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {facturacionData.reservasTotal}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {facturacionData.reservasMes} reservas este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tasa de Ocupación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">78%</div>
            <p className="text-xs text-gray-500 mt-2">
              Promedio de utilización de equipos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rentabilidad Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Rentabilidad Mensual</CardTitle>
            <CardDescription>Evolución de ingresos en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportesData.rentabilidadMensual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Ingresos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Herramientas Más Alquiladas */}
        <Card>
          <CardHeader>
            <CardTitle>Herramientas Más Alquiladas</CardTitle>
            <CardDescription>Top 5 equipos por número de reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportesData.herramientasMasAlquiladas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alquileres" fill="#3b82f6" name="Alquileres" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Ingresos por Herramienta</CardTitle>
          <CardDescription>Porcentaje de ingresos generados por cada tipo de equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportesData.herramientasMasAlquiladas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="alquileres"
                >
                  {reportesData.herramientasMasAlquiladas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2">
              {reportesData.herramientasMasAlquiladas.map((item, index) => (
                <div key={item.nombre} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium">{item.nombre}</span>
                  <span className="text-sm text-gray-500">({item.alquileres} alquileres)</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Detalladas</CardTitle>
          <CardDescription>Métricas de rendimiento del negocio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Métrica</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Valor</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Objetivo</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">% Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metrica: 'Ingresos Mensuales', valor: `$${facturacionData.ingresosMes}`, objetivo: '$3000', cumplimiento: 108 },
                  { metrica: 'Reservas Mensuales', valor: facturacionData.reservasMes, objetivo: '50', cumplimiento: 94 },
                  { metrica: 'Clientes Activos', valor: facturacionData.clientesActivos, objetivo: '5', cumplimiento: 80 },
                  { metrica: 'Tasa de Satisfacción', valor: '4.5/5', objetivo: '4.0/5', cumplimiento: 113 },
                  { metrica: 'Tiempo Promedio Alquiler', valor: '3.2 días', objetivo: '3 días', cumplimiento: 107 },
                ].map((row) => (
                  <tr key={row.metrica} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{row.metrica}</td>
                    <td className="py-3 px-4 text-right">{row.valor}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{row.objetivo}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${row.cumplimiento >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {row.cumplimiento}%
                      </span>
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
