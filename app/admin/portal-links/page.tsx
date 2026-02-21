'use client'

import { PortalTable } from '@/components/admin/portal-links/portal-table'
import { motion } from 'framer-motion'

export default function PortalLinksPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Portal Links</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage external links and developer resources.</p>
      </div>

      <PortalTable />
    </motion.div>
  )
}
