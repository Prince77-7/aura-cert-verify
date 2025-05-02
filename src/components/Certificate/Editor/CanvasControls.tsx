
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import ColorPicker from '../ColorPicker';

interface CanvasControlsProps {
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  backgroundGradient: string;
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onBorderStyleChange: (style: string) => void;
  onBorderColorChange: (color: string) => void;
  onBorderWidthChange: (width: string) => void;
  onShowGradientPicker: () => void;
  onClearGradient: () => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  canvasWidth,
  canvasHeight,
  backgroundColor,
  backgroundGradient,
  borderStyle,
  borderColor,
  borderWidth,
  onWidthChange,
  onHeightChange,
  onBackgroundColorChange,
  onBorderStyleChange,
  onBorderColorChange,
  onBorderWidthChange,
  onShowGradientPicker,
  onClearGradient,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Canvas Properties</h3>
      
      <div>
        <label className="text-xs block mb-1">Dimensions</label>
        <div className="flex gap-2">
          <Input 
            type="number" 
            placeholder="Width" 
            value={canvasWidth} 
            onChange={(e) => onWidthChange(parseInt(e.target.value) || 800)}
            className="w-1/2"
          />
          <Input 
            type="number" 
            placeholder="Height" 
            value={canvasHeight}
            onChange={(e) => onHeightChange(parseInt(e.target.value) || 600)}
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
              onChange={onBackgroundColorChange}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onShowGradientPicker}
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
                onClick={onClearGradient}
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
            onValueChange={onBorderStyleChange}
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
                  onChange={onBorderColorChange}
                  className="flex-1"
                />
                <div className="w-20">
                  <Input
                    type="text"
                    placeholder="Width"
                    value={borderWidth}
                    onChange={(e) => onBorderWidthChange(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasControls;
