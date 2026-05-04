import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, getStatusColor } from '@/lib/formatters';
import { StatCard } from '@/components/StatCard';
import { CostDistributionChart } from '@/components/CostDistributionChart';
import { SummaryPanel } from '@/components/SummaryPanel';
import { calculateSummary } from '@/types/project';
import { FolderOpen, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

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
  created_at: string;
}

function getProjectSummary(p: DBProject) {
  return calculateSummary(
    p.materials, p.subcontractors, p.direct_manpower,
    p.direct_equipment, p.services, p.indirect_manpower,
    p.indirect_cost, p.overheads, p.project_revenue
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects(data || []);
        setLoading(false);
      });
  }, []);

  const selectedProject = projects[selectedIdx];
  const summary = selectedProject ? getProjectSummary(selectedProject) : null;

  const totalBudgets = projects.reduce((acc, p) => acc + getProjectSummary(p).total_budget, 0);

  const chartData = selectedProject
    ? [
        { name: 'Materials', value: selectedProject.materials },
        { name: 'Subcontractors', value: selectedProject.subcontractors },
        { name: 'Direct Manpower', value: selectedProject.direct_manpower },
        { name: 'Direct Equipment', value: selectedProject.direct_equipment },
        { name: 'Services', value: selectedProject.services },
        { name: 'Indirect Manpower', value: selectedProject.indirect_manpower },
        { name: 'Indirect Cost', value: selectedProject.indirect_cost },
      ]
    : [];

  if (loading) {
    return <div className="p-6 text-muted-foreground">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Project cost budget overview</p>
        </div>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Projects"
          value={String(projects.length)}
          sub={`${projects.filter(p => p.status === 'approved').length} approved`}
          icon={<FolderOpen className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          label="Total Budgets"
          value={formatCurrency(totalBudgets, 'EGP')}
          sub="Across all projects"
          icon={<DollarSign className="w-5 h-5" />}
          variant="accent"
        />
        <StatCard
          label="Projects"
          value={String(projects.length)}
          sub={projects.length > 0 ? 'Active' : 'No projects yet'}
          icon={<TrendingUp className="w-5 h-5" />}
          variant="success"
        />
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">لا توجد مشاريع بعد</p>
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            إنشاء مشروع جديد
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Projects</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left p-3 font-medium">Project</th>
                      <th className="text-left p-3 font-medium">Cost Center</th>
                      <th className="text-right p-3 font-medium">Revenue</th>
                      <th className="text-right p-3 font-medium">Budget</th>
                      <th className="text-center p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, idx) => {
                      const s = getProjectSummary(project);
                      return (
                        <tr
                          key={project.id}
                          className={cn(
                            'border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/30',
                            selectedIdx === idx && 'bg-primary/5'
                          )}
                          onClick={() => setSelectedIdx(idx)}
                        >
                          <td className="p-3">
                            <Link to={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors">
                              {project.project_name || 'Untitled'}
                            </Link>
                            <p className="text-xs text-muted-foreground">{project.currency}</p>
                          </td>
                          <td className="p-3 tabular-nums text-muted-foreground">{project.cost_center_number}</td>
                          <td className="p-3 text-right tabular-nums">{formatCurrency(project.project_revenue, project.currency)}</td>
                          <td className="p-3 text-right tabular-nums">{formatCurrency(s.total_budget, project.currency)}</td>
                          <td className="p-3 text-center">
                            <span className={cn('px-2 py-1 rounded-full text-xs font-medium capitalize', getStatusColor(project.status))}>
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {chartData.length > 0 && <CostDistributionChart data={chartData} />}
          </div>

          {summary && selectedProject && (
            <div>
              <SummaryPanel
                summary={summary}
                currency={selectedProject.currency}
                revenue={selectedProject.project_revenue}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
