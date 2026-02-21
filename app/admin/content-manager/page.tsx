'use client'

import { motion } from 'framer-motion'
import { ContentTable } from '@/components/admin/content-manager/content-table'

export default function ContentManagerPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Content Manager
                </h1>
                <p className="text-muted-foreground text-lg mt-1 font-medium italic">
                    One system. Universal control.
                </p>
            </motion.div>

            <ContentTable />
        </div>
    )
}
