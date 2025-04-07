import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Redirect to dashboard after successful confirmation
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during email confirmation:', error);
        navigate('/login');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Confirming your email...</span>
    </div>
  );
};

export default AuthCallback; 