'use client'

/**
 * FieldSelect — a styled single-select dropdown built on ShadCN Select.
 * Fully light/dark-mode compatible, rounded, with icon support.
 */

import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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
    const normalised: Option[] = options.map(o =>
        typeof o === 'string' ? { value: o, label: o } : o
    )

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    id={id}
                    className="w-full bg-background border-border/60 rounded-xl h-10 text-sm focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/60 shadow-xl">
                    {normalised.map(opt => (
                        <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="rounded-lg text-sm cursor-pointer"
                        >
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
    )
}
