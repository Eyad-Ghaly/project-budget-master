
-- Material Items
CREATE TABLE public.material_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  sub_category TEXT NOT NULL DEFAULT '',
  supplier_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.material_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own material_items" ON public.material_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subcontractor Items
CREATE TABLE public.subcontractor_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'ELECTRICAL',
  company_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subcontractor_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subcontractor_items" ON public.subcontractor_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Direct Manpower Items
CREATE TABLE public.direct_manpower_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  discipline TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  manweeks NUMERIC NOT NULL DEFAULT 0,
  rate_per_week NUMERIC NOT NULL DEFAULT 0,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.direct_manpower_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own direct_manpower_items" ON public.direct_manpower_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Direct Equipment Items
CREATE TABLE public.direct_equipment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  discipline TEXT NOT NULL DEFAULT '',
  equipment_name TEXT NOT NULL DEFAULT '',
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  unit_cost NUMERIC NOT NULL DEFAULT 0,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.direct_equipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own direct_equipment_items" ON public.direct_equipment_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Service Items
CREATE TABLE public.service_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  discipline TEXT NOT NULL DEFAULT '',
  service_name TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own service_items" ON public.service_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indirect Manpower Items
CREATE TABLE public.indirect_manpower_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  location_type TEXT NOT NULL DEFAULT 'ONSITE',
  role TEXT NOT NULL DEFAULT '',
  cost_code TEXT NOT NULL DEFAULT '',
  manweeks NUMERIC NOT NULL DEFAULT 0,
  rate_per_week NUMERIC NOT NULL DEFAULT 0,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.indirect_manpower_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own indirect_manpower_items" ON public.indirect_manpower_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indirect Cost Items
CREATE TABLE public.indirect_cost_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  sub_category TEXT NOT NULL DEFAULT '',
  item_name TEXT NOT NULL DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.indirect_cost_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own indirect_cost_items" ON public.indirect_cost_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- BOQ Items
CREATE TABLE public.boq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  block TEXT NOT NULL DEFAULT '',
  item_code TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  specification TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '',
  quantity NUMERIC NOT NULL DEFAULT 0,
  discipline TEXT NOT NULL DEFAULT '',
  supply_materials NUMERIC NOT NULL DEFAULT 0,
  logistics NUMERIC NOT NULL DEFAULT 0,
  subcontract_construction NUMERIC NOT NULL DEFAULT 0,
  subcontract_engineering NUMERIC NOT NULL DEFAULT 0,
  direct_manpower NUMERIC NOT NULL DEFAULT 0,
  construction_equipment NUMERIC NOT NULL DEFAULT 0,
  indirect_cost NUMERIC NOT NULL DEFAULT 0,
  indirect_manpower NUMERIC NOT NULL DEFAULT 0,
  overheads NUMERIC NOT NULL DEFAULT 0,
  contingencies NUMERIC NOT NULL DEFAULT 0,
  profit NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.boq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own boq_items" ON public.boq_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
