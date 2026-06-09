
INSERT INTO public.services (name_ar, name_en, description_ar, description_en, icon, sort_order, is_active) VALUES
('فحص شامل دوري', 'Comprehensive Wellness Exam', 'كشف بيطري شامل لتقييم صحة قطتك من الرأس إلى الذيل والكشف المبكر عن أي مشكلة.', 'Full head-to-tail veterinary exam to assess your cat''s health and catch issues early.', 'Stethoscope', 1, true),
('التطعيمات الأساسية', 'Core Vaccinations', 'برنامج تطعيمات معتمد دوليًا يحمي قطتك من الأمراض الفيروسية الخطيرة.', 'Internationally accredited vaccination program protecting your cat from serious viral diseases.', 'Syringe', 2, true),
('العناية بالأسنان', 'Dental Care', 'تنظيف وعلاج أسنان القطط لمنع التهاب اللثة وفقدان الأسنان.', 'Feline dental cleaning and treatment to prevent gum disease and tooth loss.', 'Sparkles', 3, true),
('الجراحة والتعقيم', 'Surgery & Spay/Neuter', 'عمليات جراحية بأحدث التقنيات وغرف عمليات مجهزة بالكامل لراحة قطتك.', 'Surgical procedures with the latest techniques and fully equipped operating rooms.', 'Scissors', 4, true),
('الأشعة والتحاليل', 'Imaging & Lab Tests', 'تشخيص دقيق عبر الأشعة الرقمية والموجات فوق الصوتية وتحاليل المختبر الفورية.', 'Accurate diagnostics via digital X-ray, ultrasound, and in-house lab work.', 'Activity', 5, true),
('الاستضافة والرعاية', 'Boarding & Care', 'استضافة فندقية مخصصة للقطط فقط، بإشراف طبي على مدار الساعة.', 'Cat-only hotel-style boarding with 24/7 medical supervision.', 'Home', 6, true);

INSERT INTO public.offers (title_ar, title_en, description_ar, description_en, sort_order, is_active) VALUES
('باقة القطة الجديدة', 'New Kitten Package', 'فحص شامل + جرعتي تطعيمات + استشارة تغذية بسعر مميز للقطط حديثة الولادة.', 'Full exam + 2 vaccines + nutrition consult at a special rate for new kittens.', 1, true),
('عرض العناية بالأسنان', 'Dental Care Special', 'تنظيف أسنان احترافي مع كشف مجاني للفم واللثة بخصم 20%.', 'Professional dental cleaning with a complimentary oral exam — 20% off.', 2, true),
('باقة الفحص السنوي', 'Annual Checkup Bundle', 'فحص شامل + تحليل دم كامل + تطعيمات سنوية بسعر موحّد.', 'Comprehensive exam + full blood work + annual vaccines at one bundled price.', 3, true);
