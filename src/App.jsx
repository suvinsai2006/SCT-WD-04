
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Menu, X } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import './App.css';

// Pre-populate with some beautiful demo tasks for first time visit
const DEFAULT_TASKS = [];

const DEFAULT_LISTS = ['Work', 'Personal'];

export default function App() {
  // Navigation & UI state
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem('taskhub_view');
    return saved || 'landing';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Data state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskhub_tasks_clean');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('taskhub_lists_clean_v2');
    return saved ? JSON.parse(saved) : DEFAULT_LISTS;
  });

  // Filter & Search state
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('taskhub_tasks_clean', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskhub_lists_clean_v2', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('taskhub_view', view);
  }, [view]);

  // Sidebar task completion stats
  const getTaskStats = () => {
    const activeTasks = tasks.filter(t => {
      // Stats should represent either all tasks or specific lists
      if (lists.includes(activeTab)) {
        return t.category === activeTab;
      }
      return true;
    });

    return {
      total: activeTasks.length,
      completed: activeTasks.filter(t => t.completed).length
    };
  };

  // List Management
  const handleAddList = (newListName) => {
    if (newListName && !lists.includes(newListName)) {
      setLists([...lists, newListName]);
      setActiveTab(newListName);
    }
  };

  const handleDeleteList = (listToDelete) => {
    setLists(lists.filter(l => l !== listToDelete));
    // Re-assign tasks in that list to 'Personal' category
    setTasks(tasks.map(t => {
      if (t.category === listToDelete) {
        return { ...t, category: 'Personal' };
      }
      return t;
    }));
    // If active category was deleted, go back to 'all'
    if (activeTab === listToDelete) {
      setActiveTab('all');
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear all tasks, custom lists, and application settings? This action cannot be undone.")) {
      localStorage.removeItem('taskhub_tasks_clean');
      localStorage.removeItem('taskhub_lists_clean_v2');
      localStorage.removeItem('taskhub_view');
      setTasks([]);
      setLists(DEFAULT_LISTS);
      setActiveTab('all');
      setSearchQuery('');
      setFilterPriority('all');
      setSortBy('dueDate');
      setView('landing');
    }
  };

  // Task Actions
  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      // Edit mode
      setTasks(tasks.map(t => {
        if (t.id === taskToEdit.id) {
          return {
            ...t,
            ...taskData,
            title: taskData.title,
            description: taskData.description,
            notes: taskData.notes,
            category: taskData.category,
            priority: taskData.priority,
            dueDate: taskData.dueDate
          };
        }
        return t;
      }));
      setTaskToEdit(null);
    } else {
      // Create mode
      const newTask = {
        id: `task-${Date.now()}`,
        ...taskData,
        completed: false,
        createdAt: Date.now()
      };
      setTasks([newTask, ...tasks]);
    }
    setIsCreateModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsCreateModalOpen(true);
  };

  // Filtering & Sorting Logic
  const getFilteredTasks = () => {
    let result = [...tasks];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // 2. Tab/List Filter
    if (activeTab === 'today') {
      const today = new Date();
      result = result.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
      });
    } else if (activeTab === 'upcoming') {
      const now = new Date();
      // Set to midnight of tomorrow to check future dates
      const tomorrowMidnight = new Date();
      tomorrowMidnight.setHours(24, 0, 0, 0);
      result = result.filter(t => t.dueDate && new Date(t.dueDate) >= tomorrowMidnight && !t.completed);
    } else if (activeTab === 'important') {
      result = result.filter(t => t.priority === 'high');
    } else if (activeTab === 'completed') {
      result = result.filter(t => t.completed);
    } else if (lists.includes(activeTab)) {
      result = result.filter(t => t.category === activeTab);
    } // 'all' requires no extra filter

    // 3. Priority filter toolbar
    if (filterPriority !== 'all') {
      result = result.filter(t => t.priority === filterPriority);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      if (sortBy === 'priority') {
        const weights = { high: 3, medium: 2, low: 1 };
        return weights[b.priority] - weights[a.priority];
      }
      
      if (sortBy === 'created') {
        return b.createdAt - a.createdAt;
      }
      
      return 0;
    });

    return result;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <LandingPage onEnter={() => setView('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-layout"
          >
            {/* Ambient Background Glow Orbs */}
            <div className="ambient-orb orb-primary" />
            <div className="ambient-orb orb-secondary" />

            {/* Sidebar (Desktop View) */}
            <Sidebar
              lists={lists}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsSidebarOpen(false);
              }}
              onAddList={handleAddList}
              onDeleteList={handleDeleteList}
              taskStats={getTaskStats()}
              onResetView={() => setView('landing')}
              onClearHistory={handleClearAllHistory}
            />

            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      background: 'black',
                      zIndex: 40
                    }}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '280px',
                      height: '100vh',
                      zIndex: 45
                    }}
                  >
                    <Sidebar
                      lists={lists}
                      activeTab={activeTab}
                      setActiveTab={(tab) => {
                        setActiveTab(tab);
                        setIsSidebarOpen(false);
                      }}
                      onAddList={handleAddList}
                      onDeleteList={handleDeleteList}
                      taskStats={getTaskStats()}
                      onResetView={() => setView('landing')}
                      onClearHistory={handleClearAllHistory}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Area */}
            <div className="main-panel">
              {/* Mobile Header Bar */}
              <div className="mobile-header">
                <button onClick={() => setIsSidebarOpen(true)} className="btn-icon-only">
                  <Menu size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="logo-icon" style={{ width: '24px', height: '24px', fontSize: '0.9rem' }}>T</div>
                  <span className="logo-text" style={{ fontSize: '1rem' }}>TaskHub</span>
                </div>
                <button onClick={() => {
                  setTaskToEdit(null);
                  setIsCreateModalOpen(true);
                }} className="btn-icon-only">
                  <Plus size={20} />
                </button>
              </div>

              {/* Top search & statistics header bar (Desktop) */}
              <div className="top-bar">
                <div className="search-container">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search tasks by title, description, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass-input search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="user-actions">
                  <div className="secured-badge">
                    <span className="pulsing-dot" />
                    <span>Local Secured</span>
                  </div>
                </div>
              </div>

              {/* Task list and feed panel */}
              <TaskList
                tasks={filteredTasks}
                activeTab={activeTab}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleOpenEditModal}
                onOpenCreateModal={() => {
                  setTaskToEdit(null);
                  setIsCreateModalOpen(true);
                }}
              />
            </div>

            {/* Task Add/Edit Modal */}
            <AnimatePresence>
              {isCreateModalOpen && (
                <TaskModal
                  isOpen={isCreateModalOpen}
                  onClose={() => {
                    setIsCreateModalOpen(false);
                    setTaskToEdit(null);
                  }}
                  onSave={handleSaveTask}
                  taskToEdit={taskToEdit}
                  lists={lists}
                  activeTab={activeTab}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
