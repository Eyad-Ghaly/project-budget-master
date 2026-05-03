import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { mockProjects, getMockSummary } from '@/data/mockData';
import { SummaryPanel } from '@/components/SummaryPanel';
import { COST_CATEGORIES } from '@/types/project';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { ArrowLeft, Download, FileText } from 'lucide-react';

const tabKeys = ['summary', 'materials', 'subcontractors', 'direct-manpower', 'direct-equipment', 'services', 'indirect-manpower', 'indirect-cost', 'boq'] as const;
const tabLabels = ['Summary', 'Materials', 'Subcontractors', 'Direct Manpower', 'Direct Equipment', 'Services', 'Indirect Manpower', 'Indirect Cost', 'BOQ'];

export default function ProjectDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const project = mockProjects.find(p => p.id === id) || mockProjects[0];
  const summary = getMockSummary(project.id);

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
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabKeys.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tabLabels[i]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'summary' && <SummaryTable summary={summary} currency={project.currency} />}
          {activeTab === 'materials' && <CostCategoryTable title="Materials" currency={project.currency} columns={['Sub-Category', 'Supplier', 'Description', 'Amount']} rows={[
            ['General Requirements', '—', 'General site requirements', '12,500,000'],
            ['Schneider Materials', 'Schneider Electric', 'MV/LV Switchgear', '18,000,000'],
            ['Cables', 'Elsewedy', 'MV & LV Cables', '8,500,000'],
            ['Conduits & Race Ways', 'Local Supplier', 'Cable trays & conduits', '3,500,000'],
          ]} />}
          {activeTab === 'subcontractors' && <CostCategoryTable title="Subcontractors" currency={project.currency} columns={['Type', 'Company', 'Description', 'Amount']} rows={[
            ['ELECTRICAL', 'EPC Contracting', 'Electrical Installation', '10,500,000'],
            ['MECHANICAL', 'MechPro', 'HVAC & Plumbing', '5,250,000'],
            ['CIVIL', 'BuildCo', 'Civil Works', '3,000,000'],
          ]} />}
          {activeTab === 'direct-manpower' && <CostCategoryTable title="Direct Manpower" currency={project.currency} columns={['Discipline', 'Role', 'Man-weeks', 'Rate/Week', 'Amount']} rows={[
            ['ELECTRICAL', 'Senior Electrician', '48', '3,500', '168,000'],
            ['ELECTRICAL', 'Electrician', '96', '2,200', '211,200'],
            ['COMMUNICATION', 'Comm. Technician', '32', '2,800', '89,600'],
          ]} />}
          {activeTab === 'direct-equipment' && <CostCategoryTable title="Direct Equipment" currency={project.currency} columns={['Discipline', 'Equipment', 'Qty', 'Unit', 'Unit Cost', 'Amount']} rows={[
            ['ELECTRICAL', 'Cable Pulling Machine', '2', 'Set', '150,000', '300,000'],
            ['ELECTRICAL', 'Crane 50T', '1', 'Month', '85,000', '85,000'],
          ]} />}
          {activeTab === 'services' && <CostCategoryTable title="Services" currency={project.currency} columns={['Discipline', 'Service', 'Amount']} rows={[
            ['ELECTRICAL', 'Testing & Commissioning', '1,200,000'],
            ['MECHANICAL', 'HVAC Testing', '500,000'],
          ]} />}
          {activeTab === 'indirect-manpower' && <CostCategoryTable title="Indirect Manpower" currency={project.currency} columns={['Location', 'Role', 'Cost Code', 'Man-weeks', 'Rate/Week', 'Amount']} rows={[
            ['ONSITE', 'Site Manager', '101016', '52', '8,500', '442,000'],
            ['ONSITE', 'Construction Manager', '101016', '52', '7,200', '374,400'],
            ['ONSITE', 'QC Manager', '101026', '48', '5,500', '264,000'],
            ['OFFSITE', 'Project Manager', '101016', '52', '9,000', '468,000'],
            ['OFFSITE', 'Project Engineer', '101026', '52', '5,000', '260,000'],
          ]} />}
          {activeTab === 'indirect-cost' && <CostCategoryTable title="Indirect Cost" currency={project.currency} columns={['Sub-Category', 'Item', 'Amount', 'Notes']} rows={[
            ['Main Office Facilities', 'Office Rent', '240,000', '12 months'],
            ['Accommodation Facilities', 'Staff Housing', '480,000', '20 rooms'],
            ['Transportation', 'Vehicles', '360,000', '6 vehicles'],
            ['Insurance', 'Project Insurance', '850,000', 'CAR Policy'],
            ['HSSE', 'Safety Equipment', '120,000', ''],
          ]} />}
          {activeTab === 'boq' && (
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bill of Quantities</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase tracking-wider">
                      {['Block', 'Code', 'Description', 'Unit', 'Qty', 'Supply', 'Logistics', 'Construction', 'Manpower', 'Equipment', 'Selling Price'].map(h => (
                        <th key={h} className="p-2 font-medium text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['A1', 'A1.1', 'MV Switchgear Panel', 'Set', '4', '2,400,000', '120,000', '480,000', '96,000', '48,000', '3,600,000'],
                      ['A1', 'A1.2', 'LV Main Distribution Board', 'Set', '8', '1,600,000', '80,000', '320,000', '64,000', '32,000', '2,400,000'],
                      ['B1', 'B1.1', 'Cable Tray System', 'm', '2500', '625,000', '31,250', '187,500', '125,000', '62,500', '1,200,000'],
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                        {row.map((cell, j) => (
                          <td key={j} className={cn('p-2', j >= 4 && 'tabular-nums text-right')}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div>
          <SummaryPanel summary={summary} currency={project.currency} revenue={project.project_revenue} />
        </div>
      </div>
    </div>
  );
}

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

function CostCategoryTable({ title, currency, columns, rows }: {
  title: string; currency: string; columns: string[]; rows: string[][];
}) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
        <button className="text-xs px-3 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          + Add Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
              {columns.map(col => (
                <th key={col} className="text-left p-3 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-muted/20 cursor-pointer">
                {row.map((cell, j) => (
                  <td key={j} className={cn('p-3', j === row.length - 1 && 'tabular-nums text-right font-medium')}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
