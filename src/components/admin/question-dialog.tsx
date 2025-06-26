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
import { type QuizQuestion, type QuizLevel, QuestionType, QUESTION_TYPE_NAMES, type PatternData, type ListeningData } from "@/types/quiz"
import { Plus, Trash2 } from "lucide-react"

// Updated to use proper Record type with index signature
const questionTypeOptions: Array<{ value: number; label: string }> = [
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

// Form data interface with string fields for JSON editing
interface FormData {
  levelId: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  audioUrl: string;
  hasAudio: boolean;
  imageUrl: string;
  hasImage: boolean;
  patternJson: string; // String for JSON editing
  listeningJson: string; // String for JSON editing
  points: number;
  difficulty: number;
  order: number;
  isActive: boolean;
}

export function QuestionDialog({ open, onOpenChange, question, levels, onSave }: QuestionDialogProps) {
  const [formData, setFormData] = useState<FormData>({
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
    patternJson: "",
    listeningJson: "",
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
        patternJson: question.pattern ? JSON.stringify(question.pattern, null, 2) : "",
        listeningJson: question.listening ? JSON.stringify(question.listening, null, 2) : "",
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
        patternJson: "",
        listeningJson: "",
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
    
    // Prepare the data to save - convert form data to QuizQuestion format
    const dataToSave: Partial<QuizQuestion> = {
      levelId: formData.levelId,
      type: formData.type,
      text: formData.text,
      options: filteredOptions,
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation,
      audioUrl: formData.audioUrl || undefined,
      hasAudio: formData.hasAudio,
      imageUrl: formData.imageUrl || undefined,
      hasImage: formData.hasImage,
      points: formData.points,
      difficulty: formData.difficulty,
      order: formData.order,
      isActive: formData.isActive,
    }

    // Parse pattern JSON if it exists and is valid
    if (formData.patternJson.trim()) {
      try {
        const parsedPattern = JSON.parse(formData.patternJson) as PatternData
        dataToSave.pattern = parsedPattern
      } catch (error) {
        alert("Invalid pattern JSON format. Please check your JSON syntax.")
        return
      }
    }

    // Parse listening JSON if it exists and is valid
    if (formData.listeningJson.trim()) {
      try {
        const parsedListening = JSON.parse(formData.listeningJson) as ListeningData
        dataToSave.listening = parsedListening
      } catch (error) {
        alert("Invalid listening JSON format. Please check your JSON syntax.")
        return
      }
    }

    onSave(dataToSave)
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

  // Helper function to set default JSON templates
  const setDefaultPatternJson = () => {
    const defaultPattern = {
      BaseSentence: "He is a teacher.",
      ExampleSentence: "She is a doctor.",
      QuestionSentence: "They ___ students.",
      Pattern: "Subject + be verb + article + noun"
    }
    setFormData({
      ...formData,
      patternJson: JSON.stringify(defaultPattern, null, 2)
    })
  }

  const setDefaultListeningJson = () => {
    const defaultListening = {
      AudioText: "I am a boy",
      WordBank: ["I", "am", "a", "boy", "girl", "run", "happy"],
      PlaybackSpeed: 1,
      MaxReplays: 3
    }
    setFormData({
      ...formData,
      listeningJson: JSON.stringify(defaultListening, null, 2)
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
                onValueChange={(value) => setFormData({ ...formData, type: parseInt(value) as QuestionType })}
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
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
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
                onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) || 0 })}
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
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="pattern">Pattern (JSON)</Label>
                <Button type="button" variant="outline" size="sm" onClick={setDefaultPatternJson}>
                  Use Template
                </Button>
              </div>
              <Textarea
                id="pattern"
                value={formData.patternJson}
                onChange={(e) => setFormData({ ...formData, patternJson: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Enter JSON format with BaseSentence, ExampleSentence, QuestionSentence, and Pattern fields
              </p>
            </div>
          )}

          {formData.type === QuestionType.ListeningComprehension && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="listening">Listening Content (JSON)</Label>
                <Button type="button" variant="outline" size="sm" onClick={setDefaultListeningJson}>
                  Use Template
                </Button>
              </div>
              <Textarea
                id="listening"
                value={formData.listeningJson}
                onChange={(e) => setFormData({ ...formData, listeningJson: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Enter JSON format with AudioText, WordBank, PlaybackSpeed, and MaxReplays fields
              </p>
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