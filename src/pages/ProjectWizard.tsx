import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ProjectWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
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

  const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">إنشاء مشروع جديد</h1>
        <p className="text-sm text-muted-foreground mt-1">البيانات الأساسية للمشروع</p>
      </div>

      <div className="glass-panel rounded-xl p-6 space-y-5 animate-fade-in">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    form.currency === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>
          <FormField label="Project Revenue (Selling Price)" value={String(form.project_revenue)} onChange={v => updateForm('project_revenue', parseFloat(v) || 0)} type="number" />
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-5 mt-5">
          <FormField label="PM Target (%)" value={String(form.pm_target)} onChange={v => updateForm('pm_target', parseFloat(v) || 0)} type="number" />
          <FormField label="OM Target (%)" value={String(form.om_target)} onChange={v => updateForm('om_target', parseFloat(v) || 0)} type="number" />
          <FormField label="MD Target (%)" value={String(form.md_target)} onChange={v => updateForm('md_target', parseFloat(v) || 0)} type="number" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          إلغاء
        </button>
        <button
          disabled={submitting}
          onClick={async () => {
            if (!user) return;
            setSubmitting(true);
            const { data, error } = await supabase.from('projects').insert({
              user_id: user.id,
              cost_center_number: form.cost_center_number,
              cost_center_name: form.cost_center_name,
              project_name: form.project_name,
              revision_number: form.revision_number,
              revision_date: form.revision_date,
              currency: form.currency,
              project_revenue: form.project_revenue,
              pm_target: form.pm_target / 100,
              om_target: form.om_target / 100,
              md_target: form.md_target / 100,
            } as any).select('id').single();
            
            setSubmitting(false);
            if (error) {
              toast({ title: 'خطأ في الإنشاء', description: error.message, variant: 'destructive' });
            } else if (data) {
              toast({ title: 'تم إنشاء المشروع بنجاح' });
              navigate(`/projects/${data.id}`);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          {submitting ? 'جاري الإنشاء...' : 'إنشاء المشروع وبدء التفاصيل'}
        </button>
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
