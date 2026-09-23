import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/signin', { email, password });
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async ({ name, email, password }) => {
    const res = await api.post('/auth/signup', { name, email, password });
    if (res.success && res.data?.user) {
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/signout');
    } finally {
      setUser(null);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
        changePassword,
        isAdmin: user?.role === 'ADMIN'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
