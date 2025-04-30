
import { v4 as uuidv4 } from "uuid";
import { CertificateTemplate } from "../types/CertificateTemplate";
import { toast } from "sonner";

// LocalStorage key for templates
const TEMPLATE_STORAGE_KEY = "aura_certificate_templates";

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
export const getTemplates = (): CertificateTemplate[] => {
  const storedTemplates = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (!storedTemplates) {
    // Initialize with default template if none exist
    const defaultId = uuidv4();
    const initialTemplate: CertificateTemplate = {
      ...defaultTemplate,
      id: defaultId,
      name: "Default Template",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify([initialTemplate]));
    return [initialTemplate];
  }
  return JSON.parse(storedTemplates);
};

// Get a template by ID
export const getTemplateById = (id: string): CertificateTemplate | undefined => {
  const templates = getTemplates();
  return templates.find((template) => template.id === id);
};

// Create a new template
export const createTemplate = (
  template: Omit<CertificateTemplate, "id" | "createdAt" | "updatedAt">
): CertificateTemplate => {
  const templates = getTemplates();
  const now = new Date().toISOString();
  
  const newTemplate: CertificateTemplate = {
    ...template,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  templates.push(newTemplate);
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  toast.success("Template created successfully");
  
  return newTemplate;
};

// Update an existing template
export const updateTemplate = (template: CertificateTemplate): CertificateTemplate => {
  const templates = getTemplates();
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
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  toast.success("Template updated successfully");
  
  return updatedTemplate;
};

// Delete a template
export const deleteTemplate = (id: string): boolean => {
  const templates = getTemplates();
  const filteredTemplates = templates.filter((template) => template.id !== id);
  
  if (filteredTemplates.length === templates.length) {
    toast.error("Template not found");
    return false;
  }
  
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(filteredTemplates));
  toast.success("Template deleted successfully");
  
  return true;
};

// Clone a template
export const cloneTemplate = (id: string): CertificateTemplate | undefined => {
  const templates = getTemplates();
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
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  toast.success("Template cloned successfully");
  
  return clonedTemplate;
};

// Get default template
export const getDefaultTemplate = (): CertificateTemplate => {
  const templates = getTemplates();
  // Return the first template as default
  return templates[0];
};
