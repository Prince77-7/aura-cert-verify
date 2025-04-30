
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const predefinedColors = [
  // Neutrals
  '#FFFFFF', '#F5F5F5', '#E5E5E5', '#D4D4D4', '#A3A3A3', '#737373', '#525252', '#404040', '#262626', '#171717', '#000000',
  
  // Reds
  '#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
  
  // Blues
  '#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A',
  
  // Greens
  '#F0FDF4', '#DCFCE7', '#BBF7D0', '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#15803D', '#166534', '#14532D',
  
  // Purples
  '#FAF5FF', '#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7E22CE', '#6B21A8', '#581C87',
  
  // Yellows
  '#FEFCE8', '#FEF9C3', '#FEF08A', '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#A16207', '#854D0E', '#713F12',
  
  // Oranges
  '#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12',
  
  // Pinks
  '#FDF2F8', '#FCE7F3', '#FBCFE8', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D', '#9D174D', '#831843',
  
  // Teals
  '#F0FDFA', '#CCFBF1', '#99F6E4', '#5EEAD4', '#2DD4BF', '#14B8A6', '#0D9488', '#0F766E', '#115E59', '#134E4A',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(color);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };
  
  const handlePredefinedColorClick = (selectedColor: string) => {
    onChange(selectedColor);
    setCustomColor(selectedColor);
    setIsOpen(false);
  };
  
  return (
    <div className={cn("flex", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center gap-2 border rounded px-2 py-1 hover:bg-muted transition-colors"
            style={{ height: '36px' }}
          >
            <div 
              className="h-5 w-5 rounded-sm border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-foreground/70 truncate flex-1 text-left">
              {color.toUpperCase()}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="custom-color" className="text-xs block mb-1">
                Custom Color
              </label>
              <div className="flex gap-2">
                <div 
                  className="h-8 w-8 rounded-sm border border-gray-300"
                  style={{ backgroundColor: customColor }}
                />
                <input 
                  id="custom-color"
                  type="color" 
                  value={customColor} 
                  onChange={handleColorChange}
                  className="w-full h-8"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs block mb-1">Predefined Colors</label>
              <div className="grid grid-cols-11 gap-1">
                {predefinedColors.map((predefinedColor, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "h-5 w-5 rounded-sm border border-gray-300 hover:scale-110 transition-transform",
                      color === predefinedColor && "ring-2 ring-primary ring-offset-1"
                    )}
                    style={{ backgroundColor: predefinedColor }}
                    onClick={() => handlePredefinedColorClick(predefinedColor)}
                  />
                ))}
              </div>
            </div>
            
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="#RRGGBB"
              className="w-full h-8 px-2 border rounded"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
