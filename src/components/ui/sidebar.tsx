import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
  className,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
  className?: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  if (isDesktop) {
    return (
      <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
        <DesktopSidebar className={className}>{children}</DesktopSidebar>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </SidebarProvider>
  );
};

const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen, animate } = useSidebar();
  
  return (
    <motion.div
      className={cn(
        "h-full hidden md:flex md:flex-col flex-shrink-0 overflow-hidden bg-white dark:bg-neutral-900",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut"
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
        </DrawerHeader>
        <div className="h-full flex flex-col bg-white dark:bg-neutral-900">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const SidebarHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("px-4 py-4 border-b sticky top-0 bg-inherit z-20", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex-1 overflow-auto px-4 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarGroup = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("px-4 py-4 border-t sticky bottom-0 bg-inherit", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  
  return (
    <button
      onClick={link.onClick}
      className={cn(
        "flex items-center gap-2 group/sidebar py-2 w-full hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-3 transition-colors",
        open ? "justify-start" : "justify-center md:justify-start",
        className
      )}
      {...props}
    >
      {link.icon}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre overflow-hidden"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};