import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { herramientas } from '@/app/data/mockData';
import { Filter, Calendar, CheckCircle2, XCircle, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export function ClienteExplorar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [selectedTool, setSelectedTool] = useState<typeof herramientas[0] | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const categorias = Array.from(new Set(herramientas.map(h => h.categoria)));
  
  // Contar herramientas por categoría
  const categoriaCounts = categorias.reduce((acc, cat) => {
    acc[cat] = herramientas.filter(h => h.categoria === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredHerramientas = herramientas.filter(h => {
    const matchSearch = h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       h.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filtroCategoria === 'todas' || h.categoria === filtroCategoria;
    const matchDisponible = !soloDisponibles || h.availableQuantity > 0;
    return matchSearch && matchCategoria && matchDisponible;
  });

  const handleReservar = (fechaInicio: string, fechaFin: string) => {
    if (!selectedTool) return;
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 3600 * 24)) + 1;
    const total = dias * selectedTool.precioDia;

    toast.success(`Reserva creada: ${selectedTool.nombre} por ${dias} día(s) - Total: $${total}`);
    setSelectedTool(null);
    
    // Redirect to payment
    setTimeout(() => {
      navigate('/cliente/pagos');
    }, 1500);
  };

  // Componente de filtros reutilizable
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Disponibilidad */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Disponibilidad</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="disponibles" 
            checked={soloDisponibles}
            onCheckedChange={(checked) => setSoloDisponibles(checked as boolean)}
          />
          <label
            htmlFor="disponibles"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Solo disponibles
          </label>
        </div>
      </div>

      {/* Categorías */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Categorías</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="cat-todas"
              name="categoria"
              value="todas"
              checked={filtroCategoria === 'todas'}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="cat-todas" className="text-sm cursor-pointer">
              Todas
            </label>
          </div>
          {categorias.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`cat-${cat}`}
                name="categoria"
                value={cat}
                checked={filtroCategoria === cat}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer flex-1">
                {cat} ({categoriaCounts[cat]})
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Panel lateral de filtros - Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Área principal */}
      <div className="flex-1 min-w-0">
        {/* Header con título y botón de filtros móvil */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Todas las Herramientas</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {filteredHerramientas.length} {filteredHerramientas.length === 1 ? 'herramienta encontrada' : 'herramientas encontradas'}
              </p>
            </div>
            
            {/* Botón de filtros para móvil */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Grid de herramientas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredHerramientas.map((herramienta) => (
            <Card key={herramienta.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="h-48 sm:h-56 bg-gray-100 overflow-hidden">
                <img
                  src={herramienta.imagen}
                  alt={herramienta.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
                <div className="space-y-3 flex-1 flex flex-col">
                  {/* Título con indicador de disponibilidad */}
                  <div className="flex items-start gap-2">
                    <h3 className="font-semibold text-gray-900 flex-1 leading-tight text-sm md:text-base">
                      {herramienta.nombre}
                    </h3>
                    {herramienta.availableQuantity > 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Descripción */}
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[32px] md:min-h-[40px]">
                    {herramienta.descripcion}
                  </p>

                  {/* Badge de categoría y estado */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                      {herramienta.categoria}
                    </Badge>
                    {herramienta.availableQuantity === 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        Sin stock
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-600">
                        {herramienta.availableQuantity} disponible{herramienta.availableQuantity > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="pt-3 border-t mt-auto">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">${herramienta.precioDia}</p>
                        <p className="text-xs md:text-sm text-gray-500">por día</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            disabled={herramienta.availableQuantity === 0}
                            onClick={() => setSelectedTool(herramienta)}
                            className="text-xs md:text-sm"
                          >
                            {herramienta.availableQuantity > 0 ? 'Reservar' : 'No disponible'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">Reservar {herramienta.nombre}</DialogTitle>
                            <DialogDescription className="text-sm">
                              Selecciona las fechas para tu alquiler
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              const fechaInicio = formData.get('fechaInicio') as string;
                              const fechaFin = formData.get('fechaFin') as string;
                              handleReservar(fechaInicio, fechaFin);
                            }}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="fechaInicio" className="text-sm">Fecha de inicio</Label>
                              <Input
                                id="fechaInicio"
                                name="fechaInicio"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fechaFin" className="text-sm">Fecha de fin</Label>
                              <Input
                                id="fechaFin"
                                name="fechaFin"
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="text-sm"
                              />
                            </div>
                            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                              <p className="text-xs md:text-sm text-gray-600 mb-2">Precio por día:</p>
                              <p className="text-xl md:text-2xl font-bold text-blue-600">${herramienta.precioDia}</p>
                              <p className="text-xs text-gray-500 mt-1">El precio total se calculará según los días seleccionados</p>
                            </div>
                            <Button type="submit" className="w-full text-sm md:text-base">
                              <Calendar className="w-4 h-4 mr-2" />
                              Confirmar Reserva
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredHerramientas.length === 0 && (
          <Card>
            <CardContent className="py-8 md:py-12 text-center px-4">
              <Filter className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm md:text-base">No se encontraron herramientas con los filtros aplicados.</p>
              <Button
                variant="outline"
                className="mt-4 text-sm md:text-base"
                onClick={() => {
                  setSearchTerm('');
                  setFiltroCategoria('todas');
                  setSoloDisponibles(false);
                }}
              >
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}