export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-ES');
}
