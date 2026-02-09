import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { UiUser } from './types';

interface Props {
  usuarios: UiUser[];
}

export function UsuariosStatsCards({ usuarios }: Props) {
  return (
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
  );
}
