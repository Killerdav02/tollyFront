export type RoleAuthority = "ROLE_ADMIN" | "ROLE_SUPPLIER" | "ROLE_CLIENT" | "ROLE_USER";

export interface Role {
  id: number;
  name: string;
  authority: RoleAuthority;
}

export interface UserStatus {
  name: string;
}

export interface ClientProfile {
  id: number;
  [key: string]: any;
}

export interface SupplierProfile {
  id: number;
  phone: string;
  company: string;
  contactName: string;
  identification: string;
}

export interface User {
  id: string;
  email: string;
  roles: Role[];
  status: UserStatus;
  client: ClientProfile | null;
  supplier: SupplierProfile | null;
  rol?: "admin" | "proveedor" | "cliente";
}

export interface Category {
  id: number;
  name: string;
}

export interface ToolStatus {
  id: number;
  name: string;
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  dailyPrice: number;
  totalQuantity: number;
  availableQuantity: number;
  statusId: number;
  supplierId: number;
  categoryId: number;
}

export interface ToolImage {
  id: number;
  toolId: number;
  image_url: string;
}

export interface Payment {
  id: number;
  reservationId: number;
  amount: number;
  paymentDate: string;
  status: string;
}

export interface InvoiceDetail {
  toolId: number;
  toolName: string;
  dailyPrice: number;
  quantity: number;
  rentalDays: number;
  subTotal: number;
}

export interface Invoice {
  id: number;
  code: string;
  paymentId: number;
  reservationId: number;
  clientId: number;
  issueDate: string;
  total: number;
  details: InvoiceDetail[];
}

export interface ReturnResponse {
  id: number;
  reservationId: number;
  clientId: number;
  returnDate: string;
  returnStatusId: number;
  returnStatusName: string;
  observations?: string | null;
  details?: Array<{
    toolId: number;
    quantity: number;
    observations?: string | null;
  }>;
}

export interface Reservation {
  id: number;
  clientId: number;
  startDate: string;
  endDate: string;
  total: number;
  statusName: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
