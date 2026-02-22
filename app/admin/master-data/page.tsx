'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Database, Plus, Search, Filter, MoreHorizontal,
    CheckCircle2, XCircle, Trash2, Edit2, Loader2, Save, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    getMasterData,
    saveMasterData,
    MasterDataItem,
    MasterDataType
} from '@/lib/master-data-store'

const TYPE_LABELS: Record<MasterDataType, string> = {
    tech_stack: 'Tech Stack',
    category: 'Category',
    tag: 'Tag',
    architecture: 'Architecture',
    role: 'Role',
    hosting: 'Hosting Option',
    methodology: 'Methodology',
    industry: 'Industry Domain'
}

export default function MasterDataPage() {
    const [data, setData] = useState<MasterDataItem[]>([])
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState<string>('all')
    const [loading, setLoading] = useState(true)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null)
    const [formData, setFormData] = useState({ name: '', type: 'tech_stack' as MasterDataType, status: 'active' as const })

    useEffect(() => {
        // Initial Load
        setData(getMasterData())
        setLoading(false)

        // Listen for updates
        const handleUpdate = () => setData(getMasterData())
        window.addEventListener('master_data_updated', handleUpdate)
        return () => window.removeEventListener('master_data_updated', handleUpdate)
    }, [])

    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const matchesType = filterType === 'all' || item.type === filterType
        return matchesSearch && matchesType
    })

    const handleOpenAdd = () => {
        setEditingItem(null)
        setFormData({ name: '', type: 'tech_stack', status: 'active' })
        setIsModalOpen(true)
    }

    const handleOpenEdit = (item: MasterDataItem) => {
        setEditingItem(item)
        setFormData({ name: item.name, type: item.type, status: item.status })
        setIsModalOpen(true)
    }

    const handleSave = () => {
        if (!formData.name.trim()) return

        let newData: MasterDataItem[]
        if (editingItem) {
            newData = data.map(item => item.id === editingItem.id ? { ...item, ...formData } : item)
        } else {
            const newItem: MasterDataItem = {
                id: `id-${Date.now()}`,
                ...formData
            }
            newData = [...data, newItem]
        }

        saveMasterData(newData)
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        const newData = data.filter(item => item.id !== id)
        saveMasterData(newData)
    }

    const toggleStatus = (id: string) => {
        const newData = data.map(item =>
            item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' as any } : item
        )
        saveMasterData(newData)
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* ── Page Header ─────────────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Master Data Manager</h1>
                        <p className="text-sm text-muted-foreground">Manage dropdown values and technical taxonomies across the platform.</p>
                    </div>
                    <Button
                        onClick={handleOpenAdd}
                        className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 gap-2 h-11 px-6 font-medium transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add New Entry
                    </Button>
                </div>

                {/* ── Search & Filter ──────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card/40 border border-border/40 p-4 rounded-2xl backdrop-blur-sm">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl focus:ring-4 focus:ring-violet-500/5 transition-all"
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="h-11 bg-background/50 border-border/50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter by Type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {Object.entries(TYPE_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* ── Table UI ─────────────────────────────────────────────────────── */}
                <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/40 bg-muted/30">
                                    <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Name</th>
                                    <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Type</th>
                                    <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Status</th>
                                    <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground/80 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500" />
                                                <p className="mt-4 text-sm text-muted-foreground font-medium italic">Loading master data...</p>
                                            </td>
                                        </tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <div className="p-4 rounded-full bg-muted/30 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                    <Database className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground text-sm font-medium">No entries found matching your criteria.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={item.id}
                                                className="hover:bg-muted/10 transition-colors group"
                                            >
                                                <td className="py-4 px-6">
                                                    <span className="text-base font-medium text-foreground">{item.name}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge variant="outline" className="bg-muted/50 font-medium text-[11px] uppercase tracking-tighter">
                                                        {TYPE_LABELS[item.type]}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        onClick={() => toggleStatus(item.id)}
                                                        className={cn(
                                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                                                            item.status === 'active'
                                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20"
                                                                : "bg-red-500/10 text-red-600 dark:text-red-400 group-hover:bg-red-500/20"
                                                        )}
                                                    >
                                                        {item.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                        {item.status.toUpperCase()}
                                                    </button>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="group-hover:bg-muted/50 rounded-lg">
                                                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                                            <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="gap-2 focus:bg-violet-500/5 focus:text-violet-600">
                                                                <Edit2 className="w-3.5 h-3.5" /> Edit entry
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(item.id)}
                                                                className="gap-2 text-red-600 focus:bg-red-500/5 focus:text-red-600"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Add/Edit Modal ───────────────────────────────────────────────── */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden bg-card">
                    <div className="px-8 py-6 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border-b border-border/40">
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            {editingItem ? 'Edit entry' : 'Add new entry'}
                        </DialogTitle>
                        <DialogDescription className="text-sm mt-1">
                            {editingItem ? 'Update the details for this system taxonomy item.' : 'Create a new item for the system dropdown menus.'}
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Entry Name</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData(s => ({ ...s, name: e.target.value }))}
                                placeholder="e.g. Next.js, AI, SaaS..."
                                className="h-11 bg-muted/20 border-border/50 rounded-xl focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">Taxonomy Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={v => setFormData(s => ({ ...s, type: v as MasterDataType }))}
                                disabled={!!editingItem}
                            >
                                <SelectTrigger className="h-11 bg-muted/20 border-border/50 rounded-xl font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(TYPE_LABELS).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 px-1">System Status</Label>
                            <div className="flex gap-2">
                                {(['active', 'inactive'] as const).map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData(f => ({ ...f, status: s }))}
                                        className={cn(
                                            "flex-1 h-11 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2",
                                            formData.status === s
                                                ? "bg-violet-500/10 border-violet-500 text-violet-600"
                                                : "bg-muted/10 border-transparent text-muted-foreground hover:bg-muted/20"
                                        )}
                                    >
                                        {s === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="h-11 rounded-xl px-6 font-bold uppercase text-[11px] tracking-widest">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="h-11 rounded-xl px-10 bg-violet-600 hover:bg-violet-700 text-white font-bold uppercase text-[11px] tracking-[0.15em] shadow-lg shadow-violet-500/20"
                        >
                            {editingItem ? 'Save Updates' : 'Add to System'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
