import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'success';
}

export function StatCard({ label, value, sub, icon, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn(
      'glass-panel rounded-xl p-5 animate-fade-in',
      variant === 'primary' && 'glow-primary',
      variant === 'accent' && 'glow-accent',
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1 tabular-nums text-foreground">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          variant === 'primary' && 'bg-primary/15 text-primary',
          variant === 'accent' && 'bg-accent/15 text-accent',
          variant === 'success' && 'bg-success/15 text-success',
          variant === 'default' && 'bg-muted text-muted-foreground',
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
