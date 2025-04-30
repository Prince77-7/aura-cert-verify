
import { v4 as uuidv4 } from "uuid";
import { CertificateTemplate } from "../types/CertificateTemplate";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Default template as a starting point
export const defaultTemplate: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt" | "name"> = {
  description: "Default certificate template",
  styles: {
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderColor: "#000000",
    borderWidth: "3px",
    width: "800px",
    height: "600px",
    fontFamily: "Georgia, serif",
    titleStyles: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#000000",
      textAlign: "center",
      marginTop: "80px",
      marginBottom: "20px",
    },
    recipientStyles: {
      fontSize: "28px",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
      marginTop: "40px",
      marginBottom: "10px",
    },
    issuerStyles: {
      fontSize: "18px",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
      marginTop: "60px",
      marginBottom: "10px",
    },
    dateStyles: {
      fontSize: "16px",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
      marginTop: "20px",
      marginBottom: "20px",
    },
    descriptionStyles: {
      fontSize: "16px",
      fontWeight: "normal",
      color: "#000000",
      textAlign: "center",
      marginTop: "20px",
      marginBottom: "20px",
    },
    logoStyles: {
      width: "120px",
      height: "120px",
      position: "top",
      margin: "20px auto",
    },
    signatureStyles: {
      width: "200px",
      height: "80px",
      position: "bottom",
      margin: "20px auto",
    },
  },
};

// Get all templates
export const getTemplates = async (): Promise<CertificateTemplate[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    let query = supabase
      .from("certificate_templates")
      .select("*");
    
    if (user.user) {
      // Get both user's templates and system templates
      query = query.or(`user_id.eq.${user.user.id},is_system.eq.true`);
    } else {
      // Get only system templates if not authenticated
      query = query.eq("is_system", true);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching templates:", error);
      // Fallback to localStorage
      return getTemplatesFromLocalStorage();
    }
    
    if (!data || data.length === 0) {
      return getTemplatesFromLocalStorage();
    }
    
    // Convert from snake_case to camelCase for frontend use
    return data.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      createdAt: template.created_at,
      updatedAt: template.updated_at,
      styles: template.styles
    })) as CertificateTemplate[];
  } catch (error) {
    console.error("Error fetching templates:", error);
    return getTemplatesFromLocalStorage();
  }
};

// Get a template by ID
export const getTemplateById = async (id: string): Promise<CertificateTemplate | undefined> => {
  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code !== "PGRST116") { // Don't show error for "no rows returned"
        console.error("Error fetching template by ID:", error);
      }
      
      // Fallback to localStorage
      const templates = getTemplatesFromLocalStorage();
      return templates.find((template) => template.id === id);
    }
    
    // Convert from snake_case to camelCase for frontend use
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      styles: data.styles
    } as CertificateTemplate;
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    
    // Fallback to localStorage
    const templates = getTemplatesFromLocalStorage();
    return templates.find((template) => template.id === id);
  }
};

// Create a new template
export const createTemplate = async (
  template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">
): Promise<CertificateTemplate> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from("certificate_templates")
      .insert({
        name: template.name,
        description: template.description,
        styles: template.styles,
        user_id: user.user.id,
        is_system: false
      })
      .select()
      .single();
    
    if (error) {
      toast.error(`Error creating template: ${error.message}`);
      throw error;
    }
    
    toast.success("Template created successfully");
    
    // Convert from snake_case to camelCase for frontend use
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      styles: data.styles
    } as CertificateTemplate;
  } catch (error) {
    console.error("Error creating template:", error);
    
    // Fallback to localStorage
    const templates = getTemplatesFromLocalStorage();
    
    const now = new Date().toISOString();
    const newTemplate: CertificateTemplate = {
      ...template,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    templates.push(newTemplate);
    localStorage.setItem("aura_certificate_templates", JSON.stringify(templates));
    toast.success("Template created successfully (offline mode)");
    
    return newTemplate;
  }
};

