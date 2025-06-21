"use client";

import { Button } from "@/components/ui/button";

interface MultipleChoiceQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
  };
  onAnswer: (answer: string) => void;
}

export default function MultipleChoiceQuestion({ question, onAnswer }: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg">{question.text}</p>
      <div className="grid gap-2">
        {question.options.map((option, index) => (
          <Button key={index} variant="outline" onClick={() => onAnswer(option)}>
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}