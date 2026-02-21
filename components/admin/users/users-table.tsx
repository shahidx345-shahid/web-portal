'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { UserFormModal } from './user-form-modal'

const users = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'SJ',
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@example.com',
    role: 'Editor',
    status: 'active',
    joinDate: '2024-01-20',
    avatar: 'MC',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'Contributor',
    status: 'active',
    joinDate: '2024-02-01',
    avatar: 'EW',
  },
  {
    id: 4,
    name: 'John Smith',
    email: 'john@example.com',
    role: 'Viewer',
    status: 'inactive',
    joinDate: '2024-02-05',
    avatar: 'JS',
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    role: 'Editor',
    status: 'active',
    joinDate: '2024-02-10',
    avatar: 'LA',
  },
]

const roleColors: Record<string, string> = {
  Admin: 'bg-red-500/20 text-red-700 dark:text-red-400',
  Editor: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  Contributor: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
  Viewer: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' },
  inactive: { label: 'Inactive', className: 'bg-gray-500/20 text-gray-700 dark:text-gray-400' },
}

export function UsersTable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    console.log('Delete user:', id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
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
            <CardTitle className="text-lg sm:text-xl">Admin Users</CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </motion.div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent px-4 sm:px-6">
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[140px] pl-4 sm:pl-6">User</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[160px] hidden sm:table-cell">Email</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px]">Role</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[90px] hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider min-w-[100px] hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wider pr-4 sm:pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => {
                    const statusConf = statusConfig[user.status as keyof typeof statusConfig]
                    const roleColor = roleColors[user.role]

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="pl-4 sm:pl-6">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 py-1">
                            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 border border-border/50">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs font-bold">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-xs sm:text-sm truncate text-foreground">{user.name}</span>
                              <span className="text-[10px] text-muted-foreground sm:hidden truncate">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${roleColor} text-[10px] sm:text-xs font-medium`}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className={`${statusConf.className} text-[10px] sm:text-xs font-medium`}>
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden lg:table-cell text-muted-foreground">{user.joinDate}</TableCell>
                        <TableCell className="text-right pr-4 sm:pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(user)}
                              className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user.id)}
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

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingUser={editingUser}
      />
    </>
  )
}
