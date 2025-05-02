
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { CertificateElement } from "@/types/CertificateElement";

interface ElementPropertiesPanelProps {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    align?: string;
    marginTop?: string;
    marginBottom?: string;
    onFontSizeChange?: (value: string) => void;
    onFontWeightChange?: (value: string) => void;
    onColorChange?: (value: string) => void;
    onAlignChange?: (value: string) => void;
    onMarginTopChange?: (value: string) => void;
    onMarginBottomChange?: (value: string) => void;
    element?: CertificateElement;
    onUpdate?: (updatedElement: CertificateElement) => void;
    onBringToFront?: () => void;
    onSendToBack?: () => void;
    onDelete?: () => void;
}

const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
    fontSize = "",
    fontWeight = "",
    color = "#000000",
    align = "left",
    marginTop = "0",
    marginBottom = "0",
    onFontSizeChange = () => {},
    onFontWeightChange = () => {},
    onColorChange = () => {},
    onAlignChange = () => {},
    onMarginTopChange = () => {},
    onMarginBottomChange = () => {},
    element,
    onUpdate,
    onBringToFront,
    onSendToBack,
    onDelete
}) => {
    // If we have an element and onUpdate function, we'll edit the element directly
    const handleFontSizeChange = (value: string) => {
        if (element && onUpdate) {
            onUpdate({
                ...element,
                style: {
                    ...element.style,
                    fontSize: value
                }
            });
        } else if (onFontSizeChange) {
            onFontSizeChange(value);
        }
    };

    const handleFontWeightChange = (value: string) => {
        if (element && onUpdate) {
            onUpdate({
                ...element,
                style: {
                    ...element.style,
                    fontWeight: value
                }
            });
        } else if (onFontWeightChange) {
            onFontWeightChange(value);
        }
    };

    const handleColorChange = (value: string) => {
        if (element && onUpdate) {
            onUpdate({
                ...element,
                style: {
                    ...element.style,
                    color: value
                }
            });
        } else if (onColorChange) {
            onColorChange(value);
        }
    };

    const handleAlignChange = (value: string) => {
        if (element && onUpdate) {
            onUpdate({
                ...element,
                style: {
                    ...element.style,
                    textAlign: value as any
                }
            });
        } else if (onAlignChange) {
            onAlignChange(value);
        }
    };

    const handleMarginTopChange = (value: string) => {
        if (element && onUpdate) {
            onUpdate({
                ...element,
                style: {
                    ...element.style,
                    marginTop: value
                }
            });
        } else if (onMarginTopChange) {
            onMarginTopChange(value);
        }
    };

    const handleMarginBottomChange = (value: string) => {
        if (element && onUpdate) {
            onUpdate({
                ...element,
                style: {
                    ...element.style,
                    marginBottom: value
                }
            });
        } else if (onMarginBottomChange) {
            onMarginBottomChange(value);
        }
    };

    // Get values from element if available
    const currentFontSize = element?.style?.fontSize || fontSize;
    const currentFontWeight = element?.style?.fontWeight || fontWeight;
    const currentColor = element?.style?.color || color;
    const currentAlign = (element?.style?.textAlign as string) || align;
    const currentMarginTop = element?.style?.marginTop || marginTop;
    const currentMarginBottom = element?.style?.marginBottom || marginBottom;

    return (
        <div className="bg-secondary/50 p-4 rounded-md space-y-4">
            <h4 className="text-sm font-medium">Element Properties</h4>

            {/* Font Size */}
            <div>
                <Label htmlFor="font-size" className="text-xs">Font Size</Label>
                <Input
                    type="text"
                    id="font-size"
                    value={currentFontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>

            {/* Font Weight */}
            <div>
                <Label htmlFor="font-weight" className="text-xs">Font Weight</Label>
                <Input
                    type="text"
                    id="font-weight"
                    value={currentFontWeight}
                    onChange={(e) => handleFontWeightChange(e.target.value)}
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
                        value={currentColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="h-8 w-10"
                    />
                    <Input
                        type="text"
                        value={currentColor}
                        onChange={(e) => handleColorChange(e.target.value)}
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
                        onClick={() => handleAlignChange('left')}
                        className={currentAlign === 'left' ? 'bg-secondary' : ''}
                    >
                        <AlignLeft size={16} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAlignChange('center')}
                        className={currentAlign === 'center' ? 'bg-secondary' : ''}
                    >
                        <AlignCenter size={16} />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleAlignChange('right')}
                        className={currentAlign === 'right' ? 'bg-secondary' : ''}
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
                    value={currentMarginTop}
                    onChange={(e) => handleMarginTopChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>

            {/* Margin Bottom */}
            <div>
                <Label htmlFor="margin-bottom" className="text-xs">Margin Bottom</Label>
                <Input
                    type="text"
                    id="margin-bottom"
                    value={currentMarginBottom}
                    onChange={(e) => handleMarginBottomChange(e.target.value)}
                    className="mt-1 text-xs"
                />
            </div>

            {/* Layer controls */}
            {element && onBringToFront && onSendToBack && (
                <div>
                    <Label className="text-xs block mb-2">Layer Controls</Label>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onBringToFront}
                            className="text-xs flex items-center gap-1"
                        >
                            Bring to Front
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onSendToBack}
                            className="text-xs flex items-center gap-1"
                        >
                            Send to Back
                        </Button>
                    </div>
                </div>
            )}

            {/* Delete control */}
            {element && onDelete && (
                <div>
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={onDelete}
                        className="w-full mt-2"
                    >
                        Delete Element
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ElementPropertiesPanel;
