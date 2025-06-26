"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

interface WordState {
  word: string;
  originalIndex: number;
  isInAnswer: boolean;
  answerPosition?: number;
  id: string;
}

export default function ListeningQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: ListeningQuestionProps) {
  const [playCount, setPlayCount] = useState(0);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [answerSlots, setAnswerSlots] = useState<(WordState | null)[]>([]);
  const [animatingWords, setAnimatingWords] = useState<Set<string>>(new Set());
  const { listening } = question;

  // Initialize word states
  useEffect(() => {
    const initialStates = listening.wordBank.map((word, index) => ({
      word,
      originalIndex: index,
      isInAnswer: false,
      id: `word-${index}-${word}`,
    }));
    setWordStates(initialStates);
    
    const correctWords = listening.audioText.split(' ');
    setAnswerSlots(new Array(correctWords.length).fill(null));
  }, [listening]);

  // Update selected answer whenever answer slots change
  useEffect(() => {
    const answer = answerSlots
      .map(slot => slot?.word || '')
      .join(' ')
      .trim();
    setSelectedAnswer(answer);
  }, [answerSlots, setSelectedAnswer]);

  const handlePlay = () => {
    if (playCount < listening.maxReplays) {
      const utterance = new SpeechSynthesisUtterance(listening.audioText);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
      setPlayCount(prev => prev + 1);
    }
  };

  const handleWordClick = (clickedWord: WordState) => {
    if (animatingWords.has(clickedWord.id)) return;
    
    if (clickedWord.isInAnswer) {
      moveWordToBank(clickedWord);
    } else {
      moveWordToAnswer(clickedWord);
    }
  };

  const moveWordToAnswer = (word: WordState) => {
    const emptySlotIndex = answerSlots.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) return;

    setAnimatingWords(prev => new Set(prev).add(word.id));

    const updatedWordStates = wordStates.map(w => 
      w.originalIndex === word.originalIndex 
        ? { ...w, isInAnswer: true, answerPosition: emptySlotIndex }
        : w
    );
    setWordStates(updatedWordStates);

    setTimeout(() => {
      const updatedAnswerSlots = [...answerSlots];
      updatedAnswerSlots[emptySlotIndex] = { ...word, isInAnswer: true, answerPosition: emptySlotIndex };
      setAnswerSlots(updatedAnswerSlots);
      
      setAnimatingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word.id);
        return newSet;
      });
    }, 300);
  };

  const moveWordToBank = (word: WordState) => {
    if (word.answerPosition === undefined) return;

    setAnimatingWords(prev => new Set(prev).add(word.id));

    const updatedAnswerSlots = [...answerSlots];
    if (word.answerPosition !== undefined) {
      updatedAnswerSlots[word.answerPosition] = null;
    }
    setAnswerSlots(updatedAnswerSlots);

    setTimeout(() => {
      const updatedWordStates = wordStates.map(w => 
        w.originalIndex === word.originalIndex 
          ? { ...w, isInAnswer: false, answerPosition: undefined }
          : w
      );
      setWordStates(updatedWordStates);
      
      setAnimatingWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word.id);
        return newSet;
      });
    }, 300);
  };

  const handleAnswerSlotClick = (slotIndex: number) => {
    const wordInSlot = answerSlots[slotIndex];
    if (wordInSlot && !animatingWords.has(wordInSlot.id)) {
      moveWordToBank(wordInSlot);
    }
  };

  // Fixed Animation variants with proper typing
  const wordVariants: Variants = {
    initial: { 
      scale: 1, 
      opacity: 1 
    },
    hover: { 
      scale: 1.05, 
      y: -2,
      transition: { 
        type: "spring" as const, 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { 
      scale: 0.95 
    },
    disabled: { 
      scale: 0.9, 
      opacity: 0.3,
      transition: { 
        duration: 0.2 
      }
    },
    flying: {
      scale: 0.8,
      opacity: 0.7,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const containerVariants: Variants = {
    hidden: { 
      opacity: 0 
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Question Text */}
      <motion.div className="text-center" variants={itemVariants}>
        <p className="text-lg font-medium text-gray-800 mb-4">{question.text}</p>
        
        {/* Audio Player */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handlePlay}
            disabled={playCount >= listening.maxReplays}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-all duration-200 disabled:opacity-50"
            size="lg"
          >
            <motion.div
              animate={playCount < listening.maxReplays ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {playCount >= listening.maxReplays ? (
                <Volume2 className="h-5 w-5 mr-2" />
              ) : (
                <Play className="h-5 w-5 mr-2" />
              )}
            </motion.div>
            {playCount >= listening.maxReplays 
              ? "No more replays" 
              : `Play Audio (${listening.maxReplays - playCount} left)`
            }
          </Button>
        </motion.div>
      </motion.div>

      {/* Answer Area */}
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-dashed border-blue-200 shadow-inner"
        variants={itemVariants}
      >
        <motion.p 
          className="text-sm font-medium text-blue-700 mb-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🎯 Tap the words in the correct order:
        </motion.p>
        
        <div className="flex flex-wrap gap-3 justify-center min-h-[70px] items-center">
          <AnimatePresence mode="wait">
            {answerSlots.map((slot, index) => (
              <motion.div
                key={`slot-${index}`}
                layoutId={slot ? `word-${slot.id}` : undefined}
                initial={{ 
                  scale: 1,
                  backgroundColor: "#ffffff",
                  borderColor: "#d1d5db"
                }}
                animate={slot ? {
                  scale: 1.02,
                  backgroundColor: "#dbeafe",
                  borderColor: "#3b82f6",
                  transition: { 
                    type: "spring" as const, 
                    stiffness: 300, 
                    damping: 20 
                  }
                } : {
                  scale: 1,
                  backgroundColor: "#ffffff",
                  borderColor: "#d1d5db"
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f3f4f6",
                  transition: { duration: 0.2 }
                }}
                onClick={() => handleAnswerSlotClick(index)}
                className={`
                  min-w-[90px] h-14 rounded-xl border-2 border-dashed 
                  flex items-center justify-center cursor-pointer transition-all duration-300
                  ${slot 
                    ? 'text-blue-800 font-semibold shadow-md' 
                    : 'hover:border-blue-300'
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {slot ? (
                    <motion.span
                      key={slot.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring" as const, 
                        stiffness: 500, 
                        damping: 25 
                      }}
                      className="px-2 text-center"
                    >
                      {slot.word}
                    </motion.span>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex space-x-1"
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-0.5 bg-gray-400 rounded"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Word Bank */}
      <motion.div className="space-y-4" variants={itemVariants}>
        <motion.p 
          className="text-sm font-medium text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          💭 Available words:
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-3 justify-center"
          variants={containerVariants}
        >
          <AnimatePresence>
            {wordStates.map((wordState) => (
              <motion.div
                key={wordState.id}
                layoutId={`word-${wordState.id}`}
                variants={wordVariants}
                initial="initial"
                animate={
                  animatingWords.has(wordState.id) ? "flying" :
                  wordState.isInAnswer ? "disabled" : "initial"
                }
                whileHover={!wordState.isInAnswer && !animatingWords.has(wordState.id) ? "hover" : undefined}
                whileTap={!wordState.isInAnswer && !animatingWords.has(wordState.id) ? "tap" : undefined}
                onClick={() => handleWordClick(wordState)}
                className={`
                  px-5 py-3 text-base font-medium rounded-xl border-2 cursor-pointer
                  transition-all duration-200 select-none
                  ${wordState.isInAnswer || animatingWords.has(wordState.id)
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md'
                  }
                `}
              >
                <motion.span
                  animate={animatingWords.has(wordState.id) ? { 
                    scale: [1, 1.2, 0.8], 
                    rotate: [0, 5, -5, 0] 
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {wordState.word}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div 
        className="text-center space-y-2"
        variants={itemVariants}
      >
        <motion.div
          className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(answerSlots.filter(slot => slot !== null).length / answerSlots.length) * 100}%` 
            }}
            transition={{ 
              type: "spring" as const, 
              stiffness: 300, 
              damping: 30 
            }}
          />
        </motion.div>
        
        <motion.p 
          className="text-sm text-gray-500"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Selected: {answerSlots.filter(slot => slot !== null).length} / {answerSlots.length} words
        </motion.p>
        
        <AnimatePresence>
          {selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block"
            >
              <p className="text-sm text-blue-700 font-medium">
                Current answer: 
                <motion.span 
                  className="ml-2 font-bold text-blue-800"
                  key={selectedAnswer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  "{selectedAnswer}"
                </motion.span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating particles effect when words are selected */}
      <AnimatePresence>
        {animatingWords.size > 0 && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  y: [null, -50],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}