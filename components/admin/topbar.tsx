'use client'

// Force recompile - fix caching issue
import { useTheme } from 'next-themes'
import { Moon, Sun, Search, Bell, Settings, Filter, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSidebar } from './sidebar-context'
import { cn } from '@/lib/utils'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const { toggle, isCollapsed } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [notificationCount, setNotificationCount] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  const buttonVariants = {
    hover: { scale: 1.08 },
    tap: { scale: 0.92 },
  }

  return (
    <header className={cn(
      "fixed top-0 right-0 h-16 bg-background/80 border-b border-border/50 backdrop-blur-xl z-30 transition-all duration-300 ease-in-out left-0",
      isCollapsed ? "md:left-20" : "md:left-64"
    )}>
      <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggle}
            className="p-2 md:hidden hover:bg-muted/50 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {/* Left: Search Bar - Hidden on mobile, visible on md+ */}
          <motion.div
            className="hidden md:flex flex-1 max-w-md items-center relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div className="absolute left-3 text-muted-foreground group-hover:text-primary transition-colors">
              <Search className="w-4 h-4" />
            </motion.div>
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/50 focus:bg-muted transition-colors border-border/50"
            />
          </motion.div>
        </div>

        {/* Right Side Actions */}
        <motion.div
          className="flex items-center gap-1 sm:gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mobile Search - Visible only on small screens */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="p-2 md:hidden hover:bg-muted/50 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Filter Button */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-foreground/70 hover:text-foreground hidden sm:flex"
          >
            <Filter className="w-5 h-5" />
          </motion.button>

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
            >
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </motion.button>
          )}

          {/* Notifications */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-foreground/70 hover:text-foreground relative"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg"
              >
                {notificationCount}
              </motion.span>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* User Profile - Visible only on medium screens and up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex items-center gap-3 ml-2 pl-2 border-l border-border/50"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-right">
              <p className="text-xs sm:text-sm font-semibold text-foreground">Kay Hackett</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold"
            >
              K
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}
