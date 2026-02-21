'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Info, Cpu, Lightbulb, Layers, Link2, Bot,
    Plus, Trash2, X, Github, Video, Loader2, Sparkles,
    CheckCircle2, ChevronRight,
} from 'lucide-react'
import { FieldSelect } from './field-select'
import { FieldMultiSelect } from './field-multi-select'
import {
    TECH_STACK_OPTIONS, PROJECT_CATEGORY_OPTIONS, PROJECT_TYPE_OPTIONS,
    ARCHITECTURE_OPTIONS, DEPLOYMENT_OPTIONS, TAGS_OPTIONS,
    ROLE_OPTIONS, METHODOLOGY_OPTIONS, INDUSTRY_OPTIONS, STATUS_OPTIONS,
} from './data'
import { cn } from '@/lib/utils'

// ─── Utils ────────────────────────────────────────────────────────────────────

function toSlug(str: string) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
            {children}{required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
    )
}

function SectionHeader({ icon: Icon, title, description }: {
    icon: React.ElementType; title: string; description: string
}) {
    return (
        <div className="flex items-center gap-3 pb-4 border-b border-border/40 mb-6">
            <div className="p-2.5 rounded-xl bg-violet-500/10 flex-shrink-0">
                <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
                <h3 className="font-bold text-sm text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
        </div>
    )
}

/** Two-column responsive grid for form fields */
function FormGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
    return (
        <div className={cn(
            'grid grid-cols-1 gap-4',
            cols === 2 && 'md:grid-cols-2',
            cols === 3 && 'md:grid-cols-3',
        )}>
            {children}
        </div>
    )
}

/** Full-width cell spanning both columns */
function FullSpan({ children }: { children: React.ReactNode }) {
    return <div className="md:col-span-2">{children}</div>
}

/** Inline field for text input */
function TextField({
    label, placeholder, required, hint, mono = false, ...props
}: {
    label: string; placeholder: string; required?: boolean; hint?: string; mono?: boolean
} & React.ComponentProps<'input'>) {
    return (
        <div className="space-y-1.5">
            <FieldLabel required={required}>{label}</FieldLabel>
            <Input
                placeholder={placeholder}
                className={cn(
                    'bg-background border-border/60 rounded-xl h-10 text-sm',
                    'focus:border-violet-400 dark:focus:border-violet-500 transition-colors',
                    mono && 'font-mono text-xs text-muted-foreground'
                )}
                {...(props as any)}
            />
            {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
    )
}

function TextAreaField({
    label, placeholder, required, hint, rows = 4, ...props
}: {
    label: string; placeholder: string; required?: boolean; hint?: string; rows?: number
} & React.ComponentProps<'textarea'>) {
    return (
        <div className="space-y-1.5">
            <FieldLabel required={required}>{label}</FieldLabel>
            <Textarea
                placeholder={placeholder}
                rows={rows}
                className={cn(
                    'bg-background border-border/60 rounded-xl text-sm resize-none',
                    'focus:border-violet-400 dark:focus:border-violet-500 transition-colors'
                )}
                {...(props as any)}
            />
            {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
    )
}

function DynamicList({
    label, items, onChange, placeholder, max,
}: {
    label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string; max?: number
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
                        className="text-[11px] flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-700 font-bold transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Add
                    </button>
                )}
            </div>
            <AnimatePresence initial={false}>
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 overflow-hidden"
                    >
                        <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {i + 1}
                        </span>
                        <Input
                            value={item}
                            onChange={e => update(i, e.target.value)}
                            placeholder={placeholder}
                            className="bg-background border-border/60 rounded-xl h-9 text-sm flex-1 focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
                        />
                        <button type="button" onClick={() => remove(i)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
            {items.length === 0 && (
                <p className="text-xs text-muted-foreground italic px-1">
                    No items yet — click &quot;Add&quot; to start.
                </p>
            )}
            {max && items.length >= max && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    Maximum of {max} items reached.
                </p>
            )}
        </div>
    )
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
    { id: 'basic', label: 'Basic Info', short: '1. Basic', icon: Info },
    { id: 'tech', label: 'Tech Stack', short: '2. Tech', icon: Cpu },
    { id: 'content', label: 'Content', short: '3. Content', icon: Lightbulb },
    { id: 'features', label: 'Features', short: '4. Features', icon: Layers },
    { id: 'links', label: 'Links', short: '5. Links', icon: Link2 },
    { id: 'ai', label: 'AI Fields', short: '6. AI', icon: Bot },
]

