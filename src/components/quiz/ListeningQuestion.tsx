"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ListeningQuestionProps {
  question: {
    id: string;
    text: string;
    listening: {
      audioText: string;
      wordBank: string[];
      maxReplays: number;
    };
  };
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export default function ListeningQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: ListeningQuestionProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [playCount, setPlayCount] = useState(0);
  const { listening } = question;

  useEffect(() => {
    setSelectedAnswer(selectedWords.join(" "));
  }, [selectedWords, setSelectedAnswer]);

  const handlePlay = () => {
    if (playCount < listening.maxReplays) {
      const utterance = new SpeechSynthesisUtterance(listening.audioText);
      speechSynthesis.speak(utterance);
      setPlayCount((prev) => prev + 1);
    }
  };

  const handleWordClick = (word: string) => {
    setSelectedWords((prev) => [...prev, word]);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-800">{question.text}</p>
      <Button
        onClick={handlePlay}
        disabled={playCount >= listening.maxReplays}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Play Audio ({listening.maxReplays - playCount} left)
      </Button>
      <div className="flex flex-wrap gap-2">
        {listening.wordBank.map((word, index) => (
          <Button
            key={index}
            variant="outline"
            className="py-2 px-4 hover:bg-gray-100"
            onClick={() => handleWordClick(word)}
          >
            {word}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-600">Selected: {selectedWords.join(" ")}</p>
    </div>
  );
}