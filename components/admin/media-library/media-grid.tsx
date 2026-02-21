'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, Download } from 'lucide-react'

const mediaFiles = [
  {
    id: 1,
    name: 'hero-banner.jpg',
    size: '2.4 MB',
    uploadDate: '2024-02-10',
    thumbnail: 'bg-gradient-to-br from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'product-image.png',
    size: '1.8 MB',
    uploadDate: '2024-02-09',
    thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-600',
  },
  {
    id: 3,
    name: 'team-photo.jpg',
    size: '3.2 MB',
    uploadDate: '2024-02-08',
    thumbnail: 'bg-gradient-to-br from-green-400 to-emerald-600',
  },
  {
    id: 4,
    name: 'logo-variant.svg',
    size: '156 KB',
    uploadDate: '2024-02-07',
    thumbnail: 'bg-gradient-to-br from-yellow-400 to-orange-600',
  },
  {
    id: 5,
    name: 'background-pattern.png',
    size: '897 KB',
    uploadDate: '2024-02-06',
    thumbnail: 'bg-gradient-to-br from-red-400 to-red-600',
  },
  {
    id: 6,
    name: 'icon-set.zip',
    size: '4.1 MB',
    uploadDate: '2024-02-05',
    thumbnail: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
}

export function MediaGrid() {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])

  const toggleSelect = (id: number) => {
    setSelectedFiles(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    )
  }

  const handleDelete = (id: number) => {
    console.log('Delete file:', id)
  }

  const handleDownload = (name: string) => {
    console.log('Download file:', name)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Upload Area */}
      <Card className="border-border/50 backdrop-blur-xl bg-gradient-to-br from-card via-card to-card/50">
        <CardContent className="pt-4 sm:pt-6">
          <motion.div
            whileHover={{ borderColor: 'var(--color-primary)' }}
            className="border-2 border-dashed border-border/50 rounded-lg p-6 sm:p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-block mb-3 sm:mb-4"
            >
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
            </motion.div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Upload Media</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Drag and drop your files here or click to browse
            </p>
            <input type="file" multiple className="hidden" />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" className="w-full sm:w-auto">Choose Files</Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card className="border-border/50 backdrop-blur-xl bg-gradient-to-br from-card via-card to-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {mediaFiles.map((file) => (
              <motion.div
                key={file.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                <div className={`relative w-full aspect-square rounded-lg ${file.thumbnail} mb-2 sm:mb-3 overflow-hidden shadow-lg`}>
                  {/* Overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    whileHover={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black/40 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.name)}
                        className="bg-white/20 hover:bg-white/30 text-white p-1 sm:p-2 h-auto w-auto"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="bg-destructive/20 hover:bg-destructive/30 text-white p-1 sm:p-2 h-auto w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Selection checkbox */}
                  <motion.input
                    whileHover={{ scale: 1.2 }}
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleSelect(file.id)}
                    className="absolute top-2 sm:top-3 left-2 sm:left-3 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer z-10 transition-transform"
                  />
                </div>

                <div className="space-y-0.5 sm:space-y-1 px-1 sm:px-0">
                  <p className="font-medium text-xs sm:text-sm truncate">{file.name}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span className="hidden sm:inline">{file.uploadDate}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
