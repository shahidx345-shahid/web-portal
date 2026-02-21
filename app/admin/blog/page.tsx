'use client'

import { BlogTable } from '@/components/admin/blog/blog-table'
import { motion } from 'framer-motion'

export default function BlogPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Blog Portfolio</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your blog posts and portfolio articles.</p>
      </div>

      <BlogTable />
    </motion.div>
  )
}
