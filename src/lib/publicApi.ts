import { apiFetch, LoginResponse, RegisterResponse } from './api'
import { API_ENDPOINTS } from './configURL'
import {
  SectionsResponse,
  LevelsResponse,
  QuizSection,
  QuizLevel,
  extractSectionsData,
  extractLevelsData, QuizAnswerResponse, QuizStartResponse
} from '@/types/quiz'

// Request interfaces
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface QuizStartRequest {
  levelId: string;
}

interface QuizAnswerRequest {
  levelId: string;
  questionId: string;
  userAnswer: string;
}

interface QuizAbandonResponse {
  status: boolean;
  message: string;
}

export class PublicApiService {
  // Authentication
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiFetch<LoginResponse>(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
      requiresAuth: false,
    })
  }

  async register(userData: RegisterData): Promise<RegisterResponse> {
    return apiFetch<RegisterResponse>(API_ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
      requiresAuth: false,
    })
  }

  async logout(): Promise<void> {
    return apiFetch<void>(API_ENDPOINTS.LOGOUT, {
      method: "POST",
    })
  }

  // Public sections and levels - handle both response formats
  async getSections(): Promise<QuizSection[]> {
    const response = await apiFetch<SectionsResponse>(API_ENDPOINTS.SECTIONS);
    return extractSectionsData(response);
  }

  async getLevels(sectionId: string): Promise<QuizLevel[]> {
    const response = await apiFetch<LevelsResponse>(API_ENDPOINTS.LEVELS(sectionId));
    return extractLevelsData(response);
  }

  // Quiz
  async startQuiz(levelId: string): Promise<QuizStartResponse> {
    return apiFetch<QuizStartResponse>(API_ENDPOINTS.QUIZ_START, {
      method: "POST",
      body: JSON.stringify({ levelId }),
    })
  }

  async submitAnswer(data: QuizAnswerRequest): Promise<QuizAnswerResponse> {
    return apiFetch<QuizAnswerResponse>(API_ENDPOINTS.QUIZ_ANSWER, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async abandonQuiz(levelId: string): Promise<QuizAbandonResponse> {
    return apiFetch<QuizAbandonResponse>(API_ENDPOINTS.QUIZ_ABANDON(levelId), {
      method: "POST",
    })
  }

  // Leaderboard
  async getLeaderboard(): Promise<any[]> {
    return apiFetch<any[]>(API_ENDPOINTS.LEADERBOARD)
  }

  // Payment
  async createPayment(data: any): Promise<any> {
    return apiFetch<any>(API_ENDPOINTS.PAYMENT_CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

// Export singleton instance
export const publicApi = new PublicApiService()