import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Wrench, AlertCircle, ArrowLeft } from 'lucide-react';
import { register } from '../../services/authService';

export function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'CLIENT',
        firstName: '',
        lastName: '',
        address: '',
        document: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!/^\d{8,15}$/.test((formData.phone || '').replace(/[-()\s]/g, ''))) {
            setError('Ingresa un número de teléfono válido');
            return;
        }

        setLoading(true);

        try {
            const body = {
                email: formData.email,
                password: formData.password,
                role: formData.role,
                firstName: formData.firstName,
                lastName: formData.lastName,
                address: formData.address,
                document: formData.document,
                phone: formData.phone
            };
            await register(body);
            navigate('/', { state: { message: 'Registro exitoso. Por favor inicia sesión.' } });
        } catch (err: any) {
            console.log('Error en registro:', err);
            setError(err.response?.data?.message || 'Error al registrarse. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Lado Izquierdo - Ilustración */}
            <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-50 to-[#e8f2f1] items-center justify-center p-12 relative overflow-hidden">
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
                                Únete a Tolly
                            </h2>
                            <p className="text-gray-700">
                                Crea tu cuenta y accede a las mejores herramientas profesionales
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
            <div className="flex-1 lg:w-3/5 bg-[#3d5a5a] flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-2xl py-8">
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
                        {/* Back to login */}
                        <Link
                            to="/"
                            className="inline-flex items-center text-[#7fb3b0] hover:text-[#a3ccc9] transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al login
                        </Link>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
                            <p className="text-[#a3ccc9]">Completa el formulario para registrarte como cliente</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert variant="destructive" className="bg-red-900/50 border-red-700 text-white">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="block text-sm font-medium text-white">Nombre</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="block text-sm font-medium text-white">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm font-medium text-white">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                />
                            </div>

                            {/* Teléfono y Documento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="block text-sm font-medium text-white">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-2 bg-[#2a4644] border-[#2a4644] text-white placeholder:text-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="document" className="block text-sm font-medium text-white">Documento</Label>
                                    <Input
                                        id="document"
                                        name="document"
                                        type="text"
                                        value={formData.document}
                                        onChange={handleChange}
                                        required
                                        className="block w-full px-3 py-2 bg-[#2a4644] border-[#2a4644] text-white placeholder:text-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Dirección */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="block text-sm font-medium text-white">Dirección</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="block text-sm font-medium text-white">Contraseña</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="block w-full px-3 py-2 bg-[#2a4644] border-[#2a4644] text-white placeholder:text-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-[#7fb3b0] focus:border-[#7fb3b0] sm:text-sm"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#7fb3b0] hover:bg-[#6da39f] text-white font-medium py-6 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Registrando...' : 'Crear Cuenta'}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-[#a3ccc9]">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link to="/" className="text-[#7fb3b0] hover:underline font-medium">
                                        Inicia sesión
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <p className="text-xs text-center text-gray-400 mt-8">
                            Al crear una cuenta, aceptas nuestros Términos y Condiciones
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
