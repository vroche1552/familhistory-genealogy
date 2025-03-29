
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AuthModal from '../auth/AuthModal';
import { Tree } from 'lucide-react';

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('signup');

  const openAuthModal = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden py-20 md:py-32 cyber-grid">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-cyber-accent/5 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-cyber-purple/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center mb-6">
          <Tree className="h-12 w-12 mr-2 text-cyber-accent" />
          <h1 className="text-4xl md:text-6xl font-bold cyber-text-gradient">
            CyberFamily
          </h1>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-cyber-foreground max-w-3xl">
          Build your family history with our modern, interactive family tree platform
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Discover your roots. Connect your branches. Preserve your legacy in a sleek, secure digital format for generations to come.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button 
            size="lg" 
            onClick={() => openAuthModal('signup')}
            className="bg-cyber-accent hover:bg-cyber-accent/80 text-black font-medium"
          >
            Get Started for Free
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => openAuthModal('login')}
            className="cyber-button"
          >
            Log in to Your Account
          </Button>
        </div>

        <div className="mt-20">
          <div className="relative mx-auto border border-cyber-accent/30 rounded-md overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.15)] max-w-4xl">
            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-cyber-accent to-cyber-purple"></div>
            <img 
              src="https://images.unsplash.com/photo-1590531772007-7256de9b58d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Family Tree Interface" 
              className="w-full h-auto rounded-b-md opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        type={authType} 
        onSwitchType={(type) => setAuthType(type)} 
      />
    </div>
  );
};

export default Hero;
