"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Lock, Crown, MessageCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api"; // Import the API utility
import { API_ENDPOINTS } from "@/lib/configURL";

// User interface (unchanged)
interface User {
  userName: string;
  email: string;
  plan: string;
  hearts: number;
  streak: {
    current: number;
    lastUpdate: string;
  };
}

// Updated Section interface based on API response
interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  imageUrl: string | null;
  iconUrl: string | null;
  totalLevels: number;
  estimatedMinutes: number;
  isLocked: boolean;
  requiredPlan: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data and sections on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
      return;
    }
  
    console.log("Token before fetching sections:", localStorage.getItem("token"));
  
    const fetchSections = async () => {
      try {
        const response = await apiFetch(API_ENDPOINTS.SECTIONS); // Sử dụng API_ENDPOINTS
        setSections(response.data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          console.log("Unauthorized - Redirecting to login");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSections();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Remove token on logout
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  // Access control logic (based on your original logic, adjusted for API data)
  const canAccessSection = (section: Section) => {
    if (!user) return false;
    return (
      user.plan !== "Free" ||
      section.isLocked === false ||
      section.requiredPlan === null
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">English Quest</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar (unchanged) */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <span>{user?.userName || "User"}</span>
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                {user?.plan === "Free" && (
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.userName || "User"}!</h1>
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
                    <div className="space-y-2">
                      <p>Total Levels: {section.totalLevels}</p>
                      <p>Estimated Time: {section.estimatedMinutes} minutes</p>
                      {canAccessSection(section) ? (
                        <Link href={`/section/${section.id}`}>
                          <Button>Start Section</Button>
                        </Link>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}