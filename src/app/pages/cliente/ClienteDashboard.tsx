import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { herramientas, reservas } from '@/app/data/mockData';
import { Search, Calendar, CreditCard, Wrench, ArrowRight } from 'lucide-react';

export function ClienteDashboard() {
  const misReservas = reservas.filter(r => r.clienteId === '3');
  const reservasActivas = misReservas.filter(r => r.estado === 'confirmada' || r.estado === 'en-uso');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Bienvenido</h1>
        <p className="text-gray-600 mt-1">Encuentra y alquila las herramientas que necesitas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/cliente/explorar">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#7fb3b0] bg-[#e8f2f1]">
            <CardHeader>
              <Search className="w-8 h-8 text-[#3d5a5a] mb-2" />
              <CardTitle className="text-[#3d5a5a]">Explorar Herramientas</CardTitle>
              <CardDescription className="text-[#5a7876]">
                Busca entre nuestro catálogo completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="text-[#7fb3b0] hover:text-[#6da39f]">
                Ver catálogo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/cliente/reservas">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#7fb3b0] bg-[#e8f2f1]">
            <CardHeader>
              <Calendar className="w-8 h-8 text-[#3d5a5a] mb-2" />
              <CardTitle className="text-[#3d5a5a]">Mis Reservas</CardTitle>
              <CardDescription className="text-[#5a7876]">
                Gestiona tus alquileres activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="text-[#7fb3b0] hover:text-[#6da39f]">
                Ver reservas <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/cliente/pagos">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[#7fb3b0] bg-[#e8f2f1]">
            <CardHeader>
              <CreditCard className="w-8 h-8 text-[#3d5a5a] mb-2" />
              <CardTitle className="text-[#3d5a5a]">Pagos</CardTitle>
              <CardDescription className="text-[#5a7876]">
                Revisa tu historial de pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="text-[#7fb3b0] hover:text-[#6da39f]">
                Ver pagos <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
