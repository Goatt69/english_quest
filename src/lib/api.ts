export interface ApiFetchOptions extends RequestInit {
  requiresAuth?: boolean;
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
      throw new Error("No authentication token found. Please log in.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

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