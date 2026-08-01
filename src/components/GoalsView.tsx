import React, { useState, useEffect } from 'react';
import { 
  Target, Plus, Calendar, Flame, Trash2, Edit3, CheckSquare, 
  Clock, AlertTriangle, Play, Sparkles, Filter, X
} from 'lucide-react';
import { motion } from 'motion/react';
import { goalService } from '../services/api';
import { Goal } from '../types';

export const GoalsView: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Form / Creation Drawer state
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Goal Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [progress, setProgress] = useState(0);
  const [deadline, setDeadline] = useState('');

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals({
        type: activeTab,
        status: statusFilter || undefined
      });
      if (res.success) {
        setGoals(res.data);
      }
    } catch (err) {
      console.error('Failed to retrieve goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [activeTab, statusFilter]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Goal Title is required.');
      return;
    }

    const payload = {
      title,
      description,
      type: activeTab,
      priority,
      deadline: deadline ? new Date(deadline) : undefined,
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
      console.error('Failed to save goal:', err);
    }
  };

  const handleEditClick = (goal: Goal) => {
    setEditingId(goal._id);
    setTitle(goal.title);
    setDescription(goal.description);
    setPriority(goal.priority);
    setProgress(goal.progress);
    setDeadline(goal.deadline ? goal.deadline.split('T')[0] : '');
    setShowCreate(true);
  };

  const handleDelete = async (goalId: string) => {
    try {
      const res = await goalService.deleteGoal(goalId);
      if (res.success) {
        fetchGoals();
      }
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const handleQuickAdvance = async (goalId: string, currentProgress: number) => {
    const nextProgress = Math.min(currentProgress + 25, 100);
    try {
      const res = await goalService.updateGoal(goalId, { progress: nextProgress });
      if (res.success) {
        fetchGoals();
      }
    } catch (err) {
      console.error('Failed to quick-advance goal:', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setProgress(0);
    setDeadline('');
    setShowCreate(false);
  };

  return (
    <div className="space-y-6 text-theme-text" id="goals_view_root">
      
      {/* View Header with creation toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="goals_header">
        <div className="space-y-0.5">
          <h2 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
            <Target className="w-5.5 h-5.5 text-theme-accent" />
            <span>Milestones Tracker</span>
          </h2>
          <p className="text-xs text-theme-muted">Manage structured daily tasks, weekly commits, and monthly career development targets</p>
        </div>
        
        <button
          id="toggle_goal_form_btn"
          onClick={() => {
            if (showCreate) resetForm();
            else setShowCreate(true);
          }}
          className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto box-glow"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showCreate ? 'Close Editor' : 'New Goal Target'}</span>
        </button>
      </div>

      {/* Creation / Editing Panel */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-card border border-theme-border rounded-xl p-5"
          id="goal_form_panel"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-theme-accent tracking-wider font-mono uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{editingId ? 'Edit Goal Milestone' : `Add ${activeTab} Objective`}</span>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-12 gap-4" id="goal_form">
            <div className="md:col-span-6 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Goal Title</label>
                <input
                  id="goal_title_input"
                  type="text"
                  required
                  placeholder="e.g. Solve 5 dynamic programming graphs, finish auth server..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Description / Checklist details</label>
                <textarea
                  id="goal_desc_input"
                  placeholder="Describe key outcomes, repositories to review, or criteria for success..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg p-3 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent resize-none"
                ></textarea>
              </div>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4 col-span-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-theme-muted uppercase">
                    <span>Active Progress</span>
                    <span className="text-theme-accent font-semibold">{progress}%</span>
                  </div>
                  <input
                    id="goal_progress_slider"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-1.5 bg-theme-bg border border-theme-border rounded-lg appearance-none cursor-pointer accent-theme-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Priority</label>
                <select
                  id="goal_priority_select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-sans"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Deadline Target</label>
                <input
                  id="goal_deadline_input"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-sans"
                />
              </div>

              {/* Action buttons */}
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-lg border border-theme-border text-xs text-theme-muted hover:bg-theme-bg font-medium cursor-pointer"
                >
                  Reset
                </button>
                <button
                  id="goal_submit_btn"
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold cursor-pointer box-glow"
                >
                  {editingId ? 'Apply Changes' : 'Create Milestone'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main filter controllers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-theme-border pb-1 gap-3" id="goals_filters">
        {/* Goal Type tabs */}
        <div className="flex gap-1" id="goals_tabs_container">
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              id={`tab_goals_${tab}`}
              onClick={() => {
                setActiveTab(tab);
                resetForm();
              }}
              className={`px-4 py-2 text-xs font-semibold capitalize border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-theme-accent text-theme-accent'
                  : 'border-transparent text-theme-muted hover:text-theme-text'
              }`}
            >
              {tab} Targets
            </button>
          ))}
        </div>

        {/* Status Filter select */}
        <div className="flex items-center gap-2 text-xs shrink-0" id="goals_status_filter">
          <Filter className="w-3.5 h-3.5 text-theme-muted" />
          <span className="text-theme-muted font-mono uppercase text-[10px]">Status:</span>
          <select
            id="goals_status_select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-theme-card border border-theme-border rounded-lg px-2.5 py-1 text-xs text-theme-text focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Grid List representation */}
      {loading ? (
        <div className="py-20 text-center" id="goals_loader">
          <div className="w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] text-theme-muted font-mono mt-2 animate-pulse">LOADING MILESTONES...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="py-16 border border-dashed border-theme-border rounded-xl text-center p-8 bg-theme-card/15" id="goals_empty">
          <Target className="w-10 h-10 text-theme-muted/30 mx-auto mb-2" />
          <h3 className="font-display text-sm font-semibold">No Goals Found</h3>
          <p className="text-xs text-theme-muted mt-1 max-w-sm mx-auto">
            Create structured goals to lock in milestones, track study sessions, and review analytics streaks!
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-3 px-4 py-1.5 rounded-lg border border-theme-accent/40 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent text-xs font-mono cursor-pointer transition-all"
          >
            Create first {activeTab} target +
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="goals_cards_grid">
          {goals.map((goal) => {
            const isCompleted = goal.status === 'completed';
            return (
              <div
                key={goal._id}
                id={`goal_card_${goal._id}`}
                className={`bg-theme-card/50 glass-effect border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-theme-border/80 ${
                  isCompleted ? 'border-emerald-500/10 opacity-75' : 'border-theme-border'
                }`}
              >
                {/* Header row */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                      goal.priority === 'high'
                        ? 'bg-red-500/10 text-red-400 border-red-500/10'
                        : goal.priority === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/10'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/10'
                    }`}>
                      {goal.priority} priority
                    </span>

                    <div className="flex gap-1">
                      <button
                        id={`goal_edit_${goal._id}`}
                        onClick={() => handleEditClick(goal)}
                        className="p-1 rounded hover:bg-theme-border text-theme-muted hover:text-theme-text transition-all cursor-pointer"
                        title="Edit Goal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`goal_delete_${goal._id}`}
                        onClick={() => handleDelete(goal._id)}
                        className="p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-all cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`font-display text-sm font-semibold tracking-tight leading-tight mt-1 ${isCompleted ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                    {goal.title}
                  </h3>
                  <p className="text-xs text-theme-muted line-clamp-2 min-h-[32px]">
                    {goal.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress bar and controls */}
                <div className="mt-4 pt-4 border-t border-theme-border/50 space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-theme-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {goal.deadline 
                          ? new Date(goal.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                          : 'No Deadline'}
                      </span>
                    </span>
                    <span className={isCompleted ? 'text-emerald-500 font-semibold' : 'text-theme-accent font-semibold'}>
                      {goal.progress}% Done
                    </span>
                  </div>

                  {/* Visual bar container */}
                  <div className="w-full h-1.5 bg-theme-bg border border-theme-border/60 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-theme-accent'}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>

                  {/* Actions Row */}
                  {!isCompleted && (
                    <div className="flex justify-end pt-1">
                      <button
                        id={`goal_quick_advance_${goal._id}`}
                        onClick={() => handleQuickAdvance(goal._id, goal.progress)}
                        className="text-[10px] font-mono border border-theme-border/80 bg-theme-bg/60 hover:bg-theme-border text-theme-text py-1 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-2.5 h-2.5 text-theme-accent animate-pulse" />
                        <span>Advance +25%</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
