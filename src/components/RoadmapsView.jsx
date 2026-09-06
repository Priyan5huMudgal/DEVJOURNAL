import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  Compass,
  Plus,
  Calendar,
  Trash2,
  CheckCircle2,
  Circle,
  Sparkles,
  X,
  PlusCircle
} from "lucide-react";
import { motion } from "motion/react";
import { roadmapService } from "../services/api";
const RoadmapsView = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState([""]);
  const [estimatedCompletion, setEstimatedCompletion] = useState("");
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
      console.error("Failed to load roadmaps:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoadmaps();
  }, []);
  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!title) {
      alert("Roadmap title is required.");
      return;
    }
    const filteredTopics = topics.map((t) => t.trim()).filter((t) => t.length > 0).map((name, index) => ({
      name,
      status: "todo",
      order: index + 1
    }));
    if (filteredTopics.length === 0) {
      alert("Please add at least one roadmap topic.");
      return;
    }
    try {
      const res = await roadmapService.createRoadmap({
        title,
        topics: filteredTopics,
        estimatedCompletion: estimatedCompletion ? new Date(estimatedCompletion) : void 0
      });
      if (res.success) {
        fetchRoadmaps();
        resetForm();
      }
    } catch (err) {
      console.error("Failed to create roadmap:", err);
    }
  };
  const handleTopicCheck = async (roadmapId, topicIndex, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "todo" : "completed";
    try {
      const res = await roadmapService.updateTopicStatus(roadmapId, topicIndex, newStatus);
      if (res.success) {
        setRoadmaps((prev) => prev.map((r) => r._id === roadmapId ? res.data : r));
      }
    } catch (err) {
      console.error("Failed to update topic status:", err);
    }
  };
  const handleDelete = async (roadmapId) => {
    try {
      const res = await roadmapService.deleteRoadmap(roadmapId);
      if (res.success) {
        setExpandedId(null);
        fetchRoadmaps();
      }
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
    }
  };
  const addTopicInputField = () => {
    setTopics((prev) => [...prev, ""]);
  };
  const updateTopicInputField = (idx, val) => {
    setTopics((prev) => {
      const updated = [...prev];
      updated[idx] = val;
      return updated;
    });
  };
  const removeTopicInputField = (idx) => {
    if (topics.length === 1) return;
    setTopics((prev) => prev.filter((_, i) => i !== idx));
  };
  const resetForm = () => {
    setTitle("");
    setTopics([""]);
    setEstimatedCompletion("");
    setShowCreate(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6 text-theme-text", id: "roadmaps_view_root", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 flex flex-col space-y-4", id: "roadmaps_sidebar", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", id: "roadmaps_sidebar_header", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Compass, { className: "w-5 h-5 text-theme-accent" }),
            /* @__PURE__ */ jsx("span", { children: "Learning Paths" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-theme-muted", children: "Custom curriculum outlines and syllabus tracking" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            id: "toggle_roadmap_creator_btn",
            onClick: () => {
              if (showCreate) resetForm();
              else setShowCreate(true);
            },
            className: "p-1.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-white flex items-center justify-center cursor-pointer transition-all box-glow",
            children: showCreate ? /* @__PURE__ */ jsx(X, { className: "w-4.5 h-4.5" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4.5 h-4.5" })
          }
        )
      ] }),
      showCreate && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: "auto" },
          className: "bg-theme-card border border-theme-border rounded-xl p-4 space-y-3",
          id: "roadmap_creator_panel",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] font-mono text-theme-accent font-semibold tracking-wider uppercase", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsx("span", { children: "Compose Learning Roadmap" })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateRoadmap, className: "space-y-3", id: "roadmap_form", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-mono text-theme-muted uppercase", children: "Curriculum Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "roadmap_title_input",
                    type: "text",
                    required: true,
                    placeholder: "e.g. Advanced System Design, LeetCode Trees...",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text placeholder-theme-muted/30 focus:outline-none focus:border-theme-accent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[9px] font-mono text-theme-muted uppercase", children: "Syllabus Topics" }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: addTopicInputField,
                      className: "text-[10px] font-mono text-theme-accent hover:underline flex items-center gap-0.5 bg-transparent",
                      children: [
                        /* @__PURE__ */ jsx(PlusCircle, { className: "w-3 h-3" }),
                        /* @__PURE__ */ jsx("span", { children: "Add Item" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-1.5 max-h-44 overflow-y-auto pr-1", id: "topic_inputs_list", children: topics.map((topic, index) => /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: `topic_input_${index}`,
                      type: "text",
                      required: true,
                      placeholder: `Topic #${index + 1}`,
                      value: topic,
                      onChange: (e) => updateTopicInputField(index, e.target.value),
                      className: "flex-1 bg-theme-bg border border-theme-border rounded-md px-2.5 py-1 text-xs text-theme-text placeholder-theme-muted/30 focus:outline-none"
                    }
                  ),
                  topics.length > 1 && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeTopicInputField(index),
                      className: "p-1 text-theme-muted hover:text-red-400 border border-theme-border rounded bg-theme-bg",
                      children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }, index)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-mono text-theme-muted uppercase", children: "Target Date" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "roadmap_deadline_input",
                    type: "date",
                    value: estimatedCompletion,
                    onChange: (e) => setEstimatedCompletion(e.target.value),
                    className: "w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-accent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1.5 pt-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: resetForm,
                    className: "px-2.5 py-1 text-[10px] border border-theme-border text-theme-muted rounded font-medium",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    id: "roadmap_submit_btn",
                    type: "submit",
                    className: "px-3.5 py-1 bg-theme-accent hover:bg-theme-accent-hover text-white text-[10px] font-semibold rounded box-glow",
                    children: "Save Roadmap"
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-3 overflow-y-auto flex-1 pr-1", id: "roadmaps_list_cards", children: loading ? /* @__PURE__ */ jsxs("div", { className: "py-12 text-center", id: "roadmaps_sidebar_loader", children: [
        /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-theme-muted font-mono mt-2 animate-pulse", children: "RECONCILING SYLLABI..." })
      ] }) : roadmaps.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-12 border border-dashed border-theme-border rounded-xl text-center p-6 bg-theme-card/15", id: "roadmaps_sidebar_empty", children: [
        /* @__PURE__ */ jsx(Compass, { className: "w-8 h-8 text-theme-muted/40 mx-auto mb-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted", children: "No active curricula. Plan your first roadmap today!" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowCreate(true), className: "mt-2 text-xs text-theme-accent hover:underline font-mono", children: "Add learning path +" })
      ] }) : roadmaps.map((r) => {
        const isSelected = expandedId === r._id;
        const completedCount = r.topics.filter((t) => t.status === "completed").length;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            id: `roadmap_card_${r._id}`,
            onClick: () => setExpandedId(r._id),
            className: `p-4 rounded-xl border text-left cursor-pointer transition-all ${isSelected ? "bg-theme-accent/15 border-theme-accent/70 shadow-sm box-glow" : "bg-theme-card/30 border-theme-border hover:border-theme-border/80"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-theme-text leading-tight truncate", children: r.title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-mono text-theme-muted mt-1", children: [
                    "Syllabus Status: ",
                    completedCount,
                    "/",
                    r.topics.length,
                    " steps completed"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono font-bold text-theme-accent shrink-0", children: [
                  r.progressPercentage,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full h-1 bg-theme-bg rounded-full overflow-hidden mt-3 border border-theme-border/30", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-theme-accent transition-all duration-300",
                  style: { width: `${r.progressPercentage}%` }
                }
              ) })
            ]
          },
          r._id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lg:col-span-7 flex flex-col bg-theme-card/30 border border-theme-border rounded-xl min-h-[440px]", id: "roadmaps_active_details", children: (() => {
      const activeRoadmap = roadmaps.find((r) => r._id === expandedId);
      if (!activeRoadmap) {
        return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center p-8", id: "roadmap_blank_pane", children: [
          /* @__PURE__ */ jsx(Compass, { className: "w-10 h-10 text-theme-muted/30 mb-2" }),
          /* @__PURE__ */ jsx("h3", { className: "font-display text-sm font-semibold", children: "Select Syllabus Outline" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted max-w-sm mt-1", children: "Click any curriculum pathway on the sidebar to review detailed checkbox structures, progress rollups, and estimated completions." })
        ] });
      }
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", id: "roadmap_details_workspace", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-theme-border px-6 py-4 bg-theme-card/50 flex justify-between items-center", id: "roadmap_details_header", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h1", { className: "font-display text-base font-semibold tracking-tight text-theme-text leading-tight truncate", children: activeRoadmap.title }),
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-theme-muted flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 shrink-0" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Estimated Completion: ",
                activeRoadmap.estimatedCompletion ? new Date(activeRoadmap.estimatedCompletion).toLocaleDateString(void 0, { month: "long", day: "numeric", year: "numeric" }) : "No set timeline"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              id: `roadmap_active_delete_${activeRoadmap._id}`,
              onClick: () => handleDelete(activeRoadmap._id),
              className: "p-1.5 rounded-lg border border-theme-border hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-theme-muted cursor-pointer transition-all",
              title: "Delete Syllabus",
              children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 bg-theme-accent/5 border-b border-theme-border/60 flex items-center justify-between gap-6", id: "roadmap_progress_box", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1 flex-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-theme-muted uppercase", children: "Curriculum Coverage" }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-2 bg-theme-bg border border-theme-border/60 rounded-full overflow-hidden mt-1", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-theme-accent transition-all duration-300",
                style: { width: `${activeRoadmap.progressPercentage}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center shrink-0", id: "progress_percentage_circle", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-3xl font-display font-bold text-glow", children: [
              activeRoadmap.progressPercentage,
              "%"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[9px] font-mono text-theme-muted uppercase tracking-wider", children: "coverage" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 p-6 overflow-y-auto space-y-3", id: "roadmap_topic_items_list", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xs font-mono text-theme-muted uppercase tracking-wider mb-2", children: "Checklist Milestones" }),
          activeRoadmap.topics.map((topic, idx) => {
            const isChecked = topic.status === "completed";
            return /* @__PURE__ */ jsxs(
              "div",
              {
                id: `topic_checklist_row_${idx}`,
                className: `flex items-start gap-4 p-4 rounded-xl border transition-all ${isChecked ? "bg-theme-bg/30 border-theme-border/50 opacity-60" : "bg-theme-card/60 border-theme-border/70 hover:border-theme-border"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      id: `topic_checklist_btn_${idx}`,
                      onClick: () => handleTopicCheck(activeRoadmap._id, idx, topic.status),
                      className: `mt-0.5 shrink-0 transition-all cursor-pointer ${isChecked ? "text-emerald-500" : "text-theme-muted hover:text-theme-accent"}`,
                      children: isChecked ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 fill-emerald-500/10" }) : /* @__PURE__ */ jsx(Circle, { className: "w-5 h-5" })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-mono text-theme-muted block uppercase", children: [
                      "Topic #",
                      idx + 1
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: `text-sm font-medium leading-tight mt-0.5 ${isChecked ? "line-through text-theme-muted" : "text-theme-text"}`, children: topic.name })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `text-[9px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 ${isChecked ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/10" : "bg-theme-bg text-theme-muted border-theme-border"}`, children: topic.status })
                ]
              },
              idx
            );
          })
        ] })
      ] });
    })() })
  ] });
};
export {
  RoadmapsView
};
