import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { createAdminClient, createAdminSupplier, listAdminUsers, updateAdminUser } from "@/services/adminUsers";
import { CreateUserFormData, CreateUserRole, UiUser, UiRole, UiStatus } from "./types";
import { mapApiUserToUiUser } from "./helpers";

const createInitialForm: CreateUserFormData = {
    role: "cliente",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    document: "",
    phone: "",
    company: "",
    identification: "",
    contactName: "",
};

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
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createFormData, setCreateFormData] = useState<CreateUserFormData>({ ...createInitialForm });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

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

    const handleCreateFormChange = (field: keyof CreateUserFormData, value: string) => {
        setCreateFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateRoleChange = (role: CreateUserRole) => {
        setCreateFormData((prev) => ({
            ...prev,
            role,
            firstName: role === "cliente" ? prev.firstName : "",
            lastName: role === "cliente" ? prev.lastName : "",
            address: role === "cliente" ? prev.address : "",
            document: role === "cliente" ? prev.document : "",
            company: role === "proveedor" ? prev.company : "",
            identification: role === "proveedor" ? prev.identification : "",
            contactName: role === "proveedor" ? prev.contactName : "",
        }));
    };

    const openCreateModal = () => {
        setCreateError(null);
        setCreateModalOpen(true);
    };

    const handleCreateSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setCreateError(null);

        const email = createFormData.email.trim();
        const password = createFormData.password;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setCreateError("Correo invalido.");
            return;
        }
        if (!password || password.length < 6) {
            setCreateError("La contrasena debe tener al menos 6 caracteres.");
            return;
        }

        if (createFormData.role === "cliente") {
            if (
                !createFormData.firstName.trim() ||
                !createFormData.lastName.trim() ||
                !createFormData.address.trim() ||
                !createFormData.document.trim() ||
                !createFormData.phone.trim()
            ) {
                setCreateError("Completa los campos obligatorios del cliente.");
                return;
            }
        } else {
            if (
                !createFormData.company.trim() ||
                !createFormData.identification.trim() ||
                !createFormData.contactName.trim() ||
                !createFormData.phone.trim()
            ) {
                setCreateError("Completa los campos obligatorios del proveedor.");
                return;
            }
        }

        setCreateLoading(true);
        try {
            if (createFormData.role === "cliente") {
                await createAdminClient({
                    email,
                    password,
                    role: "CLIENT",
                    firstName: createFormData.firstName.trim(),
                    lastName: createFormData.lastName.trim(),
                    address: createFormData.address.trim(),
                    document: createFormData.document.trim(),
                    phone: createFormData.phone.trim(),
                    company: null,
                    identification: null,
                    contactName: null,
                });
            } else {
                await createAdminSupplier({
                    email,
                    password,
                    role: "SUPPLIER",
                    firstName: null,
                    lastName: null,
                    address: null,
                    document: null,
                    phone: createFormData.phone.trim(),
                    company: createFormData.company.trim(),
                    identification: createFormData.identification.trim(),
                    contactName: createFormData.contactName.trim(),
                });
            }

            setCreateModalOpen(false);
            setCreateFormData({ ...createInitialForm });
            fetchUsuarios();
        } catch (err: any) {
            setCreateError(err?.response?.data?.message || err?.message || "No se pudo registrar el usuario.");
        } finally {
            setCreateLoading(false);
        }
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
        createModalOpen,
        setCreateModalOpen,
        createFormData,
        setCreateFormData,
        createLoading,
        createError,
        openCreateModal,
        fetchUsuarios,
        openStatusModal,
        openEditModal,
        handleCreateFormChange,
        handleCreateRoleChange,
        handleCreateSubmit,
        handleEditFormChange,
        handleSaveEdit,
        handleSaveStatus,
    };
}
