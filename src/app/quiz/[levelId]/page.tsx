"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MultipleChoiceQuestion from "@/components/quiz/MultipleChoiceQuestion";
import ListeningQuestion from "@/components/quiz/ListeningQuestion";
import VocabularyQuestion from "@/components/quiz/VocabularyQuestion";
import PatternRecognitionQuestion from "@/components/quiz/PatternRecognitionQuestion";
import CorrectSentence from "@/components/quiz/CorrectSentence";
import FillInTheBlankQuestion from "@/components/quiz/FillInTheBlankQuestion";
import AnswerResultBanner from "@/components/quiz/AnswerResultBanner";
import SharedLayout from "@/components/SharedLayout";

export default function QuizPage({ params: paramsPromise }: { params: Promise<{ levelId: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const {
    startQuiz,
    currentQuestion,
    heartsRemaining,
    totalQuestions,
    currentQuestionNumber,
    answers,
    isLoading,
    error,
    quizComplete,
    levelFailed,
    heartFailure,
    abandonQuiz,
    answerResult,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false); // NEW: Track answer processing

  // Handle quiz abandonment
  const handleAbandonQuiz = useCallback(async () => {
    try {
      await abandonQuiz();
      setIsQuizActive(false);
    } catch (err) {
      console.error("Error abandoning quiz:", err);
    }
  }, [abandonQuiz]);

  // Handle page unload/reload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isQuizActive && !quizComplete && !levelFailed && !heartFailure) {
        e.preventDefault();
        e.returnValue = "Bạn có chắc muốn rời khỏi trang? Tiến độ quiz sẽ bị mất.";
        return e.returnValue;
      }
    };

    const handleUnload = () => {
      if (isQuizActive && !quizComplete && !levelFailed && !heartFailure) {
        if (navigator.sendBeacon && params.levelId) {
          const data = JSON.stringify({ levelId: params.levelId });
          navigator.sendBeacon('/api/quiz/abandon', data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [isQuizActive, quizComplete, levelFailed, heartFailure, params.levelId]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isQuizActive && !quizComplete && !levelFailed && !heartFailure) {
        e.preventDefault();
        setShowExitDialog(true);
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isQuizActive, quizComplete, levelFailed, heartFailure]);

  // Start quiz on component mount
  useEffect(() => {
    if (params.levelId) {
      startQuiz(params.levelId);
      setIsQuizActive(true);
    }
  }, [params.levelId, startQuiz]);
  useEffect(() => {
    if (answerResult && isAnswerSubmitted && !showResult) {
      setShowResult(true);
      setIsProcessingAnswer(false); // Answer processed
    }
  }, [answerResult, isAnswerSubmitted, showResult]);
  
  // FIXED: Reset states only when moving to next question (not when showing results)
  useEffect(() => {
    if (!showResult && !isProcessingAnswer) {
      setSelectedAnswer(null);
      setUserAnswer("");
      setIsAnswerSubmitted(false);
    }
  }, [currentQuestion?.id, showResult, isProcessingAnswer]); // Use question ID to detect actual question change
  
  // Auto-abandon quiz on persistent errors
  useEffect(() => {
    if (error && isQuizActive) {
      const timeoutId = setTimeout(() => {
        console.log("Auto-abandoning quiz due to persistent error:", error);
        handleAbandonQuiz();
      }, 5000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [error, isQuizActive, handleAbandonQuiz]);
  
  // Mark quiz as inactive when it ends
  useEffect(() => {
    if (quizComplete || levelFailed || heartFailure) {
      setIsQuizActive(false);
    }
  }, [quizComplete, levelFailed, heartFailure]);
  
  // FIXED: Handle submit with proper state management
  const handleSubmit = async () => {
    if (selectedAnswer && currentQuestion && !isProcessingAnswer) {
      setUserAnswer(selectedAnswer);
      setIsAnswerSubmitted(true);
      setIsProcessingAnswer(true); // Prevent multiple submissions
      
      try {
        // Submit the answer and wait for response
        await useQuizStore.getState().submitAnswer(currentQuestion.id, selectedAnswer);
      } catch (error) {
        console.error("Error submitting answer:", error);
        setIsProcessingAnswer(false);
        setIsAnswerSubmitted(false);
      }
    }
  };

// FIXED: Handle next question properly
  const handleNextQuestion = () => {
    // Hide the result banner first
    setShowResult(false);
    
    // Clear the answer result from store
    useQuizStore.setState({ answerResult: null });
    
    // Reset all form states for next question
    setSelectedAnswer(null);
    setUserAnswer("");
    setIsAnswerSubmitted(false);
    setIsProcessingAnswer(false);
    
    // The next question should already be loaded in the store from the API response
    // The useEffect will handle resetting states when currentQuestion.id changes
  };

  const handleQuit = () => {
    if (isQuizActive && !quizComplete && !levelFailed && !heartFailure) {
      setShowExitDialog(true);
    } else {
      router.push("/dashboard");
    }
  };

  const confirmExit = async () => {
    setShowExitDialog(false);
    await handleAbandonQuiz();
    setTimeout(() => {
      router.push("/dashboard");
    }, 50);
  };

  const cancelExit = () => {
    setShowExitDialog(false);
  };

// Calculate progress percentage
  const progressPercentage = totalQuestions > 0 ? (currentQuestionNumber / totalQuestions) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Lỗi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="text-sm text-red-600 mb-4">
              Quiz sẽ tự động kết thúc sau 5 giây nếu lỗi vẫn tiếp tục...
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push("/dashboard")} 
                variant="outline" 
                className="flex-1"
              >
                Về Dashboard
              </Button>
              <Button
                  onClick={async () => {
                    await handleAbandonQuiz();
                    await startQuiz(params.levelId);
                  }}
                  className="flex-1"
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (heartFailure) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-red-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Hết tim!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-2" />
              <p className="text-gray-700">Bạn đã hết tim. Hãy thử lại hoặc quay về dashboard.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
                Về Dashboard
              </Button>
              <Button onClick={() => startQuiz(params.levelId)} className="flex-1">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-white to-green-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600">🎉 Hoàn thành Quiz!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3 mb-6">
              <p className="text-2xl font-bold text-green-600">
                Điểm: {quizComplete.results?.score || 0}
              </p>
              <p className="text-gray-600">
                Hoàn thành: {answers.length}/{totalQuestions} câu hỏi
              </p>
              <p className="text-gray-600">
                Trạng thái: {quizComplete.results?.passed ? "✅ Đạt" : "❌ Chưa đạt"}
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Về Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (levelFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-red-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Thất bại</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 mb-4">Level thất bại, hãy thử lại!</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard")} variant="outline" className="flex-1">
                Về Dashboard
              </Button>
              <Button onClick={() => startQuiz(params.levelId)} className="flex-1">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <p className="text-lg text-gray-600">Không có câu hỏi</p>
      </div>
    );
  }

  return (
      <SharedLayout showNavbar={false} showFooter={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-medium">Tim: {heartsRemaining}</span>
              </div>
              <div className="text-sm text-gray-600">
                Câu {currentQuestionNumber} / {totalQuestions}
              </div>
            </div>
            <Progress value={progressPercentage} className="w-full h-2" />
          </CardHeader>
          <CardContent>
            {/* FIXED: Only show question form when not showing results */}
            {currentQuestion && !showResult && (
              <>
                {/* Fill in the Blank - Type 0 */}
                {currentQuestion.type === 0 && (
                  <FillInTheBlankQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 1 && (
                  <VocabularyQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 2 && (
                  <CorrectSentence
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 3 && (
                  <PatternRecognitionQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 4 && (
                  <ListeningQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 5 && (
                  <MultipleChoiceQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {![0, 1, 2, 3, 4, 5].includes(currentQuestion.type) && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      ⚠️ Loại câu hỏi không được hỗ trợ: {currentQuestion.type}
                    </p>
                  </div>
                )}
  
                <div className="flex gap-3 mt-6">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!selectedAnswer || isProcessingAnswer} 
                    className="flex-1"
                  >
                    {isProcessingAnswer ? "Đang xử lý..." : "Nộp câu trả lời"}
                  </Button>
                  <Button variant="outline" onClick={handleQuit}>
                    <X className="h-4 w-4 mr-2" />
                    Thoát
                  </Button>
                </div>
              </>
            )}
  
            {/* FIXED: Show loading state while processing answer */}
            {isProcessingAnswer && !showResult && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang xử lý câu trả lời...</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* FIXED: Answer Result Banner - Only show when we have results */}
        {showResult && answerResult && (
          <AnswerResultBanner
            result={{
              isCorrect: answerResult.isCorrect,
              message: answerResult.message,
              correctAnswer: answerResult.correctAnswer,
              explanation: answerResult.explanation,
            }}
            userAnswer={userAnswer}
            onContinue={handleNextQuestion}
            isLastQuestion={currentQuestionNumber >= totalQuestions}
          />
        )}
      </div>
  
      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Xác nhận thoát quiz
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Bạn có chắc chắn muốn thoát quiz không? 
              <br />
              <span className="font-medium text-red-600">
                Tất cả tiến độ hiện tại sẽ bị mất và không thể khôi phục.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Thông tin hiện tại:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Câu hỏi: {currentQuestionNumber}/{totalQuestions}</li>
                  <li>• Tim còn lại: {heartsRemaining}</li>
                  <li>• Câu đã trả lời: {answers.length}</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
                        <Button
                variant="outline"
                onClick={cancelExit}
                className="flex-1"
              >
                Tiếp tục quiz
              </Button>
              <Button
                variant="destructive"
                onClick={confirmExit}
                className="flex-1"
              >
                Thoát quiz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SharedLayout>
    );
}