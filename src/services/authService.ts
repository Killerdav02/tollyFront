// src/services/authService.ts
import apiClient from "../api/apiClient";
import type { User } from "./types";

// Ajusta el tipo según la respuesta real de tu backend
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    return response.data;
}


export async function getMe(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
}

export async function register(body: any): Promise<any> {
    const response = await apiClient.post('/auth/register', body);
    return response.data;
}
