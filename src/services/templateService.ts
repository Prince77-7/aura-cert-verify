import { supabase } from "../integrations/supabase/client";
import { CertificateTemplate } from "../types/CertificateTemplate";
import { v4 as uuidv4 } from "uuid";

// Map database object to CertificateTemplate type
const mapToTemplate = (dbTemplate: any): CertificateTemplate => {
  // Basic validation: Ensure dbTemplate is an object and has an id
  if (!dbTemplate || typeof dbTemplate !== 'object' || !dbTemplate.id) {
    console.error("Invalid dbTemplate received in mapToTemplate:", dbTemplate);
    throw new Error("Invalid template data received from database.");
  }

  // Ensure position is one of the allowed values
  const logoPosition = dbTemplate.styles?.logoStyles?.position;
  const validLogoPosition = logoPosition && ["top", "bottom", "left", "right"].includes(logoPosition) 
    ? logoPosition as "top" | "bottom" | "left" | "right"
    : "top";

  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    description: dbTemplate.description || "",
    markupgo_template_id: dbTemplate.markupgo_template_id || "", 
    createdAt: dbTemplate.created_at,
    updatedAt: dbTemplate.updated_at,
    styles: {
      backgroundColor: dbTemplate.styles?.backgroundColor || "#ffffff",
      backgroundImage: dbTemplate.styles?.backgroundImage || "",
      borderStyle: dbTemplate.styles?.borderStyle || "solid",
      borderColor: dbTemplate.styles?.borderColor || "#000000",
      borderWidth: dbTemplate.styles?.borderWidth || "3px",
      width: dbTemplate.styles?.width || "800px",
      height: dbTemplate.styles?.height || "600px",
      fontFamily: dbTemplate.styles?.fontFamily || "Georgia, serif",
      titleStyles: {
        fontSize: dbTemplate.styles?.titleStyles?.fontSize || "32px",
        fontWeight: dbTemplate.styles?.titleStyles?.fontWeight || "bold",
        color: dbTemplate.styles?.titleStyles?.color || "#000000",
        textAlign: dbTemplate.styles?.titleStyles?.textAlign || "center",
        marginTop: dbTemplate.styles?.titleStyles?.marginTop || "80px",
        marginBottom: dbTemplate.styles?.titleStyles?.marginBottom || "20px"
      },
      recipientStyles: {
        fontSize: dbTemplate.styles?.recipientStyles?.fontSize || "28px",
        fontWeight: dbTemplate.styles?.recipientStyles?.fontWeight || "normal",
        color: dbTemplate.styles?.recipientStyles?.color || "#000000",
        textAlign: dbTemplate.styles?.recipientStyles?.textAlign || "center",
        marginTop: dbTemplate.styles?.recipientStyles?.marginTop || "40px",
        marginBottom: dbTemplate.styles?.recipientStyles?.marginBottom || "10px"
      },
      issuerStyles: {
        fontSize: dbTemplate.styles?.issuerStyles?.fontSize || "18px",
        fontWeight: dbTemplate.styles?.issuerStyles?.fontWeight || "normal",
        color: dbTemplate.styles?.issuerStyles?.color || "#000000",
        textAlign: dbTemplate.styles?.issuerStyles?.textAlign || "center",
        marginTop: dbTemplate.styles?.issuerStyles?.marginTop || "60px",
        marginBottom: dbTemplate.styles?.issuerStyles?.marginBottom || "10px"
      },
      dateStyles: {
        fontSize: dbTemplate.styles?.dateStyles?.fontSize || "16px",
        fontWeight: dbTemplate.styles?.dateStyles?.fontWeight || "normal",
        color: dbTemplate.styles?.dateStyles?.color || "#000000",
        textAlign: dbTemplate.styles?.dateStyles?.textAlign || "center",
        marginTop: dbTemplate.styles?.dateStyles?.marginTop || "20px",
        marginBottom: dbTemplate.styles?.dateStyles?.marginBottom || "20px"
      },
      descriptionStyles: {
        fontSize: dbTemplate.styles?.descriptionStyles?.fontSize || "16px",
        fontWeight: dbTemplate.styles?.descriptionStyles?.fontWeight || "normal",
        color: dbTemplate.styles?.descriptionStyles?.color || "#000000",
        textAlign: dbTemplate.styles?.descriptionStyles?.textAlign || "center",
        marginTop: dbTemplate.styles?.descriptionStyles?.marginTop || "20px",
        marginBottom: dbTemplate.styles?.descriptionStyles?.marginBottom || "20px"
      },
      logoStyles: {
        width: dbTemplate.styles?.logoStyles?.width || "120px",
        height: dbTemplate.styles?.logoStyles?.height || "120px",
        position: validLogoPosition,
        margin: dbTemplate.styles?.logoStyles?.margin || "20px auto"
      },
      signatureStyles: {
        width: dbTemplate.styles?.signatureStyles?.width || "200px",
        height: dbTemplate.styles?.signatureStyles?.height || "80px",
        position: "bottom",
        margin: dbTemplate.styles?.signatureStyles?.margin || "20px auto"
      }
    }
  };
};

