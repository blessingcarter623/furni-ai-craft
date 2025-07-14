
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { analyzeFurnitureImage } from '@/utils/furnitureAnalyzer';

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

  const analyzeDesign = async (designId: string, imageUrl: string, title: string, description?: string) => {
    setIsAnalyzing(true);
    try {
      // Update design status to analyzing
      await supabase
        .from('furniture_designs')
        .update({ status: 'analyzing' })
        .eq('id', designId);

      // Use frontend analysis instead of edge function
      const analysisData = await analyzeFurnitureImage(imageUrl, title, description);
      
      // Save analysis results
      const { data: analysisResult, error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          design_id: designId,
          ai_description: analysisData.description,
          estimated_cost_min: analysisData.estimated_cost_min,
          estimated_cost_max: analysisData.estimated_cost_max,
          difficulty_level: analysisData.difficulty_level,
          estimated_time_hours: analysisData.estimated_time_hours,
          style_category: analysisData.style_category,
          raw_ai_response: analysisData
        })
        .select()
        .single();

      if (analysisError) {
        throw new Error(`Database error: ${analysisError.message}`);
      }

      // Save materials
      const materialsToInsert = analysisData.materials.map((material) => ({
        analysis_id: analysisResult.id,
        name: material.name,
        category: material.category,
        quantity: material.quantity,
        unit: material.unit,
        estimated_cost: material.estimated_cost,
        priority: material.priority,
        notes: material.notes
      }));

      const { error: materialsError } = await supabase
        .from('materials')
        .insert(materialsToInsert);

      if (materialsError) {
        throw new Error(`Materials database error: ${materialsError.message}`);
      }

      // Update design status to completed
      await supabase
        .from('furniture_designs')
        .update({ status: 'completed' })
        .eq('id', designId);

      toast({
        title: "Analysis completed",
        description: "Your furniture design has been analyzed successfully!",
      });

      return true;
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Update design status to failed
      await supabase
        .from('furniture_designs')
        .update({ status: 'failed' })
        .eq('id', designId);

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
