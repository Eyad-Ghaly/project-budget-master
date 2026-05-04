
-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cost_center_number TEXT NOT NULL DEFAULT '',
  cost_center_name TEXT NOT NULL DEFAULT '',
  project_name TEXT NOT NULL DEFAULT '',
  revision_number INTEGER NOT NULL DEFAULT 0,
  revision_date DATE NOT NULL DEFAULT now(),
  currency TEXT NOT NULL DEFAULT 'EGP',
  project_revenue NUMERIC NOT NULL DEFAULT 0,
  pm_target NUMERIC NOT NULL DEFAULT 0.85,
  om_target NUMERIC NOT NULL DEFAULT 0.07,
  md_target NUMERIC NOT NULL DEFAULT 0.08,
  status TEXT NOT NULL DEFAULT 'draft',
  -- Cost totals (categories 1-7 + overheads)
  materials NUMERIC NOT NULL DEFAULT 0,
  subcontractors NUMERIC NOT NULL DEFAULT 0,
  direct_manpower NUMERIC NOT NULL DEFAULT 0,
  direct_equipment NUMERIC NOT NULL DEFAULT 0,
  services NUMERIC NOT NULL DEFAULT 0,
  indirect_manpower NUMERIC NOT NULL DEFAULT 0,
  indirect_cost NUMERIC NOT NULL DEFAULT 0,
  overheads NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can only see their own projects
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
