import React, { useState, useEffect } from 'react';
import { 
  Code2, Plus, Search, Copy, Check, Star, Trash2, 
  Tag, Filter, Terminal, Sparkles, X, Edit3
} from 'lucide-react';
import { motion } from 'motion/react';
import { snippetService } from '../services/api';
import { CodeSnippet } from '../types';

export const SnippetsView: React.FC = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [favFilter, setFavFilter] = useState(false);

  // Creator state
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const res = await snippetService.getSnippets({
        search,
        language: langFilter || undefined,
        isFavorite: favFilter ? true : undefined
      });
      if (res.success) {
        setSnippets(res.data);
      }
    } catch (err) {
      console.error('Failed to retrieve snippets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [search, langFilter, favFilter]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) {
      alert('Title and Code fields are required.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title,
      language,
      description,
      code,
      tags: tagsArray
    };

    try {
      if (editingId) {
        const res = await snippetService.updateSnippet(editingId, payload);
        if (res.success) {
          fetchSnippets();
          resetForm();
        }
      } else {
        const res = await snippetService.createSnippet(payload);
        if (res.success) {
          fetchSnippets();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Failed to save code snippet:', err);
    }
  };

  const handleEditClick = (s: CodeSnippet) => {
    setEditingId(s._id);
    setTitle(s.title);
    setLanguage(s.language);
    setDescription(s.description);
    setCode(s.code);
    setTagsInput(s.tags.join(', '));
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await snippetService.deleteSnippet(id);
      if (res.success) {
        fetchSnippets();
      }
    } catch (err) {
      console.error('Failed to delete snippet:', err);
    }
  };

  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    try {
      const res = await snippetService.updateSnippet(id, { isFavorite: !currentFav });
      if (res.success) {
        setSnippets(prev => prev.map(s => s._id === id ? res.data : s));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleCopyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setLanguage('typescript');
    setDescription('');
    setCode('');
    setTagsInput('');
    setShowCreate(false);
  };

  return (
    <div className="space-y-6 text-theme-text" id="snippets_view_root">
      
      {/* View Header with creation trigger */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="snippets_header">
        <div className="space-y-0.5">
          <h2 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="w-5.5 h-5.5 text-theme-accent" />
            <span>Developer Gists</span>
          </h2>
          <p className="text-xs text-theme-muted">Save boilerplate code blocks, custom algorithms, shell configurations, and script presets</p>
        </div>
        
        <button
          id="toggle_snippet_form_btn"
          onClick={() => {
            if (showCreate) resetForm();
            else setShowCreate(true);
          }}
          className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto box-glow"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showCreate ? 'Close Editor' : 'Register Snippet'}</span>
        </button>
      </div>

      {/* Code Snippet Form / Editor Panel */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-card border border-theme-border rounded-xl p-5"
          id="snippet_form_panel"
        >
          <div className="flex items-center gap-1 text-xs font-semibold text-theme-accent tracking-wider font-mono uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{editingId ? 'Modify Snippet Metadata' : 'Compose Code Snippet'}</span>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-12 gap-4" id="snippet_form">
            {/* Info block */}
            <div className="md:col-span-4 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Snippet Title</label>
                <input
                  id="snippet_title_input"
                  type="text"
                  required
                  placeholder="e.g. Express rate limiter middleware config"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Coding Language</label>
                <select
                  id="snippet_language_select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-mono"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="css">CSS / Tailwind</option>
                  <option value="html">HTML</option>
                  <option value="sql">SQL / NoSQL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Tags (comma separated)</label>
                <input
                  id="snippet_tags_input"
                  type="text"
                  placeholder="e.g. Auth, Server, Middleware"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Snippet Description</label>
                <textarea
                  id="snippet_description_input"
                  placeholder="Briefly explain what this code block is used for, what properties it expects, or its algorithmic complexity..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg p-3 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent resize-none"
                ></textarea>
              </div>
            </div>

            {/* Code editor pane */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-3">
              <div className="space-y-1 flex-1 flex flex-col">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Source Code Editor</label>
                <textarea
                  id="snippet_code_textarea"
                  required
                  placeholder="export function protect(req, res, next) { ..."
                  rows={12}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full flex-1 bg-theme-bg border border-theme-border rounded-lg p-4 text-xs font-mono text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent leading-relaxed resize-y min-h-[220px]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-1.5 shrink-0 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 border border-theme-border rounded-lg text-xs text-theme-muted hover:bg-theme-bg font-medium"
                >
                  Cancel
                </button>
                <button
                  id="snippet_submit_btn"
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold cursor-pointer box-glow"
                >
                  {editingId ? 'Save Changes' : 'Register Snippet'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter and search utilities bar */}
      <div className="bg-theme-card/40 border border-theme-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between" id="snippets_filters_bar">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-2.5 text-theme-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="snippets_search"
            type="text"
            placeholder="Search gists and descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent"
          />
        </div>

        {/* Filters right stack */}
        <div className="flex flex-wrap w-full md:w-auto items-center justify-end gap-3" id="filters_stack">
          {/* Favorite Toggle button */}
          <button
            id="snippets_favorite_toggle"
            onClick={() => setFavFilter(!favFilter)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
              favFilter
                ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 font-semibold'
                : 'bg-theme-bg border-theme-border text-theme-muted hover:border-theme-border/80'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favFilter ? 'fill-yellow-400' : ''}`} />
            <span>Starred Only</span>
          </button>

          {/* Language selection dropdown */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-theme-muted" />
            <select
              id="snippets_lang_select"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="bg-theme-bg border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
            >
              <option value="">All Languages</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="css">CSS / Tailwind</option>
              <option value="html">HTML</option>
              <option value="sql">SQL / NoSQL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Snippet card listings */}
      {loading ? (
        <div className="py-20 text-center" id="snippets_loader">
          <div className="w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] text-theme-muted font-mono mt-2 animate-pulse">RECONCILING GISTS...</p>
        </div>
      ) : snippets.length === 0 ? (
        <div className="py-16 border border-dashed border-theme-border rounded-xl text-center p-8 bg-theme-card/15" id="snippets_empty">
          <Code2 className="w-10 h-10 text-theme-muted/30 mx-auto mb-2" />
          <h3 className="font-display text-sm font-semibold">No Snippets Saved</h3>
          <p className="text-xs text-theme-muted mt-1 max-w-sm mx-auto">
            Build a custom catalog of reusable boilerplate, algorithm methods, or docker files to save study hours!
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-3 px-4 py-1.5 rounded-lg border border-theme-accent/40 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent text-xs font-mono cursor-pointer transition-all"
          >
            Create first code gist +
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="snippets_grid">
          {snippets.map((s) => {
            const isCopied = copiedId === s._id;
            return (
              <div
                key={s._id}
                id={`snippet_card_${s._id}`}
                className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl overflow-hidden flex flex-col justify-between"
              >
                {/* Card Header metadata */}
                <div className="p-5 space-y-2 border-b border-theme-border/50 bg-theme-card/25">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-mono font-semibold text-theme-accent uppercase bg-theme-accent/10 px-2 py-0.5 rounded border border-theme-accent/10">
                      {s.language}
                    </span>

                    <div className="flex gap-1.5 items-center">
                      {/* Star icon */}
                      <button
                        id={`snippet_star_${s._id}`}
                        onClick={() => handleToggleFavorite(s._id, s.isFavorite)}
                        className={`p-1 rounded hover:bg-theme-border cursor-pointer transition-all ${
                          s.isFavorite ? 'text-yellow-400' : 'text-theme-muted hover:text-theme-text'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${s.isFavorite ? 'fill-yellow-400' : ''}`} />
                      </button>

                      <button
                        id={`snippet_edit_${s._id}`}
                        onClick={() => handleEditClick(s)}
                        className="p-1 rounded hover:bg-theme-border text-theme-muted hover:text-theme-text transition-all cursor-pointer"
                        title="Edit Snippet"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        id={`snippet_delete_${s._id}`}
                        onClick={() => handleDelete(s._id)}
                        className="p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-all cursor-pointer"
                        title="Delete Snippet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-sm font-bold text-theme-text tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs text-theme-muted line-clamp-2 min-h-[32px]">
                    {s.description || 'No description provided.'}
                  </p>

                  {/* Snippet Tags */}
                  {s.tags && s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {s.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-mono bg-theme-bg border border-theme-border/50 text-theme-muted px-1.5 py-0.2 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Code pane */}
                <div className="relative group bg-theme-bg/30 flex-1 flex flex-col justify-between" id={`snippet_code_box_${s._id}`}>
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-left leading-relaxed text-theme-text max-h-56 flex-1 bg-theme-bg/25">
                    <code>{s.code}</code>
                  </pre>

                  {/* Clipboard trigger button absolute overlap */}
                  <button
                    id={`snippet_copy_btn_${s._id}`}
                    onClick={() => handleCopyToClipboard(s._id, s.code)}
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-theme-card/90 border border-theme-border text-theme-muted hover:text-theme-text cursor-pointer transition-all flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-md"
                    title="Copy Code"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-mono font-bold text-emerald-500">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono">COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
