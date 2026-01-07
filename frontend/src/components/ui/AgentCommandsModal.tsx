"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ListTodo, CheckCircle2, RefreshCw, Edit3, Trash2, Sparkles } from "lucide-react";

interface AgentCommandsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AgentCommandsModal({ isOpen, onClose }: AgentCommandsModalProps) {
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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto my-8"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 border-b border-indigo-100 flex flex-wrap justify-between items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-xl font-bold text-slate-900">TaskHub Agent Commands</h2>
                                        <p className="text-xs sm:text-sm text-slate-500">Ask the Agent to manage your tasks naturally</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/50 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Add Task */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Plus className="w-5 h-5 text-emerald-600" />
                                            <h3 className="font-bold text-slate-800">Add Task</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">Create new tasks with AI</p>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                                <code className="text-xs text-slate-700">"Add a task to buy groceries"</code>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                                <code className="text-xs text-slate-700">"Create task: Call dentist"</code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* List Tasks */}
                                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ListTodo className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-bold text-slate-800">List Tasks</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">View your tasks by status</p>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg border border-blue-100">
                                                <code className="text-xs text-slate-700">"Show all pending tasks"</code>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-blue-100">
                                                <code className="text-xs text-slate-700">"List completed tasks"</code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Complete Task */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            <h3 className="font-bold text-slate-800">Complete Task</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">Mark tasks as done</p>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                                <code className="text-xs text-slate-700">"Mark first task as complete"</code>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-emerald-100">
                                                <code className="text-xs text-slate-700">"Complete the groceries task"</code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Update Status */}
                                    <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <RefreshCw className="w-5 h-5 text-amber-600" />
                                            <h3 className="font-bold text-slate-800">Update Status</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">Toggle task completion</p>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg border border-amber-100">
                                                <code className="text-xs text-slate-700">"Mark task as pending"</code>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-amber-100">
                                                <code className="text-xs text-slate-700">"Set first task to complete"</code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Update Task */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Edit3 className="w-5 h-5 text-indigo-600" />
                                            <h3 className="font-bold text-slate-800">Edit Task</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">Modify task details</p>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg border border-indigo-100">
                                                <code className="text-xs text-slate-700">"Change task title to 'New Title'"</code>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-indigo-100">
                                                <code className="text-xs text-slate-700">"Update description of first task"</code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Task */}
                                    <div className="bg-gradient-to-br from-rose-50 to-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trash2 className="w-5 h-5 text-rose-600" />
                                            <h3 className="font-bold text-slate-800">Delete Task</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">Remove tasks permanently</p>
                                        <div className="space-y-2">
                                            <div className="bg-white p-2 rounded-lg border border-rose-100">
                                                <code className="text-xs text-slate-700">"Delete the groceries task"</code>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-rose-100">
                                                <code className="text-xs text-slate-700">"Remove first task"</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tip */}
                                <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                                    <p className="text-sm text-slate-700 text-center">
                                        💡 <span className="font-semibold">Tip:</span> Click the chat icon at the bottom right to start talking with the AI Agent
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
