
import { supabase } from "../integrations/supabase/client";
import { Certificate } from "../types/Certificate";
import { v4 as uuidv4 } from "uuid";

// Map database object to Certificate type
const mapToCertificate = (dbCertificate: any): Certificate => {
  return {
    id: dbCertificate.id,
    recipientName: dbCertificate.recipient_name,
    title: dbCertificate.title,
    issueDate: dbCertificate.issue_date,
    expiryDate: dbCertificate.expiry_date,
    issuerName: dbCertificate.issuer_name,
    description: dbCertificate.description,
    certificationId: dbCertificate.certification_id,
    status: dbCertificate.status,
    metadata: dbCertificate.metadata,
    templateId: dbCertificate.template_id,
    customStyles: dbCertificate.custom_styles
  };
};

// Get all certificates for the authenticated user
export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*");
    
    if (error) throw error;
    return data.map(mapToCertificate);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    // Fallback to local storage
    return JSON.parse(localStorage.getItem("aura_certificates") || "[]");
  }
};

// Get certificate by ID
export const getCertificateById = async (id: string): Promise<Certificate | null> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return mapToCertificate(data);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    // Fallback to local storage
    const certificates = JSON.parse(localStorage.getItem("aura_certificates") || "[]");
    return certificates.find((cert: Certificate) => cert.id === id) || null;
  }
};

// Get certificate by verification ID
export const getCertificateByVerificationId = async (verificationId: string): Promise<Certificate | null> => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("certification_id", verificationId)
      .eq("status", "active")
      .single();
    
    if (error) throw error;
    return mapToCertificate(data);
  } catch (error) {
    console.error("Error fetching certificate by verification ID:", error);
    // Fallback to local storage
    const certificates = JSON.parse(localStorage.getItem("aura_certificates") || "[]");
    return certificates.find((cert: Certificate) => cert.certificationId === verificationId && cert.status === "active") || null;
  }
};

// Create a new certificate
export const createCertificate = async (certificateData: Omit<Certificate, "id" | "status" | "certificationId">): Promise<Certificate> => {
  const newCertificate = {
    recipient_name: certificateData.recipientName,
    title: certificateData.title,
    issue_date: certificateData.issueDate,
    expiry_date: certificateData.expiryDate,
    issuer_name: certificateData.issuerName,
    description: certificateData.description,
    certification_id: `CERT-${uuidv4().substring(0, 8).toUpperCase()}`,
    status: 'active',
    metadata: certificateData.metadata,
    template_id: certificateData.templateId,
    custom_styles: certificateData.customStyles
  };

  try {
    const { data, error } = await supabase
      .from("certificates")
      .insert(newCertificate)
      .select()
      .single();
    
    if (error) throw error;
    return mapToCertificate(data);
  } catch (error) {
    console.error("Error creating certificate:", error);
    
    // Fallback to local storage
    const certificates = JSON.parse(localStorage.getItem("aura_certificates") || "[]");
    const localNewCertificate = {
      id: uuidv4(),
      recipientName: certificateData.recipientName,
      title: certificateData.title,
      issueDate: certificateData.issueDate,
      expiryDate: certificateData.expiryDate,
      issuerName: certificateData.issuerName,
      description: certificateData.description,
      certificationId: `CERT-${uuidv4().substring(0, 8).toUpperCase()}`,
      status: 'active' as const,
      metadata: certificateData.metadata,
      templateId: certificateData.templateId,
      customStyles: certificateData.customStyles
    };
    
    certificates.push(localNewCertificate);
    localStorage.setItem("aura_certificates", JSON.stringify(certificates));
    return localNewCertificate;
  }
};

// Revoke a certificate
export const revokeCertificate = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("certificates")
      .update({ status: "revoked" })
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error revoking certificate:", error);
    
    // Fallback to local storage
    const certificates = JSON.parse(localStorage.getItem("aura_certificates") || "[]");
    const updatedCertificates = certificates.map((cert: Certificate) => {
      if (cert.id === id) {
        return { ...cert, status: "revoked" };
      }
      return cert;
    });
    
    localStorage.setItem("aura_certificates", JSON.stringify(updatedCertificates));
  }
};

// Delete a certificate
export const deleteCertificate = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting certificate:", error);
    
    // Fallback to local storage
    const certificates = JSON.parse(localStorage.getItem("aura_certificates") || "[]");
    const filteredCertificates = certificates.filter((cert: Certificate) => cert.id !== id);
    
    localStorage.setItem("aura_certificates", JSON.stringify(filteredCertificates));
  }
};

// Update certificate custom styles
export const updateCertificateStyles = async (id: string, customStyles: Record<string, any>): Promise<void> => {
  try {
    const { error } = await supabase
      .from("certificates")
      .update({ custom_styles: customStyles })
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating certificate styles:", error);
    
    // Fallback to local storage
    const certificates = JSON.parse(localStorage.getItem("aura_certificates") || "[]");
    const updatedCertificates = certificates.map((cert: Certificate) => {
      if (cert.id === id) {
        return { ...cert, customStyles };
      }
      return cert;
    });
    
    localStorage.setItem("aura_certificates", JSON.stringify(updatedCertificates));
  }
};
