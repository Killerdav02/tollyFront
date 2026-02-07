# Mapa de Pantallas Afectadas y Cambios

## 🗺️ Resumen Visual de Cambios por Pantalla

### 1️⃣ **Cliente: Mis Reservas** (`/cliente/reservas`)

#### **Secciones Actualizadas:**

**📦 Nueva: "Devoluciones en Proceso"**
- Card destacado con borde naranja
- Muestra devoluciones con estado PENDING o SENT
- Badge de estado (ReturnStatusBadge)
- Botón "Ver Detalles" → Dialog con timeline
- Botón "Confirmar Envío" → Solo visible si PENDING y es cliente dueño

**✅ "Reservas Activas"**
- Card con borde verde
- Muestra CONFIRMED e IN_PROGRESS
- Botón "Crear Devolución" → Abre dialog de creación
- Lista detallada de herramientas con cantidades

**📊 "Historial de Reservas"**
- Tabla con badges actualizados (ReservationStatusBadge)
- Columna "Herramientas" ahora muestra lista con cantidades
- Botón "Devolver" solo si estado permite (CONFIRMED/IN_PROGRESS)
- Mensajes de restricción para CANCELLED/FINISHED/IN_INCIDENT

#### **Nuevos Dialogs:**

**Dialog: "Crear Devolución"**
```
├── Alert informativo (validaciones)
├── Por cada herramienta:
│   ├── Nombre y cantidad reservada
│   ├── Input cantidad a devolver (max = reservado)
│   ├── Select condición física
│   └── Textarea notas
├── Textarea notas generales
└── Botones: Cancelar / Crear
```

**Dialog: "Ver Detalles de Devolución"**
```
├── Timeline visual (ReturnTimeline)
├── Lista de herramientas con:
│   ├── Cantidad: X de Y
│   ├── Condición reportada
│   └── Notas
└── Botón: Cerrar
```

---

### 2️⃣ **Proveedor: Gestión de Reservas** (`/proveedor/reservas`)

#### **Secciones Actualizadas:**

**📨 Nueva: "Devoluciones por Recibir"**
- Card destacado con borde azul
- Alert informativo (instrucciones de verificación)
- Muestra devoluciones con estado SENT
- Badge de estado (ReturnStatusBadge)
- Botón "Ver Detalles" → Dialog para recibir
- Botón rápido "Recibir OK" → Confirma recepción

**⏰ "Reservas Pendientes"**
- Muestra detalles de herramientas (con cantidades)
- Botones Aceptar/Rechazar

**📋 "Todas las Reservas"**
- Tabla con badges actualizados
- Columna "Herramientas" con lista y cantidades

#### **Nuevo Dialog:**

**Dialog: "Recibir Devolución"**
```
├── Timeline visual (estado actual)
├── Lista de herramientas devueltas:
│   ├── Nombre y cantidad
│   ├── Condición reportada por cliente (destacada)
│   └── Notas del cliente
├── Alert: consecuencias de reportar daño
├── Textarea: Notas sobre daño (obligatorio si se reporta)
└── Botones:
    ├── Cancelar
    ├── Reportar Daño (rojo, requiere notas)
    └── Recibir OK (verde)
```

---

### 3️⃣ **Proveedor: Inventario** (`/proveedor/inventario`)

#### **Cambios en Cards de Herramientas:**

**Antes:**
```
[Imagen]
Nombre
Categoría
Badge: Disponible/En uso
Condición: Excelente
Precio: $25
[Editar] [Eliminar]
```

**Después:**
```
[Imagen]
Nombre                    [Badge: AVAILABLE/RENTED/UNDER_REPAIR]
Categoría
Stock: 4 / 5 disponibles  ← NUEVO
Condición: Excelente
Precio: $25
[Editar] [Eliminar ⚠️ disabled si RENTED]
"No se puede eliminar mientras está alquilada" ← NUEVO
```

#### **Dialog "Agregar Herramienta":**

**Cambios:**
- ✅ Alert informativo: "Estado AVAILABLE automático"
- ✅ Campo eliminado: Selector de estado (siempre AVAILABLE)
- ✅ Campo nuevo: "Cantidad Total en Inventario"
- ✅ Campo renombrado: "Estado" → "Condición Física"

**Estructura Actualizada:**
```
├── Alert: Estado AVAILABLE automático
├── Input: Nombre
├── Grid 2 columnas:
│   ├── Select: Categoría
│   └── Select: Condición Física (excelente/bueno/regular)
├── Textarea: Descripción
├── Grid 2 columnas:
│   ├── Input: Precio por día
│   └── Input: Cantidad Total ← NUEVO
├── Input: URL imagen (opcional)
└── Botones: Cancelar / Agregar
```

#### **Stats Actualizadas:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total: 6    │ Disponibles │ En Alquiler │ En Reparación│
│             │ (AVAILABLE) │ (RENTED)    │(UNDER_REPAIR)│
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

### 4️⃣ **Cliente: Explorar Herramientas** (`/cliente/explorar`)

#### **Cambios en Cards de Herramientas:**

**Antes:**
```
[Imagen]
Nombre                      [✓/✗ Icono]
Descripción
[Badge: Categoría]  [Badge: No disponible]
$25 por día              [Reservar]
```

**Después:**
```
[Imagen]
Nombre                      [✓/✗ Icono]
Descripción
[Badge: Categoría]  [4 disponibles] ← NUEVO
                    [Badge: Sin stock] ← si = 0
$25 por día              [Reservar]
```