// Get all templates
export const getTemplates = async (): Promise<CertificateTemplate[]> => {
  try {
    // Get both user templates and system templates
    // Explicitly select columns including the new one
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("id, name, description, markupgo_template_id, created_at, updated_at, styles");
    
    if (error) throw error;
    // Ensure data is an array before mapping
    return Array.isArray(data) ? data.map(mapToTemplate) : [];
  } catch (error) {
    console.error("Error fetching templates:", error);
    // Fallback to local storage - Note: LocalStorage data might not have the new field!
    const localData = JSON.parse(localStorage.getItem("shield_of_steel_certificate_templates") || "[]");
    // Attempt to map local data too, handling potential missing fields
    return Array.isArray(localData) ? localData.map(item => ({ ...mapToTemplate({}), ...item })) : []; // Provide defaults
  }
};

// Get default template
export const getDefaultTemplate = async (): Promise<CertificateTemplate> => {
  try {
    // Explicitly select columns including the new one
    const { data, error } = await supabase
      .from("certificate_templates")
      .select("id, name, description, markupgo_template_id, created_at, updated_at, styles")
      .eq("is_system", true)
      .limit(1)
      .single();
    
    if (error) throw error;
    return mapToTemplate(data);
  } catch (error) {
    console.error("Error fetching default template:", error);
    
    // Fallback to local storage or create a default
    const templates = JSON.parse(localStorage.getItem("shield_of_steel_certificate_templates") || "[]");
    if (templates.length > 0) {
      return templates[0];
    }
    
    // Create a default template if none exists
    const defaultTemplate: CertificateTemplate = {
      id: uuidv4(),
      name: "Default Template",
      description: "Default certificate template",
      markupgo_template_id: "default-markupgo-id", // Provide a default markupgo ID here too
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
    
    localStorage.setItem("shield_of_steel_certificate_templates", JSON.stringify([defaultTemplate]));
    return defaultTemplate;
  }
};

// Get template by ID
export const getTemplateById = async (id: string): Promise<CertificateTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("certificate_templates")
      // Explicitly select columns including the new one
      .select("id, name, description, markupgo_template_id, created_at, updated_at, styles")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return mapToTemplate(data);
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    
    // Fallback to local storage
    const templates = JSON.parse(localStorage.getItem("shield_of_steel_certificate_templates") || "[]");
    return templates.find((t: CertificateTemplate) => t.id === id) || null;
  }
};

// Create a new template
export const createTemplate = async (template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">): Promise<CertificateTemplate> => {
  const newTemplate = {
    name: template.name,
    description: template.description,
    markupgo_template_id: template.markupgo_template_id, // Add the field
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
    const templates = JSON.parse(localStorage.getItem("shield_of_steel_certificate_templates") || "[]");
    const localNewTemplate: CertificateTemplate = { // Ensure type safety
      id: uuidv4(),
      name: template.name,
      description: template.description || "",
      markupgo_template_id: template.markupgo_template_id, // Add the field
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      styles: template.styles
    };
    
    templates.push(localNewTemplate);
    localStorage.setItem("shield_of_steel_certificate_templates", JSON.stringify(templates));
    return localNewTemplate;
  }
};

// Update a template
export const updateTemplate = async (id: string, template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">): Promise<CertificateTemplate> => {
  const updatedTemplate = {
    name: template.name,
    description: template.description,
    markupgo_template_id: template.markupgo_template_id, // Add the field
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
    const templates = JSON.parse(localStorage.getItem("shield_of_steel_certificate_templates") || "[]");
    const updatedTemplates = templates.map((t: CertificateTemplate) => {
      if (t.id === id) {
        return { 
          ...t, 
          name: template.name, 
          description: template.description, 
          markupgo_template_id: template.markupgo_template_id, // Add the field
          styles: template.styles, 
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    });
    
    localStorage.setItem("shield_of_steel_certificate_templates", JSON.stringify(updatedTemplates));
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
    const templates = JSON.parse(localStorage.getItem("shield_of_steel_certificate_templates") || "[]");
    const filteredTemplates = templates.filter((t: CertificateTemplate) => t.id !== id);
    localStorage.setItem("shield_of_steel_certificate_templates", JSON.stringify(filteredTemplates));
  }
};
