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
    published: { label: 'Published', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' },
    draft: { label: 'Draft', className: 'bg-amber-500/10  text-amber-700  dark:text-amber-400  border border-amber-500/20' },
    archived: { label: 'Archived', className: 'bg-slate-500/10  text-slate-600  dark:text-slate-400  border border-slate-500/20' },
}

const rowVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4">

                {/* ── Toolbar ─────────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search projects…"
                            className="pl-9 bg-background border-border/60 rounded-xl h-10" />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 rounded-xl border-border/60">
                                    <Filter className="w-4 h-4" />
                                    {filterStatus ? <span className="capitalize">{filterStatus}</span> : 'Filter'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => setFilter(null)}>All</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilter('published')}>Published</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('draft')}>Draft</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFilter('archived')}>Archived</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={() => router.push('/admin/project-manager/new')}
                            className="gap-2 flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-lg"
                        >
                            <Plus className="w-4 h-4" /> Add New Project
                        </Button>
                    </div>
                </div>

                {/* ── Table Card ──────────────────────────────────────────────── */}
                <Card className="border-border/60 bg-card shadow-sm overflow-hidden rounded-2xl">
                    <CardHeader className="pb-0 px-6 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500/10">
                                <FolderGit2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold">All Projects</CardTitle>
                                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {projects.length} entries</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 mt-4">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/40 hover:bg-transparent bg-muted/30">
                                        <TableHead className="pl-6 text-[10px] uppercase font-bold tracking-widest py-3 min-w-[240px]">Project</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest hidden sm:table-cell min-w-[100px]">Category</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest hidden md:table-cell min-w-[180px]">Tech Stack</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest min-w-[90px]">Status</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest hidden lg:table-cell min-w-[110px]">Created</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right pr-6 min-w-[80px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <motion.tbody
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
                                    initial="hidden" animate="visible"
                                >
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">No projects found.</td></tr>
                                    ) : filtered.map(project => {
                                        const cfg = statusConfig[project.status]
                                        return (
                                            <motion.tr key={project.id} variants={rowVariants}
                                                className="border-border/30 hover:bg-accent/5 transition-colors group cursor-pointer"
                                                onClick={() => setViewingProject(project)}
                                            >
                                                {/* Project */}
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center shadow-md', project.thumbnail)}>
                                                            <FolderGit2 className="w-5 h-5 text-white/80" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-sm text-foreground truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                                {project.title}
                                                            </p>
                                                            <p className="text-[11px] text-muted-foreground truncate mt-0.5 hidden sm:block max-w-[220px]">
                                                                {project.shortDescription}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Category */}
                                                <TableCell className="hidden sm:table-cell">
                                                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider rounded-lg px-2.5 py-0.5">
                                                        {project.category}
                                                    </Badge>
                                                </TableCell>

                                                {/* Tech Stack */}
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                        {project.techStack.slice(0, 3).map(t => (
                                                            <span key={t} className="text-[10px] bg-muted border border-border/60 rounded-md px-1.5 py-0.5 font-medium text-foreground/70">{t}</span>
                                                        ))}
                                                        {project.techStack.length > 3 && (
                                                            <span className="text-[10px] bg-muted border border-border/60 rounded-md px-1.5 py-0.5 font-medium text-muted-foreground">+{project.techStack.length - 3}</span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <Badge className={cn('text-[10px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1', cfg.className)}>
                                                        {cfg.label}
                                                    </Badge>
                                                </TableCell>

                                                {/* Date */}
                                                <TableCell className="hidden lg:table-cell text-xs text-muted-foreground font-medium">
                                                    {project.createdAt}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-right pr-4" onClick={e => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setViewingProject(project)}>
                                                                <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                                                <span>View Details</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer"
                                                                onClick={() => router.push(`/admin/project-manager/${project.id}/edit`)}>
                                                                <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {/* Confirm delete */}
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem
                                                                        className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                                                        onSelect={e => e.preventDefault()}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        <span>Delete</span>
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="rounded-2xl border-border/50">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete project?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            &quot;{project.title}&quot; will be permanently removed. This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDelete(project.id)}
                                                                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-0"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        )
                                    })}
                                </motion.tbody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* View Modal */}
            <ProjectViewModal
                isOpen={!!viewingProject}
                onClose={() => setViewingProject(null)}
                project={viewingProject}
                onEdit={p => router.push(`/admin/project-manager/${p.id}/edit`)}
            />
        </>
    )
}
