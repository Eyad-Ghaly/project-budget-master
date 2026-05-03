import { Project, ProjectSummary, calculateSummary } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    cost_center_number: 'CC-2024-001',
    cost_center_name: 'KENT KNX Power Station',
    project_name: 'Elecon-KENT KNX Project',
    revision_number: 1,
    revision_date: '2026-04-15',
    currency: 'EGP',
    project_revenue: 150000000,
    pm_target: 0.85,
    om_target: 0.07,
    md_target: 0.08,
    status: 'approved',
    created_at: '2026-01-10',
  },
  {
    id: '2',
    cost_center_number: 'CC-2024-002',
    cost_center_name: 'Alexandria Substation',
    project_name: 'Alex 500kV Substation Upgrade',
    revision_number: 0,
    revision_date: '2026-05-01',
    currency: 'EGP',
    project_revenue: 85000000,
    pm_target: 0.85,
    om_target: 0.07,
    md_target: 0.08,
    status: 'submitted',
    created_at: '2026-03-20',
  },
  {
    id: '3',
    cost_center_number: 'CC-2024-003',
    cost_center_name: 'Cairo Office Tower',
    project_name: 'Smart Building MEP',
    revision_number: 0,
    revision_date: '2026-04-28',
    currency: 'USD',
    project_revenue: 4200000,
    pm_target: 0.85,
    om_target: 0.07,
    md_target: 0.08,
    status: 'draft',
    created_at: '2026-04-01',
  },
];

export const mockCategoryCosts: Record<string, number[]> = {
  '1': [42500000, 22000000, 950000],
  '2': [18750000, 9500000, 420000],
  '3': [12500000, 7200000, 380000],
  '4': [3800000, 2100000, 150000],
  '5': [2200000, 1500000, 85000],
  '6': [15600000, 8900000, 520000],
  '7': [9800000, 5200000, 310000],
};

export function getMockSummary(projectId: string): ProjectSummary {
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) {
    return calculateSummary(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  const idx = mockProjects.indexOf(project);
  const costs = Object.values(mockCategoryCosts).map(c => c[idx] || 0);
  return calculateSummary(
    costs[0], costs[1], costs[2], costs[3], costs[4], costs[5], costs[6], 0, project.project_revenue
  );
}
