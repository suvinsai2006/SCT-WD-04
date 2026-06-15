import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Edit, Check, AlertCircle } from 'lucide-react';

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  const { id, title, description, notes, category, priority, dueDate, completed } = task;

  // Overdue status check
  const getOverdueStatus = () => {
    if (!dueDate || completed) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const isOverdue = getOverdueStatus();

  // Formatter for due date & time
  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) return '';

    const optionsDate = { month: 'short', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    
    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);
    
    return `${formattedDate} at ${formattedTime}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 500, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const checkboxVariants = {
    checked: { scale: 1, opacity: 1, backgroundColor: '#10b981' },
    unchecked: { scale: 0.8, opacity: 0 }
  };

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`glass-card task-card ${completed ? 'completed' : ''} ${isOverdue ? 'overdue-card' : ''}`}
      style={{
        borderLeft: completed 
          ? '4px solid var(--color-success)' 
          : priority === 'high' 
            ? '4px solid var(--color-danger)' 
            : priority === 'medium' 
              ? '4px solid var(--color-warning)' 
              : '4px solid var(--color-secondary)'
      }}
    >
      <div className="task-card-main">
        {/* Animated Checkbox */}
        <div 
          className={`custom-checkbox ${completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(id)}
        >
          <motion.div
            initial={false}
            animate={completed ? 'checked' : 'unchecked'}
            variants={checkboxVariants}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Check size={12} strokeWidth={3} />
          </motion.div>
        </div>

        {/* Task Details */}
        <div className="task-card-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <h3 className="task-title">{title}</h3>
            <span className={`badge badge-${priority}`}>{priority}</span>
          </div>

          {description && <p className="task-desc">{description}</p>}
          
          {notes && (
            <div className="task-notes">
              {notes}
            </div>
          )}
        </div>
      </div>

      {/* Task Footer Metadata and Actions */}
      <div className="task-card-footer">
        <div className="task-meta">
          {dueDate && (
            <div className={`task-meta-item ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={12} />
              <span>{formatDueDate(dueDate)}</span>
              {isOverdue && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '4px', fontWeight: 'bold' }}>
                  <AlertCircle size={10} />
                  Overdue
                </span>
              )}
            </div>
          )}
          <span className="task-list-tag">{category}</span>
        </div>

        {/* Action Buttons */}
        <div className="task-actions">
          <button 
            onClick={() => onEdit(task)}
            className="btn-icon-only task-action-btn edit"
            title="Edit Task"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="btn-icon-only task-action-btn delete"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
