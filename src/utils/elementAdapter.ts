
import { CertificateElement as LegacyElement } from '@/types/types';
import { CertificateElement as NewElement, ElementType } from '@/types/CertificateElement';

/**
 * Converts a CertificateElement in the new format to the legacy format
 */
export const fromNewFormat = (element: NewElement): LegacyElement => {
  return {
    id: element.id,
    type: element.type,
    name: element.metadata?.name as string,
    x: element.position.x,
    y: element.position.y,
    width: element.position.width,
    height: element.position.height,
    fontSize: element.style.fontSize ? parseInt(element.style.fontSize) : undefined,
    fontFamily: element.style.fontFamily,
    color: element.style.color,
    bold: element.style.fontWeight === 'bold',
    italic: element.style.fontStyle === 'italic',
    underline: element.style.textDecoration === 'underline',
    backgroundColor: element.style.backgroundColor,
    opacity: element.style.opacity,
    rotation: element.style.transform ? parseRotation(element.style.transform) : undefined,
    borderWidth: element.style.borderWidth ? parseInt(element.style.borderWidth) : undefined,
    borderColor: element.style.borderColor,
    borderRadius: element.style.borderRadius ? parseInt(element.style.borderRadius) : undefined,
    zIndex: element.position.zIndex,
    hidden: element.metadata?.hidden as boolean,
    content: element.content,
  };
};

/**
 * Converts a CertificateElement in the legacy format to the new format
 */
export const toNewFormat = (element: LegacyElement): NewElement => {
  return {
    id: element.id,
    type: element.type as ElementType,
    content: element.content,
    position: {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      zIndex: element.zIndex || 0,
    },
    style: {
      fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
      fontWeight: element.bold ? 'bold' : undefined,
      fontFamily: element.fontFamily,
      color: element.color,
      backgroundColor: element.backgroundColor,
      textDecoration: element.underline ? 'underline' : undefined,
      fontStyle: element.italic ? 'italic' : undefined,
      opacity: element.opacity,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      borderWidth: element.borderWidth ? `${element.borderWidth}px` : undefined,
      borderColor: element.borderColor,
      borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
    },
    metadata: {
      name: element.name,
      hidden: element.hidden,
    },
  };
};

// Helper function to extract rotation value from transform string
const parseRotation = (transform: string): number | undefined => {
  const match = transform.match(/rotate\(([0-9.-]+)deg\)/);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }
  return undefined;
};

export const elementAdapter = {
  fromNewFormat,
  toNewFormat,
};
