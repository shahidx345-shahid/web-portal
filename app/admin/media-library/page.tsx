'use client'

import { MediaGrid } from '@/components/admin/media-library/media-grid'
import { motion } from 'framer-motion'

export default function MediaLibraryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Media Library</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Upload and manage your website assets.</p>
      </div>

      <MediaGrid />
    </motion.div>
  )
}
