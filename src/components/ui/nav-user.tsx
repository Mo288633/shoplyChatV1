import React, { useState } from 'react';
import {
  Settings,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Book,
  MessageSquareMore,
  LifeBuoy,
  Send,
  Image as ImageIcon,
  User,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { signOut } from '@/services/auth';
import { useNavigate } from '@/hooks/useNavigate';

interface NavUserProps {
  name: string;
  email: string;
  imageUrl?: string;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
}

export function NavUser({ name, email, imageUrl, onLogout, onNavigate }: NavUserProps) {
  const { open } = useSidebar();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { navigate } = useNavigate();

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'system');
    // Here you would implement the actual theme change logic
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    setFeedbackOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('home');
      onLogout?.();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={imageUrl} alt={name} />
                  <AvatarFallback className="rounded-lg">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">{email}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="top"
              align="start"
              sideOffset={8}
            >
              <DropdownMenuItem onClick={() => onNavigate?.('account')}>
                <User className="mr-2 h-4 w-4" />
                Account settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium">
                  Theme
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
                  <DropdownMenuRadioItem value="light">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate?.('docs')}>
                <Book className="mr-2 h-4 w-4" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFeedbackOpen(true)}>
                <MessageSquareMore className="mr-2 h-4 w-4" />
                Feedback
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send feedback</DialogTitle>
            <DialogDescription>
              Ideas on how to improve this page. Use the Support Form for technical issues.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="grid gap-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Your feedback..."
              />
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="h-8 w-8">
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Attach screenshot</span>
                </Button>
                <span className="text-xs text-muted-foreground">
                  Attach screenshots by clicking or pasting
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                Have a technical issue? Contact{" "}
                <a href="#" className="text-primary hover:underline">
                  support
                </a>{" "}
                or{" "}
                <a href="#" className="text-primary hover:underline">
                  browse our docs
                </a>
                .
              </div>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Send feedback
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}