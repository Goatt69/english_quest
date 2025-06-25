"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QuizLevel, QuizSection } from "@/types/quiz"

interface LevelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: QuizLevel | null
  sections: QuizSection[]
  onSave: (data: Partial<QuizLevel>) => void
}

export function LevelDialog({ open, onOpenChange, level, sections, onSave }: LevelDialogProps) {
  const [formData, setFormData] = useState({
    sectionId: "",
    title: "",
    description: "",
    order: 1,
    difficulty: 0,
    passingScore: 70,
    maxHearts: 5,
    isActive: true,
  })

  useEffect(() => {
    if (level) {
      setFormData({
        sectionId: level.sectionId,
        title: level.title,
        description: level.description || "",
        order: level.order,
        difficulty: level.difficulty,
        passingScore: level.passingScore,
        maxHearts: level.maxHearts,
        isActive: level.isActive,
      })
    } else {
      setFormData({
        sectionId: sections[0]?.id || "",
        title: "",
        description: "",
        order: 1,
        difficulty: 0,
        passingScore: 70,
        maxHearts: 5,
        isActive: true,
      })
    }
  }, [level, sections, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{level ? "Edit Level" : "Create Level"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionId">Section</Label>
            <Select
              value={formData.sectionId}
              onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                id="difficulty"
                type="number"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxHearts">Max Hearts</Label>
              <Input
                id="maxHearts"
                type="number"
                min="1"
                value={formData.maxHearts}
                onChange={(e) => setFormData({ ...formData, maxHearts: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{level ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
