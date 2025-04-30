
import { supabase } from "../integrations/supabase/client";
import { CertificateTemplate } from "../types/CertificateTemplate";
import { v4 as uuidv4 } from "uuid";

// Map database object to CertificateTemplate type
const mapToTemplate = (dbTemplate: any): CertificateTemplate => {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    createdAt: dbTemplate.created_at,
    updatedAt: dbTemplate.updated_at,
    styles: dbTemplate.styles
  };
};

// Get all templates
export const getTemplates = async (): Promise<CertificateTemplate[]> => {
  try {
    // Get both user templates and system templates
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*");
    
    if (error) throw error;
    return data.map(mapToTemplate);
  } catch (error) {
    console.error("Error fetching templates:", error);
    // Fallback to local storage
    return JSON.parse(localStorage.getItem("aura_certificate_templates") || "[]");
  }
};

// Get default template
export const getDefaultTemplate = async (): Promise<CertificateTemplate> => {
  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .eq("is_system", true)
      .limit(1)
      .single();
    
    if (error) throw error;
    return mapToTemplate(data);
  } catch (error) {
    console.error("Error fetching default template:", error);
    
    // Fallback to local storage or create a default
    const templates = JSON.parse(localStorage.getItem("aura_certificate_templates") || "[]");
    if (templates.length > 0) {
      return templates[0];
    }
    
    // Create a default template if none exists
    const defaultTemplate = {
      id: uuidv4(),
      name: "Default Template",
      description: "Default certificate template",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      styles: {
        backgroundColor: "#ffffff",
        backgroundImage: "",
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
          marginBottom: "20px"
        },
        recipientStyles: {
          fontSize: "28px",
          fontWeight: "normal",
          color: "#000000",
          textAlign: "center",
          marginTop: "40px",
          marginBottom: "10px"
        },
        issuerStyles: {
          fontSize: "18px",
          fontWeight: "normal",
          color: "#000000",
          textAlign: "center",
          marginTop: "60px",
          marginBottom: "10px"
        },
        dateStyles: {
          fontSize: "16px",
          fontWeight: "normal",
          color: "#000000",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px"
        },
        descriptionStyles: {
          fontSize: "16px",
          fontWeight: "normal",
          color: "#000000",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px"
        },
        logoStyles: {
          width: "120px",
          height: "120px",
          position: "top",
          margin: "20px auto"
        },
        signatureStyles: {
          width: "200px",
          height: "80px",
          position: "bottom",
          margin: "20px auto"
        }
      }
    };
    
    localStorage.setItem("aura_certificate_templates", JSON.stringify([defaultTemplate]));
    return defaultTemplate;
  }
};

// Get template by ID
export const getTemplateById = async (id: string): Promise<CertificateTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return mapToTemplate(data);
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    
    // Fallback to local storage
    const templates = JSON.parse(localStorage.getItem("aura_certificate_templates") || "[]");
    return templates.find((t: CertificateTemplate) => t.id === id) || null;
  }
};

// Create a new template
export const createTemplate = async (template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">): Promise<CertificateTemplate> => {
  const newTemplate = {
    name: template.name,
    description: template.description,
    styles: template.styles
  };

  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .insert(newTemplate)
      .select()
      .single();
    
    if (error) throw error;
    return mapToTemplate(data);
  } catch (error) {
    console.error("Error creating template:", error);
    
    // Fallback to local storage
    const templates = JSON.parse(localStorage.getItem("aura_certificate_templates") || "[]");
    const localNewTemplate = {
      id: uuidv4(),
      name: template.name,
      description: template.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      styles: template.styles
    };
    
    templates.push(localNewTemplate);
    localStorage.setItem("aura_certificate_templates", JSON.stringify(templates));
    return localNewTemplate;
  }
};

// Update a template
export const updateTemplate = async (id: string, template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">): Promise<CertificateTemplate> => {
  const updatedTemplate = {
    name: template.name,
    description: template.description,
    styles: template.styles,
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      .update(updatedTemplate)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return mapToTemplate(data);
  } catch (error) {
    console.error("Error updating template:", error);
    
    // Fallback to local storage
    const templates = JSON.parse(localStorage.getItem("aura_certificate_templates") || "[]");
    const updatedTemplates = templates.map((t: CertificateTemplate) => {
      if (t.id === id) {
        return { 
          ...t, 
          name: template.name, 
          description: template.description, 
          styles: template.styles, 
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    
    localStorage.setItem("aura_certificate_templates", JSON.stringify(updatedTemplates));
    return updatedTemplates.find((t: CertificateTemplate) => t.id === id)!;
  }
};

// Delete a template
export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("certificate_templates")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting template:", error);
    
    // Fallback to local storage
    const templates = JSON.parse(localStorage.getItem("aura_certificate_templates") || "[]");
    const filteredTemplates = templates.filter((t: CertificateTemplate) => t.id !== id);
    localStorage.setItem("aura_certificate_templates", JSON.stringify(filteredTemplates));
  }
};
