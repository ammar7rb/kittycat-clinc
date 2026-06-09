GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.branches TO anon;
GRANT SELECT ON public.offers TO anon;