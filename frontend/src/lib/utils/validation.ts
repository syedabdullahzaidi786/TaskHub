/**
 * Frontend validation utilities
 * Provides client-side validation for user input
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  if (email.length > 255) {
    return { isValid: false, error: "Email must be at most 255 characters" };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters" };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password must be at most 128 characters" };
  }

  return { isValid: true };
}

/**
 * Validate todo title
 */
export function validateTodoTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { isValid: false, error: "Title is required" };
  }

  if (title.length > 200) {
    return { isValid: false, error: "Title must be at most 200 characters" };
  }

  return { isValid: true };
}

/**
 * Validate todo description
 */
export function validateTodoDescription(description: string): ValidationResult {
  if (description && description.length > 2000) {
    return { isValid: false, error: "Description must be at most 2000 characters" };
  }

  return { isValid: true };
}
