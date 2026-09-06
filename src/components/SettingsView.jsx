import { jsx, jsxs } from "react/jsx-runtime";
import {
  Settings,
  User,
  Palette,
  Check,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const SettingsView = () => {
  const { user, theme, setTheme, logout } = useAuth();
  const daisyThemes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramell",
    "abyss",
    "silk"
  ];
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6 text-theme-text", id: "settings_view_root", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", id: "settings_header", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-display text-xl font-bold tracking-tight flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-5.5 h-5.5 text-theme-accent" }),
        /* @__PURE__ */ jsx("span", { children: "System Settings" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Configure your developer cockpit, customize themes, and inspect backend latency statuses" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", id: "settings_grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 space-y-4", id: "profile_telemetry_card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-theme-border pb-2.5", children: [
          /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-theme-accent" }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-xs font-semibold", children: "Profile Overview" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono text-theme-muted uppercase", children: "Developer Name" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: user?.name || "GUEST_DEV" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono text-theme-muted uppercase", children: "Developer Email" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted font-mono", children: user?.email || "N/A" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "sm:border-l sm:border-theme-border/50 sm:pl-4", children: /* @__PURE__ */ jsxs(
            "button",
            {
              id: "settings_logout_btn",
              onClick: logout,
              className: "w-full py-1.5 px-4 rounded-lg text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-500/15",
              children: [
                /* @__PURE__ */ jsx(LogOut, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Sign Out Session" })
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 space-y-5", id: "theme_picker_card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-theme-border pb-3", children: [
          /* @__PURE__ */ jsx(Palette, { className: "w-4.5 h-4.5 text-theme-accent" }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-semibold", children: "Visual Interface Theme" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mt-2", id: "theme_options_stack", children: daisyThemes.map((themeName) => {
          const isActive = theme === themeName;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              id: `theme_option_${themeName}`,
              onClick: () => setTheme(themeName),
              className: `w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all cursor-pointer ${isActive ? "bg-theme-accent/10 border border-theme-accent/20" : "hover:bg-theme-bg/50 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm capitalize ${isActive ? "font-semibold text-theme-accent" : "font-medium text-theme-text"}`, children: themeName }),
                  isActive && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-theme-accent" })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-theme": themeName, className: "flex items-center gap-1.5 shrink-0 bg-base-100 p-1.5 rounded-lg border border-base-content/10 shadow-sm", children: [
                  /* @__PURE__ */ jsx("div", { className: "bg-primary w-3 h-3 rounded-full" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-secondary w-3 h-3 rounded-full" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-accent w-3 h-3 rounded-full" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-neutral w-3 h-3 rounded-full" })
                ] })
              ]
            },
            themeName
          );
        }) })
      ] })
    ] })
  ] });
};
export {
  SettingsView
};
