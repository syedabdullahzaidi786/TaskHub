"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Flag, Tag } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Todo, Priority } from "@/lib/api/todos";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData?: Todo | null;
    isLoading?: boolean;
}

export default function TaskModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading = false,
}: TaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [category, setCategory] = useState("General");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || "");
            setPriority(initialData.priority || "MEDIUM");
            setCategory(initialData.category || "General");
            setDueDate(initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : "");
        } else {
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setCategory("General");
            setDueDate("");
        }
        setError("");
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            const saveData: any = {
                title,
                description: description.trim() || undefined,
                priority,
                category: category.trim() || "General",
            };

            if (dueDate) {
                try {
                    saveData.due_date = new Date(dueDate).toISOString();
                } catch (e) {
                    console.error("Invalid date:", dueDate);
                }
            } else {
                saveData.due_date = null;
            }

            await onSave(saveData);
            onClose();
        } catch (err: any) {
            setError(err.userMessage || "Failed to save task");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 overflow-y-auto"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {initialData ? "Edit Task" : "Add New Task"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                                <Input
                                    label="Task Title"
                                    placeholder="What needs to be done?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    error={error}
                                    required
                                />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        placeholder="Add some details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 min-h-[100px] resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
                                            <Flag className="w-3 h-3" /> Priority
                                        </label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as Priority)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> Category
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="General, Work, Personal..."
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Due Date (optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                                    />
                                </div>

                                <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 bg-white sticky bottom-0 z-10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="flex-1"
                                        isLoading={isLoading}
                                    >
                                        {initialData ? "Update Task" : "Create Task"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
