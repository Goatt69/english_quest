import { apiFetch } from './api'
import { API_ENDPOINTS } from './configURL'

export class AdminApiService {
  private checkAdminAccess() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          if (!user.roles?.includes('Admin')) {
            throw new Error('Admin access required')
          }
        } catch (error) {
          throw new Error('Invalid user data')
        }
      } else {
        throw new Error('User not authenticated')
      }
    }
  }

  // Sections
  async getSections() {
    this.checkAdminAccess()
    return apiFetch<any[]>(API_ENDPOINTS.ADMIN_SECTIONS)
  }

  async getSection(id: string) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_SECTION(id))
  }

  async createSection(data: any) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_SECTIONS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateSection(id: string, data: any) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_SECTION(id), {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteSection(id: string) {
    this.checkAdminAccess()
    return apiFetch<void>(API_ENDPOINTS.ADMIN_SECTION(id), {
      method: "DELETE",
    })
  }

  // Levels
  async getLevels(sectionId?: string) {
    this.checkAdminAccess()
    const endpoint = sectionId 
      ? API_ENDPOINTS.ADMIN_SECTION_LEVELS(sectionId)
      : API_ENDPOINTS.ADMIN_LEVELS
    return apiFetch<any[]>(endpoint)
  }

  async getLevel(id: string) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_LEVEL(id))
  }

  async createLevel(data: any) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_LEVELS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateLevel(id: string, data: any) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_LEVEL(id), {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteLevel(id: string) {
    this.checkAdminAccess()
    return apiFetch<void>(API_ENDPOINTS.ADMIN_LEVEL(id), {
      method: "DELETE",
    })
  }

  // Questions
  async getQuestions(levelId?: string) {
    this.checkAdminAccess()
    const endpoint = levelId 
      ? API_ENDPOINTS.ADMIN_LEVEL_QUESTIONS(levelId)
      : API_ENDPOINTS.ADMIN_QUESTIONS
    return apiFetch<any[]>(endpoint)
  }

  async getQuestion(id: string) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_QUESTION(id))
  }

  async createQuestion(data: any) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_QUESTIONS, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateQuestion(id: string, data: any) {
    this.checkAdminAccess()
    return apiFetch<any>(API_ENDPOINTS.ADMIN_QUESTION(id), {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteQuestion(id: string) {
    this.checkAdminAccess()
    return apiFetch<void>(API_ENDPOINTS.ADMIN_QUESTION(id), {
      method: "DELETE",
    })
  }
}

// Export singleton instance
export const adminApi = new AdminApiService()