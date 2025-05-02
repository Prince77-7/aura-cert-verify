
import React from 'react';
import { CertificateElement } from '@/types/CertificateElement';

interface CertificateCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  backgroundColor: string;
  backgroundGradient: string;
  borderStyle: string;
  borderColor: string;
  borderWidth: string;
  elements: CertificateElement[];
  selectedElement: CertificateElement | null;
  isDragging: boolean;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onClick: (e: React.MouseEvent) => void;
  onElementClick: (e: React.MouseEvent, element: CertificateElement) => void;
  onElementMouseDown: (e: React.MouseEvent, element: CertificateElement) => void;
}

const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  canvasRef,
  canvasWidth,
  canvasHeight,
  scale,
  backgroundColor,
  backgroundGradient,
  borderStyle,
  borderColor,
  borderWidth,
  elements,
  selectedElement,
  isDragging,
  onMouseMove,
  onMouseUp,
  onClick,
  onElementClick,
  onElementMouseDown,
}) => {
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
    transition: 'transform 0.2s ease',
  };

  return (
    <div 
      ref={canvasRef}
      style={canvasStyle}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onClick={onClick}
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
          onClick={(e) => onElementClick(e, element)}
          onMouseDown={(e) => onElementMouseDown(e, element)}
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
  );
};

export default CertificateCanvas;
