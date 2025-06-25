"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Lock, Crown, Settings, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SharedLayout from "@/components/SharedLayout";
import { User } from "@/types/user";
import { QuizSection, QuizLevel } from "@/types/quiz";
import { publicApi } from "@/lib/publicApi";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { logout } = useAuth();

  // Fetch user data and sections on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
        router.push("/login");
        return;
      }
    } else {
      router.push("/login");
      return;
    }

    const fetchSectionsAndLevels = async () => {
      try {
        // Fetch sections - now returns QuizSection[] directly
        const sectionsData: QuizSection[] = await publicApi.getSections();

        // Fetch levels for each section
        const levelsPromises = sectionsData.map((section: QuizSection) =>
            publicApi.getLevels(section.id)
        );
        const levelsData: QuizLevel[][] = await Promise.all(levelsPromises);

        // Combine sections with levels
        const sectionsWithLevels: QuizSection[] = sectionsData.map((section: QuizSection, index: number) => ({
          ...section,
          levels: levelsData[index] || [], // Ensure levels is always an array
        }));

        setSections(sectionsWithLevels);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          console.log("Unauthorized - Redirecting to login");
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
  }, [router, logout]);

  // Loading state
  if (isLoading) {
    return (
        <SharedLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </SharedLayout>
    );
  }

  // Error state
  if (error) {
    return (
        <SharedLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </SharedLayout>
    );
  }

  // Access control logic for sections
  const canAccessSection = (section: QuizSection): boolean => {
    if (!user) return false;
    return (
        user.plan !== "Free" ||
        section.isLocked === false ||
        section.requiredPlan === null
    );
  };

  // Access control logic for levels
  const canAccessLevel = (level: QuizLevel): boolean => {
    if (!user) return false;
    return user.plan !== "Free" || level.difficulty === 0;
  };

  return (
    <SharedLayout>
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
                {sections.map((section: QuizSection) => (
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
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <p><span className="font-medium">Total Levels:</span> {section.totalLevels}</p>
                          <p><span className="font-medium">Estimated Time:</span> {section.estimatedMinutes} minutes</p>
                        </div>
                        
                        {/* Accordion to display levels */}
                        <Accordion type="single" collapsible>
                          <AccordionItem value="levels">
                            <AccordionTrigger>View Levels ({section.levels?.length || 0})</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3">
                                {section.levels && section.levels.length > 0 ? (
                                  section.levels.map((level: QuizLevel) => (
                                    <div
                                      key={level.id}
                                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                                        canAccessLevel(level) 
                                          ? "hover:bg-gray-50 border-gray-200" 
                                          : "bg-gray-50 border-gray-100 opacity-60"
                                      }`}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <h4 className="font-medium text-sm">{level.title}</h4>
                                          {level.difficulty > 0 && (
                                            <Badge variant="outline" className="text-xs">
                                              Difficulty {level.difficulty}
                                            </Badge>
                                          )}
                                        </div>
                                        {level.description && (
                                          <p className="text-xs text-gray-600 mb-2">{level.description}</p>
                                        )}
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                          <span>Questions: {level.totalQuestions}</span>
                                          <span>Passing Score: {level.passingScore}%</span>
                                          <span>Max Hearts: {level.maxHearts}</span>
                                        </div>
                                      </div>
                                      <div className="ml-4">
                                        {canAccessLevel(level) ? (
                                          <Link href={`/quiz/${level.id}`}>
                                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                                              <BookOpen className="h-3 w-3 mr-1" />
                                              Start
                                            </Button>
                                          </Link>
                                        ) : (
                                          <Badge variant="outline" className="text-xs">
                                            <Lock className="h-3 w-3 mr-1" />
                                            Locked
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No levels available yet</p>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {sections.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Available</h3>
                      <p className="text-gray-600">Check back later for new learning content!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
}