import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  Bookmark,
  Plus,
  Search,
  ExternalLink,
  Star,
  Trash2,
  Filter,
  Sparkles,
  X,
  Edit3,
  MessageSquare
} from "lucide-react";
import { motion } from "motion/react";
import { resourceService } from "../services/api";
const ResourcesView = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [favFilter, setFavFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("React");
  const [notes, setNotes] = useState("");
  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await resourceService.getResources({
        search,
        category: catFilter || void 0,
        isFavorite: favFilter ? true : void 0
      });
      if (res.success) {
        setResources(res.data);
      }
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResources();
  }, [search, catFilter, favFilter]);
  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title || !url) {
      alert("Title and Bookmark URL are required.");
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
      console.error("Failed to save resource bookmark:", err);
    }
  };
  const handleEditClick = (r) => {
    setEditingId(r._id);
    setTitle(r.title);
    setUrl(r.url);
    setCategory(r.category);
    setNotes(r.notes);
    setShowCreate(true);
  };
  const handleDelete = async (id) => {
    try {
      const res = await resourceService.deleteResource(id);
      if (res.success) {
        fetchResources();
      }
    } catch (err) {
      console.error("Failed to delete resource:", err);
    }
  };
  const handleToggleFavorite = async (id, currentFav) => {
    try {
      const res = await resourceService.updateResource(id, { isFavorite: !currentFav });
      if (res.success) {
        setResources((prev) => prev.map((r) => r._id === id ? res.data : r));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setUrl("");
    setCategory("React");
    setNotes("");
    setShowCreate(false);
  };
  const PRESET_CATEGORIES = [
    "React",
    "Node",
    "DSA",
    "MongoDB",
    "System Design",
    "AI",
    "Interview Prep",
    "General"
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-theme-text", id: "resources_view_root", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", id: "resources_header", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-xl font-bold tracking-tight flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Bookmark, { className: "w-5.5 h-5.5 text-theme-accent" }),
          /* @__PURE__ */ jsx("span", { children: "Learning Resources" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "Bookmark playlists, articles, repositories, and technical reference sites organized by categories" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          id: "toggle_resource_form_btn",
          onClick: () => {
            if (showCreate) resetForm();
            else setShowCreate(true);
          },
          className: "bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start md:self-auto box-glow",
          children: [
            showCreate ? /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: showCreate ? "Close Editor" : "Bookmark Link" })
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
        id: "resource_form_panel",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-theme-accent tracking-wider font-mono uppercase mb-4", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: editingId ? "Modify Bookmark Information" : "Catalog New Study Resource" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateOrUpdate, className: "grid grid-cols-1 md:grid-cols-12 gap-4", id: "resource_form", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-6 space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Resource Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "resource_title_input",
                    type: "text",
                    required: true,
                    placeholder: "e.g. Sharding Architecture Deep Dive, CSS Grid Course...",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Destination URL" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "resource_url_input",
                    type: "url",
                    required: true,
                    placeholder: "e.g. https://systemdesign.com/sharding",
                    value: url,
                    onChange: (e) => setUrl(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-6 space-y-3 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 col-span-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Technical Category" }),
                  /* @__PURE__ */ jsx(
                    "select",
                    {
                      id: "resource_category_select",
                      value: category,
                      onChange: (e) => setCategory(e.target.value),
                      className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent",
                      children: PRESET_CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1 col-span-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-mono text-theme-muted uppercase", children: "Personal Study Comments" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "resource_notes_input",
                      type: "text",
                      placeholder: "e.g. Key take-away is consistency rings, useful study for index queries",
                      value: notes,
                      onChange: (e) => setNotes(e.target.value),
                      className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1.5 pt-2", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: resetForm,
                    className: "px-3 py-1.5 border border-theme-border rounded-lg text-xs text-theme-muted hover:bg-theme-bg font-medium",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    id: "resource_submit_btn",
                    type: "submit",
                    className: "px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold cursor-pointer box-glow",
                    children: editingId ? "Save Changes" : "Catalog Bookmark"
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-theme-card/40 border border-theme-border rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between", id: "resources_filters_bar", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-72", children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 text-theme-muted", children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "resources_search",
            type: "text",
            placeholder: "Search resources and notes...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap w-full md:w-auto items-center justify-end gap-3", id: "resources_filters_stack", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            id: "resources_favorite_toggle",
            onClick: () => setFavFilter(!favFilter),
            className: `px-3 py-1.5 rounded-lg border text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer transition-all ${favFilter ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400 font-semibold" : "bg-theme-bg border-theme-border text-theme-muted hover:border-theme-border/80"}`,
            children: [
              /* @__PURE__ */ jsx(Star, { className: `w-3.5 h-3.5 ${favFilter ? "fill-yellow-400" : ""}` }),
              /* @__PURE__ */ jsx("span", { children: "Favorites" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs shrink-0", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5 text-theme-muted" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "resources_cat_select",
              value: catFilter,
              onChange: (e) => setCatFilter(e.target.value),
              className: "bg-theme-bg border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "All Categories" }),
                PRESET_CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
              ]
            }
          )
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center", id: "resources_loader", children: [
      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-theme-muted font-mono mt-2 animate-pulse", children: "RECONCILING BOOKMARKS..." })
    ] }) : resources.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-16 border border-dashed border-theme-border rounded-xl text-center p-8 bg-theme-card/15", id: "resources_empty", children: [
      /* @__PURE__ */ jsx(Bookmark, { className: "w-10 h-10 text-theme-muted/30 mx-auto mb-2" }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-semibold", children: "Library Empty" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted mt-1 max-w-sm mx-auto", children: "Pin advanced reference materials, YouTube playlists, or LeetCode guides to access them instantly from your dashboard profile!" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowCreate(true),
          className: "mt-3 px-4 py-1.5 rounded-lg border border-theme-accent/40 bg-theme-accent/10 hover:bg-theme-accent/20 text-theme-accent text-xs font-mono cursor-pointer transition-all",
          children: "Add first bookmark +"
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5", id: "resources_cards_grid", children: resources.map((r) => /* @__PURE__ */ jsxs(
      "div",
      {
        id: `resource_card_${r._id}`,
        className: "bg-theme-card/50 glass-effect border border-theme-border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-theme-border/80",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono tracking-wider uppercase bg-theme-accent/10 text-theme-accent px-2 py-0.5 rounded border border-theme-accent/10", children: r.category }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    id: `resource_star_${r._id}`,
                    onClick: () => handleToggleFavorite(r._id, r.isFavorite),
                    className: `p-1 rounded hover:bg-theme-border cursor-pointer transition-all ${r.isFavorite ? "text-yellow-400" : "text-theme-muted hover:text-theme-text"}`,
                    children: /* @__PURE__ */ jsx(Star, { className: `w-3.5 h-3.5 ${r.isFavorite ? "fill-yellow-400" : ""}` })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    id: `resource_edit_${r._id}`,
                    onClick: () => handleEditClick(r),
                    className: "p-1 rounded hover:bg-theme-border text-theme-muted hover:text-theme-text transition-all cursor-pointer",
                    title: "Edit Bookmark",
                    children: /* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    id: `resource_delete_${r._id}`,
                    onClick: () => handleDelete(r._id),
                    className: "p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-all cursor-pointer",
                    title: "Delete Bookmark",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-bold text-theme-text tracking-tight leading-snug", children: r.title }),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: r.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-[11px] text-theme-accent font-mono hover:underline flex items-center gap-1 w-fit mt-1",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "truncate max-w-xs", children: r.url }),
                    /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 shrink-0" })
                  ]
                }
              )
            ] }),
            r.notes && /* @__PURE__ */ jsxs("div", { className: "bg-theme-bg/60 border border-theme-border/40 rounded-lg p-3 flex gap-2 items-start", id: `resource_notes_bubble_${r._id}`, children: [
              /* @__PURE__ */ jsx(MessageSquare, { className: "w-3.5 h-3.5 text-theme-muted mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-theme-muted italic leading-normal text-left", children: [
                '"',
                r.notes,
                '"'
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[9px] font-mono text-theme-muted text-right mt-4 pt-3 border-t border-theme-border/30", children: [
            "Logged: ",
            new Date(r.createdAt).toLocaleDateString()
          ] })
        ]
      },
      r._id
    )) })
  ] });
};
export {
  ResourcesView
};
