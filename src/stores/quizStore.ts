import { create } from "zustand";
import { publicApi } from "@/lib/publicApi";

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
  lastAnswerResult: { isCorrect: boolean; message: string } | null;
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
  lastAnswerResult: null,

  startQuiz: async (levelId: string) => {
    set({ isLoading: true, error: null, lastAnswerResult: null });
    try {
      console.log("Starting quiz with levelId:", levelId);
      const response = await publicApi.startQuiz(levelId);
      console.log("API Response:", response.data);
      const { attemptId, session, firstQuestion } = response.data;
      set({
        attemptId,
        levelId,
        currentQuestion: firstQuestion.question || firstQuestion,
        totalQuestions: session.totalQuestions,
        heartsRemaining: session.heartsRemaining,
        isLoading: false,
      });
    } catch (err) {
      console.error("Start quiz error:", err);
      set({
        error: err instanceof Error ? err.message : "Failed to start quiz",
        isLoading: false,
      });
    }
  },

  submitAnswer: async (questionId: string, userAnswer: string) => {
    set({ isLoading: true, error: null });
    try {
      const { levelId } = get();
      if (!levelId) {
        throw new Error("Level ID is not available");
      }
      const response = await publicApi.submitAnswer({ 
        levelId, 
        questionId, 
        userAnswer 
      });
      console.log("Submit answer response:", response.data);
      const {
        isCorrect,
        message,
        heartsRemaining,
        nextQuestion,
        quizComplete,
        levelFailed,
      } = response.data;

      set((state) => ({
        heartsRemaining,
        currentQuestion: nextQuestion?.question || nextQuestion || null,
        totalQuestions: nextQuestion ? state.totalQuestions : state.totalQuestions,
        answers: [...state.answers, { questionId, userAnswer }],
        quizComplete: quizComplete || null,
        levelFailed: levelFailed || false,
        lastAnswerResult: { isCorrect, message },
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
    try {
      const { levelId } = get();
      if (levelId) {
        await publicApi.abandonQuiz(levelId);
      }
    } catch (err) {
      console.error("Failed to abandon quiz:", err);
    }
    set({
      attemptId: null,
      levelId: null,
      currentQuestion: null,
      heartsRemaining: 0,
      totalQuestions: 0,
      answers: [],
      quizComplete: null,
      levelFailed: false,
      lastAnswerResult: null,
      isLoading: false,
      error: null,
    });
  },
}));