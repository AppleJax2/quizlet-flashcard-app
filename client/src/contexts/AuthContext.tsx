import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, username: string, confirmPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await apiClient.get<User>('/auth/me');
        if (!response.error && response.data) {
          setUser(response.data);
        }
      }
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
      if (response.error) {
        setError(response.error.message || 'An error occurred during login');
        throw new Error(response.error.message);
      }
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      throw err;
    }
  };

  const signup = async (email: string, password: string, username: string, confirmPassword: string) => {
    try {
      setError(null);
      const payload = { email, password, username, confirmPassword };
      console.log('--- Preparing to send registration payload ---');
      console.log('Payload Content:', JSON.stringify(payload, null, 2));
      console.log('Payload Keys:', Object.keys(payload));
      console.log('confirmPassword presence:', 'confirmPassword' in payload);
      console.log('confirmPassword value:', payload.confirmPassword);
      console.log('-----------------------------------------------');
      
      // Ensure all required fields are present
      if (!email || !password || !username || !confirmPassword) {
        throw new Error('All fields are required');
      }
      
      const response = await apiClient.post<AuthResponse>('/auth/register', payload);
      if (response.error) {
        setError(response.error.message || 'An error occurred during signup');
        throw new Error(response.error.message);
      }
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/logout');
      if (response.error) {
        setError(response.error.message || 'An error occurred during logout');
        throw new Error(response.error.message);
      }
      localStorage.removeItem('token');
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred during logout');
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 