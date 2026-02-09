import React, { useState } from "react";
import apiClient from "@/api/apiClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/app/components/ui/input";

export function AdminHerramientas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);

  const [herramientas, setHerramientas] = useState<any[]>([]);
  const [loadingHerramientas, setLoadingHerramientas] = useState(false);

  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState<string | null>(null);
  const [successCategoria, setSuccessCategoria] = useState<string | null>(null);

  const norm = (v: any) => (v === null || v === undefined ? "" : String(v));

  const getToolCategoryId = (h: any) =>
    norm(h?.category?.id ?? h?.categoryId ?? h?.category_id);

  const getToolCategoryName = (h: any) => {
    const embedded = h?.category?.name;
    if (typeof embedded === "string" && embedded.trim()) return embedded;

    const id = getToolCategoryId(h);
    const found = categorias.find((c) => norm(c?.id) === id);
    return typeof found?.name === "string" ? found.name : "";
  };

  // Cargar categorías desde la API
  React.useEffect(() => {
    setLoadingCategorias(true);
    apiClient
      .get("/categories")
      .then((res) => {
        setCategorias(Array.isArray(res.data) ? res.data : []);
        setErrorCategorias(null);
      })
      .catch((e) => {
        setErrorCategorias(
          e?.response?.data?.message ||
            e?.message ||
            "Error al cargar categorías"
        );
      })
      .finally(() => setLoadingCategorias(false));
  }, []);

  // Cargar herramientas desde la API (si tu backend soporta categoryId por query)
  React.useEffect(() => {
    setLoadingHerramientas(true);
    let url = "/tools";
    if (filtroCategoria !== "todas") {
      url += `?categoryId=${encodeURIComponent(filtroCategoria)}`;
    }

    apiClient
      .get(url)
      .then((res) => {
        setHerramientas(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setHerramientas([]);
      })
      .finally(() => setLoadingHerramientas(false));
  }, [filtroCategoria]);

  const handleCrearCategoria = async () => {
    if (!nuevaCategoria.trim()) {
      setErrorCategoria("El nombre no puede estar vacío");
      return;
    }
    setLoadingCategoria(true);
    setErrorCategoria(null);
    setSuccessCategoria(null);

    try {
      await apiClient.post("/categories", { name: nuevaCategoria });
      setSuccessCategoria("Categoría creada exitosamente");
      setNuevaCategoria("");

      // ✅ recargar categorías para que aparezca en el select sin refrescar
      setLoadingCategorias(true);
      apiClient
        .get("/categories")
        .then((res) => {
          setCategorias(Array.isArray(res.data) ? res.data : []);
          setErrorCategorias(null);
        })
        .catch((e) => {
          setErrorCategorias(
            e?.response?.data?.message ||
              e?.message ||
              "Error al cargar categorías"
          );
        })
        .finally(() => setLoadingCategorias(false));
    } catch (e: any) {
      setErrorCategoria(
        e?.response?.data?.message || e?.message || "Error al crear categoría"
      );
    } finally {
      setLoadingCategoria(false);
    }
  };

  // ✅ Filtro local robusto (soporta category.id o categoryId/category_id)
  const filteredHerramientas = herramientas.filter((h) => {
    const nombre = typeof h?.name === "string" ? h.name : "";
    const categoriaNombre = getToolCategoryName(h);
    const categoriaId = getToolCategoryId(h);

    const term = searchTerm.toLowerCase();
    const matchSearch =
      nombre.toLowerCase().includes(term) ||
      categoriaNombre.toLowerCase().includes(term);

    const matchCategoria =
      filtroCategoria === "todas" || norm(filtroCategoria) === categoriaId;

    return matchSearch && matchCategoria;
  });

  // Estado por statusId
  const getEstadoBadgeColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "bg-green-100 text-green-800"; // Disponible
      case 2:
        return "bg-blue-100 text-blue-800"; // Alquilada
      case 3:
        return "bg-orange-100 text-orange-800"; // En Reparación
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoLabel = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Disponible";
      case 2:
        return "Alquilada";
      case 3:
        return "En Reparación";
      default:
        return String(statusId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3d5a5a]">
            Gestión de Herramientas
          </h1>
          <p className="text-gray-600 mt-1">
            Administra el inventario de equipos disponibles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              errorCategoria === "Nombre vacío"
                ? errorCategoria
                : successCategoria === "Categoría creada "
                ? successCategoria
                : "Nombre de categoría"
            }
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
            className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errorCategoria === "El nombre no puede estar vacío"
                ? "placeholder-red-600 border-red-400"
                : successCategoria === "Categoría creada exitosamente"
                ? "placeholder-green-600 border-green-400"
                : ""
            }`}
            disabled={loadingCategoria}
          />

          <Button
            className="bg-[#7fb3b0] hover:bg-[#6da39f]"
            onClick={handleCrearCategoria}
            disabled={loadingCategoria}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        {errorCategoria && errorCategoria !== "El nombre no puede estar vacío" && (
          <p className="text-xs text-red-600">{errorCategoria}</p>
        )}
        {successCategoria &&
          successCategoria !== "Categoría creada exitosamente" && (
            <p className="text-xs text-green-600">{successCategoria}</p>
          )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 w-full">
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
              disabled={loadingCategorias}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat: any) =>
                cat &&
                typeof cat === "object" &&
                cat.id !== undefined &&
                cat.name ? (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ) : null
              )}
            </select>

            {loadingCategorias && (
              <span className="text-xs text-gray-500">
                Cargando categorías...
              </span>
            )}
            {errorCategorias && (
              <span className="text-xs text-red-500">{errorCategorias}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {loadingHerramientas ? (
        <div className="py-12 text-center text-gray-500">
          Cargando herramientas...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHerramientas.map((herramienta) =>
              herramienta ? (
                <Card key={herramienta.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={herramienta.imageUrl}
                      alt={herramienta.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {herramienta.name}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {getToolCategoryName(herramienta)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {herramienta.description}
                      </p>

                      <div className="flex justify-between items-center py-2 border-t">
                        <span className="text-sm text-gray-500">Estado:</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getEstadoBadgeColor(
                            herramienta.statusId
                          )}`}
                        >
                          {getEstadoLabel(herramienta.statusId)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Proveedor:</span>
                        <span className="text-sm font-medium">
                          {herramienta?.supplier?.name ?? ""}
                        </span>
                      </div>

                      <div className="pt-2 border-t text-center">
                        <p className="text-xs text-gray-500">Precio por día</p>
                        <p className="text-lg font-bold text-blue-600">
                          $
                          {typeof herramienta.dailyPrice === "number"
                            ? herramienta.dailyPrice.toFixed(2)
                            : herramienta.dailyPrice}
                        </p>
                      </div>

                      <Button variant="outline" className="w-full">
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null
            )}
          </div>

          {filteredHerramientas.length === 0 && !loadingHerramientas && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  No se encontraron herramientas con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
