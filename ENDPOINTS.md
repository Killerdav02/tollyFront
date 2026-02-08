# Endpoints Reales del Sistema (según Controllers)

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `PUT /auth/change-password`

---

## Admin – Gestión de Usuarios
- `GET /admin/users/by-email`
- `POST /admin/users/clients`
- `POST /admin/users/suppliers`
- `PUT /admin/users/update`
- `GET /admin/users/list`
- `GET /admin/users/clients`
- `GET /admin/users/suppliers`
- `DELETE /admin/users/{userId}`

---

## Usuarios
- `GET /users`
- `PUT /users/{userId}/roles`

---

## Categorías
- `GET /categories`
- `GET /categories/{id}`
- `POST /categories`
- `PUT /categories/{id}`
- `DELETE /categories/{id}`

---

## Herramientas
- `GET /tools`  
  Filtros disponibles:
  - `availableOnly`
  - `categoryId`
  - `minPrice`
  - `maxPrice`
- `GET /tools/{id}`
- `POST /tools`
- `PUT /tools/{id}`
- `DELETE /tools/{id}`

---

## Imágenes de Herramientas
- `POST /tool-images`
- `GET /tools/{toolId}/images`
- `GET /tool-images/{id}`
- `DELETE /tool-images/{id}`

---

## Estados de Herramientas
- `GET /tool-statuses`
- `POST /tool-statuses`

---

## Reservas
- `POST /api/reservations`
- `GET /api/reservations/client/{clientId}`
- `PUT /api/reservations/{id}/cancel`
- `PUT /api/reservations/{id}/finish`
- `PUT /api/reservations/{id}/incident`
- `GET /api/reservations/status/{statusName}`

---

## Detalle de Reserva
- `POST /api/reservations/details`
- `GET /api/reservations/details/reservation/{reservationId}`
- `PUT /api/reservations/details/{detailId}`
- `DELETE /api/reservations/details/{detailId}`

---

## Pagos
- `POST /payments/reservation/{reservationId}/pay`
- `GET /payments/reservation/{reservationId}`
- `GET /payments/client/{clientId}`
- `GET /payments/status/{statusName}`
- `GET /payments/supplier/{supplierId}`
- `GET /payments/search`

---

## Facturas
- `GET /invoices/{invoiceId}`
- `GET /invoices/payment/{paymentId}`
- `GET /invoices/{invoiceId}/html`
- `GET /invoices/{invoiceId}/pdf`
- `GET /invoices/client/{clientId}`
- `GET /invoices/client/{clientId}/search`
- `GET /invoices/supplier/{supplierId}`
- `GET /invoices/supplier/{supplierId}/search`
- `GET /invoices`
- `GET /invoices/search`

---

## Devoluciones
- `GET /returns`
- `GET /returns/{id}`
- `POST /returns`
- `PUT /returns/{id}`
- `PUT /returns/{id}/confirm`
- `PUT /returns/{id}/receive`
- `DELETE /returns/{id}`

---

## Estados de Devolución
- `GET /return-statuses`
- `POST /return-statuses`

---

## Reportes (Admin)
- `GET /admin/reports/income`
- `GET /admin/reports/top-tools`
- `GET /admin/reports/frequent-clients`
- `GET /admin/reports/availability`
- `GET /admin/reports/rentals`


