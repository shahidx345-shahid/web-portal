'use client'

import dynamic from 'next/dynamic'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

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

export default function NewProjectPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* ── Page Header ─────────────────────────────────────────────── */}
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
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-foreground tracking-tight">Add New Project</h1>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Complete all 10 sections — use the tabs to navigate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Form (client-only to avoid SSR/hydration issues) ─────────── */}
            <ProjectFormPage mode="create" />
        </div>
    )
}
