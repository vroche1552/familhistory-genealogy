import React, { createContext, useState, useEffect } from 'react';
import { useToast } from '@/shared/components/ui/use-toast';
import { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // TODO: Validate token with backend
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual login with backend
      const mockUser = {
        id: '1',
        email,
        name: 'John Doe'
      };
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: 'Success',
        description: 'Logged in successfully'
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Error',
        description: 'Login failed. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement actual signup with backend
      const mockUser = {
        id: '1',
        email,
        name
      };
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: 'Success',
        description: 'Account created successfully'
      });
    } catch (error) {
      console.error('Signup failed:', error);
      toast({
        title: 'Error',
        description: 'Signup failed. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: 'Success',
      description: 'Logged out successfully'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 