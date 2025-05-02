
import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import ColorPicker from '../ColorPicker';

interface GradientColor {
  color: string;
  position: number;
}

interface GradientEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradientAngle: number;
  gradientColors: GradientColor[];
  presetGradients: string[];
  onAngleChange: (angle: number) => void;
  onColorChange: (index: number, color: string) => void;
  onPositionChange: (index: number, position: number) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onApplyGradient: () => void;
  onUsePreset: (gradient: string) => void;
}

const GradientEditor: React.FC<GradientEditorProps> = ({
  open,
  onOpenChange,
  gradientAngle,
  gradientColors,
  presetGradients,
  onAngleChange,
  onColorChange,
  onPositionChange,
  onAddColor,
  onRemoveColor,
  onApplyGradient,
  onUsePreset,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onValueChange={(values) => onAngleChange(values[0])}
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
                onClick={onAddColor}
                className="h-6 py-0 text-xs"
              >
                Add Color
              </Button>
            </div>
            
            {gradientColors.map((colorStop, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <ColorPicker
                  color={colorStop.color}
                  onChange={(color) => onColorChange(index, color)}
                />
                <div className="flex items-center gap-1 flex-1">
                  <Slider
                    value={[colorStop.position]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(values) => onPositionChange(index, values[0])}
                  />
                  <span className="text-xs w-8 text-right">{colorStop.position}%</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemoveColor(index)}
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
                  onClick={() => onUsePreset(gradient)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onApplyGradient}>
              Apply Gradient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradientEditor;
