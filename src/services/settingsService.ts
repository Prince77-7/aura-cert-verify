const API_KEY_STORAGE_KEY = 'markupgo_api_key';
const CUSTOM_FIELDS_STORAGE_KEY = 'certificate_custom_field_names';
const TEMPLATE_ID_STORAGE_KEY = 'markupgo_template_id';

export const saveMarkupGoApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key to local storage:', error);
    // Handle potential errors (e.g., storage full, security restrictions)
  }
};

export const getMarkupGoApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving API key from local storage:', error);
    return null;
  }
};

// --- Custom Fields --- 

export const saveCustomFieldNames = (fieldNames: string[]): void => {
  try {
    localStorage.setItem(CUSTOM_FIELDS_STORAGE_KEY, JSON.stringify(fieldNames));
  } catch (error) {
    console.error('Error saving custom field names to local storage:', error);
  }
};

export const getCustomFieldNames = (): string[] => {
  try {
    const storedValue = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      // Basic validation to ensure it's an array of strings
      if (Array.isArray(parsedValue) && parsedValue.every(item => typeof item === 'string')) {
        return parsedValue;
      }
    }
  } catch (error) {
    console.error('Error retrieving or parsing custom field names from local storage:', error);
  }
  return []; // Return empty array if not found or error
};

// --- MarkupGo Template ID --- 

export const saveMarkupGoTemplateId = (templateId: string): void => {
  try {
    localStorage.setItem(TEMPLATE_ID_STORAGE_KEY, templateId);
  } catch (error) {
    console.error('Error saving MarkupGo Template ID to local storage:', error);
  }
};

export const getMarkupGoTemplateId = (): string | null => {
  try {
    return localStorage.getItem(TEMPLATE_ID_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving MarkupGo Template ID from local storage:', error);
    return null;
  }
};
