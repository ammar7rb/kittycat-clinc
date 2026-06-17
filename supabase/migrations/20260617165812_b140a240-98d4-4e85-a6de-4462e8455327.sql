ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS layout text NOT NULL DEFAULT 'wide';
ALTER TABLE public.offers ADD CONSTRAINT offers_layout_check CHECK (layout IN ('wide','portrait'));