"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Crown, ArrowLeft, Flame, Target } from "lucide-react"
import Link from "next/link"

interface LeaderboardEntry {
  rank: number
  userName: string
  userAvatar?: string
  overallAccuracy: number
  rankingScore: number
  completedSections?: number
  completedLevels?: number
  plan?: string // Thêm nếu backend hỗ trợ
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("weekly")
  const [weeklyData, setWeeklyData] = useState<LeaderboardEntry[]>([])
  const [monthlyData, setMonthlyData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...a82BPJvejhjke9oyFpzqojwl2nAE9IOBhI6dSnwQpL4" // Thay bằng token thực tế
      const response = await fetch("http://localhost:8000/api/v1/leaderboard?skip=0&limit=20", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/plain",
        },
      })
      const data = await response.json()
      if (data.success) {
        const entries = data.entries.map((entry: LeaderboardEntry) => ({
          rank: entry.rank,
          userName: entry.userName || "Unknown",
          userAvatar: entry.userAvatar || "",
          overallAccuracy: entry.overallAccuracy || 0,
          rankingScore: entry.rankingScore || 0,
        }))
        setWeeklyData(entries) // Hiện tại dùng chung cho cả weekly và monthly
        setMonthlyData(entries) // Cần backend phân biệt nếu muốn khác nhau
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-amber-600" />
      default: return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Premium": return "destructive"
      case "Support": return "default"
      default: return "secondary"
    }
  }

  const renderLeaderboard = (data: LeaderboardEntry[]) => (
    <div className="space-y-4">
      {loading ? (
        <div>Loading...</div>
      ) : data.length > 0 ? (
        data.map((entry) => (
          <Card
            key={entry.rank}
            className={`transition-all hover:shadow-md ${entry.rank <= 3 ? "border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50" : ""}`}
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
                        <span>{entry.rankingScore.toLocaleString()} pts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4" />
                        <span>{entry.overallAccuracy}% accuracy</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={getPlanBadgeVariant(entry.plan || "Free")}>{entry.plan || "Free"}</Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
            <p className="text-gray-600">Compete with learners worldwide and climb the ranks!</p>
          </div>

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
                <CardContent>{renderLeaderboard(weeklyData)}</CardContent>
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
                <CardContent>{renderLeaderboard(monthlyData)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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