import React, { ReactNode, useState } from 'react';
import { Move, X, Plus, Settings } from 'lucide-react';

interface BlockWrapperProps {
  id: string;
  title: string;
  children: ReactNode;
  onRemove: (id: string) => void;
  isDraggable?: boolean;
  onMoveStart?: (id: string, e: React.MouseEvent) => void;
  isFullWidth?: boolean;
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({
  id,
  title,
  children,
  onRemove,
  isDraggable = true,
  onMoveStart,
  isFullWidth = false
}) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div 
      className={`block-wrapper ${isFullWidth ? 'block-full-width' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="block-header">
        <h3 className="section-title">{title}</h3>
        
        {showControls && (
          <div className="block-controls">
            {isDraggable && onMoveStart && (
              <button 
                className="block-control-btn"
                onMouseDown={(e) => onMoveStart(id, e)}
              >
                <Move size={16} />
              </button>
            )}
            <button 
              className="block-control-btn"
              onClick={() => onRemove(id)}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="block-content">
        {children}
      </div>
    </div>
  );
};

export default BlockWrapper;