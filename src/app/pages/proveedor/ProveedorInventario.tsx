import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { herramientas } from '@/app/data/mockData';
import { ToolStatusBadge } from '@/app/components/StatusBadges';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ProveedorInventario() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);

  const handleAddHerramienta = () => {
    toast.success('Herramienta agregada exitosamente con estado AVAILABLE');
    setDialogOpen(false);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'excelente': return 'bg-green-100 text-green-800';
      case 'bueno': return 'bg-blue-100 text-blue-800';
      case 'regular': return 'bg-yellow-100 text-yellow-800';
      case 'dañado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#3d5a5a]">Mi Inventario</h1>
          <p className="text-gray-600 mt-1">Gestiona tus herramientas disponibles</p>
        </div>
        <Button 
          onClick={() => setShowAgregarModal(true)}
          className="bg-[#7fb3b0] hover:bg-[#6da39f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Herramienta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Herramientas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{herramientas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#7fb3b0]">
              {herramientas.filter(h => h.status === 'AVAILABLE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">En Alquiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3d5a5a]">
              {herramientas.filter(h => h.status === 'RENTED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">En Reparación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {herramientas.filter(h => h.status === 'UNDER_REPAIR').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {herramientas.map((herramienta) => (
          <Card key={herramienta.id}>
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img
                src={herramienta.imagen}
                alt={herramienta.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg">{herramienta.nombre}</CardTitle>
                <ToolStatusBadge status={herramienta.status} />
              </div>
              <CardDescription>{herramienta.categoria}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{herramienta.descripcion}</p>
                
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-gray-500">Stock:</span>
                  <span className="text-sm font-medium">
                    {herramienta.availableQuantity} / {herramienta.totalQuantity} disponibles
                  </span>
                </div>

                <div className="pt-2 border-t text-center">
                  <p className="text-xs text-gray-500">Precio por día</p>
                  <p className="text-lg font-bold text-[#7fb3b0]">${herramienta.precioDia}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info('Editar herramienta')}>
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => toast.error('Herramienta eliminada')}
                    disabled={herramienta.status === 'RENTED'}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
                {herramienta.status === 'RENTED' && (
                  <p className="text-xs text-gray-500 text-center">
                    No se puede eliminar mientras está alquilada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}