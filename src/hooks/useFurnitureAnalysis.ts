import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Helper function to convert image URL to base64
const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Failed to convert image to base64'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image for analysis');
  }
};

export interface FurnitureDesign {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  created_at: string;
}

export interface AnalysisResult {
  id: string;
  ai_description: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_hours: number;
  style_category: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimated_cost: number;
  priority: 'required' | 'optional' | 'alternative';
  notes?: string;
}

export const useFurnitureAnalysis = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const uploadDesign = async (file: File, title: string, description?: string) => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('furniture-images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('furniture-images')
        .getPublicUrl(filePath);

      // Save design to database
      const { data: design, error: dbError } = await supabase
        .from('furniture_designs')
        .insert({
          user_id: user.id,
          title,
          description,
          image_url: publicUrl,
          original_filename: file.name,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      toast({
        title: "Upload successful",
        description: "Your furniture design has been uploaded successfully.",
      });

      return design;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload design",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeDesign = async (designId: string, imageUrl: string) => {
    setIsAnalyzing(true);
    try {
      // Convert image URL to base64
      const imageBase64 = await convertImageToBase64(imageUrl);
      
      const { data, error } = await supabase.functions.invoke('analyze-furniture', {
        body: { designId, imageBase64 }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No response from analysis service');
      }

      toast({
        title: "Analysis started",
        description: "AI analysis is in progress. Results will appear shortly.",
      });

      return true;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze design",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDesigns = async () => {
    const { data, error } = await supabase
      .from('furniture_designs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch designs: ${error.message}`);
    }

    return data as FurnitureDesign[];
  };

  const getAnalysisResults = async (designId: string) => {
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('design_id', designId)
      .single();

    if (analysisError) {
      throw new Error(`Failed to fetch analysis: ${analysisError.message}`);
    }

    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('*')
      .eq('analysis_id', analysis.id)
      .order('priority', { ascending: true });

    if (materialsError) {
      throw new Error(`Failed to fetch materials: ${materialsError.message}`);
    }

    return {
      analysis: analysis as AnalysisResult,
      materials: materials as Material[]
    };
  };

  return {
    uploadDesign,
    analyzeDesign,
    getDesigns,
    getAnalysisResults,
    isUploading,
    isAnalyzing
  };
};