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
  levels?: QuizLevel[] // Make optional since it's added later
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

export interface QuizQuestion {
  id: string
  levelId: string
  type: QuestionType
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
  audioUrl?: string
  hasAudio: boolean
  imageUrl?: string
  hasImage: boolean
  pattern?: string
  listening?: string
  points: number
  difficulty: number
  order: number
  createdAt: string
  updatedAt: string
  isActive: boolean
}

// API Response interfaces - flexible to handle different response formats
export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}

export interface QuizStartResponse {
  data: {
    attemptId: string;
    session: {
      totalQuestions: number;
      heartsRemaining: number;
    };
    firstQuestion: {
      question?: any;
      [key: string]: any;
    };
  };
}

export interface QuizAnswerResponse {
  data: {
    isCorrect: boolean;
    message: string;
    heartsRemaining: number;
    nextQuestion?: {
      question?: any;
      [key: string]: any;
    };
    quizComplete?: any;
    levelFailed?: boolean;
  };
}

// Union types to handle both direct arrays and wrapped responses
export type SectionsResponse = QuizSection[] | ApiResponse<QuizSection[]>
export type LevelsResponse = QuizLevel[] | ApiResponse<QuizLevel[]>

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