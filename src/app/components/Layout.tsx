import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { Button } from '@/app/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  CreditCard, 
  FileText, 
  Package, 
  Calendar,
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  role: 'admin' | 'proveedor' | 'cliente';
}

export function Layout({ role }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin', icon: LayoutDashboard, label: 'Panel' },
          { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
          { to: '/admin/herramientas', icon: Wrench, label: 'Herramientas' },
          { to: '/admin/pagos', icon: CreditCard, label: 'Pagos' },
          { to: '/admin/reportes', icon: FileText, label: 'Reportes' },
        ];
      case 'proveedor':
        return [
          { to: '/proveedor', icon: LayoutDashboard, label: 'Panel' },
          { to: '/proveedor/inventario', icon: Package, label: 'Inventario' },
          { to: '/proveedor/reservas', icon: Calendar, label: 'Reservas' },
          { to: '/proveedor/facturacion', icon: CreditCard, label: 'Facturación' },
        ];
      case 'cliente':
        return [
          { to: '/cliente', icon: LayoutDashboard, label: 'Inicio' },
          { to: '/cliente/explorar', icon: Search, label: 'Explorar' },
          { to: '/cliente/reservas', icon: Calendar, label: 'Mis Reservas' },
          { to: '/cliente/pagos', icon: CreditCard, label: 'Pagos' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#3d5a5a] shadow-sm border-b border-[#2a4644]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wrench className="w-8 h-8 text-[#7fb3b0]" />
              <span className="ml-2 text-xl font-semibold text-white">
                Tolly
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center px-3 py-2 rounded-md text-[#e8f2f1] hover:bg-[#2a4644] hover:text-white transition-colors"
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm text-[#a3ccc9]">
                {user?.nombre}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex bg-transparent border-[#7fb3b0] text-[#7fb3b0] hover:bg-[#7fb3b0] hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-white hover:bg-[#2a4644]"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2a4644] bg-[#3d5a5a]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-[#e8f2f1] hover:bg-[#2a4644]"
                >
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-[#e8f2f1] hover:bg-[#2a4644]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}