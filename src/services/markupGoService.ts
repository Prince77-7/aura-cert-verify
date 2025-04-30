import { getMarkupGoApiKey, getMarkupGoTemplateId } from './settingsService';
import { Certificate } from '@/types/Certificate';
import { toast } from 'sonner';

const MARKUPGO_API_ENDPOINT = 'https://api.markupgo.com/v1/pdf/create';

/**
 * Calls the MarkupGo API to generate a PDF using a pre-defined MarkupGo template.
 * 
 * @param certificate - The certificate data (including customData).
 * @returns A Promise that resolves with the PDF Blob or rejects with an error.
 */
export const generatePdfFromMarkupGo = async (certificate: Certificate): Promise<Blob> => {
  const apiKey = getMarkupGoApiKey();
  const templateId = getMarkupGoTemplateId();

  if (!apiKey) {
    toast.error('MarkupGo API Key not set. Please configure it in Settings.', { duration: 5000 });
    throw new Error('MarkupGo API Key not configured.');
  }

  if (!templateId) {
    toast.error('MarkupGo Template ID not set. Please configure it in Settings.', { duration: 5000 });
    throw new Error('MarkupGo Template ID not configured.');
  }

  // Prepare data payload using ONLY customData for the MarkupGo template
  const dataPayload = certificate.customData || {};
  // Important: Ensure your MarkupGo template uses variables matching the keys 
  // defined in your Custom Certificate Fields settings (e.g., {{ name }}, {{ certificate_id }} ).

  // Validate if customData is empty, maybe warn or error?
  if (Object.keys(dataPayload).length === 0) {
      console.warn("Sending empty data payload to MarkupGo as no custom fields have values.");
      // Optionally, throw an error if sending empty data is not desired:
      // toast.error('Cannot generate PDF: No custom field data provided for the certificate.');
      // throw new Error('No custom field data provided for MarkupGo payload.');
  }

  const payload = {
    template_id: templateId,
    data: dataPayload,
  };

  try {
    console.log("Sending payload to MarkupGo:", JSON.stringify(payload, null, 2));
    const response = await fetch(MARKUPGO_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("MarkupGo API Response Status:", response.status);

    if (!response.ok) {
      let errorBody = 'Unknown error';
      try {
        const errorData = await response.json();
        errorBody = errorData.message || errorData.error || JSON.stringify(errorData);
        console.error("MarkupGo API Error Details:", errorData);
      } catch (e) {
        errorBody = await response.text();
        console.error("MarkupGo API Raw Error Response:", errorBody);
      }
      toast.error(`MarkupGo Error (${response.status}): ${errorBody}`, { duration: 10000 });
      throw new Error(`MarkupGo API request failed with status ${response.status}: ${errorBody}`);
    }

    const pdfBlob = await response.blob();
    console.log("Received PDF Blob from MarkupGo:", pdfBlob);
    return pdfBlob;

  } catch (error) {
    console.error('Error calling MarkupGo API:', error);
    if (!(error instanceof Error && error.message.startsWith('MarkupGo API request failed'))) {
      toast.error('Failed to generate PDF via MarkupGo. Check console for details.');
    }
    throw error;
  }
};