#### **Filtros Actualizados:**
- "Solo disponibles" ahora verifica `availableQuantity > 0`
- (antes verificaba `disponible` boolean)

---

## 🎨 Componentes Visuales Nuevos

### Badge de Estados - ToolStatusBadge
```
AVAILABLE     → [Verde] "Disponible"
RENTED        → [Azul]  "Alquilada"  
UNDER_REPAIR  → [Naranja] "En Reparación"
```

### Badge de Estados - ReservationStatusBadge
```
PENDING       → [Amarillo] "Pendiente"
CONFIRMED     → [Azul] "Confirmada"
IN_PROGRESS   → [Morado] "En Curso"
FINISHED      → [Verde] "Finalizada"
CANCELLED     → [Rojo] "Cancelada"
IN_INCIDENT   → [Rojo oscuro] "Con Incidente"
```

### Badge de Estados - ReturnStatusBadge
```
PENDING   → [Amarillo] "Creada"
SENT      → [Azul] "Enviada"
RECEIVED  → [Verde] "Recibida OK"
DAMAGED   → [Rojo] "Con Daño"
```

### Timeline de Devolución
```
○ Devolución Creada     [⏰ Clock]
   07/02/2026 10:30
   "Esperando confirmación de envío..."
│
● Envío Confirmado      [📦 Package]
   07/02/2026 14:20
   "Esperando recepción..."
│
✓ Recibido OK          [✓ PackageCheck] Verde
   08/02/2026 09:15
```

Si hay daño:
```
⚠ Recibido con Daño    [⚠ AlertTriangle] Rojo
   "Se reportó daño. Reserva pasó a incidente."
```

---

## 🔐 Restricciones Visuales Implementadas

### Por Rol y Propiedad

| Acción | Visible Para | Habilitado Si |
|--------|-------------|---------------|
| Crear Devolución | Cliente | Reserva propia + (CONFIRMED \| IN_PROGRESS) |
| Confirmar Envío | Cliente | Devolución propia + PENDING |
| Recibir Devolución | Proveedor/Admin | Devolución propia + SENT |
| Editar Reserva | Todos | Estado ≠ CANCELLED/FINISHED/IN_INCIDENT |
| Eliminar Herramienta | Proveedor | Estado ≠ RENTED |

### Mensajes de Restricción

**En Acciones Bloqueadas:**
```html
<Button disabled>
  Acción
</Button>
<p className="text-xs text-gray-500 text-center">
  Mensaje explicativo de por qué está bloqueada
</p>
```

**Ejemplos:**
- "No se puede eliminar mientras está alquilada"
- "No puedes modificar porque la reserva está finalizada"
- "Solo disponible para el cliente dueño"

---

## 📊 Datos Mostrados por Pantalla

### Cliente: Mis Reservas

**Stats (Cards superiores):**
- Total Reservas
- Activas (CONFIRMED + IN_PROGRESS)
- Finalizadas (FINISHED)
- Total Gastado

**Devoluciones en Proceso:**
- ID devolución (primeros 8 chars)
- Estado badge
- ID reserva
- Lista de herramientas
- Mensaje de estado
- Botones según estado

**Reservas Activas:**
- ID reserva
- Estado badge
- Lista: Herramienta x cantidad - subtotal
- Periodo fechas
- Total
- Botón "Crear Devolución"

**Historial:**
- ID reserva
- Lista de herramientas (nombre x cantidad)
- Periodo
- Total
- Estado badge
- Acciones según estado

### Proveedor: Gestión de Reservas

**Stats:**
- Total Reservas
- Pendientes (PENDING)
- Activas (CONFIRMED + IN_PROGRESS)
- Finalizadas (FINISHED)

**Devoluciones por Recibir:**
- ID devolución
- Estado badge
- Cliente nombre
- Lista: Herramienta (x cantidad)
- Mensaje de estado
- Botones "Ver Detalles" y "Recibir OK"

**Reservas Pendientes:**
- ID reserva
- Estado badge
- Lista herramientas x cantidad
- Cliente
- Periodo
- Total
- Botones Aceptar/Rechazar

### Proveedor: Inventario

**Stats:**
- Total Herramientas
- Disponibles (status=AVAILABLE)
- En Alquiler (status=RENTED)
- En Reparación (status=UNDER_REPAIR)

**Por Herramienta:**
- Imagen
- Nombre + Badge estado
- Categoría
- Stock: X / Y disponibles
- Condición física
- Precio
- Botones Editar/Eliminar

### Cliente: Explorar

**Por Herramienta:**
- Imagen
- Nombre + Icono ✓/✗
- Descripción
- Badge categoría
- Stock disponible o "Sin stock"
- Precio
- Botón Reservar

---

## ✅ Checklist Visual Completado

- [x] Badges de estado con colores consistentes
- [x] Timeline visual de devoluciones
- [x] Mensajes claros de restricción
- [x] Botones habilitados/deshabilitados según permisos
- [x] Stats actualizadas con estados correctos
- [x] Información de stock visible
- [x] Alerts informativos contextual
- [x] Dialogs con validaciones en tiempo real
- [x] Toasts de confirmación descriptivos
- [x] Iconos representativos para cada acción
- [x] Responsive design mantenido
- [x] Accesibilidad (labels, disabled states)

---

**Última actualización**: 7 de febrero de 2026
