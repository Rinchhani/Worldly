import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('worldly_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Load current user profile on mount
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('worldly_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('worldly_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('worldly_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.success && res.token) {
      localStorage.setItem('worldly_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('worldly_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        authModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

