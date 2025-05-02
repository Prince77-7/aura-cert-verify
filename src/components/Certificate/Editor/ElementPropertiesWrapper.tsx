
import React from 'react';
import { CertificateElement } from '@/types/CertificateElement';
import ElementPropertiesPanel from '../ElementPropertiesPanel';
import { Square } from 'lucide-react';
import { elementAdapter } from '@/utils/elementAdapter';

interface ElementPropertiesWrapperProps {
  selectedElement: CertificateElement | null;
  onUpdateElement: (updatedElement: CertificateElement) => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDelete: (id: string) => void;
}

const ElementPropertiesWrapper: React.FC<ElementPropertiesWrapperProps> = ({
  selectedElement,
  onUpdateElement,
  onBringToFront,
  onSendToBack,
  onDelete
}) => {
  // Convert the new CertificateElement format to the legacy format
  const legacyElement = selectedElement ? elementAdapter.fromNewFormat(selectedElement) : null;
  
  // Handler to convert the updated legacy element back to the new format
  const handleUpdateElement = (updatedLegacyElement: import('@/types/types').CertificateElement) => {
    if (selectedElement) {
      const updatedNewElement = elementAdapter.toNewFormat(updatedLegacyElement);
      onUpdateElement(updatedNewElement);
    }
  };
  
  return (
    <>
      {selectedElement ? (
        <ElementPropertiesPanel 
          selectedElement={legacyElement}
          onUpdateElement={handleUpdateElement}
          onBringToFront={onBringToFront}
          onSendToBack={onSendToBack}
          onDelete={() => selectedElement && onDelete(selectedElement.id)}
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Square className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select an element to edit its properties</p>
        </div>
      )}
    </>
  );
};

export default ElementPropertiesWrapper;
