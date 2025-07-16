
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeWithFlowise } from '@/utils/flowiseClient';
import { FlowiseApiResponse } from '@/types/flowise';

export const useFlowiseAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FlowiseApiResponse | null>(null);
  const { toast } = useToast();

  const analyze = async (file: File, question?: string) => {
    setIsAnalyzing(true);
    try {
      console.log('Starting Flowise analysis for file:', file.name);
      
      const result = await analyzeWithFlowise(file, question);
      
      console.log('Flowise analysis completed:', result);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis completed",
        description: "Your furniture has been analyzed by Flowise AI agents.",
      });

      return result;
    } catch (error) {
      console.error('Flowise analysis error:', error);
      
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze with Flowise",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  return {
    analyzeWithFlowise: analyze,
    isAnalyzing,
    analysisResult,
    resetAnalysis
  };
};
