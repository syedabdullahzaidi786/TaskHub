/**
 * Todo API client
 */
import { apiClient } from "./client";
import { Todo, TodoCreate, TodoUpdate, Priority, PriorityValues } from "../../types/todo";

export type { Todo, TodoCreate, TodoUpdate, Priority };
export { PriorityValues };

export interface TodoFilters {
    priority?: Priority;
    search?: string;
    sort_by?: "due_date" | "priority" | "created_at";
    order?: "asc" | "desc";
}

/**
 * List all todos for current user
 */
export async function listTodos(filters?: TodoFilters): Promise<Todo[]> {
    const params = new URLSearchParams();
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sort_by) params.append("sort_by", filters.sort_by);
    if (filters?.order) params.append("order", filters.order);

    const response = await apiClient.get<Todo[]>(`/todos?${params.toString()}`);
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
