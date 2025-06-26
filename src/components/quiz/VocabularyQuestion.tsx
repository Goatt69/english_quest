"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface VocabularyQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
  };
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export default function VocabularyQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: VocabularyQuestionProps) {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p 
        className="text-lg font-medium text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question.text}
      </motion.p>
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={selectedAnswer === option ? "default" : "outline"}
              className="w-full text-left justify-start py-2 px-4 hover:bg-gray-100 transition-all duration-200"
              onClick={() => setSelectedAnswer(option)}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {option}
              </motion.span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}