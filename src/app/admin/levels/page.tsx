"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { LevelDialog } from "@/components/admin/level-dialog"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { adminApi } from "@/lib/adminApi"
import type { QuizLevel, QuizSection } from "@/types/quiz"
import { useToast } from "@/hooks/use-toast"
import { SidebarTrigger } from "@/components/ui/sidebar"
import SharedLayout from "@/components/SharedLayout";

export default function LevelsPage() {
  const [levels, setLevels] = useState<QuizLevel[]>([])
  const [sections, setSections] = useState<QuizSection[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSections()
  }, [])

  useEffect(() => {
    if (selectedSectionId) {
      loadLevels(selectedSectionId)
    } else {
      setLevels([])
    }
  }, [selectedSectionId])

  const loadSections = async () => {
    try {
      const data = await adminApi.getSections()
      setSections(data)
      if (data.length > 0) {
        setSelectedSectionId(data[0].id)
      }
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

  const loadLevels = async (sectionId: string) => {
    try {
      const data = await adminApi.getLevels(sectionId)
      setLevels(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load levels",
        variant: "destructive",
      })
    }
  }

  const handleCreate = () => {
    setSelectedLevel(null)
    setShowDialog(true)
  }

  const handleEdit = (level: QuizLevel) => {
    setSelectedLevel(level)
    setShowDialog(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await adminApi.deleteLevel(deleteId)
      setLevels(levels.filter((l) => l.id !== deleteId))
      toast({
        title: "Success",
        description: "Level deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete level",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setDeleteId(null)
    }
  }

  const handleSave = async (data: Partial<QuizLevel>) => {
    try {
      if (selectedLevel) {
        const updated = await adminApi.updateLevel(selectedLevel.id, data)
        setLevels(levels.map((l) => (l.id === selectedLevel.id ? updated : l)))
        toast({
          title: "Success",
          description: "Level updated successfully",
        })
      } else {
        const created = await adminApi.createLevel({ ...data, sectionId: selectedSectionId })
        setLevels([...levels, created])
        toast({
          title: "Success",
          description: "Level created successfully",
        })
      }
      setShowDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save level",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading levels...</div>
        </div>
    )
  }

  return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Quiz Levels</h1>
                <p className="text-muted-foreground">Manage your quiz levels</p>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={!selectedSectionId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Level
            </Button>
          </div>

          <div className="mb-6">
            <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.title}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {levels.map((level) => (
                <Card key={level.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{level.title}</CardTitle>
                        {level.description && <CardDescription className="mt-1">{level.description}</CardDescription>}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(level)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(level.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Order:</span>
                        <span>{level.order}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Difficulty:</span>
                        <Badge variant="outline">{level.difficulty}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Questions:</span>
                        <span>{level.totalQuestions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Passing Score:</span>
                        <span>{level.passingScore}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Max Hearts:</span>
                        <span>{level.maxHearts}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge variant={level.isActive ? "default" : "destructive"}>
                          {level.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          <LevelDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              level={selectedLevel}
              sections={sections}
              onSave={handleSave}
          />

          <DeleteDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={confirmDelete}
              title="Delete Level"
              description="Are you sure you want to delete this level? This action cannot be undone."
          />
        </div>
      
  )
}