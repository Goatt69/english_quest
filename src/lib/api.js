export const apiFetch = async (endpoint, options = {}) => {
    const { requiresAuth = true, ...fetchOptions } = options;
    const headers = {
      ...fetchOptions.headers,
      Accept: "application/json",
    };
  
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
      let errorText;
      try {
        const errorData = await response.json();
        errorText = errorData.errors ? errorData.errors.join(", ") : JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
  
    return response.json();
  };