'use client'

/**
 * FieldMultiSelect — searchable, checkbox-driven multi-select dropdown.
 * Built with ShadCN Popover + Command + Checkbox.
 * Supports: search filtering, select-all, selected chip badges, max limit.
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronDown, X, Check, Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FieldMultiSelectProps {
    id: string
    label: string
    placeholder: string
    options: string[]
    selected: string[]
    onChange: (v: string[]) => void
    max?: number
    className?: string
    required?: boolean
    hint?: string
}

export function FieldMultiSelect({
    id, label, placeholder, options, selected, onChange, max, className, required, hint,
}: FieldMultiSelectProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [width, setWidth] = useState<number>(0)

    useEffect(() => {
        if (triggerRef.current) setWidth(triggerRef.current.offsetWidth)
    }, [open])

    const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

    const toggle = (opt: string) => {
        if (selected.includes(opt)) {
            onChange(selected.filter(s => s !== opt))
        } else {
            if (max && selected.length >= max) return
            onChange([...selected, opt])
        }
    }

    const removeOne = (opt: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(selected.filter(s => s !== opt))
    }

    const isAtMax = max ? selected.length >= max : false

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label htmlFor={id} className="text-base font-bold text-foreground/90 block mb-2.5 px-0.5 uppercase tracking-wide">
                    {label}{required && <span className="text-violet-500 ml-1">*</span>}
                </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        ref={triggerRef}
                        id={id}
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        className={cn(
                            'w-full min-h-[48px] flex items-center flex-wrap gap-2 text-left',
                            'bg-background border border-border/60 rounded-lg px-4 py-2.5',
                            'text-lg transition-all duration-200 outline-none font-medium',
                            'hover:border-violet-500/40',
                            open && 'border-violet-500 ring-4 ring-violet-500/5',
                        )}
                    >
                        {selected.length === 0 ? (
                            <span className="text-muted-foreground text-sm self-center py-1">{placeholder || "Select multiple..."}</span>
                        ) : (
                            <div className="flex flex-wrap gap-1.5 py-0.5">
                                {selected.map(s => (
                                    <motion.span
                                        key={s}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="inline-flex items-center gap-1.5 bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30 text-xs font-bold uppercase tracking-wider rounded-md px-2.5 py-1.5"
                                    >
                                        {s}
                                        <button
                                            type="button"
                                            onClick={e => removeOne(s, e)}
                                            className="hover:text-red-500 transition-colors ml-0.5"
                                            aria-label={`Remove ${s}`}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </motion.span>
                                ))}
                            </div>
                        )}
                        <ChevronDown className={cn(
                            'w-5 h-5 text-muted-foreground ml-auto self-center flex-shrink-0 transition-transform duration-200',
                            open && 'rotate-180'
                        )} />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    className="p-0 rounded-xl border-border/60 shadow-xl"
                    style={{ width: width ? `${width}px` : '100%' }}
                    align="start"
                    sideOffset={6}
                >
                    <Command shouldFilter={false}>
                        {/* Search bar */}
                        <div className="flex items-center gap-2 border-b border-border/50 px-3 py-3">
                            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search or add new..."
                                className="flex-1 text-base bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Add New Quick Action */}
                        {search && !options.find(o => o.toLowerCase() === search.toLowerCase()) && (
                            <button
                                type="button"
                                onClick={() => {
                                    const { addMasterItem } = require('@/lib/master-data-store')
                                    const masterTypeMap: Record<string, any> = {
                                        'tech-stack': 'tech_stack',
                                        'tag-opt': 'tag'
                                    }
                                    const type = masterTypeMap[id] || 'tech_stack'
                                    addMasterItem(search, type)
                                    setSearch('')
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-violet-600 hover:bg-violet-500/5 transition-colors border-b border-border/30"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add &quot;{search}&quot; to System
                            </button>
                        )}

                        {/* Selected count + clear */}
                        {selected.length > 0 && (
                            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-muted/20">
                                <span className="text-[11px] text-muted-foreground font-medium">
                                    {selected.length} selected{max ? ` / ${max} max` : ''}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onChange([])}
                                    className="text-[11px] text-red-600 dark:text-red-400 hover:underline font-semibold"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        <CommandList className="max-h-56 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <CommandEmpty className="text-sm text-muted-foreground py-6 text-center">
                                    No options found.
                                </CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {filtered.map(opt => {
                                        const isSelected = selected.includes(opt)
                                        const disabled = !isSelected && isAtMax
                                        return (
                                            <CommandItem
                                                key={opt}
                                                value={opt}
                                                onSelect={() => toggle(opt)}
                                                disabled={disabled}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer text-base',
                                                    'aria-selected:bg-accent',
                                                    disabled && 'opacity-40 cursor-not-allowed',
                                                    isSelected && 'bg-violet-500/5 rotate-0'
                                                )}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    className={cn(
                                                        'h-5 w-5 rounded-[6px] border-border/60 flex-shrink-0 transition-all',
                                                        isSelected && 'border-violet-500 bg-violet-500 text-white'
                                                    )}
                                                    aria-hidden
                                                />
                                                <span className={cn('flex-1 font-bold', isSelected && 'text-violet-700 dark:text-violet-300')}>
                                                    {opt}
                                                </span>
                                                {isSelected && <Check className="w-5 h-5 text-violet-500 flex-shrink-0" />}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>

                        {/* Footer */}
                        <div className="border-t border-border/40 px-3 py-2 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">
                                {filtered.length} option{filtered.length !== 1 ? 's' : ''}
                            </span>
                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="h-6 text-xs rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
                            >
                                Done
                            </Button>
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>

            {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
    )
}
