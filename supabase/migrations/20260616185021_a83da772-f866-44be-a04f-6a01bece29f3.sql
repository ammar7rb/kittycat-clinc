
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  title_ar TEXT,
  title_en TEXT,
  photo_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.doctors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active doctors"
  ON public.doctors FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage doctors"
  ON public.doctors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_doctors_branch ON public.doctors(branch_id, sort_order);

INSERT INTO public.doctors (branch_id, name_ar, sort_order) VALUES
  ('2b2420ef-e43d-43be-8273-8137d3d5d5f7', 'د. حمدي يونس', 1),
  ('2b2420ef-e43d-43be-8273-8137d3d5d5f7', 'د. أحمد شميس', 2),
  ('2b2420ef-e43d-43be-8273-8137d3d5d5f7', 'د. إيمان عصام', 3),
  ('ad2c8035-1990-4d99-aa96-473f3acfec5e', 'د. وليد المرواني', 1),
  ('ad2c8035-1990-4d99-aa96-473f3acfec5e', 'د. محمود أمل', 2),
  ('5d3fa7f9-4a74-4978-a1ba-0b5d99f9b962', 'د. سمر عسكر', 1),
  ('5d3fa7f9-4a74-4978-a1ba-0b5d99f9b962', 'د. كريم عيسى', 2);
