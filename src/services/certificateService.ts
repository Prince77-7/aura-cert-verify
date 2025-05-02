
import { supabase } from "../integrations/supabase/client";
import { Certificate } from "../types/Certificate";
import { v4 as uuidv4 } from "uuid";

// Map database object to Certificate type
const mapToCertificate = (dbCertificate: any): Certificate => {
  if (!dbCertificate) return null as any;
  
  // Log the raw certificate data to debug
  console.log('Raw DB Certificate:', dbCertificate);
  
  const certificate = {
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
    customStyles: dbCertificate.custom_styles,
    customData: dbCertificate.custom_data, // Map from database custom_data to customData in the app
    publicPdfUrl: dbCertificate.public_pdf_url // Added mapping for PDF URL
  };
  
  // Log the mapped certificate
  console.log('Mapped Certificate with PDF URL:', certificate);
  
  return certificate;
};

// Get all certificates for the authenticated user
export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("user_id", user.id);
    
    if (error) throw error;
    return data.map(mapToCertificate);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    // Fallback to local storage
    return JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
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
    const certificates = JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
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
    const certificates = JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
    return certificates.find((cert: Certificate) => cert.certificationId === verificationId && cert.status === "active") || null;
  }
};

// Create a new certificate
export const createCertificate = async (certificateData: Omit<Certificate, "id" | "status" | "certificationId">): Promise<Certificate> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");
    
    const certificationId = `CERT-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const newCertificate = {
      user_id: user.id,
      recipient_name: certificateData.recipientName,
      title: certificateData.title,
      issue_date: certificateData.issueDate,
      expiry_date: certificateData.expiryDate,
      issuer_name: certificateData.issuerName,
      description: certificateData.description,
      certification_id: certificationId,
      status: 'active',
      metadata: certificateData.metadata,
      template_id: certificateData.templateId,
      custom_styles: certificateData.customStyles,
      custom_data: certificateData.customData // Add custom_data field for Supabase
    };

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
    const certificates = JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
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
      customStyles: certificateData.customStyles,
      customData: certificateData.customData // Add customData for local storage
    };
    
    certificates.push(localNewCertificate);
    localStorage.setItem("shield_of_steel_certificates", JSON.stringify(certificates));
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
    const certificates = JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
    const updatedCertificates = certificates.map((cert: Certificate) => {
      if (cert.id === id) {
        return { ...cert, status: "revoked" };
      }
      return cert;
    });
    
    localStorage.setItem("shield_of_steel_certificates", JSON.stringify(updatedCertificates));
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
    const certificates = JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
    const filteredCertificates = certificates.filter((cert: Certificate) => cert.id !== id);
    
    localStorage.setItem("shield_of_steel_certificates", JSON.stringify(filteredCertificates));
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
    const certificates = JSON.parse(localStorage.getItem("shield_of_steel_certificates") || "[]");
    const updatedCertificates = certificates.map((cert: Certificate) => {
      if (cert.id === id) {
        return { ...cert, customStyles };
      }
      return cert;
    });
    
    localStorage.setItem("shield_of_steel_certificates", JSON.stringify(updatedCertificates));
  }
};
