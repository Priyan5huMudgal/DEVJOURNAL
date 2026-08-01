import React from 'react';
import { 
  Settings, User, Palette, Database, Check, Shield, 
  HelpCircle, Sparkles, Terminal, Activity, FileText, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { user, theme, setTheme, logout } = useAuth();

  // Definition of themes with previews to help the user choose
  const daisyThemes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", 
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", 
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", 
    "night", "coffee", "winter", "dim", "nord", "sunset", "caramell", "abyss", "silk"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-theme-text" id="settings_view_root">
      
      {/* Header */}
      <div className="space-y-0.5" id="settings_header">
        <h2 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-theme-accent" />
          <span>System Settings</span>
        </h2>
        <p className="text-xs text-theme-muted">Configure your developer cockpit, customize themes, and inspect backend latency statuses</p>
      </div>

      <div className="space-y-6" id="settings_grid">
        {/* Profile Card */}
        <div className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 space-y-4" id="profile_telemetry_card">
          <div className="flex items-center gap-2 border-b border-theme-border pb-2.5">
            <User className="w-4 h-4 text-theme-accent" />
            <h3 className="font-display text-xs font-semibold">Profile Overview</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="space-y-3">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-theme-muted uppercase">Developer Name</span>
                <p className="text-sm font-semibold">{user?.name || 'GUEST_DEV'}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-theme-muted uppercase">Developer Email</span>
                <p className="text-xs text-theme-muted font-mono">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="sm:border-l sm:border-theme-border/50 sm:pl-4">
              <button
                id="settings_logout_btn"
                onClick={logout}
                className="w-full py-1.5 px-4 rounded-lg text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-500/15"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 space-y-5" id="theme_picker_card">
          <div className="flex items-center gap-2 border-b border-theme-border pb-3">
            <Palette className="w-4.5 h-4.5 text-theme-accent" />
            <h3 className="font-display text-sm font-semibold">Visual Interface Theme</h3>
          </div>

          <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mt-2" id="theme_options_stack">
            {daisyThemes.map((themeName) => {
              const isActive = theme === themeName;
              return (
                <button
                  key={themeName}
                  id={`theme_option_${themeName}`}
                  onClick={() => setTheme(themeName as any)}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all cursor-pointer ${
                    isActive ? 'bg-theme-accent/10 border border-theme-accent/20' : 'hover:bg-theme-bg/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm capitalize ${isActive ? 'font-semibold text-theme-accent' : 'font-medium text-theme-text'}`}>
                      {themeName}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-theme-accent" />}
                  </div>
                  
                  <div data-theme={themeName} className="flex items-center gap-1.5 shrink-0 bg-base-100 p-1.5 rounded-lg border border-base-content/10 shadow-sm">
                    <div className="bg-primary w-3 h-3 rounded-full"></div>
                    <div className="bg-secondary w-3 h-3 rounded-full"></div>
                    <div className="bg-accent w-3 h-3 rounded-full"></div>
                    <div className="bg-neutral w-3 h-3 rounded-full"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
