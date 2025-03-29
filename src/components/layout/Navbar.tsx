import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Trees, User, Search } from 'lucide-react';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');

  const openAuthModal = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Trees className="h-8 w-8 mr-2 text-cyber-accent" />
              <span className="text-xl font-bold cyber-text-gradient">CyberFamily</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-cyber-foreground hover:text-cyber-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-cyber-foreground hover:text-cyber-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-cyber-foreground hover:text-cyber-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <Button variant="outline" className="cyber-button" onClick={() => openAuthModal('login')}>
                Login
              </Button>
              <Button className="bg-cyber-accent hover:bg-cyber-accent/80 text-black" onClick={() => openAuthModal('signup')}>
                Sign Up
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyber-foreground hover:text-cyber-accent focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cyber-dark/90 backdrop-blur-md animate-fade-in">
            <Link to="/" className="text-cyber-foreground hover:text-cyber-accent block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/features" className="text-cyber-foreground hover:text-cyber-accent block px-3 py-2 rounded-md text-base font-medium">
              Features
            </Link>
            <Link to="/about" className="text-cyber-foreground hover:text-cyber-accent block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Button variant="outline" className="w-full mt-2 cyber-button" onClick={() => openAuthModal('login')}>
              Login
            </Button>
            <Button className="w-full mt-2 bg-cyber-accent hover:bg-cyber-accent/80 text-black" onClick={() => openAuthModal('signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        type={authType} 
        onSwitchType={(type) => setAuthType(type)} 
      />
    </nav>
  );
};

export default Navbar;
