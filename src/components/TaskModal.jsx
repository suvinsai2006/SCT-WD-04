
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, AlertCircle } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  taskToEdit, 
  lists, 
  activeTab 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  // Reset or fill form when taskToEdit changes
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setNotes(taskToEdit.notes || '');
      setCategory(taskToEdit.category || 'Work');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setNotes('');
      // Default category is active category if it's a custom list, otherwise the first list
      const isCustomList = lists.includes(activeTab);
      setCategory(isCustomList ? activeTab : (lists[0] || 'Work'));
      setPriority('medium');
      setDueDate('');
    }
    setError('');
  }, [taskToEdit, isOpen, lists, activeTab]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      notes: notes.trim(),
      category,
      priority,
      dueDate
    };

    onSave(taskData);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', duration: 0.4 } 
    }
  };

  return (
    <motion.div 
      className="modal-backdrop"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content glass-panel"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {taskToEdit ? 'Edit Task' : 'Create Task'}
          </h3>
          <button onClick={onClose} className="btn-icon-only modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '16px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Design app interface"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className="glass-input"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Brief description of the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input"
              rows="2"
              style={{ resize: 'vertical', minHeight: '60px' }}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Extra Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Ask Sarah for details, check Slack"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="glass-input"
            />
          </div>

          {/* Category & Due Date Row */}
          <div className="form-row">
            {/* Category Dropdown */}
            <div className="form-group">
              <label className="form-label">List Category</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={lists.map(list => ({ value: list, label: list }))}
                style={{ width: '100%' }}
              />
            </div>

            {/* Date & Time Picker */}
            <div className="form-group">
              <label className="form-label">Due Date & Time</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingRight: '36px' }}
                />
              </div>
            </div>
          </div>

          {/* Priority Levels Selector */}
          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div className="priority-toggle-group">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`priority-option ${p} ${priority === p ? 'active' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
