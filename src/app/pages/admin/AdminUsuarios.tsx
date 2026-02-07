import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { usuarios } from '@/app/data/mockData';
import { UserPlus, Search, MoreVertical } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

export function AdminUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsuarios = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra proveedores y clientes de la plataforma</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Total: {usuarios.length} usuarios registrados</CardDescription>
            </div>
            <div className="w-64">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-[#3d5a5a] p-2 rounded-md">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 bg-transparent"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rol</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha Registro</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-semibold mr-3">
                          {usuario.nombre.charAt(0)}
                        </div>
                        <span className="font-medium">{usuario.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{usuario.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        usuario.rol === 'admin' ? 'default' :
                        usuario.rol === 'proveedor' ? 'secondary' :
                        'outline'
                      }>
                        {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(usuario.fechaRegistro).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={usuario.estado === 'activo' ? 'default' : 'secondary'}>
                        {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usuarios.filter(u => u.rol === 'proveedor').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usuarios.filter(u => u.rol === 'cliente').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usuarios.filter(u => u.estado === 'activo').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}