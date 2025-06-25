"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultipleChoiceQuestion from "@/components/quiz/MultipleChoiceQuestion";
import ListeningQuestion from "@/components/quiz/ListeningQuestion";
import VocabularyQuestion from "@/components/quiz/VocabularyQuestion";
import PatternRecognitionQuestion from "@/components/quiz/PatternRecognitionQuestion";
import CorrectSentence from "@/components/quiz/CorrectSentence";

export default function QuizPage({ params: paramsPromise }: { params: Promise<{ levelId: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const {
    startQuiz,
    currentQuestion,
    heartsRemaining,
    totalQuestions,
    answers,
    isLoading,
    error,
    quizComplete,
    levelFailed,
    heartFailure, // Thêm heartFailure
    abandonQuiz,
    answerResult,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (params.levelId) {
      startQuiz(params.levelId);
    }
  }, [params.levelId, startQuiz]);

  useEffect(() => {
    if (answerResult) {
      setShowResult(true);
    }
  }, [answerResult]);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (selectedAnswer && currentQuestion) {
      await useQuizStore.getState().submitAnswer(currentQuestion.id, selectedAnswer);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    useQuizStore.setState({ answerResult: null });
  };

  const handleQuit = async () => {
    if (window.confirm("Bạn có chắc muốn thoát quiz không? Tiến độ sẽ bị mất.")) {
      await abandonQuiz();
      router.push("/dashboard");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Lỗi: {error}</div>;
  }

  if (heartFailure) { // Kiểm tra heartFailure trước
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Thất bại</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You run out of heart, please come back to dashboard or reset test</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4 mr-2">
              Về Dashboard
            </Button>
            <Button onClick={() => startQuiz(params.levelId)} className="mt-4">
              Reset Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Hoàn thành Quiz!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Điểm: {quizComplete.results.score}</p>
            <p>Tổng số câu hỏi: {totalQuestions}</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Về Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (levelFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Thất bại</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Level thất bại, hãy thử lại!</p>
            <Button onClick={() => startQuiz(params.levelId)} className="mt-4">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">Không có câu hỏi</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Level Quiz</span>
            <span>Tim: {heartsRemaining}</span>
          </CardTitle>
          <p>Câu {answers.length + 1} / {totalQuestions}</p>
        </CardHeader>
        <CardContent>
          {currentQuestion && !showResult && (
            <>
              {currentQuestion.type === 0 && (
                <MultipleChoiceQuestion
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
              {![0, 1, 2, 3, 4].includes(currentQuestion.type) && (
                <p>Loại câu hỏi không được hỗ trợ: {currentQuestion.type}</p>
              )}
              <Button onClick={handleSubmit} disabled={!selectedAnswer} className="mt-4">
                Nộp câu trả lời
              </Button>
            </>
          )}
          {showResult && answerResult && (
            <div className="mt-4 p-4 border rounded">
              <p className={answerResult.isCorrect ? "text-green-600" : "text-red-600"}>
                {answerResult.isCorrect ? "Đúng" : "Sai"}
              </p>
              {!answerResult.isCorrect && answerResult.correctAnswer && (
                <p>Đáp án đúng: {answerResult.correctAnswer}</p>
              )}
              {currentQuestion && (
                <Button onClick={handleNextQuestion} className="mt-4">
                  Câu tiếp theo
                </Button>
              )}
            </div>
          )}
          <Button variant="outline" onClick={handleQuit} className="mt-4 ml-4">
            Thoát Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}