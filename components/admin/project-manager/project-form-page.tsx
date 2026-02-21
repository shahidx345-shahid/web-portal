'use client'

import { useState, useCallback } from 'react'
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
import {
    TECH_STACK_OPTIONS, PROJECT_CATEGORY_OPTIONS, PROJECT_TYPE_OPTIONS,
    ARCHITECTURE_OPTIONS, DEPLOYMENT_OPTIONS, TAGS_OPTIONS,
    ROLE_OPTIONS, METHODOLOGY_OPTIONS, INDUSTRY_OPTIONS, STATUS_OPTIONS,
    Project,
} from './data'
import { cn } from '@/lib/utils'
import {
    Info, Cpu, Lightbulb, Puzzle, Layers, AlertTriangle, TrendingUp,
    Link2, CalendarDays, Bot, Plus, Trash2, ChevronRight, ChevronLeft,
    Github, Video, Loader2, Sparkles, CheckCircle2, ArrowLeft, Save,
    X, FolderGit2,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(s: string) {
    return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function SectionCard({ title, description, icon: Icon, children }: {
    title: string; description: string; icon: React.ElementType; children: React.ReactNode
}) {
    return (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40 bg-muted/10">
                <div className="p-2 rounded-xl bg-violet-500/10 flex-shrink-0">
                    <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                    <p className="font-bold text-sm text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    )
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
            {children}{required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
    )
}

function Grid2({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}
function ColSpan2({ children }: { children: React.ReactNode }) {
    return <div className="md:col-span-2">{children}</div>
}

function StyledInput({ label, required, hint, ...props }: {
    label: string; required?: boolean; hint?: string
} & React.ComponentProps<'input'>) {
    return (
        <div className="space-y-1.5">
            <FieldLabel required={required}>{label}</FieldLabel>
            <Input
                className="bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
                {...(props as any)}
            />
            {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
        </div>
    )
}

function DynamicList({ label, items, onChange, placeholder, max, hint }: {
    label: string; items: string[]; onChange: (v: string[]) => void
    placeholder: string; max?: number; hint?: string
}) {
    const add = () => { if (!max || items.length < max) onChange([...items, '']) }
    const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
    const update = (i: number, v: string) => onChange(items.map((x, idx) => idx === i ? v : x))
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <FieldLabel>{label}</FieldLabel>
                {(!max || items.length < max) && (
                    <button type="button" onClick={add}
                        className="text-[11px] flex items-center gap-1 text-violet-600 dark:text-violet-400 font-bold hover:opacity-80 transition-opacity">
                        <Plus className="w-3 h-3" />Add
                    </button>
                )}
            </div>
            <AnimatePresence initial={false}>
                {items.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                            <Input value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder}
                                className="bg-background border-border/60 rounded-xl h-9 text-sm flex-1 focus:border-violet-400 transition-colors" />
                            <button type="button" onClick={() => remove(i)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            {items.length === 0 && <p className="text-xs text-muted-foreground italic">No items yet — click Add.</p>}
            {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
            {max && items.length >= max && <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Maximum of {max} items reached.</p>}
        </div>
    )
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'description', label: 'Description', icon: Layers },
    { id: 'problem', label: 'Problem', icon: Puzzle },
    { id: 'tech', label: 'Tech Stack', icon: Cpu },
    { id: 'features', label: 'Features', icon: Lightbulb },
    { id: 'challenges', label: 'Challenges', icon: AlertTriangle },
    { id: 'results', label: 'Results', icon: TrendingUp },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'timeline', label: 'Timeline', icon: CalendarDays },
    { id: 'ai', label: 'AI Fields', icon: Bot },
]

// ─── Form state type ──────────────────────────────────────────────────────────

type FormValues = {
    title: string; slug: string; githubLink: string; liveDemo: string
    videoDemo: string; startDate: string; endDate: string; duration: string
}

type SelectState = {
    category: string; type: string; status: string; architecture: string
    deployment: string; role: string; methodology: string; industry: string
}

type MultiState = {
    techStack: string[]; tags: string[]
    features: string[]; challenges: string[]; solutions: string[]; results: string[]
}

type RichState = {
    description: string; problemStatement: string; solutionOverview: string
}

// ─── Main Form Component ──────────────────────────────────────────────────────

interface ProjectFormPageProps {
    initialData?: Partial<Project>
    mode?: 'create' | 'edit'
}

export function ProjectFormPage({ initialData, mode = 'create' }: ProjectFormPageProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('basic')
    const [submitting, setSubmitting] = useState(false)
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const [dragging, setDragging] = useState(false)

    const [sel, setSel] = useState<SelectState>({
        category: initialData?.category || '',
        type: initialData?.type || '',
        status: initialData?.status || 'draft',
        architecture: '', deployment: '', role: '', methodology: '', industry: '',
    })

    const [multi, setMulti] = useState<MultiState>({
        techStack: initialData?.techStack || [],
        tags: initialData?.tags || [],
        features: [], challenges: [], solutions: [], results: [],
    })

    const [rich, setRich] = useState<RichState>({
        description: '', problemStatement: '', solutionOverview: '',
    })

    const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
        defaultValues: {
            title: initialData?.title || '', slug: initialData?.slug || '',
            githubLink: '', liveDemo: '', videoDemo: '',
            startDate: '', endDate: '', duration: '',
        },
    })

    const updateSel = (k: keyof SelectState) => (v: string) => setSel(s => ({ ...s, [k]: v }))
    const updateMulti = (k: keyof MultiState) => (v: string[]) => setMulti(m => ({ ...m, [k]: v }))
    const updateRich = (k: keyof RichState) => (v: string) => setRich(r => ({ ...r, [k]: v }))

    const titleValue = watch('title')

    const readFile = (file: File) => {
        const r = new FileReader()
        r.onload = () => setThumbnail(r.result as string)
        r.readAsDataURL(file)
    }

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true)
        const payload = { ...data, ...sel, ...multi, ...rich, thumbnail }
        console.log('📦 Payload:', payload)
        await new Promise(r => setTimeout(r, 1500))
        setSubmitting(false)
        router.push('/admin/project-manager')
    }

    const currentIdx = TABS.findIndex(t => t.id === activeTab)
    const isFirst = currentIdx === 0
    const isLast = currentIdx === TABS.length - 1
    const goNext = () => { if (!isLast) setActiveTab(TABS[currentIdx + 1].id) }
    const goPrev = () => { if (!isFirst) setActiveTab(TABS[currentIdx - 1].id) }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="min-h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">

                {/* ── Sticky Tab Bar ──────────────────────────────────────────────── */}
                <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/40">
                    <div className="overflow-x-auto">
                        <TabsList className="h-auto bg-transparent p-0 gap-0 flex flex-nowrap w-max min-w-full px-6">
                            {TABS.map((tab, i) => {
                                const Icon = tab.icon
                                const isAct = tab.id === activeTab
                                const isDone = i < currentIdx
                                return (
                                    <TabsTrigger key={tab.id} value={tab.id}
                                        className={cn(
                                            'flex items-center gap-1.5 px-3 sm:px-4 py-3.5 text-xs font-semibold',
                                            'rounded-none border-b-2 transition-all duration-200 whitespace-nowrap',
                                            'bg-transparent data-[state=active]:shadow-none hover:bg-muted/30',
                                            isAct ? 'border-violet-500 text-violet-600 dark:text-violet-400 data-[state=active]:bg-transparent'
                                                : 'border-transparent text-muted-foreground hover:text-foreground',
                                            isDone && !isAct && 'text-emerald-600 dark:text-emerald-400',
                                        )}
                                    >
                                        {isDone && !isAct
                                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            : <Icon className="w-3.5 h-3.5" />
                                        }
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden font-bold">{i + 1}</span>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </div>
                </div>

                {/* ── Tab Content ─────────────────────────────────────────────────── */}
                <div className="flex-1 px-6 py-6 space-y-6 max-w-5xl mx-auto w-full">

                    {/* 1 · Basic Info */}
                    <TabsContent value="basic" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Info} title="Basic Information" description="Core project identification and metadata">
                            <Grid2>
                                <StyledInput
                                    label="Project Title" required placeholder="e.g. AI-Powered Customer Chatbot"
                                    {...register('title')}
                                    onChange={e => {
                                        setValue('title', e.target.value)
                                        setValue('slug', toSlug(e.target.value))
                                    }}
                                />
                                <div className="space-y-1.5">
                                    <FieldLabel>URL Slug</FieldLabel>
                                    <Input
                                        {...register('slug')}
                                        onChange={e => setValue('slug', toSlug(e.target.value))}
                                        placeholder="auto-generated-slug"
                                        className="bg-background border-border/60 rounded-xl h-10 font-mono text-xs text-muted-foreground focus:border-violet-400 transition-colors"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Auto-generated · customizable · lowercase + hyphens only</p>
                                </div>

                                <FieldSelect id="category" label="Project Category" placeholder="Select Category" required
                                    options={PROJECT_CATEGORY_OPTIONS} value={sel.category} onChange={updateSel('category')} />
                                <FieldSelect id="type" label="Project Type" placeholder="Select Type" required
                                    options={PROJECT_TYPE_OPTIONS} value={sel.type} onChange={updateSel('type')} />
                                <FieldSelect id="status" label="Status" placeholder="Select Status" required
                                    options={STATUS_OPTIONS} value={sel.status} onChange={updateSel('status')} />
                                <FieldSelect id="industry" label="Industry Domain" placeholder="Select Industry"
                                    options={INDUSTRY_OPTIONS} value={sel.industry} onChange={updateSel('industry')} />

                                {/* Thumbnail */}
                                <ColSpan2>
                                    <FieldLabel>Thumbnail Image</FieldLabel>
                                    <div
                                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) readFile(f) }}
                                        className={cn(
                                            'relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200',
                                            dragging ? 'border-violet-500 bg-violet-500/10' : 'border-border/60 hover:border-violet-400 bg-muted/10'
                                        )}
                                    >
                                        {thumbnail ? (
                                            <div className="relative">
                                                <img src={thumbnail} alt="Thumbnail" className="w-full h-44 object-cover" />
                                                <button type="button" onClick={() => setThumbnail(null)}
                                                    className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/20 text-foreground hover:bg-red-500 hover:text-white transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-32 cursor-pointer gap-3 text-center px-4">
                                                <div className="p-3 rounded-full bg-violet-500/10">
                                                    <Plus className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-foreground/70">Drag & drop or click to upload</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP — max 5 MB</p>
                                                </div>
                                                <input type="file" accept="image/*" className="hidden"
                                                    onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f) }} />
                                            </label>
                                        )}
                                    </div>
                                </ColSpan2>

                                <ColSpan2>
                                    <FieldMultiSelect id="tags" label="Tags / Keywords" placeholder="Select relevant tags..."
                                        options={TAGS_OPTIONS} selected={multi.tags} onChange={updateMulti('tags')}
                                        hint="These power AI search and portfolio filtering." />
                                </ColSpan2>
                            </Grid2>
                        </SectionCard>
                    </TabsContent>

                    {/* 2 · Description */}
                    <TabsContent value="description" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Layers} title="Project Description" description="Full richly-formatted project overview">
                            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/15 text-xs text-violet-700 dark:text-violet-400 font-medium">
                                <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                Use the rich editor to format your project overview. This content appears on the public portfolio page.
                            </div>
                            <RichTextEditor
                                value={rich.description}
                                onChange={updateRich('description')}
                                placeholder="Write a full project description. Use headings, lists, code blocks and more…"
                                minHeight={320}
                            />
                        </SectionCard>
                    </TabsContent>

                    {/* 3 · Problem & Solution */}
                    <TabsContent value="problem" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Puzzle} title="Problem & Solution" description="Structured narrative that feeds AI training data">
                            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/15 text-xs text-violet-700 dark:text-violet-400 font-medium mb-2">
                                <Bot className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                These fields are embedded into the AI vector database for intelligent search and chatbot Q&A responses.
                            </div>
                            <div>
                                <FieldLabel required>Problem Statement</FieldLabel>
                                <RichTextEditor
                                    value={rich.problemStatement}
                                    onChange={updateRich('problemStatement')}
                                    placeholder="Describe the exact problem this project solves. Include context, user pain points, and business impact…"
                                    minHeight={240}
                                />
                            </div>
                            <div className="pt-2">
                                <FieldLabel required>Solution Overview</FieldLabel>
                                <RichTextEditor
                                    value={rich.solutionOverview}
                                    onChange={updateRich('solutionOverview')}
                                    placeholder="Describe your approach, architecture decisions, and how the solution addresses the problem…"
                                    minHeight={240}
                                />
                            </div>
                        </SectionCard>
                    </TabsContent>

                    {/* 4 · Tech Stack */}
                    <TabsContent value="tech" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Cpu} title="Tech Stack & Infrastructure" description="Technologies and deployment configuration">
                            <Grid2>
                                <ColSpan2>
                                    <FieldMultiSelect id="techStack" label="Technologies Used" required
                                        placeholder="Search and select technologies…"
                                        options={TECH_STACK_OPTIONS} selected={multi.techStack} onChange={updateMulti('techStack')}
                                        hint="Search and select all technologies used in this project." />
                                    {multi.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {multi.techStack.map(t => (
                                                <span key={t} className="text-xs bg-muted border border-border/60 rounded-lg px-2.5 py-1 font-semibold text-foreground/80">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </ColSpan2>
                                <FieldSelect id="architecture" label="Architecture Type" placeholder="Select Architecture"
                                    options={ARCHITECTURE_OPTIONS} value={sel.architecture} onChange={updateSel('architecture')} />
                                <FieldSelect id="deployment" label="Deployment / Hosting" placeholder="Select Platform"
                                    options={DEPLOYMENT_OPTIONS} value={sel.deployment} onChange={updateSel('deployment')} />
                                <FieldSelect id="methodology" label="Development Methodology" placeholder="Select Methodology"
                                    options={METHODOLOGY_OPTIONS} value={sel.methodology} onChange={updateSel('methodology')} />
                                <FieldSelect id="role" label="Your Role" placeholder="Select Role"
                                    options={ROLE_OPTIONS} value={sel.role} onChange={updateSel('role')} />
                            </Grid2>
                        </SectionCard>
                    </TabsContent>

                    {/* 5 · Features */}
                    <TabsContent value="features" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Lightbulb} title="Key Features" description="Highlight what makes this project stand out (max 8)">
                            <DynamicList items={multi.features} onChange={updateMulti('features')} max={8} label=""
                                placeholder="e.g. Real-time data sync with WebSockets"
                                hint="List the most important capabilities of this project." />
                        </SectionCard>
                    </TabsContent>

                    {/* 6 · Challenges */}
                    <TabsContent value="challenges" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={AlertTriangle} title="Technical Challenges" description="Problems you encountered during development">
                            <DynamicList items={multi.challenges} onChange={updateMulti('challenges')} label=""
                                placeholder="e.g. Handling 10K concurrent WebSocket sessions" />
                        </SectionCard>
                        <SectionCard icon={Lightbulb} title="How You Solved Them" description="Corresponding solutions for each challenge above">
                            <DynamicList items={multi.solutions} onChange={updateMulti('solutions')} label=""
                                placeholder="e.g. Redis pub/sub + horizontal pod autoscaling" />
                        </SectionCard>
                    </TabsContent>

                    {/* 7 · Results */}
                    <TabsContent value="results" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={TrendingUp} title="Measurable Results & Metrics" description="Quantified outcomes and business impact">
                            <DynamicList items={multi.results} onChange={updateMulti('results')} label=""
                                placeholder="e.g. Reduced customer response time from 8 min → 30 sec"
                                hint="Include numbers wherever possible — they add credibility." />
                        </SectionCard>
                    </TabsContent>

                    {/* 8 · Links */}
                    <TabsContent value="links" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Link2} title="Project Links" description="URLs for source code, live demo, and video walkthrough">
                            <Grid2>
                                <div className="space-y-1.5">
                                    <FieldLabel>GitHub Repository</FieldLabel>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input {...register('githubLink')} placeholder="https://github.com/user/repo"
                                            className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>Live Demo</FieldLabel>
                                    <div className="relative">
                                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input {...register('liveDemo')} placeholder="https://myproject.vercel.app"
                                            className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>Video Demo</FieldLabel>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input {...register('videoDemo')} placeholder="https://youtube.com/watch?v=..."
                                            className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 transition-colors" />
                                    </div>
                                </div>
                            </Grid2>
                        </SectionCard>
                    </TabsContent>

                    {/* 9 · Timeline */}
                    <TabsContent value="timeline" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={CalendarDays} title="Project Timeline" description="Start date, end date, and duration">
                            <Grid2>
                                <StyledInput label="Start Date" type="date" {...register('startDate')} placeholder="" />
                                <StyledInput label="End Date" type="date" {...register('endDate')} placeholder="" />
                                <StyledInput label="Duration"
                                    placeholder="e.g. 3 months, 6 weeks"
                                    hint="Optional — describe the project duration in plain language."
                                    {...register('duration')} />
                            </Grid2>
                        </SectionCard>
                    </TabsContent>

                    {/* 10 · AI Fields */}
                    <TabsContent value="ai" className="mt-0 outline-none space-y-5">
                        <SectionCard icon={Bot} title="AI Internal Fields" description="Auto-generated by the AI pipeline — read-only">
                            <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-700 dark:text-amber-400 font-medium">
                                <Bot className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                These are populated automatically after save & AI processing. Do not edit manually.
                            </div>
                            <Grid2>
                                <div className="space-y-1.5">
                                    <FieldLabel>AI Search Index Text</FieldLabel>
                                    <Input disabled value={titleValue ? `AI-indexed: "${titleValue}"` : 'Generated after save…'}
                                        className="bg-muted/50 border-border/40 rounded-xl font-mono text-xs text-muted-foreground" />
                                </div>
                                <div className="space-y-1.5">
                                    <FieldLabel>Embedding Vector</FieldLabel>
                                    <Input disabled value="[0.231, -0.841, 0.107, 0.654, ...]"
                                        className="bg-muted/50 border-border/40 rounded-xl font-mono text-xs text-muted-foreground" />
                                </div>
                                <ColSpan2>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { label: 'Similarity Score', value: '0.94' },
                                            { label: 'Content Quality', value: 'High' },
                                            { label: 'Last AI Sync', value: 'Not synced yet' },
                                        ].map(s => (
                                            <div key={s.label} className="bg-muted/30 border border-border/40 rounded-xl px-4 py-3">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
                                                <p className="text-sm font-bold text-foreground mt-1">{s.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ColSpan2>
                            </Grid2>
                        </SectionCard>
                    </TabsContent>
                </div>

                {/* ── Sticky Footer ───────────────────────────────────────────────── */}
                <div className="sticky bottom-0 z-20 border-t border-border/40 bg-background/95 backdrop-blur-md px-6 py-4">
                    <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
                        {/* Progress dots + back */}
                        <div className="flex items-center gap-3">
                            <Button type="button" variant="ghost" onClick={goPrev} disabled={isFirst}
                                className="rounded-xl border border-border/60 gap-1.5 h-9 px-3 disabled:opacity-30">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back</span>
                            </Button>
                            <div className="hidden sm:flex items-center gap-1.5">
                                {TABS.map((t, i) => (
                                    <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                                        className={cn(
                                            'rounded-full transition-all duration-200',
                                            t.id === activeTab ? 'bg-violet-500 w-5 h-2'
                                                : i < currentIdx ? 'bg-emerald-500 w-2 h-2'
                                                    : 'bg-border w-2 h-2'
                                        )}
                                        aria-label={t.label}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground sm:hidden">
                                {currentIdx + 1} / {TABS.length}
                            </span>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => router.push('/admin/project-manager')}
                                className="rounded-xl border-border/60 h-9 px-4">
                                Cancel
                            </Button>
                            {!isLast ? (
                                <Button type="button" onClick={goNext}
                                    className="rounded-xl h-9 px-5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-lg gap-1.5">
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={submitting}
                                    className="rounded-xl h-9 min-w-[160px] bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-lg gap-2">
                                    {submitting
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                                        : <><Save className="w-4 h-4" />{mode === 'edit' ? 'Save Changes' : 'Create Project'}</>
                                    }
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Tabs>
        </form>
    )
}
