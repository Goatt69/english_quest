import type React from "react"
import type { Metadata } from "next"
import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import AdminRouteGuard from "@/components/AdminRouteGuard"
import SharedLayout from "@/components/SharedLayout"

export const metadata: Metadata = {
  title: "Quiz Admin Dashboard",
  description: "Admin dashboard for managing quiz sections, levels, and questions",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SharedLayout showChatbox={false} showFooter={false} showNavbar={false}>
      <div className="flex min-h-screen bg-gray-50">
        <AdminRouteGuard>
          <SidebarProvider>
            <AdminSidebar />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </SidebarProvider>
        </AdminRouteGuard>
      </div>
      <Toaster />
    </SharedLayout>
  )
}