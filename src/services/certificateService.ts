
import { Certificate } from "../types/Certificate";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error(`Error fetching certificates: ${error.message}`);
      throw error;
    }
    
    return data as Certificate[];
  } catch (error) {
    console.error("Error fetching certificates:", error);
    
    // Fallback to localStorage in case of error
    const storedData = localStorage.getItem("aura_certificates");
    return storedData ? JSON.parse(storedData) : [];
  }
};

export const getCertificateById = async (id: string): Promise<Certificate | undefined> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code !== "PGRST116") { // Don't show error for "no rows returned"
        toast.error(`Error fetching certificate: ${error.message}`);
      }
      return undefined;
    }
    
    return data as Certificate;
  } catch (error) {
    console.error("Error fetching certificate by ID:", error);
    
    // Fallback to localStorage
    const certificates = getCertificatesFromLocalStorage();
    return certificates.find(cert => cert.id === id);
  }
};

export const getCertificateByVerificationId = async (certificationId: string): Promise<Certificate | undefined> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("certification_id", certificationId)
      .single();
    
    if (error) {
      if (error.code !== "PGRST116") { // Don't show error for "no rows returned"
        console.error(`Error fetching certificate: ${error.message}`);
      }
      return undefined;
    }
    
    return data as Certificate;
  } catch (error) {
    console.error("Error fetching certificate by verification ID:", error);
    
    // Fallback to localStorage
    const certificates = getCertificatesFromLocalStorage();
    return certificates.find(cert => cert.certificationId === certificationId);
  }
};

export const createCertificate = async (
  certificateData: Omit<Certificate, "id" | "certificationId" | "status">
): Promise<Certificate> => {
  // Generate a unique verification code
  const certificationId = generateVerificationCode();
  
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    const newCertificate = {
      ...certificateData,
      certification_id: certificationId,
      status: "active",
      user_id: user.user.id
    };
    
    const { data, error } = await supabase
      .from("certificates")
      .insert(newCertificate)
      .select()
      .single();
    
    if (error) {
      toast.error(`Error creating certificate: ${error.message}`);
      throw error;
    }
    
    toast.success("Certificate created successfully");
    
    // Convert from snake_case to camelCase for frontend use
    return {
      id: data.id,
      recipientName: data.recipient_name,
      title: data.title,
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
      issuerName: data.issuer_name,
      description: data.description,
      certificationId: data.certification_id,
      status: data.status,
      metadata: data.metadata,
      templateId: data.template_id,
      customStyles: data.custom_styles
    } as Certificate;
  } catch (error) {
    console.error("Error creating certificate:", error);
    
    // Fallback to localStorage
    const certificates = getCertificatesFromLocalStorage();
    
    const newCertificate: Certificate = {
      ...certificateData,
      id: uuidv4(),
      certificationId,
      status: "active"
    };
    
    certificates.push(newCertificate);
    localStorage.setItem("aura_certificates", JSON.stringify(certificates));
    toast.success("Certificate created successfully (offline mode)");
    
    return newCertificate;
  }
};

export const updateCertificate = async (certificate: Certificate): Promise<Certificate> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    // Convert to snake_case for Supabase
    const certificateData = {
      id: certificate.id,
      recipient_name: certificate.recipientName,
      title: certificate.title,
      issue_date: certificate.issueDate,
      expiry_date: certificate.expiryDate,
      issuer_name: certificate.issuerName,
      description: certificate.description,
      certification_id: certificate.certificationId,
      status: certificate.status,
      metadata: certificate.metadata,
      template_id: certificate.templateId,
      custom_styles: certificate.customStyles,
      user_id: user.user.id
    };
    
    const { error } = await supabase
      .from("certificates")
      .update(certificateData)
      .eq("id", certificate.id);
    
    if (error) {
      toast.error(`Error updating certificate: ${error.message}`);
      throw error;
    }
    
    toast.success("Certificate updated successfully");
    return certificate;
  } catch (error) {
    console.error("Error updating certificate:", error);
    
    // Fallback to localStorage
    const certificates = getCertificatesFromLocalStorage();
    const index = certificates.findIndex(cert => cert.id === certificate.id);
    
    if (index !== -1) {
      certificates[index] = certificate;
      localStorage.setItem("aura_certificates", JSON.stringify(certificates));
      toast.success("Certificate updated successfully (offline mode)");
      return certificate;
    } else {
      toast.error("Certificate not found");
      throw new Error("Certificate not found");
    }
  }
};

export const deleteCertificate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);
    
    if (error) {
      toast.error(`Error deleting certificate: ${error.message}`);
      return false;
    }
    
    toast.success("Certificate deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting certificate:", error);
    
    // Fallback to localStorage
    const certificates = getCertificatesFromLocalStorage();
    const filteredCertificates = certificates.filter(cert => cert.id !== id);
    
    if (filteredCertificates.length < certificates.length) {
      localStorage.setItem("aura_certificates", JSON.stringify(filteredCertificates));
      toast.success("Certificate deleted successfully (offline mode)");
      return true;
    } else {
      toast.error("Certificate not found");
      return false;
    }
  }
};

export const revokeCertificate = async (id: string): Promise<Certificate | undefined> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .update({ status: "revoked" })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      toast.error(`Error revoking certificate: ${error.message}`);
      return undefined;
    }
    
    toast.success("Certificate revoked successfully");
    
    // Convert from snake_case to camelCase for frontend use
    return {
      id: data.id,
      recipientName: data.recipient_name,
      title: data.title,
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
      issuerName: data.issuer_name,
      description: data.description,
      certificationId: data.certification_id,
      status: data.status,
      metadata: data.metadata,
      templateId: data.template_id,
      customStyles: data.custom_styles
    } as Certificate;
  } catch (error) {
    console.error("Error revoking certificate:", error);
    
    // Fallback to localStorage
    const certificates = getCertificatesFromLocalStorage();
    const certificate = certificates.find(cert => cert.id === id);
    
    if (certificate) {
      certificate.status = "revoked";
      localStorage.setItem("aura_certificates", JSON.stringify(certificates));
      toast.success("Certificate revoked successfully (offline mode)");
      return certificate;
    } else {
      toast.error("Certificate not found");
      return undefined;
    }
  }
};

// Helper function to get certificates from localStorage
const getCertificatesFromLocalStorage = (): Certificate[] => {
  const storedData = localStorage.getItem("aura_certificates");
  return storedData ? JSON.parse(storedData) : [];
};

// Generate a verification code (e.g., XXXX-XXXX-XXXX format)
const generateVerificationCode = (): string => {
  const segments = 3;
  const segmentLength = 4;
  let result = '';
  
  for (let i = 0; i < segments; i++) {
    if (i > 0) result += '-';
    for (let j = 0; j < segmentLength; j++) {
      // Use characters that are less likely to be confused
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return result;
};
