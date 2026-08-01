import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { motion } from "motion/react";
import { analyticsService, goalService } from "../services/api";
import { DashboardStats, Goal } from "../types";

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  user: any;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  user,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayGoals, setTodayGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchDashboardData = async () => {
    try {
      const statsRes = await analyticsService.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.data);
      }

      const goalsRes = await goalService.getGoals({ type: "daily" });
      if (goalsRes.success) {
        // Show today's uncompleted daily goals
        setTodayGoals(goalsRes.data);
      }
    } catch (err: any) {
      console.error("Failed to load dashboard data:", err);
      setError("Could not retrieve active statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleGoal = async (goalId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "completed" ? "todo" : "completed";
      const res = await goalService.updateGoal(goalId, { status: newStatus });
      if (res.success) {
        // Refresh stats and local checklist
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to toggle goal:", err);
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-theme-text"
        id="dashboard_loader"
      >
        <div className="w-10 h-10 border-4 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-theme-muted tracking-wide animate-pulse">
          RECONCILING DEVELOPER METRICS...
        </p>
      </div>
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
    totalSnippets: 0,
  };

  // Color mappings for Recharts mood tracking
  const MOOD_COLORS = {
    Productive: "#47a248", // green
    Focused: "#61dafb", // cyan
    Happy: "#ec4899", // pink
    Tired: "#f59e0b", // orange
    Stressed: "#ef4444", // red
  };

  const moodData = stats?.moodDistribution.filter((m) => m.value > 0) || [];

  return (
    <div className="space-y-8 text-theme-text" id="dashboard_view_root">
      {/* 1. Welcome section */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-theme-accent/10 via-theme-card/35 to-theme-card/10 border border-theme-border overflow-hidden relative"
        id="dashboard_welcome"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-theme-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-theme-accent tracking-widest font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Workspace Active</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Welcome,{" "}
            <span className="text-glow">{user?.name || "Developer"}</span>
          </h1>
          <p className="text-sm text-theme-muted">
            {counters.currentStreak > 0
              ? `You are on an active learning streak of ${counters.currentStreak} day${counters.currentStreak > 1 ? "s" : ""}! Let's document today's session.`
              : "No active entries today yet. Set targets, program solutions, and log your thoughts!"}
          </p>
        </div>
        <div className="flex gap-2 shrink-0 z-10" id="welcome_actions">
          <button
            id="quick_journal_btn"
            onClick={() => setActiveTab("journal")}
            className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Today's Work</span>
          </button>
          <button
            id="quick_snippet_btn"
            onClick={() => setActiveTab("snippets")}
            className="bg-theme-card hover:bg-theme-border border border-theme-border text-theme-text text-xs font-semibold py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Add Snippet</span>
          </button>
        </div>
      </div>

      {/* 2. Key Counter Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        id="dashboard_metrics_grid"
      >
        {/* Streak card */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between"
          id="metric_streak"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-theme-muted tracking-wide uppercase">
              Active Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 animate-pulse">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl md:text-4xl font-display font-bold tracking-tight text-glow">
              {counters.currentStreak}
            </span>
            <span className="text-xs text-theme-muted font-mono block mt-1">
              Longest: {counters.longestStreak} days
            </span>
          </div>
        </div>

        {/* Journals card */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between"
          id="metric_journals"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-theme-muted tracking-wide uppercase">
              Logs Count
            </span>
            <div className="w-8 h-8 rounded-lg bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl md:text-4xl font-display font-bold tracking-tight text-glow">
              {counters.totalJournals}
            </span>
            <span className="text-xs text-theme-muted font-mono block mt-1">
              Total developer diaries
            </span>
          </div>
        </div>

        {/* Goals completed card */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between"
          id="metric_goals"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-theme-muted tracking-wide uppercase">
              Goal Target
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl md:text-4xl font-display font-bold tracking-tight text-glow">
              {counters.completionRate}%
            </span>
            <span className="text-xs text-theme-muted font-mono block mt-1">
              {counters.completedGoals}/{counters.totalGoals} objectives met
            </span>
          </div>
        </div>

        {/* Roadmap progress card */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between"
          id="metric_roadmaps"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono font-medium text-theme-muted tracking-wide uppercase">
              Curriculum
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl md:text-4xl font-display font-bold tracking-tight text-glow">
              {counters.averageRoadmapProgress}%
            </span>
            <span className="text-xs text-theme-muted font-mono block mt-1">
              {counters.totalRoadmaps} learning paths active
            </span>
          </div>
        </div>
      </div>

      {/* 3. Analytics Charts Section */}
      <div
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        id="dashboard_charts_row"
      >
        {/* Weekly intensity (2/5 width on desktop) */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col justify-between lg:col-span-2"
          id="chart_weekly_intensity"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <h3 className="font-display text-base font-semibold text-theme-text">
                Learning Intensity
              </h3>
              <p className="text-xs text-theme-muted">
                Weekly study session distributions and documentation logs count.
              </p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-theme-accent/80 inline-block"></span>
                <span className="text-theme-muted">Logs</span>
              </div>
            </div>
          </div>

          <div className="h-64" id="weekly_bar_chart_container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.weeklyDistribution || []}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <XAxis
                  dataKey="day"
                  stroke="var(--color-theme-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-theme-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-theme-card)",
                    borderColor: "var(--color-theme-border)",
                    color: "var(--color-theme-text)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="journals"
                  name="Journal Logs"
                  fill="var(--color-theme-accent)"
                  fillOpacity={0.8}
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution (3/5 width on desktop) */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col lg:col-span-3"
          id="chart_mood_distribution"
        >
          <div className="space-y-0.5 mb-4">
            <h3 className="font-display text-base font-semibold text-theme-text">
              Mental Sync
            </h3>
            <p className="text-xs text-theme-muted">
              Distribution of documented emotional & productivity triggers
            </p>
          </div>

          {moodData.length === 0 ? (
            <div
              className="flex-1 flex flex-col items-center justify-center text-center p-4"
              id="no_mood_data"
            >
              <MessageSquare className="w-8 h-8 text-theme-muted/40 mb-2" />
              <p className="text-xs text-theme-muted">
                No mental logs found. Start journaling to track mood
                correlations!
              </p>
            </div>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center"
              id="mood_pie_chart"
            >
              <div className="w-full h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {moodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            MOOD_COLORS[
                              entry.name as keyof typeof MOOD_COLORS
                            ] || "#6366f1"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-display font-bold text-glow">
                    {counters.totalJournals}
                  </span>
                  <span className="text-[10px] text-theme-muted font-mono tracking-wider uppercase">
                    Sessions
                  </span>
                </div>
              </div>

              {/* Legends */}
              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-6 text-xs font-sans w-full border-t border-theme-border/50 pt-4"
                id="mood_legends"
              >
                {moodData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block shrink-0 shadow-sm"
                      style={{
                        backgroundColor:
                          MOOD_COLORS[entry.name as keyof typeof MOOD_COLORS] ||
                          "#6366f1",
                      }}
                    ></span>
                    <span className="text-theme-muted font-medium truncate">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Row Checklist & Recent Activities */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        id="dashboard_details_row"
      >
        {/* Today's Daily Checklist */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col justify-between"
          id="today_goals_checklist"
        >
          <div className="space-y-0.5 mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-theme-text flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-theme-accent" />
                <span>Today's Daily Targets</span>
              </h3>
              <button
                onClick={() => setActiveTab("goals")}
                className="text-xs text-theme-accent hover:underline flex items-center gap-0.5 font-mono"
              >
                <span>View tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-theme-muted">
              Milestones and quick study targets to complete before logging off
            </p>
          </div>

          <div className="flex-1 space-y-3 min-h-[220px]" id="today_goals_list">
            {todayGoals.length === 0 ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-4"
                id="no_today_goals"
              >
                <Target className="w-8 h-8 text-theme-muted/40 mb-2" />
                <p className="text-xs text-theme-muted">
                  All clear! No pending daily goals today.
                </p>
                <button
                  onClick={() => setActiveTab("goals")}
                  className="mt-2 text-xs text-theme-accent hover:underline font-mono"
                >
                  Create one now +
                </button>
              </div>
            ) : (
              todayGoals.map((goal) => (
                <div
                  key={goal._id}
                  className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                    goal.status === "completed"
                      ? "bg-theme-bg/30 border-theme-border/50 opacity-60"
                      : "bg-theme-card border-theme-border/60 hover:border-theme-border"
                  }`}
                  id={`checklist_item_${goal._id}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      id={`checklist_toggle_${goal._id}`}
                      onClick={() => handleToggleGoal(goal._id, goal.status)}
                      className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                        goal.status === "completed"
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : "border-theme-muted hover:border-theme-accent"
                      }`}
                    >
                      {goal.status === "completed" && "✓"}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${goal.status === "completed" ? "line-through text-theme-muted" : "text-theme-text"}`}
                      >
                        {goal.title}
                      </p>
                      <p className="text-xs text-theme-muted truncate">
                        {goal.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      goal.priority === "high"
                        ? "bg-red-500/10 text-red-400 border border-red-500/10"
                        : goal.priority === "medium"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/10"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/10"
                    }`}
                  >
                    {goal.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div
          className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-6 flex flex-col"
          id="recent_activities_timeline"
        >
          <div className="space-y-0.5 mb-4">
            <h3 className="font-display text-base font-semibold text-theme-text flex items-center gap-2">
              <Terminal className="w-4 h-4 text-theme-accent animate-pulse" />
              <span>Workspace Logs</span>
            </h3>
            <p className="text-xs text-theme-muted">
              Audit trail of recent events, diary captures, and snippet
              registrations
            </p>
          </div>

          <div className="flex-1 space-y-4" id="activities_feed">
            {!stats || stats.recentActivities.length === 0 ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center p-4"
                id="no_activities"
              >
                <Clock className="w-8 h-8 text-theme-muted/40 mb-2" />
                <p className="text-xs text-theme-muted">
                  Workspace logs empty. Perform actions to seed the event
                  timeline.
                </p>
              </div>
            ) : (
              stats.recentActivities.map((act, i) => (
                <div
                  key={i}
                  className="flex gap-3 relative pb-1"
                  id={`timeline_item_${act.id}`}
                >
                  {/* Vertical lines connecting feed dots */}
                  {i < stats.recentActivities.length - 1 && (
                    <span className="absolute left-4 top-8 bottom-0 w-px bg-theme-border/60"></span>
                  )}

                  {/* Activity type dot */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      act.type === "journal"
                        ? "bg-theme-accent/10 border-theme-accent/20 text-theme-accent"
                        : act.type === "goal"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    }`}
                    id={`timeline_badge_${act.id}`}
                  >
                    {act.type === "journal" && (
                      <BookOpen className="w-3.5 h-3.5" />
                    )}
                    {act.type === "goal" && <Target className="w-3.5 h-3.5" />}
                    {act.type === "snippet" && (
                      <Code2 className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-medium text-theme-text leading-tight">
                      {act.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-theme-muted font-mono">
                      <span>
                        {new Date(act.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="bg-theme-bg/60 border border-theme-border/50 px-1.5 py-0.2 rounded uppercase text-[9px]">
                        {act.meta}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
