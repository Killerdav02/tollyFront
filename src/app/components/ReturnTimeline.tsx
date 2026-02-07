import { Check, Clock, Package, PackageCheck, AlertTriangle } from 'lucide-react';
import { ReturnStatus } from '../data/mockData';

interface ReturnTimelineProps {
  status: ReturnStatus;
  createdAt: string;
  sentAt?: string;
  receivedAt?: string;
}

export function ReturnTimeline({ status, createdAt, sentAt, receivedAt }: ReturnTimelineProps) {
  const steps = [
    {
      key: 'PENDING',
      label: 'Devolución Creada',
      icon: Clock,
      date: createdAt,
      active: true,
      completed: status !== 'PENDING',
    },
    {
      key: 'SENT',
      label: 'Envío Confirmado',
      icon: Package,
      date: sentAt,
      active: status === 'SENT',
      completed: status === 'RECEIVED' || status === 'DAMAGED',
    },
    {
      key: 'RECEIVED',
      label: status === 'DAMAGED' ? 'Recibido con Daño' : 'Recibido OK',
      icon: status === 'DAMAGED' ? AlertTriangle : PackageCheck,
      date: receivedAt,
      active: status === 'RECEIVED' || status === 'DAMAGED',
      completed: false,
      isDamaged: status === 'DAMAGED',
    },
  ];

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full border-2
                  ${step.completed || step.active
                    ? step.isDamaged
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-gray-100 text-gray-400'
                  }
                `}
              >
                {step.completed && !step.isDamaged ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              {!isLast && (
                <div
                  className={`
                    h-full min-h-[40px] w-0.5
                    ${step.completed ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex items-center justify-between">
                <h4
                  className={`font-medium ${
                    step.active || step.completed ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </h4>
                {step.date && (
                  <span className="text-sm text-gray-500">
                    {new Date(step.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              {step.key === 'PENDING' && step.active && (
                <p className="text-sm text-gray-500 mt-1">
                  Esperando confirmación de envío por parte del cliente
                </p>
              )}
              {step.key === 'SENT' && step.active && (
                <p className="text-sm text-gray-500 mt-1">
                  Esperando recepción por parte del proveedor
                </p>
              )}
              {step.isDamaged && step.active && (
                <p className="text-sm text-red-600 mt-1">
                  Se reportó daño en las herramientas. La reserva pasó a estado de incidente.
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
