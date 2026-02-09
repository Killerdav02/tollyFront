
import React, { useState } from 'react';
import { PaymentWithClient } from './types/payments';
import { usePayments } from './hooks/usePayments';
import PaymentsFilters from './PaymentsFilters';
import PaymentsTable from './PaymentsTable';
import PaymentDetailSheet from './PaymentDetailSheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';

import PaymentStatusBadge from './PaymentStatusBadge';
import { DollarSign, TrendingUp, Calendar as CalendarIcon, CreditCard } from 'lucide-react';

export default function AdminPagosPage() {
    const { payments, isLoading, error, incomeReport, setPayments } = usePayments();
    const [selectedPayment, setSelectedPayment] = useState<PaymentWithClient | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    // Calcular promedio de pago
    const totalTransacciones = payments.length;
    const promedioPago = totalTransacciones > 0 ? Math.round((incomeReport.month || 0) / totalTransacciones) : 0;

    const handleViewDetail = (payment: PaymentWithClient) => {
        setSelectedPayment(payment);
        setDetailOpen(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Control de transacciones y facturación</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Ingresos Totales
                        </CardTitle>
                        <DollarSign className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${incomeReport.total?.toLocaleString?.() ?? 0}</div>
                        <p className="text-xs text-gray-500 mt-1">Acumulado histórico</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Ingresos Este Mes
                        </CardTitle>
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${incomeReport.total?.toLocaleString?.() ?? 0}</div>
                        <p className="text-xs text-green-600 mt-1">+15% vs mes anterior</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Transacciones
                        </CardTitle>
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTransacciones}</div>
                        <p className="text-xs text-gray-500 mt-1">Pagos procesados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Promedio Pago
                        </CardTitle>
                        <CreditCard className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${promedioPago}</div>
                        <p className="text-xs text-gray-500 mt-1">Por transacción</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros de Búsqueda */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#3d5a5a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
                        <CardTitle className="!mb-0">Filtros de Búsqueda</CardTitle>
                    </div>
                    <CardDescription>Filtra las transacciones por estado y rango de fechas</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <PaymentsFilters onFilter={setPayments} isLoading={isLoading} />
                </CardContent>
            </Card>
            {/* Payment List - Desktop Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Pagos</CardTitle>
                    <CardDescription>
                        {payments.length !== 0
                            ? `Total: ${payments.length} transacciones`
                            : 'No hay transacciones'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentsTable
                        payments={payments}
                        isLoading={isLoading}
                        onViewDetail={handleViewDetail}
                    />
                </CardContent>
            </Card>
            <PaymentDetailSheet
                open={detailOpen}  
                payment={selectedPayment}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
