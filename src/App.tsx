import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthView } from './components/AuthView';
import { LandingView } from './components/LandingView';
import { DatabaseErrorView } from './components/DatabaseErrorView';
import { checkHealth } from './services/health';
import { DashboardView } from './components/DashboardView';
import { JournalView } from './components/JournalView';
import { GoalsView } from './components/GoalsView';
import { RoadmapsView } from './components/RoadmapsView';
import { SnippetsView } from './components/SnippetsView';
import { ResourcesView } from './components/ResourcesView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { 
  LayoutDashboard, FileText, Target, Compass, Code2, Bookmark, 
  Calendar as CalendarIcon, Settings, LogOut, Sparkles, Terminal, CodeXml, Menu, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const Workspace: React.FC = () => {
  const { user, logout, theme } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('sidebar-collapsed', String(newVal));
      return newVal;
    });
  };

  // Map navigation ids to views
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView setActiveTab={setActiveView} user={user} />;
      case 'journal': return <JournalView />;
      case 'goals': return <GoalsView />;
      case 'roadmaps': return <RoadmapsView />;
      case 'snippets': return <SnippetsView />;
      case 'resources': return <ResourcesView />;
      case 'calendar': return <CalendarView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView setActiveTab={setActiveView} user={user} />;
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', name: 'Dev Diaries', icon: FileText },
    { id: 'goals', name: 'Milestones', icon: Target },
    { id: 'roadmaps', name: 'Syllabus Paths', icon: Compass },
    { id: 'snippets', name: 'Saved Gists', icon: Code2 },
    { id: 'resources', name: 'Bookmarked Links', icon: Bookmark },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row transition-colors duration-300" id="devjournal_main_app">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-theme-card/80 border-b border-theme-border px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-50 glass-effect" id="mobile_header">
        <div className="flex items-center gap-2">
          <CodeXml className="w-5 h-5 text-theme-accent" />
          <span className="font-display font-bold tracking-tight text-sm text-theme-text">DevJournal</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 border border-theme-border rounded-lg bg-theme-bg"
          id="mobile_menu_trigger"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION (Desktop persistent, Mobile overlay) */}
      <aside 
        id="sidebar_navigation"
        className={`fixed md:sticky top-[53px] md:top-0 left-0 bottom-0 md:h-screen z-40 bg-theme-card/75 border-r border-theme-border flex flex-col justify-between shrink-0 transform md:transform-none transition-all duration-300 ease-in-out glass-effect p-4 ${
          isCollapsed ? 'w-64 md:w-20' : 'w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6 flex-1 flex flex-col overflow-hidden" id="sidebar_top_container">
          {/* Brand Logo Header (Desktop only) */}
          <div className={`hidden md:flex ${isCollapsed ? 'flex-col gap-4 items-center' : 'items-center justify-between'} border-b border-theme-border/50 pb-5`} id="brand_header">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
              <span className="p-1.5 rounded-lg bg-theme-accent/15 border border-theme-accent/20 flex items-center justify-center">
                <CodeXml className="w-5 h-5 text-theme-accent animate-pulse" />
              </span>
              {!isCollapsed && (
                <div className="text-left">
                  <h1 className="font-display font-bold tracking-tight text-base leading-none">DevJournal</h1>
                </div>
              )}
            </div>
            <button 
              onClick={toggleCollapse}
              className={`p-1.5 rounded-lg hover:bg-theme-bg/60 text-theme-muted hover:text-theme-text border border-theme-border/30 transition-all cursor-pointer ${isCollapsed ? 'mx-auto' : ''}`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Nav Items stack */}
          <nav className="space-y-1 flex-1 overflow-y-auto pr-0.5" id="nav_items_stack">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_link_${item.id}`}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-2 ${isCollapsed ? 'px-1 justify-center' : 'px-3'} rounded-lg text-xs font-semibold flex items-center ${isCollapsed ? '' : 'gap-3'} transition-all cursor-pointer ${
                    isActive
                      ? 'bg-theme-accent text-white shadow-sm box-glow'
                      : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg/55'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: User Profile Description & Sign Out (Only Icon) */}
        <div className="pt-4 border-t border-theme-border/40" id="sidebar_footer_container">
          <div className={`flex ${isCollapsed ? 'flex-col items-center gap-4' : 'items-center justify-between gap-2'}`} id="sidebar_profile_and_actions">
            {/* User Streak/Profile description */}
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0 flex-1'}`} id="sidebar_profile_preview">
              <div className="w-9 h-9 rounded-full bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center font-display font-bold text-sm text-theme-accent shrink-0" title={user?.name}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
              {!isCollapsed && (
                <div className="text-left min-w-0">
                  <p className="text-xs font-semibold truncate leading-none">{user?.name}</p>
                </div>
              )}
            </div>

            {/* Logout trigger - only icon */}
            <button
              id="nav_logout_btn"
              onClick={logout}
              className="p-2 rounded-lg text-theme-muted hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Sign Out Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* WORKSPACE CENTRAL WRAPPER */}
      <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-53px)] md:min-h-screen p-4 md:p-6 lg:p-8 flex flex-col space-y-6" id="central_workspace">
        {renderActiveView()}
      </main>

    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [checkingDb, setCheckingDb] = useState(true);

  useEffect(() => {
    let mounted = true;
    const verifyDb = async () => {
      setCheckingDb(true);
      const res = await checkHealth();
      if (mounted) {
        if (!res.success) {
          setDbError(res.error || res.message || 'Database disconnected.');
        } else {
          setDbError(null);
        }
        setCheckingDb(false);
      }
    };
    verifyDb();
    return () => { mounted = false; };
  }, []);

  if (checkingDb) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-[#5b64f5] flex flex-col items-center justify-center font-mono space-y-4" id="app_db_loading_screen">
        <div className="w-12 h-12 border-4 border-[#5b64f5]/20 border-t-[#5b64f5] rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest animate-pulse">VERIFYING SERVICES...</h2>
          <p className="text-[10px] text-gray-500">Checking database connection</p>
        </div>
      </div>
    );
  }

  if (dbError) {
    return <DatabaseErrorView error={dbError} onRetry={() => window.location.reload()} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] text-[#5b64f5] flex flex-col items-center justify-center font-mono space-y-4" id="app_loading_screen">
        <div className="w-12 h-12 border-4 border-[#5b64f5]/20 border-t-[#5b64f5] rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest animate-pulse">RECONCILING COCKPIT...</h2>
          <p className="text-[10px] text-gray-500">Connecting to secure JWT session database</p>
        </div>
      </div>
    );
  }

  // Guard routing based on login status
  if (user) {
    return <Workspace />;
  }
  
  if (showAuth) {
    return <AuthView onBack={() => setShowAuth(false)} />;
  }
  
  return <LandingView onLoginClick={() => setShowAuth(true)} />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
