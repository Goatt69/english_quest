"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, ArrowLeft, Flame, Target } from "lucide-react"
import Link from "next/link"

interface LeaderboardEntry {
  rank: number
  userName: string
  score: number
  accuracy: number
  streak: number
  plan: string
}

const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userName: "LanguageMaster", score: 2450, accuracy: 95.2, streak: 28, plan: "Premium" },
  { rank: 2, userName: "StudyBuddy", score: 2380, accuracy: 92.8, streak: 15, plan: "Support" },
  { rank: 3, userName: "QuickLearner", score: 2290, accuracy: 89.5, streak: 22, plan: "Premium" },
  { rank: 4, userName: "DailyPractice", score: 2150, accuracy: 91.3, streak: 45, plan: "Free" },
  { rank: 5, userName: "WordWizard", score: 2080, accuracy: 88.7, streak: 12, plan: "Support" },
  { rank: 6, userName: "GrammarGuru", score: 1950, accuracy: 94.1, streak: 8, plan: "Premium" },
  { rank: 7, userName: "VocabVault", score: 1890, accuracy: 87.3, streak: 19, plan: "Free" },
  { rank: 8, userName: "FluentFast", score: 1820, accuracy: 90.6, streak: 33, plan: "Support" },
  { rank: 9, userName: "LearnLover", score: 1750, accuracy: 86.9, streak: 7, plan: "Free" },
  { rank: 10, userName: "PolyglotPro", score: 1680, accuracy: 93.4, streak: 14, plan: "Premium" },
]

const monthlyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userName: "DailyPractice", score: 8950, accuracy: 91.3, streak: 45, plan: "Free" },
  { rank: 2, userName: "LanguageMaster", score: 8720, accuracy: 95.2, streak: 28, plan: "Premium" },
  { rank: 3, userName: "FluentFast", score: 8450, accuracy: 90.6, streak: 33, plan: "Support" },
  { rank: 4, userName: "StudyBuddy", score: 8200, accuracy: 92.8, streak: 15, plan: "Support" },
  { rank: 5, userName: "QuickLearner", score: 7980, accuracy: 89.5, streak: 22, plan: "Premium" },
  { rank: 6, userName: "PolyglotPro", score: 7650, accuracy: 93.4, streak: 14, plan: "Premium" },
  { rank: 7, userName: "GrammarGuru", score: 7420, accuracy: 94.1, streak: 8, plan: "Premium" },
  { rank: 8, userName: "WordWizard", score: 7180, accuracy: 88.7, streak: 12, plan: "Support" },
  { rank: 9, userName: "VocabVault", score: 6890, accuracy: 87.3, streak: 19, plan: "Free" },
  { rank: 10, userName: "LearnLover", score: 6520, accuracy: 86.9, streak: 7, plan: "Free" },
]

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("weekly")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Premium":
        return "destructive"
      case "Support":
        return "default"
      default:
        return "secondary"
    }
  }

  const renderLeaderboard = (data: LeaderboardEntry[]) => (
    <div className="space-y-4">
      {data.map((entry) => (
        <Card
          key={entry.rank}
          className={`transition-all hover:shadow-md ${
            entry.rank <= 3 ? "border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">{getRankIcon(entry.rank)}</div>
                <div>
                  <h3 className="font-semibold text-lg">{entry.userName}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>{entry.score.toLocaleString()} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{entry.accuracy}% accuracy</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span>{entry.streak} day streak</span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge variant={getPlanBadgeVariant(entry.plan)}>{entry.plan}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

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
            <h1 className="text-xl font-bold">Leaderboard</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
            <p className="text-gray-600">Compete with learners worldwide and climb the ranks!</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Weekly Champions</span>
                  </CardTitle>
                  <CardDescription>Top performers this week based on points earned</CardDescription>
                </CardHeader>
                <CardContent>{renderLeaderboard(weeklyLeaderboard)}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span>Monthly Legends</span>
                  </CardTitle>
                  <CardDescription>Top performers this month based on total points</CardDescription>
                </CardHeader>
                <CardContent>{renderLeaderboard(monthlyLeaderboard)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Achievement Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Weekly Winner</h3>
                <p className="text-sm text-gray-600">Earn the most points this week to claim the crown!</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Streak Master</h3>
                <p className="text-sm text-gray-600">Maintain the longest learning streak to earn this title!</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Accuracy Expert</h3>
                <p className="text-sm text-gray-600">Achieve the highest accuracy rate to become an expert!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
