
CREATE TABLE public.combo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page int NOT NULL DEFAULT 1,
  services text[] NOT NULL DEFAULT '{}',
  price text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.combo_items TO anon, authenticated;
GRANT ALL ON public.combo_items TO service_role;
ALTER TABLE public.combo_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "combo_items public read" ON public.combo_items FOR SELECT USING (true);
CREATE POLICY "combo_items public write" ON public.combo_items FOR INSERT WITH CHECK (true);
CREATE POLICY "combo_items public update" ON public.combo_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "combo_items public delete" ON public.combo_items FOR DELETE USING (true);

CREATE TABLE public.individual_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  side text NOT NULL DEFAULT 'left',
  category text NOT NULL,
  name text NOT NULL,
  price text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.individual_services TO anon, authenticated;
GRANT ALL ON public.individual_services TO service_role;
ALTER TABLE public.individual_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "indiv public read" ON public.individual_services FOR SELECT USING (true);
CREATE POLICY "indiv public write" ON public.individual_services FOR INSERT WITH CHECK (true);
CREATE POLICY "indiv public update" ON public.individual_services FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "indiv public delete" ON public.individual_services FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER combo_items_touch BEFORE UPDATE ON public.combo_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER indiv_touch BEFORE UPDATE ON public.individual_services
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
