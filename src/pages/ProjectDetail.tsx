import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProjectItems } from '@/hooks/useProjectItems';
import { SummaryPanel } from '@/components/SummaryPanel';
import { calculateSummary } from '@/types/project';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { ArrowLeft, Download, FileText, Plus, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tabKeys = ['summary', 'materials', 'subcontractors', 'direct-manpower', 'direct-equipment', 'services', 'indirect-manpower', 'indirect-cost', 'boq'] as const;
const tabLabels = ['Summary', 'Materials', 'Subcontractors', 'Direct Manpower', 'Direct Equipment', 'Services', 'Indirect Manpower', 'Indirect Cost', 'BOQ'];

interface DBProject {
  id: string;
  cost_center_number: string;
  cost_center_name: string;
  project_name: string;
  revision_number: number;
  revision_date: string;
  currency: string;
  project_revenue: number;
  pm_target: number;
  om_target: number;
  md_target: number;
  status: string;
  materials: number;
  subcontractors: number;
  direct_manpower: number;
  direct_equipment: number;
  services: number;
  indirect_manpower: number;
  indirect_cost: number;
  overheads: number;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [project, setProject] = useState<DBProject | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchProject = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      setProject(data as unknown as DBProject);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  // Item hooks for each category
  const materials = useProjectItems<any>('material_items', id, userId);
  const subs = useProjectItems<any>('subcontractor_items', id, userId);
  const dManpower = useProjectItems<any>('direct_manpower_items', id, userId);
  const dEquip = useProjectItems<any>('direct_equipment_items', id, userId);
  const services = useProjectItems<any>('service_items', id, userId);
  const iManpower = useProjectItems<any>('indirect_manpower_items', id, userId);
  const iCost = useProjectItems<any>('indirect_cost_items', id, userId);
  const boq = useProjectItems<any>('boq_items', id, userId);

  // Update project totals whenever items change
  useEffect(() => {
    if (!id || !project) return;
    const updates = {
      materials: materials.totalAmount,
      subcontractors: subs.totalAmount,
      direct_manpower: dManpower.totalAmount,
      direct_equipment: dEquip.totalAmount,
      services: services.totalAmount,
      indirect_manpower: iManpower.totalAmount,
      indirect_cost: iCost.totalAmount,
    };
    supabase.from('projects').update(updates).eq('id', id).then(() => {
      setProject(prev => prev ? { ...prev, ...updates } : prev);
    });
  }, [materials.totalAmount, subs.totalAmount, dManpower.totalAmount, dEquip.totalAmount, services.totalAmount, iManpower.totalAmount, iCost.totalAmount]);

  if (loading) return <div className="p-6 text-muted-foreground">جاري التحميل...</div>;
  if (!project) return <div className="p-6 text-destructive">المشروع غير موجود</div>;

  const summary = calculateSummary(
    materials.totalAmount, subs.totalAmount, dManpower.totalAmount,
    dEquip.totalAmount, services.totalAmount, iManpower.totalAmount,
    iCost.totalAmount, project.overheads, project.project_revenue
  );

  return (
    <div className="p-6 max-w-[1600px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.project_name}</h1>
            <p className="text-sm text-muted-foreground">
              {project.cost_center_number} · Rev {project.revision_number} · {project.currency}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" /> Export Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabKeys.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}>
            {tabLabels[i]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'summary' && <SummaryTable summary={summary} currency={project.currency} />}

          {activeTab === 'materials' && (
            <EditableTable
              title="Materials" hook={materials} userId={userId}
              columns={[
                { key: 'sub_category', label: 'Sub-Category', type: 'text' },
                { key: 'supplier_name', label: 'Supplier', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'subcontractors' && (
            <EditableTable
              title="Subcontractors" hook={subs} userId={userId}
              columns={[
                { key: 'type', label: 'Type', type: 'text' },
                { key: 'company_name', label: 'Company', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'direct-manpower' && (
            <EditableTable
              title="Direct Manpower" hook={dManpower} userId={userId}
              columns={[
                { key: 'discipline', label: 'Discipline', type: 'text' },
                { key: 'role', label: 'Role', type: 'text' },
                { key: 'manweeks', label: 'Man-weeks', type: 'number' },
                { key: 'rate_per_week', label: 'Rate/Week', type: 'number' },
                { key: 'amount', label: 'Amount', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'direct-equipment' && (
            <EditableTable
              title="Direct Equipment" hook={dEquip} userId={userId}
              columns={[
                { key: 'discipline', label: 'Discipline', type: 'text' },
                { key: 'equipment_name', label: 'Equipment', type: 'text' },
                { key: 'quantity', label: 'Qty', type: 'number' },
                { key: 'unit', label: 'Unit', type: 'text' },
                { key: 'unit_cost', label: 'Unit Cost', type: 'number' },
                { key: 'amount', label: 'Amount', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'services' && (
            <EditableTable
              title="Services" hook={services} userId={userId}
              columns={[
                { key: 'discipline', label: 'Discipline', type: 'text' },
                { key: 'service_name', label: 'Service', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'indirect-manpower' && (
            <EditableTable
              title="Indirect Manpower" hook={iManpower} userId={userId}
              columns={[
                { key: 'location_type', label: 'Location', type: 'text' },
                { key: 'role', label: 'Role', type: 'text' },
                { key: 'cost_code', label: 'Cost Code', type: 'text' },
                { key: 'manweeks', label: 'Man-weeks', type: 'number' },
                { key: 'rate_per_week', label: 'Rate/Week', type: 'number' },
                { key: 'amount', label: 'Amount', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'indirect-cost' && (
            <EditableTable
              title="Indirect Cost" hook={iCost} userId={userId}
              columns={[
                { key: 'sub_category', label: 'Sub-Category', type: 'text' },
                { key: 'item_name', label: 'Item', type: 'text' },
                { key: 'amount', label: 'Amount', type: 'number' },
                { key: 'notes', label: 'Notes', type: 'text' },
              ]}
              currency={project.currency}
            />
          )}

          {activeTab === 'boq' && (
            <EditableTable
              title="Bill of Quantities" hook={boq} userId={userId}
              columns={[
                { key: 'block', label: 'Block', type: 'text' },
                { key: 'item_code', label: 'Code', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
                { key: 'unit', label: 'Unit', type: 'text' },
                { key: 'quantity', label: 'Qty', type: 'number' },
                { key: 'supply_materials', label: 'Supply', type: 'number' },
                { key: 'logistics', label: 'Logistics', type: 'number' },
                { key: 'selling_price', label: 'Selling Price', type: 'number' },
              ]}
              currency={project.currency}
            />
          )}
        </div>

        <div>
          <SummaryPanel summary={summary} currency={project.currency} revenue={project.project_revenue} />
        </div>
      </div>
    </div>
  );
}

// --- Summary Table ---
function SummaryTable({ summary, currency }: { summary: any; currency: string }) {
  const fmt = (v: number) => formatCurrency(v, currency);
  const categories = [
    { code: 1, name: 'MATERIALS', value: summary.total_materials },
    { code: 2, name: 'SUBCONTRACTORS', value: summary.total_subcontractors },
    { code: 3, name: 'DIRECT MANPOWER', value: summary.total_direct_manpower },
    { code: 4, name: 'DIRECT EQUIPMENTS', value: summary.total_direct_equipment },
    { code: 5, name: 'SERVICES', value: summary.total_services },
    { code: 6, name: 'INDIRECT MANPOWER', value: summary.total_indirect_manpower },
    { code: 7, name: 'INDIRECT COST', value: summary.total_indirect_cost },
  ];

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">SUMMARY 10 — Budget Breakdown</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
            <th className="text-left p-3 font-medium">Code</th>
            <th className="text-left p-3 font-medium">Category</th>
            <th className="text-right p-3 font-medium">Amount ({currency})</th>
            <th className="text-right p-3 font-medium">% of Budget</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.code} className="border-b border-border/30 hover:bg-muted/20">
              <td className="p-3 tabular-nums text-muted-foreground">{cat.code}</td>
              <td className="p-3 font-medium">{cat.name}</td>
              <td className="p-3 text-right tabular-nums">{fmt(cat.value)}</td>
              <td className="p-3 text-right tabular-nums text-muted-foreground">
                {summary.total_budget > 0 ? ((cat.value / summary.total_budget) * 100).toFixed(1) + '%' : '—'}
              </td>
            </tr>
          ))}
          <tr className="border-t-2 border-primary/30 bg-primary/5 font-bold">
            <td className="p-3"></td>
            <td className="p-3">TOTAL BUDGET (1-7)</td>
            <td className="p-3 text-right tabular-nums">{fmt(summary.total_budget)}</td>
            <td className="p-3 text-right tabular-nums">100%</td>
          </tr>
          <tr className="border-b border-border/30">
            <td className="p-3 tabular-nums text-muted-foreground">8</td>
            <td className="p-3">CONTINGENCIES (15%)</td>
            <td className="p-3 text-right tabular-nums">{fmt(summary.contingencies)}</td>
            <td className="p-3"></td>
          </tr>
          <tr className="bg-accent/5 font-semibold">
            <td className="p-3"></td>
            <td className="p-3 text-accent">GRAND TOTAL (8)</td>
            <td className="p-3 text-right tabular-nums text-accent">{fmt(summary.grand_total_8)}</td>
            <td className="p-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// --- Editable Table Component ---
interface ColDef {
  key: string;
  label: string;
  type: 'text' | 'number';
}

interface EditableTableProps {
  title: string;
  hook: ReturnType<typeof useProjectItems>;
  userId: string | undefined;
  columns: ColDef[];
  currency: string;
}

function EditableTable({ title, hook, userId, columns, currency }: EditableTableProps) {
  const { items, loading, addItem, updateItem, deleteItem, totalAmount } = hook;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState<Record<string, any>>({});

  const startEdit = (item: any) => {
    setEditingId(item.id);
    const data: Record<string, any> = {};
    columns.forEach(c => { data[c.key] = item[c.key]; });
    setEditData(data);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const success = await updateItem(editingId, editData);
    if (success) setEditingId(null);
  };

  const startAdd = () => {
    setAdding(true);
    const data: Record<string, any> = {};
    columns.forEach(c => { data[c.key] = c.type === 'number' ? 0 : ''; });
    setNewData(data);
  };

  const saveNew = async () => {
    await addItem(newData as any);
    setAdding(false);
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            الإجمالي: <span className="tabular-nums font-semibold text-foreground">{formatCurrency(totalAmount, currency)}</span>
          </p>
        </div>
        <button onClick={startAdd}
          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <Plus className="w-3 h-3" /> إضافة بند
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-center text-muted-foreground text-sm">جاري التحميل...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                {columns.map(col => (
                  <th key={col.key} className={cn('p-3 font-medium', col.type === 'number' ? 'text-right' : 'text-left')}>{col.label}</th>
                ))}
                <th className="p-3 font-medium text-center w-20">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id} className="border-b border-border/30 hover:bg-muted/20 group">
                  {columns.map(col => (
                    <td key={col.key} className={cn('p-3', col.type === 'number' && 'tabular-nums text-right font-medium')}>
                      {editingId === item.id ? (
                        <input
                          type={col.type}
                          value={editData[col.key] ?? ''}
                          onChange={e => setEditData(prev => ({
                            ...prev,
                            [col.key]: col.type === 'number' ? Number(e.target.value) : e.target.value
                          }))}
                          className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ) : (
                        <span className="cursor-pointer" onDoubleClick={() => startEdit(item)}>
                          {col.type === 'number' ? formatCurrency(Number(item[col.key]) || 0, currency) : (item[col.key] || '—')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="p-3 text-center">
                    {editingId === item.id ? (
                      <div className="flex gap-1 justify-center">
                        <button onClick={saveEdit} className="p-1 text-primary hover:bg-primary/10 rounded"><Save className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(item)} className="p-1 text-primary hover:bg-primary/10 rounded text-xs">تعديل</button>
                        <button onClick={() => deleteItem(item.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {/* Add new row */}
              {adding && (
                <tr className="border-b border-primary/30 bg-primary/5">
                  {columns.map(col => (
                    <td key={col.key} className="p-3">
                      <input
                        type={col.type}
                        value={newData[col.key] ?? ''}
                        placeholder={col.label}
                        onChange={e => setNewData(prev => ({
                          ...prev,
                          [col.key]: col.type === 'number' ? Number(e.target.value) : e.target.value
                        }))}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <button onClick={saveNew} className="p-1 text-primary hover:bg-primary/10 rounded"><Save className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setAdding(false)} className="p-1 text-muted-foreground hover:bg-muted rounded"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              )}

              {items.length === 0 && !adding && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground text-sm">
                    لا توجد بنود بعد. اضغط "إضافة بند" للبدء.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
