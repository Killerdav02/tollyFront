import { useCallback, useEffect, useMemo, useState } from "react";
import { listAdminUsers, updateAdminUser } from "@/services/adminUsers";
import { UiUser, UiRole, UiStatus } from "./types";
import { mapApiUserToUiUser } from "./helpers";

export function useAdminUsuarios() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<UiRole | "todos">("todos");
    const [usuarios, setUsuarios] = useState<UiUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<number | undefined>(undefined);
    const [pageSize, setPageSize] = useState<number | undefined>(undefined);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UiUser | null>(null);
    const [newStatus, setNewStatus] = useState<UiStatus>("activo");
    const [editFormData, setEditFormData] = useState<any>({});

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listAdminUsers({
                search: searchTerm,
                page,
                role: roleFilter === "todos" ? undefined : roleFilter,
            } as any);
            const mapped: UiUser[] = (Array.isArray(res.users) ? res.users : []).map(mapApiUserToUiUser);
            setUsuarios(mapped);
            setTotal(Number(res.total) || mapped.length);
            setPageSize(Number(res.pageSize) || mapped.length);
        } catch (err: any) {
            setError(err?.message || "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, roleFilter]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchUsuarios();
        }, 300);
        return () => clearTimeout(handler);
    }, [fetchUsuarios]);

    const openStatusModal = (user: UiUser) => {
        setSelectedUser(user);
        setNewStatus(user.estado);
        setStatusModalOpen(true);
    };
    const openEditModal = (user: UiUser) => {
        setSelectedUser(user);
        setEditFormData(
            user.rol === "cliente"
                ? {
                    first_name: user.client?.firstName ?? "",
                    last_name: user.client?.lastName ?? "",
                    address: user.client?.address ?? "",
                    document_id: user.client?.document ?? "",
                    phone_number: user.client?.phone ?? "",
                }
                : user.rol === "proveedor"
                    ? {
                        company_name: user.supplier?.company ?? "",
                        contact_name: user.supplier?.contactName ?? "",
                        identification: user.supplier?.identification ?? "",
                        phone: user.supplier?.phone ?? "",
                    }
                    : {}
        );
        setEditModalOpen(true);
    };

    // Handler para cambios en el formulario de edición
    const handleEditFormChange = (field: string, value: string) => {
        setEditFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // Handler para guardar la edición (debes adaptar la lógica a tu backend real)
    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        let apiStatus = "";
        if (selectedUser.estado === "bloqueado") apiStatus = "BLOCKED";
        else if (selectedUser.estado === "activo") apiStatus = "ACTIVE";
        else if (selectedUser.estado === "suspendido") apiStatus = "SUSPENDED";
        else apiStatus = "INACTIVE";
        let payload;
        if (selectedUser.rol === "cliente") {
            payload = {
                email: selectedUser.email,
                firstName: editFormData.first_name,
                lastName: editFormData.last_name,
                address: editFormData.address,
                document: editFormData.document_id,
                phone: editFormData.phone_number,
                status: { name: apiStatus },
            };
        } else if (selectedUser.rol === "proveedor") {
            payload = {
                email: selectedUser.email,
                phone: editFormData.phone,
                company: editFormData.company_name,
                identification: editFormData.identification,
                contactName: editFormData.contact_name,
                status: { name: apiStatus },
            };
        } else {
            return;
        }
        await updateAdminUser(payload);
        setEditModalOpen(false);
        fetchUsuarios();
    };

    // Handler para guardar el cambio de estado
    const handleSaveStatus = async () => {
        if (!selectedUser) return;
        let apiStatus = "";
        if (newStatus === "bloqueado") apiStatus = "BLOCKED";
        else if (newStatus === "activo") apiStatus = "ACTIVE";
        else if (newStatus === "suspendido") apiStatus = "SUSPENDED";
        else apiStatus = "INACTIVE";
        const payload = {
            email: selectedUser.email,
            status: { name: apiStatus },
        };
        await updateAdminUser(payload);
        setStatusModalOpen(false);
        fetchUsuarios();
    };

    return {
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        usuarios,
        loading,
        error,
        page,
        setPage,
        total,
        pageSize,
        statusModalOpen,
        setStatusModalOpen,
        editModalOpen,
        setEditModalOpen,
        selectedUser,
        setSelectedUser,
        newStatus,
        setNewStatus,
        editFormData,
        setEditFormData,
        fetchUsuarios,
        openStatusModal,
        openEditModal,
        handleEditFormChange,
        handleSaveEdit,
        handleSaveStatus,
    };
}
