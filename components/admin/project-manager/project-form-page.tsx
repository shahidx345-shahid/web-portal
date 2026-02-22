'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichTextEditor } from './rich-text-editor'
import { FieldSelect } from './field-select'
import { FieldMultiSelect } from './field-multi-select'
import { useMasterOptions } from '@/lib/master-data-store'
import {
    PROJECT_TYPE_OPTIONS,
    STATUS_OPTIONS,
    Project,
} from './data'
import { cn } from '@/lib/utils'
import {
    Info, Cpu, Lightbulb, Puzzle, Layers, AlertTriangle, TrendingUp,
    Link2, CalendarDays, Bot, Plus, Trash2, ChevronRight, ChevronLeft,
    Github, Video, Loader2, Sparkles, CheckCircle2, Save,
    X, LayoutGrid, Zap, ShieldCheck
} from 'lucide-react'

// ─── Senior UI Helpers ────────────────────────────────────────────────────────

function toSlug(s: string) {
    return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

/**
 * Senior UI Engineer Note:
 * Standardized Section Card with professional typography scale.
 * Section Titles: text-xl font-semibold
 * Description: text-sm md:text-base leading-relaxed
 */
function SectionCard({ title, description, icon: Icon, children, badge }: {
    title: string; description: string; icon: React.ElementType; children: React.ReactNode; badge?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm mb-6"
        >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 bg-muted/5">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-violet-500/10 flex-shrink-0">
                        <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold text-foreground tracking-tight">{title}</h3>
                            {badge && (
                                <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-[11px] font-black uppercase tracking-widest">
                                    {badge}
                                </Badge>
                            )}
                        </div>
                        <p className="text-base text-muted-foreground mt-1 leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-6">
                {children}
            </div>
        </motion.div>
    )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <Label className="text-base font-bold text-foreground/90 block mb-2.5 px-0.5 uppercase tracking-wide">
            {children}{required && <span className="text-violet-500 ml-1">*</span>}
        </Label>
    )
}

function StyledInput({ label, required, hint, ...props }: {
    label: string; required?: boolean; hint?: string
} & React.ComponentProps<'input'>) {
    return (
        <div className="group space-y-2">
            <FieldLabel required={required}>{label}</FieldLabel>
            <Input
                className="h-12 text-lg bg-background border-border/60 rounded-lg focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500/40 transition-all duration-200 font-medium"
                {...(props as any)}
            />
            {hint && <p className="text-xs px-0.5 text-muted-foreground italic leading-relaxed">{hint}</p>}
        </div>
    )
}

// ─── Main Tabs Config ────────────────────────────────────────────────────────

const TABS = [
    { id: 'general', label: 'Overview', icon: Info, desc: 'Title, slug, and status' },
    { id: 'technical', label: 'Tech Stack', icon: Cpu, desc: 'Technical classification' },
    { id: 'content', label: 'Description', icon: Layers, desc: 'Public project story' },
    { id: 'narrative', label: 'Narrative', icon: Puzzle, desc: 'Problem & solution fit' },
    { id: 'features', label: 'Features', icon: Zap, desc: 'Capabilities & specs' },
    { id: 'challenges', label: 'Challenges', icon: AlertTriangle, desc: 'Obstacles & results' },
    { id: 'metrics', label: 'Metrics', icon: TrendingUp, desc: 'Impact & outcomes' },
    { id: 'assets', label: 'Assets', icon: LayoutGrid, desc: 'Thumbnails & media' },
    { id: 'links', label: 'Connect', icon: Link2, desc: 'Github, demo, walkthrough' },
    { id: 'pipeline', label: 'AI Pipeline', icon: Bot, desc: 'Vector data & search' },
]

// ─── Form Component ──────────────────────────────────────────────────────────

