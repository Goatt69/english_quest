"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CheckCircle, XCircle, Heart, ArrowRight, Lightbulb } from "lucide-react";

interface AnswerResultBannerProps {
  result: {
    isCorrect: boolean;
    message: string;
    correctAnswer?: string;
    explanation?: string;
  };
  userAnswer: string;
  onContinue: () => void;
  isLastQuestion?: boolean;
}

export default function AnswerResultBanner({
  result,
  onContinue,
  isLastQuestion = false
}: AnswerResultBannerProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Auto-show explanation after 1 second for incorrect answers
  useEffect(() => {
    if (!result.isCorrect && result.explanation) {
      const timer = setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [result.isCorrect, result.explanation]);

  // Fixed Animation variants with proper typing
  const bannerVariants: Variants = {
    hidden: { 
      y: "100%", 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    },
    exit: { 
      y: "100%", 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onContinue}
      />
      
      <motion.div
          key="banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-x-0 bottom-0 z-50"
      >
        <motion.div
          className={`relative mx-4 mb-4 rounded-2xl shadow-2xl border-2 overflow-hidden ${
            result.isCorrect
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              : "bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
          }`}
        >
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-4 h-4 rounded-full ${
                  result.isCorrect ? "bg-green-400" : "bg-red-400"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="relative p-6"
          >
            {/* Header Section */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring" as const, 
                    stiffness: 400, 
                    damping: 15,
                    delay: 0.2 
                  }}
                >
                  {result.isCorrect ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </motion.div>
                
                <div>
                  <motion.h3
                    variants={itemVariants}
                    className={`text-xl font-bold ${
                      result.isCorrect ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {result.isCorrect ? "🎉 Chính xác!" : "❌ Không chính xác"}
                  </motion.h3>
                  <motion.p
                    variants={itemVariants}
                    className={`text-sm ${
                      result.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.message}
                  </motion.p>
                </div>
              </div>

              {/* Hearts Display */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-1"
              >
              </motion.div>
            </motion.div>

            {/* Explanation Section */}
            <AnimatePresence>
              {result.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: showExplanation ? 1 : 0.7, 
                    height: "auto" 
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg p-4 mb-4 border ${
                    result.isCorrect
                      ? "bg-blue-50 border-blue-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <motion.div
                      animate={{ rotate: showExplanation ? 0 : 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Lightbulb className={`h-5 w-5 mt-0.5 ${
                        result.isCorrect ? "text-blue-600" : "text-orange-600"
                      }`} />
                    </motion.div>
                    <div>
                      <p className={`font-medium text-sm ${
                        result.isCorrect ? "text-blue-800" : "text-orange-800"
                      }`}>
                        Giải thích:
                      </p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`text-sm mt-1 ${
                          result.isCorrect ? "text-blue-700" : "text-orange-700"
                        }`}
                      >
                        {result.explanation}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onContinue}
                  size="lg"
                  className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                    result.isCorrect
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <span className="mr-2">
                    {isLastQuestion ? "Hoàn thành" : "Câu tiếp theo"}
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}