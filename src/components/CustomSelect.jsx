
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, style }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || { label: value, value };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 4, 
      scale: 1,
      transition: { duration: 0.15, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -8, 
      scale: 0.95,
      transition: { duration: 0.12, ease: 'easeIn' }
    }
  };

  return (
    <div className="custom-select-container" ref={dropdownRef} style={{ position: 'relative', zIndex: 30, ...style }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="sort-select"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'space-between',
          minWidth: '160px',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <span>{selectedOption.label}</span>
        <ChevronDown 
          size={14} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform var(--transition-fast)',
            opacity: 0.7
          }} 
        />
      </button>

      {/* Dropdown Options List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={selectVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              background: 'rgba(10, 20, 16, 0.95)',
              backdropFilter: 'blur(16px)',
              padding: '4px 0',
              zIndex: 99
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                    borderLeft: isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.target.style.color = 'var(--color-text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
