"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Lock, Crown, MessageCircle, Settings, LogOut, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/configURL";
import { useAuth } from '@/hooks/useAuth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// User interface
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

// Section interface
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
  levels: Level[];
}

// Level interface
interface Level {
  id: string;
  title: string;
  description: string | null;
  order: number;
  difficulty: number;
  prerequisiteLevelIds: string[];
  passingScore: number;
  maxHearts: number;
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { logout } = useAuth();

  // Fetch user data and sections on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/login");
      return;
    }
  
    // console.log("Token before fetching sections:", localStorage.getItem("token"));
      

    const fetchSectionsAndLevels = async () => {
      try {
        // Fetch sections
        const sectionsResponse = await apiFetch(API_ENDPOINTS.SECTIONS);
        const sectionsData = sectionsResponse.data;

        // Fetch levels cho từng section
        const levelsPromises = sectionsData.map((section: Section) =>
          apiFetch(API_ENDPOINTS.LEVELS(section.id))
        );
        const levelsResponses = await Promise.all(levelsPromises);
        const levelsData = levelsResponses.map((res) => res.data);

        // Kết hợp sections với levels
        const sectionsWithLevels = sectionsData.map((section: Section, index: number) => ({
          ...section,
          levels: levelsData[index],
        }));

        setSections(sectionsWithLevels);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          console.log("Unauthorized - Redirecting to login");
          // localStorage.removeItem("token");
          logout();
          router.push("/login");
        } else {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectionsAndLevels();
  }, [router]);

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

  // Access control logic for sections
  const canAccessSection = (section: Section) => {
    if (!user) return false;
    return (
      user.plan !== "Free" ||
      section.isLocked === false ||
      section.requiredPlan === null
    );
  };

  // Access control logic for levels (ví dụ: levels có difficulty = 0 là miễn phí)
  const canAccessLevel = (level: Level) => {
    if (!user) return false;
    return user.plan !== "Free" || level.difficulty === 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
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
                  <Link href="/hangman">
                    <Button variant="outline" className="w-full justify-start">
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      Hangman
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
                    <div className="space-y-4">
                      <p>Total Levels: {section.totalLevels}</p>
                      <p>Estimated Time: {section.estimatedMinutes} minutes</p>
                      {/* Accordion để hiển thị levels */}
                      <Accordion type="single" collapsible>
                        <AccordionItem value="levels">
                          <AccordionTrigger>Levels</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {section.levels.map((level) => (
                                <div
                                  key={level.id}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <div>
                                    <p className="font-semibold">{level.title}</p>
                                    <p className="text-sm text-gray-600">Difficulty: {level.difficulty}</p>
                                  </div>
                                  {canAccessLevel(level) ? (
                                    <Link href={`/quiz/${level.id}`}>
                                    <Button size="sm">Start</Button>
                                  </Link>
                                  ) : (
                                    <Badge variant="outline">Locked</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
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