
import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CertificateElement } from '@/types/CertificateElement';

export interface ElementPropertiesPanelProps {
  selectedElement?: CertificateElement;
  element?: CertificateElement; // Added to support both prop naming conventions
  onUpdateElement?: (element: CertificateElement) => void;
  onUpdate?: (element: CertificateElement) => void; // Added to support both prop naming conventions
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onDelete?: () => void;
}

const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({ 
  selectedElement, 
  element, // Support both naming conventions
  onUpdateElement, 
  onUpdate, // Support both naming conventions
  onBringToFront,
  onSendToBack,
  onDelete
}) => {
  // Use either selectedElement or element prop
  const activeElement = selectedElement || element;
  // Use either onUpdateElement or onUpdate callback
  const handleUpdate = onUpdateElement || onUpdate || (() => {});

  const [name, setName] = useState(activeElement?.name || '');
  const [x, setX] = useState(activeElement?.x || 0);
  const [y, setY] = useState(activeElement?.y || 0);
  const [width, setWidth] = useState(activeElement?.width || 100);
  const [height, setHeight] = useState(activeElement?.height || 50);
  const [fontSize, setFontSize] = useState(activeElement?.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(activeElement?.fontFamily || 'Arial');
  const [color, setColor] = useState(activeElement?.color || '#000000');
  const [bold, setBold] = useState(activeElement?.bold || false);
  const [italic, setItalic] = useState(activeElement?.italic || false);
  const [underline, setUnderline] = useState(activeElement?.underline || false);
  const [backgroundColor, setBackgroundColor] = useState(activeElement?.backgroundColor || 'transparent');
  const [opacity, setOpacity] = useState(activeElement?.opacity || 1);
  const [rotation, setRotation] = useState(activeElement?.rotation || 0);
  const [borderWidth, setBorderWidth] = useState(activeElement?.borderWidth || 0);
  const [borderColor, setBorderColor] = useState(activeElement?.borderColor || '#000000');
  const [borderRadius, setBorderRadius] = useState(activeElement?.borderRadius || 0);
  const [zIndex, setZIndex] = useState(activeElement?.zIndex || 0);
  const [hidden, setHidden] = useState(activeElement?.hidden || false);

  useEffect(() => {
    if (activeElement) {
      setName(activeElement.name || '');
      setX(activeElement.x || 0);
      setY(activeElement.y || 0);
      setWidth(activeElement.width || 100);
      setHeight(activeElement.height || 50);
      setFontSize(activeElement.fontSize || 16);
      setFontFamily(activeElement.fontFamily || 'Arial');
      setColor(activeElement.color || '#000000');
      setBold(activeElement.bold || false);
      setItalic(activeElement.italic || false);
      setUnderline(activeElement.underline || false);
      setBackgroundColor(activeElement.backgroundColor || 'transparent');
      setOpacity(activeElement.opacity || 1);
      setRotation(activeElement.rotation || 0);
      setBorderWidth(activeElement.borderWidth || 0);
      setBorderColor(activeElement.borderColor || '#000000');
      setBorderRadius(activeElement.borderRadius || 0);
      setZIndex(activeElement.zIndex || 0);
      setHidden(activeElement.hidden || false);
    }
  }, [activeElement]);

  const updateProperty = (propertyName: string, value: any) => {
    if (!activeElement) return;
    
    const updatedElement = {
      ...activeElement,
      [propertyName]: value
    };
    
    handleUpdate(updatedElement);
  };

  if (!activeElement) {
    return (
      <div className="p-4">
        Select an element to view its properties.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Element Properties</h3>
      <Separator />
      
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            updateProperty('name', e.target.value);
          }}
        />
      </div>

      {/* Position controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="x">X Position</Label>
          <Input
            type="number"
            id="x"
            value={x}
            onChange={(e) => {
              setX(Number(e.target.value));
              updateProperty('x', Number(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="y">Y Position</Label>
          <Input
            type="number"
            id="y"
            value={y}
            onChange={(e) => {
              setY(Number(e.target.value));
              updateProperty('y', Number(e.target.value));
            }}
          />
        </div>
      </div>
      
      {/* Size controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            type="number"
            id="width"
            value={width}
            onChange={(e) => {
              setWidth(Number(e.target.value));
              updateProperty('width', Number(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            type="number"
            id="height"
            value={height}
            onChange={(e) => {
              setHeight(Number(e.target.value));
              updateProperty('height', Number(e.target.value));
            }}
          />
        </div>
      </div>
      
      {/* Text properties - only show if the element is a text element */}
      {activeElement.type === 'text' && (
        <>
          <Separator />
          <h4 className="text-md font-semibold">Text Properties</h4>
          
          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              type="number"
              id="fontSize"
              value={fontSize}
              onChange={(e) => {
                setFontSize(Number(e.target.value));
                updateProperty('fontSize', Number(e.target.value));
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="fontFamily">Font Family</Label>
            <Input
              type="text"
              id="fontFamily"
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                updateProperty('fontFamily', e.target.value);
              }}
            />
          </div>
          
          <div>
            <Label>Color</Label>
            <SketchPicker
              color={color}
              onChangeComplete={(c) => {
                setColor(c.hex);
                updateProperty('color', c.hex);
              }}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setBold(!bold);
                updateProperty('bold', !bold);
              }}
              className={bold ? 'bg-primary text-primary-foreground' : ''}
            >
              Bold
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItalic(!italic);
                updateProperty('italic', !italic);
              }}
              className={italic ? 'bg-primary text-primary-foreground' : ''}
            >
              Italic
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUnderline(!underline);
                updateProperty('underline', !underline);
              }}
              className={underline ? 'bg-primary text-primary-foreground' : ''}
            >
              Underline
            </Button>
          </div>
        </>
      )}
      
      <Separator />
      <h4 className="text-md font-semibold">Styling Properties</h4>
      
      <div>
        <Label>Background Color</Label>
        <SketchPicker
          color={backgroundColor}
          onChangeComplete={(c) => {
            setBackgroundColor(c.hex);
            updateProperty('backgroundColor', c.hex);
          }}
        />
      </div>
      
      <div>
        <Label htmlFor="opacity">Opacity</Label>
        <Slider
          id="opacity"
          defaultValue={[opacity * 100]}
          max={100}
          step={1}
          onValueChange={(value) => {
            const newOpacity = value[0] / 100;
            setOpacity(newOpacity);
            updateProperty('opacity', newOpacity);
          }}
        />
      </div>
      
      <div>
        <Label htmlFor="rotation">Rotation</Label>
        <Input
          type="number"
          id="rotation"
          value={rotation}
          onChange={(e) => {
            setRotation(Number(e.target.value));
            updateProperty('rotation', Number(e.target.value));
          }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="borderWidth">Border Width</Label>
          <Input
            type="number"
            id="borderWidth"
            value={borderWidth}
            onChange={(e) => {
              setBorderWidth(Number(e.target.value));
              updateProperty('borderWidth', Number(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Input
            type="number"
            id="borderRadius"
            value={borderRadius}
            onChange={(e) => {
              setBorderRadius(Number(e.target.value));
              updateProperty('borderRadius', Number(e.target.value));
            }}
          />
        </div>
      </div>
      
      <div>
        <Label>Border Color</Label>
        <SketchPicker
          color={borderColor}
          onChangeComplete={(c) => {
            setBorderColor(c.hex);
            updateProperty('borderColor', c.hex);
          }}
        />
      </div>
      
      <div>
        <Label htmlFor="zIndex">Z Index</Label>
        <Input
          type="number"
          id="zIndex"
          value={zIndex}
          onChange={(e) => {
            setZIndex(Number(e.target.value));
            updateProperty('zIndex', Number(e.target.value));
          }}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="hidden">Hidden</Label>
        <Switch
          id="hidden"
          checked={hidden}
          onCheckedChange={(checked) => {
            setHidden(checked);
            updateProperty('hidden', checked);
          }}
        />
      </div>

      {/* Layer control buttons */}
      {onBringToFront && onSendToBack && onDelete && (
        <div className="flex space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onBringToFront}>
            Bring to Front
          </Button>
          <Button variant="outline" onClick={onSendToBack}>
            Send to Back
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ElementPropertiesPanel;
