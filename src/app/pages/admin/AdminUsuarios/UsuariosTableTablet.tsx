import * as React from "react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import { Search } from "lucide-react";

import { capLabel } from "./helpers";
import { UiUser } from "./types";
import { UserActionsMenu } from "./UserActionsMenu";

type RoleFilter = "todos" | "admin" | "proveedor" | "cliente";

interface Props {
    usuarios: UiUser[];
    openStatusModal: (u: UiUser) => void;
    openEditModal: (u: UiUser) => void;
    loading: boolean;
    error: string | null;
    filteredUsuarios: UiUser[];

    // ✅ Opcional (para replicar el header completo del Card sin meter estado acá)
    searchTerm?: string;
    setSearchTerm?: (value: string) => void;
    roleFilter?: RoleFilter;
    setRoleFilter?: (value: RoleFilter) => void;
}

export function UsuariosTableTablet({
    usuarios,
    openStatusModal,
    openEditModal,
    loading,
    error,
    filteredUsuarios,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
}: Props) {
    const showHeaderControls =
        typeof searchTerm === "string" &&
        typeof setSearchTerm === "function" &&
        typeof roleFilter === "string" &&
        typeof setRoleFilter === "function";

    if (error) return <div className="py-8 flex justify-center text-red-600">{error}</div>;

    if (filteredUsuarios.length === 0)
        return <div className="py-8 flex justify-center text-gray-500">No hay usuarios para este filtro.</div>;

    return (
        <div className="hidden md:block lg:hidden overflow-x-auto">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <CardTitle>Lista de Usuarios</CardTitle>
                            <CardDescription>
                                Total: {filteredUsuarios.length} de {usuarios.length} usuarios
                            </CardDescription>
                        </div>

                        {showHeaderControls && (
                            <div className="w-full md:w-64">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-[#3d5a5a] p-2 rounded-md">
                                        <Search className="w-4 h-4 text-white" />
                                    </div>
                                    <Input
                                        placeholder="Buscar usuarios..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-14 bg-transparent"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {showHeaderControls && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                                Filtrar por rol:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={roleFilter === "todos" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setRoleFilter("todos")}
                                    className={
                                        roleFilter === "todos"
                                            ? "bg-[#3d5a5a] hover:bg-[#2a4644] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                >
                                    Todos ({usuarios.length})
                                </Button>

                                <Button
                                    variant={roleFilter === "admin" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setRoleFilter("admin")}
                                    className={
                                        roleFilter === "admin"
                                            ? "bg-[#3d5a5a] hover:bg-[#2a4644] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                >
                                    Administrador ({usuarios.filter((u) => u.rol === "admin").length})
                                </Button>

                                <Button
                                    variant={roleFilter === "proveedor" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setRoleFilter("proveedor")}
                                    className={
                                        roleFilter === "proveedor"
                                            ? "bg-[#3d5a5a] hover:bg-[#2a4644] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                >
                                    Proveedor ({usuarios.filter((u) => u.rol === "proveedor").length})
                                </Button>

                                <Button
                                    variant={roleFilter === "cliente" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setRoleFilter("cliente")}
                                    className={
                                        roleFilter === "cliente"
                                            ? "bg-[#3d5a5a] hover:bg-[#2a4644] text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                >
                                    Cliente ({usuarios.filter((u) => u.rol === "cliente").length})
                                </Button>
                            </div>
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    {!loading && !error && (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                        Usuario
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                        Rol
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                                        Estado
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsuarios.map((usuario) => (
                                    <tr key={usuario.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                                                    {usuario.nombre.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium truncate">{usuario.nombre}</p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {usuario.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3 px-4">
                                            <Badge
                                                variant={
                                                    usuario.rol === "admin"
                                                        ? "default"
                                                        : usuario.rol === "proveedor"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {capLabel(usuario.rol)}
                                            </Badge>
                                        </td>

                                        <td className="py-3 px-4">
                                            <Badge
                                                variant={usuario.estado === "activo" ? "default" : "secondary"}
                                                className={
                                                    usuario.estado === "activo"
                                                        ? "bg-[#3d5a5a] hover:bg-[#2a4644] text-white border-none"
                                                        : ""
                                                }
                                            >
                                                {capLabel(usuario.estado)}
                                            </Badge>
                                        </td>

                                        <td className="py-3 px-4 text-right">
                                            <UserActionsMenu
                                                usuario={usuario}
                                                onStatus={openStatusModal}
                                                onEdit={openEditModal}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
