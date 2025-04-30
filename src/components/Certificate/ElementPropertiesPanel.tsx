
import React from 'react';
import { CertificateElement } from '@/types/CertificateElement';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ColorPicker from './ColorPicker';
import { Trash2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ElementPropertiesPanelProps {
  element: CertificateElement;
  onUpdate: (element: CertificateElement) => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onDelete: () => void;
}

const fontFamilies = [
  "Georgia, serif",
  "Arial, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Times New Roman, serif",
  "Courier New, monospace",
];

const fontWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];

const borderStyles = [
  "none",
  "solid",
  "dashed",
  "dotted",
  "double",
];

const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
  element,
  onUpdate,
  onBringToFront,
  onSendToBack,
  onDelete,
}) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({
      ...element,
      [field]: value
    });
  };

  const handleStyleChange = (styleField: string, value: any) => {
    onUpdate({
      ...element,
      style: {
        ...element.style,
        [styleField]: value
      }
    });
  };

  const handlePositionChange = (positionField: string, value: any) => {
    onUpdate({
      ...element,
      position: {
        ...element.position,
        [positionField]: value
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleStyleChange('backgroundImage', `url(${event.target.result})`);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-1 flex justify-between items-center">
        <span>{element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element</span>
        <div className="space-x-1">
          <Button variant="ghost" size="xs" onClick={onBringToFront} title="Bring to front">
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="xs" onClick={onSendToBack} title="Send to back">
            <ArrowDown className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="xs" onClick={onDelete} title="Delete">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </h3>

      <div className="space-y-3 max-h-[500px] overflow-y-auto p-1">
        {/* Content - for text-based elements only */}
        {element.type !== 'image' && (
          <div>
            <Label className="text-xs">Content</Label>
            {element.type === 'description' || (element.content && element.content.length > 30) ? (
              <Textarea
                value={element.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="mt-1"
                rows={3}
              />
            ) : (
              <Input
                value={element.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="mt-1"
              />
            )}
          </div>
        )}

        {/* Image uploader - for image elements only */}
        {element.type === 'image' && (
          <div>
            <Label className="text-xs">Image</Label>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs"
                />
              </div>
              {element.style.backgroundImage && (
                <div className="mt-2 flex justify-between items-center p-1 border rounded">
                  <div
                    className="h-10 w-10 bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: element.style.backgroundImage }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStyleChange('backgroundImage', '')}
                    className="h-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Position */}
        <div>
          <Label className="text-xs">Position & Size</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={element.position.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={element.position.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={element.position.width}
                onChange={(e) => handlePositionChange('width', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={element.position.height}
                onChange={(e) => handlePositionChange('height', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Text Styling - for text-based elements */}
        {element.type !== 'image' && (
          <>
            <div>
              <Label className="text-xs">Text Style</Label>
              <div className="space-y-2 mt-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Color</Label>
                    <ColorPicker
                      color={element.style.color || '#000000'}
                      onChange={(color) => handleStyleChange('color', color)}
                      className="mt-1"
                    />
                  </div>
                  <div className="w-24">
                    <Label className="text-xs">Size</Label>
                    <Input
                      value={element.style.fontSize || '16px'}
                      onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={element.style.fontFamily || fontFamilies[0]}
                    onValueChange={(value) => handleStyleChange('fontFamily', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font.split(',')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Weight</Label>
                    <Select
                      value={element.style.fontWeight || 'normal'}
                      onValueChange={(value) => handleStyleChange('fontWeight', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight} value={weight}>
                            {weight}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Alignment</Label>
                    <Select
                      value={element.style.textAlign || 'left'}
                      onValueChange={(value) => 
                        handleStyleChange('textAlign', value as 'left' | 'center' | 'right' | 'justify')}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="justify">Justify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Background for all elements */}
        <div>
          <Label className="text-xs">Background</Label>
          <div className="mt-1">
            <ColorPicker
              color={element.style.backgroundColor || 'transparent'}
              onChange={(color) => handleStyleChange('backgroundColor', color)}
            />
          </div>
        </div>

        {/* Border */}
        <div>
          <Label className="text-xs">Border</Label>
          <div className="space-y-2 mt-1">
            <Select
              value={element.style.borderStyle || 'none'}
              onValueChange={(value) => handleStyleChange('borderStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Border style" />
              </SelectTrigger>
              <SelectContent>
                {borderStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {element.style.borderStyle && element.style.borderStyle !== 'none' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-xs">Color</Label>
                  <ColorPicker
                    color={element.style.borderColor || '#000000'}
                    onChange={(color) => handleStyleChange('borderColor', color)}
                    className="mt-1"
                  />
                </div>
                <div className="w-24">
                  <Label className="text-xs">Width</Label>
                  <Input
                    value={element.style.borderWidth || '1px'}
                    onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Border radius */}
            <div>
              <Label className="text-xs">Border Radius</Label>
              <Input
                value={element.style.borderRadius || '0px'}
                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Additional styling for image elements */}
        {element.type === 'image' && (
          <div>
            <Label className="text-xs">Image Style</Label>
            <div className="space-y-2 mt-1">
              <Select
                value={element.style.backgroundSize || 'contain'}
                onValueChange={(value) => handleStyleChange('backgroundSize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="100% 100%">Stretch</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={element.style.backgroundPosition || 'center'}
                onValueChange={(value) => handleStyleChange('backgroundPosition', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="top left">Top Left</SelectItem>
                  <SelectItem value="top right">Top Right</SelectItem>
                  <SelectItem value="bottom left">Bottom Left</SelectItem>
                  <SelectItem value="bottom right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementPropertiesPanel;
