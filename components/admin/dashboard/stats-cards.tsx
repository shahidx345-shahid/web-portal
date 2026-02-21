'use client'

import { motion } from 'framer-motion'
import { FileText, BookOpen, Link2, Database, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    name: 'Total Content Items',
    value: '142',
    icon: FileText,
    color: 'from-purple-500/20 to-indigo-500/20',
    trend: '+12 this month',
  },
  {
    name: 'Published Items',
    value: '98',
    icon: BookOpen,
    color: 'from-emerald-500/20 to-teal-500/20',
    trend: '69% of total',
  },
  {
    name: 'Draft Items',
    value: '44',
    icon: Link2,
    color: 'from-amber-500/20 to-orange-500/20',
    trend: 'Needs review',
  },
  {
    name: 'Audience Reach',
    value: '12.4K',
    icon: Database,
    color: 'from-blue-500/20 to-cyan-500/20',
    trend: '+15% engagement',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function StatsCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon

        return (
          <motion.div key={index} variants={cardVariants}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Card className="bg-gradient-to-br from-card via-card to-card/50 border-border/50 backdrop-blur-xl overflow-hidden relative group cursor-pointer">
                {/* Glassmorphism effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />

                <CardContent className="p-4 sm:p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 truncate">
                        {stat.name}
                      </p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground line-clamp-1">
                        {stat.value}
                      </h3>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="p-2 sm:p-3 bg-background/40 rounded-lg flex-shrink-0 ml-2"
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    </motion.div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                    className="text-xs text-muted-foreground"
                  >
                    {stat.trend}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
