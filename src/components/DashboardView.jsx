import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Flame,
  BookOpen,
  Target,
  Compass,
  Sparkles,
  Plus,
  Clock,
  Code2,
  CheckSquare,
  MessageSquare,
  Terminal,
  ChevronRight
} from "lucide-react";
import { analyticsService, goalService } from "../services/api";
const DashboardView = ({
  setActiveTab,
  user
}) => {
  const [stats, setStats] = useState(null);
  const [todayGoals, setTodayGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchDashboardData = async () => {
    try {
      const statsRes = await analyticsService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }
      const goalsRes = await goalService.getGoals({ type: "daily" });
      if (goalsRes.success) {
        setTodayGoals(goalsRes.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Could not retrieve active statistics.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const handleToggleGoal = async (goalId, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "todo" : "completed";
      const res = await goalService.updateGoal(goalId, { status: newStatus });
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to toggle goal:", err);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-theme-text",
        id: "dashboard_loader",
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs font-mono text-theme-muted tracking-wide animate-pulse", children: "RECONCILING DEVELOPER METRICS..." })
        ]
      }
    );
  }
  const counters = stats?.counters || {
    totalJournals: 0,
    totalGoals: 0,
    completedGoals: 0,
    completionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalRoadmaps: 0,
    averageRoadmapProgress: 0,
    totalResources: 0,
    totalSnippets: 0
  };
  const MOOD_COLORS = {
    Productive: "#47a248",
    // green
    Focused: "#61dafb",
    // cyan
    Happy: "#ec4899",
    // pink
    Tired: "#f59e0b",
    // orange
    Stressed: "#ef4444"
    // red
  };
  const moodData = stats?.moodDistribution.filter((m) => m.value > 0) || [];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 text-theme-text", id: "dashboard_view_root", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-theme-accent/10 via-theme-card/35 to-theme-card/10 border border-theme-border overflow-hidden relative",
        id: "dashboard_welcome",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-theme-accent tracking-widest font-mono uppercase", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Developer Workspace Active" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "font-display text-2xl md:text-3xl font-bold tracking-tight", children: [
              "Welcome,",
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-glow", children: user?.name || "Developer" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-muted", children: counters.currentStreak > 0 ? `You are on an active learning streak of ${counters.currentStreak} day${counters.currentStreak > 1 ? "s" : ""}! Let's document today's session.` : "No active entries today yet. Set targets, program solutions, and log your thoughts!" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 shrink-0 z-10", id: "welcome_actions", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                id: "quick_journal_btn",
                onClick: () => setActiveTab("journal"),
                className: "bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Log Today's Work" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                id: "quick_snippet_btn",
                onClick: () => setActiveTab("snippets"),
                className: "bg-theme-card hover:bg-theme-border border border-theme-border text-theme-text text-xs font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Code2, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Add Snippet" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        id: "dashboard_metrics_grid",
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between",
              id: "metric_streak",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium text-theme-muted tracking-wide uppercase", children: "Active Streak" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 animate-pulse", children: /* @__PURE__ */ jsx(Flame, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-3xl md:text-4xl font-display font-bold tracking-tight text-glow", children: counters.currentStreak }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-theme-muted font-mono block mt-1", children: [
                    "Longest: ",
                    counters.longestStreak,
                    " days"
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between",
              id: "metric_journals",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium text-theme-muted tracking-wide uppercase", children: "Logs Count" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-3xl md:text-4xl font-display font-bold tracking-tight text-glow", children: counters.totalJournals }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-theme-muted font-mono block mt-1", children: "Total developer diaries" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between",
              id: "metric_goals",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium text-theme-muted tracking-wide uppercase", children: "Goal Target" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500", children: /* @__PURE__ */ jsx(Target, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-3xl md:text-4xl font-display font-bold tracking-tight text-glow", children: [
                    counters.completionRate,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-theme-muted font-mono block mt-1", children: [
                    counters.completedGoals,
                    "/",
                    counters.totalGoals,
                    " objectives met"
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between",
              id: "metric_roadmaps",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-mono font-medium text-theme-muted tracking-wide uppercase", children: "Curriculum" }),
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500", children: /* @__PURE__ */ jsx(Compass, { className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-3xl md:text-4xl font-display font-bold tracking-tight text-glow", children: [
                    counters.averageRoadmapProgress,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-theme-muted font-mono block mt-1", children: [
                    counters.totalRoadmaps,
                    " learning paths active"
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "grid grid-cols-1 lg:grid-cols-5 gap-6",
        id: "dashboard_charts_row",
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col justify-between lg:col-span-2",
              id: "chart_weekly_intensity",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-theme-text", children: "Learning Intensity" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Weekly study session distributions and documentation logs count." })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex gap-4 text-xs font-mono", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded bg-theme-accent/80 inline-block" }),
                    /* @__PURE__ */ jsx("span", { className: "text-theme-muted", children: "Logs" })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-64", id: "weekly_bar_chart_container", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
                  BarChart,
                  {
                    data: stats?.weeklyDistribution || [],
                    margin: { top: 10, right: 10, left: -25, bottom: 0 },
                    children: [
                      /* @__PURE__ */ jsx(
                        XAxis,
                        {
                          dataKey: "day",
                          stroke: "var(--color-theme-muted)",
                          fontSize: 11,
                          tickLine: false,
                          axisLine: false
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        YAxis,
                        {
                          stroke: "var(--color-theme-muted)",
                          fontSize: 11,
                          tickLine: false,
                          axisLine: false
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Tooltip,
                        {
                          contentStyle: {
                            backgroundColor: "var(--color-theme-card)",
                            borderColor: "var(--color-theme-border)",
                            color: "var(--color-theme-text)",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Bar,
                        {
                          dataKey: "journals",
                          name: "Journal Logs",
                          fill: "var(--color-theme-accent)",
                          fillOpacity: 0.8,
                          radius: [4, 4, 0, 0],
                          barSize: 32
                        }
                      )
                    ]
                  }
                ) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col lg:col-span-3",
              id: "chart_mood_distribution",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-display text-base font-semibold text-theme-text", children: "Mental Sync" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Distribution of documented emotional & productivity triggers" })
                ] }),
                moodData.length === 0 ? /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex-1 flex flex-col items-center justify-center text-center p-4",
                    id: "no_mood_data",
                    children: [
                      /* @__PURE__ */ jsx(MessageSquare, { className: "w-8 h-8 text-theme-muted/40 mb-2" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "No mental logs found. Start journaling to track mood correlations!" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex-1 flex flex-col items-center justify-center",
                    id: "mood_pie_chart",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "w-full h-64 relative", children: [
                        /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
                          /* @__PURE__ */ jsx(
                            Pie,
                            {
                              data: moodData,
                              cx: "50%",
                              cy: "50%",
                              innerRadius: 80,
                              outerRadius: 110,
                              paddingAngle: 4,
                              dataKey: "value",
                              label: ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`,
                              labelLine: false,
                              children: moodData.map((entry, index) => /* @__PURE__ */ jsx(
                                Cell,
                                {
                                  fill: MOOD_COLORS[entry.name] || "#6366f1"
                                },
                                `cell-${index}`
                              ))
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            Tooltip,
                            {
                              contentStyle: {
                                backgroundColor: "var(--card)",
                                borderColor: "var(--border)",
                                color: "var(--text-primary)",
                                borderRadius: "8px",
                                fontSize: "11px"
                              }
                            }
                          )
                        ] }) }),
                        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
                          /* @__PURE__ */ jsx("span", { className: "text-2xl font-display font-bold text-glow", children: counters.totalJournals }),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] text-theme-muted font-mono tracking-wider uppercase", children: "Sessions" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-6 text-xs font-sans w-full border-t border-theme-border/50 pt-4",
                          id: "mood_legends",
                          children: moodData.map((entry, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: "w-3 h-3 rounded-full inline-block shrink-0 shadow-sm",
                                style: {
                                  backgroundColor: MOOD_COLORS[entry.name] || "#6366f1"
                                }
                              }
                            ),
                            /* @__PURE__ */ jsxs("span", { className: "text-theme-muted font-medium truncate", children: [
                              entry.name,
                              " (",
                              entry.value,
                              ")"
                            ] })
                          ] }, index))
                        }
                      )
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
        id: "dashboard_details_row",
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col justify-between",
              id: "today_goals_checklist",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 mb-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxs("h3", { className: "font-display text-base font-semibold text-theme-text flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(CheckSquare, { className: "w-4 h-4 text-theme-accent" }),
                      /* @__PURE__ */ jsx("span", { children: "Today's Daily Targets" })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setActiveTab("goals"),
                        className: "text-xs text-theme-accent hover:underline flex items-center gap-0.5 font-mono",
                        children: [
                          /* @__PURE__ */ jsx("span", { children: "View tracker" }),
                          /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Milestones and quick study targets to complete before logging off" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-3 min-h-[220px]", id: "today_goals_list", children: todayGoals.length === 0 ? /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "h-full flex flex-col items-center justify-center text-center p-4",
                    id: "no_today_goals",
                    children: [
                      /* @__PURE__ */ jsx(Target, { className: "w-8 h-8 text-theme-muted/40 mb-2" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "All clear! No pending daily goals today." }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setActiveTab("goals"),
                          className: "mt-2 text-xs text-theme-accent hover:underline font-mono",
                          children: "Create one now +"
                        }
                      )
                    ]
                  }
                ) : todayGoals.map((goal) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `flex items-center justify-between p-3.5 rounded-lg border transition-all ${goal.status === "completed" ? "bg-theme-bg/30 border-theme-border/50 opacity-60" : "bg-theme-card border-theme-border/60 hover:border-theme-border"}`,
                    id: `checklist_item_${goal._id}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            id: `checklist_toggle_${goal._id}`,
                            onClick: () => handleToggleGoal(goal._id, goal.status),
                            className: `w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 cursor-pointer transition-all ${goal.status === "completed" ? "bg-emerald-500 border-emerald-600 text-white" : "border-theme-muted hover:border-theme-accent"}`,
                            children: goal.status === "completed" && "\u2713"
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsx(
                            "p",
                            {
                              className: `text-sm font-medium ${goal.status === "completed" ? "line-through text-theme-muted" : "text-theme-text"}`,
                              children: goal.title
                            }
                          ),
                          /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted truncate", children: goal.description || "No description provided." })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${goal.priority === "high" ? "bg-red-500/10 text-red-400 border border-red-500/10" : goal.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/10" : "bg-blue-500/10 text-blue-400 border border-blue-500/10"}`,
                          children: goal.priority
                        }
                      )
                    ]
                  },
                  goal._id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col",
              id: "recent_activities_timeline",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 mb-4", children: [
                  /* @__PURE__ */ jsxs("h3", { className: "font-display text-base font-semibold text-theme-text flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Terminal, { className: "w-4 h-4 text-theme-accent animate-pulse" }),
                    /* @__PURE__ */ jsx("span", { children: "Workspace Logs" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Audit trail of recent events, diary captures, and snippet registrations" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-4", id: "activities_feed", children: !stats || stats.recentActivities.length === 0 ? /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "h-full flex flex-col items-center justify-center text-center p-4",
                    id: "no_activities",
                    children: [
                      /* @__PURE__ */ jsx(Clock, { className: "w-8 h-8 text-theme-muted/40 mb-2" }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Workspace logs empty. Perform actions to seed the event timeline." })
                    ]
                  }
                ) : stats.recentActivities.map((act, i) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex gap-3 relative pb-1",
                    id: `timeline_item_${act.id}`,
                    children: [
                      i < stats.recentActivities.length - 1 && /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-8 bottom-0 w-px bg-theme-border/60" }),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${act.type === "journal" ? "bg-theme-accent/10 border-theme-accent/20 text-theme-accent" : act.type === "goal" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"}`,
                          id: `timeline_badge_${act.id}`,
                          children: [
                            act.type === "journal" && /* @__PURE__ */ jsx(BookOpen, { className: "w-3.5 h-3.5" }),
                            act.type === "goal" && /* @__PURE__ */ jsx(Target, { className: "w-3.5 h-3.5" }),
                            act.type === "snippet" && /* @__PURE__ */ jsx(Code2, { className: "w-3.5 h-3.5" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-0.5", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-theme-text leading-tight", children: act.title }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-theme-muted font-mono", children: [
                          /* @__PURE__ */ jsx("span", { children: new Date(act.date).toLocaleDateString(void 0, {
                            month: "short",
                            day: "numeric"
                          }) }),
                          /* @__PURE__ */ jsx("span", { children: "\u2022" }),
                          /* @__PURE__ */ jsx("span", { className: "bg-theme-bg/60 border border-theme-border/50 px-1.5 py-0.2 rounded uppercase text-[9px]", children: act.meta })
                        ] })
                      ] })
                    ]
                  },
                  i
                )) })
              ]
            }
          )
        ]
      }
    )
  ] });
};
export {
  DashboardView
};
