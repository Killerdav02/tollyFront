import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { login as loginApi, getMe, logout as logoutApi, LoginResponse, User } from "../services/authService";

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

    useEffect(() => {
        if (token) {
            setLoading(true);
            getMe()
                .then((user) => {
                    // Normalizar el rol para el frontend
                    let role = undefined;
                    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                        const roleName = user.roles[0].name;
                        if (roleName === "ADMIN" || roleName.toLowerCase() === "admin") role = "admin";
                        else if (roleName === "CLIENT" || roleName.toLowerCase() === "cliente" || roleName.toLowerCase() === "client") role = "cliente";
                        else if (roleName === "SUPPLIER" || roleName.toLowerCase() === "proveedor" || roleName.toLowerCase() === "supplier") role = "proveedor";
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
            const res: LoginResponse = await loginApi(credentials);
            setToken(res.accessToken);
            localStorage.setItem("token", res.accessToken);
            // Obtener datos del usuario tras login
            const user = await getMe();
            let role = undefined;
            if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
                const roleName = user.roles[0].name?.toLowerCase();
                if (roleName === "admin") role = "admin";
                else if (roleName === "cliente" || roleName === "client") role = "cliente";
                else if (roleName === "proveedor" || roleName === "supplier") role = "proveedor";
            }
            setUser({ ...user, rol: role });
        } catch (err: any) {
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
