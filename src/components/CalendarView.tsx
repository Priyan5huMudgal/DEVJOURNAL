import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, 
  Target, Sparkles, BookOpen, Clock, Activity, AlertCircle
} from 'lucide-react';
import { journalService, goalService } from '../services/api';
import { JournalEntry, Goal } from '../types';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const journalRes = await journalService.getEntries();
      if (journalRes.success) setJournals(journalRes.data);

      const goalRes = await goalService.getGoals();
      if (goalRes.success) setGoals(goalRes.data);
    } catch (err) {
      console.error('Failed to load calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // Sun = 0
  // Align to Monday as start of the week: (firstDayIndex + 6) % 7
  const alignedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Check what activities match a specific calendar date
  const getActivitiesForDate = (dayNum: number) => {
    const targetDate = new Date(year, month, dayNum);
    
    const dayJournals = journals.filter(j => {
      const jDate = new Date(j.date);
      return jDate.getFullYear() === targetDate.getFullYear() &&
             jDate.getMonth() === targetDate.getMonth() &&
             jDate.getDate() === targetDate.getDate();
    });

    const dayGoals = goals.filter(g => {
      if (!g.deadline) return false;
      const gDate = new Date(g.deadline);
      return gDate.getFullYear() === targetDate.getFullYear() &&
             gDate.getMonth() === targetDate.getMonth() &&
             gDate.getDate() === targetDate.getDate();
    });

    return { dayJournals, dayGoals };
  };

  // Activities for the currently SELECTED date
  const getSelectedDayActivities = () => {
    if (!selectedDay) return { selectedJournals: [], selectedGoals: [] };

    const selectedJournals = journals.filter(j => {
      const jDate = new Date(j.date);
      return jDate.getFullYear() === selectedDay.getFullYear() &&
             jDate.getMonth() === selectedDay.getMonth() &&
             jDate.getDate() === selectedDay.getDate();
    });

    const selectedGoals = goals.filter(g => {
      if (!g.deadline) return false;
      const gDate = new Date(g.deadline);
      return gDate.getFullYear() === selectedDay.getFullYear() &&
             gDate.getMonth() === selectedDay.getMonth() &&
             gDate.getDate() === selectedDay.getDate();
    });

    return { selectedJournals, selectedGoals };
  };

  const { selectedJournals, selectedGoals } = getSelectedDayActivities();

  // Create array of days representing the calendar grid
  const calendarCells = [];
  // 1. Pad preceding empty slots
  for (let i = 0; i < alignedFirstDay; i++) {
    calendarCells.push(null);
  }
  // 2. Add actual month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    calendarCells.push(i);
  }

  const getMoodEmoji = (moodStr: string) => {
    switch (moodStr.toLowerCase()) {
      case 'productive': return '🚀';
      case 'focused': return '💻';
      case 'happy': return '☀️';
      case 'tired': return '☕';
      case 'stressed': return '🌪️';
      default: return '💻';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-theme-text" id="calendar_view_root">
      
      {/* LEFT COLUMN: Calendar Month Grid (7 cols) */}
      <div className="lg:col-span-8 flex flex-col space-y-4" id="calendar_grid_pane">
        <div className="flex items-center justify-between" id="calendar_month_picker">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-theme-accent" />
              <span>Workspace Calendar</span>
            </h2>
            <p className="text-[11px] text-theme-muted">Review schedules, diary archives, and completed objectives</p>
          </div>

          <div className="flex items-center gap-2" id="nav_buttons">
            <button
              id="calendar_prev_month"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-theme-border bg-theme-card/30 hover:bg-theme-border cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider px-2 shrink-0">
              {monthNames[month]} {year}
            </span>
            <button
              id="calendar_next_month"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-theme-border bg-theme-card/30 hover:bg-theme-border cursor-pointer transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Box wrapper */}
        <div className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-3 md:p-6" id="calendar_table_wrapper">
          {/* Weekdays header */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] md:text-xs font-mono text-theme-muted uppercase tracking-wider border-b border-theme-border/40 pb-3" id="weekday_headers">
            <span className="hidden md:inline">Mon</span><span className="md:hidden">M</span>
            <span className="hidden md:inline">Tue</span><span className="md:hidden">T</span>
            <span className="hidden md:inline">Wed</span><span className="md:hidden">W</span>
            <span className="hidden md:inline">Thu</span><span className="md:hidden">T</span>
            <span className="hidden md:inline">Fri</span><span className="md:hidden">F</span>
            <span className="hidden md:inline">Sat</span><span className="md:hidden">S</span>
            <span className="hidden md:inline">Sun</span><span className="md:hidden">S</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mt-3" id="calendar_cells_grid">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div key={`empty-${idx}`} className="h-12 md:h-20 bg-theme-bg/10 rounded-lg border border-transparent"></div>
                );
              }

              const { dayJournals, dayGoals } = getActivitiesForDate(day);
              const cellDate = new Date(year, month, day);
              const isToday = new Date().toDateString() === cellDate.toDateString();
              const isSelected = selectedDay && selectedDay.toDateString() === cellDate.toDateString();

              return (
                <div
                  key={`day-${day}`}
                  id={`calendar_cell_day_${day}`}
                  onClick={() => setSelectedDay(cellDate)}
                  className={`h-12 md:h-20 p-1 md:p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between overflow-hidden relative group ${
                    isSelected
                      ? 'bg-theme-accent/15 border-theme-accent box-glow'
                      : isToday
                        ? 'bg-theme-card border-theme-accent/40 hover:border-theme-border'
                        : 'bg-theme-card/30 border-theme-border/60 hover:bg-theme-card/50 hover:border-theme-border'
                  }`}
                >
                  {/* Day number */}
                  <span className={`text-[11px] font-mono font-semibold ${isToday ? 'text-theme-accent font-bold' : 'text-theme-text'}`}>
                    {day}
                  </span>

                  {/* Indicator icons stack */}
                  <div className="flex flex-wrap gap-1 max-h-6 overflow-hidden" id={`indicators_day_${day}`}>
                    {dayJournals.map(j => (
                      <span 
                        key={j._id} 
                        className="text-[10px] bg-theme-accent/10 text-theme-accent border border-theme-accent/10 px-1 rounded font-mono" 
                        title={`Journal: ${j.title}`}
                      >
                        💻
                      </span>
                    ))}
                    {dayGoals.map(g => (
                      <span 
                        key={g._id} 
                        className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 px-1 rounded font-mono" 
                        title={`Goal: ${g.title}`}
                      >
                        🎯
                      </span>
                    ))}
                  </div>

                  {/* Active dot elements */}
                  {isToday && (
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-theme-accent animate-ping"></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Daily schedules & journals detail drawer (4 cols) */}
      <div className="lg:col-span-4 flex flex-col bg-theme-card/30 border border-theme-border rounded-xl p-5 min-h-[440px]" id="calendar_activity_drawer">
        {selectedDay ? (
          <div className="flex flex-col h-full space-y-4" id="drawer_contents">
            <div className="space-y-1 border-b border-theme-border pb-3" id="drawer_header">
              <span className="text-[10px] font-mono text-theme-accent font-bold tracking-widest uppercase flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Daily Log Inspection</span>
              </span>
              <h3 className="text-sm font-semibold text-theme-text font-display">
                {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>

            {loading ? (
              <div className="py-12 text-center" id="drawer_loader">
                <div className="w-5 h-5 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : selectedJournals.length === 0 && selectedGoals.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10" id="drawer_empty">
                <AlertCircle className="w-8 h-8 text-theme-muted/30 mb-2" />
                <p className="text-xs text-theme-muted font-sans">All quiet. No developer logs or task deadlines tracked on this day.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-5" id="drawer_activities_list">
                {/* 1. Daily Journals */}
                {selectedJournals.length > 0 && (
                  <div className="space-y-2.5" id="drawer_journals_section">
                    <span className="text-[10px] font-mono text-theme-muted uppercase tracking-wider block">Logged Diaries</span>
                    {selectedJournals.map(j => (
                      <div key={j._id} className="p-3 rounded-lg border border-theme-border bg-theme-card/50 text-left" id={`drawer_journal_card_${j._id}`}>
                        <div className="flex gap-2 items-start">
                          <span className="text-base mt-0.5">{getMoodEmoji(j.mood)}</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-theme-text truncate leading-tight">{j.title}</h4>
                            <span className="text-[9px] font-mono text-theme-muted uppercase block mt-1">Mood: {j.mood}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Deadlines */}
                {selectedGoals.length > 0 && (
                  <div className="space-y-2.5" id="drawer_goals_section">
                    <span className="text-[10px] font-mono text-theme-muted uppercase tracking-wider block">Milestone Deadlines</span>
                    {selectedGoals.map(g => (
                      <div key={g._id} className="p-3 rounded-lg border border-theme-border bg-theme-card/50 text-left" id={`drawer_goal_card_${g._id}`}>
                        <div className="flex gap-2 items-start">
                          <span className="text-base mt-0.5">🎯</span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-theme-text leading-tight">{g.title}</h4>
                            <div className="flex justify-between items-center mt-2 pt-1 border-t border-theme-border/40 text-[9px] font-mono">
                              <span className="text-theme-muted uppercase">{g.priority} priority</span>
                              <span className={g.status === 'completed' ? 'text-emerald-400' : 'text-theme-accent'}>{g.progress}% done</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4" id="drawer_no_selection">
            <Clock className="w-10 h-10 text-theme-muted/30 mb-2" />
            <h4 className="font-display text-sm font-semibold">Inspector Locked</h4>
            <p className="text-xs text-theme-muted mt-1">Click any cell day on the monthly grid to inspect daily commits, notes, or tasks.</p>
          </div>
        )}
      </div>

    </div>
  );
};
