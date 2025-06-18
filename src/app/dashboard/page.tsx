"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Flame, Trophy, BookOpen, Play, Lock, Crown, MessageCircle, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  userName: string
  email: string
  plan: string
  hearts: number
  streak: {
    current: number
    lastUpdate: string
  }
}

interface Section {
  id: string
  title: string
  description: string
  levels: Level[]
  isUnlocked: boolean
}

interface Level {
  id: string
  title: string
  progress: number
  isCompleted: boolean
  isUnlocked: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const sections: Section[] = [
    {
      id: "1",
      title: "Basics",
      description: "Learn fundamental vocabulary and phrases",
      isUnlocked: true,
      levels: [
        { id: "1-1", title: "Greetings", progress: 100, isCompleted: true, isUnlocked: true },
        { id: "1-2", title: "Family", progress: 75, isCompleted: false, isUnlocked: true },
        { id: "1-3", title: "Numbers", progress: 0, isCompleted: false, isUnlocked: true },
        { id: "1-4", title: "Colors", progress: 0, isCompleted: false, isUnlocked: false },
      ],
    },
    {
      id: "2",
      title: "Food & Drink",
      description: "Master food-related vocabulary",
      isUnlocked: true,
      levels: [
        { id: "2-1", title: "Fruits", progress: 0, isCompleted: false, isUnlocked: true },
        { id: "2-2", title: "Vegetables", progress: 0, isCompleted: false, isUnlocked: false },
        { id: "2-3", title: "Meals", progress: 0, isCompleted: false, isUnlocked: false },
      ],
    },
    {
      id: "3",
      title: "Travel",
      description: "Essential phrases for traveling",
      isUnlocked: false,
      levels: [
        { id: "3-1", title: "Airport", progress: 0, isCompleted: false, isUnlocked: false },
        { id: "3-2", title: "Hotel", progress: 0, isCompleted: false, isUnlocked: false },
        { id: "3-3", title: "Directions", progress: 0, isCompleted: false, isUnlocked: false },
      ],
    },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const canAccessSection = (section: Section) => {
    return user.plan !== "Free" || section.id === "1" || section.id === "2"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LinguaLearn</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-semibold">{user.hearts}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{user.streak.current}</span>
            </div>
            <Badge variant={user.plan === "Free" ? "secondary" : user.plan === "Support" ? "default" : "destructive"}>
              {user.plan}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <span>{user.userName || "User"}</span>
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">{user.streak.current} days</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hearts</span>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-semibold">{user.hearts}/5</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link href="/leaderboard">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      Leaderboard
                    </Button>
                  </Link>
                  <Link href="/chat-tutor">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      AI Tutor
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
                {user.plan === "Free" && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                    <h3 className="font-semibold text-sm mb-2">Upgrade to Premium</h3>
                    <p className="text-xs text-gray-600 mb-3">Unlock all content and remove ads</p>
                    <Link href="/pricing">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                        <Crown className="h-4 w-4 mr-1" />
                        Upgrade
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.userName || "User"}!</h1>
              <p className="text-gray-600">Continue your language learning journey</p>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <Card key={section.id} className={`${!canAccessSection(section) ? "opacity-60" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>{section.title}</span>
                          {!canAccessSection(section) && <Lock className="h-4 w-4 text-gray-400" />}
                        </CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                      {!canAccessSection(section) && <Badge variant="secondary">Premium</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.levels.map((level) => (
                        <Card
                          key={level.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            !level.isUnlocked || !canAccessSection(section) ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm">{level.title}</h3>
                              {level.isCompleted ? (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Trophy className="h-3 w-3 text-white" />
                                </div>
                              ) : level.isUnlocked && canAccessSection(section) ? (
                                <Link href={`/lesson/${level.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Play className="h-3 w-3" />
                                  </Button>
                                </Link>
                              ) : (
                                <Lock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <Progress value={level.progress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">{level.progress}% complete</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
