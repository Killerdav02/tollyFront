import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Página No Encontrada</CardTitle>
          <CardDescription>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-gray-300">404</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Posibles razones:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• La URL puede estar mal escrita</li>
              <li>• La página fue eliminada o movida</li>
              <li>• No tienes permisos para acceder</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => navigate(-1)} variant="outline">
              Volver Atrás
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Contacta soporte
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
