'use client'

import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    FolderGit2, Github, Link2, Video, Calendar, Tag,
    Cpu, Layers, TrendingUp, AlertTriangle, Lightbulb, Bot, ExternalLink,
} from 'lucide-react'
import { Project } from './data'
import { cn } from '@/lib/utils'

interface ProjectViewModalProps {
    isOpen: boolean
    onClose: () => void
    project: Project | null
    onEdit: (p: Project) => void
}

const statusConfig = {
    published: { label: 'Published', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' },
    draft: { label: 'Draft', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' },
    archived: { label: 'Archived', className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20' },
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
            {children}
        </div>
    )
}

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-violet-500/10">
                <Icon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">{label}</span>
        </div>
    )
}

export function ProjectViewModal({ isOpen, onClose, project, onEdit }: ProjectViewModalProps) {
    if (!project) return null
    const cfg = statusConfig[project.status]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-full p-0 overflow-hidden border-border/50 bg-background rounded-3xl shadow-2xl">

                {/* ── Hero Header ──────────────────────────────────────── */}
                <div className={cn(
                    'relative h-32 bg-gradient-to-br flex-shrink-0',
                    project.thumbnail
                )}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                    <div className="relative z-10 h-full flex items-end justify-between px-8 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <FolderGit2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black text-white tracking-tight">
                                    {project.title}
                                </DialogTitle>
                                <DialogDescription className="text-white/70 text-xs mt-0.5">
                                    {project.category} · {project.type} · {project.createdAt}
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge className={cn('text-[10px] font-bold uppercase tracking-wider border', cfg.className, 'bg-white/10 backdrop-blur-sm text-white border-white/20')}>
                            {cfg.label}
                        </Badge>
                    </div>
                </div>

                {/* ── Scrollable Body ───────────────────────────────────── */}
                <ScrollArea className="max-h-[65vh]">
                    <div className="px-8 py-6 space-y-6">

                        {/* Description */}
                        <div>
                            <SectionLabel icon={Lightbulb} label="Overview" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {project.shortDescription}
                            </p>
                        </div>

                        <Separator className="bg-border/40" />

                        {/* Tech Stack & Tags */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <SectionLabel icon={Cpu} label="Tech Stack" />
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map(t => (
                                        <span key={t} className="text-xs bg-muted border border-border/60 rounded-lg px-2.5 py-1 font-semibold text-foreground/80">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <SectionLabel icon={Tag} label="Tags" />
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.length > 0 ? project.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-[10px] font-bold uppercase rounded-lg">
                                            {tag}
                                        </Badge>
                                    )) : (
                                        <span className="text-xs text-muted-foreground italic">No tags added</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/40" />

                        {/* Key Info Grid */}
                        <div>
                            <SectionLabel icon={Layers} label="Project Details" />
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <InfoBlock label="Category">
                                    <p className="text-sm font-semibold text-foreground">{project.category}</p>
                                </InfoBlock>
                                <InfoBlock label="Type">
                                    <p className="text-sm font-semibold text-foreground">{project.type}</p>
                                </InfoBlock>
                                <InfoBlock label="Created">
                                    <p className="text-sm font-semibold text-foreground">{project.createdAt}</p>
                                </InfoBlock>
                            </div>
                        </div>

                        <Separator className="bg-border/40" />

                        {/* AI Internal Preview */}
                        <div className="bg-violet-500/5 rounded-xl p-4 border border-violet-500/15">
                            <SectionLabel icon={Bot} label="AI Internal Fields" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/40">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">AI Search Text</p>
                                    <p className="text-xs font-mono text-muted-foreground truncate">
                                        AI-generated from: &quot;{project.title}&quot;
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg px-3 py-2 border border-border/40">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Embedding Vector</p>
                                    <p className="text-xs font-mono text-muted-foreground truncate">[0.231, -0.841, 0.107, ...]</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* ── Footer ───────────────────────────────────────────── */}
                <div className="px-8 py-4 border-t border-border/40 flex items-center justify-between gap-3 bg-muted/10">
                    <Button variant="outline" onClick={onClose} className="rounded-xl border-border/60">
                        Close
                    </Button>
                    <Button
                        onClick={() => { onClose(); onEdit(project) }}
                        className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-lg"
                    >
                        Edit Project
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}
