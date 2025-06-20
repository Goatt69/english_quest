"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, ArrowLeft, Target, Crown, Medal, Award } from "lucide-react"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/configURL"

interface LeaderboardEntry {
  rank: number
  userName: string
  userAvatar?: string
  overallAccuracy: number
  rankingScore: number
  plan?: string
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        setLoading(false)
        return
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      try {
        const response = await fetch(`${apiUrl}${API_ENDPOINTS.LEADERBOARD}?skip=0&limit=20`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        if (!response.ok) {
          console.error("Failed to fetch leaderboard")
          setLoading(false)
          return
        }
        const data = await response.json()
        if (data.success) {
          const entries = data.entries.map((entry: LeaderboardEntry) => ({
            rank: entry.rank,
            userName: entry.userName || "Unknown",
            userAvatar: entry.userAvatar || "",
            overallAccuracy: entry.overallAccuracy || 0,
            rankingScore: entry.rankingScore || 0,
            plan: entry.plan || "Free",
          }))
          setLeaderboardData(entries)
        } else {
          console.error("API returned unsuccessful response")
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Global Leaderboard</span>
              </CardTitle>
              <CardDescription>Top performers based on ranking score</CardDescription>
            </CardHeader>
            <CardContent>{renderLeaderboard(leaderboardData)}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}