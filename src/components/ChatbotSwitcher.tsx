"use client"

import * as React from "react"
import { Bot, ChevronsUpDown, Plus, Circle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar-menu"
import { useSidebar } from "@/components/ui/sidebar"

interface Chatbot {
  id: string
  name: string
  status: 'online' | 'training' | 'offline'
  lastTrained?: string
}

const statusColors = {
  online: 'text-green-500',
  training: 'text-yellow-500',
  offline: 'text-gray-400'
}

export function ChatbotSwitcher({
  chatbots = [
    {
      id: '1',
      name: 'Customer Support',
      status: 'online' as const,
      lastTrained: '2 days ago'
    },
    {
      id: '2',
      name: 'Sales Assistant',
      status: 'training' as const,
      lastTrained: '3 hours ago'
    },
    {
      id: '3',
      name: 'Product Advisor',
      status: 'offline' as const,
      lastTrained: '5 days ago'
    }
  ]
}: {
  chatbots?: Chatbot[]
}) {
  const { open } = useSidebar();
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeChatbot, setActiveChatbot] = React.useState(chatbots[0])
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Close dropdown when sidebar collapses
  React.useEffect(() => {
    if (!open) {
      setIsOpen(false);
    }
  }, [open]);

  const handleChatbotSelect = (chatbot: Chatbot) => {
    setActiveChatbot(chatbot)
    setIsOpen(false)
  }

  return (
    <SidebarMenu>
      <div className="relative">
        <SidebarMenuButton
          ref={buttonRef}
          size="lg"
          onClick={() => open && setIsOpen(!isOpen)}
          className="w-full"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bot className="size-4" />
          </div>
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="grid flex-1 text-left text-sm leading-tight overflow-hidden"
              >
                <span className="truncate font-semibold">
                  {activeChatbot.name}
                </span>
                <span className="truncate text-xs text-muted-foreground flex items-center gap-1.5">
                  <Circle className={`h-2 w-2 ${statusColors[activeChatbot.status]} fill-current`} />
                  {activeChatbot.status}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {open && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronsUpDown className="size-4 opacity-50" />
            </motion.div>
          )}
        </SidebarMenuButton>
        
        <AnimatePresence>
          {isOpen && open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                width: buttonRef.current?.offsetWidth,
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                left: 0,
                zIndex: 50,
              }}
              className="overflow-hidden bg-popover border rounded-lg shadow-lg"
            >
              <div className="py-2">
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium text-muted-foreground">
                    Your Chatbots
                  </p>
                </div>
                {chatbots.map((chatbot) => (
                  <button
                    key={chatbot.id}
                    onClick={() => handleChatbotSelect(chatbot)}
                    className="flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground group"
                  >
                    <div className="flex size-6 items-center justify-center rounded-lg border bg-background">
                      <Bot className="size-4 shrink-0" />
                    </div>
                    <div className="flex-1 truncate text-left">
                      <div className="font-medium">{chatbot.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Circle className={`h-2 w-2 ${statusColors[chatbot.status]} fill-current`} />
                        <span className="capitalize">{chatbot.status}</span>
                        {chatbot.lastTrained && (
                          <>
                            <span className="px-1">•</span>
                            <span>Updated {chatbot.lastTrained}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="px-2 py-1.5 border-t">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex size-6 items-center justify-center rounded-lg border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <span className="font-medium text-muted-foreground">
                      Add chatbot
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarMenu>
  )
}