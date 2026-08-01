import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CodeXml, LayoutDashboard, Target, Compass, ArrowRight, Github } from 'lucide-react';

interface LandingViewProps {
  onLoginClick: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onLoginClick }) => {
  useEffect(() => {
    // Force light theme on landing page permanently
    document.documentElement.setAttribute('data-theme', 'light');
    return () => {
      // Re-apply the stored theme when leaving the landing page
      const cachedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', cachedTheme);
    };
  }, []);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text font-sans overflow-x-hidden" id="landing_view">
      {/* Navigation */}
      <nav className="border-b border-theme-border/50 bg-theme-card/80 glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-theme-accent/15 border border-theme-accent/20 flex items-center justify-center">
              <CodeXml className="w-5 h-5 text-theme-accent animate-pulse" />
            </span>
            <span className="font-display font-bold tracking-tight text-lg">DevJournal</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="text-sm font-medium text-theme-muted hover:text-theme-text transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onLoginClick}
              className="bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-theme-accent)_0%,transparent_50%)] opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-tight text-glow">
              Your Engineering <br/>
              <span className="text-theme-accent">Knowledge Base</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed"
          >
            A unified workspace designed specifically for developers. Document your learning, track project milestones, save code snippets, and manage your skill roadmaps in one beautifully crafted environment.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={onLoginClick}
              className="bg-theme-accent hover:bg-theme-accent-hover text-white px-8 py-3.5 rounded-xl text-base font-medium transition-all shadow-lg box-glow flex items-center gap-2"
            >
              Start Journaling
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-theme-border/30 bg-theme-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-theme-muted max-w-2xl mx-auto">We've built all the essential tools you need to track your journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: LayoutDashboard,
                title: 'Analytics Dashboard',
                desc: 'Track your learning intensity, visualize your mood correlations, and see your activity streaks.'
              },
              {
                icon: Target,
                title: 'Goal Tracking',
                desc: 'Set daily, weekly, or monthly milestones. Keep your projects and learning targets in focus.'
              },
              {
                icon: Compass,
                title: 'Learning Roadmaps',
                desc: 'Structure complex topics into step-by-step guides. Never lose track of where you are.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-theme-card/50 glass-effect border border-theme-border rounded-2xl p-8 hover:border-theme-accent/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-theme-accent/10 flex items-center justify-center text-theme-accent mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-theme-muted leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-theme-border/50 py-8 px-6 bg-theme-card/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-theme-muted">
            <CodeXml className="w-5 h-5" />
            <span className="font-display font-semibold text-sm">DevJournal</span>
          </div>
          <p className="text-xs text-theme-muted flex items-center gap-1">
            Crafted for developers <CodeXml className="w-3 h-3" />
          </p>
        </div>
      </footer>
    </div>
  );
};
