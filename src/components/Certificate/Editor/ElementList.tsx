
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Text, 
  Image, 
  Signature, 
  Type, 
  Square, 
  Plus,
  Trash2,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ElementType, CertificateElement } from '@/types/CertificateElement';

interface ElementListProps {
  elements: CertificateElement[];
  selectedElement: CertificateElement | null;
  onSelectElement: (element: CertificateElement) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (type: ElementType) => void;
}

const ElementList: React.FC<ElementListProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onDeleteElement,
  onAddElement,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Add Elements</h3>
      
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" onClick={() => onAddElement('text')}>
          <Text className="h-4 w-4 mr-1" />
          Text
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAddElement('image')}>
          <Image className="h-4 w-4 mr-1" />
          Image
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAddElement('signature')}>
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
          <DropdownMenuItem onClick={() => onAddElement('title')}>Certificate Title</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddElement('recipient')}>Recipient Name</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddElement('issuer')}>Issuer Name</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddElement('date')}>Date</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddElement('description')}>Description</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddElement('badge')}>Badge</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddElement('verification')}>Verification ID</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="border-t pt-2">
        <h3 className="text-sm font-medium mb-2">Element List</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {elements.map((element) => (
            <div 
              key={element.id}
              className={`flex items-center justify-between p-1 rounded text-sm ${selectedElement?.id === element.id ? 'bg-muted' : ''}`}
              onClick={() => onSelectElement(element)}
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
                    onDeleteElement(element.id);
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
  );
};

export default ElementList;
