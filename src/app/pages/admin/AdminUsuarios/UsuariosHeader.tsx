import { Button } from "@/app/components/ui/button";
import { UserPlus } from "lucide-react";

interface Props {
    onCreate: () => void;
}

export function UsuariosHeader({ onCreate }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Administra proveedores y clientes de la plataforma
                </p>
            </div>
            <Button className="w-full sm:w-auto" onClick={onCreate}>
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="sm:inline">Nuevo Usuario</span>
            </Button>
        </div>
    );
}
