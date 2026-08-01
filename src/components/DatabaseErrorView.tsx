import React from 'react';
import { Database, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface DatabaseErrorViewProps {
  error?: string;
  onRetry: () => void;
}

export const DatabaseErrorView: React.FC<DatabaseErrorViewProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-theme-bg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-theme-card/50 glass-effect border border-red-500/30 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500 relative">
          <Database className="w-8 h-8" />
          <AlertCircle className="w-5 h-5 absolute -bottom-1 -right-1 bg-theme-card rounded-full" />
        </div>
        
        <h1 className="font-display text-2xl font-bold text-theme-text mb-2">
          Database Connection Error
        </h1>
        
        <p className="text-theme-muted text-sm mb-6 leading-relaxed">
          The application cannot reach the primary database. In a production environment, a secure connection to the database is required to launch the workspace.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-6 text-left font-mono">
            {error}
          </div>
        )}

        <button 
          onClick={onRetry}
          className="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-text px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 w-full mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </motion.div>
    </div>
  );
};
