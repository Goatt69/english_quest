export const API_ENDPOINTS = {
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
  };