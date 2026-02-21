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
import { Edit2, Trash2, Plus } from 'lucide-react'
import { BlogFormModal } from './blog-form-modal'

const blogs = [
  {
    id: 1,
    title: 'Getting Started with React',
    category: 'Technology',
    author: 'Sarah Johnson',
    publishDate: '2024-02-15',
    status: 'published',
  },
  {
    id: 2,
    title: 'Web Design Trends 2024',
    category: 'Design',
    author: 'Mike Chen',
    publishDate: '2024-02-10',
    status: 'published',
  },
  {
    id: 3,
    title: 'AI in Web Development',
    category: 'Technology',
    author: 'Emma Wilson',
    publishDate: '2024-02-05',
    status: 'published',
  },
  {
    id: 4,
    title: 'Best UX Practices',
    category: 'Design',
    author: 'John Smith',
    publishDate: '2024-02-01',
    status: 'draft',
  },
  {
    id: 5,
    title: 'Future of Web Technologies',
    category: 'Technology',
    author: 'Lisa Anderson',
    publishDate: '2024-01-28',
    status: 'published',
  },
]

const statusConfig = {
  published: { label: 'Published', className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
  draft: { label: 'Draft', className: 'bg-amber-500/20 text-amber-700 dark:text-amber-400' },
}

export function BlogTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    console.log('Delete blog:', id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBlog(null)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border/50 backdrop-blur-xl bg-gradient-to-br from-card via-card to-card/50">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg sm:text-xl">Blog Posts</CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Blog</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </motion.div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent px-4 sm:px-6">
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[150px] pl-4 sm:pl-6">Article</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden sm:table-cell">Category</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden md:table-cell">Author</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[110px] hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[70px]">Status</TableHead>
                    <TableHead className="text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wider pr-4 sm:pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog, index) => {
                    const config = statusConfig[blog.status as keyof typeof statusConfig]

                    return (
                      <motion.tr
                        key={blog.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="pl-4 sm:pl-6">
                          <div className="flex flex-col py-1 min-w-0">
                            <span className="font-semibold text-xs sm:text-sm truncate text-foreground">{blog.title}</span>
                            <div className="flex items-center gap-1 sm:hidden">
                              <span className="text-[10px] text-muted-foreground">{blog.category}</span>
                              <span className="text-[10px] text-muted-foreground/30">•</span>
                              <span className="text-[10px] text-muted-foreground">{blog.author}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-foreground/80">{blog.category}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell text-muted-foreground">{blog.author}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell text-muted-foreground">{blog.publishDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${config.className} text-[10px] sm:text-xs font-medium whitespace-nowrap`}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-4 sm:pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(blog)}
                              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(blog.id)}
                              className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingBlog={editingBlog}
      />
    </>
  )
}
