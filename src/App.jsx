import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthView } from "./components/AuthView";
import { LandingView } from "./components/LandingView";
import { DatabaseErrorView } from "./components/DatabaseErrorView";
import { checkHealth } from "./services/health";
import { DashboardView } from "./components/DashboardView";
import { JournalView } from "./components/JournalView";
import { GoalsView } from "./components/GoalsView";
import { RoadmapsView } from "./components/RoadmapsView";
import { SnippetsView } from "./components/SnippetsView";
import { ResourcesView } from "./components/ResourcesView";
import { CalendarView } from "./components/CalendarView";
import { SettingsView } from "./components/SettingsView";
import {
  LayoutDashboard,
  FileText,
  Target,
  Compass,
  Code2,
  Bookmark,
  Calendar as CalendarIcon,
  Settings,
  LogOut,
  CodeXml,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
const Workspace = () => {
  const { user, logout, theme } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem("sidebar-collapsed", String(newVal));
      return newVal;
    });
  };
  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return /* @__PURE__ */ jsx(DashboardView, { setActiveTab: setActiveView, user });
      case "journal":
        return /* @__PURE__ */ jsx(JournalView, {});
      case "goals":
        return /* @__PURE__ */ jsx(GoalsView, {});
      case "roadmaps":
        return /* @__PURE__ */ jsx(RoadmapsView, {});
      case "snippets":
        return /* @__PURE__ */ jsx(SnippetsView, {});
      case "resources":
        return /* @__PURE__ */ jsx(ResourcesView, {});
      case "calendar":
        return /* @__PURE__ */ jsx(CalendarView, {});
      case "settings":
        return /* @__PURE__ */ jsx(SettingsView, {});
      default:
        return /* @__PURE__ */ jsx(DashboardView, { setActiveTab: setActiveView, user });
    }
  };
  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "journal", name: "Dev Diaries", icon: FileText },
    { id: "goals", name: "Milestones", icon: Target },
    { id: "roadmaps", name: "Syllabus Paths", icon: Compass },
    { id: "snippets", name: "Saved Gists", icon: Code2 },
    { id: "resources", name: "Bookmarked Links", icon: Bookmark },
    { id: "calendar", name: "Calendar", icon: CalendarIcon },
    { id: "settings", name: "Settings", icon: Settings }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row transition-colors duration-300", id: "devjournal_main_app", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:hidden bg-theme-card/80 border-b border-theme-border px-4 py-3 flex items-center justify-between shrink-0 sticky top-0 z-50 glass-effect", id: "mobile_header", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CodeXml, { className: "w-5 h-5 text-theme-accent" }),
        /* @__PURE__ */ jsx("span", { className: "font-display font-bold tracking-tight text-sm text-theme-text", children: "DevJournal" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMobileMenuOpen(!mobileMenuOpen),
          className: "p-1 border border-theme-border rounded-lg bg-theme-bg",
          id: "mobile_menu_trigger",
          children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
        }
      )
    ] }),
    mobileMenuOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden",
        onClick: () => setMobileMenuOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        id: "sidebar_navigation",
        className: `fixed md:sticky top-[53px] md:top-0 left-0 bottom-0 md:h-screen z-40 bg-theme-card/75 border-r border-theme-border flex flex-col justify-between shrink-0 transform md:transform-none transition-all duration-300 ease-in-out glass-effect p-4 ${isCollapsed ? "w-64 md:w-20" : "w-64"} ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 flex-1 flex flex-col overflow-hidden", id: "sidebar_top_container", children: [
            /* @__PURE__ */ jsxs("div", { className: `hidden md:flex ${isCollapsed ? "flex-col gap-4 items-center" : "items-center justify-between"} border-b border-theme-border/50 pb-5`, id: "brand_header", children: [
              /* @__PURE__ */ jsxs("div", { className: `flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"}`, children: [
                /* @__PURE__ */ jsx("span", { className: "p-1.5 rounded-lg bg-theme-accent/15 border border-theme-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(CodeXml, { className: "w-5 h-5 text-theme-accent animate-pulse" }) }),
                !isCollapsed && /* @__PURE__ */ jsx("div", { className: "text-left", children: /* @__PURE__ */ jsx("h1", { className: "font-display font-bold tracking-tight text-base leading-none", children: "DevJournal" }) })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: toggleCollapse,
                  className: `p-1.5 rounded-lg hover:bg-theme-bg/60 text-theme-muted hover:text-theme-text border border-theme-border/30 transition-all cursor-pointer ${isCollapsed ? "mx-auto" : ""}`,
                  title: isCollapsed ? "Expand Sidebar" : "Collapse Sidebar",
                  children: isCollapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "w-3.5 h-3.5" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("nav", { className: "space-y-1 flex-1 overflow-y-auto pr-0.5", id: "nav_items_stack", children: navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  id: `nav_link_${item.id}`,
                  onClick: () => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  },
                  className: `w-full py-2 ${isCollapsed ? "px-1 justify-center" : "px-3"} rounded-lg text-xs font-semibold flex items-center ${isCollapsed ? "" : "gap-3"} transition-all cursor-pointer ${isActive ? "bg-theme-accent text-white shadow-sm box-glow" : "text-theme-muted hover:text-theme-text hover:bg-theme-bg/55"}`,
                  title: isCollapsed ? item.name : void 0,
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 shrink-0" }),
                    !isCollapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: item.name })
                  ]
                },
                item.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-4 border-t border-theme-border/40", id: "sidebar_footer_container", children: /* @__PURE__ */ jsxs("div", { className: `flex ${isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between gap-2"}`, id: "sidebar_profile_and_actions", children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center ${isCollapsed ? "justify-center" : "gap-3 min-w-0 flex-1"}`, id: "sidebar_profile_preview", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center font-display font-bold text-sm text-theme-accent shrink-0", title: user?.name, children: user?.name ? user.name.charAt(0).toUpperCase() : "D" }),
              !isCollapsed && /* @__PURE__ */ jsx("div", { className: "text-left min-w-0", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold truncate leading-none", children: user?.name }) })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                id: "nav_logout_btn",
                onClick: logout,
                className: "p-2 rounded-lg text-theme-muted hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15 transition-all cursor-pointer flex items-center justify-center shrink-0",
                title: "Sign Out Session",
                children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
              }
            )
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-x-hidden min-h-[calc(100vh-53px)] md:min-h-screen p-4 md:p-6 lg:p-8 flex flex-col space-y-6", id: "central_workspace", children: renderActiveView() })
  ] });
};
const AppContent = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [checkingDb, setCheckingDb] = useState(true);
  useEffect(() => {
    let mounted = true;
    const verifyDb = async () => {
      setCheckingDb(true);
      const res = await checkHealth();
      if (mounted) {
        if (!res.success) {
          setDbError(res.error || res.message || "Database disconnected.");
        } else {
          setDbError(null);
        }
        setCheckingDb(false);
      }
    };
    verifyDb();
    return () => {
      mounted = false;
    };
  }, []);
  if (checkingDb) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a0f1d] text-[#5b64f5] flex flex-col items-center justify-center font-mono space-y-4", id: "app_db_loading_screen", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-[#5b64f5]/20 border-t-[#5b64f5] rounded-full animate-spin" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xs font-bold uppercase tracking-widest animate-pulse", children: "VERIFYING SERVICES..." }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: "Checking database connection" })
      ] })
    ] });
  }
  if (dbError) {
    return /* @__PURE__ */ jsx(DatabaseErrorView, { error: dbError, onRetry: () => window.location.reload() });
  }
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a0f1d] text-[#5b64f5] flex flex-col items-center justify-center font-mono space-y-4", id: "app_loading_screen", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-[#5b64f5]/20 border-t-[#5b64f5] rounded-full animate-spin" }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xs font-bold uppercase tracking-widest animate-pulse", children: "RECONCILING COCKPIT..." }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: "Connecting to secure JWT session database" })
      ] })
    ] });
  }
  if (user) {
    return /* @__PURE__ */ jsx(Workspace, {});
  }
  if (showAuth) {
    return /* @__PURE__ */ jsx(AuthView, { onBack: () => setShowAuth(false) });
  }
  return /* @__PURE__ */ jsx(LandingView, { onLoginClick: () => setShowAuth(true) });
};
function App() {
  return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) });
}
export {
  App as default
};
