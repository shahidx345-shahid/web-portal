'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ProjectForm } from './project-form'
import { FolderGit2 } from 'lucide-react'
import { Project } from './data'

interface ProjectModalProps {
    isOpen: boolean
    onClose: () => void
    editingProject?: Project | null
}

export function ProjectModal({ isOpen, onClose, editingProject }: ProjectModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden border-border/50 bg-background shadow-2xl rounded-3xl max-h-[95vh] flex flex-col">

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="flex-shrink-0 px-8 pt-7 pb-5 border-b border-border/30 bg-gradient-to-r from-violet-500/5 via-transparent to-indigo-500/5">
                    <DialogHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 flex-shrink-0">
                                <FolderGit2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-foreground tracking-tight">
                                    {editingProject ? 'Edit Project' : 'Add New Project'}
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground text-sm mt-0.5">
                                    {editingProject
                                        ? 'Update the project details below. Navigate through tabs to edit all sections.'
                                        : 'Complete all 6 sections to add a new project to the portfolio system.'
                                    }
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* ── Tabbed Form (fills remaining modal height) ────────────── */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <ProjectForm onClose={onClose} initialData={editingProject} />
                </div>

            </DialogContent>
        </Dialog>
    )
}
