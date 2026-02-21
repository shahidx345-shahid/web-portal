'use client'

import { SidebarProvider } from '@/components/admin/sidebar-context'
import { AdminLayout } from '@/components/admin/layout'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}
