import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Plus, Search, Calendar, Tag, Trash2, Edit3, X, Save, 
  Eye, HelpCircle, Code, FileText, ChevronLeft, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { journalService } from '../services/api';
import { JournalEntry } from '../types';

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('focused');
  const [tagsInput, setTagsInput] = useState('');
  const [snippetLanguage, setSnippetLanguage] = useState('typescript');
  const [snippetCode, setSnippetCode] = useState('');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [imageInput, setImageInput] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await journalService.getEntries({
        search,
        tag: tagFilter,
        mood: moodFilter,
        sort
      });
      if (res.success) {
        setEntries(res.data);
        // Automatically select first entry if nothing is selected and list has data
        if (res.data.length > 0 && !selectedEntry) {
          setSelectedEntry(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [search, tagFilter, moodFilter, sort]);

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsEditing(false);
  };

  const handleCreateNewClick = () => {
    setSelectedEntry(null);
    setIsEditing(true);
    
    // Reset Form state
    setTitle('');
    setContent(`### Today's Focus & Goals
- [ ] 

### Core Accomplishments
- 

### Challenges & Blockers
- 

### Key Learnings
- `);
    setMood('focused');
    setTagsInput('');
    setSnippetLanguage('typescript');
    setSnippetCode('');
    setSnippetTitle('');
    setImageInput('');
  };

  const handleEditClick = () => {
    if (!selectedEntry) return;
    setIsEditing(true);
    
    setTitle(selectedEntry.title);
    setContent(selectedEntry.content);
    setMood(selectedEntry.mood);
    setTagsInput(selectedEntry.tags.join(', '));
    if (selectedEntry.codeSnippets && selectedEntry.codeSnippets.length > 0) {
      setSnippetLanguage(selectedEntry.codeSnippets[0].language);
      setSnippetCode(selectedEntry.codeSnippets[0].code);
      setSnippetTitle(selectedEntry.codeSnippets[0].title || '');
    } else {
      setSnippetLanguage('typescript');
      setSnippetCode('');
      setSnippetTitle('');
    }
    setImageInput(selectedEntry.images && selectedEntry.images.length > 0 ? selectedEntry.images[0] : '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in both Title and Content fields.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const codeSnippets = snippetCode ? [{
      language: snippetLanguage,
      code: snippetCode,
      title: snippetTitle || 'Attached Snippet'
    }] : [];

    const images = imageInput ? [imageInput] : [];

    const payload = {
      title,
      content,
      mood,
      tags: tagsArray,
      images,
      codeSnippets,
      date: selectedEntry && !isEditing ? selectedEntry.date : new Date()
    };

    try {
      if (selectedEntry?._id) {
        // Edit Mode
        const res = await journalService.updateEntry(selectedEntry._id, payload);
        if (res.success) {
          setIsEditing(false);
          setSelectedEntry(res.data);
          fetchEntries();
        }
      } else {
        // Create Mode
        const res = await journalService.createEntry(payload);
        if (res.success) {
          setIsEditing(false);
          setSelectedEntry(res.data);
          fetchEntries();
        }
      }
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      const res = await journalService.deleteEntry(entryId);
      if (res.success) {
        setSelectedEntry(null);
        setIsEditing(false);
        fetchEntries();
      }
    } catch (err) {
      console.error('Failed to delete journal entry:', err);
    }
  };

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-theme-text h-[calc(100vh-140px)]" id="journal_view_root">

      
      {/* LEFT COLUMN: Entry List & Search Filters (5 cols) */}
      <div className={`lg:col-span-4 flex flex-col space-y-4 h-full ${selectedEntry && !isEditing ? 'hidden lg:flex' : 'flex'}`} id="journal_sidebar">
        {/* Header with quick creation button */}
        <div className="flex items-center justify-between" id="sidebar_header">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-theme-accent" />
            <span>Developer Diaries</span>
          </h2>
          <button
            id="create_new_journal_btn"
            onClick={handleCreateNewClick}
            className="p-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center cursor-pointer transition-all box-glow"
          >
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-theme-card/40 border border-theme-border rounded-xl p-4 space-y-3" id="filters_panel">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-theme-muted">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="journal_search"
              type="text"
              placeholder="Search journals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-9 pr-4 py-2 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-2" id="filter_selectors">
            {/* Tag Filter */}
            <select
              id="tag_filter_select"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-theme-bg/60 border border-theme-border rounded-lg px-2 py-1.5 text-[11px] text-theme-text focus:outline-none focus:border-theme-accent"
            >
              <option value="">All Tags</option>
              <option value="Engineering">Engineering</option>
              <option value="TypeScript">TypeScript</option>
              <option value="UI-Design">UI-Design</option>
              <option value="NodeJS">NodeJS</option>
              <option value="Architecture">Architecture</option>
            </select>

            {/* Mood Filter */}
            <select
              id="mood_filter_select"
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="bg-theme-bg/60 border border-theme-border rounded-lg px-2 py-1.5 text-[11px] text-theme-text focus:outline-none focus:border-theme-accent"
            >
              <option value="">All Moods</option>
              <option value="focused">💻 Focused</option>
              <option value="productive">🚀 Productive</option>
              <option value="happy">☀️ Happy</option>
              <option value="tired">☕ Tired</option>
              <option value="stressed">🌪️ Stressed</option>
            </select>
          </div>
        </div>

        {/* Scrollable list of entries */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1" id="journal_entry_cards_list">
          {loading ? (
            <div className="py-12 text-center" id="cards_loader">
              <div className="w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto"></div>
              <p className="text-[11px] text-theme-muted mt-2 font-mono">LOADING LOGS...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 border border-dashed border-theme-border rounded-xl text-center p-6 bg-theme-card/15" id="cards_empty">
              <FileText className="w-8 h-8 text-theme-muted/40 mx-auto mb-2" />
              <p className="text-xs text-theme-muted">No diaries fit your active filter settings.</p>
              <button onClick={handleCreateNewClick} className="mt-2 text-xs text-theme-accent hover:underline font-mono">
                Log today's work +
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry._id}
                id={`entry_card_${entry._id}`}
                onClick={() => handleSelectEntry(entry)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedEntry?._id === entry._id
                    ? 'bg-theme-accent/10 border-theme-accent/70 shadow-sm box-glow'
                    : 'bg-theme-card/30 border-theme-border hover:border-theme-border/80 hover:bg-theme-card/50'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-lg shrink-0">{getMoodEmoji(entry.mood)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-theme-text truncate leading-snug">
                      {entry.title}
                    </h4>
                    <span className="text-[10px] font-mono text-theme-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>
                  </div>
                </div>

                {/* Tags array preview */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {entry.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono bg-theme-bg/80 border border-theme-border/50 text-theme-muted px-1.5 py-0.2 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active workspace reader/writer (7 cols) */}
      <div className={`lg:col-span-8 flex flex-col h-full bg-theme-card/30 border border-theme-border rounded-xl overflow-hidden ${!selectedEntry && !isEditing ? 'hidden lg:flex' : 'flex'}`} id="journal_active_panel">
        
        {isEditing ? (
          /* ================== WRITING EDITOR MODE ================== */
          <form onSubmit={handleSave} className="flex flex-col h-full overflow-hidden" id="journal_write_form">
            {/* Editor Action Header */}
            <div className="border-b border-theme-border px-6 py-4 bg-theme-card/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded hover:bg-theme-border text-theme-muted lg:hidden"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-theme-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedEntry?._id ? 'Editing Existing Diary' : 'Logging New Session'}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="editor_cancel_btn"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-theme-border hover:bg-theme-border text-xs font-medium cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  id="editor_save_btn"
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-md box-glow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Log</span>
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-5" id="editor_scroll_pane">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-theme-muted uppercase tracking-wider block">Session Title</label>
                <input
                  id="editor_title_input"
                  type="text"
                  required
                  placeholder="e.g. Completed advanced redux middleware pipeline and debugged CORS headers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-bg/60 border border-theme-border rounded-lg px-4 py-2.5 text-sm text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all font-semibold"
                />
              </div>

              {/* Mood and Tags Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mood selector emoticons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-theme-muted uppercase tracking-wider block">Today's Mental State</label>
                  <div className="flex flex-wrap gap-2" id="mood_selector_box">
                    {['focused', 'productive', 'happy', 'tired', 'stressed'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(m)}
                        className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all capitalize cursor-pointer ${
                          mood === m
                            ? 'bg-theme-accent/15 border-theme-accent text-theme-accent font-semibold'
                            : 'bg-theme-bg/40 border-theme-border text-theme-muted hover:border-theme-border/80'
                        }`}
                        id={`mood_button_${m}`}
                      >
                        <span className="text-lg">{getMoodEmoji(m)}</span>
                        <span className="text-[9px] font-mono tracking-tighter">{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-theme-muted uppercase tracking-wider block">Category Tags (comma separated)</label>
                  <input
                    id="editor_tags_input"
                    type="text"
                    placeholder="e.g. Engineering, TypeScript, React"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-theme-bg/60 border border-theme-border rounded-lg px-4 py-2.5 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all"
                  />
                </div>
              </div>

              {/* Markdown Content text area */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-theme-muted uppercase tracking-wider block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-theme-accent" />
                    <span>Daily Journal Thoughts (Markdown Supported)</span>
                  </label>
                  <span className="text-[10px] font-mono text-theme-muted italic"># h1, ## h2, - list, [ ] task, **bold**</span>
                </div>
                <textarea
                  id="editor_content_textarea"
                  required
                  placeholder="Record what you spent your hours coding today, technical architecture summaries, challenges faced, or personal developer milestones..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-theme-bg/60 border border-theme-border rounded-lg p-4 text-xs font-sans text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all leading-relaxed resize-y min-h-[160px]"
                ></textarea>
              </div>

              {/* Embedded Code Snippet helper panel */}
              <div className="border border-theme-border rounded-xl p-5 bg-theme-bg/40 space-y-4" id="editor_embed_snippet_box">
                <div className="flex items-center gap-2 border-b border-theme-border/50 pb-2">
                  <Code className="w-4 h-4 text-theme-accent" />
                  <span className="text-xs font-mono font-semibold">Embed Source Code Block (Optional)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-theme-muted">Snippet Title</label>
                    <input
                      id="embed_snippet_title"
                      type="text"
                      placeholder="e.g. express middleware payload validator"
                      value={snippetTitle}
                      onChange={(e) => setSnippetTitle(e.target.value)}
                      className="w-full bg-theme-bg/80 border border-theme-border rounded-md px-3 py-1.5 text-xs text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-theme-muted">Coding Language</label>
                    <select
                      id="embed_snippet_language"
                      value={snippetLanguage}
                      onChange={(e) => setSnippetLanguage(e.target.value)}
                      className="w-full bg-theme-bg/80 border border-theme-border rounded-md px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-mono"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="css">CSS</option>
                      <option value="html">HTML</option>
                      <option value="sql">SQL / MongoDB</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-theme-muted">Paste Code Snippet</label>
                  <textarea
                    id="embed_snippet_code"
                    placeholder="// paste your code snippets directly here..."
                    rows={4}
                    value={snippetCode}
                    onChange={(e) => setSnippetCode(e.target.value)}
                    className="w-full bg-theme-bg/80 border border-theme-border rounded-md p-3 text-xs font-mono text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent resize-y"
                  ></textarea>
                </div>
              </div>

              {/* Image attachment placeholder input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-theme-muted uppercase tracking-wider block">Attach Screen Capture Image (URL)</label>
                <input
                  id="editor_image_input"
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/... or cloud link"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="w-full bg-theme-bg/60 border border-theme-border rounded-lg px-4 py-2.5 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all"
                />
              </div>
            </div>
          </form>
        ) : selectedEntry ? (
          /* ================== READING VIEWER MODE ================== */
          <div className="flex flex-col h-full overflow-hidden" id="journal_view_details">
            {/* Viewer action bar */}
            <div className="border-b border-theme-border px-6 py-4 bg-theme-card/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-1 rounded hover:bg-theme-border text-theme-muted lg:hidden"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg">{getMoodEmoji(selectedEntry.mood)}</span>
                <span className="text-xs font-mono font-medium text-theme-muted capitalize">{selectedEntry.mood} Log</span>
              </div>
              <div className="flex items-center gap-2" id="viewer_action_buttons">
                <button
                  id="entry_delete_btn"
                  onClick={() => handleDelete(selectedEntry._id)}
                  className="p-1.5 rounded-lg border border-theme-border hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400 text-theme-muted cursor-pointer transition-all"
                  title="Delete Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  id="entry_edit_btn"
                  onClick={handleEditClick}
                  className="px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-md box-glow"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Log</span>
                </button>
              </div>
            </div>

            {/* Viewer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" id="viewer_scroll_pane">
              {/* Date & Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-theme-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(selectedEntry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-theme-text leading-tight">
                  {selectedEntry.title}
                </h1>
              </div>

              {/* Tags panel */}
              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-b border-theme-border/50 pb-4">
                  {selectedEntry.tags.map((t, idx) => (
                    <span key={idx} className="text-xs font-mono bg-theme-accent/10 border border-theme-border/60 text-theme-text px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Screen Capture attached images */}
              {selectedEntry.images && selectedEntry.images.length > 0 && selectedEntry.images[0] && (
                <div className="rounded-xl overflow-hidden border border-theme-border" id="attached_image_box">
                  <img 
                    src={selectedEntry.images[0]} 
                    alt="Logged session screen capture" 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-72 object-cover" 
                  />
                </div>
              )}

              {/* Markdown Content */}
              <div className="markdown-body text-left leading-relaxed text-theme-text" id="journal_markdown_body">
                <Markdown>{selectedEntry.content}</Markdown>
              </div>

              {/* Code Snippets Embedded panels */}
              {selectedEntry.codeSnippets && selectedEntry.codeSnippets.length > 0 && selectedEntry.codeSnippets[0].code && (
                <div className="border border-theme-border rounded-xl overflow-hidden bg-theme-bg/60" id="attached_snippet_box">
                  <div className="bg-theme-card px-4 py-2 border-b border-theme-border flex items-center justify-between text-xs font-mono">
                    <span className="text-theme-muted flex items-center gap-1">
                      <Code className="w-3.5 h-3.5 text-theme-accent" />
                      <span>{selectedEntry.codeSnippets[0].title || 'Embedded Code'}</span>
                    </span>
                    <span className="text-[10px] bg-theme-bg/80 border border-theme-border/50 px-1.5 py-0.2 rounded uppercase text-theme-muted">
                      {selectedEntry.codeSnippets[0].language}
                    </span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-left leading-relaxed text-theme-text bg-theme-bg/40 max-h-96">
                    <code>{selectedEntry.codeSnippets[0].code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================== BLANK/SELECT STATE ================== */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8" id="journal_viewer_blank">
            <FileText className="w-12 h-12 text-theme-muted/35 mb-3" />
            <h3 className="font-display text-base font-semibold">No Log Selected</h3>
            <p className="text-xs text-theme-muted max-w-sm mt-1">
              Select an entry from the sidebar to review detailed session achievements, or create a brand new log.
            </p>
            <button
              id="blank_create_journal_btn"
              onClick={handleCreateNewClick}
              className="mt-4 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all box-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Log Today's Session</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
