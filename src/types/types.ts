
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
