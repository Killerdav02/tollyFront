import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminHerramientas } from './pages/admin/AdminHerramientas';
import { AdminPagos } from './pages/admin/AdminPagos';
import { AdminReportes } from './pages/admin/AdminReportes';

// Proveedor pages
import { ProveedorDashboard } from './pages/proveedor/ProveedorDashboard';
import { ProveedorInventario } from './pages/proveedor/ProveedorInventario';
import { ProveedorReservas } from './pages/proveedor/ProveedorReservas';
import { ProveedorFacturacion } from './pages/proveedor/ProveedorFacturacion';

// Cliente pages
import { ClienteDashboard } from './pages/cliente/ClienteDashboard';
import { ClienteExplorar } from './pages/cliente/ClienteExplorar';
import { ClienteReservas } from './pages/cliente/ClienteReservas';
import { ClientePagos } from './pages/cliente/ClientePagos';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin',
    element: <Layout role="admin" />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'usuarios', element: <AdminUsuarios /> },
      { path: 'herramientas', element: <AdminHerramientas /> },
      { path: 'pagos', element: <AdminPagos /> },
      { path: 'reportes', element: <AdminReportes /> },
    ],
  },
  {
    path: '/proveedor',
    element: <Layout role="proveedor" />,
    children: [
      { index: true, element: <ProveedorDashboard /> },
      { path: 'inventario', element: <ProveedorInventario /> },
      { path: 'reservas', element: <ProveedorReservas /> },
      { path: 'facturacion', element: <ProveedorFacturacion /> },
    ],
  },
  {
    path: '/cliente',
    element: <Layout role="cliente" />,
    children: [
      { index: true, element: <ClienteDashboard /> },
      { path: 'explorar', element: <ClienteExplorar /> },
      { path: 'reservas', element: <ClienteReservas /> },
      { path: 'pagos', element: <ClientePagos /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);