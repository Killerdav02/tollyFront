import { UsuariosHeader } from "./UsuariosHeader";
import { UsuariosFilters } from "./UsuariosFilters";
import { UsuariosTableDesktop } from "./UsuariosTableDesktop";
import { UsuariosTableTablet } from "./UsuariosTableTablet";
import { UsuariosCardsMobile } from "./UsuariosCardsMobile";
import { UsuariosPagination } from "./UsuariosPagination";
import { UserStatusDialog } from "./UserStatusDialog";
import { UserEditSheet } from "./UserEditSheet";
import { useAdminUsuarios } from "./useAdminUsuarios";
import { UsuariosStatsCards } from "./UsuariosStatsCards";
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
            <UsuariosHeader />
            <UsuariosStatsCards usuarios={adminUsuarios.usuarios} />
            <UsuariosFilters
                searchTerm={adminUsuarios.searchTerm}
                setSearchTerm={adminUsuarios.setSearchTerm}
                roleFilter={adminUsuarios.roleFilter}
                setRoleFilter={adminUsuarios.setRoleFilter}
                setPage={adminUsuarios.setPage}
                total={safeTotal}
                usuarios={adminUsuarios.usuarios}
                counts={counts}
            />
            <UsuariosTableDesktop
                usuarios={adminUsuarios.usuarios}
                openStatusModal={adminUsuarios.openStatusModal}
                openEditModal={adminUsuarios.openEditModal}
                loading={adminUsuarios.loading}
                error={adminUsuarios.error}
                filteredUsuarios={filteredUsuarios}
                safeTotal={safeTotal}
            />
            <UsuariosTableTablet
                usuarios={adminUsuarios.usuarios}
                openStatusModal={adminUsuarios.openStatusModal}
                openEditModal={adminUsuarios.openEditModal}
                loading={adminUsuarios.loading}
                error={adminUsuarios.error}
                filteredUsuarios={filteredUsuarios}
            />
            <UsuariosCardsMobile
                usuarios={adminUsuarios.usuarios}
                openStatusModal={adminUsuarios.openStatusModal}
                openEditModal={adminUsuarios.openEditModal}
                filteredUsuarios={filteredUsuarios}
            />
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
        </div>
    );
}
