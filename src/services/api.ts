import { getAuth, User } from "firebase/auth";

// Base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/**
 * Centralized authenticated fetch utility.
 * Automatically injects Firebase ID token in Authorization header.
 * Can optionally accept a User object; otherwise uses currentUser.
 */
export async function authenticatedFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  user?: User
): Promise<T> {
  // 1. Get Firebase user
  const authUser = user || getAuth().currentUser;
  if (!authUser) {
    throw new Error("User not authenticated. Please log in.");
  }

  // 2. Get ID token
  const idToken = await authUser.getIdToken();

  // 3. Prepare headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
    ...options.headers,
  };

  // 4. Construct full URL
  const url = endpoint.startsWith(API_BASE_URL)
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // 5. Perform fetch
  const response = await fetch(url, { ...options, headers });

  // 6. Handle errors
  if (!response.ok) {
    let errorMsg = `API call failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch (err) {
      // ignore parsing errors
    }

    if (response.status === 401 || response.status === 403) {
      errorMsg = "Authentication expired or invalid. Please log in again.";
    }

    throw new Error(errorMsg);
  }

  // 7. Return JSON response
  return response.json() as Promise<T>;
}

/**
 * Create a new request (POST /api/requests)
 */
export async function createRequest(
  moduleId: string,
  inputData: any,
  user?: User
): Promise<{ success: boolean; request_id: string }> {
  return authenticatedFetch<{ success: boolean; request_id: string }>(
    "/requests",
    {
      method: "POST",
      body: JSON.stringify({ module_id: moduleId, input_data: inputData }),
    },
    user
  );
}

/**
 * Fetch recent requests for the current user (GET /api/requests)
 */
export async function fetchRequests(user?: User): Promise<any[]> {
  return authenticatedFetch<any[]>("/requests", { method: "GET" }, user);
}

/**
 * Fetch a single request by ID (GET /api/requests/[requestId])
 */
export async function fetchRequestById(
  requestId: string,
  user?: User
): Promise<any> {
  return authenticatedFetch<any>(`/requests/${requestId}`, { method: "GET" }, user);
}
