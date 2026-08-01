import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  theme: string;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  setTheme: (newTheme: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setThemeState] = useState<string>('light');

  // Load theme and check user session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            const userTheme = res.data.preferences?.theme || 'light';
            setThemeState(userTheme);
            document.documentElement.setAttribute('data-theme', userTheme);
            localStorage.setItem('theme', userTheme);
          } else {
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.warn('Session restoration failed. Please sign in again.');
          localStorage.removeItem('accessToken');
        }
      } else {
        // Apply default or cached local theme
        const cachedTheme = localStorage.getItem('theme') || 'light';
        setThemeState(cachedTheme);
        document.documentElement.setAttribute('data-theme', cachedTheme);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem('accessToken', res.data.accessToken);
        setUser(res.data.user);
        const userTheme = res.data.user.preferences?.theme || 'light';
        setThemeState(userTheme);
        document.documentElement.setAttribute('data-theme', userTheme);
        localStorage.setItem('theme', userTheme);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.success && res.data) {
        localStorage.setItem('accessToken', res.data.accessToken);
        setUser(res.data.user);
        const userTheme = res.data.user.preferences?.theme || 'light';
        setThemeState(userTheme);
        document.documentElement.setAttribute('data-theme', userTheme);
        localStorage.setItem('theme', userTheme);
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Error during logout API call:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('theme');
      document.documentElement.setAttribute('data-theme', 'light');
      setThemeState('light');
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (updatedUser.preferences?.theme) {
      setThemeState(updatedUser.preferences.theme);
      document.documentElement.setAttribute('data-theme', updatedUser.preferences.theme);
    }
  };

  const setTheme = async (newTheme: string) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
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
        console.warn('Could not persist theme update to database:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, theme, login, register, logout, updateUser, setTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
