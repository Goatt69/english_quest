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
import { type QuizQuestion, type QuizLevel, QuestionType } from "@/types/quiz"
import { Plus, Trash2 } from "lucide-react"

const questionTypeOptions = [
  { value: QuestionType.FillInTheBlank, label: "Fill in the Blank" },
  { value: QuestionType.VocabularyMeaning, label: "Vocabulary Meaning" },
  { value: QuestionType.CorrectSentence, label: "Correct Sentence" },
  { value: QuestionType.PatternRecognition, label: "Pattern Recognition" },
  { value: QuestionType.ListeningComprehension, label: "Listening Comprehension" },
  { value: QuestionType.MultipleChoice, label: "Multiple Choice" },
  { value: QuestionType.TrueFalse, label: "True/False" },
  { value: QuestionType.Matching, label: "Matching" },
  { value: QuestionType.Ordering, label: "Ordering" },
]

interface QuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: QuizQuestion | null
  levels: QuizLevel[]
  onSave: (data: Partial<QuizQuestion>) => void
}

export function QuestionDialog({ open, onOpenChange, question, levels, onSave }: QuestionDialogProps) {
  const [formData, setFormData] = useState({
    levelId: "",
    type: QuestionType.MultipleChoice,
    text: "",
    options: ["", "", ""],
    correctAnswer: "",
    explanation: "",
    audioUrl: "",
    hasAudio: false,
    imageUrl: "",
    hasImage: false,
    pattern: "",
    listening: "",
    points: 1,
    difficulty: 0,
    order: 1,
    isActive: true,
  })

  useEffect(() => {
    if (question) {
      setFormData({
        levelId: question.levelId,
        type: question.type,
        text: question.text,
        options: [...question.options],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        audioUrl: question.audioUrl || "",
        hasAudio: question.hasAudio,
        imageUrl: question.imageUrl || "",
        hasImage: question.hasImage,
        pattern: question.pattern || "",
        listening: question.listening || "",
        points: question.points,
        difficulty: question.difficulty,
        order: question.order,
        isActive: question.isActive,
      })
    } else {
      setFormData({
        levelId: levels[0]?.id || "",
        type: QuestionType.MultipleChoice,
        text: "",
        options: ["", "", ""],
        correctAnswer: "",
        explanation: "",
        audioUrl: "",
        hasAudio: false,
        imageUrl: "",
        hasImage: false,
        pattern: "",
        listening: "",
        points: 1,
        difficulty: 0,
        order: 1,
        isActive: true,
      })
    }
  }, [question, levels, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const filteredOptions = formData.options.filter((option) => option.trim() !== "")
    onSave({
      ...formData,
      options: filteredOptions,
    })
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    })
  }

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      options: newOptions,
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Create Question"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="levelId">Level</Label>
              <Select value={formData.levelId} onValueChange={(value) => setFormData({ ...formData, levelId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select
                value={formData.type.toString()}
                onValueChange={(value) => setFormData({ ...formData, type: Number.parseInt(value) as QuestionType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {formData.options.length > 2 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeOption(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctAnswer">Correct Answer</Label>
            <Select
              value={formData.correctAnswer}
              onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {formData.options
                  .filter((option) => option.trim() !== "")
                  .map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Input
                id="difficulty"
                type="number"
                min="0"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value, hasImage: e.target.value.trim() !== "" })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioUrl">Audio URL</Label>
            <Input
              id="audioUrl"
              value={formData.audioUrl}
              onChange={(e) =>
                setFormData({ ...formData, audioUrl: e.target.value, hasAudio: e.target.value.trim() !== "" })
              }
            />
          </div>

          {formData.type === QuestionType.PatternRecognition && (
            <div className="space-y-2">
              <Label htmlFor="pattern">Pattern</Label>
              <Input
                id="pattern"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
              />
            </div>
          )}

          {formData.type === QuestionType.ListeningComprehension && (
            <div className="space-y-2">
              <Label htmlFor="listening">Listening Content</Label>
              <Textarea
                id="listening"
                value={formData.listening}
                onChange={(e) => setFormData({ ...formData, listening: e.target.value })}
              />
            </div>
          )}

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
            <Button type="submit">{question ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
