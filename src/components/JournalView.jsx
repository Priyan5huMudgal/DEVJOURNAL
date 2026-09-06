import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Plus,
  Search,
  Calendar,
  Trash2,
  Edit3,
  Save,
  Code,
  FileText,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { journalService } from "../services/api";
const JournalView = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [moodFilter, setMoodFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("focused");
  const [tagsInput, setTagsInput] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("typescript");
  const [snippetCode, setSnippetCode] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("");
  const [imageInput, setImageInput] = useState("");
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await journalService.getEntries({
        search,
        tag: tagFilter,
        mood: moodFilter,
        sort,
      });
      if (res.success) {
        setEntries(res.data);
        if (res.data.length > 0 && !selectedEntry) {
          setSelectedEntry(res.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEntries();
  }, [search, tagFilter, moodFilter, sort]);
  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
    setIsEditing(false);
  };
  const handleCreateNewClick = () => {
    setSelectedEntry(null);
    setIsEditing(true);
    setTitle("");
    setContent(`### Today's Focus & Goals
  - [ ]

### Core Accomplishments
  -

### Challenges & Blockers
  -

### Key Learnings
- `);
    setMood("focused");
    setTagsInput("");
    setSnippetLanguage("typescript");
    setSnippetCode("");
    setSnippetTitle("");
    setImageInput("");
  };
  const handleEditClick = () => {
    if (!selectedEntry) return;
    setIsEditing(true);
    setTitle(selectedEntry.title);
    setContent(selectedEntry.content);
    setMood(selectedEntry.mood);
    setTagsInput(selectedEntry.tags.join(", "));
    if (selectedEntry.codeSnippets && selectedEntry.codeSnippets.length > 0) {
      setSnippetLanguage(selectedEntry.codeSnippets[0].language);
      setSnippetCode(selectedEntry.codeSnippets[0].code);
      setSnippetTitle(selectedEntry.codeSnippets[0].title || "");
    } else {
      setSnippetLanguage("typescript");
      setSnippetCode("");
      setSnippetTitle("");
    }
    setImageInput(
      selectedEntry.images && selectedEntry.images.length > 0
        ? selectedEntry.images[0]
        : "",
    );
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in both Title and Content fields.");
      return;
    }
    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const codeSnippets = snippetCode
      ? [
          {
            language: snippetLanguage,
            code: snippetCode,
            title: snippetTitle || "Attached Snippet",
          },
        ]
      : [];
    const images = imageInput ? [imageInput] : [];
    const payload = {
      title,
      content,
      mood,
      tags: tagsArray,
      images,
      codeSnippets,
      date:
        selectedEntry && !isEditing
          ? selectedEntry.date
          : /* @__PURE__ */ new Date(),
    };
    try {
      if (selectedEntry?._id) {
        const res = await journalService.updateEntry(
          selectedEntry._id,
          payload,
        );
        if (res.success) {
          setIsEditing(false);
          setSelectedEntry(res.data);
          fetchEntries();
        }
      } else {
        const res = await journalService.createEntry(payload);
        if (res.success) {
          setIsEditing(false);
          setSelectedEntry(res.data);
          fetchEntries();
        }
      }
    } catch (err) {
      console.error("Failed to save journal entry:", err);
    }
  };
  const handleDelete = async (entryId) => {
    try {
      const res = await journalService.deleteEntry(entryId);
      if (res.success) {
        setSelectedEntry(null);
        setIsEditing(false);
        fetchEntries();
      }
    } catch (err) {
      console.error("Failed to delete journal entry:", err);
    }
  };
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
  return /* @__PURE__ */ jsxs("div", {
    className:
      "grid grid-cols-1 lg:grid-cols-12 gap-6 text-theme-text h-[calc(100vh-140px)]",
    id: "journal_view_root",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: `lg:col-span-4 flex flex-col space-y-4 h-full ${selectedEntry && !isEditing ? "hidden lg:flex" : "flex"}`,
        id: "journal_sidebar",
        children: [
          /* @__PURE__ */ jsxs("div", {
            className: "flex items-center justify-between",
            id: "sidebar_header",
            children: [
              /* @__PURE__ */ jsxs("h2", {
                className:
                  "font-display text-lg font-semibold flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(FileText, {
                    className: "w-5 h-5 text-theme-accent",
                  }),
                  /* @__PURE__ */ jsx("span", {
                    children: "Developer Diaries",
                  }),
                ],
              }),
              /* @__PURE__ */ jsx("button", {
                id: "create_new_journal_btn",
                onClick: handleCreateNewClick,
                className:
                  "p-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center cursor-pointer transition-all box-glow",
                children: /* @__PURE__ */ jsx(Plus, {
                  className: "w-4.5 h-4.5",
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxs("div", {
            className:
              "bg-theme-card/40 border border-theme-border rounded-xl p-4 space-y-3",
            id: "filters_panel",
            children: [
              /* @__PURE__ */ jsxs("div", {
                className: "relative",
                children: [
                  /* @__PURE__ */ jsx("span", {
                    className: "absolute left-3 top-3 text-theme-muted",
                    children: /* @__PURE__ */ jsx(Search, {
                      className: "w-4 h-4",
                    }),
                  }),
                  /* @__PURE__ */ jsx("input", {
                    id: "journal_search",
                    type: "text",
                    placeholder: "Search journals...",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    className:
                      "w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-9 pr-4 py-2 text-xs text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent transition-all",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-2 gap-2",
                id: "filter_selectors",
                children: [
                  /* @__PURE__ */ jsxs("select", {
                    id: "tag_filter_select",
                    value: tagFilter,
                    onChange: (e) => setTagFilter(e.target.value),
                    className:
                      "bg-theme-bg/60 border border-theme-border rounded-lg px-2 py-1.5 text-[11px] text-theme-text focus:outline-none focus:border-theme-accent",
                    children: [
                      /* @__PURE__ */ jsx("option", {
                        value: "",
                        children: "All Tags",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "Engineering",
                        children: "Engineering",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "TypeScript",
                        children: "TypeScript",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "UI-Design",
                        children: "UI-Design",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "NodeJS",
                        children: "NodeJS",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "Architecture",
                        children: "Architecture",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs("select", {
                    id: "mood_filter_select",
                    value: moodFilter,
                    onChange: (e) => setMoodFilter(e.target.value),
                    className:
                      "bg-theme-bg/60 border border-theme-border rounded-lg px-2 py-1.5 text-[11px] text-theme-text focus:outline-none focus:border-theme-accent",
                    children: [
                      /* @__PURE__ */ jsx("option", {
                        value: "",
                        children: "All Moods",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "focused",
                        children: "\u{1F4BB} Focused",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "productive",
                        children: "\u{1F680} Productive",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "happy",
                        children: "\u2600\uFE0F Happy",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "tired",
                        children: "\u2615 Tired",
                      }),
                      /* @__PURE__ */ jsx("option", {
                        value: "stressed",
                        children: "\u{1F32A}\uFE0F Stressed",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsx("div", {
            className: "flex-1 overflow-y-auto space-y-3 pr-1",
            id: "journal_entry_cards_list",
            children: loading
              ? /* @__PURE__ */ jsxs("div", {
                  className: "py-12 text-center",
                  id: "cards_loader",
                  children: [
                    /* @__PURE__ */ jsx("div", {
                      className:
                        "w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto",
                    }),
                    /* @__PURE__ */ jsx("p", {
                      className: "text-[11px] text-theme-muted mt-2 font-mono",
                      children: "LOADING LOGS...",
                    }),
                  ],
                })
              : entries.length === 0
                ? /* @__PURE__ */ jsxs("div", {
                    className:
                      "py-12 border border-dashed border-theme-border rounded-xl text-center p-6 bg-theme-card/15",
                    id: "cards_empty",
                    children: [
                      /* @__PURE__ */ jsx(FileText, {
                        className: "w-8 h-8 text-theme-muted/40 mx-auto mb-2",
                      }),
                      /* @__PURE__ */ jsx("p", {
                        className: "text-xs text-theme-muted",
                        children: "No diaries fit your active filter settings.",
                      }),
                      /* @__PURE__ */ jsx("button", {
                        onClick: handleCreateNewClick,
                        className:
                          "mt-2 text-xs text-theme-accent hover:underline font-mono",
                        children: "Log today's work +",
                      }),
                    ],
                  })
                : entries.map((entry) =>
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        id: `entry_card_${entry._id}`,
                        onClick: () => handleSelectEntry(entry),
                        className: `p-4 rounded-xl border text-left cursor-pointer transition-all ${selectedEntry?._id === entry._id ? "bg-theme-accent/10 border-theme-accent/70 shadow-sm box-glow" : "bg-theme-card/30 border-theme-border hover:border-theme-border/80 hover:bg-theme-card/50"}`,
                        children: [
                          /* @__PURE__ */ jsxs("div", {
                            className: "flex justify-between items-start gap-2",
                            children: [
                              /* @__PURE__ */ jsx("span", {
                                className: "text-lg shrink-0",
                                children: getMoodEmoji(entry.mood),
                              }),
                              /* @__PURE__ */ jsxs("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                  /* @__PURE__ */ jsx("h4", {
                                    className:
                                      "text-sm font-semibold text-theme-text truncate leading-snug",
                                    children: entry.title,
                                  }),
                                  /* @__PURE__ */ jsxs("span", {
                                    className:
                                      "text-[10px] font-mono text-theme-muted flex items-center gap-1 mt-0.5",
                                    children: [
                                      /* @__PURE__ */ jsx(Calendar, {
                                        className: "w-3 h-3 shrink-0",
                                      }),
                                      /* @__PURE__ */ jsx("span", {
                                        children: new Date(
                                          entry.date,
                                        ).toLocaleDateString(void 0, {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          entry.tags &&
                            entry.tags.length > 0 &&
                            /* @__PURE__ */ jsx("div", {
                              className: "flex flex-wrap gap-1 mt-2.5",
                              children: entry.tags
                                .slice(0, 3)
                                .map((t, idx) =>
                                  /* @__PURE__ */ jsxs(
                                    "span",
                                    {
                                      className:
                                        "text-[9px] font-mono bg-theme-bg/80 border border-theme-border/50 text-theme-muted px-1.5 py-0.2 rounded",
                                      children: ["#", t],
                                    },
                                    idx,
                                  ),
                                ),
                            }),
                        ],
                      },
                      entry._id,
                    ),
                  ),
          }),
        ],
      }),
      /* @__PURE__ */ jsx("div", {
        className: `lg:col-span-8 flex flex-col h-full bg-theme-card/30 border border-theme-border rounded-xl overflow-hidden ${!selectedEntry && !isEditing ? "hidden lg:flex" : "flex"}`,
        id: "journal_active_panel",
        children: isEditing
          ? /* ================== WRITING EDITOR MODE ================== */
            /* @__PURE__ */ jsxs("form", {
              onSubmit: handleSave,
              className: "flex flex-col h-full overflow-hidden",
              id: "journal_write_form",
              children: [
                /* @__PURE__ */ jsxs("div", {
                  className:
                    "border-b border-theme-border px-6 py-4 bg-theme-card/50 flex justify-between items-center shrink-0",
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsx("button", {
                          type: "button",
                          onClick: () => setIsEditing(false),
                          className:
                            "p-1 rounded hover:bg-theme-border text-theme-muted lg:hidden",
                          children: /* @__PURE__ */ jsx(ChevronLeft, {
                            className: "w-5 h-5",
                          }),
                        }),
                        /* @__PURE__ */ jsxs("span", {
                          className:
                            "text-xs font-mono text-theme-accent flex items-center gap-1.5",
                          children: [
                            /* @__PURE__ */ jsx(Sparkles, {
                              className: "w-3.5 h-3.5",
                            }),
                            /* @__PURE__ */ jsx("span", {
                              children: selectedEntry?._id
                                ? "Editing Existing Diary"
                                : "Logging New Session",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsx("button", {
                          id: "editor_cancel_btn",
                          type: "button",
                          onClick: () => setIsEditing(false),
                          className:
                            "px-3 py-1.5 rounded-lg border border-theme-border hover:bg-theme-border text-xs font-medium cursor-pointer transition-all",
                          children: "Cancel",
                        }),
                        /* @__PURE__ */ jsxs("button", {
                          id: "editor_save_btn",
                          type: "submit",
                          className:
                            "px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-md box-glow",
                          children: [
                            /* @__PURE__ */ jsx(Save, {
                              className: "w-3.5 h-3.5",
                            }),
                            /* @__PURE__ */ jsx("span", {
                              children: "Save Log",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxs("div", {
                  className: "flex-1 overflow-y-auto min-h-0 p-6 space-y-5",
                  id: "editor_scroll_pane",
                  children: [
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx("label", {
                          className:
                            "text-xs font-mono text-theme-muted uppercase tracking-wider block",
                          children: "Session Title",
                        }),
                        /* @__PURE__ */ jsx("input", {
                          id: "editor_title_input",
                          type: "text",
                          required: true,
                          placeholder:
                            "e.g. Completed advanced redux middleware pipeline and debugged CORS headers",
                          value: title,
                          onChange: (e) => setTitle(e.target.value),
                          className:
                            "w-full bg-theme-bg/60 border border-theme-border rounded-lg px-4 py-2.5 text-sm text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all font-semibold",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: [
                        /* @__PURE__ */ jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            /* @__PURE__ */ jsx("label", {
                              className:
                                "text-xs font-mono text-theme-muted uppercase tracking-wider block",
                              children: "Today's Mental State",
                            }),
                            /* @__PURE__ */ jsx("div", {
                              className: "flex flex-wrap gap-2",
                              id: "mood_selector_box",
                              children: [
                                "focused",
                                "productive",
                                "happy",
                                "tired",
                                "stressed",
                              ].map((m) =>
                                /* @__PURE__ */ jsxs(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setMood(m),
                                    className: `flex-1 py-1.5 px-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all capitalize cursor-pointer ${mood === m ? "bg-theme-accent/15 border-theme-accent text-theme-accent font-semibold" : "bg-theme-bg/40 border-theme-border text-theme-muted hover:border-theme-border/80"}`,
                                    id: `mood_button_${m}`,
                                    children: [
                                      /* @__PURE__ */ jsx("span", {
                                        className: "text-lg",
                                        children: getMoodEmoji(m),
                                      }),
                                      /* @__PURE__ */ jsx("span", {
                                        className:
                                          "text-[9px] font-mono tracking-tighter",
                                        children: m,
                                      }),
                                    ],
                                  },
                                  m,
                                ),
                              ),
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            /* @__PURE__ */ jsx("label", {
                              className:
                                "text-xs font-mono text-theme-muted uppercase tracking-wider block",
                              children: "Category Tags (comma separated)",
                            }),
                            /* @__PURE__ */ jsx("input", {
                              id: "editor_tags_input",
                              type: "text",
                              placeholder:
                                "e.g. Engineering, TypeScript, React",
                              value: tagsInput,
                              onChange: (e) => setTagsInput(e.target.value),
                              className:
                                "w-full bg-theme-bg/60 border border-theme-border rounded-lg px-4 py-2.5 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsxs("div", {
                          className: "flex justify-between items-center",
                          children: [
                            /* @__PURE__ */ jsxs("label", {
                              className:
                                "text-xs font-mono text-theme-muted uppercase tracking-wider block flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsx(FileText, {
                                  className: "w-3.5 h-3.5 text-theme-accent",
                                }),
                                /* @__PURE__ */ jsx("span", {
                                  children:
                                    "Daily Journal Thoughts (Markdown Supported)",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsx("span", {
                              className:
                                "text-[10px] font-mono text-theme-muted italic",
                              children:
                                "# h1, ## h2, - list, [ ] task, **bold**",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsx("textarea", {
                          id: "editor_content_textarea",
                          required: true,
                          placeholder:
                            "Record what you spent your hours coding today, technical architecture summaries, challenges faced, or personal developer milestones...",
                          rows: 8,
                          value: content,
                          onChange: (e) => setContent(e.target.value),
                          className:
                            "w-full bg-theme-bg/60 border border-theme-border rounded-lg p-4 text-xs font-sans text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all leading-relaxed resize-y min-h-[160px]",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className:
                        "border border-theme-border rounded-xl p-5 bg-theme-bg/40 space-y-4",
                      id: "editor_embed_snippet_box",
                      children: [
                        /* @__PURE__ */ jsxs("div", {
                          className:
                            "flex items-center gap-2 border-b border-theme-border/50 pb-2",
                          children: [
                            /* @__PURE__ */ jsx(Code, {
                              className: "w-4 h-4 text-theme-accent",
                            }),
                            /* @__PURE__ */ jsx("span", {
                              className: "text-xs font-mono font-semibold",
                              children: "Embed Source Code Block (Optional)",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                          children: [
                            /* @__PURE__ */ jsxs("div", {
                              className: "space-y-1",
                              children: [
                                /* @__PURE__ */ jsx("label", {
                                  className:
                                    "text-[10px] font-mono text-theme-muted",
                                  children: "Snippet Title",
                                }),
                                /* @__PURE__ */ jsx("input", {
                                  id: "embed_snippet_title",
                                  type: "text",
                                  placeholder:
                                    "e.g. express middleware payload validator",
                                  value: snippetTitle,
                                  onChange: (e) =>
                                    setSnippetTitle(e.target.value),
                                  className:
                                    "w-full bg-theme-bg/80 border border-theme-border rounded-md px-3 py-1.5 text-xs text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxs("div", {
                              className: "space-y-1",
                              children: [
                                /* @__PURE__ */ jsx("label", {
                                  className:
                                    "text-[10px] font-mono text-theme-muted",
                                  children: "Coding Language",
                                }),
                                /* @__PURE__ */ jsxs("select", {
                                  id: "embed_snippet_language",
                                  value: snippetLanguage,
                                  onChange: (e) =>
                                    setSnippetLanguage(e.target.value),
                                  className:
                                    "w-full bg-theme-bg/80 border border-theme-border rounded-md px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent font-mono",
                                  children: [
                                    /* @__PURE__ */ jsx("option", {
                                      value: "typescript",
                                      children: "TypeScript",
                                    }),
                                    /* @__PURE__ */ jsx("option", {
                                      value: "javascript",
                                      children: "JavaScript",
                                    }),
                                    /* @__PURE__ */ jsx("option", {
                                      value: "python",
                                      children: "Python",
                                    }),
                                    /* @__PURE__ */ jsx("option", {
                                      value: "css",
                                      children: "CSS",
                                    }),
                                    /* @__PURE__ */ jsx("option", {
                                      value: "html",
                                      children: "HTML",
                                    }),
                                    /* @__PURE__ */ jsx("option", {
                                      value: "sql",
                                      children: "SQL / MongoDB",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxs("div", {
                          className: "space-y-1",
                          children: [
                            /* @__PURE__ */ jsx("label", {
                              className:
                                "text-[10px] font-mono text-theme-muted",
                              children: "Paste Code Snippet",
                            }),
                            /* @__PURE__ */ jsx("textarea", {
                              id: "embed_snippet_code",
                              placeholder:
                                "// paste your code snippets directly here...",
                              rows: 4,
                              value: snippetCode,
                              onChange: (e) => setSnippetCode(e.target.value),
                              className:
                                "w-full bg-theme-bg/80 border border-theme-border rounded-md p-3 text-xs font-mono text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent resize-y",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsx("label", {
                          className:
                            "text-xs font-mono text-theme-muted uppercase tracking-wider block",
                          children: "Attach Screen Capture Image (URL)",
                        }),
                        /* @__PURE__ */ jsx("input", {
                          id: "editor_image_input",
                          type: "url",
                          placeholder:
                            "e.g. https://images.unsplash.com/... or cloud link",
                          value: imageInput,
                          onChange: (e) => setImageInput(e.target.value),
                          className:
                            "w-full bg-theme-bg/60 border border-theme-border rounded-lg px-4 py-2.5 text-xs text-theme-text placeholder-theme-muted/40 focus:outline-none focus:border-theme-accent transition-all",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          : selectedEntry
            ? /* ================== READING VIEWER MODE ================== */
              /* @__PURE__ */ jsxs("div", {
                className: "flex flex-col h-full overflow-hidden",
                id: "journal_view_details",
                children: [
                  /* @__PURE__ */ jsxs("div", {
                    className:
                      "border-b border-theme-border px-6 py-4 bg-theme-card/50 flex justify-between items-center shrink-0",
                    children: [
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsx("button", {
                            onClick: () => setSelectedEntry(null),
                            className:
                              "p-1 rounded hover:bg-theme-border text-theme-muted lg:hidden",
                            children: /* @__PURE__ */ jsx(ChevronLeft, {
                              className: "w-5 h-5",
                            }),
                          }),
                          /* @__PURE__ */ jsx("span", {
                            className: "text-lg",
                            children: getMoodEmoji(selectedEntry.mood),
                          }),
                          /* @__PURE__ */ jsxs("span", {
                            className:
                              "text-xs font-mono font-medium text-theme-muted capitalize",
                            children: [selectedEntry.mood, " Log"],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2",
                        id: "viewer_action_buttons",
                        children: [
                          /* @__PURE__ */ jsx("button", {
                            id: "entry_delete_btn",
                            onClick: () => handleDelete(selectedEntry._id),
                            className:
                              "p-1.5 rounded-lg border border-theme-border hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400 text-theme-muted cursor-pointer transition-all",
                            title: "Delete Log",
                            children: /* @__PURE__ */ jsx(Trash2, {
                              className: "w-4 h-4",
                            }),
                          }),
                          /* @__PURE__ */ jsxs("button", {
                            id: "entry_edit_btn",
                            onClick: handleEditClick,
                            className:
                              "px-4 py-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-md box-glow",
                            children: [
                              /* @__PURE__ */ jsx(Edit3, {
                                className: "w-3.5 h-3.5",
                              }),
                              /* @__PURE__ */ jsx("span", {
                                children: "Edit Log",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxs("div", {
                    className: "flex-1 overflow-y-auto p-6 space-y-6",
                    id: "viewer_scroll_pane",
                    children: [
                      /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2",
                        children: [
                          /* @__PURE__ */ jsxs("div", {
                            className:
                              "flex items-center gap-1.5 text-xs font-mono text-theme-muted",
                            children: [
                              /* @__PURE__ */ jsx(Calendar, {
                                className: "w-3.5 h-3.5",
                              }),
                              /* @__PURE__ */ jsx("span", {
                                children: new Date(
                                  selectedEntry.date,
                                ).toLocaleDateString(void 0, {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }),
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsx("h1", {
                            className:
                              "font-display text-2xl font-bold tracking-tight text-theme-text leading-tight",
                            children: selectedEntry.title,
                          }),
                        ],
                      }),
                      selectedEntry.tags &&
                        selectedEntry.tags.length > 0 &&
                        /* @__PURE__ */ jsx("div", {
                          className:
                            "flex flex-wrap gap-1.5 border-b border-theme-border/50 pb-4",
                          children: selectedEntry.tags.map((t, idx) =>
                            /* @__PURE__ */ jsxs(
                              "span",
                              {
                                className:
                                  "text-xs font-mono bg-theme-accent/10 border border-theme-border/60 text-theme-text px-2 py-0.5 rounded",
                                children: ["#", t],
                              },
                              idx,
                            ),
                          ),
                        }),
                      selectedEntry.images &&
                        selectedEntry.images.length > 0 &&
                        selectedEntry.images[0] &&
                        /* @__PURE__ */ jsx("div", {
                          className:
                            "rounded-xl overflow-hidden border border-theme-border",
                          id: "attached_image_box",
                          children: /* @__PURE__ */ jsx("img", {
                            src: selectedEntry.images[0],
                            alt: "Logged session screen capture",
                            referrerPolicy: "no-referrer",
                            className: "w-full h-auto max-h-72 object-cover",
                          }),
                        }),
                      /* @__PURE__ */ jsx("div", {
                        className:
                          "markdown-body text-left leading-relaxed text-theme-text",
                        id: "journal_markdown_body",
                        children: /* @__PURE__ */ jsx(Markdown, {
                          children: selectedEntry.content,
                        }),
                      }),
                      selectedEntry.codeSnippets &&
                        selectedEntry.codeSnippets.length > 0 &&
                        selectedEntry.codeSnippets[0].code &&
                        /* @__PURE__ */ jsxs("div", {
                          className:
                            "border border-theme-border rounded-xl overflow-hidden bg-theme-bg/60",
                          id: "attached_snippet_box",
                          children: [
                            /* @__PURE__ */ jsxs("div", {
                              className:
                                "bg-theme-card px-4 py-2 border-b border-theme-border flex items-center justify-between text-xs font-mono",
                              children: [
                                /* @__PURE__ */ jsxs("span", {
                                  className:
                                    "text-theme-muted flex items-center gap-1",
                                  children: [
                                    /* @__PURE__ */ jsx(Code, {
                                      className:
                                        "w-3.5 h-3.5 text-theme-accent",
                                    }),
                                    /* @__PURE__ */ jsx("span", {
                                      children:
                                        selectedEntry.codeSnippets[0].title ||
                                        "Embedded Code",
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsx("span", {
                                  className:
                                    "text-[10px] bg-theme-bg/80 border border-theme-border/50 px-1.5 py-0.2 rounded uppercase text-theme-muted",
                                  children:
                                    selectedEntry.codeSnippets[0].language,
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsx("pre", {
                              className:
                                "p-4 overflow-x-auto text-[11px] font-mono text-left leading-relaxed text-theme-text bg-theme-bg/40 max-h-96",
                              children: /* @__PURE__ */ jsx("code", {
                                children: selectedEntry.codeSnippets[0].code,
                              }),
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              })
            : /* ================== BLANK/SELECT STATE ================== */
              /* @__PURE__ */ jsxs("div", {
                className:
                  "flex-1 flex flex-col items-center justify-center text-center p-8",
                id: "journal_viewer_blank",
                children: [
                  /* @__PURE__ */ jsx(FileText, {
                    className: "w-12 h-12 text-theme-muted/35 mb-3",
                  }),
                  /* @__PURE__ */ jsx("h3", {
                    className: "font-display text-base font-semibold",
                    children: "No Log Selected",
                  }),
                  /* @__PURE__ */ jsx("p", {
                    className: "text-xs text-theme-muted max-w-sm mt-1",
                    children:
                      "Select an entry from the sidebar to review detailed session achievements, or create a brand new log.",
                  }),
                  /* @__PURE__ */ jsxs("button", {
                    id: "blank_create_journal_btn",
                    onClick: handleCreateNewClick,
                    className:
                      "mt-4 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all box-glow",
                    children: [
                      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsx("span", {
                        children: "Log Today's Session",
                      }),
                    ],
                  }),
                ],
              }),
      }),
    ],
  });
};
export { JournalView };
