export function formatCurrency(value: number, currency: string = 'EGP'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }
  return new Intl.NumberFormat('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value) + ' EGP';
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%';
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved': return 'bg-success/20 text-success';
    case 'submitted': return 'bg-primary/20 text-primary';
    case 'draft': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
}
