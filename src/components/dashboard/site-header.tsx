import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SiteHeaderProps {
  className?: string;
  onMenuClick?: () => void;
  onNavigateHome?: () => void;
}

export function SiteHeader({ className, onMenuClick, onNavigateHome }: SiteHeaderProps) {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-3">
        <div className="flex items-center gap-2 md:gap-4">
          <Logo onClick={onNavigateHome} />
          <div className="hidden md:flex">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] md:w-[300px]"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}