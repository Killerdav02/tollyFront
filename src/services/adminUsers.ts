// src/services/adminUsers.ts
import apiClient from "../api/apiClient";
import { Usuario } from "../app/data/mockData";
import { UpdateAdminUserRequest, UpdateAdminUserResponse } from "@/types/adminUsers";

export interface ListAdminUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
}

export interface ListAdminUsersResponse {
    users: Usuario[];
    total?: number; // TODO: Ajustar según backend
    page?: number;
    pageSize?: number;
}

export async function listAdminUsers(params: ListAdminUsersParams = {}): Promise<ListAdminUsersResponse> {
    try {
        const response = await apiClient.get("/admin/users/list", { params });
        // Defensive: fallback if backend shape changes
        return {
            users: response.data.users || response.data || [],
            total: response.data.total ?? response.data.users?.length ?? response.data.length ?? 0,
            page: response.data.page ?? params.page ?? 1,
            pageSize: response.data.pageSize ?? params.limit ?? response.data.limit ?? undefined,
        };
    } catch (error: any) {
        // Error handling for UI
        let message = "Error al cargar usuarios";
        if (error.response && error.response.data && error.response.data.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }
        throw new Error(message);
    }
}

export async function updateAdminUser(payload: UpdateAdminUserRequest): Promise<UpdateAdminUserResponse> {
    const response = await apiClient.put<UpdateAdminUserResponse>("/admin/users/update", payload);
    return response.data;
}
