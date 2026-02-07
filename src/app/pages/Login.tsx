import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../auth/useAuth';
type UserRole = 'cliente' | 'proveedor' | 'admin';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Wrench, AlertCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  const [localError, setLocalError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    await login({ email, password });
    if (user && user.rol === "admin") {
      navigate("/admin");
    } else if (user && user.rol === "proveedor") {
      navigate("/proveedor");
    } else if (user && user.rol === "cliente") {
      navigate("/cliente");
    } else if (user && user.rol) {
      setLocalError("Rol no reconocido. Contacta al administrador.");
    } else if (!error) {
      setLocalError("Credenciales incorrectas o usuario no encontrado.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Izquierdo - Ilustración */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-[#e8f2f1] items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#7fb3b0] opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#3d5a5a] opacity-10 rounded-full"></div>
        
        <div className="relative z-10 max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-[#3d5a5a] rounded-xl shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3d5a5a]">Tolly</h1>
              <p className="text-sm text-gray-600">Alquiler de Herramientas</p>
            </div>
          </div>
          
          {/* Illustration placeholder */}
          <div className="bg-[#c5dbd9] rounded-3xl p-12 shadow-xl">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Wrench className="w-32 h-32 text-[#3d5a5a] opacity-20" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#7fb3b0] rounded-full flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-[#3d5a5a] mb-2">
                Bienvenido a Tolly
              </h2>
              <p className="text-gray-700">
                La plataforma completa para alquiler de herramientas profesionales
              </p>
            </div>
          </div>
          
          {/* Footer text */}
          <p className="text-xs text-gray-500 mt-8">
            © 2025 Tolly. Sistema de gestión de alquiler de herramientas.
          </p>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="flex-1 lg:w-1/2 bg-[#3d5a5a] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-3 bg-[#7fb3b0] rounded-xl">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Tolly</h1>
              <p className="text-sm text-[#a3ccc9]">Alquiler de Herramientas</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
              <p className="text-[#a3ccc9]">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {(error || localError) && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{localError || error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-[#2a4644] border-[#2a4644] text-white placeholder:text-gray-400 focus:border-[#7fb3b0] focus:ring-[#7fb3b0]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-[#2a4644] border-[#2a4644] text-white placeholder:text-gray-400 focus:border-[#7fb3b0] focus:ring-[#7fb3b0]"
                />
                <div className="text-right">
                  <a href="#" className="text-xs text-[#7fb3b0] hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Campo de tipo de usuario eliminado, estilos intactos */}

              <Button 
                type="submit" 
                className="w-full bg-[#7fb3b0] hover:bg-[#6da39f] text-white font-medium py-6 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Login to Tolly'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-[#a3ccc9]">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#7fb3b0] hover:underline font-medium">
                    Register Now
                  </Link>
                </p>
              </div>

              {/* Sección de credenciales de prueba eliminada */}
            </form>

            <p className="text-xs text-center text-gray-400 mt-8">
              Terms and Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}