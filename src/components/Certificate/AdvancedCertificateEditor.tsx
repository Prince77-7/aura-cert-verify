
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trash2, 
  Image, 
  Type, 
  Signature, 
  Move, 
  Text, 
  Square, 
  LayoutTemplate,
  Plus,
  Upload,
  Download,
  Layers
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { 
  CertificateElement, 
  ElementType, 
  AdvancedCertificateTemplate 
} from '@/types/CertificateElement';
import { CertificateTemplate } from '@/types/CertificateTemplate';
import { Certificate } from '@/types/Certificate';
import ColorPicker from './ColorPicker';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Slider
} from "@/components/ui/slider";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ElementPropertiesPanel from './ElementPropertiesPanel';
import { updateCertificateStyles } from '@/services/certificateService';

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
  }, [certificate.id]); // Only run once when certificate changes

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

  const canvasStyle: React.CSSProperties = {
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    backgroundColor: backgroundGradient ? 'transparent' : backgroundColor,
    backgroundImage: backgroundGradient || 'none',
    borderStyle: borderStyle,
    borderColor: borderColor,
    borderWidth: borderWidth,
    position: 'relative',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease'
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
          <div 
            ref={canvasRef}
            style={canvasStyle}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleCanvasClick}
            className="canvas-editor"
          >
            {elements.map((element) => (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.position.width}px`,
                  height: `${element.position.height}px`,
                  zIndex: element.position.zIndex,
                  cursor: isDragging && selectedElement?.id === element.id ? 'grabbing' : 'pointer',
                  border: selectedElement?.id === element.id ? '2px solid #3b82f6' : 'none',
                  padding: '2px',
                  ...element.style,
                  backgroundImage: element.type === 'image' && element.style.backgroundImage 
                    ? element.style.backgroundImage 
                    : 'none',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleElementSelect(element);
                }}
                onMouseDown={(e) => handleElementDragStart(e, element)}
              >
                {element.type !== 'image' && element.content}
                
                {selectedElement?.id === element.id && (
                  <div className="resize-handles">
                    {/* Resize handles would go here */}
                  </div>
                )}
              </div>
            ))}
          </div>
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
            <h3 className="text-sm font-medium mb-2">Canvas Properties</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs block mb-1">Dimensions</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Width" 
                    value={canvasWidth} 
                    onChange={(e) => setCanvasWidth(parseInt(e.target.value) || DEFAULT_CANVAS_WIDTH)}
                    className="w-1/2"
                  />
                  <Input 
                    type="number" 
                    placeholder="Height" 
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(parseInt(e.target.value) || DEFAULT_CANVAS_HEIGHT)}
                    className="w-1/2"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs block mb-1">Background</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <ColorPicker
                      color={backgroundColor}
                      onChange={setBackgroundColor}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowGradientPicker(true)}
                    >
                      Gradient
                    </Button>
                  </div>
                  {backgroundGradient && (
                    <div 
                      className="h-8 rounded border"
                      style={{ backgroundImage: backgroundGradient }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 float-right"
                        onClick={() => setBackgroundGradient("")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs block mb-1">Border</label>
                <div className="space-y-2">
                  <Select
                    value={borderStyle}
                    onValueChange={setBorderStyle}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select border style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {borderStyle !== 'none' && (
                    <>
                      <div className="flex gap-2">
                        <ColorPicker
                          color={borderColor}
                          onChange={setBorderColor}
                          className="flex-1"
                        />
                        <div className="w-20">
                          <Input
                            type="text"
                            placeholder="Width"
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="elements" className="p-2 border rounded-md">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Add Elements</h3>
              
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddElement('text')}>
                  <Text className="h-4 w-4 mr-1" />
                  Text
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddElement('image')}>
                  <Image className="h-4 w-4 mr-1" />
                  Image
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddElement('signature')}>
                  <Signature className="h-4 w-4 mr-1" />
                  Sign
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    More Elements
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleAddElement('title')}>Certificate Title</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddElement('recipient')}>Recipient Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddElement('issuer')}>Issuer Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddElement('date')}>Date</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddElement('description')}>Description</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddElement('badge')}>Badge</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddElement('verification')}>Verification ID</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="border-t pt-2">
                <h3 className="text-sm font-medium mb-2">Element List</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {elements.map((element) => (
                    <div 
                      key={element.id}
                      className={`flex items-center justify-between p-1 rounded text-sm ${selectedElement?.id === element.id ? 'bg-muted' : ''}`}
                      onClick={() => handleElementSelect(element)}
                    >
                      <div className="flex items-center gap-1 overflow-hidden">
                        {element.type === 'text' && <Text className="h-3 w-3" />}
                        {element.type === 'image' && <Image className="h-3 w-3" />}
                        {element.type === 'signature' && <Signature className="h-3 w-3" />}
                        {element.type === 'title' && <Type className="h-3 w-3" />}
                        {element.type === 'recipient' && <Square className="h-3 w-3" />}
                        {element.type === 'issuer' && <Square className="h-3 w-3" />}
                        {element.type === 'date' && <Square className="h-3 w-3" />}
                        {element.type === 'description' && <Text className="h-3 w-3" />}
                        {element.type === 'badge' && <Square className="h-3 w-3" />}
                        {element.type === 'verification' && <Square className="h-3 w-3" />}
                        <span className="truncate">{element.type} {element.content ? `- ${element.content.substring(0, 15)}...` : ''}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementDelete(element.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="properties" className="p-2 border rounded-md">
            {selectedElement ? (
              <ElementPropertiesPanel 
                element={selectedElement}
                onUpdate={handleElementUpdate}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onDelete={() => handleElementDelete(selectedElement.id)}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Square className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select an element to edit its properties</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Gradient picker dialog */}
      <Dialog open={showGradientPicker} onOpenChange={setShowGradientPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gradient Editor</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div 
              className="h-12 rounded border"
              style={{ 
                backgroundImage: `linear-gradient(${gradientAngle}deg, ${gradientColors.map(
                  gc => `${gc.color} ${gc.position}%`
                ).join(', ')})` 
              }}
            />
            
            <div>
              <label className="text-xs block mb-1">Gradient Angle</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[gradientAngle]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(values) => setGradientAngle(values[0])}
                  className="flex-1"
                />
                <span className="text-sm w-10 text-right">{gradientAngle}°</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs">Color Stops</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddGradientColor}
                  className="h-6 py-0 text-xs"
                >
                  Add Color
                </Button>
              </div>
              
              {gradientColors.map((colorStop, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <ColorPicker
                    color={colorStop.color}
                    onChange={(color) => handleUpdateGradientColor(index, color)}
                  />
                  <div className="flex items-center gap-1 flex-1">
                    <Slider
                      value={[colorStop.position]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => handleUpdateGradientPosition(index, values[0])}
                    />
                    <span className="text-xs w-8 text-right">{colorStop.position}%</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveGradientColor(index)}
                    disabled={gradientColors.length <= 2}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div>
              <label className="text-xs block mb-2">Preset Gradients</label>
              <div className="grid grid-cols-3 gap-2">
                {presetGradients.map((gradient, index) => (
                  <div 
                    key={index} 
                    className="h-12 rounded border cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundImage: gradient }}
                    onClick={() => handleUsePresetGradient(gradient)}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGradientPicker(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyGradient}>
                Apply Gradient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedCertificateEditor;
