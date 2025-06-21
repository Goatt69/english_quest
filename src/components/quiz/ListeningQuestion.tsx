"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Howl} from 'howler';

interface ListeningQuestionProps {
  question: {
    id: string;
    text: string;
    audioUrl: string;
    options: string[];
    maxReplays: number;
  };
  onAnswer: (answer: string) => void;
}

export default function ListeningQuestion({ question, onAnswer }: ListeningQuestionProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [playCount, setPlayCount] = useState(0);

  const sound = new Howl({
    src: [question.audioUrl],
    html5: true, // Use HTML5 audio for better mobile support
  });

  const handlePlay = () => {
    if (playCount < question.maxReplays) {
      sound.play();
      setPlayCount((prev) => prev + 1);
    }
  };

  const handleWordClick = (word: string) => {
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleSubmit = () => {
    onAnswer(selectedWords.join(" "));
    setSelectedWords([]);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">{question.text}</p>
      <Button onClick={handlePlay} disabled={playCount >= question.maxReplays}>
        Play Audio ({question.maxReplays - playCount} left)
      </Button>
      <div className="flex flex-wrap gap-2">
        {question.options.map((word, index) => (
          <Button key={index} variant="outline" onClick={() => handleWordClick(word)}>
            {word}
          </Button>
        ))}
      </div>
      <p>Selected: {selectedWords.join(" ")}</p>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}