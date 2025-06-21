"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MultipleChoiceQuestion from "@/components/quiz/MultipleChoiceQuestion";
import ListeningQuestion from "@/components/quiz/ListeningQuestion";

export default function QuizPage({ params }: { params: { levelId: string } }) {
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
  } = useQuizStore();

  useEffect(() => {
    if (params.levelId) {
      startQuiz(params.levelId);
    }
  }, [params.levelId, startQuiz]);

  const handleAnswer = (answer: string) => {
    if (currentQuestion) {
      useQuizStore.getState().submitAnswer(currentQuestion.id, answer);
    }
  };

  const handleQuit = async () => {
    await abandonQuiz();
    router.push("/dashboard");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

  if (quizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Score: {quizComplete.score}</p>
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

  if (!currentQuestion) return <div className="min-h-screen flex items-center justify-center">No question available</div>;

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
          {currentQuestion.type === 0 && (
            <MultipleChoiceQuestion question={currentQuestion} onAnswer={handleAnswer} />
          )}
          {currentQuestion.type === 4 && (
            <ListeningQuestion question={currentQuestion} onAnswer={handleAnswer} />
          )}
          <Button variant="outline" onClick={handleQuit} className="mt-4">
            Quit Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}