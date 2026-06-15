
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sliders, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onEnter }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="landing-page">
      {/* Decorative Blur Backgrounds */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={glowVariants}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={glowVariants}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <header className="landing-header" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon">T</div>
          <span className="logo-text">TaskHub</span>
        </div>
      </header>

      {/* Hero Content */}
      <motion.main 
        className="landing-hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 10 }}
      >
        <motion.h1 variants={itemVariants} className="landing-title">
          Organize Your Work & Life<br />
          With <span>TaskHub</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="landing-desc">
          Organize your workflow, track your project progress, and manage daily lists with a sleek, premium dark interface.
        </motion.p>

        <motion.div variants={itemVariants} className="landing-cta-container">
          <button 
            className="btn btn-primary pulse-glow" 
            onClick={onEnter}
            style={{ fontSize: '1.05rem', padding: '12px 28px' }}
          >
            Get Started
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </motion.main>

      {/* Features Grid */}
      <motion.section 
        className="landing-features"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <div className="feature-card glass-card">
          <div className="feature-icon-wrapper">
            <Clock size={22} />
          </div>
          <h3 className="feature-title">Due Date Tracking</h3>
          <p className="feature-desc">Schedule tasks with exact deadlines and overdue reminders.</p>
        </div>

        <div className="feature-card glass-card">
          <div className="feature-icon-wrapper">
            <Sliders size={22} />
          </div>
          <h3 className="feature-title">Smart Sorting</h3>
          <p className="feature-desc">Prioritize, search, and organize tasks effortlessly.</p>
        </div>

        <div className="feature-card glass-card">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={22} />
          </div>
          <h3 className="feature-title">No Sign-Up Needed</h3>
          <p className="feature-desc">Open the app and start managing right away with local storage.</p>
        </div>
      </motion.section>


    </div>
  );
}
