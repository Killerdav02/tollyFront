import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ToolStatusBadge } from '@/app/components/StatusBadges';
import { Plus, Edit, Trash2, AlertCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { listTools, createTool, updateTool, deleteTool } from '../../../services/toolService';
import { listCategories } from '../../../services/categoryService';
import { listToolStatuses } from '../../../services/toolStatusService';
import { createToolImage, listToolImages } from '../../../services/toolImageService';
import type { Category, Tool, ToolStatus } from '../../../services/types';

const SUPPLIER_ID_KEY = 'tolly_supplier_id';

function normalizeToolStatus(statusName?: string): 'AVAILABLE' | 'RENTED' | 'UNDER_REPAIR' | 'UNAVAILABLE' {
  const normalized = (statusName || '').toUpperCase();
  if (['AVAILABLE', 'DISPONIBLE'].includes(normalized)) return 'AVAILABLE';
  if (['UNDER_REPAIR', 'EN_REPARACION', 'REPARACION'].includes(normalized)) return 'UNDER_REPAIR';
  if (['RENTED', 'ALQUILADA', 'ALQUILADO'].includes(normalized)) return 'RENTED';
  if (['UNAVAILABLE', 'NO_DISPONIBLE', 'INACTIVO'].includes(normalized)) return 'UNAVAILABLE';
  return 'UNAVAILABLE';
}

function resolveSupplierId(tools: Tool[]): number | null {
  const stored = localStorage.getItem(SUPPLIER_ID_KEY);
  if (stored && !Number.isNaN(Number(stored))) return Number(stored);
  const unique = Array.from(new Set(tools.map((tool) => tool.supplierId)));
  if (unique.length === 1) {
    localStorage.setItem(SUPPLIER_ID_KEY, String(unique[0]));
    return unique[0];
  }
  return null;
}

function resolveImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const base = import.meta.env.VITE_API_URL || "";
  if (url.startsWith("/")) {
    return base ? `${base.replace(/\/$/, "")}${url}` : url;
  }
  return base ? `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}` : `/${url}`;
}

