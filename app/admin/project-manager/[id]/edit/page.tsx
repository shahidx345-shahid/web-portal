'use client'

import dynamic from 'next/dynamic'
import { ArrowLeft, Edit2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { DUMMY_PROJECTS } from '@/components/admin/project-manager/data'

const ProjectFormPage = dynamic(
    () => import('@/components/admin/project-manager/project-form-page').then(m => ({ default: m.ProjectFormPage })),
    {
        ssr: false,
        loading: () => (
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-[400px] w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
        ),
    }
)

export default function EditProjectPage() {
    const params = useParams()
    const id = Number(params?.id)
    const project = DUMMY_PROJECTS.find(p => p.id === id)

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-2xl font-black text-foreground">Project not found</p>
                    <p className="text-muted-foreground">Project #{params?.id} does not exist.</p>
                    <Link
                        href="/admin/project-manager"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:bg-violet-500/20 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Project Manager
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* ── Page Header ────────────────────────────────────────────── */}
            <div className="border-b border-border/40 bg-gradient-to-r from-violet-500/5 via-transparent to-indigo-500/5 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/project-manager"
                            className="p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                                <Edit2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-foreground tracking-tight">Edit Project</h1>
                                <p className="text-xs text-muted-foreground mt-0.5 max-w-sm truncate">
                                    {project.title}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Form (client-only to avoid SSR/hydration issues) ─────────── */}
            <ProjectFormPage mode="edit" initialData={project} />
        </div>
    )
}
