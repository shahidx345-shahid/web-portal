'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DUMMY_PROJECTS } from '@/components/admin/project-manager/data'
import { FolderGit2, CheckCircle2, Clock4, Archive, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const statusConfig = {
    published: {
        label: 'Published',
        className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
    },
    draft: {
        label: 'Draft',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    },
    archived: {
        label: 'Archived',
        className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
    },
}

const published = DUMMY_PROJECTS.filter(p => p.status === 'published').length
const drafts = DUMMY_PROJECTS.filter(p => p.status === 'draft').length
const archived = DUMMY_PROJECTS.filter(p => p.status === 'archived').length

const stats = [
    {
        name: 'Total Projects',
        value: DUMMY_PROJECTS.length,
        icon: FolderGit2,
        gradient: 'from-violet-500 to-indigo-600',
        iconBg: 'bg-violet-500/10',
        iconColor: 'text-violet-600 dark:text-violet-400',
        trend: 'Across all categories',
    },
    {
        name: 'Published',
        value: published,
        icon: CheckCircle2,
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        trend: `${Math.round((published / DUMMY_PROJECTS.length) * 100)}% of total`,
    },
    {
        name: 'In Draft',
        value: drafts,
        icon: Clock4,
        gradient: 'from-amber-500 to-orange-500',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-600 dark:text-amber-400',
        trend: 'Awaiting review',
    },
    {
        name: 'Archived',
        value: archived,
        icon: Archive,
        gradient: 'from-slate-500 to-gray-600',
        iconBg: 'bg-slate-500/10',
        iconColor: 'text-slate-600 dark:text-slate-400',
        trend: 'Historical records',
    },
]

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const cardAnim = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function DashboardPage() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1 font-medium text-sm">
                    Overview of your Company Project Content Management System.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={container} initial="hidden" animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
            >
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <motion.div key={stat.name} variants={cardAnim}>
                            <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                                <Card className="relative overflow-hidden border-border/60 bg-card shadow-sm rounded-2xl cursor-pointer group">
                                    {/* Subtle top gradient bar */}
                                    <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', stat.gradient)} />
                                    <CardContent className="p-5 pt-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.name}</p>
                                                <p className="text-3xl font-black text-foreground mt-1 tabular-nums">{stat.value}</p>
                                            </div>
                                            <div className={cn('p-2.5 rounded-xl', stat.iconBg, stat.iconColor)}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                            <TrendingUp className="w-3 h-3" />
                                            {stat.trend}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Recent Projects */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-border/60 bg-card shadow-sm rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500/10">
                                <FolderGit2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-foreground">Recent Projects</h2>
                                <p className="text-xs text-muted-foreground">Latest additions to the project system</p>
                            </div>
                        </div>
                        <Link href="/admin/project-manager">
                            <Button variant="ghost" size="sm" className="gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-500/10 rounded-xl text-xs font-semibold">
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>

                    <div className="divide-y divide-border/30">
                        {DUMMY_PROJECTS.slice(0, 5).map((project, i) => {
                            const cfg = statusConfig[project.status]
                            return (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 + i * 0.06 }}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-accent/5 transition-colors group"
                                >
                                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center shadow-sm', project.thumbnail)}>
                                        <FolderGit2 className="w-4 h-4 text-white/80" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            {project.title}
                                        </p>
                                        <span className="text-[11px] text-muted-foreground">
                                            {project.category} · {project.type}
                                        </span>
                                    </div>
                                    <div className="hidden sm:flex flex-wrap gap-1 max-w-[150px]">
                                        {project.techStack.slice(0, 2).map(t => (
                                            <span key={t} className="text-[10px] bg-muted border border-border/50 rounded-md px-1.5 py-0.5 text-foreground/70 font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <Badge className={cn('text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-0.5 whitespace-nowrap', cfg.className)}>
                                        {cfg.label}
                                    </Badge>
                                    <span className="hidden md:block text-xs text-muted-foreground whitespace-nowrap">{project.createdAt}</span>
                                </motion.div>
                            )
                        })}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}
