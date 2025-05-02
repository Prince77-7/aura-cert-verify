
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { CertificateElement, ElementType } from '@/types/CertificateElement';
import { Certificate } from '@/types/Certificate';
import { CertificateTemplate } from '@/types/CertificateTemplate';
import { toast } from "sonner";
import { updateCertificateStyles } from '@/services/certificateService';

// Import refactored components
import ElementList from './Editor/ElementList';
import CanvasControls from './Editor/CanvasControls';
import GradientEditor from './Editor/GradientEditor';
import CertificateCanvas from './Editor/CertificateCanvas';
import ElementPropertiesWrapper from './Editor/ElementPropertiesWrapper';

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

interface AdvancedCertificateEditorProps {
  certificate: Certificate;
  template: CertificateTemplate;
  onUpdate?: (certificate: Certificate) => void;
}

const AdvancedCertificateEditor: React.FC<AdvancedCertificateEditorProps> = ({ 
  certificate, 
  template,
  onUpdate 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [scale, setScale] = useState(1);
  const [selectedElement, setSelectedElement] = useState<CertificateElement | null>(null);
  const [elements, setElements] = useState<CertificateElement[]>([]);
  const [backgroundColor, setBackgroundColor] = useState(template.styles.backgroundColor || "#ffffff");
  const [backgroundGradient, setBackgroundGradient] = useState("");
  const [borderStyle, setBorderStyle] = useState(template.styles.borderStyle || "none");
  const [borderColor, setBorderColor] = useState(template.styles.borderColor || "#000000");
  const [borderWidth, setBorderWidth] = useState(template.styles.borderWidth || "0px");
  const [canvasWidth, setCanvasWidth] = useState(parseInt(template.styles.width) || DEFAULT_CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(parseInt(template.styles.height) || DEFAULT_CANVAS_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [gradientColors, setGradientColors] = useState([
    { color: "#ffffff", position: 0 },
    { color: "#000000", position: 100 }
  ]);
  const [gradientAngle, setGradientAngle] = useState(90);
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [presetGradients, setPresetGradients] = useState<string[]>([
    'linear-gradient(90deg, hsla(221, 45%, 73%, 1) 0%, hsla(220, 78%, 29%, 1) 100%)',
    'linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)',
    'linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)',
    'linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)',
    'linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)',
    'linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)',
  ]);
  
  // Initialize with default or saved elements
  useEffect(() => {
    // If certificate has custom elements, use them
    if (certificate.customStyles?.elements) {
      setElements(certificate.customStyles.elements);
      if (certificate.customStyles.backgroundColor) {
        setBackgroundColor(certificate.customStyles.backgroundColor);
      }
      if (certificate.customStyles.backgroundGradient) {
        setBackgroundGradient(certificate.customStyles.backgroundGradient);
      }
      if (certificate.customStyles.borderStyle) {
        setBorderStyle(certificate.customStyles.borderStyle);
      }
      if (certificate.customStyles.borderColor) {
        setBorderColor(certificate.customStyles.borderColor);
      }
      if (certificate.customStyles.borderWidth) {
        setBorderWidth(certificate.customStyles.borderWidth);
      }
      if (certificate.customStyles.width) {
        setCanvasWidth(parseInt(certificate.customStyles.width));
      }
      if (certificate.customStyles.height) {
        setCanvasHeight(parseInt(certificate.customStyles.height));
      }
    } else {
      // Create default elements based on certificate data
      const defaultElements: CertificateElement[] = [
        {
          id: uuidv4(),
          type: 'title',
          content: certificate.title,
          position: {
            x: 50,
            y: 50,
            width: canvasWidth - 100,
            height: 60,
            zIndex: 1,
          },
          style: {
            fontSize: template.styles.titleStyles.fontSize,
            fontWeight: template.styles.titleStyles.fontWeight,
            color: template.styles.titleStyles.color,
            textAlign: template.styles.titleStyles.textAlign as any,
            fontFamily: template.styles.fontFamily,
          }
        },
        {
          id: uuidv4(),
          type: 'recipient',
          content: certificate.recipientName,
          position: {
            x: 50,
            y: 150,
            width: canvasWidth - 100,
            height: 50,
            zIndex: 2,
          },
          style: {
            fontSize: template.styles.recipientStyles.fontSize,
            fontWeight: template.styles.recipientStyles.fontWeight,
            color: template.styles.recipientStyles.color,
            textAlign: template.styles.recipientStyles.textAlign as any,
            fontFamily: template.styles.fontFamily,
          }
        },
        {
          id: uuidv4(),
          type: 'description',
          content: certificate.description || 'Certificate description',
          position: {
            x: 100,
            y: 250,
            width: canvasWidth - 200,
            height: 100,
            zIndex: 3,
          },
          style: {
            fontSize: template.styles.descriptionStyles.fontSize,
            fontWeight: template.styles.descriptionStyles.fontWeight,
            color: template.styles.descriptionStyles.color,
            textAlign: template.styles.descriptionStyles.textAlign as any,
            fontFamily: template.styles.fontFamily,
          }
        },
        {
          id: uuidv4(),
          type: 'date',
          content: `Issue Date: ${certificate.issueDate}${certificate.expiryDate ? `\nExpiry Date: ${certificate.expiryDate}` : ''}`,
          position: {
            x: 50,
            y: 400,
            width: canvasWidth - 100,
            height: 50,
            zIndex: 4,
          },
          style: {
            fontSize: template.styles.dateStyles.fontSize,
            fontWeight: template.styles.dateStyles.fontWeight,
            color: template.styles.dateStyles.color,
            textAlign: template.styles.dateStyles.textAlign as any,
            fontFamily: template.styles.fontFamily,
          }
        },
        {
          id: uuidv4(),
          type: 'issuer',
          content: certificate.issuerName,
          position: {
            x: (canvasWidth / 2) - 100,
            y: 500,
            width: 200,
            height: 50,
            zIndex: 5,
          },
          style: {
            fontSize: template.styles.issuerStyles.fontSize,
            fontWeight: template.styles.issuerStyles.fontWeight,
            color: template.styles.issuerStyles.color,
            textAlign: template.styles.issuerStyles.textAlign as any,
            fontFamily: template.styles.fontFamily,
            borderTop: '1px solid #000',
            paddingTop: '10px',
          }
        },
        {
          id: uuidv4(),
          type: 'verification',
          content: `ID: ${certificate.certificationId}`,
          position: {
            x: canvasWidth - 150,
            y: canvasHeight - 30,
            width: 140,
            height: 20,
            zIndex: 6,
          },
          style: {
            fontSize: '10px',
            fontWeight: 'normal',
            color: '#666666',
            textAlign: 'right',
            fontFamily: template.styles.fontFamily,
          }
        }
      ];
      setElements(defaultElements);
    }
  }, [certificate.id]);

  // Update zoom scale
  useEffect(() => {
    setScale(zoom / 100);
  }, [zoom]);

  // Save changes when elements or canvas properties change
  useEffect(() => {
    setIsUnsaved(true);
  }, [elements, backgroundColor, backgroundGradient, borderStyle, borderColor, borderWidth, canvasWidth, canvasHeight]);

  const handleAddElement = (type: ElementType) => {
    const newElements = [...elements];
    
    // Default element properties based on type
    let elementProps: Partial<CertificateElement> = {};
    
    switch(type) {
      case 'text':
        elementProps = {
          content: 'Enter text here',
          position: { x: 50, y: 50, width: 200, height: 50, zIndex: newElements.length + 1 },
          style: { 
            fontSize: '16px', 
            color: '#000000', 
            fontFamily: template.styles.fontFamily,
            textAlign: 'left'
          }
        };
        break;
      
      case 'image':
        elementProps = {
          position: { x: 50, y: 50, width: 200, height: 150, zIndex: newElements.length + 1 },
          style: { 
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            border: '1px dashed #cccccc'
          }
        };
        break;
      
      case 'signature':
        elementProps = {
          position: { x: 50, y: 400, width: 200, height: 100, zIndex: newElements.length + 1 },
          style: { 
            borderTop: '1px solid #000000',
            paddingTop: '5px',
            textAlign: 'center',
            fontSize: '14px'
          },
          content: 'Signature'
        };
        break;
      
      case 'badge':
        elementProps = {
          position: { x: canvasWidth - 150, y: 50, width: 100, height: 100, zIndex: newElements.length + 1 },
          style: { 
            backgroundColor: '#f0f0f0',
            borderRadius: '50%',
            border: '2px solid #cccccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          content: 'Badge'
        };
        break;
        
      default:
        elementProps = {
          content: `New ${type} element`,
          position: { x: 50, y: 50, width: 200, height: 50, zIndex: newElements.length + 1 },
          style: {}
        };
    }
    
    // Create new element
    const newElement: CertificateElement = {
      id: uuidv4(),
      type,
      ...elementProps as any
    };

    newElements.push(newElement);
    setElements(newElements);
    setSelectedElement(newElement);
    toast.success(`Added new ${type} element`);
  };

  const handleElementSelect = (element: CertificateElement | null) => {
    setSelectedElement(element);
  };

  const handleElementDelete = (id: string) => {
    if (!id) return;
    
    const newElements = elements.filter(element => element.id !== id);
    setElements(newElements);
    
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(null);
    }
    
    toast.success("Element deleted");
  };

  const handleElementDragStart = (e: React.MouseEvent, element: CertificateElement) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.button !== 0) return; // Only respond to left mouse button
    
    setSelectedElement(element);
    setIsDragging(true);
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate offset between mouse position and element position
    const offsetX = (e.clientX - canvasRect.left) / scale - element.position.x;
    const offsetY = (e.clientY - canvasRect.top) / scale - element.position.y;
    
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate new position with offset and scale
    const newX = Math.max(0, Math.min(canvasWidth - selectedElement.position.width, 
      (e.clientX - canvasRect.left) / scale - dragOffset.x));
      
    const newY = Math.max(0, Math.min(canvasHeight - selectedElement.position.height, 
      (e.clientY - canvasRect.top) / scale - dragOffset.y));
    
    // Update element position
    const newElements = elements.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          position: {
            ...el.position,
            x: newX,
            y: newY
          }
        };
      }
      return el;
    });
    
    setElements(newElements);
    
    // Also update selectedElement to reflect new position
    setSelectedElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        x: newX,
        y: newY
      }
    });
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsUnsaved(true);
    }
    
    if (isResizing) {
      setIsResizing(false);
      setIsUnsaved(true);
    }
  };

  const handleElementUpdate = (updatedElement: CertificateElement) => {
    const newElements = elements.map(el => {
      if (el.id === updatedElement.id) {
        return updatedElement;
      }
      return el;
    });
    
    setElements(newElements);
    setSelectedElement(updatedElement);
    setIsUnsaved(true);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas, not on an element
    if (e.currentTarget === e.target) {
      setSelectedElement(null);
    }
  };

  const handleSaveChanges = async () => {
    const customStyles = {
      elements,
      backgroundColor,
      backgroundGradient,
      borderStyle,
      borderColor,
      borderWidth,
      width: `${canvasWidth}px`,
      height: `${canvasHeight}px`,
    };
    
    try {
      await updateCertificateStyles(certificate.id, customStyles);
      
      if (onUpdate) {
        onUpdate({
          ...certificate,
          customStyles
        });
      }
      
      setIsUnsaved(false);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleApplyGradient = () => {
    // Convert gradient colors to CSS linear gradient
    const gradient = `linear-gradient(${gradientAngle}deg, ${gradientColors.map(
      gc => `${gc.color} ${gc.position}%`
    ).join(', ')})`;
    
    setBackgroundGradient(gradient);
    setShowGradientPicker(false);
  };

  const handleAddGradientColor = () => {
    // Add a color stop at middle position
    const newColors = [...gradientColors, { 
      color: "#ffffff", 
      position: 50 
    }];
    
    // Sort by position
    newColors.sort((a, b) => a.position - b.position);
    setGradientColors(newColors);
  };

  const handleUpdateGradientColor = (index: number, color: string) => {
    const newColors = [...gradientColors];
    newColors[index].color = color;
    setGradientColors(newColors);
  };

  const handleUpdateGradientPosition = (index: number, position: number) => {
    const newColors = [...gradientColors];
    newColors[index].position = position;
    // Sort by position
    newColors.sort((a, b) => a.position - b.position);
    setGradientColors(newColors);
  };

  const handleRemoveGradientColor = (index: number) => {
    if (gradientColors.length <= 2) {
      toast.error("Gradient must have at least two colors");
      return;
    }
    
    const newColors = gradientColors.filter((_, i) => i !== index);
    setGradientColors(newColors);
  };

  const handleUsePresetGradient = (gradient: string) => {
    setBackgroundGradient(gradient);
    setShowGradientPicker(false);
  };

  const handleBringToFront = () => {
    if (!selectedElement) return;
    
    // Find highest z-index
    const highestZ = Math.max(...elements.map(el => el.position.zIndex));
    
    // Update selected element z-index
    const newElements = elements.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          position: {
            ...el.position,
            zIndex: highestZ + 1
          }
        };
      }
      return el;
    });
    
    setElements(newElements);
    
    // Also update selectedElement to reflect new z-index
    setSelectedElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        zIndex: highestZ + 1
      }
    });
    
    setIsUnsaved(true);
  };

  const handleSendToBack = () => {
    if (!selectedElement) return;
    
    // Find lowest z-index
    const lowestZ = Math.min(...elements.map(el => el.position.zIndex));
    
    // Update selected element z-index
    const newElements = elements.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          position: {
            ...el.position,
            zIndex: lowestZ - 1
          }
        };
      }
      return el;
    });
    
    setElements(newElements);
    
    // Also update selectedElement to reflect new z-index
    setSelectedElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        zIndex: lowestZ - 1
      }
    });
    
    setIsUnsaved(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4 overflow-hidden flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap bg-muted p-2 rounded-md">
          <Button 
            variant="outline" 
            size="sm"
            disabled={!isUnsaved}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              disabled={zoom <= 25}
            >
              -
            </Button>
            <span className="text-xs w-16 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              +
            </Button>
          </div>
        </div>

        <div 
          className="bg-muted rounded-md p-4 overflow-auto relative flex justify-center"
          style={{ height: '70vh' }}
        >
          <CertificateCanvas 
            canvasRef={canvasRef}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            scale={scale}
            backgroundColor={backgroundColor}
            backgroundGradient={backgroundGradient}
            borderStyle={borderStyle}
            borderColor={borderColor}
            borderWidth={borderWidth}
            elements={elements}
            selectedElement={selectedElement}
            isDragging={isDragging}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
            onElementClick={(e, element) => {
              e.stopPropagation();
              handleElementSelect(element);
            }}
            onElementMouseDown={handleElementDragStart}
          />
        </div>
      </div>

      {/* Right sidebar for controls */}
      <div className="w-full lg:w-1/4">
        <Tabs defaultValue="elements">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="canvas" className="p-2 border rounded-md">
            <CanvasControls 
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              backgroundColor={backgroundColor}
              backgroundGradient={backgroundGradient}
              borderStyle={borderStyle}
              borderColor={borderColor}
              borderWidth={borderWidth}
              onWidthChange={setCanvasWidth}
              onHeightChange={setCanvasHeight}
              onBackgroundColorChange={setBackgroundColor}
              onBorderStyleChange={setBorderStyle}
              onBorderColorChange={setBorderColor}
              onBorderWidthChange={setBorderWidth}
              onShowGradientPicker={() => setShowGradientPicker(true)}
              onClearGradient={() => setBackgroundGradient("")}
            />
          </TabsContent>
          
          <TabsContent value="elements" className="p-2 border rounded-md">
            <ElementList 
              elements={elements}
              selectedElement={selectedElement}
              onSelectElement={handleElementSelect}
              onDeleteElement={handleElementDelete}
              onAddElement={handleAddElement}
            />
          </TabsContent>
          
          <TabsContent value="properties" className="p-2 border rounded-md">
            <ElementPropertiesWrapper 
              selectedElement={selectedElement}
              onUpdateElement={handleElementUpdate}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
              onDelete={handleElementDelete}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Gradient picker dialog */}
      <GradientEditor 
        open={showGradientPicker}
        onOpenChange={setShowGradientPicker}
        gradientAngle={gradientAngle}
        gradientColors={gradientColors}
        presetGradients={presetGradients}
        onAngleChange={setGradientAngle}
        onColorChange={handleUpdateGradientColor}
        onPositionChange={handleUpdateGradientPosition}
        onAddColor={handleAddGradientColor}
        onRemoveColor={handleRemoveGradientColor}
        onApplyGradient={handleApplyGradient}
        onUsePreset={handleUsePresetGradient}
      />
    </div>
  );
};

export default AdvancedCertificateEditor;
