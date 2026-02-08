/**
 * Todo type definitions
 * Represents todo items
 */

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  due_date?: string;
  tags?: string[];
  is_recurring: boolean;
  recurrence_interval?: string;
  reminder_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  category?: string;
  due_date?: string;
  tags?: string[];
  is_recurring?: boolean;
  recurrence_interval?: string;
  reminder_at?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  category?: string;
  due_date?: string;
  tags?: string[];
  is_recurring?: boolean;
  recurrence_interval?: string;
  reminder_at?: string;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export const PriorityValues = {
  LOW: "LOW" as const,
  MEDIUM: "MEDIUM" as const,
  HIGH: "HIGH" as const,
};
