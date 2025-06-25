export interface User {
    id: string;
    userName: string;
    email: string
    plan: string | number
    planStartDate: string;
    planEndDate?: string;
    adsEnabled: boolean;
    createdAt: string;
    lastLoginAt: string;
    roles?: string[];
}

export interface UserWithRoles extends User {
    roles: string[];
}

// Plan utility functions
export const getPlanName = (plan: string | number): string => {
    const planValue = typeof plan === 'string' ? parseInt(plan) : plan;
    switch (planValue) {
        case 0: return "Free";
        case 1: return "Support";
        case 2: return "Premium";
        default: return "Free";
    }
};

export const isPlanFree = (plan: string | number): boolean => {
    const planValue = typeof plan === 'string' ? parseInt(plan) : plan;
    return planValue === 0;
};