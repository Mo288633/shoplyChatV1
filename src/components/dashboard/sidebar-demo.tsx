import React, { useState } from "react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup,
  SidebarFooter,
  SidebarLink 
} from "@/components/ui/sidebar";
import { ChatbotSwitcher } from "@/components/ChatbotSwitcher";
import { SiteHeader } from "./site-header";
import { NavUser } from "@/components/ui/nav-user";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";

interface SidebarDemoProps {
  onNavigateHome: () => void;
}

export function SidebarDemo({ onNavigateHome }: SidebarDemoProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setOpen(false);
    if (page === 'home') {
      onNavigateHome();
    } else {
      // Navigate to other pages using the App's routing state
      window.location.hash = page;
      const event = new CustomEvent('navigate', { detail: { page } });
      window.dispatchEvent(event);
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: onNavigateHome,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <SiteHeader 
        onMenuClick={() => setOpen(!open)} 
        onNavigateHome={onNavigateHome}
      />
      <div className="flex-1 flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarHeader>
            <ChatbotSwitcher />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link}
                />
              ))}
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser 
              name="John Doe"
              email="john@example.com"
              imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              onLogout={() => handleNavigate('home')}
              onNavigate={handleNavigate}
            />
          </SidebarFooter>
        </Sidebar>
        <Dashboard />
      </div>
    </div>
  );
}

const Dashboard = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-2 md:p-10 border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 min-h-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...new Array(4)].map((_, i) => (
            <div
              key={`stat-${i}`}
              className="h-20 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {[...new Array(2)].map((_, i) => (
            <div
              key={`chart-${i}`}
              className="h-[400px] rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};