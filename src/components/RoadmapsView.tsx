import React, { useState, useEffect } from 'react';
import { 
  Compass, Plus, Calendar, Trash2, Edit3, CheckCircle2, 
  Circle, ChevronDown, ChevronUp, Sparkles, X, PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { roadmapService } from '../services/api';
import { Roadmap, RoadmapTopic } from '../types';

export const RoadmapsView: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Creator state
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState<string[]>(['']);
  const [estimatedCompletion, setEstimatedCompletion] = useState('');

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await roadmapService.getRoadmaps();
      if (res.success) {
        setRoadmaps(res.data);
        if (res.data.length > 0 && !expandedId) {
          setExpandedId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Roadmap title is required.');
      return;
    }

    const filteredTopics = topics
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map((name, index) => ({
        name,
        status: 'todo',
        order: index + 1
      }));

    if (filteredTopics.length === 0) {
      alert('Please add at least one roadmap topic.');
      return;
    }

    try {
      const res = await roadmapService.createRoadmap({
        title,
        topics: filteredTopics,
        estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : undefined
      });

      if (res.success) {
        fetchRoadmaps();
        resetForm();
      }
    } catch (err) {
      console.error('Failed to create roadmap:', err);
    }
  };

  const handleTopicCheck = async (roadmapId: string, topicIndex: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    try {
      const res = await roadmapService.updateTopicStatus(roadmapId, topicIndex, newStatus);
      if (res.success) {
        // Optimistically update local state to avoid full re-fetch flicker
        setRoadmaps(prev => prev.map(r => r._id === roadmapId ? res.data : r));
      }
    } catch (err) {
      console.error('Failed to update topic status:', err);
    }
  };

  const handleDelete = async (roadmapId: string) => {
    try {
      const res = await roadmapService.deleteRoadmap(roadmapId);
      if (res.success) {
        setExpandedId(null);
        fetchRoadmaps();
      }
    } catch (err) {
      console.error('Failed to delete roadmap:', err);
    }
  };

  const addTopicInputField = () => {
    setTopics(prev => [...prev, '']);
  };

  const updateTopicInputField = (idx: number, val: string) => {
    setTopics(prev => {
      const updated = [...prev];
      updated[idx] = val;
      return updated;
    });
  };

  const removeTopicInputField = (idx: number) => {
    if (topics.length === 1) return;
    setTopics(prev => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setTitle('');
    setTopics(['']);
    setEstimatedCompletion('');
    setShowCreate(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-theme-text" id="roadmaps_view_root">
      
      {/* LEFT COLUMN: Active roadmaps list (5 cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-4" id="roadmaps_sidebar">
        <div className="flex justify-between items-center" id="roadmaps_sidebar_header">
          <div className="space-y-0.5">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Compass className="w-5 h-5 text-theme-accent" />
              <span>Learning Paths</span>
            </h2>
            <p className="text-[11px] text-theme-muted">Custom curriculum outlines and syllabus tracking</p>
          </div>
          
          <button
            id="toggle_roadmap_creator_btn"
            onClick={() => {
              if (showCreate) resetForm();
              else setShowCreate(true);
            }}
            className="p-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center cursor-pointer transition-all box-glow"
          >
            {showCreate ? <X className="w-4.5 h-4.5" /> : <Plus className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Create Form inline card */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-theme-card border border-theme-border rounded-xl p-4 space-y-3"
            id="roadmap_creator_panel"
          >
            <div className="flex items-center gap-1 text-[10px] font-mono text-theme-accent font-semibold tracking-wider uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Compose Learning Roadmap</span>
            </div>

            <form onSubmit={handleCreateRoadmap} className="space-y-3" id="roadmap_form">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-theme-muted uppercase">Curriculum Title</label>
                <input
                  id="roadmap_title_input"
                  type="text"
                  required
                  placeholder="e.g. Advanced System Design, LeetCode Trees..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent"
                />
              </div>

              {/* Topics stack inputs */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono text-theme-muted uppercase">Syllabus Topics</label>
                  <button
                    type="button"
                    onClick={addTopicInputField}
                    className="text-[10px] font-mono text-theme-accent hover:underline flex items-center gap-0.5 bg-transparent"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1" id="topic_inputs_list">
                  {topics.map((topic, index) => (
                    <div key={index} className="flex gap-1.5">
                      <input
                        id={`topic_input_${index}`}
                        type="text"
                        required
                        placeholder={`Topic #${index + 1}`}
                        value={topic}
                        onChange={(e) => updateTopicInputField(index, e.target.value)}
                        className="flex-1 bg-theme-bg border border-theme-border rounded-md px-2.5 py-1 text-xs text-theme-text placeholder-theme-muted/30 focus:outline-none"
                      />
                      {topics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTopicInputField(index)}
                          className="p-1 text-theme-muted hover:text-red-400 border border-theme-border rounded bg-theme-bg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-theme-muted uppercase">Target Date</label>
                <input
                  id="roadmap_deadline_input"
                  type="date"
                  value={estimatedCompletion}
                  onChange={(e) => setEstimatedCompletion(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-2.5 py-1 text-[10px] border border-theme-border text-theme-muted rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  id="roadmap_submit_btn"
                  type="submit"
                  className="px-3.5 py-1 bg-theme-accent hover:bg-theme-accent-hover text-white text-[10px] font-semibold rounded box-glow"
                >
                  Save Roadmap
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Scrollable List of existing Roadmaps */}
        <div className="space-y-3 overflow-y-auto flex-1 pr-1" id="roadmaps_list_cards">
          {loading ? (
            <div className="py-12 text-center" id="roadmaps_sidebar_loader">
              <div className="w-5 h-5 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto"></div>
              <p className="text-[10px] text-theme-muted font-mono mt-2 animate-pulse">RECONCILING SYLLABI...</p>
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="py-12 border border-dashed border-theme-border rounded-xl text-center p-6 bg-theme-card/15" id="roadmaps_sidebar_empty">
              <Compass className="w-8 h-8 text-theme-muted/40 mx-auto mb-2" />
              <p className="text-xs text-theme-muted">No active curricula. Plan your first roadmap today!</p>
              <button onClick={() => setShowCreate(true)} className="mt-2 text-xs text-theme-accent hover:underline font-mono">
                Add learning path +
              </button>
            </div>
          ) : (
            roadmaps.map((r) => {
              const isSelected = expandedId === r._id;
              const completedCount = r.topics.filter(t => t.status === 'completed').length;
              return (
                <div
                  key={r._id}
                  id={`roadmap_card_${r._id}`}
                  onClick={() => setExpandedId(r._id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-theme-accent/15 border-theme-accent/70 shadow-sm box-glow'
                      : 'bg-theme-card/30 border-theme-border hover:border-theme-border/80'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-theme-text leading-tight truncate">
                        {r.title}
                      </h4>
                      <p className="text-[10px] font-mono text-theme-muted mt-1">
                        Syllabus Status: {completedCount}/{r.topics.length} steps completed
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-theme-accent shrink-0">
                      {r.progressPercentage}%
                    </span>
                  </div>

                  {/* Micro Progress bar */}
                  <div className="w-full h-1 bg-theme-bg rounded-full overflow-hidden mt-3 border border-theme-border/30">
                    <div 
                      className="h-full bg-theme-accent transition-all duration-300" 
                      style={{ width: `${r.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Roadmap topic syllabus grid (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-theme-card/30 border border-theme-border rounded-xl min-h-[440px]" id="roadmaps_active_details">
        {(() => {
          const activeRoadmap = roadmaps.find(r => r._id === expandedId);
          if (!activeRoadmap) {
            return (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8" id="roadmap_blank_pane">
                <Compass className="w-10 h-10 text-theme-muted/30 mb-2" />
                <h3 className="font-display text-sm font-semibold">Select Syllabus Outline</h3>
                <p className="text-xs text-theme-muted max-w-sm mt-1">
                  Click any curriculum pathway on the sidebar to review detailed checkbox structures, progress rollups, and estimated completions.
                </p>
              </div>
            );
          }

          return (
            <div className="flex flex-col h-full" id="roadmap_details_workspace">
              {/* Active Header Action bar */}
              <div className="border-b border-theme-border px-6 py-4 bg-theme-card/50 flex justify-between items-center" id="roadmap_details_header">
                <div className="space-y-1 flex-1 min-w-0">
                  <h1 className="font-display text-base font-semibold tracking-tight text-theme-text leading-tight truncate">
                    {activeRoadmap.title}
                  </h1>
                  <span className="text-[10px] font-mono text-theme-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Estimated Completion: {activeRoadmap.estimatedCompletion ? new Date(activeRoadmap.estimatedCompletion).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'No set timeline'}</span>
                  </span>
                </div>

                <button
                  id={`roadmap_active_delete_${activeRoadmap._id}`}
                  onClick={() => handleDelete(activeRoadmap._id)}
                  className="p-1.5 rounded-lg border border-theme-border hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-theme-muted cursor-pointer transition-all"
                  title="Delete Syllabus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Panel */}
              <div className="p-6 bg-theme-accent/5 border-b border-theme-border/60 flex items-center justify-between gap-6" id="roadmap_progress_box">
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-mono text-theme-muted uppercase">Curriculum Coverage</span>
                  <div className="w-full h-2 bg-theme-bg border border-theme-border/60 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-theme-accent transition-all duration-300" 
                      style={{ width: `${activeRoadmap.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center shrink-0" id="progress_percentage_circle">
                  <span className="text-3xl font-display font-bold text-glow">{activeRoadmap.progressPercentage}%</span>
                  <p className="text-[9px] font-mono text-theme-muted uppercase tracking-wider">coverage</p>
                </div>
              </div>

              {/* Syllabus Checkbox grid list */}
              <div className="flex-1 p-6 overflow-y-auto space-y-3" id="roadmap_topic_items_list">
                <h3 className="text-xs font-mono text-theme-muted uppercase tracking-wider mb-2">Checklist Milestones</h3>
                
                {activeRoadmap.topics.map((topic, idx) => {
                  const isChecked = topic.status === 'completed';
                  return (
                    <div
                      key={idx}
                      id={`topic_checklist_row_${idx}`}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-theme-bg/30 border-theme-border/50 opacity-60'
                          : 'bg-theme-card/60 border-theme-border/70 hover:border-theme-border'
                      }`}
                    >
                      <button
                        id={`topic_checklist_btn_${idx}`}
                        onClick={() => handleTopicCheck(activeRoadmap._id, idx, topic.status)}
                        className={`mt-0.5 shrink-0 transition-all cursor-pointer ${
                          isChecked ? 'text-emerald-500' : 'text-theme-muted hover:text-theme-accent'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-theme-muted block uppercase">Topic #{idx + 1}</span>
                        <p className={`text-sm font-medium leading-tight mt-0.5 ${isChecked ? 'line-through text-theme-muted' : 'text-theme-text'}`}>
                          {topic.name}
                        </p>
                      </div>

                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 ${
                        isChecked
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/10'
                          : 'bg-theme-bg text-theme-muted border-theme-border'
                      }`}>
                        {topic.status}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })()}
      </div>

    </div>
  );
};
