'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { FolderGit2, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const ProjectTable = dynamic(
    () => import('@/components/admin/project-manager/project-table').then(m => ({ default: m.ProjectTable })),
    {
        ssr: false,
        loading: () => (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-2xl" />
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
            </div>
        ),
    }
)

export default function ProjectManagerPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
                            <FolderGit2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Unified Module</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Project Manager
                    </h1>
                    <p className="text-muted-foreground mt-1.5 text-sm font-medium max-w-2xl">
                        Manage all company &amp; portfolio projects from one place. Data is structured for AI search, chatbot training, and portfolio rendering.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-semibold self-start sm:self-auto">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI-Ready Structure
                </div>
            </div>

            {/* Main Table */}
            <ProjectTable />
        </motion.div>
    )
}
