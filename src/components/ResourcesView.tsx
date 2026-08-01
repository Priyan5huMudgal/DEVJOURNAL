import React, { useState, useEffect } from 'react';
import { 
  Bookmark, Plus, Search, ExternalLink, Star, Trash2, 
  BookOpen, Tag, Filter, Sparkles, X, Edit3, MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { resourceService } from '../services/api';
import { LearningResource } from '../types';

export const ResourcesView: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [favFilter, setFavFilter] = useState(false);

  // Creator state
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('React');
  const [notes, setNotes] = useState('');

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourceService.getResources({
        search,
        category: catFilter || undefined,
        isFavorite: favFilter ? true : undefined
      });
      if (res.success) {
        setResources(res.data);
      }
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, catFilter, favFilter]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      alert('Title and Bookmark URL are required.');
      return;
    }

    const payload = {
      title,
      url,
      category,
      notes
    };

    try {
      if (editingId) {
        const res = await resourceService.updateResource(editingId, payload);
        if (res.success) {
          fetchResources();
          resetForm();
        }
      } else {
        const res = await resourceService.createResource(payload);
        if (res.success) {
          fetchResources();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Failed to save resource bookmark:', err);
    }
  };

  const handleEditClick = (r: LearningResource) => {
    setEditingId(r._id);
    setTitle(r.title);
    setUrl(r.url);
    setCategory(r.category);
    setNotes(r.notes);
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await resourceService.deleteResource(id);
      if (res.success) {
        fetchResources();
      }
    } catch (err) {
      console.error('Failed to delete resource:', err);
    }
  };

  const handleToggleFavorite = async (id: string, currentFav: boolean) => {
    try {
      const res = await resourceService.updateResource(id, { isFavorite: !currentFav });
      if (res.success) {
        setResources(prev => prev.map(r => r._id === id ? res.data : r));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setUrl('');
    setCategory('React');
    setNotes('');
    setShowCreate(false);
  };

  // Standard preset developer categories
  const PRESET_CATEGORIES = [
    'React', 'Node', 'DSA', 'MongoDB', 'System Design', 'AI', 'Interview Prep', 'General'
  ];

  return (
    <div className="space-y-6 text-theme-text" id="resources_view_root">
      
      {/* View Header with creation trigger */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="resources_header">
        <div className="space-y-0.5">
          <h2 className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
            <Bookmark className="w-5.5 h-5.5 text-theme-accent" />
            <span>Learning Resources</span>
          </h2>
          <p className="text-xs text-theme-muted">Bookmark playlists, articles, repositories, and technical reference sites organized by categories</p>
        </div>
        
        <button
          id="toggle_resource_form_btn"
          onClick={() => {
            if (showCreate) resetForm();
            else setShowCreate(true);
          }}
          className="bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto box-glow"
        >
          {showCreate ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showCreate ? 'Close Editor' : 'Bookmark Link'}</span>
        </button>
      </div>

      {/* Resource Creation / Editor Panel */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-card border border-theme-border rounded-xl p-5"
          id="resource_form_panel"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-theme-accent tracking-wider font-mono uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{editingId ? 'Modify Bookmark Information' : 'Catalog New Study Resource'}</span>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-12 gap-4" id="resource_form">
            <div className="md:col-span-6 space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Resource Title</label>
                <input
                  id="resource_title_input"
                  type="text"
                  required
                  placeholder="e.g. Sharding Architecture Deep Dive, CSS Grid Course..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-theme-muted uppercase">Destination URL</label>
                <input
                  id="resource_url_input"
                  type="url"
                  required
                  placeholder="e.g. https://systemdesign.com/sharding"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                />
              </div>
            </div>

            <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono text-theme-muted uppercase">Technical Category</label>
                  <select
                    id="resource_category_select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono text-theme-muted uppercase">Personal Study Comments</label>
                  <input
                    id="resource_notes_input"
                    type="text"
                    placeholder="e.g. Key take-away is consistency rings, useful study for index queries"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-1.5 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 border border-theme-border rounded-lg text-xs text-theme-muted hover:bg-theme-bg font-medium"
                >
                  Cancel
                </button>
                <button
                  id="resource_submit_btn"
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold cursor-pointer box-glow"
                >
                  {editingId ? 'Save Changes' : 'Catalog Bookmark'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter shelf */}
      <div className="bg-theme-card/40 border border-theme-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between" id="resources_filters_bar">
        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <span className="absolute left-3 top-2.5 text-theme-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="resources_search"
            type="text"
            placeholder="Search resources and notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent"
          />
        </div>

        {/* Filters and category selections */}
        <div className="flex flex-wrap w-full md:w-auto items-center justify-end gap-3" id="resources_filters_stack">
          {/* Favorite toggle */}
          <button
            id="resources_favorite_toggle"
            onClick={() => setFavFilter(!favFilter)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer transition-all ${
              favFilter
                ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 font-semibold'
                : 'bg-theme-bg border-theme-border text-theme-muted hover:border-theme-border/80'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favFilter ? 'fill-yellow-400' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-theme-muted" />
            <select
              id="resources_cat_select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-theme-bg border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
            >
              <option value="">All Categories</option>
              {PRESET_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource catalog layout (Bento rows) */}
      {loading ? (
        <div className="py-20 text-center" id="resources_loader">
          <div className="w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] text-theme-muted font-mono mt-2 animate-pulse">RECONCILING BOOKMARKS...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="py-16 border border-dashed border-theme-border rounded-xl text-center p-8 bg-theme-card/15" id="resources_empty">
          <Bookmark className="w-10 h-10 text-theme-muted/30 mx-auto mb-2" />
          <h3 className="font-display text-sm font-semibold">Library Empty</h3>
          <p className="text-xs text-theme-muted mt-1 max-w-sm mx-auto">
            Pin advanced reference materials, YouTube playlists, or LeetCode guides to access them instantly from your dashboard profile!
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-3 px-4 py-1.5 rounded-lg border border-theme-accent/40 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent text-xs font-mono cursor-pointer transition-all"
          >
            Add first bookmark +
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" id="resources_cards_grid">
          {resources.map((r) => (
            <div
              key={r._id}
              id={`resource_card_${r._id}`}
              className="bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-theme-border/80"
            >
              <div className="space-y-3">
                {/* Meta details */}
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[9px] font-mono tracking-wider uppercase bg-theme-accent/10 text-theme-accent px-2 py-0.5 rounded border border-theme-accent/10">
                    {r.category}
                  </span>

                  <div className="flex gap-1">
                    {/* Star toggle */}
                    <button
                      id={`resource_star_${r._id}`}
                      onClick={() => handleToggleFavorite(r._id, r.isFavorite)}
                      className={`p-1 rounded hover:bg-theme-border cursor-pointer transition-all ${
                        r.isFavorite ? 'text-yellow-400' : 'text-theme-muted hover:text-theme-text'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${r.isFavorite ? 'fill-yellow-400' : ''}`} />
                    </button>
                    {/* Edit */}
                    <button
                      id={`resource_edit_${r._id}`}
                      onClick={() => handleEditClick(r)}
                      className="p-1 rounded hover:bg-theme-border text-theme-muted hover:text-theme-text transition-all cursor-pointer"
                      title="Edit Bookmark"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button
                      id={`resource_delete_${r._id}`}
                      onClick={() => handleDelete(r._id)}
                      className="p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-sm font-bold text-theme-text tracking-tight leading-snug">
                    {r.title}
                  </h3>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-theme-accent font-mono hover:underline flex items-center gap-1 w-fit mt-1"
                  >
                    <span className="truncate max-w-xs">{r.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {/* Personal Comments bubble */}
                {r.notes && (
                  <div className="bg-theme-bg/60 border border-theme-border/40 rounded-lg p-3 flex gap-2 items-start" id={`resource_notes_bubble_${r._id}`}>
                    <MessageSquare className="w-3.5 h-3.5 text-theme-muted mt-0.5 shrink-0" />
                    <p className="text-xs text-theme-muted italic leading-normal text-left">
                      "{r.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="text-[9px] font-mono text-theme-muted text-right mt-4 pt-3 border-t border-theme-border/30">
                Logged: {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
