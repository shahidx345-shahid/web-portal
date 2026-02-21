'use client'

import { Analytics } from '@/components/admin/analytics/charts'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Monitor your website performance and user activity.</p>
      </div>

      <Analytics />
    </motion.div>
  )
}
