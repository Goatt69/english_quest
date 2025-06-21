"use client";

import { Button } from "@/components/ui/button";

interface MultipleChoiceQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
  };
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export default function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: MultipleChoiceQuestionProps) {
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