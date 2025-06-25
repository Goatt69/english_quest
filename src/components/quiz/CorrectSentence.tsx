"use client";

import { Button } from "@/components/ui/button";

interface CorrectSentenceProps {
  question: {
    id: string;
    text: string;
    options: string[];
  };
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export default function CorrectSentence({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: CorrectSentenceProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-800">{question.text}</p>
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === option ? "default" : "outline"}
            className="w-full text-left justify-start py-2 px-4 hover:bg-gray-100"
            onClick={() => setSelectedAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}