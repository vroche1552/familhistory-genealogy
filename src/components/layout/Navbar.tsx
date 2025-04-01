import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Globe, Palette } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useGetFamilyTreeQuery } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { data: familyTree } = useGetFamilyTreeQuery('1'); // Get the first family tree

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold">
            {t('common.app_name')}
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/tree">
              <Button variant={isActive('/tree') ? 'default' : 'ghost'}>
                {t('common.tree')}
              </Button>
            </Link>
            <Link to={familyTree ? `/family/${familyTree.id}` : '/family/1'}>
              <Button variant={isActive('/family') ? 'default' : 'ghost'}>
                {t('common.family')}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant={isActive('/dashboard') ? 'default' : 'ghost'}>
                {t('common.dashboard')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark-blue')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Blue</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
