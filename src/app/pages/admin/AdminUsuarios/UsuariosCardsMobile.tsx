import { Badge } from "@/app/components/ui/badge";
import { capLabel, formatDateEs, getUserDate } from "./helpers";
import { UiUser } from "./types";
import { UserActionsMenu } from "./UserActionsMenu";

interface Props {
    usuarios: UiUser[];
    openStatusModal: (u: UiUser) => void;
    openEditModal: (u: UiUser) => void;
    filteredUsuarios: UiUser[];
}

export function UsuariosCardsMobile({ usuarios, openStatusModal, openEditModal, filteredUsuarios }: Props) {
    if (filteredUsuarios.length === 0) return null;
    return (
        <div className="md:hidden space-y-4">
            {filteredUsuarios.map((usuario) => (
                <div key={usuario.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold flex-shrink-0">
                                {usuario.nombre.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 truncate">{usuario.nombre}</h3>
                                <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
                            </div>
                        </div>
                        <UserActionsMenu usuario={usuario} onStatus={openStatusModal} onEdit={openEditModal} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Rol</p>
                            <Badge variant={usuario.rol === 'admin' ? 'default' : usuario.rol === 'proveedor' ? 'secondary' : 'outline'}>
                                {capLabel(usuario.rol)}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Estado</p>
                            <Badge className="text-white bg-[#3d5a5a] border-none">
                                {capLabel(usuario.estado)}
                            </Badge>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-500 text-xs mb-1">Fecha de Registro</p>
                            <p className="text-gray-900">{formatDateEs(getUserDate(usuario))}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
