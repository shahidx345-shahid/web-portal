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
import { PageFormModal } from './page-form-modal'

const pages = [
  {
    id: 1,
    title: 'Home',
    slug: 'home',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    title: 'About Us',
    slug: 'about-us',
    status: 'published',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    title: 'Services',
    slug: 'services',
    status: 'draft',
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    title: 'Contact',
    slug: 'contact',
    status: 'published',
    createdAt: '2024-02-05',
  },
  {
    id: 5,
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    status: 'published',
    createdAt: '2024-02-10',
  },
]

const statusConfig = {
  published: { label: 'Published', className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
  draft: { label: 'Draft', className: 'bg-amber-500/20 text-amber-700 dark:text-amber-400' },
}

export function PagesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPage, setEditingPage] = useState(null)

  const handleEdit = (page: any) => {
    setEditingPage(page)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    console.log('Delete page:', id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPage(null)
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
            <CardTitle className="text-lg sm:text-xl">Pages</CardTitle>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Page</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </motion.div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent px-4 sm:px-6">
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[120px] pl-4 sm:pl-6">Page Name</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden sm:table-cell">Slug</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[80px]">Status</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wider pr-4 sm:pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page, index) => {
                    const config = statusConfig[page.status as keyof typeof statusConfig]

                    return (
                      <motion.tr
                        key={page.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="pl-4 sm:pl-6">
                          <div className="flex flex-col py-1 min-w-0">
                            <span className="font-semibold text-xs sm:text-sm truncate text-foreground">{page.title}</span>
                            <span className="text-[10px] text-muted-foreground sm:hidden truncate">/{page.slug}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-muted-foreground">/{page.slug}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${config.className} text-[10px] sm:text-xs font-medium whitespace-nowrap`}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell text-muted-foreground">{page.createdAt}</TableCell>
                        <TableCell className="text-right pr-4 sm:pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(page)}
                              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(page.id)}
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

      <PageFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingPage={editingPage}
      />
    </>
  )
}
