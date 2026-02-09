import React, { useState } from 'react';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { Calendar } from '@/app/components/ui/calendar';
import { Calendar as CalendarIcon, Search, X, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentsFiltersProps {
  onFilter: (filters: any) => void;
  isLoading: boolean;
}


type PaymentStatus = 'TODOS' | 'PAID' | 'PENDING' | 'CANCELLED';

const PaymentsFilters: React.FC<PaymentsFiltersProps> = ({ onFilter, isLoading }) => {

  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('TODOS');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const formatISO = (date?: Date) =>
      date ? date.toISOString().slice(0, 19) : '';
    onFilter({
      status: selectedStatus === 'TODOS' ? '' : selectedStatus,
      from: formatISO(startDate),
      to: formatISO(endDate),
    });
  };

  const handleClear = () => {
    setSelectedStatus('TODOS');
    setStartDate(undefined);
    setEndDate(undefined);
    onFilter({ status: '', from: '', to: '' });
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter 1: Estado */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado del Pago</Label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as PaymentStatus)}
            disabled={isLoading}
          >
            <SelectTrigger id="status" className="w-full text-gray-100">
              <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="PAID">Pagado</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter 2: Fecha Desde */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Desde</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filter 3: Fecha Hasta */}
        <div className="space-y-2">
          <Label htmlFor="endDate">Hasta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-end gap-2">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-[#3d5a5a] hover:bg-[#2a4644]"
            type="submit"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
            className="w-full"
            type="button"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PaymentsFilters;
