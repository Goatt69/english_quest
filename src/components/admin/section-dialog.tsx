"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { QuizSection } from "@/types/quiz"

interface SectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: QuizSection | null
  onSave: (data: Partial<QuizSection>) => void
}

export function SectionDialog({ open, onOpenChange, section, onSave }: SectionDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    imageUrl: "",
    iconUrl: "",
    isFreeAccess: true,
    requiredPlan: 0,
    estimatedMinutes: 15,
    isActive: true,
  })

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title,
        description: section.description,
        order: section.order,
        imageUrl: section.imageUrl || "",
        iconUrl: section.iconUrl || "",
        isFreeAccess: section.isFreeAccess,
        requiredPlan: section.requiredPlan || 0,
        estimatedMinutes: section.estimatedMinutes,
        isActive: section.isActive,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        order: 1,
        imageUrl: "",
        iconUrl: "",
        isFreeAccess: true,
        requiredPlan: 0,
        estimatedMinutes: 15,
        isActive: true,
      })
    }
  }, [section, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "Create Section"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
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
              <Label htmlFor="estimatedMinutes">Duration (min)</Label>
              <Input
                id="estimatedMinutes"
                type="number"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({ ...formData, estimatedMinutes: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconUrl">Icon URL</Label>
            <Input
              id="iconUrl"
              value={formData.iconUrl}
              onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isFreeAccess"
              checked={formData.isFreeAccess}
              onCheckedChange={(checked) => setFormData({ ...formData, isFreeAccess: checked })}
            />
            <Label htmlFor="isFreeAccess">Free Access</Label>
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
            <Button type="submit">{section ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
