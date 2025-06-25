export interface ApiFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

// API Response interfaces
export interface LoginResponse {
  status: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    userName: string;
    plan: number;
    planStartDate: string;
    planEndDate?: string;
    adsEnabled: boolean;
    createdAt: string;
    lastLoginAt: string;
  };
  roles: string[];
}

export interface RegisterResponse {
  status: boolean;
  message: string;
}

export const apiFetch = async <T = unknown>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> => {
  const { requiresAuth = true, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
    Accept: "application/json",
  };

  // Set Content-Type for requests with a body (POST, PUT, etc.)
  if (fetchOptions.body && (!fetchOptions.method || fetchOptions.method.toUpperCase() === "POST" || fetchOptions.method.toUpperCase() === "PUT")) {
    headers["Content-Type"] = "application/json";
  }

  // Handle authorization
  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if no token
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error("No authentication token found. Please log in.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle 401/403 responses
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error("Authentication failed. Please log in again.");
  }

  if (response.status === 403) {
    if (typeof window !== 'undefined') {
      window.location.href = '/unauthorized';
    }
    throw new Error("Access denied. You don't have permission to perform this action.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.errors ? errorData.errors.join(", ") : JSON.stringify(errorData);
    } catch {
      errorMessage = errorText || "No additional information";
    }
    throw new Error(`API request failed: ${response.status} - ${errorMessage}`);
  }

  return (await response.json()) as T;
};