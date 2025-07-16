
import { FlowiseApiRequest, FlowiseApiResponse } from '@/types/flowise';

const FLOWISE_API_URL = 'https://flowiseai-railway-production-21f8.up.railway.app/api/v1/prediction/fcea3e5f-a33a-423a-ad88-dcd5a5b1e8b9';

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

    console.log('Sending request to Flowise:', {
      url: FLOWISE_API_URL,
      question,
      hasImage: !!base64Image,
      imageType: imageFile.type,
      imageSize: imageFile.size
    });

    const response = await fetch(FLOWISE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

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
    console.log('Flowise API response:', data);
    
    return data;
  } catch (error) {
    console.error('Error calling Flowise API:', error);
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
