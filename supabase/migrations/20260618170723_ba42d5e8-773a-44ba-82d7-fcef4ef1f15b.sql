INSERT INTO public.website_content (key, group_name, value_ar, value_en)
VALUES
  ('settings.social.facebook', 'settings', 'https://www.facebook.com/share/1GMNwqpX9T/', 'https://www.facebook.com/share/1GMNwqpX9T/'),
  ('settings.social.snapchat', 'settings', 'https://www.snapchat.com/add/kittycat2026960?share_id=0mtmRihvRTE&locale=ar-EG', 'https://www.snapchat.com/add/kittycat2026960?share_id=0mtmRihvRTE&locale=ar-EG'),
  ('settings.social.twitter', 'settings', 'https://x.com/kittyca5914524', 'https://x.com/kittyca5914524')
ON CONFLICT (key) DO UPDATE
SET value_ar = EXCLUDED.value_ar,
    value_en = EXCLUDED.value_en,
    group_name = EXCLUDED.group_name;