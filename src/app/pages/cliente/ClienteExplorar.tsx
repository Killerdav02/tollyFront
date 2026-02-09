import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
// import { herramientas } from "@/app/data/mockData";
import apiClient from "@/api/apiClient";
import type { Herramienta } from "@/app/data/mockData";
import { useEffect } from "react";
import {
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../../app/context/CartContext";
import { useAuth } from "@/auth/useAuth";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  Sheet as CartSheet,
  SheetContent as CartSheetContent,
  SheetHeader as CartSheetHeader,
  SheetTitle as CartSheetTitle,
  SheetTrigger as CartSheetTrigger,
} from "@/app/components/ui/sheet";
export function ClienteExplorar() {
  // Estado para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmDates, setConfirmDates] = useState({ inicio: "", fin: "" });
  const [isLoadingReserva, setIsLoadingReserva] = useState(false);
  // Estado para herramientas desde el backend
  type HerramientaConImagenes = Herramienta & {
    imagenes: string[];
    imagen?: string;
    categoryId?: string;
  };

  const [herramientas, setHerramientas] = useState<HerramientaConImagenes[]>(
    [],
  );
  const [loadingHerramientas, setLoadingHerramientas] = useState(true);
  const [errorHerramientas, setErrorHerramientas] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [selectedTool, setSelectedTool] = useState<
    (typeof herramientas)[0] | null
  >(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addToCartData, setAddToCartData] = useState({
    quantity: 1,
    fechaInicio: "",
    fechaFin: "",
  });
  const { addItem, items, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  // Estado para categorías desde el backend
  const [categorias, setCategorias] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCategorias(true);
    apiClient
      .get("/categories")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategorias(res.data);
          setErrorCategorias(null);
        } else {
          setErrorCategorias("Formato inesperado de categorías");
        }
      })
      .catch(() => setErrorCategorias("No se pudieron cargar las categorías"))
      .finally(() => setLoadingCategorias(false));
  }, []);

  // Cargar herramientas y sus imágenes al montar
  const resolveImageUrl = (url: string) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    if (url.startsWith("/")) {
      return url;
    }
    const base = import.meta.env.VITE_API_URL || "";
    if (!base) return `/${url}`;
    return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  useEffect(() => {
    const fetchTools = async () => {
      setLoadingHerramientas(true);
      const params = new URLSearchParams();
      const isDisponiblesCategoria = filtroCategoria === "disponibles";

      if (soloDisponibles || isDisponiblesCategoria) {
        params.append("availableOnly", "true");
      }
      if (filtroCategoria !== "todas" && !isDisponiblesCategoria) {
        params.append("categoryId", filtroCategoria);
      }

      try {
        const res = await apiClient.get(
          params.toString() ? `/tools?${params.toString()}` : "/tools",
        );
        const rawTools = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.content)
            ? res.data.content
            : [];
        const baseHerramientas: HerramientaConImagenes[] = rawTools.map(
          (h: any) => ({
            id: h.id,
            nombre: h.name,
            descripcion: h.description,
            precioDia: h.dailyPrice,
            totalQuantity: h.totalQuantity,
            availableQuantity: h.availableQuantity,
            categoryId: String(h.categoryId || h.category?.id || ""),
            categoria: h.categoryName || h.category?.name || "",
            status: h.statusName || h.status || "AVAILABLE",
            proveedorId: String(h.supplierId || h.proveedorId || ""),
            proveedorNombre: h.supplierName || h.proveedorNombre || "",
            imagenes: [],
            imagen: "",
          }),
        );

        // Para cada herramienta, buscar todas sus imágenes
        const herramientasConImagenes = await Promise.all(
          baseHerramientas.map(async (herramienta) => {
            try {
              const imgRes = await apiClient.get(
                `/tools/${herramienta.id}/images`,
              );
              if (Array.isArray(imgRes.data) && imgRes.data.length > 0) {
                const imageUrls = await Promise.all(
                  imgRes.data.map(async (img: any) => {
                    const directUrl =
                      img.image_url || img.imageUrl || img.url || "";
                    if (directUrl) {
                      return resolveImageUrl(directUrl);
                    }
                    const imageId = img.id || img.imageId;
                    if (!imageId) return "";
                    try {
                      const imageRes = await apiClient.get(
                        `/tool-images/${imageId}`,
                        { responseType: "blob" },
                      );
                      if (imageRes.data instanceof Blob) {
                        return URL.createObjectURL(imageRes.data);
                      }
                      return resolveImageUrl(
                        imageRes.data?.image_url ||
                          imageRes.data?.imageUrl ||
                          imageRes.data?.url ||
                          "",
                      );
                    } catch (error) {
                      return "";
                    }
                  }),
                );
                herramienta.imagenes = imageUrls.filter(Boolean);
              } else {
                herramienta.imagenes = [];
              }
            } catch (e) {
              herramienta.imagenes = [];
            }
            herramienta.imagen = herramienta.imagenes[0] || "";
            return herramienta;
          }),
        );
        setHerramientas(herramientasConImagenes);
        console.log("Herramientas con imágenes:", herramientasConImagenes);
        setErrorHerramientas(null);
      } catch (error) {
        setErrorHerramientas("No se pudieron cargar las herramientas");
      } finally {
        setLoadingHerramientas(false);
      }
    };

    fetchTools();
  }, [filtroCategoria, soloDisponibles]);

  // Contar herramientas por categoría (mock)
  const categoriaCounts = categorias.reduce(
    (acc, cat) => {
      const catId = String(cat.id);
      acc[catId] = herramientas.filter((h) => h.categoryId === catId).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const getCategoriaNombre = (herramienta: HerramientaConImagenes) => {
    if (herramienta.categoria) return herramienta.categoria;
    if (!herramienta.categoryId) return "";
    return (
      categorias.find((cat) => String(cat.id) === herramienta.categoryId)
        ?.name || ""
    );
  };

  const filteredHerramientas = herramientas.filter((h) => {
    const matchSearch =
      h.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const isDisponiblesCategoria = filtroCategoria === "disponibles";
    const matchCategoria =
      filtroCategoria === "todas" ||
      isDisponiblesCategoria ||
      h.categoryId === filtroCategoria ||
      getCategoriaNombre(h) ===
        categorias.find((cat) => String(cat.id) === filtroCategoria)?.name;
    const matchDisponible =
      !(soloDisponibles || isDisponiblesCategoria) || h.availableQuantity > 0;
    return matchSearch && matchCategoria && matchDisponible;
  });

  // Componente de filtros reutilizable
  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <select
          id="categoria"
          value={filtroCategoria}
          onChange={(e) => {
            setFiltroCategoria(e.target.value);
            setSoloDisponibles(false);
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          disabled={loadingCategorias || !!errorCategorias}
        >
          <option value="todas">Todas</option>
          <option value="disponibles">Disponibles</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
              {categoriaCounts[String(cat.id)] !== undefined
                ? ` (${categoriaCounts[String(cat.id)]})`
                : ""}
            </option>
          ))}
        </select>
        {errorCategorias && (
          <p className="mt-2 text-xs text-red-600">{errorCategorias}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative">
      {/* Modal Confirmar Reserva */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              Las fechas se aplicarán a todos los items del carrito
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 rounded p-3 mb-4">
            <div className="font-semibold mb-2">Items en carrito:</div>
            {items.map((item) => (
              <div
                key={item.herramienta.id}
                className="flex justify-between text-sm"
              >
                <span>{item.herramienta.nombre}</span>
                <span className="font-bold">x{item.quantity}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoadingReserva(true);
              try {
                // 1. Crear reserva
                const dias =
                  Math.ceil(
                    (new Date(confirmDates.fin).getTime() -
                      new Date(confirmDates.inicio).getTime()) /
                      (1000 * 3600 * 24),
                  ) + 1;
                const totalPrice = items.reduce(
                  (sum, item) =>
                    sum + item.herramienta.precioDia * item.quantity * dias,
                  0,
                );
                const reservaPayload = {
                  startDate: confirmDates.inicio,
                  endDate: confirmDates.fin,
                  totalPrice,
                  statusName: "IN_PROGRESS",
                };
                console.log("Enviando reserva:", reservaPayload);
                const reservaRes = await apiClient.post(
                  "/api/reservations",
                  reservaPayload,
                );
                console.log("Respuesta reserva:", reservaRes.data);
                const reservaId = reservaRes.data?.id;
                if (!reservaId) {
                  throw new Error("No se recibio el id de la reserva");
                }
                // 2. Crear detalles
                for (const item of items) {
                  const detallePayload = {
                    toolId: item.herramienta.id,
                    reservationId: reservaId,
                    quantity: item.quantity,
                  };
                  console.log("Enviando detalle:", detallePayload);
                  const detalleRes = await apiClient.post(
                    "/api/reservations/details",
                    detallePayload,
                  );
                  console.log("Respuesta detalle:", detalleRes.data);
                }
                toast.success("Reserva y detalles creados correctamente");
                clearCart();
                setShowConfirmModal(false);
              } catch (err) {
                // Mostrar error detallado
                if (err.response) {
                  console.error("Error respuesta API:", err.response.data);
                  toast.error(
                    "Error API: " + JSON.stringify(err.response.data),
                  );
                } else {
                  console.error("Error desconocido:", err);
                  toast.error("Error desconocido al crear la reserva");
                }
              } finally {
                setIsLoadingReserva(false);
              }
            }}
            className="space-y-4"
          >
            <Label htmlFor="inicio">Fecha de inicio</Label>
            <Input
              id="inicio"
              type="date"
              value={confirmDates.inicio}
              onChange={(e) =>
                setConfirmDates({ ...confirmDates, inicio: e.target.value })
              }
              required
              className="bg-gray-200"
            />
            <Label htmlFor="fin">Fecha de fin</Label>
            <Input
              id="fin"
              type="date"
              value={confirmDates.fin}
              onChange={(e) =>
                setConfirmDates({ ...confirmDates, fin: e.target.value })
              }
              required
              className="bg-gray-200"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoadingReserva || items.length === 0}
              >
                {isLoadingReserva ? "Guardando..." : "Confirmar Reserva"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Solo se deja el botón de carrito de la barra superior, se elimina el botón verde del contenido */}

      {/* Sidebar del carrito */}
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <CartSheetContent side="right" className="w-[350px] max-w-full">
          <CartSheetHeader>
            <CartSheetTitle>Carrito</CartSheetTitle>
          </CartSheetHeader>
          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center">
                No hay herramientas en el carrito.
              </p>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.herramienta.id}
                    className="flex items-center gap-3 border-b pb-2"
                  >
                    {item.herramienta.imagen && (
                      <ImageWithFallback
                        src={item.herramienta.imagen}
                        alt={item.herramienta.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">
                        {item.herramienta.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 text-lg font-bold px-2"
                      onClick={() => removeItem(item.herramienta.id)}
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </div>
        </CartSheetContent>
      </CartSheet>
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Todas las Herramientas
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                {filteredHerramientas.length}{" "}
                {filteredHerramientas.length === 1
                  ? "herramienta encontrada"
                  : "herramientas encontradas"}
              </p>
            </div>
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
            <Card
              key={herramienta.id}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-full h-48 sm:h-56 bg-white flex items-center justify-center overflow-hidden">
                {herramienta.imagenes && herramienta.imagenes.length > 0 ? (
                  <ImageWithFallback
                    src={herramienta.imagenes[0]}
                    alt={herramienta.nombre}
                    className="object-cover w-full h-full"
                    style={{ display: "block" }}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Sin imágenes</span>
                )}
              </div>
              <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
                <div className="space-y-3 flex-1 flex flex-col">
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
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[32px] md:min-h-[40px]">
                    {herramienta.descripcion}
                  </p>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-600 text-xs"
                    >
                      {getCategoriaNombre(herramienta)}
                    </Badge>
                    {herramienta.availableQuantity === 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        Sin stock
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-600">
                        {herramienta.availableQuantity} disponible
                        {herramienta.availableQuantity > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="pt-3 border-t mt-auto">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">
                          ${herramienta.precioDia}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          por día
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            disabled={herramienta.availableQuantity === 0}
                            onClick={() => {
                              setSelectedTool(herramienta);
                              setAddToCartData({
                                quantity: 1,
                                fechaInicio: "",
                                fechaFin: "",
                              });
                            }}
                            className="text-xs md:text-sm bg-[#3d5a5a] hover:bg-[#2a3e3c] text-white"
                          >
                            {herramienta.availableQuantity > 0 ? (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Carrito
                              </>
                            ) : (
                              "No disponible"
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-lg md:text-xl">
                              Añadir {herramienta.nombre} al carrito
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                              Selecciona la cantidad y las fechas
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (addToCartData.quantity <= 0) {
                                toast.error("La cantidad debe ser mayor a 0");
                                return;
                              }
                              addItem(
                                herramienta,
                                addToCartData.quantity,
                                "", // fechaInicio vacía
                                "", // fechaFin vacía
                              );
                              toast.success(
                                `${herramienta.nombre} agregado al carrito`,
                              );
                              setSelectedTool(null);
                            }}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="cantidad" className="text-sm">
                                Cantidad
                              </Label>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAddToCartData({
                                      ...addToCartData,
                                      quantity: Math.max(
                                        1,
                                        addToCartData.quantity - 1,
                                      ),
                                    })
                                  }
                                  className="bg-[#e8f2f1] hover:bg-[#d0e8e6] text-[#3d5a5a] px-3 py-2 rounded text-sm font-bold transition-colors"
                                >
                                  −
                                </button>
                                <Input
                                  id="cantidad"
                                  type="number"
                                  min="1"
                                  max={herramienta.availableQuantity}
                                  value={addToCartData.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    setAddToCartData({
                                      ...addToCartData,
                                      quantity: Math.min(
                                        herramienta.availableQuantity,
                                        Math.max(1, val),
                                      ),
                                    });
                                  }}
                                  className="text-center text-sm bg-[#3d5a5a] text-white border-2 border-[#7fb3b0] placeholder-gray-400"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setAddToCartData({
                                      ...addToCartData,
                                      quantity: Math.min(
                                        herramienta.availableQuantity,
                                        addToCartData.quantity + 1,
                                      ),
                                    })
                                  }
                                  className="bg-[#e8f2f1] hover:bg-[#d0e8e6] text-[#3d5a5a] px-3 py-2 rounded text-sm font-bold transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Máximo: {herramienta.availableQuantity}{" "}
                                disponible
                                {herramienta.availableQuantity > 1 ? "s" : ""}
                              </p>
                            </div>
                            {addToCartData.fechaInicio &&
                              addToCartData.fechaFin && (
                                <div className="bg-gradient-to-r from-[#e8f2f1] to-[#f0f9f8] p-4 rounded-lg border-l-4 border-[#7fb3b0] shadow-sm">
                                  {(() => {
                                    const inicio = new Date(
                                      addToCartData.fechaInicio,
                                    );
                                    const fin = new Date(
                                      addToCartData.fechaFin,
                                    );
                                    const diasRaw =
                                      Math.ceil(
                                        (fin.getTime() - inicio.getTime()) /
                                          (1000 * 3600 * 24),
                                      ) + 1;
                                    const precioDia = Number(
                                      herramienta.precioDia ?? 0,
                                    );
                                    const cantidad = Number(
                                      addToCartData.quantity ?? 0,
                                    );
                                    const dias =
                                      Number.isFinite(diasRaw) && diasRaw > 0
                                        ? diasRaw
                                        : 0;
                                    const subtotalRaw =
                                      dias * precioDia * cantidad;
                                    const subtotal = Number.isFinite(
                                      subtotalRaw,
                                    )
                                      ? subtotalRaw
                                      : 0;
                                    return (
                                      <div className="space-y-2">
                                        <p className="text-xs md:text-sm text-gray-600">
                                          {dias} día(s) × ${precioDia} ×{" "}
                                          {cantidad} unidad
                                          {cantidad > 1 ? "es" : ""}
                                        </p>
                                        <p className="text-xl md:text-2xl font-bold text-blue-600">
                                          Subtotal: ${subtotal}
                                        </p>
                                      </div>
                                    );
                                  })()}
                                </div>
                              )}
                            <Button
                              type="submit"
                              className="w-full text-sm md:text-base bg-[#3d5a5a] hover:bg-[#2a3e3c] text-white font-semibold"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Añadir al Carrito
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
              <p className="text-gray-500 text-sm md:text-base">
                No se encontraron herramientas con los filtros aplicados.
              </p>
              <Button
                variant="outline"
                className="mt-4 text-sm md:text-base"
                onClick={() => {
                  setSearchTerm("");
                  setFiltroCategoria("todas");
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
