'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSidebar } from './sidebar-context'
import { Home, FolderGit2, BarChart3, Settings, Database, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Project Manager', href: '/admin/project-manager', icon: FolderGit2 },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isCollapsed, toggleCollapse, close } = useSidebar()

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  }

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo/Brand Area */}
      <div className={cn(
        "h-20 flex items-center px-6 border-b border-sidebar-border/30 backdrop-blur-sm relative",
        !isMobile && isCollapsed && "justify-center px-0"
      )}>
        <div className={cn("flex items-center gap-3", !isMobile && isCollapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-lg tracking-tight text-sidebar-foreground"
            >
              KUSME
            </motion.div>
          )}
        </div>

        {isMobile && (
          <button
            onClick={close}
            className="absolute right-4 p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
        {navigation.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <motion.div
              key={item.name}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link href={item.href} onClick={isMobile ? close : undefined}>
                <motion.div
                  whileHover={{ x: isCollapsed && !isMobile ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative',
                      isActive
                        ? 'bg-white/10 text-sidebar-foreground shadow-lg'
                        : 'text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground',
                      !isMobile && isCollapsed && "justify-center px-0"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={isMobile ? "activeIndicatorMobile" : "activeIndicator"}
                        className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-500 rounded-xl opacity-10"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex-shrink-0">
                      <Icon
                        className={cn(
                          'w-6 h-6 transition-colors',
                          isActive ? 'text-purple-300' : 'text-sidebar-foreground/70'
                        )}
                      />
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          'text-lg font-medium whitespace-nowrap relative z-10',
                          isActive ? 'font-bold text-white' : 'text-white/80'
                        )}
                      >
                        {item.name}
                      </motion.span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {!isMobile && isCollapsed && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-border shadow-md">
                        {item.name}
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer User Profile */}
      <div className={cn(
        "border-t border-sidebar-border/30 p-4 backdrop-blur-sm",
        !isMobile && isCollapsed && "px-2"
      )}>
        <div className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors",
          !isMobile && isCollapsed && "justify-center px-0"
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
            K
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-sidebar-foreground truncate">
                Kay Hackett
              </p>
              <p className="text-sm font-medium text-sidebar-foreground/60 uppercase tracking-widest">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle - Only desktop */}
      {!isMobile && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-24 bg-purple-500 text-white rounded-full p-1 shadow-lg border-2 border-background z-50 hover:bg-purple-600 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      )}
    </>
  )

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-to-b from-sidebar to-sidebar/95 shadow-2xl z-40 flex flex-col border-r border-sidebar-border/30 transition-all duration-300 ease-in-out hidden md:flex",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
      />
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-screen w-[280px] bg-gradient-to-b from-sidebar to-sidebar/95 z-[60] flex flex-col md:hidden"
      >
        {sidebarContent(true)}
      </motion.aside>
    </>
  )
}
