export enum QuestionType {
  FillInTheBlank = 0,
  VocabularyMeaning = 1,
  CorrectSentence = 2,
  PatternRecognition = 3,
  ListeningComprehension = 4,
  MultipleChoice = 5,
  TrueFalse = 6,
  Matching = 7,
  Ordering = 8,
}

// Question type mapping from backend strings to frontend numbers
export const QUESTION_TYPE_MAP: Record<string, number> = {
  "FillInTheBlank": 0,
  "VocabularyMeaning": 1,
  "CorrectSentence": 2,
  "PatternRecognition": 3,
  "ListeningComprehension": 4,
  "MultipleChoice": 5,
  "TrueFalse": 6,
  "Matching": 7,
  "Ordering": 8
};

// Reverse mapping from numbers to strings (for debugging/display)
export const QUESTION_TYPE_NAMES: Record<number, string> = {
  0: "Fill in the Blank",
  1: "Vocabulary Meaning",
  2: "Correct Sentence",
  3: "Pattern Recognition",
  4: "Listening Comprehension",
  5: "Multiple Choice",
  6: "True/False",
  7: "Matching",
  8: "Ordering"
};

export interface QuizSection {
  id: string
  title: string
  description: string
  order: number
  imageUrl?: string
  iconUrl?: string
  isFreeAccess: boolean
  isLocked: boolean
  requiredPlan: number | null
  prerequisiteSectionIds: string[]
  totalLevels: number
  estimatedMinutes: number
  createdAt: string
  updatedAt: string
  isActive: boolean
  levels?: QuizLevel[]
}

export interface QuizLevel {
  id: string
  sectionId: string
  title: string
  description?: string
  order: number
  difficulty: number
  prerequisiteLevelIds: string[]
  passingScore: number
  maxHearts: number
  totalQuestions: number
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface PatternData {
  BaseSentence: string;
  ExampleSentence: string;
  QuestionSentence: string;
  Pattern: string;
}

export interface ListeningData {
  AudioText: string;
  WordBank: string[];
  PlaybackSpeed: number;
  MaxReplays: number;
}

export interface QuizQuestion {
  id: string
  levelId: string
  type: number // Will be converted from string to number
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
  audioUrl?: string
  hasAudio: boolean
  imageUrl?: string
  hasImage: boolean
  pattern?: PatternData
  listening?: ListeningData
  points: number
  difficulty: number
  order: number
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// Updated API Response interfaces to match your actual backend
export interface QuizStartResponse {
  status: boolean;
  data: {
    success: boolean;
    message: string;
    attemptId: string;
    level: {
      id: string;
      title: string;
      sectionId: string;
      totalQuestions: number;
      maxHearts: number;
      passingScore: number;
      difficulty: number;
    };
    session: {
      heartsRemaining: number;
      currentQuestionNumber: number;
      totalQuestions: number;
      startedAt: string;
      isInIncorrectPhase: boolean;
    };
    firstQuestion: {
      success: boolean;
      message: string;
      question: QuizQuestion;
      session: {
        heartsRemaining: number;
        currentQuestionNumber: number;
        totalQuestions: number;
        startedAt: string;
        isInIncorrectPhase: boolean;
      };
      isLastQuestion: boolean;
    };
    subscription: {
      plan: number;
      hasBonusHeart: boolean;
      maxHearts: number;
      bonusMessage: string;
    };
  };
}

export interface QuizAnswerResponse {
  status: boolean;
  data: {
    success: boolean;
    message: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    pointsEarned: number;
    heartsRemaining: number;
    levelFailed: boolean;
    nextQuestion?: {
      success: boolean;
      message: string;
      question: QuizQuestion;
      session: {
        heartsRemaining: number;
        currentQuestionNumber: number;
        totalQuestions: number;
        startedAt: string;
        isInIncorrectPhase: boolean;
      };
      isLastQuestion: boolean;
    };
    quizComplete?: {
      results: {
        score: number;
        totalQuestions: number;
        correctAnswers: number;
        passed: boolean;
      };
    };
  };
}

// Union types to handle both direct arrays and wrapped responses
export type SectionsResponse = QuizSection[] | ApiResponse<QuizSection[]>
export type LevelsResponse = QuizLevel[] | ApiResponse<QuizLevel[]>

// API Response interfaces
export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}

// Type guards to check response format
export const isWrappedResponse = <T>(response: T[] | ApiResponse<T[]>): response is ApiResponse<T[]> => {
  return response !== null && typeof response === 'object' && 'data' in response;
}

// Helper functions to extract data from responses
export const extractSectionsData = (response: SectionsResponse): QuizSection[] => {
  return isWrappedResponse(response) ? response.data : response;
}

export const extractLevelsData = (response: LevelsResponse): QuizLevel[] => {
  return isWrappedResponse(response) ? response.data : response;
}

// Helper function to convert backend question type to frontend number
export const convertQuestionType = (backendType: string | number): number => {
  // If it's already a number, return it
  if (typeof backendType === 'number') {
    return backendType;
  }
  
  // If it's a string, convert it
  return QUESTION_TYPE_MAP[backendType] ?? 0;
}

// Helper function to get question type name
export const getQuestionTypeName = (type: number): string => {
  return QUESTION_TYPE_NAMES[type] ?? "Unknown";
}