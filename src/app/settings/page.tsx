"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Bell, Volume2, Shield, CreditCard, Crown } from "lucide-react"
import Link from "next/link"

interface UserSettings {
  userName: string
  email: string
  plan: string
  notifications: {
    dailyReminder: boolean
    streakReminder: boolean
    achievements: boolean
    marketing: boolean
  }
  audio: {
    soundEffects: boolean
    voiceSpeed: string
    autoplay: boolean
  }
  privacy: {
    showInLeaderboard: boolean
    shareProgress: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    userName: "",
    email: "",
    plan: "Free",
    notifications: {
      dailyReminder: true,
      streakReminder: true,
      achievements: true,
      marketing: false,
    },
    audio: {
      soundEffects: true,
      voiceSpeed: "normal",
      autoplay: true,
    },
    privacy: {
      showInLeaderboard: true,
      shareProgress: false,
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setSettings((prev) => ({
        ...prev,
        userName: user.userName || "",
        email: user.email || "",
        plan: user.plan || "Free",
      }))
    }
  }, [])

  const handleSettingChange = (category: keyof UserSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSaveProfile = () => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      user.userName = settings.userName
      user.email = settings.email
      localStorage.setItem("user", JSON.stringify(user))
    }
    alert("Profile updated successfully!")
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
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>Update your personal information and account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={settings.userName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, userName: e.target.value }))}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Plan</Label>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          settings.plan === "Premium"
                            ? "destructive"
                            : settings.plan === "Support"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {settings.plan}
                      </Badge>
                      {settings.plan === "Free" && (
                        <Link href="/pricing">
                          <Button size="sm" variant="outline">
                            <Crown className="h-4 w-4 mr-1" />
                            Upgrade
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>Choose what notifications you would like to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Daily Practice Reminder</Label>
                      <p className="text-sm text-gray-600">Get reminded to practice every day</p>
                    </div>
                    <Switch
                      checked={settings.notifications.dailyReminder}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "dailyReminder", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Streak Reminder</Label>
                      <p className="text-sm text-gray-600">Get notified when your streak is at risk</p>
                    </div>
                    <Switch
                      checked={settings.notifications.streakReminder}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "streakReminder", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievement Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified when you earn achievements</p>
                    </div>
                    <Switch
                      checked={settings.notifications.achievements}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "achievements", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "marketing", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5" />
                    <span>Audio Settings</span>
                  </CardTitle>
                  <CardDescription>Customize your audio experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sound Effects</Label>
                      <p className="text-sm text-gray-600">Play sounds for correct/incorrect answers</p>
                    </div>
                    <Switch
                      checked={settings.audio.soundEffects}
                      onCheckedChange={(checked) => handleSettingChange("audio", "soundEffects", checked)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Voice Speed</Label>
                    <Select
                      value={settings.audio.voiceSpeed}
                      onValueChange={(value) => handleSettingChange("audio", "voiceSpeed", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="fast">Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-play Audio</Label>
                      <p className="text-sm text-gray-600">Automatically play pronunciation audio</p>
                    </div>
                    <Switch
                      checked={settings.audio.autoplay}
                      onCheckedChange={(checked) => handleSettingChange("audio", "autoplay", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy Settings</span>
                  </CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show in Leaderboard</Label>
                      <p className="text-sm text-gray-600">Display your progress on public leaderboards</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showInLeaderboard}
                      onCheckedChange={(checked) => handleSettingChange("privacy", "showInLeaderboard", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Share Progress</Label>
                      <p className="text-sm text-gray-600">Allow sharing your learning progress with friends</p>
                    </div>
                    <Switch
                      checked={settings.privacy.shareProgress}
                      onCheckedChange={(checked) => handleSettingChange("privacy", "shareProgress", checked)}
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Data Management</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Subscription Management</span>
                  </CardTitle>
                  <CardDescription>Manage your subscription and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                    <div>
                      <h3 className="font-semibold">Current Plan</h3>
                      <p className="text-sm text-gray-600">
                        You are currently on the <strong>{settings.plan}</strong> plan
                      </p>
                    </div>
                    <Badge
                      variant={
                        settings.plan === "Premium"
                          ? "destructive"
                          : settings.plan === "Support"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {settings.plan}
                    </Badge>
                  </div>

                  {settings.plan === "Free" ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Upgrade Your Plan</h3>
                      <p className="text-sm text-gray-600">Unlock premium features and remove limitations</p>
                      <Link href="/pricing">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                          <Crown className="h-4 w-4 mr-2" />
                          View Plans & Upgrade
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Billing Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Next billing date:</span>
                          <span className="text-sm font-medium">January 15, 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Amount:</span>
                          <span className="text-sm font-medium">
                            ₫{settings.plan === "Premium" ? "199,000" : "99,000"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          Update Payment Method
                        </Button>
                        <Button variant="outline" className="w-full">
                          Download Invoice
                        </Button>
                        <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
