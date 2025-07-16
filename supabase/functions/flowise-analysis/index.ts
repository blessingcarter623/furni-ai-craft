
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FLOWISE_API_URL = 'https://cloud.flowiseai.com/api/v1/prediction/44f170a7-a7d7-4fce-ab70-eb99336ea53b';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, uploads } = await req.json();

    console.log('Flowise analysis request:', {
      question: question?.substring(0, 100) + '...',
      hasUploads: !!uploads,
      uploadsCount: uploads?.length || 0
    });

    const requestBody = {
      question,
      ...(uploads && uploads.length > 0 && { uploads }),
      streaming: false
    };

    console.log('Sending request to Flowise API...');

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
    console.log('Flowise API response received successfully');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in flowise-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to analyze with Flowise API'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