export function ProveedorInventario() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statuses, setStatuses] = useState<ToolStatus[]>([]);
  const [imagesByTool, setImagesByTool] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const [filters, setFilters] = useState({
    categoryId: 'all',
    statusName: 'all',
    onlyMine: true,
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dailyPrice: '',
    totalQuantity: '',
    availableQuantity: '',
    categoryId: '',
    imageUrl: '',
    statusId: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [toolData, categoryData, statusData] = await Promise.all([
          listTools(),
          listCategories(),
          listToolStatuses(),
        ]);
        setTools(toolData);
        setCategories(categoryData);
        setStatuses(statusData);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'No se pudieron cargar las herramientas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (tools.length === 0) return;
    const loadImages = async () => {
      const entries = await Promise.all(
        tools.map(async (tool) => {
          try {
            const images = await listToolImages(tool.id);
            const firstImage: any = images[0];
            const rawUrl = firstImage?.image_url || firstImage?.imageUrl || firstImage?.url;
            const url = resolveImageUrl(rawUrl);
            return [tool.id, url] as const;
          } catch {
            return [tool.id, undefined] as const;
          }
        })
      );
      const mapped: Record<number, string> = {};
      entries.forEach(([toolId, url]) => {
        if (url) mapped[toolId] = url;
      });
      setImagesByTool(mapped);
    };
    loadImages();
  }, [tools]);

  const supplierId = useMemo(() => resolveSupplierId(tools), [tools]);

  const statusNameById = useMemo(() => {
    return statuses.reduce<Record<number, string>>((acc, status) => {
      acc[status.id] = status.name;
      return acc;
    }, {});
  }, [statuses]);

  const categoryNameById = useMemo(() => {
    return categories.reduce<Record<number, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const filteredTools = useMemo(() => {
    let filtered = [...tools];

    if (filters.onlyMine && supplierId) {
      filtered = filtered.filter((tool) => tool.supplierId === supplierId);
    }

    if (filters.categoryId !== 'all') {
      filtered = filtered.filter((tool) => tool.categoryId === Number(filters.categoryId));
    }

    if (filters.statusName !== 'all') {
      filtered = filtered.filter((tool) => {
        const statusName = statusNameById[tool.statusId];
        return normalizeToolStatus(statusName) === filters.statusName;
      });
    }

    return filtered;
  }, [tools, filters, supplierId, statusNameById]);

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      dailyPrice: '',
      totalQuantity: '',
      availableQuantity: '',
      categoryId: '',
      imageUrl: '',
      statusId: '',
    });
    setEditingTool(null);
    setShowAgregarModal(true);
  };

  const openEditModal = (tool: Tool) => {
    setFormData({
      name: tool.name,
      description: tool.description,
      dailyPrice: String(tool.dailyPrice),
      totalQuantity: String(tool.totalQuantity),
      availableQuantity: String(tool.availableQuantity),
      categoryId: String(tool.categoryId),
      imageUrl: imagesByTool[tool.id] || '',
      statusId: String(tool.statusId),
    });
    setEditingTool(tool);
    setShowAgregarModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const dailyPrice = Number(formData.dailyPrice);
    const totalQuantity = Number(formData.totalQuantity);
    const availableQuantity = editingTool ? Number(formData.availableQuantity) : totalQuantity;
    const categoryId = Number(formData.categoryId);

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Nombre y descripción son obligatorios.');
      return;
    }

    if (!categoryId) {
      setError('Debes seleccionar una categoría.');
      return;
    }

    if (Number.isNaN(dailyPrice) || dailyPrice <= 0) {
      setError('El precio diario debe ser mayor a 0.');
      return;
    }

    if (Number.isNaN(totalQuantity) || totalQuantity <= 0) {
      setError('La cantidad total debe ser mayor a 0.');
      return;
    }

    if (Number.isNaN(availableQuantity) || availableQuantity < 0 || availableQuantity > totalQuantity) {
      setError('La cantidad disponible debe ser entre 0 y la cantidad total.');
      return;
    }

    try {
      setLoading(true);
      if (editingTool) {
        const statusId = Number(formData.statusId || editingTool.statusId);
        const updated = await updateTool(editingTool.id, {
          name: formData.name,
          description: formData.description,
          dailyPrice,
          totalQuantity,
          availableQuantity,
          statusId,
          supplierId: editingTool.supplierId,
          categoryId,
        });
        setTools((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast.success('Herramienta actualizada correctamente.');
      } else {
        const created = await createTool({
          name: formData.name,
          description: formData.description,
          dailyPrice,
          totalQuantity,
          availableQuantity,
          categoryId,
        });
        setTools((prev) => [created, ...prev]);
        localStorage.setItem(SUPPLIER_ID_KEY, String(created.supplierId));
        toast.success('Herramienta creada con estado AVAILABLE.');
        if (formData.imageUrl.trim()) {
          try {
            const image = await createToolImage({
              toolId: created.id,
              image_url: formData.imageUrl.trim(),
            });
            const rawUrl = image.image_url || (image as any).imageUrl || (image as any).url;
            setImagesByTool((prev) => ({ ...prev, [created.id]: resolveImageUrl(rawUrl) }));
          } catch {
            toast.error('La herramienta se creó, pero la imagen no pudo guardarse.');
          }
        }
      }
      setShowAgregarModal(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar la herramienta.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId: number) => {
    try {
      await deleteTool(toolId);
      setTools((prev) => prev.filter((tool) => tool.id !== toolId));
      toast.success('Herramienta eliminada correctamente.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'No se pudo eliminar la herramienta.');
    }
  };

  const supplierWarning = filters.onlyMine && !supplierId;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#3d5a5a]">Mi Inventario</h1>
          <p className="text-gray-600 mt-1">Gestiona tus herramientas disponibles</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#7fb3b0] hover:bg-[#6da39f]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Herramienta
        </Button>
      </div>

      {(error || supplierWarning) && (
        <Alert className="border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'No se pudo identificar tu proveedor. Se muestran todas las herramientas.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
          <CardDescription>Aplica filtros por categoría y disponibilidad.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Categoría</Label>
              <Select
                value={filters.categoryId}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger className="focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]" style={{ backgroundColor: "white", borderColor: "#2a4644" }}>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#2a4644]">
                  <SelectItem className="focus:bg-gray-100 focus:text-gray-900" value="all">
                    Todas
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={String(category.id)}
                      className="focus:bg-gray-100 focus:text-gray-900"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Estado</Label>
              <Select
                value={filters.statusName}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, statusName: value }))}
              >
                <SelectTrigger className="focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]" style={{ backgroundColor: "white", borderColor: "#2a4644" }}>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="AVAILABLE">Disponible</SelectItem>
                  <SelectItem value="UNAVAILABLE">No disponible</SelectItem>
                  <SelectItem value="UNDER_REPAIR">En reparación</SelectItem>
                  <SelectItem value="RENTED">Alquilada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Total Herramientas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTools.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#7fb3b0]">
              {filteredTools.filter((tool) => normalizeToolStatus(statusNameById[tool.statusId]) === 'AVAILABLE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">No Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3d5a5a]">
              {filteredTools.filter((tool) => normalizeToolStatus(statusNameById[tool.statusId]) === 'UNAVAILABLE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">En ReparaciÃ³n</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredTools.filter((tool) => normalizeToolStatus(statusNameById[tool.statusId]) === 'UNDER_REPAIR').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <p className="text-sm text-gray-500">Cargando herramientas...</p>
      )}

      {!loading && filteredTools.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            No hay herramientas que coincidan con los filtros actuales.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const statusLabel = normalizeToolStatus(statusNameById[tool.statusId]);
          return (
            <Card key={tool.id}>
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={imagesByTool[tool.id] || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop'}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.dataset.fallback !== 'true') {
                      target.dataset.fallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop';
                    }
                  }}
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <ToolStatusBadge status={statusLabel} />
                </div>
                <CardDescription>{categoryNameById[tool.categoryId] || 'Sin categoría'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>

                  <div className="flex justify-between items-center py-2 border-t">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span className="text-sm font-medium">
                      {tool.availableQuantity} / {tool.totalQuantity} disponibles
                    </span>
                  </div>

                  <div className="pt-2 border-t text-center">
                    <p className="text-xs text-gray-500">Precio por día</p>
                    <p className="text-lg font-bold text-[#7fb3b0]">${tool.dailyPrice}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(tool)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(tool.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showAgregarModal} onOpenChange={setShowAgregarModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTool ? 'Editar herramienta' : 'Agregar herramienta'}</DialogTitle>
            <DialogDescription>
              {editingTool
                ? 'Actualiza la información de tu herramienta.'
                : 'Registra una nueva herramienta en tu inventario.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="!bg-white !border-[#2a4644] focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]" style={{ backgroundColor: "white", borderColor: "#2a4644" }}>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#2a4644]">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                        className="focus:bg-gray-100 focus:text-gray-900"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="!bg-white !border-[#2a4644] focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]"
                required
              />
            </div>

            <div className={"grid grid-cols-1 gap-4 " + (editingTool ? "md:grid-cols-3" : "md:grid-cols-2")}>
              <div className="space-y-2">
                <Label>Precio diario</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dailyPrice: e.target.value }))}
                  className="!bg-white !border-[#2a4644] focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{editingTool ? 'Cantidad total' : 'Cantidad inicial'}</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.totalQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      totalQuantity: value,
                      availableQuantity: editingTool ? prev.availableQuantity : value,
                    }));
                  }}
                  className="!bg-white !border-[#2a4644] focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]"
                  required
                />
              </div>
              {editingTool && (
                <div className="space-y-2">
                  <Label>Cantidad disponible</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, availableQuantity: e.target.value }))}
                    className="!bg-white !border-[#2a4644] focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]"
                    required
                  />
                </div>
              )}
            </div>

            {editingTool && (
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.statusId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, statusId: value }))}
                >
                  <SelectTrigger className="focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]" style={{ backgroundColor: "white", borderColor: "#2a4644" }}>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>URL de imagen (opcional)</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="!bg-white !border-[#2a4644] focus-visible:!ring-[#2a4644] focus-visible:!border-[#2a4644]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAgregarModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#7fb3b0] hover:bg-[#6da39f]" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}






