export interface Element {
  id: string;
  type: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  backgroundColor?: string;
  opacity?: number;
  rotation?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  zIndex?: number;
  hidden?: boolean;
  content?: string;
}

export type ElementType = 
  | "text" 
  | "title" 
  | "recipient" 
  | "issuer" 
  | "date" 
  | "description" 
  | "image" 
  | "signature" 
  | "logo"
  | "badge"
  | "verification";

// This ensures the CertificateElement type includes all the fields defined in Element
export interface CertificateElement extends Element {
  // Add any additional certificate-specific element properties here
  // We're keeping this interface to maintain backward compatibility
}

// Use this interface to adapt between the two CertificateElement types
export interface CertificateElementAdapter {
  fromNewFormat(element: import('./CertificateElement').CertificateElement): CertificateElement;
  toNewFormat(element: CertificateElement): import('./CertificateElement').CertificateElement;
}
