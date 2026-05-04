import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { MATERIAL_SUB_CATEGORIES, INDIRECT_COST_SUB_CATEGORIES, INDIRECT_MANPOWER_ROLES_ONSITE, INDIRECT_MANPOWER_ROLES_OFFSITE } from '@/types/project';
import { formatCurrency } from '@/lib/formatters';
import { calculateSummary } from '@/types/project';
import { SummaryPanel } from '@/components/SummaryPanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 1, title: 'Project Info' },
  { id: 2, title: 'Cost Categories' },
  { id: 3, title: 'Indirect Costs' },
  { id: 4, title: 'Review' },
];

export default function ProjectWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    cost_center_number: '',
    cost_center_name: '',
    project_name: '',
    revision_number: 0,
    revision_date: new Date().toISOString().split('T')[0],
    currency: 'EGP' as 'EGP' | 'USD',
    project_revenue: 0,
    pm_target: 85,
    om_target: 7,
    md_target: 8,
  });
  const [costs, setCosts] = useState({
    materials: 0,
    subcontractors: 0,
    direct_manpower: 0,
    direct_equipment: 0,
    services: 0,
    indirect_manpower: 0,
    indirect_cost: 0,
    overheads: 0,
  });

  const summary = calculateSummary(
    costs.materials, costs.subcontractors, costs.direct_manpower,
    costs.direct_equipment, costs.services, costs.indirect_manpower,
    costs.indirect_cost, costs.overheads, form.project_revenue
  );

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const updateCost = (key: string, value: number) => setCosts(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 max-w-[1400px] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-sm text-muted-foreground mt-1">Budget planning wizard</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                step === s.id ? 'bg-primary text-primary-foreground' :
                step > s.id ? 'bg-success/20 text-success' :
                'bg-muted text-muted-foreground'
              )}
            >
              {step > s.id ? <Check className="w-3 h-3" /> : <span>{s.id}</span>}
              {s.title}
            </button>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Project Info */}
          {step === 1 && (
            <div className="glass-panel rounded-xl p-6 space-y-5 animate-fade-in">
              <h2 className="text-lg font-semibold">Project Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Cost Center Number" value={form.cost_center_number} onChange={v => updateForm('cost_center_number', v)} placeholder="CC-2024-XXX" />
                <FormField label="Cost Center Name" value={form.cost_center_name} onChange={v => updateForm('cost_center_name', v)} />
                <FormField label="Project Name" value={form.project_name} onChange={v => updateForm('project_name', v)} className="md:col-span-2" />
                <FormField label="Revision Number" value={String(form.revision_number)} onChange={v => updateForm('revision_number', parseInt(v) || 0)} type="number" />
                <FormField label="Revision Date" value={form.revision_date} onChange={v => updateForm('revision_date', v)} type="date" />
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Currency</label>
                  <div className="flex gap-2 mt-1.5">
                    {(['EGP', 'USD'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => updateForm('currency', c)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                          form.currency === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >{c}</button>
                    ))}
                  </div>
                </div>
                <FormField label="Project Revenue (Selling Price)" value={String(form.project_revenue)} onChange={v => updateForm('project_revenue', parseFloat(v) || 0)} type="number" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="PM Target (%)" value={String(form.pm_target)} onChange={v => updateForm('pm_target', parseFloat(v) || 0)} type="number" />
                <FormField label="OM Target (%)" value={String(form.om_target)} onChange={v => updateForm('om_target', parseFloat(v) || 0)} type="number" />
                <FormField label="MD Target (%)" value={String(form.md_target)} onChange={v => updateForm('md_target', parseFloat(v) || 0)} type="number" />
              </div>
            </div>
          )}

          {/* Step 2: Cost Categories */}
          {step === 2 && (
            <div className="glass-panel rounded-xl p-6 space-y-5 animate-fade-in">
              <h2 className="text-lg font-semibold">Direct Cost Categories</h2>
              <p className="text-sm text-muted-foreground">Enter total amounts for each category. Detail can be added later.</p>
              <div className="space-y-3">
                <CostField label="1. Materials" value={costs.materials} onChange={v => updateCost('materials', v)} currency={form.currency} />
                <CostField label="2. Subcontractors" value={costs.subcontractors} onChange={v => updateCost('subcontractors', v)} currency={form.currency} />
                <CostField label="3. Direct Manpower" value={costs.direct_manpower} onChange={v => updateCost('direct_manpower', v)} currency={form.currency} />
                <CostField label="4. Direct Equipment" value={costs.direct_equipment} onChange={v => updateCost('direct_equipment', v)} currency={form.currency} />
                <CostField label="5. Services" value={costs.services} onChange={v => updateCost('services', v)} currency={form.currency} />
              </div>
            </div>
          )}

          {/* Step 3: Indirect Costs */}
          {step === 3 && (
            <div className="glass-panel rounded-xl p-6 space-y-5 animate-fade-in">
              <h2 className="text-lg font-semibold">Indirect Costs & Overheads</h2>
              <div className="space-y-3">
                <CostField label="6. Indirect Manpower" value={costs.indirect_manpower} onChange={v => updateCost('indirect_manpower', v)} currency={form.currency} />
                <CostField label="7. Indirect Cost" value={costs.indirect_cost} onChange={v => updateCost('indirect_cost', v)} currency={form.currency} />
                <CostField label="9. Overheads" value={costs.overheads} onChange={v => updateCost('overheads', v)} currency={form.currency} />
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Contingencies (15%), GM Reserve (5%), CEO Reserve (5%), and Risk Factor (5%) are calculated automatically from the total budget.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="glass-panel rounded-xl p-6 space-y-5 animate-fade-in">
              <h2 className="text-lg font-semibold">Review & Submit</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Project Name" value={form.project_name || '—'} />
                <InfoRow label="Cost Center" value={form.cost_center_number || '—'} />
                <InfoRow label="Currency" value={form.currency} />
                <InfoRow label="Revenue" value={formatCurrency(form.project_revenue, form.currency)} />
              </div>
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold mb-3">Cost Breakdown</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(costs).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-muted/30 rounded">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="tabular-nums">{formatCurrency(value, form.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {summary.optimistic_profit < 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                  ⚠ Warning: Optimistic profit is negative. Review your costs.
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {step > 1 ? 'Previous' : 'Cancel'}
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-accent text-accent-foreground hover:opacity-90 transition-opacity font-medium"
              >
                <Check className="w-4 h-4" />
                Submit Budget
              </button>
            )}
          </div>
        </div>

        {/* Live Summary */}
        <div>
          <SummaryPanel summary={summary} currency={form.currency} revenue={form.project_revenue} />
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', placeholder, className }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full mt-1.5 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary tabular-nums"
      />
    </div>
  );
}

function CostField({ label, value, onChange, currency }: {
  label: string; value: number; onChange: (v: number) => void; currency: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
      <span className="text-sm font-medium w-48">{label}</span>
      <input
        type="number"
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder="0"
        className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <span className="text-xs text-muted-foreground w-10">{currency}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
