import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      verifyAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAuth = async () => {
    try {
      const response = await authApi.verifyToken();
      setUser(response.data.user);
    } catch (error) {
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const { token, user } = response.data;
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      removeToken();
      setUser(null);
      window.location.href = '/login';
    }
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { token, user } = response.data;
    setToken(token);
    setUser(user);
    return user;
  };

  const updateProfile = async (data) => {
    const response = await authApi.updateProfile(data);
    setUser(response.data.user);
    return response.data.user;
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};