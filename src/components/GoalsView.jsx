import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Play,
  Sparkles,
  Filter,
  X
} from "lucide-react";
import { motion } from "motion/react";
import { goalService } from "../services/api";
const GoalsView = () => {
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState("daily");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState("");
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals({
        type: activeTab,
        status: statusFilter || void 0
      });
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      console.error("Failed to retrieve goals:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGoals();
  }, [activeTab, statusFilter]);
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Goal Title is required.");
      return;
    }
    const payload = {
      title,
      description,
      type: activeTab,
      priority,
      deadline: deadline ? new Date(deadline) : void 0,
      progress: Number(progress)
    };
    try {
      if (editingId) {
        const res = await goalService.updateGoal(editingId, payload);
        if (res.success) {
          fetchGoals();
          resetForm();
        }
      } else {
        const res = await goalService.createGoal(payload);
        if (res.success) {
          fetchGoals();
          resetForm();
        }
      }
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };
  const handleEditClick = (goal) => {
    setEditingId(goal._id);
    setTitle(goal.title);
    setDescription(goal.description);
    setPriority(goal.priority);
    setProgress(goal.progress);
    setDeadline(goal.deadline ? goal.deadline.split("T")[0] : "");
    setShowCreate(true);
  };
  const handleDelete = async (goalId) => {
    try {
      const res = await goalService.deleteGoal(goalId);
      if (res.success) {
        fetchGoals();
      }
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };
  const handleQuickAdvance = async (goalId, currentProgress) => {
    const nextProgress = Math.min(currentProgress + 25, 100);
    try {
      const res = await goalService.updateGoal(goalId, { progress: nextProgress });
      if (res.success) {
        fetchGoals();
      }
    } catch (err) {
      console.error("Failed to quick-advance goal:", err);
    }
  };
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setProgress(0);
    setDeadline("");
    setShowCreate(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-theme-text", id: "goals_view_root", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", id: "goals_header", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-xl font-bold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Target, { className: "w-5.5 h-5.5 text-theme-accent" }),
          /* @__PURE__ */ jsx("span", { children: "Milestones Tracker" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Manage structured daily tasks, weekly commits, and monthly career development targets" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          id: "toggle_goal_form_btn",
          onClick: () => {
            if (showCreate) resetForm();
            else setShowCreate(true);
          },
          className: "bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto box-glow",
          children: [
            showCreate ? /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: showCreate ? "Close Editor" : "New Goal Target" })
          ]
        }
      )
    ] }),
    showCreate && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "bg-theme-card border border-theme-border rounded-xl p-5",
        id: "goal_form_panel",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-theme-accent tracking-wider font-mono uppercase mb-4", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: editingId ? "Edit Goal Milestone" : `Add ${activeTab} Objective` })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateOrUpdate, className: "grid grid-cols-1 md:grid-cols-12 gap-4", id: "goal_form", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-6 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Goal Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "goal_title_input",
                    type: "text",
                    required: true,
                    placeholder: "e.g. Solve 5 dynamic programming graphs, finish auth server...",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Description / Checklist details" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "goal_desc_input",
                    placeholder: "Describe key outcomes, repositories to review, or criteria for success...",
                    rows: 3,
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg p-3 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent resize-none"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-6 grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "space-y-4 col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-mono text-theme-muted uppercase", children: [
                  /* @__PURE__ */ jsx("span", { children: "Active Progress" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-theme-accent font-semibold", children: [
                    progress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "goal_progress_slider",
                    type: "range",
                    min: "0",
                    max: "100",
                    step: "5",
                    value: progress,
                    onChange: (e) => setProgress(Number(e.target.value)),
                    className: "w-full h-1.5 bg-theme-bg border border-theme-border rounded-lg appearance-none cursor-pointer accent-theme-accent"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Priority" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "goal_priority_select",
                    value: priority,
                    onChange: (e) => setPriority(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-sans",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "low", children: "Low Priority" }),
                      /* @__PURE__ */ jsx("option", { value: "medium", children: "Medium Priority" }),
                      /* @__PURE__ */ jsx("option", { value: "high", children: "High Priority" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Deadline Target" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "goal_deadline_input",
                    type: "date",
                    value: deadline,
                    onChange: (e) => setDeadline(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-sans"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2 flex justify-end gap-2 pt-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: resetForm,
                    className: "px-3 py-1.5 rounded-lg border border-theme-border text-xs text-theme-muted hover:bg-theme-bg font-medium cursor-pointer",
                    children: "Reset"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    id: "goal_submit_btn",
                    type: "submit",
                    className: "px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold cursor-pointer box-glow",
                    children: editingId ? "Apply Changes" : "Create Milestone"
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-theme-border pb-1 gap-3", id: "goals_filters", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-1", id: "goals_tabs_container", children: ["daily", "weekly", "monthly"].map((tab) => /* @__PURE__ */ jsxs(
        "button",
        {
          id: `tab_goals_${tab}`,
          onClick: () => {
            setActiveTab(tab);
            resetForm();
          },
          className: `px-4 py-2 text-xs font-semibold capitalize border-b-2 transition-all cursor-pointer ${activeTab === tab ? "border-theme-accent text-theme-accent" : "border-transparent text-theme-muted hover:text-theme-text"}`,
          children: [
            tab,
            " Targets"
          ]
        },
        tab
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs shrink-0", id: "goals_status_filter", children: [
        /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-theme-muted" }),
        /* @__PURE__ */ jsx("span", { className: "text-theme-muted font-mono uppercase text-[10px]", children: "Status:" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "goals_status_select",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "bg-theme-card border border-theme-border rounded-lg px-2.5 py-1 text-xs text-theme-text focus:outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All Statuses" }),
              /* @__PURE__ */ jsx("option", { value: "todo", children: "Todo" }),
              /* @__PURE__ */ jsx("option", { value: "in-progress", children: "In-Progress" }),
              /* @__PURE__ */ jsx("option", { value: "completed", children: "Completed" })
            ]
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center", id: "goals_loader", children: [
      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-theme-muted font-mono mt-2 animate-pulse", children: "LOADING MILESTONES..." })
    ] }) : goals.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-16 border border-dashed border-theme-border rounded-xl text-center p-8 bg-theme-card/15", id: "goals_empty", children: [
      /* @__PURE__ */ jsx(Target, { className: "w-10 h-10 text-theme-muted/30 mx-auto mb-2" }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-semibold", children: "No Goals Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted mt-1 max-w-sm mx-auto", children: "Create structured goals to lock in milestones, track study sessions, and review analytics streaks!" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowCreate(true),
          className: "mt-3 px-4 py-1.5 rounded-lg border border-theme-accent/40 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent text-xs font-mono cursor-pointer transition-all",
          children: [
            "Create first ",
            activeTab,
            " target +"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", id: "goals_cards_grid", children: goals.map((goal) => {
      const isCompleted = goal.status === "completed";
      return /* @__PURE__ */ jsxs(
        "div",
        {
          id: `goal_card_${goal._id}`,
          className: `bg-theme-card/50 glass-effect border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-theme-border/80 ${isCompleted ? "border-emerald-500/10 opacity-75" : "border-theme-border"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2", children: [
                /* @__PURE__ */ jsxs("span", { className: `text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${goal.priority === "high" ? "bg-red-500/10 text-red-400 border-red-500/10" : goal.priority === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/10" : "bg-blue-500/10 text-blue-400 border-blue-500/10"}`, children: [
                  goal.priority,
                  " priority"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      id: `goal_edit_${goal._id}`,
                      onClick: () => handleEditClick(goal),
                      className: "p-1 rounded hover:bg-theme-border text-theme-muted hover:text-theme-text transition-all cursor-pointer",
                      title: "Edit Goal",
                      children: /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      id: `goal_delete_${goal._id}`,
                      onClick: () => handleDelete(goal._id),
                      className: "p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-all cursor-pointer",
                      title: "Delete Goal",
                      children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: `font-display text-sm font-semibold tracking-tight leading-tight mt-1 ${isCompleted ? "line-through text-theme-muted" : "text-theme-text"}`, children: goal.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted line-clamp-2 min-h-[32px]", children: goal.description || "No description provided." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-theme-border/50 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[11px] font-mono", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-theme-muted flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx("span", { children: goal.deadline ? new Date(goal.deadline).toLocaleDateString(void 0, { month: "short", day: "numeric" }) : "No Deadline" })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: isCompleted ? "text-emerald-500 font-semibold" : "text-theme-accent font-semibold", children: [
                  goal.progress,
                  "% Done"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full h-1.5 bg-theme-bg border border-theme-border/60 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-full transition-all duration-300 ${isCompleted ? "bg-emerald-500" : "bg-theme-accent"}`,
                  style: { width: `${goal.progress}%` }
                }
              ) }),
              !isCompleted && /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxs(
                "button",
                {
                  id: `goal_quick_advance_${goal._id}`,
                  onClick: () => handleQuickAdvance(goal._id, goal.progress),
                  className: "text-[10px] font-mono border border-theme-border/80 bg-theme-bg/60 hover:bg-theme-border text-theme-text py-1 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(Play, { className: "w-2.5 h-2.5 text-theme-accent animate-pulse" }),
                    /* @__PURE__ */ jsx("span", { children: "Advance +25%" })
                  ]
                }
              ) })
            ] })
          ]
        },
        goal._id
      );
    }) })
  ] });
};
export {
  GoalsView
};
