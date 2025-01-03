const API_BASE = "http://localhost:5204/providers";

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // For handling cookies if needed
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}