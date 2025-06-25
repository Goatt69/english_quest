"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { SectionDialog } from "@/components/admin/section-dialog"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import type { QuizSection } from "@/types/quiz"
import { useToast } from "@/hooks/use-toast"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { adminApi } from "@/lib/adminApi";
import SharedLayout from "@/components/SharedLayout";

export default function SectionsPage() {
  const [sections, setSections] = useState<QuizSection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<QuizSection | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const data = await adminApi.getSections()
      setSections(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setSelectedSection(null)
    setShowDialog(true)
  }

  const handleEdit = (section: QuizSection) => {
    setSelectedSection(section)
    setShowDialog(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await adminApi.deleteSection(deleteId)
      setSections(sections.filter((s) => s.id !== deleteId))
      toast({
        title: "Success",
        description: "Section deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setDeleteId(null)
    }
  }

  const handleSave = async (data: Partial<QuizSection>) => {
    try {
      if (selectedSection) {
        const updated = await adminApi.updateSection(selectedSection.id, data)
        setSections(sections.map((s) => (s.id === selectedSection.id ? updated : s)))
        toast({
          title: "Success",
          description: "Section updated successfully",
        })
      } else {
        const created = await adminApi.createSection(data)
        setSections([...sections, created])
        toast({
          title: "Success",
          description: "Section created successfully",
        })
      }
      setShowDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save section",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading sections...</div>
      </div>
    )
  }

  return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Quiz Sections</h1>
                <p className="text-muted-foreground">Manage your quiz sections</p>
              </div>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription className="mt-1">{section.description}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(section)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(section.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Order:</span>
                        <span>{section.order}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Levels:</span>
                        <span>{section.totalLevels}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Duration:</span>
                        <span>{section.estimatedMinutes} min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Access:</span>
                        <Badge
                            variant={
                              section.requiredPlan === 0 ? "default" : section.requiredPlan === 1 ? "secondary" : "outline"
                            }
                        >
                          {section.requiredPlan === 0 ? "Free" : section.requiredPlan === 1 ? "Support" : "Premium"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant={section.isActive ? "default" : "destructive"}>
                          {section.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          <SectionDialog open={showDialog} onOpenChange={setShowDialog} section={selectedSection} onSave={handleSave} />

          <DeleteDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={confirmDelete}
              title="Delete Section"
              description="Are you sure you want to delete this section? This action cannot be undone."
          />
        </div>
  )
}
