"use client";

import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/configURL";

interface QuizState {
  attemptId: string | null;
  levelId: string | null;
  currentQuestion: any | null;
  heartsRemaining: number;
  totalQuestions: number;
  answers: Array<{ questionId: string; userAnswer: string }>;
  isLoading: boolean;
  error: string | null;
  quizComplete: any | null;
  levelFailed: boolean;
  startQuiz: (levelId: string) => Promise<void>;
  submitAnswer: (questionId: string, userAnswer: string) => Promise<void>;
  abandonQuiz: () => Promise<void>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  attemptId: null,
  levelId: null,
  currentQuestion: null,
  heartsRemaining: 0,
  totalQuestions: 0,
  answers: [],
  isLoading: false,
  error: null,
  quizComplete: null,
  levelFailed: false,

  startQuiz: async (levelId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiFetch(API_ENDPOINTS.QUIZ_START, {
        method: "POST",
        body: JSON.stringify({ levelId }),
      });
      const { attemptId, question, heartsRemaining, totalQuestions } = response.data;
      set({
        attemptId,
        levelId,
        currentQuestion: question,
        heartsRemaining,
        totalQuestions,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to start quiz",
        isLoading: false,
      });
    }
  },

  submitAnswer: async (questionId: string, userAnswer: string) => {
    set({ isLoading: true, error: null });
    try {
      const { attemptId } = get();
      const response = await apiFetch(API_ENDPOINTS.QUIZ_ANSWER, {
        method: "POST",
        body: JSON.stringify({ attemptId, questionId, userAnswer }),
      });
      const {
        isCorrect,
        heartsRemaining,
        nextQuestion,
        quizComplete,
        levelFailed,
      } = response.data;

      set((state) => ({
        heartsRemaining,
        currentQuestion: nextQuestion || null,
        answers: [...state.answers, { questionId, userAnswer }],
        quizComplete: quizComplete || null,
        levelFailed: levelFailed || false,
        isLoading: false,
      }));

      if (heartsRemaining === 0 && levelFailed) {
        await get().abandonQuiz();
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to submit answer",
        isLoading: false,
      });
    }
  },

  abandonQuiz: async () => {
    const { levelId, attemptId } = get();
    if (!levelId || !attemptId) return;

    try {
      await apiFetch(API_ENDPOINTS.QUIZ_ABANDON(levelId), {
        method: "POST",
        body: JSON.stringify({ attemptId }),
      });
      set({
        attemptId: null,
        levelId: null,
        currentQuestion: null,
        heartsRemaining: 0,
        totalQuestions: 0,
        answers: [],
        quizComplete: null,
        levelFailed: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to abandon quiz" });
    }
  },
}));