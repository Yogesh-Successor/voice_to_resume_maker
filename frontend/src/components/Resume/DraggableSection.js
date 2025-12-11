import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaGripVertical, FaEdit, FaTrash } from 'react-icons/fa';
import './DraggableSection.css';

const DraggableSection = ({ 
  id, 
  index, 
  section, 
  moveSection, 
  onEdit, 
  onDelete,
  children 
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'RESUME_SECTION',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'RESUME_SECTION',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveSection(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={`draggable-section ${isDragging ? 'dragging' : ''}`}
    >
      <div className="section-header">
        <div className="drag-handle" ref={drag}>
          <FaGripVertical />
        </div>
        <h3 className="section-title">{section.title}</h3>
        <div className="section-actions">
          {onEdit && (
            <button className="action-btn edit-btn" onClick={() => onEdit(section)}>
              <FaEdit />
            </button>
          )}
          {onDelete && (
            <button className="action-btn delete-btn" onClick={() => onDelete(id)}>
              <FaTrash />
            </button>
          )}
        </div>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default DraggableSection;

