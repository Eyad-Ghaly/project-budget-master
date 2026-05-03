import { Link } from 'react-router-dom';
import { mockProjects, getMockSummary, mockCategoryCosts } from '@/data/mockData';
import { formatCurrency, getStatusColor } from '@/lib/formatters';
import { StatCard } from '@/components/StatCard';
import { CostDistributionChart } from '@/components/CostDistributionChart';
import { SummaryPanel } from '@/components/SummaryPanel';
import { COST_CATEGORIES } from '@/types/project';
import { FolderOpen, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);
  const summary = getMockSummary(selectedProject.id);

  const totalBudgets = mockProjects.reduce((acc, p) => {
    const s = getMockSummary(p.id);
    return acc + s.total_budget;
  }, 0);

  const chartData = COST_CATEGORIES.slice(0, 7).map((cat, i) => ({
    name: cat.name,
    value: mockCategoryCosts[String(i + 1)]?.[0] || 0,
  }));

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Projects"
          value={String(mockProjects.length)}
          sub={`${mockProjects.filter(p => p.status === 'approved').length} approved`}
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
          label="Avg. Profit Margin"
          value="18.2%"
          sub="Optimistic average"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Table + Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects Table */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Projects
              </h3>
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
                  {mockProjects.map(project => {
                    const s = getMockSummary(project.id);
                    return (
                      <tr
                        key={project.id}
                        className={cn(
                          'border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/30',
                          selectedProject.id === project.id && 'bg-primary/5'
                        )}
                        onClick={() => setSelectedProject(project)}
                      >
                        <td className="p-3">
                          <Link to={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors">
                            {project.project_name}
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

          <CostDistributionChart data={chartData} />
        </div>

        {/* Summary Panel */}
        <div>
          <SummaryPanel
            summary={summary}
            currency={selectedProject.currency}
            revenue={selectedProject.project_revenue}
          />
        </div>
      </div>
    </div>
  );
}
