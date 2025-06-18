"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Volume2, X, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  type: "fill-in-blank" | "meaning" | "correct-sentence" | "pattern" | "listening"
  text: string
  options: string[]
  correctAnswer: string
  audioUrl?: string
  pattern?: {
    baseSentence: string
    exampleSentence: string
    questionSentence: string
  }
}

const sampleQuestions: Question[] = [
  {
    id: "1",
    type: "fill-in-blank",
    text: "Hello, how ___ you?",
    options: ["are", "is", "am", "be"],
    correctAnswer: "are",
  },
  {
    id: "2",
    type: "meaning",
    text: "What does 'Hello' mean?",
    options: ["Goodbye", "Greeting", "Thank you", "Please"],
    correctAnswer: "Greeting",
  },
  {
    id: "3",
    type: "correct-sentence",
    text: "Choose the correct response to 'How are you?'",
    options: ["I am fine", "I are fine", "I is fine", "I be fine"],
    correctAnswer: "I am fine",
  },
  {
    id: "4",
    type: "pattern",
    text: "Complete the pattern",
    options: ["good", "well", "fine", "okay"],
    correctAnswer: "good",
    pattern: {
      baseSentence: "I am ___",
      exampleSentence: "I am happy",
      questionSentence: "I am ___",
    },
  },
  {
    id: "5",
    type: "listening",
    text: "Listen and select what you hear",
    options: ["Good morning", "Good evening", "Good afternoon", "Good night"],
    correctAnswer: "Good morning",
    audioUrl: "/audio/good-morning.mp3",
  },
]

export default function LessonPage({ params }: { params: { id: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hearts, setHearts] = useState(5)
  const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const router = useRouter()

  const currentQuestion = sampleQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setHearts(user.hearts)
    }
  }, [])

  const playAudio = (text: string) => {
    // Simulate text-to-speech
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (!correct) {
      setHearts((prev) => Math.max(0, prev - 1))
      setIncorrectQuestions((prev) => [...prev, currentQuestion])

      // Update hearts in localStorage
      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        user.hearts = Math.max(0, user.hearts - 1)
        localStorage.setItem("user", JSON.stringify(user))
      }
    }
  }

  const handleNext = () => {
    if (hearts === 0 && !isCorrect) {
      // Restart level
      setCurrentQuestionIndex(0)
      setHearts(5)
      setIncorrectQuestions([])
      setIsReviewMode(false)
    } else if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else if (incorrectQuestions.length > 0 && !isReviewMode) {
      // Start review mode
      setIsReviewMode(true)
      setCurrentQuestionIndex(0)
      // Replace questions with incorrect ones for review
    } else {
      // Lesson complete
      router.push("/dashboard")
    }

    setSelectedAnswer(null)
    setShowResult(false)
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "fill-in-blank":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Fill in the blank</h2>
            <p className="text-xl mb-6">{currentQuestion.text}</p>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 h-auto ${
                    showResult
                      ? option === currentQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : selectedAnswer === option
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case "meaning":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">What does this mean?</h2>
            <div className="flex items-center justify-center mb-6">
              <p className="text-xl mr-2">{currentQuestion.text.split("'")[1]}</p>
              <Button variant="ghost" size="sm" onClick={() => playAudio(currentQuestion.text.split("'")[1])}>
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 h-auto ${
                    showResult
                      ? option === currentQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : selectedAnswer === option
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      case "listening":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Listen and select</h2>
            <Button
              variant="outline"
              size="lg"
              className="mb-6"
              onClick={() => playAudio(currentQuestion.correctAnswer)}
            >
              <Volume2 className="h-6 w-6 mr-2" />
              Play Audio
            </Button>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 h-auto ${
                    showResult
                      ? option === currentQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : selectedAnswer === option
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.text}</h2>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`p-4 h-auto ${
                    showResult
                      ? option === currentQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600"
                        : selectedAnswer === option
                          ? "bg-red-500 hover:bg-red-600"
                          : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )
    }
  }

  if (hearts === 0 && showResult && !isCorrect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Out of Hearts!</h2>
            <p className="text-gray-600 mb-6">
              You've run out of hearts. Don't worry, you can restart the level and try again!
            </p>
            <div className="space-y-3">
              <Button onClick={handleNext} className="w-full">
                Restart Level
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Progress value={progress} className="w-48" />
            <span className="text-sm text-gray-600">
              {currentQuestionIndex + 1} / {sampleQuestions.length}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart key={i} className={`h-5 w-5 ${i < hearts ? "text-red-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            {isReviewMode && <Badge variant="secondary">Review Mode</Badge>}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0">
              {renderQuestion()}

              {showResult && (
                <div
                  className={`mt-8 p-4 rounded-lg ${
                    isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
                    <span className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="text-sm text-gray-600">
                      The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                {!showResult ? (
                  <Button onClick={handleSubmit} disabled={!selectedAnswer} className="px-8">
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="px-8">
                    {currentQuestionIndex < sampleQuestions.length - 1 ||
                    (incorrectQuestions.length > 0 && !isReviewMode)
                      ? "Continue"
                      : "Complete Lesson"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
