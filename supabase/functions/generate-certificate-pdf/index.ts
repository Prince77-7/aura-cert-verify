// supabase/functions/generate-certificate-pdf/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts' 

interface CertificateData {
  id: string;
  custom_data: Record<string, any>;
  // Add other fields if needed by MarkupGo template, though we aim to only use custom_data
}

// Helper function to call MarkupGo API (following their official documentation)
async function generatePdfMarkupGo(
  apiKey: string,
  templateId: string,
  context: Record<string, any>
): Promise<{url: string}> {
  const MARKUPGO_API_URL = 'https://api.markupgo.com/api/v1/pdf'; // Correct URL from docs

  console.log(`Calling MarkupGo for template: ${templateId} with context keys: ${Object.keys(context || {}).join(', ')}`);

  const response = await fetch(MARKUPGO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey, // Correct header name (lowercase x)
    },
    body: JSON.stringify({
      source: {
        type: 'template',
        data: {
          id: templateId, // Template ID goes inside source.data.id
          context: context || {} // Custom data goes in context, defaults to empty object
        }
      },
      // Optionally include PDF settings if needed
      // options: { ... }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`MarkupGo API Error (${response.status}): ${errorBody}`);
    throw new Error(`MarkupGo failed: ${response.statusText} - ${errorBody}`);
  }

  // MarkupGo returns a task object with a URL to the generated PDF
  const taskResponse = await response.json();
  console.log(`MarkupGo task created: ${JSON.stringify(taskResponse)}`);
  
  if (!taskResponse.url) {
    throw new Error('MarkupGo response missing PDF URL');
  }
  
  console.log(`Generated PDF available at: ${taskResponse.url}`);
  
  // Return just the URL, no need to download the PDF
  return { url: taskResponse.url };
}


serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get Certificate ID and Template ID from request body
    const { certificateId, templateId } = await req.json(); // Read both IDs
    if (!certificateId || !templateId) { // Check for both
      throw new Error("Missing 'certificateId' or 'templateId' in request body.");
    }
    console.log(`Processing request for certificate ID: ${certificateId} using template ID: ${templateId}`);

    // 2. Get Environment Variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const markupGoApiKey = Deno.env.get('MARKUPGO_API_KEY'); // Get key from env

    if (!supabaseUrl || !serviceRoleKey || !markupGoApiKey) {
      console.error('Missing environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or MARKUPGO_API_KEY');
      throw new Error('Server configuration error: Missing required environment variables.');
    }

    // 3. Create Supabase Admin Client (privileged access)
    const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // 4. Fetch Certificate Data from Database
    console.log(`Fetching certificate data for ID: ${certificateId}`);
    const { data: certificateData, error: fetchError } = await supabaseAdmin
      .from('certificates') // Use your actual table name
      .select('id, custom_data, recipient_name, title, issue_date') // Get more fields for debugging
      .eq('id', certificateId)
      .single();

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      throw new Error(`Failed to fetch certificate data: ${fetchError.message}`);
    }
    if (!certificateData) {
      throw new Error(`Certificate with ID ${certificateId} not found.`);
    }

    // Debug the data being received from the database
    console.log('Certificate found:', {
      id: certificateData.id,
      recipient_name: certificateData.recipient_name,
      title: certificateData.title,
      custom_data_exists: certificateData.custom_data ? 'YES' : 'NO',
      custom_data_type: certificateData.custom_data ? typeof certificateData.custom_data : 'N/A',
      custom_data_empty: certificateData.custom_data ? 'Has keys: ' + Object.keys(certificateData.custom_data).join(', ') : 'EMPTY'
    });
    
    // Log the actual custom_data for inspection
    console.log('CUSTOM DATA FROM DB:', JSON.stringify(certificateData.custom_data || {}));

    // Create a more complete context for MarkupGo that includes both certificate fields and custom data
    // This helps ensure we send all relevant data to the template
    const templateContext = {
      // Include standard certificate fields (may be used in MarkupGo template)
      recipient_name: certificateData.recipient_name,
      title: certificateData.title,
      issue_date: certificateData.issue_date,
      
      // Also include all custom fields (if any exist)
      ...(certificateData.custom_data || {})
    };
    
    // Log the exact payload we're sending to MarkupGo
    console.log('SENDING TO MARKUPGO:', JSON.stringify({
      templateId: templateId,
      context: templateContext
    }));
    
    // 5. Call MarkupGo API to get the PDF URL
    const { url: pdfUrl } = await generatePdfMarkupGo(
      markupGoApiKey,
      templateId, // Use templateId from request body
      templateContext // Send the combined data to ensure template has access to all fields
    );

    console.log(`PDF generated successfully, URL: ${pdfUrl}`);

    // 6. Optionally, update certificate record with PDF URL in database
    // Uncomment if you want to store the URL in your database
    /*
    const { error: updateError } = await supabaseAdmin
      .from('certificates')
      .update({ pdf_url: pdfUrl })
      .eq('id', certificateId);
    
    if (updateError) {
      console.error(`Failed to update certificate record with PDF URL: ${updateError.message}`);
    } else {
      console.log(`Certificate record updated successfully with PDF URL.`);
    }
    */

    // 7. Return Success Response with the MarkupGo URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'PDF generated successfully.',
        pdfUrl: pdfUrl // Return the URL directly from MarkupGo
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in Edge Function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500, // Use 400 for client errors like missing ID, 500 for server errors
      }
    )
  }
})
