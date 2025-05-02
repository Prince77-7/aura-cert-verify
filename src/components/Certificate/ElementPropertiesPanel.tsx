
import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { useCertificate } from '../../context/CertificateContext';
import { Element } from '../../types/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import ColorPicker from './ColorPicker';

interface ElementPropertiesPanelProps {
  selectedElement?: Element | null;
  onUpdateElement?: (updatedElement: Element) => void;
}

const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({ selectedElement, onUpdateElement = () => {} }) => {
  const { updateElement } = useCertificate();
  const [name, setName] = useState(selectedElement?.name || '');
  const [x, setX] = useState(selectedElement?.x || 0);
  const [y, setY] = useState(selectedElement?.y || 0);
  const [width, setWidth] = useState(selectedElement?.width || 100);
  const [height, setHeight] = useState(selectedElement?.height || 50);
  const [fontSize, setFontSize] = useState(selectedElement?.fontSize || 16);
  const [fontFamily, setFontFamily] = useState(selectedElement?.fontFamily || 'Arial');
  const [color, setColor] = useState(selectedElement?.color || '#000000');
  const [bold, setBold] = useState(selectedElement?.bold || false);
  const [italic, setItalic] = useState(selectedElement?.italic || false);
  const [underline, setUnderline] = useState(selectedElement?.underline || false);
  const [backgroundColor, setBackgroundColor] = useState(selectedElement?.backgroundColor || 'transparent');
  const [opacity, setOpacity] = useState(selectedElement?.opacity || 1);
  const [rotation, setRotation] = useState(selectedElement?.rotation || 0);
  const [borderWidth, setBorderWidth] = useState(selectedElement?.borderWidth || 0);
  const [borderColor, setBorderColor] = useState(selectedElement?.borderColor || '#000000');
  const [borderRadius, setBorderRadius] = useState(selectedElement?.borderRadius || 0);
  const [zIndex, setZIndex] = useState(selectedElement?.zIndex || 0);
  const [hidden, setHidden] = useState(selectedElement?.hidden || false);

  useEffect(() => {
    if (selectedElement) {
      setName(selectedElement.name || '');
      setX(selectedElement.x || 0);
      setY(selectedElement.y || 0);
      setWidth(selectedElement.width || 100);
      setHeight(selectedElement.height || 50);
      setFontSize(selectedElement.fontSize || 16);
      setFontFamily(selectedElement.fontFamily || 'Arial');
      setColor(selectedElement.color || '#000000');
      setBold(selectedElement.bold || false);
      setItalic(selectedElement.italic || false);
      setUnderline(selectedElement.underline || false);
      setBackgroundColor(selectedElement.backgroundColor || 'transparent');
      setOpacity(selectedElement.opacity || 1);
      setRotation(selectedElement.rotation || 0);
      setBorderWidth(selectedElement.borderWidth || 0);
      setBorderColor(selectedElement.borderColor || '#000000');
      setBorderRadius(selectedElement.borderRadius || 0);
      setZIndex(selectedElement.zIndex || 0);
      setHidden(selectedElement.hidden || false);
    }
  }, [selectedElement]);

  const updateProperty = (propertyName: string, value: any) => {
    if (!selectedElement) return;

    const updatedElement = { ...selectedElement, [propertyName]: value };
    onUpdateElement(updatedElement);
    updateElement(updatedElement);
  };

  if (!selectedElement) {
    return <div className="p-4">Select an element to view its properties.</div>;
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

      {selectedElement.type === 'text' && (
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
            <ColorPicker
              color={color}
              onChange={(newColor) => {
                setColor(newColor);
                updateProperty('color', newColor);
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
              active={bold}
            >
              Bold
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setItalic(!italic);
                updateProperty('italic', !italic);
              }}
              active={italic}
            >
              Italic
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUnderline(!underline);
                updateProperty('underline', !underline);
              }}
              active={underline}
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
        <ColorPicker
          color={backgroundColor}
          onChange={(newColor) => {
            setBackgroundColor(newColor);
            updateProperty('backgroundColor', newColor);
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
        <ColorPicker
          color={borderColor}
          onChange={(newColor) => {
            setBorderColor(newColor);
            updateProperty('borderColor', newColor);
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
    </div>
  );
};

interface ButtonProps {
  variant: 'outline' | 'default';
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant, onClick, active, children }) => {
  const className = `
    inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
    ${variant === 'outline'
      ? 'bg-transparent border border-input hover:bg-accent hover:text-accent-foreground'
      : 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
    }
    ${active ? 'ring-2 ring-primary' : ''}
    px-4 py-2
  `;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default ElementPropertiesPanel;
