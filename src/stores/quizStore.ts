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
  heartFailure: boolean; // Thêm trạng thái mới để xử lý hết tim
  answerResult: { isCorrect: boolean; message: string; correctAnswer?: string } | null;
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
  heartFailure: false, // Khởi tạo trạng thái mới
  answerResult: null,

  startQuiz: async (levelId: string) => {
    set({ isLoading: true, error: null, answerResult: null, heartFailure: false });
    try {
      const response = await apiFetch(API_ENDPOINTS.QUIZ_START, {
        method: "POST",
        body: JSON.stringify({ levelId }),
      });
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
      const response = await apiFetch(API_ENDPOINTS.QUIZ_ANSWER, {
        method: "POST",
        body: JSON.stringify({ levelId, questionId, userAnswer }),
      });
      const {
        isCorrect,
        message,
        correctAnswer,
        heartsRemaining,
        nextQuestion,
        quizComplete,
        levelFailed,
      } = response.data;

      set((state) => ({
        heartsRemaining,
        currentQuestion: nextQuestion?.question || nextQuestion || state.currentQuestion, // Giữ currentQuestion
        totalQuestions: nextQuestion ? state.totalQuestions : state.totalQuestions,
        answers: [...state.answers, { questionId, userAnswer }],
        quizComplete: quizComplete || null,
        levelFailed: levelFailed || false,
        heartFailure: heartsRemaining === 0 && levelFailed, // Đặt heartFailure khi hết tim
        answerResult: { isCorrect, message, correctAnswer },
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
        const abandonUrl = API_ENDPOINTS.QUIZ_ABANDON(levelId);
        await apiFetch(abandonUrl, {
          method: "POST",
        });
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