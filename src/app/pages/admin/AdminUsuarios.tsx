import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { listAdminUsers, updateAdminUser } from '@/services/adminUsers';
import { AdminUser } from '@/types/adminUsers';
import { UserPlus, Search, MoreVertical, Edit, UserCog } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import { toast } from 'sonner';

type RoleFilter = 'todos' | 'admin' | 'proveedor' | 'cliente';
type UiStatus = 'activo' | 'inactivo' | 'bloqueado';

type UIUser = AdminUser & {
  rol?: 'admin' | 'proveedor' | 'cliente' | string;
  estado?: UiStatus | string;
  nombre?: string;
  // posibles fechas del backend (si existen)
  fechaRegistro?: string;
  createdAt?: string;
  created_at?: string;

  roles?: any[];
  status?: any;
  client?: any;
  supplier?: any;
};

function formatDateEs(value: any) {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-ES');
}

function capLabel(value: any) {
  if (typeof value !== 'string' || value.trim().length === 0) return '-';
  const s = value.trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getUserDate(u: any) {
  return u?.fechaRegistro ?? u?.createdAt ?? u?.created_at ?? null;
}

export function AdminUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('todos');

  const [usuarios, setUsuarios] = useState<UIUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [pageSize, setPageSize] = useState<number | undefined>(undefined);

  // ---- Acciones / Modales (mismo comportamiento del estático) ----
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UIUser | null>(null);
  const [newStatus, setNewStatus] = useState<UiStatus>('activo');

  const [editFormData, setEditFormData] = useState({
    // Cliente
    first_name: '',
    last_name: '',
    address: '',
    document_id: '',
    phone_number: '',
    // Proveedor
    company_name: '',
    contact_name: '',
    identification: '',
    phone: '',
  });

  const safeTotal = useMemo(() => (Number.isFinite(total) ? total : undefined), [total]);
  const safePageSize = useMemo(() => (Number.isFinite(pageSize) ? pageSize : undefined), [pageSize]);

  const canPaginate = useMemo(() => {
    return (
      Number.isFinite(safeTotal) &&
      Number.isFinite(safePageSize) &&
      (safeTotal as number) > 0 &&
      (safePageSize as number) > 0
    );
  }, [safeTotal, safePageSize]);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listAdminUsers({
        search: searchTerm,
        page,
        role: roleFilter === 'todos' ? undefined : roleFilter,
      } as any);

      const mapped: UIUser[] = (Array.isArray(res.users) ? res.users : []).map((u: any) => {
        // Rol principal: ADMIN > SUPPLIER > CLIENT > USER
        let rol = '';
        if (Array.isArray(u.roles)) {
          const roleNames = u.roles.map((r: any) => String(r?.name ?? '').toUpperCase());
          if (roleNames.includes('ADMIN')) rol = 'admin';
          else if (roleNames.includes('SUPPLIER')) rol = 'proveedor';
          else if (roleNames.includes('CLIENT')) rol = 'cliente';
          else if (roleNames.includes('USER')) rol = 'cliente';
          else rol = (roleNames[0] || '').toLowerCase();
        }

        // Estado
        let estado = '';
        if (u.status && typeof u.status.name === 'string') {
          const s = u.status.name.toUpperCase();
          if (s === 'ACTIVE') estado = 'activo';
          else if (s === 'INACTIVE') estado = 'inactivo';
          else if (s === 'SUSPENDED') estado = 'suspendido';
          else estado = u.status.name.toLowerCase();
        }

        // Nombre visible (para UI): cliente => first+last, proveedor => company, si no => email
        const nombre =
          u?.client?.firstName || u?.client?.lastName
            ? `${u?.client?.firstName ?? ''} ${u?.client?.lastName ?? ''}`.trim()
            : u?.supplier?.company
              ? String(u?.supplier?.company)
              : String(u?.email ?? '');

        return {
          ...u,
          rol,
          estado,
          nombre,
        };
      });

      setUsuarios(mapped);

      const nextTotal = typeof res.total === 'number' ? res.total : Number(res.total);
      const nextPageSize = typeof res.pageSize === 'number' ? res.pageSize : Number(res.pageSize);

      setTotal(Number.isFinite(nextTotal) ? nextTotal : undefined);
      setPageSize(Number.isFinite(nextPageSize) ? nextPageSize : undefined);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, roleFilter]);

  useEffect(() => {
    fetchUsuarios();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce: search + page + role
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsuarios();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchUsuarios]);

  const counts = useMemo(() => {
    const admin = usuarios.filter((u) => u?.rol === 'admin').length;
    const proveedor = usuarios.filter((u) => u?.rol === 'proveedor').length;
    const cliente = usuarios.filter((u) => u?.rol === 'cliente').length;
    return { admin, proveedor, cliente };
  }, [usuarios]);

  // Filtro UI (igual lógica del estático)
  const filteredUsuarios = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();

    return usuarios.filter((u: any) => {
      const matchesSearch =
        String(u?.nombre ?? '').toLowerCase().includes(s) ||
        String(u?.email ?? '').toLowerCase().includes(s);

      const matchesRole = roleFilter === 'todos' || u?.rol === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usuarios, searchTerm, roleFilter]);

  // ---- Handlers de acciones (mismo UX del estático) ----
  const handleOpenStatusModal = (user: UIUser) => {
    setSelectedUser(user);
    setNewStatus((user?.estado as UiStatus) || 'activo');
    setStatusModalOpen(true);
  };

  const handleOpenEditModal = (user: UIUser) => {
    setSelectedUser(user);

    // reset base
    const base = {
      first_name: '',
      last_name: '',
      address: '',
      document_id: '',
      phone_number: '',
      company_name: '',
      contact_name: '',
      identification: '',
      phone: '',
    };

    if (user?.rol === 'cliente') {
      setEditFormData({
        ...base,
        first_name: user?.client?.firstName ?? '',
        last_name: user?.client?.lastName ?? '',
        address: user?.client?.address ?? '',
        document_id: user?.client?.document ?? '',
        phone_number: user?.client?.phone ?? '',
      });
    } else if (user?.rol === 'proveedor') {
      setEditFormData({
        ...base,
        company_name: user?.supplier?.company ?? '',
        contact_name: user?.supplier?.contactName ?? '',
        identification: user?.supplier?.identification ?? '',
        phone: user?.supplier?.phone ?? '',
      });
    } else {
      setEditFormData(base);
    }

    setEditModalOpen(true);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveStatus = async () => {
    try {
      if (!selectedUser) return;
      // Mapear el estado UI al nombre esperado por backend
      let apiStatus = '';
      if (newStatus === 'bloqueado') apiStatus = 'BLOCKED';
      else if (newStatus === 'activo') apiStatus = 'ACTIVE';
      else apiStatus = 'INACTIVE';

      const payload = {
        email: selectedUser.email,
        status: { name: apiStatus },
      };
      await updateAdminUser(payload);

      // update local
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === selectedUser?.id
            ? { ...u, estado: newStatus as UiStatus }
            : u
        )
      );

      toast.success('Estado actualizado correctamente');
      setStatusModalOpen(false);
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo actualizar el estado');
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedUser) return;

      let payload;
      if (selectedUser.rol === 'cliente') {
        payload = {
          email: selectedUser.email,
          firstName: editFormData.first_name,
          lastName: editFormData.last_name,
          address: editFormData.address,
          document: editFormData.document_id,
          phone: editFormData.phone_number,
          status: selectedUser.status || { name: 'ACTIVE' },
        };
      } else if (selectedUser.rol === 'proveedor') {
        payload = {
          email: selectedUser.email,
          phone: editFormData.phone,
          company: editFormData.company_name,
          identification: editFormData.identification,
          contactName: editFormData.contact_name,
          status: selectedUser.status || { name: 'ACTIVE' },
        };
      } else {
        toast.error('Solo se puede editar clientes o proveedores');
        return;
      }

      await updateAdminUser(payload);
      toast.success('Datos actualizados correctamente');
      setEditModalOpen(false);
      fetchUsuarios();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudieron actualizar los datos');
    }
  };

  const proveedoresCount = useMemo(() => usuarios.filter((u) => u?.rol === 'proveedor').length, [usuarios]);
  const clientesCount = useMemo(() => usuarios.filter((u) => u?.rol === 'cliente').length, [usuarios]);
  const activosCount = useMemo(() => usuarios.filter((u: any) => u?.estado === 'activo').length, [usuarios]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Administra proveedores y clientes de la plataforma</p>
        </div>
        <Button className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          <span className="sm:inline">Nuevo Usuario</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>
                Total: {filteredUsuarios.length} de {Number.isFinite(safeTotal) ? safeTotal : usuarios.length} usuarios
              </CardDescription>
            </div>
            <div className="w-full md:w-64">
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
          </div>

          {/* Role Filters (mismos estilos del código estático) */}
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
                Todos ({Number.isFinite(safeTotal) ? safeTotal : usuarios.length})
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
        </CardHeader>

        <CardContent>
          {/* Estados (manteniendo el mismo diseño) */}
          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="w-full animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-4" />
              </div>
            </div>
          ) : error ? (
            <div className="py-8 flex flex-col items-center">
              <span className="text-red-600 mb-2">{error}</span>
              <Button onClick={fetchUsuarios}>Reintentar</Button>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="py-8 flex justify-center text-gray-500">No hay usuarios para este filtro.</div>
          ) : (
            <>
              {/* Desktop Table View (igual al estático) */}
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
                    {filteredUsuarios.map((usuario: any) => (
                      <tr key={usuario.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                              {typeof usuario?.nombre === 'string' && usuario.nombre.length > 0
                                ? usuario.nombre.charAt(0)
                                : (typeof usuario?.email === 'string' && usuario.email.length > 0
                                  ? usuario.email.charAt(0).toUpperCase()
                                  : '?')}
                            </div>
                            <span className="font-medium">{usuario?.nombre ?? ''}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-gray-600">{usuario?.email ?? '-'}</td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              usuario?.rol === 'admin'
                                ? 'default'
                                : usuario?.rol === 'proveedor'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {capLabel(usuario?.rol)}
                          </Badge>
                        </td>


                        <td className="py-3 px-4">
                          <Badge variant={usuario?.estado === 'activo' ? 'default' : 'secondary'}>
                            {capLabel(usuario?.estado)}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenStatusModal(usuario)}>
                                <UserCog className="w-4 h-4 mr-2" />
                                Cambiar Estado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEditModal(usuario)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet View - Simplified Table (igual al estático) */}
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
                    {filteredUsuarios.map((usuario: any) => (
                      <tr key={usuario.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                              {typeof usuario?.nombre === 'string' && usuario.nombre.length > 0
                                ? usuario.nombre.charAt(0)
                                : (typeof usuario?.email === 'string' && usuario.email.length > 0
                                  ? usuario.email.charAt(0).toUpperCase()
                                  : '?')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{usuario?.nombre ?? '-'}</p>
                              <p className="text-sm text-gray-500 truncate">{usuario?.email ?? '-'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              usuario?.rol === 'admin'
                                ? 'default'
                                : usuario?.rol === 'proveedor'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {capLabel(usuario?.rol)}
                          </Badge>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant={usuario?.estado === 'activo' ? 'default' : 'secondary'}>
                            {capLabel(usuario?.estado)}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenStatusModal(usuario)}>
                                <UserCog className="w-4 h-4 mr-2" />
                                Cambiar Estado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEditModal(usuario)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (igual al estático) */}
              <div className="md:hidden space-y-4">
                {filteredUsuarios.map((usuario: any) => (
                  <div key={usuario.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold flex-shrink-0">
                          {typeof usuario?.nombre === 'string' && usuario.nombre.length > 0
                            ? usuario.nombre.charAt(0)
                            : (typeof usuario?.email === 'string' && usuario.email.length > 0
                              ? usuario.email.charAt(0).toUpperCase()
                              : '?')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">{usuario?.nombre ?? '-'}</h3>
                          <p className="text-sm text-gray-500 truncate">{usuario?.email ?? '-'}</p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenStatusModal(usuario)}>
                            <UserCog className="w-4 h-4 mr-2" />
                            Cambiar Estado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenEditModal(usuario)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Rol</p>
                        <Badge
                          variant={
                            usuario?.rol === 'admin'
                              ? 'default'
                              : usuario?.rol === 'proveedor'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {capLabel(usuario?.rol)}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-gray-500 text-xs mb-1">Estado</p>
                        <Badge variant={usuario?.estado === 'activo' ? 'default' : 'secondary'}>
                          {capLabel(usuario?.estado)}
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

              {/* Paginación */}
              <div className="flex justify-end mt-4 items-center">
                <Button
                  variant="outline"
                  disabled={loading || !canPaginate || page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <span className="mx-2">Página {page}</span>
                <Button
                  variant="outline"
                  disabled={loading || !canPaginate || (safeTotal as number) <= page * (safePageSize as number)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
                {!canPaginate ? (
                  <span className="ml-2 text-xs text-gray-400">{/* Paginación deshabilitada: backend no la soporta */}</span>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats (mismo diseño) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{proveedoresCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activosCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para cambiar estado (igual al estático) */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Estado de Usuario</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo estado para el usuario {selectedUser?.nombre ?? selectedUser?.email ?? ''}.
            </DialogDescription>
          </DialogHeader>

          <Select 
            value={newStatus}
            onValueChange={(value) => setNewStatus(value as UiStatus)}
          >
            <SelectTrigger className="w-full text-gray-100 bg-[#2a4644] border-[#3d5a5a]">
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="bloqueado">Bloqueado</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setStatusModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveStatus}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet para editar usuario (igual al estático) */}
      <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editar Usuario</SheetTitle>
            <SheetDescription>
              Modifica la información del usuario {selectedUser?.nombre ?? selectedUser?.email ?? ''}.
            </SheetDescription>
          </SheetHeader>

          {/* Información no editable */}
          <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">Email</Label>
                <p className="font-medium">{selectedUser?.email ?? '-'}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Rol</Label>
                <p className="font-medium capitalize">{selectedUser?.rol ?? '-'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {selectedUser?.rol === 'cliente' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="block w-72 max-w-full mx-auto text-left">
                    Nombre *
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="Ingresa el nombre"
                    value={editFormData.first_name}
                    onChange={(e) => handleEditFormChange('first_name', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="block w-72 max-w-full mx-auto text-left">
                    Apellido *
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Ingresa el apellido"
                    value={editFormData.last_name}
                    onChange={(e) => handleEditFormChange('last_name', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="block w-72 max-w-full mx-auto text-left">
                    Dirección *
                  </Label>

                  <Input
                    id="address"
                    placeholder="Calle, ciudad, código postal"
                    value={editFormData.address}
                    onChange={(e) => handleEditFormChange('address', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_id" className="block w-72 max-w-full mx-auto text-left">
                    Documento de Identidad *
                  </Label>

                  <Input
                    id="document_id"
                    placeholder="Número de documento"
                    value={editFormData.document_id}
                    onChange={(e) => handleEditFormChange('document_id', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="block w-72 max-w-full mx-auto text-left">
                    Número de Teléfono *
                  </Label>


                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={editFormData.phone_number}
                    onChange={(e) => handleEditFormChange('phone_number', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>

              </>
            )}

            {selectedUser?.rol === 'proveedor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="block w-72 max-w-full mx-auto text-left">
                    Nombre de la Empresa *
                  </Label>
                  <Input
                    id="company_name"
                    placeholder="Nombre de la empresa"
                    value={editFormData.company_name}
                    onChange={(e) => handleEditFormChange('company_name', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="block w-72 max-w-full mx-auto text-left">
                    Nombre de Contacto *
                  </Label>
                  <Input
                    id="contact_name"
                    placeholder="Persona de contacto"
                    value={editFormData.contact_name}
                    onChange={(e) => handleEditFormChange('contact_name', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identification" className="block w-72 max-w-full mx-auto text-left">
                    Identificación *
                  </Label>
                  <Input
                    id="identification"
                    placeholder="RUC o número de identificación"
                    value={editFormData.identification}
                    onChange={(e) => handleEditFormChange('identification', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="block w-72 max-w-full mx-auto text-left">
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={editFormData.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    required
                    className="mx-auto block text-gray-100 bg-[#2a4644] border-[#3d5a5a] rounded-md w-72 max-w-full placeholder:text-gray-300"
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveEdit}
              className="bg-[#3d5a5a] hover:bg-[#2a4644]"
            >
              Guardar Cambios
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
