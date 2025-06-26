import { create } from "zustand";
import { publicApi } from "@/lib/publicApi";
import { convertQuestionType } from "@/types/quiz";

interface QuizState {
  attemptId: string | null;
  levelId: string | null;
  currentQuestion: any | null;
  heartsRemaining: number;
  totalQuestions: number;
  currentQuestionNumber: number;
  answers: Array<{ questionId: string; userAnswer: string }>;
  isLoading: boolean;
  error: string | null;
  quizComplete: any | null;
  levelFailed: boolean;
  heartFailure: boolean;
  answerResult: { 
    isCorrect: boolean; 
    message: string; 
    correctAnswer?: string; 
    explanation?: string 
    pointsEarned?: number;
  } | null;
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
  currentQuestionNumber: 0,
  answers: [],
  isLoading: false,
  error: null,
  quizComplete: null,
  levelFailed: false,
  heartFailure: false,
  answerResult: null,

  startQuiz: async (levelId: string) => {
    set({
      isLoading: true,
      error: null,
      answerResult: null,
      heartFailure: false,
      quizComplete: null,
      levelFailed: false,
      answers: []
    });
    try {
      console.log("Starting quiz with levelId:", levelId);
      const response = await publicApi.startQuiz(levelId);
      console.log("API Response:", response);
      
      const { attemptId, session, firstQuestion } = response.data;
      
      // Process the question and convert type from string to number
      const processedQuestion = {
        ...firstQuestion.question,
        type: convertQuestionType(firstQuestion.question.type)
      };
      
      set({
        attemptId,
        levelId,
        currentQuestion: processedQuestion,
        totalQuestions: session.totalQuestions,
        heartsRemaining: session.heartsRemaining,
        currentQuestionNumber: session.currentQuestionNumber,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Không thể bắt đầu quiz",
        isLoading: false,
      });
    }
  },

  submitAnswer: async (questionId: string, userAnswer: string) => {
    set({ isLoading: true, error: null });
    try {
      const { levelId } = get();
      if (!levelId) {
        throw new Error("Level ID không khả dụng");
      }
      
      const response = await publicApi.submitAnswer({ 
        levelId, 
        questionId, 
        userAnswer 
      });
      
      const {
        isCorrect,
        message,
        correctAnswer,
        explanation,
        heartsRemaining,
        nextQuestion,
        quizComplete,
        levelFailed,
      } = response.data;

      // Process next question if it exists
      let processedNextQuestion = null;
      if (nextQuestion?.question) {
        processedNextQuestion = {
          ...nextQuestion.question,
          type: convertQuestionType(nextQuestion.question.type)
        };
      }

      set((state) => ({
        heartsRemaining,
        currentQuestion: processedNextQuestion || state.currentQuestion,
        currentQuestionNumber: nextQuestion?.session?.currentQuestionNumber || state.currentQuestionNumber,
        answers: [...state.answers, { questionId, userAnswer }],
        quizComplete: quizComplete || null,
        levelFailed: levelFailed || false,
        heartFailure: heartsRemaining === 0 && levelFailed,
        answerResult: { isCorrect, message, correctAnswer, explanation },
        isLoading: false,
      }));

      if (heartsRemaining === 0 && levelFailed) {
        await get().abandonQuiz();
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Không thể nộp câu trả lời",
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
      console.error("Không thể thoát quiz:", err);
    }
    set({
      attemptId: null,
      levelId: null,
      currentQuestion: null,
      heartsRemaining: 0,
      totalQuestions: 0,
      currentQuestionNumber: 0,
      answers: [],
      quizComplete: null,
      levelFailed: false,
      heartFailure: false,
      answerResult: null,
      isLoading: false,
      error: null,
    });
  },
}));