'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Edit2, Trash2, Plus, Eye, MoreHorizontal, Search, Filter, FolderGit2 } from 'lucide-react'
import { ProjectViewModal } from './project-view-modal'
import { DUMMY_PROJECTS, Project } from './data'
import { cn } from '@/lib/utils'

const statusConfig = {
    published: { label: 'Published', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    draft: { label: 'Draft', className: 'bg-amber-500/10  text-amber-700  dark:text-amber-400  border-amber-500/20' },
    archived: { label: 'Archived', className: 'bg-slate-500/10  text-slate-600  dark:text-slate-400  border-slate-500/20' },
}

const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

/**
 * Senior UI Engineer Note:
 * This table implements professional data-density patterns.
 * Headers use text-sm font-semibold with wide tracking.
 * Rows have increased height (py-4) for better readability.
 * Typography reflects executive dashboard standards (Inter text-sm/base).
 */
export function ProjectTable() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilter] = useState<string | null>(null)

    // View modal state
    const [viewingProject, setViewingProject] = useState<Project | null>(null)

    const filtered = projects.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus ? p.status === filterStatus : true
        return matchSearch && matchStatus
    })

    const handleDelete = (id: number) => setProjects(prev => prev.filter(p => p.id !== id))

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">

                {/* ── Dashboard Toolbar ────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border border-border/40 shadow-sm">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="pl-11 bg-background border-border/60 rounded-lg h-12 text-lg focus:ring-4 focus:ring-violet-500/5 transition-all" />
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 h-12 px-6 rounded-lg border-border/60 font-bold text-base">
                                    <Filter className="w-5 h-5" />
                                    {filterStatus ? <span className="capitalize">{filterStatus}</span> : 'Status Filter'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl w-40">
                                <DropdownMenuItem onClick={() => setFilter(null)}>All Statuses</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilter('published')}>Published</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('draft')}>Draft</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('archived')}>Archived</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={() => router.push('/admin/project-manager/new')}
                            className="gap-2 flex-1 sm:flex-none h-12 px-6 rounded-lg bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-lg shadow-violet-500/20 font-bold text-base"
                        >
                            <Plus className="w-5 h-5" /> New Project
                        </Button>
                    </div>
                </div>

                {/* ── Main Data Table ─────────────────────────────────────────── */}
                <div className="bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/40 hover:bg-transparent bg-muted/20">
                                    <TableHead className="pl-6 py-5 text-sm font-black uppercase tracking-widest text-muted-foreground/90 min-w-[280px]">Project Entity</TableHead>
                                    <TableHead className="py-5 text-sm font-black uppercase tracking-widest text-muted-foreground/90 hidden sm:table-cell min-w-[120px]">Category</TableHead>
                                    <TableHead className="py-5 text-sm font-black uppercase tracking-widest text-muted-foreground/90 hidden md:table-cell min-w-[200px]">Tech Stack</TableHead>
                                    <TableHead className="py-5 text-sm font-black uppercase tracking-widest text-muted-foreground/90 min-w-[100px]">Lifecycle</TableHead>
                                    <TableHead className="py-5 text-sm font-black uppercase tracking-widest text-muted-foreground/90 text-right pr-6 min-w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic text-base">
                                            No project records found matching your search.
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.map(project => {
                                    const cfg = statusConfig[project.status]
                                    return (
                                        <motion.tr key={project.id} variants={rowVariants} initial="hidden" animate="visible"
                                            className="border-border/30 hover:bg-muted/10 transition-colors group cursor-pointer"
                                            onClick={() => setViewingProject(project)}
                                        >
                                            {/* Project Identification */}
                                            <TableCell className="pl-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn('w-12 h-12 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center shadow-sm', project.thumbnail)}>
                                                        <FolderGit2 className="w-6 h-6 text-white/90" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-lg text-foreground truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                            {project.title}
                                                        </p>
                                                        <p className="text-base text-muted-foreground truncate mt-1 hidden sm:block max-w-[280px]">
                                                            {project.shortDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Category Tag */}
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="outline" className="text-sm font-bold px-3 py-1.5 rounded-lg bg-muted/50 border-border/60">
                                                    {project.category}
                                                </Badge>
                                            </TableCell>

                                            {/* Tech Palette */}
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex flex-wrap gap-2 max-w-[220px]">
                                                    {project.techStack.slice(0, 3).map(t => (
                                                        <span key={t} className="text-[13px] bg-muted/60 border border-border/80 rounded-md px-2.5 py-1 font-bold text-foreground">{t}</span>
                                                    ))}
                                                    {project.techStack.length > 3 && (
                                                        <span className="text-[13px] bg-muted border border-border/80 rounded-md px-2.5 py-1 font-black text-muted-foreground">+{project.techStack.length - 3}</span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Status Flag */}
                                            <TableCell>
                                                <Badge className={cn('text-[11px] font-black uppercase tracking-widest rounded-full px-4 py-1.5', cfg.className)}>
                                                    {cfg.label}
                                                </Badge>
                                            </TableCell>

                                            {/* Record Actions */}
                                            <TableCell className="text-right pr-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-violet-600 hover:bg-violet-500/5 rounded-lg"
                                                        onClick={() => setViewingProject(project)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/5 rounded-lg"
                                                        onClick={() => router.push(`/admin/project-manager/${project.id}/edit`)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-lg">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/5"
                                                                        onSelect={e => e.preventDefault()}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        <span>Delete Project</span>
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="rounded-xl border-border/50">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete project data?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            The project &quot;{project.title}&quot; will be permanently removed from the system.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(project.id)}
                                                                            className="rounded-lg bg-red-600 hover:bg-red-700 text-white border-0"
                                                                        >
                                                                            Perform Deletion
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </motion.div>

            {/* Entity View Modal */}
            <ProjectViewModal
                isOpen={!!viewingProject}
                onClose={() => setViewingProject(null)}
                project={viewingProject}
                onEdit={p => router.push(`/admin/project-manager/${p.id}/edit`)}
            />
        </>
    )
}
