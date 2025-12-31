/**
 * Authentication API client
 * Functions for auth-related API calls
 */
import { apiClient } from "./client";
import { User } from "@/types/user";

export interface SignupData {
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

/**
 * Create new user account
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/signup", data);
  return response.data;
}

/**
 * Sign in with email and password
 */
export async function signin(data: SigninData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/signin", data);
  return response.data;
}

/**
 * Sign out current user
 */
export async function signout(): Promise<void> {
  await apiClient.post("/auth/signout");
}

/**
 * Get current user session
 * Returns null if not authenticated
 */
export async function getSession(): Promise<User | null> {
  try {
    const response = await apiClient.get<User>("/auth/session");
    return response.data;
  } catch (error: any) {
    // Return null if not authenticated (401)
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}
