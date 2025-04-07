import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log('Initializing auth state...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setUser(null);
            // Clear any stale session data
            await supabase.auth.signOut();
          }
          return;
        }

        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          // Check if session is expired
          const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
          if (expiresAt && expiresAt < new Date()) {
            console.log('Session expired, signing out...');
            if (mounted) {
              setUser(null);
              await supabase.auth.signOut();
            }
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            });
          }
        } else {
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          // Clear any problematic session data
          await supabase.auth.signOut();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initialize();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Check session expiration
          const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
          if (expiresAt && expiresAt < new Date()) {
            console.log('New session already expired, signing out...');
            if (mounted) {
              setUser(null);
              await supabase.auth.signOut();
            }
            return;
          }

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            });
            // Navigate to dashboard or intended location
            const intendedPath = location.state?.from?.pathname || '/dashboard';
            navigate(intendedPath, { replace: true });
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
          if (mounted) {
            setUser(null);
            await supabase.auth.signOut();
          }
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (mounted) {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            navigate('/login', { replace: true });
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.session || !authData.user) {
        throw new Error('Login failed - no session data');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to log in',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Email already exists');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Signup failed');

      toast({
        title: 'Success',
        description: 'Please check your email to confirm your account.',
      });

      // Navigate to email confirmation page
      navigate('/email-confirmation', { 
        state: { email },
        replace: true 
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to log out',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 