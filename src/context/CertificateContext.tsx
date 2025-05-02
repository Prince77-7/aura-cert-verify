
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Element } from '../types/types';

interface CertificateContextType {
  elements: Element[];
  selectedElement: Element | null;
  setElements: (elements: Element[]) => void;
  setSelectedElement: (element: Element | null) => void;
  addElement: (element: Element) => void;
  updateElement: (element: Element) => void;
  removeElement: (id: string) => void;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const addElement = (element: Element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  const updateElement = (updatedElement: Element) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === updatedElement.id ? updatedElement : element
      )
    );
  };

  const removeElement = (id: string) => {
    setElements((prevElements) => prevElements.filter((element) => element.id !== id));
  };

  return (
    <CertificateContext.Provider
      value={{
        elements,
        selectedElement,
        setElements,
        setSelectedElement,
        addElement,
        updateElement,
        removeElement,
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
};
