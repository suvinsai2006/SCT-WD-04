
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, Calendar, Clock, AlertCircle, CheckCircle2, 
  Folder, Plus, Trash2 
} from 'lucide-react';

export default function Sidebar({ 
  lists, 
  activeTab, 
  setActiveTab, 
  onAddList, 
  onDeleteList, 
  taskStats,
  onResetView,
  onClearHistory
}) {
  const [newListName, setNewListName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  // SVG circular progress details
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const { total, completed } = taskStats;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const quickFilters = [
    { id: 'all', label: 'All Tasks', icon: Inbox, color: '#8b5cf6' },
    { id: 'today', label: 'Today', icon: Calendar, color: '#10b981' },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, color: '#06b6d4' },
    { id: 'important', label: 'Important', icon: AlertCircle, color: '#f59e0b' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, color: '#ec4899' },
  ];

  const handleAddListSubmit = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setShowAddInput(false);
    }
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-menu">
        {/* Brand Header */}
        <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={onResetView}>
          <div className="logo-icon">T</div>
          <h1 className="logo-text">TaskHub</h1>
        </div>

        {/* Quick Filters */}
        <div>
          <h2 className="menu-section-title">Filters</h2>
          <nav className="menu-list">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeTab === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveTab(filter.id)}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                >
                  <div className="menu-item-left">
                    <Icon size={18} style={{ color: isActive ? '#a78bfa' : filter.color }} />
                    <span>{filter.label}</span>
                  </div>
                  {total > 0 && filter.id === 'all' && (
                    <span className="menu-item-count">{total}</span>
                  )}
                  {total > 0 && filter.id === 'completed' && (
                    <span className="menu-item-count">{completed}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Custom Lists/Categories */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="menu-section-title">My Lists</h2>
            <button 
              onClick={() => setShowAddInput(!showAddInput)} 
              className="add-category-btn"
              style={{ margin: 0, padding: '2px 6px' }}
            >
              <Plus size={14} />
            </button>
          </div>

          <nav className="menu-list">
            {lists.map((list) => {
              const isActive = activeTab === list;
              return (
                <div
                  key={list}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                >
                  <button
                    onClick={() => setActiveTab(list)}
                    className="menu-item-left"
                    style={{ flexGrow: 1, textLeft: 'left', display: 'flex', alignItems: 'center', width: 'auto' }}
                  >
                    <Folder size={18} style={{ color: isActive ? '#a78bfa' : '#3b82f6' }} />
                    <span style={{ textAlign: 'left' }}>{list}</span>
                  </button>
                  
                  {/* Prevent deleting default system lists (Work, Personal) */}
                  {list !== 'Work' && list !== 'Personal' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteList(list);
                      }}
                      className="task-action-btn delete"
                      style={{ padding: '2px', opacity: isActive ? 1 : 0.6 }}
                      title="Delete List"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          <AnimatePresence>
            {showAddInput && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddListSubmit}
                className="category-input-group"
              >
                <input
                  type="text"
                  placeholder="New list name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="glass-input"
                  style={{ padding: '6px 10px', fontSize: '0.8rem', width: '100%' }}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Add
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Card Widget */}
      <div className="sidebar-footer">
        <div className="progress-widget glass-card">
          <h3 className="progress-text-title">Daily Progress</h3>
          <div className="progress-circular-container">
            <svg className="progress-circular-svg">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle
                className="progress-circle-bg"
                cx="45"
                cy="45"
                r={radius}
              />
              <motion.circle
                className="progress-circle-bar"
                cx="45"
                cy="45"
                r={radius}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </svg>
            <div className="progress-percentage">{completionPercentage}%</div>
          </div>
          <p className="progress-stats-text">
            {completed}/{total} Tasks Completed
          </p>
          <button 
            onClick={onClearHistory}
            className="btn btn-secondary"
            style={{ 
              marginTop: '16px', 
              width: '100%', 
              padding: '6px 12px', 
              fontSize: '0.75rem', 
              borderColor: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              background: 'rgba(239, 68, 68, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
            title="Clear all tasks and history"
          >
            Clear All History
          </button>
        </div>
      </div>
    </aside>
  );
}
