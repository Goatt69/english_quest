"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"
import { QuestionDialog } from "@/components/admin/question-dialog"
import { DeleteDialog } from "@/components/admin/delete-dialog"
import { adminApi } from "@/lib/adminApi"
import { type QuizQuestion, type QuizLevel, type QuizSection, QuestionType, getQuestionTypeName } from "@/types/quiz"
import { useToast } from "@/hooks/use-toast"
import { SidebarTrigger } from "@/components/ui/sidebar"
import SharedLayout from "@/components/SharedLayout";

// Updated to use proper Record type with index signature
const questionTypeNames: Record<number, string> = {
  [QuestionType.FillInTheBlank]: "Fill in the Blank",
  [QuestionType.VocabularyMeaning]: "Vocabulary Meaning",
  [QuestionType.CorrectSentence]: "Correct Sentence",
  [QuestionType.PatternRecognition]: "Pattern Recognition",
  [QuestionType.ListeningComprehension]: "Listening Comprehension",
  [QuestionType.MultipleChoice]: "Multiple Choice",
  [QuestionType.TrueFalse]: "True/False",
  [QuestionType.Matching]: "Matching",
  [QuestionType.Ordering]: "Ordering",
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [sections, setSections] = useState<QuizSection[]>([])
  const [levels, setLevels] = useState<QuizLevel[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState<string>("")
  const [selectedLevelId, setSelectedLevelId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null)
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
      setSelectedLevelId("")
    }
  }, [selectedSectionId])

  useEffect(() => {
    if (selectedLevelId) {
      loadQuestions(selectedLevelId)
    } else {
      setQuestions([])
    }
  }, [selectedLevelId])

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
      if (data.length > 0) {
        setSelectedLevelId(data[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load levels",
        variant: "destructive",
      })
    }
  }

  const loadQuestions = async (levelId: string) => {
    try {
      const data = await adminApi.getQuestions(levelId)
      setQuestions(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      })
    }
  }

  const handleCreate = () => {
    setSelectedQuestion(null)
    setShowDialog(true)
  }

  const handleEdit = (question: QuizQuestion) => {
    setSelectedQuestion(question)
    setShowDialog(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    try {
      await adminApi.deleteQuestion(deleteId)
      setQuestions(questions.filter((q) => q.id !== deleteId))
      toast({
        title: "Success",
        description: "Question deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setDeleteId(null)
    }
  }

  const handleSave = async (data: Partial<QuizQuestion>) => {
    try {
      if (selectedQuestion) {
        const updated = await adminApi.updateQuestion(selectedQuestion.id, data)
        setQuestions(questions.map((q) => (q.id === selectedQuestion.id ? updated : q)))
        toast({
          title: "Success",
          description: "Question updated successfully",
        })
      } else {
        const created = await adminApi.createQuestion({ ...data, levelId: selectedLevelId })
        setQuestions([...questions, created])
        toast({
          title: "Success",
          description: "Question created successfully",
        })
      }
      setShowDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      })
    }
  }

  // Helper function to safely get question type name
  const getQuestionTypeDisplayName = (type: number): string => {
    return questionTypeNames[type] || getQuestionTypeName(type) || `Type ${type}`;
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">Loading questions...</div>
        </div>
    )
  }

  return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-3xl font-bold">Quiz Questions</h1>
                <p className="text-muted-foreground">Manage your quiz questions</p>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={!selectedLevelId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
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

            <Select value={selectedLevelId} onValueChange={setSelectedLevelId} disabled={!selectedSectionId}>
              <SelectTrigger className="w-64">
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

          <div className="grid gap-4">
            {questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{getQuestionTypeDisplayName(question.type)}</Badge>
                          <Badge variant="secondary">Order: {question.order}</Badge>
                          <Badge variant="secondary">Points: {question.points}</Badge>
                        </div>
                        <CardTitle className="text-lg">{question.text}</CardTitle>
                        {question.explanation && (
                            <CardDescription className="mt-2">
                              <strong>Explanation:</strong> {question.explanation}
                            </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(question)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(question.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <strong>Options:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {question.options.map((option, index) => (
                              <li key={index} className={option === question.correctAnswer ? "text-green-600 font-medium" : ""}>
                                {option} {option === question.correctAnswer && "✓"}
                              </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Difficulty: {question.difficulty}</span>
                        <Badge variant={question.isActive ? "default" : "destructive"}>
                          {question.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>

          <QuestionDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              question={selectedQuestion}
              levels={levels}
              onSave={handleSave}
          />

          <DeleteDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={confirmDelete}
              title="Delete Question"
              description="Are you sure you want to delete this question? This action cannot be undone."
          />
        </div>
  )
}