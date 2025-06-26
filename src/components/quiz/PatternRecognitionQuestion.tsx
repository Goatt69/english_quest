"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PatternRecognitionQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
    pattern?: any;
  };
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export default function PatternRecognitionQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: PatternRecognitionQuestionProps) {
  console.log("PatternRecognitionQuestion - question data:", question);
  console.log("PatternRecognitionQuestion - pattern data:", question.pattern);

  const getPatternData = () => {
    if (!question.pattern) return null;
    
    const pattern = question.pattern;
    
    return {
      pattern: pattern.Pattern || pattern.pattern || "",
      baseSentence: pattern.BaseSentence || pattern.baseSentence || "",
      exampleSentence: pattern.ExampleSentence || pattern.exampleSentence || "",
      questionSentence: pattern.QuestionSentence || pattern.questionSentence || ""
    };
  };

  const patternData = getPatternData();

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
      
      {patternData && (
        <motion.div 
          className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="space-y-2">
            <motion.p 
              className="text-sm font-semibold text-blue-900"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Pattern: <span className="font-normal text-blue-800">{patternData.pattern}</span>
            </motion.p>
            <motion.p 
              className="text-sm text-blue-700"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-medium">Example:</span> {patternData.baseSentence}
            </motion.p>
            <motion.p 
              className="text-sm text-blue-700"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="font-medium">Another example:</span> {patternData.exampleSentence}
            </motion.p>
            <motion.p 
              className="text-sm font-medium text-blue-900 bg-blue-100 p-2 rounded border"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="font-semibold">Complete:</span> {patternData.questionSentence}
            </motion.p>
          </div>
        </motion.div>
      )}

      {!question.pattern && (
        <motion.div 
          className="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-yellow-800">
            ⚠️ Pattern data not available for this question
          </p>
        </motion.div>
      )}

      {question.pattern && !patternData?.pattern && (
        <motion.div 
          className="bg-orange-50 p-4 rounded-lg border border-orange-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-orange-800">
            ⚠️ Pattern data format not recognized
          </p>
          <details className="mt-2">
            <summary className="text-xs cursor-pointer">Debug Info</summary>
            <pre className="text-xs mt-1 bg-white p-2 rounded border overflow-auto">
              {JSON.stringify(question.pattern, null, 2)}
            </pre>
          </details>
        </motion.div>
      )}
      
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={selectedAnswer === option ? "default" : "outline"}
              className="w-full text-left justify-start py-3 px-4 hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedAnswer(option)}
            >
              <motion.span 
                className="font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                {String.fromCharCode(65 + index)}.
              </motion.span>
              <motion.span 
                className="ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 + index * 0.1 }}
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