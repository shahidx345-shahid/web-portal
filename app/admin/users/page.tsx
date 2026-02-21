'use client'

import { UsersTable } from '@/components/admin/users/users-table'
import { motion } from 'framer-motion'

export default function UsersPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Admin Users</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage administrator users and their permissions.</p>
      </div>

      <UsersTable />
    </motion.div>
  )
}
