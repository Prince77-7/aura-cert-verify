
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";

// Storage keys for local fallback
const API_KEY_STORAGE_KEY = 'markupgo_api_key';
const CUSTOM_FIELDS_STORAGE_KEY = 'certificate_custom_field_names';
const TEMPLATE_ID_STORAGE_KEY = 'markupgo_template_id';

// Check if a user is authenticated
const isUserAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.user;
};

// Get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// --- MarkupGo API Key ---

export const saveMarkupGoApiKey = async (apiKey: string): Promise<void> => {
  try {
    const authenticated = await isUserAuthenticated();
    
    if (authenticated) {
      // First, check if the user already has settings
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
        .single();
      
      if (existingSettings) {
        // Update existing settings
        await supabase
          .from('user_settings')
          .update({ markupgo_api_key: apiKey })
          .eq('user_id', (await supabase.auth.getUser()).data.user!.id);
      } else {
        // Insert new settings
        await supabase
          .from('user_settings')
          .insert({ 
            user_id: (await supabase.auth.getUser()).data.user!.id,
            markupgo_api_key: apiKey 
          });
      }
    }
    
    // Fall back to localStorage for non-authenticated users
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key:', error);
    toast.error('Failed to save API key');
    // Fall back to localStorage
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }
};

export const getMarkupGoApiKey = async (): Promise<string | null> => {
  try {
    const authenticated = await isUserAuthenticated();
    
    if (authenticated) {
      const { data, error } = await supabase
        .from('user_settings')
        .select('markupgo_api_key')
        .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found is not a real error for us
          console.error('Error retrieving API key from Supabase:', error);
        }
        return localStorage.getItem(API_KEY_STORAGE_KEY); // Fall back to localStorage
      }
      
      return data?.markupgo_api_key || localStorage.getItem(API_KEY_STORAGE_KEY); // Return DB value or localStorage fallback
    } else {
      // Fall back to localStorage for non-authenticated users
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return localStorage.getItem(API_KEY_STORAGE_KEY); // Fall back to localStorage on error
  }
};

// --- Custom Fields --- 

export const saveCustomFieldNames = async (fieldNames: string[]): Promise<void> => {
  try {
    const authenticated = await isUserAuthenticated();
    
    if (authenticated) {
      // First, check if the user already has settings
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
        .single();
      
      if (existingSettings) {
        // Update existing settings
        await supabase
          .from('user_settings')
          .update({ custom_field_names: fieldNames })
          .eq('user_id', (await supabase.auth.getUser()).data.user!.id);
      } else {
        // Insert new settings
        await supabase
          .from('user_settings')
          .insert({ 
            user_id: (await supabase.auth.getUser()).data.user!.id,
            custom_field_names: fieldNames 
          });
      }
    }
    
    // Always save to localStorage as a backup and for non-authenticated users
    localStorage.setItem(CUSTOM_FIELDS_STORAGE_KEY, JSON.stringify(fieldNames));
  } catch (error) {
    console.error('Error saving custom field names:', error);
    // Fall back to localStorage
    localStorage.setItem(CUSTOM_FIELDS_STORAGE_KEY, JSON.stringify(fieldNames));
  }
};

// FIX: Return string[] directly instead of Promise<string[]>
export const getCustomFieldNames = (): string[] => {
  try {
    // First try to get from localStorage
    const storedValue = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      // Basic validation to ensure it's an array of strings
      if (Array.isArray(parsedValue) && parsedValue.every(item => typeof item === 'string')) {
        return parsedValue;
      }
    }
    return []; // Return empty array if not found or error
  } catch (error) {
    console.error('Error parsing custom field names from local storage:', error);
    return []; // Return empty array on error
  }
};

