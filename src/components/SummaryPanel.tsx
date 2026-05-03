import { ProjectSummary } from '@/types/project';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface SummaryPanelProps {
  summary: ProjectSummary;
  currency: string;
  revenue: number;
}

const rows = [
  { key: 'total_materials', label: '1. Materials', code: 1 },
  { key: 'total_subcontractors', label: '2. Subcontractors', code: 2 },
  { key: 'total_direct_manpower', label: '3. Direct Manpower', code: 3 },
  { key: 'total_direct_equipment', label: '4. Direct Equipment', code: 4 },
  { key: 'total_services', label: '5. Services', code: 5 },
  { key: 'total_indirect_manpower', label: '6. Indirect Manpower', code: 6 },
  { key: 'total_indirect_cost', label: '7. Indirect Cost', code: 7 },
] as const;

export function SummaryPanel({ summary, currency, revenue }: SummaryPanelProps) {
  const fmt = (v: number) => formatCurrency(v, currency);

  return (
    <div className="glass-panel rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Project Summary
      </h3>

      {/* Categories */}
      <div className="space-y-1.5">
        {rows.map(r => (
          <div key={r.key} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="tabular-nums font-medium">{fmt(summary[r.key])}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-3 space-y-1.5">
        <SummaryRow label="Total Budget (1-7)" value={fmt(summary.total_budget)} bold />
        <SummaryRow label="Contingencies (15%)" value={fmt(summary.contingencies)} />
        <SummaryRow label="Grand Total (8)" value={fmt(summary.grand_total_8)} bold />
      </div>

      <div className="border-t border-border pt-3 space-y-1.5">
        <SummaryRow label="GM Reserve (5%)" value={fmt(summary.mgmt_reserve_gm)} />
        <SummaryRow label="CEO Reserve (5%)" value={fmt(summary.mgmt_reserve_ceo)} />
        <SummaryRow label="Risk Factor (5%)" value={fmt(summary.risk_factor)} />
        <SummaryRow label="Grand Total (10)" value={fmt(summary.grand_total_10)} bold accent />
      </div>

      <div className="border-t border-border pt-3 space-y-1.5">
        <SummaryRow label="Project Revenue" value={fmt(revenue)} primary />
        <SummaryRow
          label="Optimistic Profit"
          value={`${fmt(summary.optimistic_profit)} (${formatPercent(summary.optimistic_profit_pct)})`}
          success={summary.optimistic_profit > 0}
          danger={summary.optimistic_profit < 0}
        />
        <SummaryRow
          label="Pessimistic Profit"
          value={`${fmt(summary.pessimistic_profit)} (${formatPercent(summary.pessimistic_profit_pct)})`}
          success={summary.pessimistic_profit > 0}
          danger={summary.pessimistic_profit < 0}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold, accent, primary, success, danger }: {
  label: string; value: string;
  bold?: boolean; accent?: boolean; primary?: boolean; success?: boolean; danger?: boolean;
}) {
  return (
    <div className={cn('flex justify-between text-sm', bold && 'font-bold')}>
      <span className={cn(
        'text-muted-foreground',
        primary && 'text-primary',
        accent && 'text-accent',
      )}>{label}</span>
      <span className={cn(
        'tabular-nums font-medium',
        accent && 'text-accent',
        primary && 'text-primary',
        success && 'text-success',
        danger && 'text-destructive',
      )}>{value}</span>
    </div>
  );
}
