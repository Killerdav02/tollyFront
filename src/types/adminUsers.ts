// src/types/adminUsers.ts
import { Usuario } from "../app/data/mockData";

export type AdminUser = Usuario;

export interface ListAdminUsersResponse {
    users: AdminUser[];
    total?: number;
    page?: number;
    pageSize?: number;
}

export type UpdateAdminUserRequest =
    | {
        email: string;
        status: { name: string };
    }
    | {
        email: string;
        phone: string;
        company: string;
        identification: string;
        contactName: string;
        status: { name: string };
    }
    | {
        email: string;
        firstName: string;
        lastName: string;
        address: string;
        document: string;
        phone: string;
        status: { name: string };
    };

export interface UpdateAdminUserResponse {
    success: boolean;
    user?: AdminUser;
    message?: string;
}
