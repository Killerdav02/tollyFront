import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { herramientas } from '@/app/data/mockData';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

export function AdminHerramientas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  const categorias = Array.from(new Set(herramientas.map(h => h.categoria)));

  const filteredHerramientas = herramientas.filter(h => {
    const matchSearch = h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filtroCategoria === 'todas' || h.categoria === filtroCategoria;
    return matchSearch && matchCategoria;
  });

  const getEstadoBadgeColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'RENTED': return 'bg-blue-100 text-blue-800';
      case 'UNDER_REPAIR': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponible';
      case 'RENTED': return 'Alquilada';
      case 'UNDER_REPAIR': return 'En Reparación';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#3d5a5a]">Gestión de Herramientas</h1>
          <p className="text-gray-600 mt-1">Administra el inventario de equipos disponibles</p>
        </div>
        <Button className="bg-[#7fb3b0] hover:bg-[#6da39f]">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Herramienta
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-[#3d5a5a] p-2 rounded-md">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <Input
                  placeholder="Buscar herramientas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 bg-transparent"
                />
              </div>
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHerramientas.map((herramienta) => (
          <Card key={herramienta.id} className="overflow-hidden">
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={herramienta.imagen}
                alt={herramienta.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{herramienta.nombre}</CardTitle>
                <Badge variant={herramienta.availableQuantity > 0 ? 'default' : 'secondary'}>
                  {herramienta.availableQuantity > 0 ? 'Disponible' : 'No disponible'}
                </Badge>
              </div>
              <CardDescription>{herramienta.categoria}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{herramienta.descripcion}</p>

                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-gray-500">Estado:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getEstadoBadgeColor(herramienta.status)}`}>
                    {getEstadoLabel(herramienta.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Disponibles:</span>
                  <span className="text-sm font-medium">{herramienta.availableQuantity} / {herramienta.totalQuantity}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Proveedor:</span>
                  <span className="text-sm font-medium">{herramienta.proveedorNombre}</span>
                </div>

                <div className="pt-2 border-t text-center">
                  <p className="text-xs text-gray-500">Precio por día</p>
                  <p className="text-lg font-bold text-blue-600">${herramienta.precioDia}</p>
                </div>

                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHerramientas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No se encontraron herramientas con los filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}