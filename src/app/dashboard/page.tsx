"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Lock, Crown, Settings, Gamepad2, Star, Target, Clock, Award, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SharedLayout from "@/components/SharedLayout";
import { User } from "@/types/user";
import { QuizSection, QuizLevel } from "@/types/quiz";
import { publicApi } from "@/lib/publicApi";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
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
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }
    } else {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    const fetchSectionsAndLevels = async () => {
      try {
        const sectionsData: QuizSection[] = await publicApi.getSections();
        const levelsPromises = sectionsData.map((section: QuizSection) =>
            publicApi.getLevels(section.id)
        );
        const levelsData: QuizLevel[][] = await Promise.all(levelsPromises);

        const sectionsWithLevels: QuizSection[] = sectionsData.map((section: QuizSection, index: number) => ({
          ...section,
          levels: levelsData[index] || [],
        }));

        setSections(sectionsWithLevels);

        const storedCompletedLevels = localStorage.getItem("completedLevels");
        if (storedCompletedLevels) {
          setCompletedLevels(JSON.parse(storedCompletedLevels));
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          console.log("Unauthorized - Redirecting to login");
          logout();
          setTimeout(() => {
            router.push("/login");
          }, 2000);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              Đang tải dashboard...
            </motion.p>
          </motion.div>
        </div>
      </SharedLayout>
    );
  }

  const isLevelCompleted = (levelId: string) => completedLevels.includes(levelId);

  // Error state
  if (error) {
    return (
      <SharedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">⚠️</span>
            </motion.div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Có lỗi xảy ra</h2>
            <p className="text-gray-600">{error}</p>
          </motion.div>
        </div>
      </SharedLayout>
    );
  }

  const handleResetLevel = async (levelId: string) => {
    try {
      await publicApi.abandonQuiz(levelId);
      const updatedCompletedLevels = completedLevels.filter((id) => id !== levelId);
      setCompletedLevels(updatedCompletedLevels);
      localStorage.setItem("completedLevels", JSON.stringify(updatedCompletedLevels));
      alert("Level đã được reset thành công!");
    } catch (err) {
      console.error("Lỗi khi reset level:", err);
      alert("Có lỗi xảy ra khi reset level.");
    }
  };

  const canAccessSection = (section: QuizSection): boolean => {
    if (!user) return false;
    return (
        user.plan !== "Free" ||
        section.isLocked === false ||
        section.requiredPlan === null
    );
  };

  const canAccessLevel = (level: QuizLevel): boolean => {
    if (!user) return false;
    return user.plan !== "Free" || level.difficulty === 0;
  };

  // Calculate user stats
  const totalLevels = sections.reduce((acc, section) => acc + (section.levels?.length || 0), 0);
  const completedCount = completedLevels.length;
  const progressPercentage = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;

  return (
    <SharedLayout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2"
              >
                Chào mừng trở lại, {user?.userName || "User"}! 🎉
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg"
              >
                Tiếp tục hành trình học tập của bạn
              </motion.p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Hoàn thành</p>
                        <p className="text-2xl font-bold">{completedCount}</p>
                      </div>
                      <Target className="h-8 w-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Tổng Level</p>
                        <p className="text-2xl font-bold">{totalLevels}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Tiến độ</p>
                        <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Gói</p>
                        <p className="text-2xl font-bold">{user?.plan || "Free"}</p>
                      </div>
                      <Crown className="h-8 w-8 text-orange-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center"
                    >
                      <span className="text-lg font-bold text-blue-600">
                        {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                      </span>
                    </motion.div>
                    <div>
                      <span className="text-lg">{user?.userName || "User"}</span>
                      <p className="text-sm text-gray-500 font-normal">{user?.email}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/leaderboard">
                        <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200">
                          <Trophy className="h-4 w-4 mr-2 text-yellow-600" />
                          Bảng xếp hạng
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/hangman">
                        <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200">
                          <Gamepad2 className="h-4 w-4 mr-2 text-green-600" />
                          Trò chơi Hangman
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href="/settings">
                        <Button variant="outline" className="w-full justify-start hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200">
                        <Settings className="h-4 w-4 mr-2 text-gray-600" />
                          Cài đặt
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                  
                  {user?.plan === "Free" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-lg border border-blue-200"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        </motion.div>
                        <h3 className="font-semibold text-sm mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Nâng cấp Premium
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          Mở khóa tất cả nội dung và loại bỏ quảng cáo
                        </p>
                        <Link href="/pricing">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              <Zap className="h-4 w-4 mr-1" />
                              Nâng cấp ngay
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-6"
              >
                <AnimatePresence>
                  {sections.map((section: QuizSection, sectionIndex) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + sectionIndex * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                    >
                      <Card className={`transition-all duration-300 hover:shadow-lg ${
                        !canAccessSection(section) 
                          ? "opacity-60 bg-gray-50" 
                          : "hover:shadow-xl bg-white"
                      }`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  canAccessSection(section)
                                    ? "bg-gradient-to-br from-blue-100 to-green-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                {canAccessSection(section) ? (
                                  <BookOpen className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <Lock className="h-6 w-6 text-gray-400" />
                                )}
                              </motion.div>
                              <div>
                                <CardTitle className="flex items-center space-x-2 text-xl">
                                  <span>{section.title}</span>
                                  {!canAccessSection(section) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700">
                                        <Crown className="h-3 w-3 mr-1" />
                                        Premium
                                      </Badge>
                                    </motion.div>
                                  )}
                                </CardTitle>
                                <CardDescription className="text-gray-600 mt-1">
                                  {section.description}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg"
                            >
                              <Target className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-blue-900">Tổng Level</p>
                                <p className="text-lg font-bold text-blue-700">{section.totalLevels}</p>
                              </div>
                            </motion.div>
                            
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg"
                            >
                              <Clock className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-900">Thời gian</p>
                                <p className="text-lg font-bold text-green-700">{section.estimatedMinutes} phút</p>
                              </div>
                            </motion.div>
                            
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg"
                            >
                              <Award className="h-5 w-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-purple-900">Hoàn thành</p>
                                <p className="text-lg font-bold text-purple-700">
                                  {section.levels?.filter(level => isLevelCompleted(level.id)).length || 0}/{section.levels?.length || 0}
                                </p>
                              </div>
                            </motion.div>
                          </div>

                          {/* Levels Accordion */}
                          <Accordion type="single" collapsible>
                            <AccordionItem value="levels" className="border-0">
                              <AccordionTrigger className="hover:no-underline py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="font-medium">
                                    Levels ({section.levels?.length || 0})
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4">
                                <div className="space-y-3">
                                  {section.levels && section.levels.length > 0 ? (
                                    section.levels.map((level: QuizLevel, levelIndex) => (
                                      <motion.div
                                        key={level.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: levelIndex * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                                          isLevelCompleted(level.id)
                                            ? "bg-green-50 border-green-200"
                                            : canAccessLevel(level)
                                            ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                                            : "bg-gray-50 border-gray-200 opacity-60"
                                        }`}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <motion.div
                                            whileHover={{ rotate: 180 }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                              isLevelCompleted(level.id)
                                                ? "bg-green-100"
                                                : canAccessLevel(level)
                                                ? "bg-blue-100"
                                                : "bg-gray-100"
                                            }`}
                                          >
                                            {isLevelCompleted(level.id) ? (
                                              <Award className="h-5 w-5 text-green-600" />
                                            ) : canAccessLevel(level) ? (
                                              <BookOpen className="h-5 w-5 text-blue-600" />
                                            ) : (
                                              <Lock className="h-5 w-5 text-gray-400" />
                                            )}
                                          </motion.div>
                                          <div>
                                            <p className="font-semibold text-gray-900">{level.title}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <Badge variant="outline" className="text-xs">
                                                Độ khó: {level.difficulty}
                                              </Badge>
                                              {isLevelCompleted(level.id) && (
                                                <motion.div
                                                  initial={{ scale: 0 }}
                                                  animate={{ scale: 1 }}
                                                  transition={{ type: "spring" }}
                                                >
                                                  <Badge className="bg-green-100 text-green-700 text-xs">
                                                    ✓ Hoàn thành
                                                  </Badge>
                                                </motion.div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                          {canAccessLevel(level) ? (
                                            <>
                                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Link href={`/quiz/${level.id}`}>
                                                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                                                    {isLevelCompleted(level.id) ? "Làm lại" : "Bắt đầu"}
                                                  </Button>
                                                </Link>
                                              </motion.div>
                                              {isLevelCompleted(level.id) && (
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleResetLevel(level.id)}
                                                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                                  >
                                                    Reset
                                                  </Button>
                                                </motion.div>
                                              )}
                                            </>
                                          ) : (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: 0.2 }}
                                            >
                                              <Badge variant="outline" className="bg-gray-100 text-gray-500">
                                                <Lock className="h-3 w-3 mr-1" />
                                                Khóa
                                              </Badge>
                                            </motion.div>
                                          )}
                                        </div>
                                      </motion.div>
                                    ))
                                  ) : (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="text-center py-8 text-gray-500"
                                    >
                                      <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      >
                                        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                      </motion.div>
                                      <p className="text-sm">Chưa có level nào</p>
                                    </motion.div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  );
}