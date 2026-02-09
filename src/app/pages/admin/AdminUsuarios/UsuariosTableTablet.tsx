import { Badge } from "@/app/components/ui/badge";
import { capLabel } from "./helpers";
import { UiUser } from "./types";
import { UserActionsMenu } from "./UserActionsMenu";

interface UsuariosTableTabletProps {
    filteredUsuarios: UiUser[];
    openStatusModal: (u: UiUser) => void;
    openEditModal: (u: UiUser) => void;
}

export function UsuariosTableTablet({
    filteredUsuarios,
    openStatusModal,
    openEditModal,
}: UsuariosTableTabletProps) {
    return (
        <div className="hidden md:block lg:hidden overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
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
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate">{usuario.nombre}</p>
                                        <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
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
        </div>
    );
}
