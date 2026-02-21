'use client'

import { AITrainingTable } from '@/components/admin/ai-training/ai-training-table'
import { motion } from 'framer-motion'

export default function AITrainingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">AI Training</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage datasets and training materials for AI models.</p>
      </div>

      <AITrainingTable />
    </motion.div>
  )
}
