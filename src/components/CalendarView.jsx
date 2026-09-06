import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Activity,
  AlertCircle
} from "lucide-react";
import { journalService, goalService } from "../services/api";
const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [journals, setJournals] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedDay, setSelectedDay] = useState(/* @__PURE__ */ new Date());
  const [loading, setLoading] = useState(true);
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const journalRes = await journalService.getEntries();
      if (journalRes.success) setJournals(journalRes.data);
      const goalRes = await goalService.getGoals();
      if (goalRes.success) setGoals(goalRes.data);
    } catch (err) {
      console.error("Failed to load calendar events:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchActivities();
  }, []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const firstDayIndex = new Date(year, month, 1).getDay();
  const alignedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const getActivitiesForDate = (dayNum) => {
    const targetDate = new Date(year, month, dayNum);
    const dayJournals = journals.filter((j) => {
      const jDate = new Date(j.date);
      return jDate.getFullYear() === targetDate.getFullYear() && jDate.getMonth() === targetDate.getMonth() && jDate.getDate() === targetDate.getDate();
    });
    const dayGoals = goals.filter((g) => {
      if (!g.deadline) return false;
      const gDate = new Date(g.deadline);
      return gDate.getFullYear() === targetDate.getFullYear() && gDate.getMonth() === targetDate.getMonth() && gDate.getDate() === targetDate.getDate();
    });
    return { dayJournals, dayGoals };
  };
  const getSelectedDayActivities = () => {
    if (!selectedDay) return { selectedJournals: [], selectedGoals: [] };
    const selectedJournals2 = journals.filter((j) => {
      const jDate = new Date(j.date);
      return jDate.getFullYear() === selectedDay.getFullYear() && jDate.getMonth() === selectedDay.getMonth() && jDate.getDate() === selectedDay.getDate();
    });
    const selectedGoals2 = goals.filter((g) => {
      if (!g.deadline) return false;
      const gDate = new Date(g.deadline);
      return gDate.getFullYear() === selectedDay.getFullYear() && gDate.getMonth() === selectedDay.getMonth() && gDate.getDate() === selectedDay.getDate();
    });
    return { selectedJournals: selectedJournals2, selectedGoals: selectedGoals2 };
  };
  const { selectedJournals, selectedGoals } = getSelectedDayActivities();
  const calendarCells = [];
  for (let i = 0; i < alignedFirstDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= totalDaysInMonth; i++) {
    calendarCells.push(i);
  }
  const getMoodEmoji = (moodStr) => {
    switch (moodStr.toLowerCase()) {
      case "productive":
        return "\u{1F680}";
      case "focused":
        return "\u{1F4BB}";
      case "happy":
        return "\u2600\uFE0F";
      case "tired":
        return "\u2615";
      case "stressed":
        return "\u{1F32A}\uFE0F";
      default:
        return "\u{1F4BB}";
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 text-theme-text", id: "calendar_view_root", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 flex flex-col space-y-4", id: "calendar_grid_pane", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", id: "calendar_month_picker", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CalendarIcon, { className: "w-5 h-5 text-theme-accent" }),
            /* @__PURE__ */ jsx("span", { children: "Workspace Calendar" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-theme-muted", children: "Review schedules, diary archives, and completed objectives" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", id: "nav_buttons", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              id: "calendar_prev_month",
              onClick: handlePrevMonth,
              className: "p-1.5 rounded-lg border border-theme-border bg-theme-card/30 hover:bg-theme-border cursor-pointer transition-all",
              children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-semibold uppercase tracking-wider px-2 shrink-0", children: [
            monthNames[month],
            " ",
            year
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              id: "calendar_next_month",
              onClick: handleNextMonth,
              className: "p-1.5 rounded-lg border border-theme-border bg-theme-card/30 hover:bg-theme-border cursor-pointer transition-all",
              children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-3 md:p-6", id: "calendar_table_wrapper", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] md:text-xs font-mono text-theme-muted uppercase tracking-wider border-b border-theme-border/40 pb-3", id: "weekday_headers", children: [
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Mon" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "M" }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Tue" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "T" }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Wed" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "W" }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Thu" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "T" }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Fri" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "F" }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Sat" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "S" }),
          /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Sun" }),
          /* @__PURE__ */ jsx("span", { className: "md:hidden", children: "S" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1 md:gap-2 mt-3", id: "calendar_cells_grid", children: calendarCells.map((day, idx) => {
          if (day === null) {
            return /* @__PURE__ */ jsx("div", { className: "h-12 md:h-20 bg-theme-bg/10 rounded-lg border border-transparent" }, `empty-${idx}`);
          }
          const { dayJournals, dayGoals } = getActivitiesForDate(day);
          const cellDate = new Date(year, month, day);
          const isToday = (/* @__PURE__ */ new Date()).toDateString() === cellDate.toDateString();
          const isSelected = selectedDay && selectedDay.toDateString() === cellDate.toDateString();
          return /* @__PURE__ */ jsxs(
            "div",
            {
              id: `calendar_cell_day_${day}`,
              onClick: () => setSelectedDay(cellDate),
              className: `h-12 md:h-20 p-1 md:p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between overflow-hidden relative group ${isSelected ? "bg-theme-accent/15 border-theme-accent box-glow" : isToday ? "bg-theme-card border-theme-accent/40 hover:border-theme-border" : "bg-theme-card/30 border-theme-border/60 hover:bg-theme-card/50 hover:border-theme-border"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: `text-[11px] font-mono font-semibold ${isToday ? "text-theme-accent font-bold" : "text-theme-text"}`, children: day }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 max-h-6 overflow-hidden", id: `indicators_day_${day}`, children: [
                  dayJournals.map((j) => /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-[10px] bg-theme-accent/10 text-theme-accent border border-theme-accent/10 px-1 rounded font-mono",
                      title: `Journal: ${j.title}`,
                      children: "\u{1F4BB}"
                    },
                    j._id
                  )),
                  dayGoals.map((g) => /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 px-1 rounded font-mono",
                      title: `Goal: ${g.title}`,
                      children: "\u{1F3AF}"
                    },
                    g._id
                  ))
                ] }),
                isToday && /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-theme-accent animate-ping" })
              ]
            },
            `day-${day}`
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 flex flex-col bg-theme-card/30 border border-theme-border rounded-xl p-5 min-h-[440px]", id: "calendar_activity_drawer", children: selectedDay ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full space-y-4", id: "drawer_contents", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 border-b border-theme-border pb-3", id: "drawer_header", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-theme-accent font-bold tracking-widest uppercase flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Activity, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsx("span", { children: "Daily Log Inspection" })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-theme-text font-display", children: selectedDay.toLocaleDateString(void 0, { weekday: "long", month: "short", day: "numeric", year: "numeric" }) })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "py-12 text-center", id: "drawer_loader", children: /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto" }) }) : selectedJournals.length === 0 && selectedGoals.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center py-10", id: "drawer_empty", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 text-theme-muted/30 mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted font-sans", children: "All quiet. No developer logs or task deadlines tracked on this day." })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto space-y-5", id: "drawer_activities_list", children: [
        selectedJournals.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", id: "drawer_journals_section", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-theme-muted uppercase tracking-wider block", children: "Logged Diaries" }),
          selectedJournals.map((j) => /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg border border-theme-border bg-theme-card/50 text-left", id: `drawer_journal_card_${j._id}`, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "text-base mt-0.5", children: getMoodEmoji(j.mood) }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-theme-text truncate leading-tight", children: j.title }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-mono text-theme-muted uppercase block mt-1", children: [
                "Mood: ",
                j.mood
              ] })
            ] })
          ] }) }, j._id))
        ] }),
        selectedGoals.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", id: "drawer_goals_section", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-theme-muted uppercase tracking-wider block", children: "Milestone Deadlines" }),
          selectedGoals.map((g) => /* @__PURE__ */ jsx("div", { className: "p-3 rounded-lg border border-theme-border bg-theme-card/50 text-left", id: `drawer_goal_card_${g._id}`, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-start", children: [
            /* @__PURE__ */ jsx("span", { className: "text-base mt-0.5", children: "\u{1F3AF}" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-theme-text leading-tight", children: g.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2 pt-1 border-t border-theme-border/40 text-[9px] font-mono", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-theme-muted uppercase", children: [
                  g.priority,
                  " priority"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: g.status === "completed" ? "text-emerald-400" : "text-theme-accent", children: [
                  g.progress,
                  "% done"
                ] })
              ] })
            ] })
          ] }) }, g._id))
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center p-4", id: "drawer_no_selection", children: [
      /* @__PURE__ */ jsx(Clock, { className: "w-10 h-10 text-theme-muted/30 mb-2" }),
      /* @__PURE__ */ jsx("h4", { className: "font-display text-sm font-semibold", children: "Inspector Locked" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted mt-1", children: "Click any cell day on the monthly grid to inspect daily commits, notes, or tasks." })
    ] }) })
  ] });
};
export {
  CalendarView
};
