import { UsuariosHeader } from "./UsuariosHeader";
import { UsuariosFilters } from "./UsuariosFilters";
import { UsuariosTableDesktop } from "./UsuariosTableDesktop";
import { UsuariosTableTablet } from "./UsuariosTableTablet";
import { UsuariosCardsMobile } from "./UsuariosCardsMobile";
import { UsuariosPagination } from "./UsuariosPagination";
import { UserStatusDialog } from "./UserStatusDialog";
import { UserEditSheet } from "./UserEditSheet";
import { UserCreateDialog } from "./UserCreateDialog";
import { useAdminUsuarios } from "./useAdminUsuarios";
import { UsuariosStatsCards } from "./UsuariosStatsCards";
import { Card, CardHeader, CardContent } from '@/app/components/ui/card';

// Importa los demás componentes cuando los crees

export default function AdminUsuariosPage() {
    const adminUsuarios = useAdminUsuarios();

    // Calcula counts para filtros
    const counts = {
        admin: adminUsuarios.usuarios.filter((u) => u.rol === "admin").length,
        proveedor: adminUsuarios.usuarios.filter((u) => u.rol === "proveedor").length,
        cliente: adminUsuarios.usuarios.filter((u) => u.rol === "cliente").length,
    };

    // Filtro UI
    const filteredUsuarios = adminUsuarios.usuarios.filter((u) => {
        const s = adminUsuarios.searchTerm.trim().toLowerCase();
        const matchesSearch = u.nombre.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
        const matchesRole = adminUsuarios.roleFilter === "todos" || u.rol === adminUsuarios.roleFilter;
        return matchesSearch && matchesRole;
    });

    const safeTotal = Number.isFinite(adminUsuarios.total) ? adminUsuarios.total : undefined;

    return (
        <div className="space-y-6">
            <UsuariosHeader onCreate={adminUsuarios.openCreateModal} />
            <UsuariosFilters
                searchTerm={adminUsuarios.searchTerm}
                setSearchTerm={adminUsuarios.setSearchTerm}
                roleFilter={adminUsuarios.roleFilter}
                setRoleFilter={adminUsuarios.setRoleFilter}
                setPage={adminUsuarios.setPage}
                total={safeTotal}
                usuarios={adminUsuarios.usuarios}
                counts={counts}
                loading={adminUsuarios.loading}
            />
            <Card>
                <CardHeader>
                    {/* Puedes personalizar aquí el header: título, total, buscador, filtros, etc. */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Lista de Usuarios</h2>
                            <p className="text-sm text-gray-600">Total: {filteredUsuarios.length} de {adminUsuarios.usuarios.length} usuarios</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {adminUsuarios.loading ? (
                        <div className="py-8 flex justify-center">Cargando...</div>
                    ) : adminUsuarios.error ? (
                        <div className="py-8 flex justify-center text-red-600">{adminUsuarios.error}</div>
                    ) : filteredUsuarios.length === 0 ? (
                        <div className="py-8 flex justify-center text-gray-500">No hay usuarios para este filtro.</div>
                    ) : (
                        <>
                            {/* Tablet primero, visible en md y lg, oculto en xl+ */}
                            <div className="hidden md:block lg:block xl:hidden">
                                <UsuariosTableTablet
                                    filteredUsuarios={filteredUsuarios}
                                    openStatusModal={adminUsuarios.openStatusModal}
                                    openEditModal={adminUsuarios.openEditModal}
                                />
                            </div>
                            {/* Desktop debajo, visible solo en lg+ */}
                            <div className="hidden lg:block">
                                <UsuariosTableDesktop
                                    usuarios={adminUsuarios.usuarios}
                                    filteredUsuarios={filteredUsuarios}
                                    openStatusModal={adminUsuarios.openStatusModal}
                                    openEditModal={adminUsuarios.openEditModal}
                                    loading={adminUsuarios.loading}
                                    error={adminUsuarios.error}
                                    safeTotal={safeTotal}
                                />
                            </div>
                            {/* Mobile cards, visible solo en móviles */}
                            <div className="block md:hidden">
                                <UsuariosCardsMobile
                                    usuarios={adminUsuarios.usuarios}
                                    filteredUsuarios={filteredUsuarios}
                                    openStatusModal={adminUsuarios.openStatusModal}
                                    openEditModal={adminUsuarios.openEditModal}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
            {/* Muevo las stats cards aquí, debajo de la lista de usuarios */}
            <UsuariosStatsCards usuarios={adminUsuarios.usuarios} />
            <UsuariosPagination
                loading={adminUsuarios.loading}
                canPaginate={Boolean(adminUsuarios.total && adminUsuarios.pageSize)}
                page={adminUsuarios.page}
                setPage={adminUsuarios.setPage}
                safeTotal={safeTotal}
                safePageSize={adminUsuarios.pageSize}
            />
            <UserStatusDialog
                statusModalOpen={adminUsuarios.statusModalOpen}
                setStatusModalOpen={adminUsuarios.setStatusModalOpen}
                selectedUser={adminUsuarios.selectedUser}
                newStatus={adminUsuarios.newStatus}
                setNewStatus={adminUsuarios.setNewStatus}
                handleSaveStatus={adminUsuarios.handleSaveStatus}
            />
            <UserEditSheet
                editModalOpen={adminUsuarios.editModalOpen}
                setEditModalOpen={adminUsuarios.setEditModalOpen}
                selectedUser={adminUsuarios.selectedUser}
                editFormData={adminUsuarios.editFormData}
                handleEditFormChange={adminUsuarios.handleEditFormChange}
                handleSaveEdit={adminUsuarios.handleSaveEdit}
            />
            <UserCreateDialog
                open={adminUsuarios.createModalOpen}
                setOpen={adminUsuarios.setCreateModalOpen}
                formData={adminUsuarios.createFormData}
                onChange={adminUsuarios.handleCreateFormChange}
                onRoleChange={adminUsuarios.handleCreateRoleChange}
                onSubmit={adminUsuarios.handleCreateSubmit}
                loading={adminUsuarios.createLoading}
                error={adminUsuarios.createError}
            />
        </div>
    );
}
