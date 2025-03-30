
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Brain, ChevronDown } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const { t } = useLanguage();

  const openAuthModal = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="sticky top-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-border/30" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Go to home page">
              <Brain className="h-8 w-8 mr-2 text-cyber-accent" aria-hidden="true" />
              <span className="text-xl font-bold cyber-text-gradient">{t('app_name')}</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <NavigationMenu className="ml-10">
              <NavigationMenuList className="flex items-center space-x-4">
                <NavigationMenuItem>
                  <Link to="/" className="text-cyber-foreground hover:text-cyber-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {t('home')}
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-cyber-foreground hover:text-cyber-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {t('features')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/tree"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {t('family_tree')}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {t('tree_builder_desc')}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">{t('user_profiles')}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t('user_profiles_desc')}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">{t('privacy_controls')}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t('privacy_controls_desc')}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about" className="text-cyber-foreground hover:text-cyber-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    {t('about')}
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <LanguageSwitcher />
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Button variant="outline" className="cyber-button" onClick={() => openAuthModal('login')}>
                    {t('login')}
                  </Button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Button className="bg-cyber-accent hover:bg-cyber-accent/80 text-black" onClick={() => openAuthModal('signup')}>
                    {t('signup')}
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyber-foreground hover:text-cyber-accent focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cyber-dark/90 backdrop-blur-md animate-fade-in">
            <Link to="/" className="text-cyber-foreground hover:text-cyber-accent block px-3 py-2 rounded-md text-base font-medium">
              {t('home')}
            </Link>
            <Link to="/features" className="text-cyber-foreground hover:text-cyber-accent block px-3 py-2 rounded-md text-base font-medium">
              {t('features')}
            </Link>
            <Link to="/about" className="text-cyber-foreground hover:text-cyber-accent block px-3 py-2 rounded-md text-base font-medium">
              {t('about')}
            </Link>
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            <Button variant="outline" className="w-full mt-2 cyber-button" onClick={() => openAuthModal('login')}>
              {t('login')}
            </Button>
            <Button className="w-full mt-2 bg-cyber-accent hover:bg-cyber-accent/80 text-black" onClick={() => openAuthModal('signup')}>
              {t('signup')}
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
