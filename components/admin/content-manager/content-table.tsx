'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Edit2, Trash2, Plus, Eye, Image as ImageIcon } from 'lucide-react'
import { ContentModal } from './content-modal'

const contentItems = [
    {
        id: 1,
        title: 'Modern Architecture Trends',
        category: 'Blog',
        status: 'published',
        createdAt: '2024-02-15',
        thumbnail: 'bg-gradient-to-br from-purple-400 to-indigo-600',
    },
    {
        id: 2,
        title: 'Company Services Page',
        category: 'Page',
        status: 'published',
        createdAt: '2024-02-12',
        thumbnail: 'bg-gradient-to-br from-blue-400 to-cyan-600',
    },
    {
        id: 3,
        title: 'Developer Documentation',
        category: 'Link',
        status: 'draft',
        createdAt: '2024-02-10',
        thumbnail: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    },
    {
        id: 4,
        title: 'Product Showcase Video',
        category: 'Media',
        status: 'published',
        createdAt: '2024-02-08',
        thumbnail: 'bg-gradient-to-br from-orange-400 to-rose-600',
    },
    {
        id: 5,
        title: 'Q1 Vision Statement',
        category: 'Article',
        status: 'draft',
        createdAt: '2024-02-05',
        thumbnail: 'bg-gradient-to-br from-amber-400 to-orange-600',
    },
]

const statusConfig = {
    published: { label: 'Published', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    draft: { label: 'Draft', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
}

export function ContentTable() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)

    const handleEdit = (item: any) => {
        setEditingItem(item)
        setIsModalOpen(true)
    }

    const handleDelete = (id: number) => {
        console.log('Delete item:', id)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingItem(null)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="border-border/50 backdrop-blur-xl bg-card/50 shadow-xl overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 p-6">
                        <div>
                            <CardTitle className="text-xl sm:text-2xl font-bold">Content Inventory</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">Manage all your company portal projects and content in one place.</p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="gap-2 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 shadow-lg"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Content
                            </Button>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent px-4 sm:px-6">
                                        <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[200px] pl-6 py-4">Thumbnail & Title</TableHead>
                                        <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden sm:table-cell">Category</TableHead>
                                        <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px]">Status</TableHead>
                                        <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[120px] hidden md:table-cell">Created Date</TableHead>
                                        <TableHead className="text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wider pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contentItems.map((item, index) => {
                                        const config = statusConfig[item.status as keyof typeof statusConfig]

                                        return (
                                            <motion.tr
                                                key={item.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-border/50 hover:bg-muted/30 transition-colors group"
                                            >
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-lg shadow-inner flex-shrink-0 flex items-center justify-center overflow-hidden",
                                                            item.thumbnail
                                                        )}>
                                                            <ImageIcon className="w-5 h-5 text-white/50" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="font-semibold text-sm truncate text-foreground group-hover:text-purple-400 transition-colors">{item.title}</span>
                                                            <span className="text-[10px] text-muted-foreground sm:hidden uppercase font-bold tracking-tighter">{item.category}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Badge variant="outline" className="bg-muted/50 font-medium text-[10px] uppercase tracking-wider">
                                                        {item.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn("text-[10px] font-bold uppercase py-0.5", config.className)}>
                                                        {config.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs hidden md:table-cell text-muted-foreground font-medium">
                                                    {item.createdAt}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 hover:bg-purple-500/10 hover:text-purple-500 text-muted-foreground transition-all"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(item)}
                                                            className="h-9 w-9 hover:bg-blue-500/10 hover:text-blue-500 text-muted-foreground transition-all"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="h-9 w-9 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <ContentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editingItem={editingItem}
            />
        </>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
