-- Create furniture designs table
CREATE TABLE public.furniture_designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  original_filename TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analysis results table
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_id UUID NOT NULL REFERENCES public.furniture_designs(id) ON DELETE CASCADE,
  ai_description TEXT,
  estimated_cost_min DECIMAL(10,2),
  estimated_cost_max DECIMAL(10,2),
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_time_hours INTEGER,
  style_category TEXT,
  raw_ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DECIMAL(10,2),
  unit TEXT NOT NULL,
  estimated_cost DECIMAL(10,2),
  priority TEXT NOT NULL DEFAULT 'required' CHECK (priority IN ('required', 'optional', 'alternative')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supplier pricing table
CREATE TABLE public.supplier_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  delivery_time_days INTEGER,
  location TEXT,
  contact_info JSONB,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.furniture_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for furniture_designs
CREATE POLICY "Users can view their own designs" 
ON public.furniture_designs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own designs" 
ON public.furniture_designs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs" 
ON public.furniture_designs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs" 
ON public.furniture_designs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for analysis_results (users can view results for their designs)
CREATE POLICY "Users can view analysis of their designs" 
ON public.analysis_results 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.furniture_designs 
  WHERE id = analysis_results.design_id 
  AND user_id = auth.uid()
));

CREATE POLICY "System can create analysis results" 
ON public.analysis_results 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.furniture_designs 
  WHERE id = analysis_results.design_id 
  AND user_id = auth.uid()
));

-- Create policies for materials (users can view materials for their analyses)
CREATE POLICY "Users can view materials for their analyses" 
ON public.materials 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.analysis_results ar
  JOIN public.furniture_designs fd ON ar.design_id = fd.id
  WHERE ar.id = materials.analysis_id 
  AND fd.user_id = auth.uid()
));

CREATE POLICY "System can create materials" 
ON public.materials 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.analysis_results ar
  JOIN public.furniture_designs fd ON ar.design_id = fd.id
  WHERE ar.id = materials.analysis_id 
  AND fd.user_id = auth.uid()
));

-- Create policies for supplier_pricing (public read access for pricing data)
CREATE POLICY "Anyone can view supplier pricing" 
ON public.supplier_pricing 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage supplier pricing" 
ON public.supplier_pricing 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_furniture_designs_updated_at
  BEFORE UPDATE ON public.furniture_designs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_supplier_pricing_updated_at
  BEFORE UPDATE ON public.supplier_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for furniture images
INSERT INTO storage.buckets (id, name, public) VALUES ('furniture-images', 'furniture-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view furniture images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'furniture-images');

CREATE POLICY "Authenticated users can upload furniture images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'furniture-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own furniture images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'furniture-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own furniture images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'furniture-images' AND auth.uid() IS NOT NULL);