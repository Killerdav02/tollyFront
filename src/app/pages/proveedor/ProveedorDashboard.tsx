import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Package, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { ReturnStatusBadge, ToolStatusBadge } from '@/app/components/StatusBadges';
import { listTools } from '../../../services/toolService';
import { listToolStatuses } from '../../../services/toolStatusService';
import { listPaymentsBySupplier } from '../../../services/paymentService';
import { listReturns } from '../../../services/returnService';
import type { Tool, ToolStatus, Payment, ReturnResponse } from '../../../services/types';

const SUPPLIER_ID_KEY = 'tolly_supplier_id';

function normalizeReturnStatus(status?: string): 'PENDING' | 'SENT' | 'RECEIVED' | 'DAMAGED' | 'CL_DAMAGED' | 'CL_INCOMPLETE' | 'SPP_INCOMPLETE' {
  const normalized = (status || '').toUpperCase();
  if (['CL_DAMAGED', 'CL_INCOMPLETE', 'SPP_INCOMPLETE'].includes(normalized)) return normalized as any;
  if (['SENT', 'ENVIADA', 'ENVIADO'].includes(normalized)) return 'SENT';
  if (['RECEIVED', 'RECIBIDA', 'RECIBIDO'].includes(normalized)) return 'RECEIVED';
  if (['DAMAGED', 'DANADA', 'DAÑADA'].includes(normalized)) return 'DAMAGED';
  return 'PENDING';
}

function resolveSupplierId(tools: Tool[]): number | null {
  const stored = localStorage.getItem(SUPPLIER_ID_KEY);
  if (stored && !Number.isNaN(Number(stored))) return Number(stored);
  const unique = Array.from(new Set(tools.map((tool) => tool.supplierId)));
  if (unique.length === 1) {
    localStorage.setItem(SUPPLIER_ID_KEY, String(unique[0]));
    return unique[0];
  }
  return null;
}

export function ProveedorDashboard() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [statuses, setStatuses] = useState<ToolStatus[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [returns, setReturns] = useState<ReturnResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [toolData, statusData, returnData] = await Promise.all([
          listTools(),
          listToolStatuses(),
          listReturns(),
        ]);
        setTools(toolData);
        setStatuses(statusData);
        setReturns(returnData);

        const supplierId = resolveSupplierId(toolData);
        if (supplierId) {
          const paymentData = await listPaymentsBySupplier(supplierId);
          setPayments(paymentData);
        }
      } catch {
        // Silent fail for dashboard
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusNameById = useMemo(() => {
    return statuses.reduce<Record<number, string>>((acc, status) => {
      acc[status.id] = status.name;
      return acc;
    }, {});
  }, [statuses]);

  const availableTools = tools.filter((tool) => {
    const name = (statusNameById[tool.statusId] || '').toUpperCase();
    return ['AVAILABLE', 'DISPONIBLE'].includes(name);
  });

  const pendingReturns = returns.filter((ret) =>
    ['SENT', 'CL_DAMAGED', 'CL_INCOMPLETE'].includes(normalizeReturnStatus(ret.returnStatusName))
  );
  const ingresosEsteMes = payments
    .filter((payment) => (payment.status || '').toUpperCase() === 'PAID')
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#3d5a5a]">Panel de Proveedor</h1>
        <p className="text-gray-600 mt-1">Gestiona tu inventario y reservas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Mis Herramientas
            </CardTitle>
            <Package className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tools.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {availableTools.length} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Devoluciones Pendientes
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReturns.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Por confirmar recepción
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos Registrados
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ingresosEsteMes.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Pagos asociados al proveedor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estado del Servicio
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : 'OK'}</div>
            <p className="text-xs text-gray-500 mt-1">Datos sincronizados</p>
          </CardContent>
        </Card>
      </div>

      {pendingReturns.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Acción Requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800">
              Tienes {pendingReturns.length} devolución(es) pendiente(s). Revisa la sección de Reservas.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Herramientas Recientes</CardTitle>
            <CardDescription>Últimos equipos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tools.slice(0, 5).map((tool) => (
                <div key={tool.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{tool.name}</p>
                    <p className="text-sm text-gray-500">ID #{tool.id}</p>
                  </div>
                  <div className="text-right">
                    <ToolStatusBadge
                      status={
                        (statusNameById[tool.statusId] || 'UNAVAILABLE').toUpperCase() as any
                      }
                    />
                  </div>
                </div>
              ))}
              {tools.length === 0 && (
                <p className="text-sm text-gray-500">No hay herramientas registradas.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devoluciones Recientes</CardTitle>
            <CardDescription>Últimas devoluciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returns.slice(0, 5).map((ret) => (
                <div key={ret.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">Devolución #{ret.id}</p>
                    <p className="text-sm text-gray-500">Reserva #{ret.reservationId}</p>
                  </div>
                  <div className="text-right">
                    <ReturnStatusBadge status={normalizeReturnStatus(ret.returnStatusName)} />
                  </div>
                </div>
              ))}
              {returns.length === 0 && (
                <p className="text-sm text-gray-500">No hay devoluciones registradas.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

