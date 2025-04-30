
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

export type CertificateElement = {
  id: string;
  type: ElementType;
  content?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };
  style: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    borderStyle?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    opacity?: number;
    transform?: string;
    boxShadow?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundBlendMode?: string;
    filter?: string;
    backdropFilter?: string;
    borderTop?: string;
    border?: string;
    paddingTop?: string;
    display?: string;
    alignItems?: string;
    justifyContent?: string;
  };
  metadata?: Record<string, any>;
};

export interface AdvancedCertificateTemplate {
  canvas: {
    width: number;
    height: number;
    backgroundColor: string;
    backgroundImage?: string;
    borderStyle?: string;
    borderColor?: string;
    borderWidth?: string;
    elements: CertificateElement[];
  };
  gradients?: {
    id: string;
    type: "linear" | "radial";
    colors: {
      color: string;
      position: number;
    }[];
    angle?: number; // for linear gradients
    center?: { x: number; y: number }; // for radial gradients
  }[];
}
