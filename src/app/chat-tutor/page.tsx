"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, ArrowLeft, Bot, User, Sparkles } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

const sampleResponses = [
  "Great question! Let me help you with that grammar rule.",
  "That's a common mistake. Here's the correct way to say it:",
  "I can see you're working on vocabulary. Let me give you some examples:",
  "Perfect! You're making excellent progress. Keep it up!",
  "Let me break that down for you step by step:",
  "That's an interesting question about pronunciation. Here's what you need to know:",
]

export default function ChatTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm your AI language tutor. I'm here to help you with grammar, vocabulary, pronunciation, and any questions you have about your language learning journey. What would you like to practice today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userPlan, setUserPlan] = useState("Free")
  const [dailyQuestions, setDailyQuestions] = useState(3)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserPlan(user.plan)
    }
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getQuestionLimit = () => {
    switch (userPlan) {
      case "Premium":
        return "Unlimited"
      case "Support":
        return "50 per day"
      default:
        return "5 per day"
    }
  }

  const canSendMessage = () => {
    if (userPlan === "Premium") return true
    if (userPlan === "Support") return dailyQuestions > 0
    return dailyQuestions > 0
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !canSendMessage()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    if (userPlan !== "Premium") {
      setDailyQuestions((prev) => prev - 1)
    }

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">AI Tutor</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={userPlan === "Premium" ? "destructive" : userPlan === "Support" ? "default" : "secondary"}>
              {userPlan}
            </Badge>
            <Badge variant="outline">{getQuestionLimit()}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Usage Info */}
          {userPlan !== "Premium" && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">
                      Questions remaining today: <strong>{dailyQuestions}</strong>
                    </span>
                  </div>
                  {dailyQuestions === 0 && (
                    <Link href="/pricing">
                      <Button size="sm" variant="outline">
                        Upgrade for Unlimited
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Chat with AI Tutor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-purple-500" />}
                          {message.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-purple-500" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      canSendMessage()
                        ? "Ask me anything about language learning..."
                        : "Daily limit reached. Upgrade for unlimited questions."
                    }
                    disabled={!canSendMessage() || isTyping}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || !canSendMessage() || isTyping}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {!canSendMessage() && userPlan !== "Premium" && (
                  <div className="mt-2 text-center">
                    <p className="text-sm text-gray-600 mb-2">You have reached your daily question limit.</p>
                    <Link href="/pricing">
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                        Upgrade for Unlimited Access
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Questions */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Questions:</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "How do I use past tense?",
                "What's the difference between 'a' and 'an'?",
                "Help me with pronunciation",
                "Explain plural forms",
                "Common conversation phrases",
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  disabled={!canSendMessage()}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
