export const apiFetch = async (endpoint, options = {}) => {
  const { requiresAuth = true, ...fetchOptions } = options;

  // Initialize headers
  const headers = {
    ...fetchOptions.headers,
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

  // Make the fetch request
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle errors
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

  // Return JSON response
  return response.json();
};