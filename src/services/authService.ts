// src/services/authService.ts
import apiClient from "../api/apiClient";

// Ajusta el tipo según la respuesta real de tu backend
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface User {
    id: string;
    email: string;
    [key: string]: any;
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