// Add a new async version that can be used when needed
export const fetchCustomFieldNamesAsync = async (): Promise<string[]> => {
  try {
    const authenticated = await isUserAuthenticated();
    
    if (authenticated) {
      const { data, error } = await supabase
        .from('user_settings')
        .select('custom_field_names')
        .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found is not a real error for us
          console.error('Error retrieving custom fields from Supabase:', error);
        }
      } else if (data?.custom_field_names) {
        // If we have data from Supabase, return it
        return Array.isArray(data.custom_field_names) ? data.custom_field_names : [];
      }
    }
    
    // Fall back to localStorage
    return getCustomFieldNames();
  } catch (error) {
    console.error('Error retrieving custom field names:', error);
    return getCustomFieldNames(); // Fall back to localStorage on error
  }
};

// --- MarkupGo Template ID --- 

export const saveMarkupGoTemplateId = async (templateId: string): Promise<void> => {
  try {
    const authenticated = await isUserAuthenticated();
    
    if (authenticated) {
      // First, check if the user already has settings
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
        .single();
      
      if (existingSettings) {
        // Update existing settings
        await supabase
          .from('user_settings')
          .update({ markupgo_template_id: templateId })
          .eq('user_id', (await supabase.auth.getUser()).data.user!.id);
      } else {
        // Insert new settings
        await supabase
          .from('user_settings')
          .insert({ 
            user_id: (await supabase.auth.getUser()).data.user!.id,
            markupgo_template_id: templateId 
          });
      }
    }
    
    // Always save to localStorage as a backup and for non-authenticated users
    localStorage.setItem(TEMPLATE_ID_STORAGE_KEY, templateId);
  } catch (error) {
    console.error('Error saving MarkupGo Template ID:', error);
    // Fall back to localStorage
    localStorage.setItem(TEMPLATE_ID_STORAGE_KEY, templateId);
  }
};

export const getMarkupGoTemplateId = async (): Promise<string | null> => {
  try {
    const authenticated = await isUserAuthenticated();
    
    if (authenticated) {
      const { data, error } = await supabase
        .from('user_settings')
        .select('markupgo_template_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // Not found is not a real error for us
          console.error('Error retrieving template ID from Supabase:', error);
        }
        return localStorage.getItem(TEMPLATE_ID_STORAGE_KEY); // Fall back to localStorage
      }
      
      return data?.markupgo_template_id || localStorage.getItem(TEMPLATE_ID_STORAGE_KEY);
    } else {
      // Fall back to localStorage for non-authenticated users
      return localStorage.getItem(TEMPLATE_ID_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error retrieving MarkupGo Template ID:', error);
    return localStorage.getItem(TEMPLATE_ID_STORAGE_KEY); // Fall back to localStorage on error
  }
};

// Helper function to sync local settings to Supabase after login
export const syncLocalSettingsToSupabase = async (): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      console.log('User not authenticated, skipping settings sync.');
      return;
    }
    
    const localApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const localTemplateId = localStorage.getItem(TEMPLATE_ID_STORAGE_KEY);
    const localCustomFields = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    
    if (localApiKey || localTemplateId || localCustomFields) {
      // First, check if the user already has settings
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      const fieldsToUpdate = {
        ...(localApiKey ? { markupgo_api_key: localApiKey } : {}),
        ...(localTemplateId ? { markupgo_template_id: localTemplateId } : {}),
        ...(localCustomFields ? { custom_field_names: JSON.parse(localCustomFields) } : {})
      };
      
      if (existingSettings) {
        // Update existing settings, only if we have local values
        if (Object.keys(fieldsToUpdate).length > 0) {
          await supabase
            .from('user_settings')
            .update(fieldsToUpdate)
            .eq('user_id', userId);
        }
      } else {
        // Insert new settings, only if we have local values
        if (Object.keys(fieldsToUpdate).length > 0) {
          await supabase
            .from('user_settings')
            .insert({ 
              user_id: userId,
              ...fieldsToUpdate
            });
        }
      }
    }
  } catch (error) {
    console.error('Error syncing local settings to Supabase:', error);
  }
};
