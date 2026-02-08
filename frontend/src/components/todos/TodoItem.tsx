"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Trash2, Edit3, Clock, Tag, AlertCircle, Calendar, Repeat } from "lucide-react";
import { Todo } from "@/lib/api/todos";
import { cn } from "@/utils/cn";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (todo: Todo) => void;
}

export default function TodoItem({
    todo,
    onToggle,
    onDelete,
    onEdit,
}: TodoItemProps) {
    const priorityColors: Record<string, string> = {
        HIGH: "bg-rose-100 text-rose-700 border-rose-200",
        MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
        LOW: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={cn(
                "group relative bg-white p-5 rounded-2xl border transition-all duration-300",
                todo.completed
                    ? "border-emerald-100 bg-emerald-50/10 shadow-sm"
                    : "border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5"
            )}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                {/* Custom Checkbox */}
                <button
                    onClick={() => onToggle(todo.id, !todo.completed)}
                    className={cn(
                        "mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                        todo.completed
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-slate-300 hover:border-indigo-500 bg-white"
                    )}
                >
                    {todo.completed && <Check className="w-4 h-4" />}
                </button>

                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col gap-1">
                            <h3
                                className={cn(
                                    "font-bold text-lg transition-all duration-200",
                                    todo.completed ? "text-slate-400 line-through" : "text-slate-900"
                                )}
                            >
                                {todo.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                                    priorityColors[todo.priority || "MEDIUM"]
                                )}>
                                    <AlertCircle className="w-3 h-3" />
                                    {todo.priority || "MEDIUM"}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {todo.category}
                                </span>
                                {todo.is_recurring && (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Repeat className="w-3 h-3" />
                                        {todo.recurrence_interval}
                                    </span>
                                )}
                                {todo.tags && todo.tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                                {todo.due_date && (
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1",
                                        new Date(todo.due_date) < new Date() && !todo.completed ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-600 border-slate-100"
                                    )}>
                                        <Calendar className="w-3 h-3" />
                                        {new Date(todo.due_date).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(todo)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit task"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(todo.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Delete task"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {todo.description && (
                        <p className={cn(
                            "mt-2 text-sm leading-relaxed",
                            todo.completed ? "text-slate-300" : "text-slate-500"
                        )}>
                            {todo.description}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <Clock className="w-3 h-3 mr-1" />
                            Created: {new Date(todo.created_at).toLocaleDateString()}
                        </div>
                        {todo.completed && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                Completed
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
