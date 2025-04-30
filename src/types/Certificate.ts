export interface Certificate {
  id: string;
  recipientName: string;
  title: string;
  issueDate: string;
  expiryDate?: string;
  issuerName: string;
  description?: string; // Optional description for the certificate
  certificationId: string; // Unique ID for verification
  status: "active" | "revoked" | "expired";
  metadata?: Record<string, string>; // Additional fields
  templateId?: string; // Reference to template used
  customStyles?: Record<string, any>; // Custom styles if different from template
  customData?: Record<string, string>; // Add field for custom data
  publicPdfUrl?: string; // Optional: Public URL of the generated PDF in Supabase Storage
}
