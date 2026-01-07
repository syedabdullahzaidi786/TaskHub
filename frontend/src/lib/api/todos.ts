/**
 * Todo API client
 * Functions for todo-related API calls
 */
import { apiClient } from "./client";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: Priority;
    category: string;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface TodoCreate {
    title: string;
    description?: string;
    completed?: boolean;
    priority?: Priority;
    category?: string;
    due_date?: string | null;
}

export interface TodoUpdate {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: Priority;
    category?: string;
    due_date?: string | null;
}

/**
 * List all todos for current user
 */
export async function listTodos(): Promise<Todo[]> {
    const response = await apiClient.get<Todo[]>("/todos");
    return response.data;
}

/**
 * Create a new todo
 */
export async function createTodo(data: TodoCreate): Promise<Todo> {
    const response = await apiClient.post<Todo>("/todos", data);
    return response.data;
}

/**
 * Get a specific todo
 */
export async function getTodo(id: string): Promise<Todo> {
    const response = await apiClient.get<Todo>(`/todos/${id}`);
    return response.data;
}

/**
 * Update a specific todo
 */
export async function updateTodo(id: string, data: TodoUpdate): Promise<Todo> {
    const response = await apiClient.patch<Todo>(`/todos/${id}`, data);
    return response.data;
}

/**
 * Delete a specific todo
 */
export async function deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`/todos/${id}`);
}
