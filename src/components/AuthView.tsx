import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Terminal, Lock, Mail, User, Eye, EyeOff, Sparkles, CodeXml, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthViewProps {
  onBack?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onBack }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please provide email and password.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Please provide your name to register.');
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters for security.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-theme-bg text-theme-text transition-all duration-300 relative overflow-hidden" id="auth_container">
      {/* Decorative blurred backdrop glow elements */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-theme-accent opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-theme-muted opacity-10 blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
        id="auth_card"
      >
        {/* Back Button */}
        {onBack && (
          <button 
            type="button"
            onClick={onBack}
            className="absolute -top-12 left-0 text-sm flex items-center gap-1.5 text-theme-muted hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        )}

        {/* Brand header */}
        <div className="flex flex-col items-center mb-8 text-center" id="brand_header">
          <div className="w-12 h-12 rounded-xl bg-theme-accent/15 border border-theme-accent flex items-center justify-center mb-3 text-theme-accent box-glow" id="brand_icon">
            <CodeXml className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-glow" id="brand_title">
            Dev<span className="text-theme-accent">Journal</span>
          </h1>
          <p className="text-sm text-theme-muted mt-1 font-sans max-w-xs" id="brand_tagline">
            The single operating workspace for developer logs, milestones, code snippets, and learning roadmaps.
          </p>
        </div>

        {/* Credentials Form container */}
        <div className="bg-theme-card/50 glass-effect border border-theme-border rounded-2xl p-8 shadow-xl" id="auth_form_container">
          <h2 className="text-xl font-display font-semibold mb-6 text-center text-theme-text" id="form_title">
            {isLogin ? 'Sign In to Workspace' : 'Create Developer Profile'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-5 flex items-start gap-2" id="auth_error">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="auth_form">
            {!isLogin && (
              <div className="space-y-1.5" id="input_group_name">
                <label className="text-xs text-theme-muted font-medium block">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-theme-muted">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="auth_name_input"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5" id="input_group_email">
              <label className="text-xs text-theme-muted font-medium block">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-theme-muted">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth_email_input"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="input_group_password">
              <div className="flex justify-between items-center">
                <label className="text-xs text-theme-muted font-medium block">Password</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => alert('Forgot password email token verification is configured on the backend routes!')}
                    className="text-xs text-theme-accent hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-theme-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth_password_input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
                />
                <button
                  id="toggle_password_btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-theme-muted hover:text-theme-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="auth_submit_btn"
              type="submit"
              disabled={loading}
              className="w-full bg-theme-accent hover:bg-theme-accent-hover text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Sign In' : 'Create Profile'
              )}
            </button>
          </form>

          {/* Prompt to switch states */}
          <div className="mt-6 pt-6 border-t border-theme-border text-center text-xs text-theme-muted" id="auth_toggle_prompt">
            {isLogin ? (
              <p>
                New to DevJournal?{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-theme-accent hover:underline font-semibold cursor-pointer"
                >
                  Create developer account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button 
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-theme-accent hover:underline font-semibold cursor-pointer"
                >
                  Log into your workspace
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
