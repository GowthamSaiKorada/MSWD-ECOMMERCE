// frontend/src/components/AuthProvider.jsx
import React, { createContext, useEffect, useState } from 'react';
import api, { setToken as apiSetToken } from '../api/api';

export const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setTokenState] = useState(() => localStorage.getItem('token') || null);

  // attach token to axios whenever it changes
  useEffect(() => {
    if (token) {
      apiSetToken(token);
      // try to fill user from token if not present
      if (!user) {
        const payload = parseJwt(token);
        if (payload) {
          const inferredUser = {
            id: payload.id || payload._id || payload.userId,
            role: payload.role || payload.roles || payload.user?.role,
            email: payload.email || payload.user?.email
          };
          localStorage.setItem('user', JSON.stringify(inferredUser));
          setUser(inferredUser);
        }
      }
    } else {
      apiSetToken(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (loginResponse) => {
    // server may return { token, user } or { token } or { user, token }
    const t = loginResponse?.token || (loginResponse?.data && loginResponse.data.token);
    const u = loginResponse?.user || (loginResponse?.data && loginResponse.data.user) || null;

    if (!t) {
      console.warn('No token received from login');
      return;
    }

    localStorage.setItem('token', t);
    setTokenState(t);
    apiSetToken(t);

    if (u) {
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
    } else {
      const payload = parseJwt(t);
      if (payload) {
        const inferred = {
          id: payload.id || payload._id || payload.userId,
          role: payload.role || payload.roles,
          email: payload.email
        };
        localStorage.setItem('user', JSON.stringify(inferred));
        setUser(inferred);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTokenState(null);
    setUser(null);
    apiSetToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
