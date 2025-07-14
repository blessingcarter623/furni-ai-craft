import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const flowiseApiUrl = Deno.env.get('FLOWISE_API_URL') || 'http://localhost:3000';
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { designId, imageUrl } = await req.json();

    if (!designId || !imageUrl) {
      throw new Error('Design ID and image URL are required');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Update design status to analyzing
    await supabase
      .from('furniture_designs')
      .update({ status: 'analyzing' })
      .eq('id', designId);

    // Analyze image with Flowise AI
    const analysisResponse = await fetch(`${flowiseApiUrl}/api/v1/prediction/6680b0bb-b90f-4b6a-91db-50c7e97f8fb8`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: `Please analyze this furniture design image and provide a complete material breakdown with costs in South African Rand (ZAR). Focus on South African suppliers and be specific about wood types, hardware, and finishing materials. 
        
        Your response must be a valid JSON object with this exact structure:
        {
          "description": "Detailed description of the furniture piece",
          "style_category": "modern/traditional/rustic/industrial/etc", 
          "difficulty_level": "beginner/intermediate/advanced",
          "estimated_time_hours": number,
          "estimated_cost_min": number,
          "estimated_cost_max": number,
          "materials": [
            {
              "name": "material name",
              "category": "wood/hardware/upholstery/finish/etc",
              "quantity": number,
              "unit": "pieces/meters/liters/etc", 
              "estimated_cost": number,
              "priority": "required/optional/alternative",
              "notes": "specific details or alternatives"
            }
          ]
        }`,
        overrideConfig: {
          "Image URL": imageUrl
        }
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`Flowise API error: ${analysisResponse.statusText}`);
    }

    const analysisData = await analysisResponse.json();
    const content = analysisData.text || analysisData.answer || analysisData;
    
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(content);
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON');
    }

    // Save analysis results
    const { data: analysisResult, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        design_id: designId,
        ai_description: parsedAnalysis.description,
        estimated_cost_min: parsedAnalysis.estimated_cost_min,
        estimated_cost_max: parsedAnalysis.estimated_cost_max,
        difficulty_level: parsedAnalysis.difficulty_level,
        estimated_time_hours: parsedAnalysis.estimated_time_hours,
        style_category: parsedAnalysis.style_category,
        raw_ai_response: parsedAnalysis
      })
      .select()
      .single();

    if (analysisError) {
      throw new Error(`Database error: ${analysisError.message}`);
    }

    // Save materials
    const materialsToInsert = parsedAnalysis.materials.map((material: any) => ({
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysisId: analysisResult.id,
        message: 'Analysis completed successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-furniture function:', error);
    
    // Update design status to failed if we have designId
    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { designId } = await req.json();
        if (designId) {
          await supabase
            .from('furniture_designs')
            .update({ status: 'failed' })
            .eq('id', designId);
        }
      } catch (e) {
        console.error('Failed to update design status:', e);
      }
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});