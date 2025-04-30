
import { Certificate } from "../types/Certificate";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// In a real app, this would connect to an API/database
const LOCAL_STORAGE_KEY = "aura_certificates";

export const getCertificates = (): Certificate[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const getCertificateById = (id: string): Certificate | undefined => {
  const certificates = getCertificates();
  return certificates.find(cert => cert.id === id);
};

export const getCertificateByVerificationId = (certificationId: string): Certificate | undefined => {
  const certificates = getCertificates();
  return certificates.find(cert => cert.certificationId === certificationId);
};

export const createCertificate = (certificate: Omit<Certificate, "id" | "certificationId" | "status">): Certificate => {
  const certificates = getCertificates();
  
  // Generate a unique ID and verification code
  const id = uuidv4();
  const certificationId = generateVerificationCode();
  
  const newCertificate: Certificate = {
    ...certificate,
    id,
    certificationId,
    status: "active"
  };
  
  certificates.push(newCertificate);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certificates));
  toast.success("Certificate created successfully");
  
  return newCertificate;
};

export const updateCertificate = (certificate: Certificate): Certificate => {
  const certificates = getCertificates();
  const index = certificates.findIndex(cert => cert.id === certificate.id);
  
  if (index !== -1) {
    certificates[index] = certificate;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certificates));
    toast.success("Certificate updated successfully");
    return certificate;
  } else {
    toast.error("Certificate not found");
    throw new Error("Certificate not found");
  }
};

export const deleteCertificate = (id: string): boolean => {
  const certificates = getCertificates();
  const filteredCertificates = certificates.filter(cert => cert.id !== id);
  
  if (filteredCertificates.length < certificates.length) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredCertificates));
    toast.success("Certificate deleted successfully");
    return true;
  } else {
    toast.error("Certificate not found");
    return false;
  }
};

export const revokeCertificate = (id: string): Certificate | undefined => {
  const certificates = getCertificates();
  const certificate = certificates.find(cert => cert.id === id);
  
  if (certificate) {
    certificate.status = "revoked";
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certificates));
    toast.success("Certificate revoked successfully");
    return certificate;
  } else {
    toast.error("Certificate not found");
    return undefined;
  }
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
