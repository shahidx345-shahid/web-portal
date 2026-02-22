import { useState, useRef, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check, Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
    value: string
    label: string
}

interface FieldSelectProps {
    id: string
    label: string
    placeholder: string
    options: (string | Option)[]
    value?: string
    onChange: (v: string) => void
    className?: string
    required?: boolean
    hint?: string
}

export function FieldSelect({
    id, label, placeholder, options, value, onChange, className, required, hint,
}: FieldSelectProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [width, setWidth] = useState<number>(0)

    useEffect(() => {
        if (triggerRef.current) setWidth(triggerRef.current.offsetWidth)
    }, [open])

    const normalised: Option[] = options.map(o =>
        typeof o === 'string' ? { value: o, label: o } : o
    )

    const filtered = normalised.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
    )

    const selectedOption = normalised.find(o => o.value === value)
    const exactMatch = normalised.find(o => o.label.toLowerCase() === search.toLowerCase())

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
                        className={cn(
                            'w-full h-12 flex items-center justify-between px-4',
                            'bg-background border border-border/60 rounded-lg',
                            'text-lg transition-all duration-200 outline-none text-left font-medium',
                            'hover:border-violet-500/40',
                            open && 'border-violet-500 ring-4 ring-violet-500/5',
                        )}
                    >
                        <span className={cn('truncate', !value && 'text-muted-foreground')}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronDown className={cn(
                            'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ml-2',
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
                        <div className="flex items-center gap-2 border-b border-border/50 px-3 py-3">
                            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search or type to add..."
                                className="flex-1 text-base bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
                            />
                        </div>

                        {search && !exactMatch && (
                            <button
                                type="button"
                                onClick={() => {
                                    const { addMasterItem } = require('@/lib/master-data-store')
                                    const masterTypeMap: Record<string, any> = {
                                        'proj-cat': 'category',
                                        'arch-type': 'architecture',
                                        'host-opt': 'hosting',
                                        'meth-opt': 'methodology',
                                        'role-opt': 'role',
                                        'industry-opt': 'industry'
                                    }
                                    const type = masterTypeMap[id] || 'category'
                                    addMasterItem(search, type)
                                    onChange(search) // Select the newly added item
                                    setSearch('')
                                    setOpen(false)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-violet-600 hover:bg-violet-500/5 transition-colors border-b border-border/30"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add &quot;{search}&quot; to System
                            </button>
                        )}

                        <CommandList className="max-h-64 overflow-y-auto">
                            {filtered.length === 0 && !search ? (
                                <div className="py-6 text-center text-sm text-muted-foreground italic">
                                    No options available.
                                </div>
                            ) : (
                                <CommandGroup>
                                    {filtered.map(opt => (
                                        <CommandItem
                                            key={opt.value}
                                            value={opt.value}
                                            onSelect={() => {
                                                onChange(opt.value)
                                                setOpen(false)
                                                setSearch('')
                                            }}
                                            className="flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer text-base"
                                        >
                                            <span className={cn(opt.value === value && "font-bold text-violet-600 dark:text-violet-400")}>
                                                {opt.label}
                                            </span>
                                            {opt.value === value && <Check className="w-5 h-5 text-violet-500" />}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {hint && <p className="text-[10px] text-muted-foreground italic">{hint}</p>}
        </div>
    )
}
