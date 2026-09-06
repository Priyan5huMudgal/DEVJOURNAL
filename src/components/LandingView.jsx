import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { motion } from "motion/react";
import { CodeXml, LayoutDashboard, Target, Compass, ArrowRight } from "lucide-react";
const LandingView = ({ onLoginClick }) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    return () => {
      const cachedTheme = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", cachedTheme);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-theme-bg text-theme-text font-sans overflow-x-hidden", id: "landing_view", children: [
    /* @__PURE__ */ jsx("nav", { className: "border-b border-theme-border/50 bg-theme-card/80 glass-effect sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "p-1.5 rounded-lg bg-theme-accent/15 border border-theme-accent/20 flex items-center justify-center", children: /* @__PURE__ */ jsx(CodeXml, { className: "w-5 h-5 text-theme-accent animate-pulse" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-display font-bold tracking-tight text-lg", children: "DevJournal" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onLoginClick,
            className: "text-sm font-medium text-theme-muted hover:text-theme-text transition-colors",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onLoginClick,
            className: "bg-theme-accent hover:bg-theme-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md flex items-center gap-2",
            children: [
              "Get Started ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "relative pt-32 pb-20 px-6", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-theme-accent)_0%,transparent_50%)] opacity-[0.03] pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center space-y-8 relative z-10", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: /* @__PURE__ */ jsxs("h1", { className: "font-display text-5xl md:text-7xl font-bold tracking-tight leading-tight text-glow", children: [
              "Your Engineering ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-theme-accent", children: "Knowledge Base" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            className: "text-lg md:text-xl text-theme-muted max-w-2xl mx-auto leading-relaxed",
            children: "A unified workspace designed specifically for developers. Document your learning, track project milestones, save code snippets, and manage your skill roadmaps in one beautifully crafted environment."
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2 },
            className: "flex items-center justify-center gap-4 pt-4",
            children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: onLoginClick,
                className: "bg-theme-accent hover:bg-theme-accent-hover text-white px-8 py-3.5 rounded-xl text-base font-medium transition-all shadow-lg box-glow flex items-center gap-2",
                children: [
                  "Start Journaling",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
                ]
              }
            )
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 border-t border-theme-border/30 bg-theme-card/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-display text-3xl font-bold mb-4", children: "Everything you need to grow" }),
        /* @__PURE__ */ jsx("p", { className: "text-theme-muted max-w-2xl mx-auto", children: "We've built all the essential tools you need to track your journey." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: [
        {
          icon: LayoutDashboard,
          title: "Analytics Dashboard",
          desc: "Track your learning intensity, visualize your mood correlations, and see your activity streaks."
        },
        {
          icon: Target,
          title: "Goal Tracking",
          desc: "Set daily, weekly, or monthly milestones. Keep your projects and learning targets in focus."
        },
        {
          icon: Compass,
          title: "Learning Roadmaps",
          desc: "Structure complex topics into step-by-step guides. Never lose track of where you are."
        }
      ].map((feature, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: i * 0.1 },
          className: "bg-theme-card/50 glass-effect border border-theme-border rounded-2xl p-8 hover:border-theme-accent/50 transition-colors",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-theme-accent/10 flex items-center justify-center text-theme-accent mb-6", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-6 h-6" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl font-semibold mb-3", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-theme-muted leading-relaxed text-sm", children: feature.desc })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-theme-border/50 py-8 px-6 bg-theme-card/80", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-theme-muted", children: [
        /* @__PURE__ */ jsx(CodeXml, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("span", { className: "font-display font-semibold text-sm", children: "DevJournal" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-theme-muted flex items-center gap-1", children: [
        "Crafted for developers ",
        /* @__PURE__ */ jsx(CodeXml, { className: "w-3 h-3" })
      ] })
    ] }) })
  ] });
};
export {
  LandingView
};
