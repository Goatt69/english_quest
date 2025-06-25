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
  const [completedLevels, setCompletedLevels] = useState<string[]>([]); // State để lưu level đã hoàn thành
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

        // Giả định lấy danh sách completedLevels từ localStorage hoặc API
        const storedCompletedLevels = localStorage.getItem("completedLevels");
        if (storedCompletedLevels) {
          setCompletedLevels(JSON.parse(storedCompletedLevels));
        }
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
  // Hàm kiểm tra level đã hoàn thành chưa
  const isLevelCompleted = (levelId: string) => completedLevels.includes(levelId);

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
  // Hàm xử lý reset level
  const handleResetLevel = async (levelId: string) => {
    try {
      await publicApi.abandonQuiz(levelId);

      // Remove level from completedLevels list
      const updatedCompletedLevels = completedLevels.filter((id) => id !== levelId);
      setCompletedLevels(updatedCompletedLevels);
      localStorage.setItem("completedLevels", JSON.stringify(updatedCompletedLevels));
      alert("Level đã được reset thành công!");
    } catch (err) {
      console.error("Lỗi khi reset level:", err);
      alert("Có lỗi xảy ra khi reset level.");
    }
  };

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
                      <p>Total Levels: {section.totalLevels}</p>
                      <p>Estimated Time: {section.estimatedMinutes} minutes</p>
                      {/* Accordion để hiển thị levels */}
                      <Accordion type="single" collapsible>
                        <AccordionItem value="levels">
                          <AccordionTrigger>Levels ({section.levels?.length || 0})</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                                {section.levels && section.levels.length > 0 ? (
                                    section.levels.map((level: QuizLevel) => (
                                <div
                                  key={level.id}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <div>
                                    <p className="font-semibold">{level.title}</p>
                                    <p className="text-sm text-gray-600">Difficulty: {level.difficulty}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {canAccessLevel(level) ? (
                                      <>
                                        <Link href={`/quiz/${level.id}`}>
                                          <Button size="sm">Start</Button>
                                        </Link>
                                        {isLevelCompleted(level.id) && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleResetLevel(level.id)}
                                          >
                                            Làm lại
                                          </Button>
                                        )}
                                      </>
                                    ) : (
                                      <Badge variant="outline">Locked</Badge>
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
            </div>
          </div>
        </div>
      </div>
    </div>
    </SharedLayout>
  );
}