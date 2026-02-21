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
import { Edit2, Trash2, Plus, FileText } from 'lucide-react'
import { AITrainingFormModal } from './ai-training-form-modal'

const trainings = [
  {
    id: 1,
    title: 'React Best Practices',
    category: 'Frontend',
    uploadDate: '2024-02-10',
    fileSize: '2.4 MB',
    status: 'processed',
  },
  {
    id: 2,
    title: 'Node.js API Design',
    category: 'Backend',
    uploadDate: '2024-02-08',
    fileSize: '1.8 MB',
    status: 'processed',
  },
  {
    id: 3,
    title: 'Database Optimization',
    category: 'Database',
    uploadDate: '2024-02-05',
    fileSize: '3.2 MB',
    status: 'processing',
  },
  {
    id: 4,
    title: 'Cloud Architecture',
    category: 'DevOps',
    uploadDate: '2024-02-01',
    fileSize: '2.9 MB',
    status: 'processed',
  },
  {
    id: 5,
    title: 'Security Essentials',
    category: 'Security',
    uploadDate: '2024-01-28',
    fileSize: '1.5 MB',
    status: 'processed',
  },
]

const statusConfig = {
  processed: { label: 'Processed', className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
  processing: { label: 'Processing', className: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
  failed: { label: 'Failed', className: 'bg-red-500/20 text-red-700 dark:text-red-400' },
}

export function AITrainingTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTraining, setEditingTraining] = useState(null)

  const handleEdit = (training: any) => {
    setEditingTraining(training)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    console.log('Delete training:', id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTraining(null)
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
            <CardTitle className="text-lg sm:text-xl">AI Training Data</CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Data</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </motion.div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent px-4 sm:px-6">
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[140px] pl-4 sm:pl-6">Training Data</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden sm:table-cell">Category</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[110px] hidden md:table-cell">Upload Date</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[90px] hidden lg:table-cell">File Size</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[90px]">Status</TableHead>
                    <TableHead className="text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wider pr-4 sm:pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training, index) => {
                    const config = statusConfig[training.status as keyof typeof statusConfig]

                    return (
                      <motion.tr
                        key={training.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="pl-4 sm:pl-6">
                          <div className="flex items-center gap-3 py-1">
                            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg hidden sm:block">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-xs sm:text-sm truncate text-foreground">{training.title}</span>
                              <div className="flex items-center gap-1 sm:hidden text-[10px] text-muted-foreground">
                                <span>{training.category}</span>
                                <span>•</span>
                                <span>{training.fileSize}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-foreground/80">{training.category}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell text-muted-foreground">{training.uploadDate}</TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell text-muted-foreground">{training.fileSize}</TableCell>
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
                              onClick={() => handleEdit(training)}
                              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(training.id)}
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

      <AITrainingFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTraining={editingTraining}
      />
    </>
  )
}
