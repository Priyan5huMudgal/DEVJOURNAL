import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, User, Eye, EyeOff, CodeXml, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
const AuthView = ({ onBack }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError("Please provide email and password.");
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please provide a valid email address.");
      setLoading(false);
      return;
    }
    if (!isLogin) {
      if (!name) {
        setError("Please provide your name to register.");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters for security.");
        setLoading(false);
        return;
      }
    }
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center px-4 bg-theme-bg text-theme-text transition-all duration-300 relative overflow-hidden", id: "auth_container", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-theme-accent opacity-10 blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-theme-muted opacity-10 blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "w-full max-w-md relative",
        id: "auth_card",
        children: [
          onBack && /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onBack,
              className: "absolute -top-12 left-0 text-sm flex items-center gap-1.5 text-theme-muted hover:text-theme-text transition-colors",
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
                " Back to Home"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-8 text-center", id: "brand_header", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-theme-accent/15 border border-theme-accent flex items-center justify-center mb-3 text-theme-accent box-glow", id: "brand_icon", children: /* @__PURE__ */ jsx(CodeXml, { className: "w-6 h-6 animate-pulse" }) }),
            /* @__PURE__ */ jsxs("h1", { className: "font-display text-3xl font-bold tracking-tight text-glow", id: "brand_title", children: [
              "Dev",
              /* @__PURE__ */ jsx("span", { className: "text-theme-accent", children: "Journal" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-muted mt-1 font-sans max-w-xs", id: "brand_tagline", children: "The single operating workspace for developer logs, milestones, code snippets, and learning roadmaps." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-theme-card/50 glass-effect border border-theme-border rounded-2xl p-8 shadow-xl", id: "auth_form_container", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-display font-semibold mb-6 text-center text-theme-text", id: "form_title", children: isLogin ? "Sign In to Workspace" : "Create Developer Profile" }),
            error && /* @__PURE__ */ jsxs("div", { className: "bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-5 flex items-start gap-2", id: "auth_error", children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Error:" }),
              " ",
              error
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", id: "auth_form", children: [
              !isLogin && /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", id: "input_group_name", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-theme-muted font-medium block", children: "Full Name" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-3.5 text-theme-muted", children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "auth_name_input",
                      type: "text",
                      required: true,
                      placeholder: "Enter your name",
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      className: "w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", id: "input_group_email", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-theme-muted font-medium block", children: "Email Address" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-3.5 text-theme-muted", children: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "auth_email_input",
                      type: "email",
                      required: true,
                      placeholder: "name@company.com",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      className: "w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", id: "input_group_password", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs text-theme-muted font-medium block", children: "Password" }),
                  isLogin && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => alert("Forgot password email token verification is configured on the backend routes!"),
                      className: "text-xs text-theme-accent hover:underline bg-transparent border-none cursor-pointer",
                      children: "Forgot?"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-3.5 text-theme-muted", children: /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4" }) }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "auth_password_input",
                      type: showPassword ? "text" : "password",
                      required: true,
                      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      className: "w-full bg-theme-bg/60 border border-theme-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-theme-text placeholder-theme-muted/50 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      id: "toggle_password_btn",
                      type: "button",
                      onClick: () => setShowPassword(!showPassword),
                      className: "absolute right-3 top-3 text-theme-muted hover:text-theme-text",
                      children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  id: "auth_submit_btn",
                  type: "submit",
                  disabled: loading,
                  className: "w-full bg-theme-accent hover:bg-theme-accent-hover text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                  children: loading ? /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : isLogin ? "Sign In" : "Create Profile"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 pt-6 border-t border-theme-border text-center text-xs text-theme-muted", id: "auth_toggle_prompt", children: isLogin ? /* @__PURE__ */ jsxs("p", { children: [
              "New to DevJournal?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsLogin(false),
                  className: "text-theme-accent hover:underline font-semibold cursor-pointer",
                  children: "Create developer account"
                }
              )
            ] }) : /* @__PURE__ */ jsxs("p", { children: [
              "Already registered?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsLogin(true),
                  className: "text-theme-accent hover:underline font-semibold cursor-pointer",
                  children: "Log into your workspace"
                }
              )
            ] }) })
          ] })
        ]
      }
    )
  ] });
};
export {
  AuthView
};
