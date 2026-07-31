CREATE POLICY "Deny anonymous read on contact leads"
  ON public.contact_leads
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "Deny authenticated read on contact leads"
  ON public.contact_leads
  FOR SELECT
  TO authenticated
  USING (false);

CREATE POLICY "Deny anonymous update on contact leads"
  ON public.contact_leads
  FOR UPDATE
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny authenticated update on contact leads"
  ON public.contact_leads
  FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny anonymous delete on contact leads"
  ON public.contact_leads
  FOR DELETE
  TO anon
  USING (false);

CREATE POLICY "Deny authenticated delete on contact leads"
  ON public.contact_leads
  FOR DELETE
  TO authenticated
  USING (false);