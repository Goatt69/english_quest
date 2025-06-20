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
    // Chỉ thêm header Authorization nếu token tồn tại và không phải undefined/null
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

  return response.json(); // Xóa console.log không cần thiết nếu có
};