export function ProjectFormPage({ initialData, mode = 'create' }: { initialData?: Partial<Project>; mode?: 'create' | 'edit' }) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('general')
    const [percent, setPercent] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [thumbnail, setThumbnail] = useState<string | null>(null)

    // Dynamic Master Data Hooks
    const techOptions = useMasterOptions('tech_stack')
    const catOptions = useMasterOptions('category')
    const archOptions = useMasterOptions('architecture')
    const hostOptions = useMasterOptions('hosting')
    const tagOptions = useMasterOptions('tag')
    const methodOptions = useMasterOptions('methodology')
    const roleOptions = useMasterOptions('role')
    const industryOptions = useMasterOptions('industry')

    const [sel, setSel] = useState({
        category: initialData?.category || '', type: initialData?.type || '', status: initialData?.status || 'draft',
        architecture: '', deployment: '', methodology: '', role: '', industry: ''
    })
    const [multi, setMulti] = useState({
        techStack: initialData?.techStack || [], tags: initialData?.tags || [],
        features: [] as string[], challenges: [] as string[], solutions: [] as string[], results: [] as string[]
    })
    const [rich, setRich] = useState({ description: '', problem: '', solution: '' })

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: { title: initialData?.title || '', slug: initialData?.slug || '', github: '', demo: '', video: '', start: '', end: '', duration: '' }
    })

    useEffect(() => {
        const fields = [watch('title'), sel.category, sel.status, multi.techStack.length > 0, rich.description].filter(Boolean).length
        setPercent((fields / 5) * 100)
    }, [watch('title'), sel, multi, rich])

    const currentIdx = TABS.findIndex(t => t.id === activeTab)
    const isFirst = currentIdx === 0
    const isLast = currentIdx === TABS.length - 1

    const onSubmit = async (data: any) => {
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 2000))
        setSubmitting(false)
        router.push('/admin/project-manager')
    }

    const readFile = (file: File) => {
        const r = new FileReader(); r.onload = () => setThumbnail(r.result as string); r.readAsDataURL(file)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-full flex flex-col bg-muted/10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">

                {/* ── Tabs Header ────────────────────────────────────────── */}
                <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/40 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
                        <TabsList className="h-auto bg-transparent p-0 flex flex-nowrap w-max min-w-full">
                            {TABS.map((tab, i) => {
                                const Icon = tab.icon; const isAct = tab.id === activeTab; const isDone = i < currentIdx
                                return (
                                    <TabsTrigger key={tab.id} value={tab.id}
                                        className={cn(
                                            'px-6 py-6 text-base font-bold transition-all duration-300 border-b-2 border-transparent relative',
                                            'data-[state=active]:bg-transparent data-[state=active]:border-violet-500 data-[state=active]:text-violet-600',
                                            'hover:text-foreground text-muted-foreground/70',
                                            isDone && !isAct && 'text-emerald-600'
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isDone && !isAct ? <ShieldCheck className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                            {tab.label}
                                        </div>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </div>
                </div>

                {/* ── Main Body ───────────────────────────────────────────── */}
                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto w-full space-y-6">

                    {/* 1 · GENERAL */}
                    <TabsContent value="general" className="m-0 outline-none">
                        <SectionCard icon={Info} title="General Details" description="Core identity and visibility status" badge="Initial Step">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StyledInput label="Project Title" required placeholder="A clear, professional project title" {...register('title')}
                                    onChange={e => { setValue('title', e.target.value); setValue('slug', toSlug(e.target.value)) }} />
                                <StyledInput label="URL Slug" placeholder="auto-generated-slug" {...register('slug')} hint="Must be unique and SEO-friendly" />
                                <FieldSelect id="project-status" label="Project Status" placeholder="Current lifecycle stage" options={STATUS_OPTIONS} value={sel.status} onChange={v => setSel(s => ({ ...s, status: v }))} />
                            </div>
                        </SectionCard>
                    </TabsContent>

                    {/* 2 · TECHNICAL */}
                    <TabsContent value="technical" className="m-0 outline-none">
                        <SectionCard icon={Cpu} title="Classification & Technology" description="Define the technical DNA and metadata" badge="Dynamic Configuration">
                            <div className="space-y-6">
                                <FieldMultiSelect id="tech-stack" label="Tech Stack" required placeholder="Choose frameworks & languages" options={techOptions} selected={multi.techStack} onChange={v => setMulti(m => ({ ...m, techStack: v }))}
                                    hint="All core frameworks, libraries, and languages used" />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FieldSelect id="proj-cat" label="Project Category" placeholder="Primary domain" options={catOptions} value={sel.category} onChange={v => setSel(s => ({ ...s, category: v }))} />
                                    <FieldSelect id="proj-type" label="Project Type" placeholder="Engagement model" options={PROJECT_TYPE_OPTIONS} value={sel.type} onChange={v => setSel(s => ({ ...s, type: v }))} />
                                    <FieldSelect id="arch-type" label="Architecture Type" placeholder="System design pattern" options={archOptions} value={sel.architecture} onChange={v => setSel(s => ({ ...s, architecture: v }))} />
                                    <FieldSelect id="host-opt" label="Deployment / Hosting" placeholder="Current infrastructure" options={hostOptions} value={sel.deployment} onChange={v => setSel(s => ({ ...s, deployment: v }))} />
                                    <FieldSelect id="meth-opt" label="Methodology" placeholder="Team delivery process" options={methodOptions} value={sel.methodology} onChange={v => setSel(s => ({ ...s, methodology: v }))} />
                                    <FieldSelect id="role-opt" label="Role" placeholder="Your contribution" options={roleOptions} value={sel.role} onChange={v => setSel(s => ({ ...s, role: v }))} />
                                </div>

                                <FieldMultiSelect id="tag-opt" label="Tags / Keywords" placeholder="Search or select tags..." options={tagOptions} selected={multi.tags} onChange={v => setMulti(m => ({ ...m, tags: v }))}
                                    hint="Used for filtering and discovery" />

                                <div className="md:w-1/2">
                                    <FieldSelect id="industry-opt" label="Industry Domain" placeholder="Target market vertical" options={industryOptions} value={sel.industry} onChange={v => setSel(s => ({ ...s, industry: v }))} />
                                </div>
                            </div>
                        </SectionCard>
                    </TabsContent>

                    {/* 3 · CONTENT */}
                    <TabsContent value="content" className="m-0 outline-none">
                        <SectionCard icon={Layers} title="Project Description" description="Elaborate on the project details with rich text">
                            <RichTextEditor value={rich.description} onChange={v => setRich(r => ({ ...r, description: v }))} placeholder="Write the full project story here..." minHeight={400} />
                        </SectionCard>
                    </TabsContent>

                    {/* 4 · NARRATIVE */}
                    <TabsContent value="narrative" className="m-0 outline-none">
                        <SectionCard icon={Puzzle} title="Problem & Solution" description="AI-optimized narrative fields for better alignment">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <FieldLabel required>Problem Statement</FieldLabel>
                                    <RichTextEditor value={rich.problem} onChange={v => setRich(r => ({ ...r, problem: v }))} placeholder="What problem does this project solve?" minHeight={250} />
                                </div>
                                <div className="space-y-3">
                                    <FieldLabel required>Solution Overview</FieldLabel>
                                    <RichTextEditor value={rich.solution} onChange={v => setRich(r => ({ ...r, solution: v }))} placeholder="How was the problem addressed?" minHeight={250} />
                                </div>
                            </div>
                        </SectionCard>
                    </TabsContent>

                    {/* 8 · ASSETS */}
                    <TabsContent value="assets" className="m-0 outline-none">
                        <SectionCard icon={LayoutGrid} title="Media Assets" description="Upload visual representation for the project card">
                            <div
                                className="group relative border-2 border-dashed border-border/60 rounded-xl h-72 flex flex-col items-center justify-center transition-all bg-muted/5 hover:bg-muted/10 hover:border-violet-500/40 overflow-hidden"
                                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) readFile(f) }}
                                onDragOver={e => e.preventDefault()}
                            >
                                {thumbnail ? (
                                    <div className="absolute inset-0">
                                        <img src={thumbnail} className="w-full h-full object-cover" alt="Thumb" />
                                        <button type="button" onClick={() => setThumbnail(null)} className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 text-white backdrop-blur-sm hover:bg-red-500 transition-all shadow-lg"><X className="w-5 h-5" /></button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center gap-4 py-12">
                                        <div className="p-4 rounded-full bg-violet-500/10 transition-transform group-hover:scale-110">
                                            <Plus className="w-8 h-8 text-violet-600" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="font-semibold text-lg">Drop Thumbnail Image</p>
                                            <p className="text-sm text-muted-foreground">PNG, JPG, or WebP · Recommended size 1200x630</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f) }} />
                                    </label>
                                )}
                            </div>
                        </SectionCard>
                    </TabsContent>

                </div>

                {/* ── Sticky Navigation ───────────────────────────────────── */}
                <div className="sticky bottom-0 z-30 bg-background/95 backdrop-blur-md border-t border-border/40 py-5 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Button type="button" variant="ghost" className="h-12 rounded-xl gap-2 font-bold text-base" onClick={() => router.push('/admin/project-manager')}>
                                <X className="w-5 h-5" /> Cancel
                            </Button>
                            <div className="hidden md:flex flex-col gap-1.5 w-64">
                                <div className="flex justify-between items-end text-sm font-black uppercase tracking-widest text-muted-foreground/90 mb-1">
                                    <span>Form Progress</span>
                                    <span className="text-violet-600 dark:text-violet-400">{Math.round(percent)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-violet-500" initial={{ width: 0 }} animate={{ width: `${percent}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="button" variant="outline" className="h-12 rounded-xl px-6 font-bold text-base" onClick={() => { if (!isFirst) setActiveTab(TABS[currentIdx - 1].id) }} disabled={isFirst}>
                                <ChevronLeft className="w-5 h-5 ml-[-4px] mr-1" /> Back
                            </Button>
                            {!isLast ? (
                                <Button type="button" className="h-12 rounded-xl px-10 bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 font-bold text-base transition-all" onClick={() => setActiveTab(TABS[currentIdx + 1].id)}>
                                    Continue <ChevronRight className="w-5 h-5 ml-1 mr-[-4px]" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={submitting} className="h-12 min-w-[180px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 font-bold text-base transition-all">
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 ml-[-4px] mr-2" />} Save Project
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

            </Tabs>
        </form>
    )
}
