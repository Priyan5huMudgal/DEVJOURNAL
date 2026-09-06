import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState("light");
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            const userTheme = res.data.preferences?.theme || "light";
            setThemeState(userTheme);
            document.documentElement.setAttribute("data-theme", userTheme);
            localStorage.setItem("theme", userTheme);
          } else {
            localStorage.removeItem("accessToken");
          }
        } catch (error) {
          console.warn("Session restoration failed. Please sign in again.");
          localStorage.removeItem("accessToken");
        }
      } else {
        const cachedTheme = localStorage.getItem("theme") || "light";
        setThemeState(cachedTheme);
        document.documentElement.setAttribute("data-theme", cachedTheme);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data.user);
        const userTheme = res.data.user.preferences?.theme || "light";
        setThemeState(userTheme);
        document.documentElement.setAttribute("data-theme", userTheme);
        localStorage.setItem("theme", userTheme);
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (err) {
      throw err;
    }
  };
  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.success && res.data) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data.user);
        const userTheme = res.data.user.preferences?.theme || "light";
        setThemeState(userTheme);
        document.documentElement.setAttribute("data-theme", userTheme);
        localStorage.setItem("theme", userTheme);
      } else {
        throw new Error(res.message || "Registration failed");
      }
    } catch (err) {
      throw err;
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Error during logout API call:", e);
    } finally {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("theme");
      document.documentElement.setAttribute("data-theme", "light");
      setThemeState("light");
      setLoading(false);
    }
  };
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.preferences?.theme) {
      setThemeState(updatedUser.preferences.theme);
      document.documentElement.setAttribute("data-theme", updatedUser.preferences.theme);
    }
  };
  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    if (user) {
      try {
        const res = await authService.updateProfile({
          name: user.name,
          preferences: {
            theme: newTheme,
            notifications: user.preferences?.notifications ?? true
          }
        });
        if (res.success && res.data) {
          setUser(res.data);
        }
      } catch (err) {
        console.warn("Could not persist theme update to database:", err);
      }
    }
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, loading, theme, login, register, logout, updateUser, setTheme }, children });
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export {
  AuthProvider,
  useAuth
};
