"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultipleChoiceQuestion from "@/components/quiz/MultipleChoiceQuestion";
import ListeningQuestion from "@/components/quiz/ListeningQuestion";
import FillInTheBlankQuestion from "@/components/quiz/FillInTheBlankQuestion";

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
    abandonQuiz,
    lastAnswerResult,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (params.levelId) {
      startQuiz(params.levelId);
    }
  }, [params.levelId, startQuiz]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!quizComplete && !levelFailed && currentQuestion) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave? Your quiz progress will be lost.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [quizComplete, levelFailed, currentQuestion]);

  useEffect(() => {
    if (lastAnswerResult && !lastAnswerResult.isCorrect) {
      alert(lastAnswerResult.message);
      useQuizStore.setState({ lastAnswerResult: null });
    }
  }, [lastAnswerResult]);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion]);

  const handleSubmit = async () => {
    if (selectedAnswer && currentQuestion) {
      await useQuizStore.getState().submitAnswer(currentQuestion.id, selectedAnswer);
    }
  };

  const handleQuit = async () => {
    if (window.confirm("Are you sure you want to quit the quiz? Your progress will be lost.")) {
      await abandonQuiz();
      router.push("/dashboard");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Score: {quizComplete.results.score}</p>
            <p>Total Questions: {totalQuestions}</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Back to Dashboard
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
            <CardTitle>Level Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You ran out of hearts. Try again?</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">No question available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Level Quiz</span>
            <span>Hearts: {heartsRemaining}</span>
          </CardTitle>
          <p>Question {answers.length + 1} of {totalQuestions}</p>
        </CardHeader>
        <CardContent>
            {currentQuestion && (
              <>
                {currentQuestion.type === 0 && (
                  <MultipleChoiceQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 1 && (
                  <MultipleChoiceQuestion
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                  />
                )}
                {currentQuestion.type === 2 && (
                  <FillInTheBlankQuestion
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
                {![0, 1, 2, 4].includes(currentQuestion.type) && (
                  <p>Loại câu hỏi không được hỗ trợ: {currentQuestion.type}</p>
                )}
              </>
          )}
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="mt-4">
            Submit Answer
          </Button>
          <Button variant="outline" onClick={handleQuit} className="mt-4 ml-4">
            Quit Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}