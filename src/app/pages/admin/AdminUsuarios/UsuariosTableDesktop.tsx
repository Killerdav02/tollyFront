import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { MoreVertical } from "lucide-react";
import { capLabel } from "./helpers";
import { UiUser } from "./types";
import { UserActionsMenu } from "./UserActionsMenu";

interface Props {
    usuarios: UiUser[];
    openStatusModal: (u: UiUser) => void;
    openEditModal: (u: UiUser) => void;
    loading: boolean;
    error: string | null;
    filteredUsuarios: UiUser[];
    safeTotal?: number;
}

export function UsuariosTableDesktop({
    usuarios,
    openStatusModal,
    openEditModal,
    loading,
    error,
    filteredUsuarios,
    safeTotal,
}: Props) {
    if (error) return <div className="py-8 flex justify-center text-red-600">{error}</div>;
    if (filteredUsuarios.length === 0)
        return <div className="py-8 flex justify-center text-gray-500">No hay usuarios para este filtro.</div>;

    return (
        <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Rol</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
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
                                    <span className="font-medium">{usuario.nombre}</span>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{usuario.email}</td>
                            <td className="py-3 px-4">
                                <Badge variant={usuario.rol === 'admin' ? 'default' : usuario.rol === 'proveedor' ? 'secondary' : 'outline'}>
                                    {capLabel(usuario.rol)}
                                </Badge>
                            </td>
                            <td className="py-3 px-4">
                                <Badge className="text-white bg-[#3d5a5a] border-none">
                                    {capLabel(usuario.estado)}
                                </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <UserActionsMenu usuario={usuario} onStatus={openStatusModal} onEdit={openEditModal} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
