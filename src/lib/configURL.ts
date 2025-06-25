export const API_ENDPOINTS = {
    // Public endpoints
    SECTIONS: "/api/v1/quiz/sections",
    LEVELS: (sectionId: string) => `/api/v1/quiz/sections/${sectionId}/levels`,
    LOGIN: "/api/v1/authenticate/login",
    REGISTER: "/api/v1/authenticate/register",
    LOGOUT: "/api/v1/authenticate/logout",
    LEADERBOARD: "/api/v1/leaderboard",
    QUIZ_START: "/api/v1/quiz/start",
    QUIZ_ANSWER: "/api/v1/quiz/answer",
    QUIZ_ABANDON: (levelId: string) => `/api/v1/quiz/abandon/${levelId}`,
    PAYMENT_CREATE: "/api/v1/payment/create",
    PAYMENT_RETURN: "/api/v1/payment/vnpay-return",
    
    // Admin endpoints - require Admin role
    ADMIN_SECTIONS: "/api/v1/admin/quiz/sections",
    ADMIN_SECTION: (id: string) => `/api/v1/admin/quiz/sections/${id}`,
    ADMIN_LEVELS: "/api/v1/admin/quiz/levels",
    ADMIN_LEVEL: (id: string) => `/api/v1/admin/quiz/levels/${id}`,
    ADMIN_SECTION_LEVELS: (sectionId: string) => `/api/v1/admin/quiz/sections/${sectionId}/levels`,
    ADMIN_QUESTIONS: "/api/v1/admin/quiz/questions",
    ADMIN_QUESTION: (id: string) => `/api/v1/admin/quiz/questions/${id}`,
    ADMIN_LEVEL_QUESTIONS: (levelId: string) => `/api/v1/admin/quiz/levels/${levelId}/questions`,
};