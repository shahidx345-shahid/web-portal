'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ContentFormProps {
    onClose: () => void
    initialData?: any
}

export function ContentForm({ onClose, initialData }: ContentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<string[]>(
        initialData?.graphics || [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=300&fit=crop',
        ]
    )

    const { register, control, handleSubmit, setValue, watch } = useForm({
        defaultValues: initialData || {
            title: '',
            category: '',
            status: 'draft',
            shortDescription: '',
            fullDescription: '',
            links: [{ title: '', url: '' }],
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'links'
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        console.log('Form data:', { ...data, images })
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        onClose()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info & Content */}
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500">Basic Information</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-semibold uppercase opacity-70">Project Title</Label>
                                <Input
                                    id="title"
                                    {...register('title')}
                                    placeholder="Enter project name..."
                                    className="bg-muted/30 border-border/50 focus:border-purple-500/50 transition-all rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase opacity-70">Category</Label>
                                    <Select onValueChange={(val) => setValue('category', val)} defaultValue={initialData?.category}>
                                        <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Page">Page</SelectItem>
                                            <SelectItem value="Blog">Blog</SelectItem>
                                            <SelectItem value="Link">External Link</SelectItem>
                                            <SelectItem value="Media">Media Resource</SelectItem>
                                            <SelectItem value="Article">Internal Article</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase opacity-70">Status</Label>
                                    <Select onValueChange={(val) => setValue('status', val)} defaultValue={initialData?.status || 'draft'}>
                                        <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500">Descriptions</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shortDescription" className="text-xs font-semibold uppercase opacity-70">Short Description</Label>
                                <Textarea
                                    id="shortDescription"
                                    {...register('shortDescription')}
                                    placeholder="A brief summary for cards and lists..."
                                    className="bg-muted/30 border-border/50 focus:border-purple-500/50 transition-all rounded-xl resize-none h-20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullDescription" className="text-xs font-semibold uppercase opacity-70">Full Content / Script</Label>
                                <Textarea
                                    id="fullDescription"
                                    {...register('fullDescription')}
                                    placeholder="Enter the main body content or rich script here..."
                                    className="bg-muted/30 border-border/50 focus:border-purple-500/50 transition-all rounded-xl min-h-[200px]"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Graphics & Links */}
                <div className="space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500">Graphics Upload</h3>
                            <Button type="button" variant="ghost" size="sm" className="text-xs text-purple-400">
                                <ImageIcon className="w-3 h-3 mr-2" />
                                Select Media
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileHover={{ y: -2 }}
                                    className="aspect-square rounded-xl bg-muted/50 border border-border/50 relative overflow-hidden group"
                                >
                                    <img src={img} alt={`Graphic ${i}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}>
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            <div className="aspect-square rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground hover:border-purple-500/50 hover:text-purple-400 transition-all cursor-pointer">
                                <Plus className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-bold uppercase">Add</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500">Links Section</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => append({ title: '', url: '' })}
                                className="text-xs text-purple-400 hover:text-purple-300"
                            >
                                <Plus className="w-3 h-3 mr-2" />
                                Add More Links
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence initial={false}>
                                {fields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex gap-3 items-end overflow-hidden pb-1"
                                    >
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                            <Input
                                                {...register(`links.${index}.title` as const)}
                                                placeholder="Link Label"
                                                className="bg-muted/30 border-border/50 rounded-xl py-1 px-3 h-9"
                                            />
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">URL</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                                <Input
                                                    {...register(`links.${index}.url` as const)}
                                                    placeholder="https://..."
                                                    className="bg-muted/30 border-border/50 rounded-xl pl-8 py-1 px-3 h-9"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            className="h-9 w-9 text-muted-foreground hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/50">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-xl font-semibold opacity-70 hover:opacity-100"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl min-w-[150px] bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/20"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        initialData ? 'Save Changes' : 'Create Content'
                    )}
                </Button>
            </div>
        </form>
    )
}