// Update an existing template
export const updateTemplate = async (template: CertificateTemplate): Promise<CertificateTemplate> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from("certificate_templates")
      .update({
        name: template.name,
        description: template.description,
        styles: template.styles,
        updated_at: new Date().toISOString()
      })
      .eq("id", template.id);
    
    if (error) {
      toast.error(`Error updating template: ${error.message}`);
      throw error;
    }
    
    toast.success("Template updated successfully");
    
    // Return the updated template with a new updatedAt timestamp
    return {
      ...template,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error updating template:", error);
    
    // Fallback to localStorage
    const templates = getTemplatesFromLocalStorage();
    const index = templates.findIndex((t) => t.id === template.id);
    
    if (index === -1) {
      toast.error("Template not found");
      throw new Error("Template not found");
    }
    
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString(),
    };
    
    templates[index] = updatedTemplate;
    localStorage.setItem("aura_certificate_templates", JSON.stringify(templates));
    toast.success("Template updated successfully (offline mode)");
    
    return updatedTemplate;
  }
};

// Delete a template
export const deleteTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("certificate_templates")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast.error(`Error deleting template: ${error.message}`);
      return false;
    }
    
    toast.success("Template deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting template:", error);
    
    // Fallback to localStorage
    const templates = getTemplatesFromLocalStorage();
    const filteredTemplates = templates.filter((template) => template.id !== id);
    
    if (filteredTemplates.length === templates.length) {
      toast.error("Template not found");
      return false;
    }
    
    localStorage.setItem("aura_certificate_templates", JSON.stringify(filteredTemplates));
    toast.success("Template deleted successfully (offline mode)");
    return true;
  }
};

// Clone a template
export const cloneTemplate = async (id: string): Promise<CertificateTemplate | undefined> => {
  try {
    // Get the template to clone
    const template = await getTemplateById(id);
    if (!template) {
      toast.error("Template not found");
      return undefined;
    }
    
    // Create a new template based on the cloned one
    const clonedTemplate = await createTemplate({
      name: `${template.name} (Copy)`,
      description: template.description,
      styles: template.styles
    });
    
    toast.success("Template cloned successfully");
    return clonedTemplate;
  } catch (error) {
    console.error("Error cloning template:", error);
    
    // Fallback to localStorage
    const templates = getTemplatesFromLocalStorage();
    const templateToClone = templates.find((template) => template.id === id);
    
    if (!templateToClone) {
      toast.error("Template not found");
      return undefined;
    }
    
    const now = new Date().toISOString();
    const clonedTemplate: CertificateTemplate = {
      ...templateToClone,
      id: uuidv4(),
      name: `${templateToClone.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    
    templates.push(clonedTemplate);
    localStorage.setItem("aura_certificate_templates", JSON.stringify(templates));
    toast.success("Template cloned successfully (offline mode)");
    
    return clonedTemplate;
  }
};

// Get default template
export const getDefaultTemplate = async (): Promise<CertificateTemplate> => {
  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .eq("is_system", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    
    if (error || !data) {
      // Fallback to local default
      return createDefaultLocalTemplate();
    }
    
    // Convert from snake_case to camelCase for frontend use
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      styles: data.styles
    } as CertificateTemplate;
  } catch (error) {
    console.error("Error fetching default template:", error);
    return createDefaultLocalTemplate();
  }
};

// Helper function to create a default local template
const createDefaultLocalTemplate = (): CertificateTemplate => {
  const now = new Date().toISOString();
  return {
    id: "default-template",
    name: "Default Template",
    description: "Default certificate template",
    createdAt: now,
    updatedAt: now,
    ...defaultTemplate
  };
};

// Helper function to get templates from localStorage
const getTemplatesFromLocalStorage = (): CertificateTemplate[] => {
  const storedTemplates = localStorage.getItem("aura_certificate_templates");
  if (!storedTemplates) {
    // Initialize with default template if none exist
    const defaultLocalTemplate = createDefaultLocalTemplate();
    localStorage.setItem("aura_certificate_templates", JSON.stringify([defaultLocalTemplate]));
    return [defaultLocalTemplate];
  }
  return JSON.parse(storedTemplates);
};
