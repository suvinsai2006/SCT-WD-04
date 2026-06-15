
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListTodo, Grid, List, CheckSquare, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import CustomSelect from './CustomSelect';

export default function TaskList({ 
  tasks, 
  activeTab, 
  filterPriority, 
  setFilterPriority, 
  sortBy, 
  setSortBy, 
  onToggleComplete, 
  onDelete, 
  onEdit, 
  onOpenCreateModal 
}) {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Sort by Due Date' },
    { value: 'priority', label: 'Sort by Priority' },
    { value: 'created', label: 'Sort by Date Created' },
  ];

  return (
    <div className="content-area">
      {/* Title & Add Button */}
      <div className="content-header">
        <div>
          <h2 className="current-tab-title" style={{ textTransform: 'capitalize' }}>
            {activeTab === 'all' ? 'Inbox' : activeTab}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
          </p>
        </div>

        <button 
          onClick={onOpenCreateModal} 
          className="btn btn-primary pulse-glow"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* Toolbar / Actions */}
      <div className="toolbar">
        {/* Priority Filter */}
        <div className="filter-group">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterPriority(opt.value)}
              className={`filter-btn ${filterPriority === opt.value ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort & Layout Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CustomSelect 
            value={sortBy} 
            onChange={setSortBy} 
            options={sortOptions} 
          />

          {/* Layout buttons */}
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <button 
              onClick={() => setViewMode('list')}
              className="btn-icon-only"
              style={{ 
                width: '32px', 
                height: '32px', 
                background: viewMode === 'list' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                borderRadius: 0,
                color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)'
              }}
              title="List View"
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className="btn-icon-only"
              style={{ 
                width: '32px', 
                height: '32px', 
                background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                borderRadius: 0,
                color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)'
              }}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Feed */}
      <div style={{ position: 'relative' }}>
        {tasks.length > 0 ? (
          <motion.div 
            layout 
            className={`task-feed-container ${viewMode === 'grid' ? 'task-grid grid-view' : 'task-grid'}`}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="no-tasks-state glass-card"
          >
            <div className="no-tasks-icon">
              <ListTodo size={48} strokeWidth={1} style={{ opacity: 0.4 }} />
            </div>
            <h4 className="no-tasks-title">No tasks found</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', maxWidth: '300px', marginBottom: '16px' }}>
              Create a new task or modify your filters to start checking off items!
            </p>
            <button onClick={onOpenCreateModal} className="btn btn-secondary btn-sm">
              <Plus size={14} />
              Add Task
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
