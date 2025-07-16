
import { FlowiseApiRequest, FlowiseApiResponse } from '@/types/flowise';

const FLOWISE_API_URL = 'https://cloud.flowiseai.com/api/v1/prediction/44f170a7-a7d7-4fce-ab70-eb99336ea53b';

export const analyzeWithFlowise = async (
  imageFile: File,
  question: string = "Analyze this furniture piece and identify all components with materials and sourcing information"
): Promise<FlowiseApiResponse> => {
  try {
    // Convert image to base64 with proper data URL format
    const base64Image = await fileToBase64(imageFile);
    
    const requestBody: FlowiseApiRequest = {
      question,
      uploads: [
        {
          data: `data:${imageFile.type};base64,${base64Image}`,
          type: imageFile.type,
          name: imageFile.name
        }
      ],
      streaming: false
    };

    console.log('Sending request directly to Flowise API:', {
      question: question.substring(0, 100) + '...',
      hasImage: !!base64Image,
      imageType: imageFile.type,
      imageSize: imageFile.size
    });

    // Call Flowise API directly from frontend
    const response = await fetch(FLOWISE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Flowise API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flowise API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Flowise API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Flowise analysis completed successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error calling Flowise API directly:', error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Extract just the base64 part (remove the data URL prefix)
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};
