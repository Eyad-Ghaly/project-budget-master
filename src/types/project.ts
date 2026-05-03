// Project types for the Budget Management System

export interface Project {
  id: string;
  cost_center_number: string;
  cost_center_name: string;
  project_name: string;
  revision_number: number;
  revision_date: string;
  currency: 'EGP' | 'USD';
  project_revenue: number;
  pm_target: number;
  om_target: number;
  md_target: number;
  status: 'draft' | 'submitted' | 'approved';
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface MaterialItem {
  id: string;
  project_id: string;
  sub_category: string;
  supplier_name: string;
  description: string;
  amount_egp: number;
  notes: string;
}

export interface SubcontractorItem {
  id: string;
  project_id: string;
  type: 'ELECTRICAL' | 'MECHANICAL' | 'CIVIL';
  company_name: string;
  description: string;
  amount: number;
}

export interface DirectManpowerItem {
  id: string;
  project_id: string;
  discipline: string;
  role: string;
  manweeks: number;
  rate_per_week: number;
  amount: number;
}

export interface DirectEquipmentItem {
  id: string;
  project_id: string;
  discipline: string;
  equipment_name: string;
  quantity: number;
  unit: string;
  unit_cost: number;
  amount: number;
}

export interface ServiceItem {
  id: string;
  project_id: string;
  discipline: string;
  service_name: string;
  amount: number;
}

export interface IndirectManpowerItem {
  id: string;
  project_id: string;
  location_type: 'ONSITE' | 'OFFSITE';
  role: string;
  cost_code: string;
  manweeks: number;
  rate_per_week: number;
  amount: number;
}

export interface IndirectCostItem {
  id: string;
  project_id: string;
  sub_category: string;
  item_name: string;
  amount: number;
  notes: string;
}

export interface OverheadItem {
  id: string;
  project_id: string;
  overhead_type: string;
  amount: number;
}

export interface BOQItem {
  id: string;
  project_id: string;
  block: string;
  item_code: string;
  description: string;
  specification: string;
  unit: string;
  quantity: number;
  discipline: string;
  supply_materials: number;
  logistics: number;
  subcontract_construction: number;
  subcontract_engineering: number;
  direct_manpower: number;
  construction_equipment: number;
  indirect_cost: number;
  indirect_manpower: number;
  overheads: number;
  contingencies: number;
  profit: number;
  selling_price: number;
}

export interface ProjectSummary {
  total_materials: number;
  total_subcontractors: number;
  total_direct_manpower: number;
  total_direct_equipment: number;
  total_services: number;
  total_indirect_manpower: number;
  total_indirect_cost: number;
  total_overheads: number;
  total_budget: number;
  contingencies: number;
  mgmt_reserve_gm: number;
  mgmt_reserve_ceo: number;
  risk_factor: number;
  grand_total_8: number;
  grand_total_10: number;
  optimistic_profit: number;
  pessimistic_profit: number;
  optimistic_profit_pct: number;
  pessimistic_profit_pct: number;
}

export const COST_CATEGORIES = [
  { code: 1, name: 'MATERIALS' },
  { code: 2, name: 'SUBCONTRACTORS' },
  { code: 3, name: 'DIRECT MANPOWER' },
  { code: 4, name: 'DIRECT EQUIPMENTS' },
  { code: 5, name: 'SERVICES' },
  { code: 6, name: 'INDIRECT MANPOWER' },
  { code: 7, name: 'INDIRECT COST' },
  { code: 8, name: 'CONTINGENCIES' },
  { code: 9, name: 'OVERHEADS' },
  { code: 10, name: 'PROFIT' },
] as const;

export const MATERIAL_SUB_CATEGORIES = [
  'General Requirements',
  'Freight & Customs - Customs Broker',
  'Freight & Customs - Customs Fees',
  'Freight & Customs - Shipping Fees',
  'Electrical Materials - Schneider Materials',
  'Electrical Materials - Other Imported',
  'Electrical Materials - Other Local',
  'Cables',
  'Conduits',
  'Race Ways',
] as const;

export const INDIRECT_COST_SUB_CATEGORIES = [
  'Main Office Facilities',
  'Offsite Office Facilities',
  'Onsite Office Facilities',
  'Accommodation Facilities',
  'Warehousing and Workshops',
  'Construction Site Facilities',
  'Tools and Consumables',
  'HSSE',
  'General Expenses',
  'Site IT and Communication Facilities',
  'Marketing',
  'Transportation',
  'Human Resource Functions',
  'Financial Charges',
  'Insurance',
  'Professional Fees',
  'Governmental Fees / Taxes',
] as const;

export const INDIRECT_MANPOWER_ROLES_ONSITE = [
  'Site Manager', 'Construction Manager', 'Construction Engineer',
  'Instrument Engineer', 'Testing Manager', 'Testing Engineer',
  'Technical Office Manager', 'Technical Office Engineer',
  'Planner Engineer', 'Material Control', 'Document Control',
  'QC Manager', 'QC Engineer', 'Safety Manager', 'Safety Supervisor',
  'Safety Officer', 'Administrative', 'Accountant', 'Security', 'Office Boy',
] as const;

export const INDIRECT_MANPOWER_ROLES_OFFSITE = [
  'Project Manager', 'Project Engineer', 'Secretary',
] as const;

export function calculateSummary(
  materials: number,
  subcontractors: number,
  directManpower: number,
  directEquipment: number,
  services: number,
  indirectManpower: number,
  indirectCost: number,
  overheads: number,
  revenue: number,
): ProjectSummary {
  const total_budget = materials + subcontractors + directManpower + directEquipment + services + indirectManpower + indirectCost;
  const contingencies = total_budget * 0.15;
  const mgmt_reserve_gm = total_budget * 0.05;
  const mgmt_reserve_ceo = total_budget * 0.05;
  const risk_factor = total_budget * 0.05;
  const grand_total_8 = total_budget + contingencies;
  const grand_total_10 = grand_total_8 + mgmt_reserve_gm + mgmt_reserve_ceo + risk_factor;
  const optimistic_profit = revenue - total_budget - contingencies;
  const pessimistic_profit = revenue - grand_total_10;

  return {
    total_materials: materials,
    total_subcontractors: subcontractors,
    total_direct_manpower: directManpower,
    total_direct_equipment: directEquipment,
    total_services: services,
    total_indirect_manpower: indirectManpower,
    total_indirect_cost: indirectCost,
    total_overheads: overheads,
    total_budget,
    contingencies,
    mgmt_reserve_gm,
    mgmt_reserve_ceo,
    risk_factor,
    grand_total_8,
    grand_total_10,
    optimistic_profit,
    pessimistic_profit,
    optimistic_profit_pct: revenue > 0 ? optimistic_profit / revenue : 0,
    pessimistic_profit_pct: revenue > 0 ? pessimistic_profit / revenue : 0,
  };
}
