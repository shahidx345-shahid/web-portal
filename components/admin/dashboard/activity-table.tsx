'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const activities = [
  {
    id: 1,
    title: 'Modern Architecture Trends',
    category: 'Blog',
    timestamp: '2 hours ago',
    status: 'published',
  },
  {
    id: 2,
    title: 'Company Services Page',
    category: 'Page',
    timestamp: '5 hours ago',
    status: 'published',
  },
  {
    id: 3,
    title: 'Developer Documentation',
    category: 'Link',
    timestamp: 'Yesterday',
    status: 'draft',
  },
  {
    id: 4,
    title: 'Product Showcase Video',
    category: 'Media',
    timestamp: '2 days ago',
    status: 'published',
  },
  {
    id: 5,
    title: 'Q1 Vision Statement',
    category: 'Article',
    timestamp: '3 days ago',
    status: 'draft',
  },
]

const statusConfig = {
  published: { label: 'Published', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  draft: { label: 'Draft', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
}

export function ActivityTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <Card className="border-border/50 backdrop-blur-xl bg-card/50 shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold">Recent Content Updates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent px-4 sm:px-6">
                  <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[200px] pl-6">Title</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[120px] hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden md:table-cell">Updated</TableHead>
                  <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[90px] pr-6 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity, index) => {
                  const config = statusConfig[activity.status as keyof typeof statusConfig]

                  return (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium text-xs sm:text-sm py-4 pl-6">
                        <div className="flex flex-col gap-0.5">
                          {activity.title}
                          <span className="sm:hidden text-[10px] text-muted-foreground">{activity.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-muted-foreground">{activity.category}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell text-muted-foreground">{activity.timestamp}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <Badge variant="outline" className={cn("text-[10px] sm:text-xs font-bold uppercase", config.className)}>
                          {config.label}
                        </Badge>
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
  )
}
