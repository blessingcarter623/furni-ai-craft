
import { FlowiseApiRequest, FlowiseApiResponse } from '@/types/flowise';
import { supabase } from '@/integrations/supabase/client';

export const analyzeWithFlowise = async (
  imageFile: File,
  question: string = "Analyze this furniture piece and identify all components with materials and sourcing information"
): Promise<FlowiseApiResponse> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const requestBody: FlowiseApiRequest = {
      question,
      uploads: [
        {
          data: base64Image,
          type: imageFile.type,
          name: imageFile.name
        }
      ],
      streaming: false
    };

    console.log('Sending request to Flowise via edge function:', {
      question,
      hasImage: !!base64Image,
      imageType: imageFile.type,
      imageSize: imageFile.size
    });

    // Call our edge function instead of the Flowise API directly
    const { data, error } = await supabase.functions.invoke('flowise-analysis', {
      body: requestBody,
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data received from edge function');
    }

    console.log('Flowise analysis completed successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error calling Flowise via edge function:', error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (data:image/jpeg;base64,)
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};
