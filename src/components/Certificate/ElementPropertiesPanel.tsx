import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface ElementPropertiesPanelProps {
    fontSize: string;
    fontWeight: string;
    color: string;
    align: string;
    marginTop: string;
    marginBottom: string;
    onFontSizeChange: (value: string) => void;
    onFontWeightChange: (value: string) => void;
    onColorChange: (value: string) => void;
    onAlignChange: (value: string) => void;
    onMarginTopChange: (value: string) => void;
    onMarginBottomChange: (value: string) => void;
}

const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
    fontSize,
    fontWeight,
    color,
    align,
    marginTop,
    marginBottom,
    onFontSizeChange,
    onFontWeightChange,
    onColorChange,
    onAlignChange,
    onMarginTopChange,
    onMarginBottomChange
}) => {
    return (
        <div className="bg-secondary/50 p-4 rounded-md space-y-4">
            <h4 className="text-sm font-medium">Element Properties</h4>

            {/* Font Size */}
            <div>
                <Label htmlFor="font-size" className="text-xs">Font Size</Label>
                <Input
                    type="text"
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>

            {/* Font Weight */}
            <div>
                <Label htmlFor="font-weight" className="text-xs">Font Weight</Label>
                <Input
                    type="text"
                    id="font-weight"
                    value={fontWeight}
                    onChange={(e) => onFontWeightChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>

            {/* Text Color */}
            <div>
                <Label htmlFor="text-color" className="text-xs">Text Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                    <Input
                        type="color"
                        id="text-color"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="h-8 w-10"
                    />
                    <Input
                        type="text"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="text-xs"
                    />
                </div>
            </div>

            {/* Text Alignment */}
            <div>
                <Label className="text-xs">Text Alignment</Label>
                <div className="flex items-center space-x-2 mt-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onAlignChange('left')}
                        className={align === 'left' ? 'bg-secondary' : ''}
                    >
                        <AlignLeft size={16} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onAlignChange('center')}
                        className={align === 'center' ? 'bg-secondary' : ''}
                    >
                        <AlignCenter size={16} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onAlignChange('right')}
                        className={align === 'right' ? 'bg-secondary' : ''}
                    >
                        <AlignRight size={16} />
                    </Button>
                </div>
            </div>

            {/* Margin Top */}
            <div>
                <Label htmlFor="margin-top" className="text-xs">Margin Top</Label>
                <Input
                    type="text"
                    id="margin-top"
                    value={marginTop}
                    onChange={(e) => onMarginTopChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>

            {/* Margin Bottom */}
            <div>
                <Label htmlFor="margin-bottom" className="text-xs">Margin Bottom</Label>
                <Input
                    type="text"
                    id="margin-bottom"
                    value={marginBottom}
                    onChange={(e) => onMarginBottomChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>
        </div>
    );
};

export default ElementPropertiesPanel;
