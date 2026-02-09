import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search } from "lucide-react";
import { UiRole } from "./types";

interface Props {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    roleFilter: UiRole | "todos";
    setRoleFilter: (v: UiRole | "todos") => void;
    setPage: (v: number) => void;
    total?: number;
    usuarios: any[];
    counts: { admin: number; proveedor: number; cliente: number };
}

export function UsuariosFilters({
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    setPage,
    total,
    usuarios,
    counts,
}: Props) {
    return (
        <div>
            <div className="w-full md:w-64 mb-4">
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-[#3d5a5a] p-2 rounded-md">
                        <Search className="w-4 h-4 text-white" />
                    </div>
                    <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="pl-14 bg-transparent"
                    />
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Filtrar por rol:</p>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={roleFilter === 'todos' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setRoleFilter('todos');
                            setPage(1);
                        }}
                        className={
                            roleFilter === 'todos'
                                ? 'bg-[#3d5a5a] hover:bg-[#2a4644] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }
                    >
                        Todos ({typeof total === 'number' ? total : usuarios.length})
                    </Button>
                    <Button
                        variant={roleFilter === 'admin' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setRoleFilter('admin');
                            setPage(1);
                        }}
                        className={
                            roleFilter === 'admin'
                                ? 'bg-[#3d5a5a] hover:bg-[#2a4644] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }
                    >
                        Administrador ({counts.admin})
                    </Button>
                    <Button
                        variant={roleFilter === 'proveedor' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setRoleFilter('proveedor');
                            setPage(1);
                        }}
                        className={
                            roleFilter === 'proveedor'
                                ? 'bg-[#3d5a5a] hover:bg-[#2a4644] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }
                    >
                        Proveedor ({counts.proveedor})
                    </Button>
                    <Button
                        variant={roleFilter === 'cliente' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                            setRoleFilter('cliente');
                            setPage(1);
                        }}
                        className={
                            roleFilter === 'cliente'
                                ? 'bg-[#3d5a5a] hover:bg-[#2a4644] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }
                    >
                        Cliente ({counts.cliente})
                    </Button>
                </div>
            </div>
        </div>
    );
}