// ─── Form values ──────────────────────────────────────────────────────────────

type FormValues = {
    title: string
    slug: string
    shortDescription: string
    problemStatement: string
    solutionOverview: string
    githubLink: string
    liveDemo: string
    videoDemo: string
    startDate: string
    endDate: string
}

type SelectState = {
    category: string
    type: string
    status: string
    architecture: string
    deployment: string
    role: string
    methodology: string
    industry: string
}

type MultiState = {
    techStack: string[]
    tags: string[]
    features: string[]
    challenges: string[]
    solutions: string[]
    results: string[]
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProjectFormProps {
    onClose: () => void
    initialData?: any
}

export function ProjectForm({ onClose, initialData }: ProjectFormProps) {
    const [activeTab, setActiveTab] = useState('basic')
    const [isSubmitting, setSubmitting] = useState(false)
    const [isDragging, setDragging] = useState(false)
    const [thumbnail, setThumbnail] = useState<string | null>(null)

    // Single-select state
    const [sel, setSel] = useState<SelectState>({
        category: initialData?.category || '',
        type: initialData?.type || '',
        status: initialData?.status || 'draft',
        architecture: '',
        deployment: '',
        role: '',
        methodology: '',
        industry: '',
    })

    // Multi-select state
    const [multi, setMulti] = useState<MultiState>({
        techStack: initialData?.techStack || [],
        tags: initialData?.tags || [],
        features: [],
        challenges: [],
        solutions: [],
        results: [],
    })

    const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            shortDescription: initialData?.shortDescription || '',
            problemStatement: '',
            solutionOverview: '',
            githubLink: '', liveDemo: '', videoDemo: '',
            startDate: '', endDate: '',
        }
    })

    const updateSel = (key: keyof SelectState) => (v: string) => setSel(s => ({ ...s, [key]: v }))
    const updateMulti = (key: keyof MultiState) => (v: string[]) => setMulti(m => ({ ...m, [key]: v }))

    const onSubmit = async (data: FormValues) => {
        setSubmitting(true)
        const payload = { ...data, ...sel, ...multi }
        console.log('📦 Project payload:', payload)
        await new Promise(r => setTimeout(r, 1500))
        setSubmitting(false)
        onClose()
    }

    const currentTabIndex = TABS.findIndex(t => t.id === activeTab)
    const isLast = currentTabIndex === TABS.length - 1
    const isFirst = currentTabIndex === 0

    const goNext = () => { if (!isLast) setActiveTab(TABS[currentTabIndex + 1].id) }
    const goPrev = () => { if (!isFirst) setActiveTab(TABS[currentTabIndex - 1].id) }

    // Thumbnail handlers
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file?.type.startsWith('image/')) readFile(file)
    }
    const readFile = (file: File) => {
        const r = new FileReader()
        r.onload = () => setThumbnail(r.result as string)
        r.readAsDataURL(file)
    }

    // ── Tab panels ──────────────────────────────────────────────────────────────

    const titleValue = watch('title')
    const descValue = watch('shortDescription')

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0">

            {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 pt-2 border-b border-border/40 bg-muted/20">
                    <TabsList className="h-auto bg-transparent p-0 gap-0 w-full overflow-x-auto flex flex-nowrap">
                        {TABS.map((tab, i) => {
                            const Icon = tab.icon
                            const isActive = tab.id === activeTab
                            const isCompleted = i < currentTabIndex
                            return (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={cn(
                                        'relative flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs font-semibold rounded-none',
                                        'border-b-2 transition-all duration-200 data-[state=active]:shadow-none',
                                        'bg-transparent hover:bg-muted/30',
                                        isActive
                                            ? 'border-violet-500 text-violet-600 dark:text-violet-400 data-[state=active]:bg-transparent'
                                            : 'border-transparent text-muted-foreground hover:text-foreground',
                                        isCompleted && !isActive && 'text-emerald-600 dark:text-emerald-400'
                                    )}
                                >
                                    {isCompleted && !isActive
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                        : <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    }
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{i + 1}</span>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                </div>

                {/* ── Panel wrapper ───────────────────────────────────────────────── */}
                <div className="px-6 py-6 space-y-6">

                    {/* ── TAB 1: Basic Info ─────────────────────────────────────────── */}
                    <TabsContent value="basic" className="mt-0 space-y-6 outline-none">
                        <SectionHeader
                            icon={Info}
                            title="Basic Information"
                            description="Core identification fields for this project"
                        />
                        <FormGrid>
                            <TextField
                                label="Project Title"
                                placeholder="e.g. AI-Powered Customer Chatbot"
                                required
                                {...register('title')}
                                onChange={e => {
                                    setValue('title', e.target.value)
                                    setValue('slug', toSlug(e.target.value))
                                }}
                            />
                            <TextField
                                label="URL Slug"
                                placeholder="auto-generated-slug"
                                mono
                                hint="Auto-generated from title. You can customize."
                                {...register('slug')}
                            />

                            <FieldSelect
                                id="category"
                                label="Project Category"
                                placeholder="Select Category"
                                options={PROJECT_CATEGORY_OPTIONS}
                                value={sel.category}
                                onChange={updateSel('category')}
                                required
                            />
                            <FieldSelect
                                id="type"
                                label="Project Type"
                                placeholder="Select Type"
                                options={PROJECT_TYPE_OPTIONS}
                                value={sel.type}
                                onChange={updateSel('type')}
                                required
                            />

                            <FieldSelect
                                id="status"
                                label="Status"
                                placeholder="Select Status"
                                options={STATUS_OPTIONS}
                                value={sel.status}
                                onChange={updateSel('status')}
                                required
                            />
                            <FieldSelect
                                id="industry"
                                label="Industry Domain"
                                placeholder="Select Industry"
                                options={INDUSTRY_OPTIONS}
                                value={sel.industry}
                                onChange={updateSel('industry')}
                            />

                            <FullSpan>
                                <TextAreaField
                                    label="Short Description"
                                    placeholder="Brief summary shown in cards and AI search results (max 200 chars)..."
                                    rows={3}
                                    required
                                    hint="Used in project cards, search results, and AI embeddings."
                                    {...register('shortDescription')}
                                />
                            </FullSpan>

                            {/* Thumbnail */}
                            <FullSpan>
                                <FieldLabel>Thumbnail Image</FieldLabel>
                                <div
                                    onDragOver={e => { e.preventDefault(); setDragging(true) }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    className={cn(
                                        'relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200',
                                        isDragging
                                            ? 'border-violet-500 bg-violet-500/10'
                                            : 'border-border/60 hover:border-violet-400 bg-muted/10'
                                    )}
                                >
                                    {thumbnail ? (
                                        <div className="relative">
                                            <img src={thumbnail} alt="Thumbnail" className="w-full h-44 object-cover" />
                                            <button
                                                type="button" onClick={() => setThumbnail(null)}
                                                className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/20 text-foreground hover:bg-red-500 hover:text-white transition-colors"
                                            >
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
                                                onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f) }}
                                            />
                                        </label>
                                    )}
                                </div>
                            </FullSpan>

                            <FullSpan>
                                <FieldMultiSelect
                                    id="tags"
                                    label="Tags / Keywords"
                                    placeholder="Select relevant tags..."
                                    options={TAGS_OPTIONS}
                                    selected={multi.tags}
                                    onChange={updateMulti('tags')}
                                    hint="Select all keywords that describe this project."
                                />
                            </FullSpan>
                        </FormGrid>
                    </TabsContent>

                    {/* ── TAB 2: Tech Stack ─────────────────────────────────────────── */}
                    <TabsContent value="tech" className="mt-0 space-y-6 outline-none">
                        <SectionHeader
                            icon={Cpu}
                            title="Tech Stack & Infrastructure"
                            description="Technical stack, architecture, and deployment configuration"
                        />
                        <FormGrid>
                            <FullSpan>
                                <FieldMultiSelect
                                    id="techStack"
                                    label="Technologies Used"
                                    placeholder="Search and select technologies..."
                                    options={TECH_STACK_OPTIONS}
                                    selected={multi.techStack}
                                    onChange={updateMulti('techStack')}
                                    required
                                    hint="Search and select all technologies used in this project."
                                />
                                {/* Selected preview chips */}
                                {multi.techStack.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {multi.techStack.map(t => (
                                            <span key={t} className="text-xs bg-muted border border-border/60 rounded-lg px-2.5 py-1 font-semibold text-foreground/80">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </FullSpan>

                            <FieldSelect
                                id="architecture"
                                label="Architecture Type"
                                placeholder="Select Architecture"
                                options={ARCHITECTURE_OPTIONS}
                                value={sel.architecture}
                                onChange={updateSel('architecture')}
                            />
                            <FieldSelect
                                id="deployment"
                                label="Deployment / Hosting"
                                placeholder="Select Platform"
                                options={DEPLOYMENT_OPTIONS}
                                value={sel.deployment}
                                onChange={updateSel('deployment')}
                            />
                            <FieldSelect
                                id="methodology"
                                label="Development Methodology"
                                placeholder="Select Methodology"
                                options={METHODOLOGY_OPTIONS}
                                value={sel.methodology}
                                onChange={updateSel('methodology')}
                            />
                            <FieldSelect
                                id="role"
                                label="Your Role"
                                placeholder="Select Role"
                                options={ROLE_OPTIONS}
                                value={sel.role}
                                onChange={updateSel('role')}
                            />
                        </FormGrid>
                    </TabsContent>

                    {/* ── TAB 3: Content ────────────────────────────────────────────── */}
                    <TabsContent value="content" className="mt-0 space-y-6 outline-none">
                        <SectionHeader
                            icon={Lightbulb}
                            title="Problem, Solution & Context"
                            description="Rich content used for AI training, portfolio, and search"
                        />
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/15 text-xs text-violet-700 dark:text-violet-400 font-medium">
                            <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            These fields directly feed the AI search index and chatbot training pipeline.
                        </div>
                        <FormGrid>
                            <TextAreaField
                                label="Problem Statement"
                                placeholder="What specific problem does this project solve? Include the user's pain points and context..."
                                rows={5}
                                {...register('problemStatement')}
                            />
                            <TextAreaField
                                label="Solution Overview"
                                placeholder="Describe your approach, methodology, and how it addresses the problem effectively..."
                                rows={5}
                                {...register('solutionOverview')}
                            />
                        </FormGrid>
                    </TabsContent>

                    {/* ── TAB 4: Features ───────────────────────────────────────────── */}
                    <TabsContent value="features" className="mt-0 space-y-6 outline-none">
                        <SectionHeader
                            icon={Layers}
                            title="Features, Challenges & Results"
                            description="Key deliverables and measurable outcomes"
                        />
                        <FormGrid>
                            <FullSpan>
                                <DynamicList
                                    label="Key Features (max 6)"
                                    items={multi.features}
                                    onChange={updateMulti('features')}
                                    placeholder="e.g. Real-time data sync with WebSockets"
                                    max={6}
                                />
                            </FullSpan>
                            <Separator className="md:col-span-2 bg-border/40" />
                            <DynamicList
                                label="Technical Challenges"
                                items={multi.challenges}
                                onChange={updateMulti('challenges')}
                                placeholder="e.g. Handling 10K concurrent sessions"
                            />
                            <DynamicList
                                label="How Challenges Were Solved"
                                items={multi.solutions}
                                onChange={updateMulti('solutions')}
                                placeholder="e.g. Redis pub/sub with horizontal scaling"
                            />
                            <Separator className="md:col-span-2 bg-border/40" />
                            <FullSpan>
                                <DynamicList
                                    label="Measurable Results & Metrics"
                                    items={multi.results}
                                    onChange={updateMulti('results')}
                                    placeholder="e.g. Reduced response time by 40%"
                                />
                            </FullSpan>
                        </FormGrid>
                    </TabsContent>

                    {/* ── TAB 5: Links & Timeline ───────────────────────────────────── */}
                    <TabsContent value="links" className="mt-0 space-y-6 outline-none">
                        <SectionHeader
                            icon={Link2}
                            title="Project Links & Timeline"
                            description="URLs and project duration"
                        />
                        <FormGrid>
                            <div className="space-y-1.5">
                                <FieldLabel>GitHub Repository</FieldLabel>
                                <div className="relative">
                                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        {...register('githubLink')}
                                        placeholder="https://github.com/user/repo"
                                        className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Live Demo</FieldLabel>
                                <div className="relative">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        {...register('liveDemo')}
                                        placeholder="https://myproject.vercel.app"
                                        className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Video Demo (Optional)</FieldLabel>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        {...register('videoDemo')}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="pl-9 bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 transition-colors"
                                    />
                                </div>
                            </div>
                            <div />
                            <TextField
                                label="Start Date"
                                placeholder=""
                                type="date"
                                {...register('startDate')}
                            />
                            <TextField
                                label="End Date"
                                placeholder=""
                                type="date"
                                {...register('endDate')}
                            />
                        </FormGrid>
                    </TabsContent>

                    {/* ── TAB 6: AI Fields ──────────────────────────────────────────── */}
                    <TabsContent value="ai" className="mt-0 space-y-6 outline-none">
                        <SectionHeader
                            icon={Bot}
                            title="AI Internal Fields"
                            description="Auto-generated by the AI pipeline — read-only in the UI"
                        />
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-700 dark:text-amber-400 font-medium">
                            <Bot className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            These fields are populated automatically after save & AI processing. Do not edit manually.
                        </div>
                        <FormGrid>
                            <div className="space-y-1.5">
                                <FieldLabel>AI Search Text</FieldLabel>
                                <Input
                                    disabled
                                    value={titleValue ? `AI-indexed: "${titleValue}"` : 'Will be generated after save...'}
                                    className="bg-muted/50 border-border/40 rounded-xl font-mono text-xs text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <FieldLabel>Embedding Vector</FieldLabel>
                                <Input
                                    disabled
                                    value="[0.231, -0.841, 0.107, 0.654, ...]"
                                    className="bg-muted/50 border-border/40 rounded-xl font-mono text-xs text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <FullSpan>
                                <div className="space-y-1.5">
                                    <FieldLabel>AI Summary Preview</FieldLabel>
                                    <Textarea
                                        disabled
                                        value={descValue ? `AI Summary: ${descValue}` : 'AI summary will appear here after the project is saved and processed by the AI pipeline...'}
                                        rows={3}
                                        className="bg-muted/50 border-border/40 rounded-xl font-mono text-xs text-muted-foreground cursor-not-allowed resize-none"
                                    />
                                </div>
                            </FullSpan>
                            <FullSpan>
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
                            </FullSpan>
                        </FormGrid>
                    </TabsContent>
                </div>
            </Tabs>

            {/* ── Footer: Nav + Submit ─────────────────────────────────────────── */}
            <div className="px-6 pb-6 pt-4 border-t border-border/40 flex items-center justify-between gap-3 bg-muted/10">
                <div className="flex items-center gap-2">
                    <Button
                        type="button" variant="ghost" onClick={goPrev} disabled={isFirst}
                        className="rounded-xl border border-border/60 text-sm disabled:opacity-30"
                    >
                        ← Back
                    </Button>
                    {/* Step indicator */}
                    <div className="hidden sm:flex items-center gap-1.5">
                        {TABS.map((t, i) => (
                            <button
                                key={t.id} type="button"
                                onClick={() => setActiveTab(t.id)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all duration-200',
                                    t.id === activeTab
                                        ? 'bg-violet-500 w-5'
                                        : i < currentTabIndex
                                            ? 'bg-emerald-500'
                                            : 'bg-border'
                                )}
                                aria-label={t.label}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-border/60">
                        Cancel
                    </Button>
                    {!isLast ? (
                        <Button
                            type="button" onClick={goNext}
                            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-lg gap-1.5"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            type="submit" disabled={isSubmitting}
                            className="rounded-xl min-w-[150px] bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-lg"
                        >
                            {isSubmitting
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</>
                                : initialData ? 'Save Changes' : 'Create Project'
                            }
                        </Button>
                    )}
                </div>
            </div>
        </form>
    )
}
