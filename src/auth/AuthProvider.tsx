import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login as loginApi, getMe, logout as logoutApi, LoginResponse } from "../services/authService";
import type { User } from "../services/types";

const SUPPLIER_ID_KEY = "tolly_supplier_id";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resolveRole = (user: User) => {
        const authorities = (user.roles || []).map((role) => role.authority);
        if (authorities.includes("ROLE_ADMIN")) return "admin";
        if (authorities.includes("ROLE_SUPPLIER")) return "proveedor";
        if (authorities.includes("ROLE_CLIENT")) return "cliente";
        return undefined;
    };

    useEffect(() => {
        if (token) {
            setLoading(true);
            getMe()
                .then((user) => {
                    const role = resolveRole(user);
                    if (user.supplier?.id) {
                        localStorage.setItem(SUPPLIER_ID_KEY, String(user.supplier.id));
                    }
                    setUser({ ...user, rol: role });
                })
                .catch(() => {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem("token");
                })
                .finally(() => setLoading(false));
        }
    }, [token]);

    const login = async (credentials: { email: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Login request body:', credentials);
            const res: LoginResponse = await loginApi(credentials);
            console.log('Login response:', res);
            setToken(res.accessToken);
            localStorage.setItem("token", res.accessToken);
            // Obtener datos del usuario tras login
            const user = await getMe();
            console.log('User after login:', user);
            const role = resolveRole(user);
            if (user.supplier?.id) {
                localStorage.setItem(SUPPLIER_ID_KEY, String(user.supplier.id));
            }
            setUser({ ...user, rol: role });
        } catch (err: any) {
            console.log('Login error:', err);
            setError(err.response?.data?.message || "Error de autenticación");
            setUser(null);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        logoutApi();
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}
