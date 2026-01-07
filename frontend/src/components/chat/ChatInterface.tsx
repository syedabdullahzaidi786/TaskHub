"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User, CheckCircle2, Trash2, Edit3, Plus, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/cn";
import { useAuth } from "@/lib/auth/context";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    toolCalls?: ToolCall[];
    createdAt: Date;
}

interface ToolCall {
    tool: string;
    args: any;
    result: any;
}

export default function ChatInterface() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !user) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            createdAt: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const url = `/api/${user.id}/chat`;
            console.log("Requesting Chat URL:", url);
            // Verify base URL of apiClient
            console.log("API Base URL:", apiClient.defaults.baseURL);

            const response = await apiClient.post(url, {
                message: userMsg.content
            });

            const data = response.data;

            const assistantMsg: Message = {
                id: Date.now().toString() + "-ai",
                role: "assistant",
                content: data.response,
                toolCalls: data.tool_calls,
                createdAt: new Date()
            };

            setMessages(prev => [...prev, assistantMsg]);

            // If tool calls were made, maybe trigger a visual refresh of the main list?
            // Since the main list 'fetchTodos' might not run automatically unless we reload or it's polling.
            // Ideally we should context-based reload or just simple window reload for MVP if robust state not present.
            // But TodoPage has 'onFocus' reload.

            // Check if any mutative tools were called
            const hasMutation = data.tool_calls?.some((tc: any) =>
                ["add_task", "complete_task", "delete_task", "update_task"].includes(tc.tool)
            );

            if (hasMutation) {
                // Trigger a refresh if we could access the parent fetch function.
                // For now, let's just show a toast.
                // Or dispatch a custom event.
                window.dispatchEvent(new Event("focus")); // Hack to trigger the existng focus listener
            }

        } catch (error: any) {
            const errorMessage = error.userMessage || error.message || "Failed to get AI response";
            toast.error(errorMessage);
            console.error(error);

            // Optional: Add a system message to chat so user sees it persistently
            setMessages(prev => [...prev, {
                id: Date.now().toString() + "-error",
                role: "assistant",
                content: `⚠️ **Error:** ${errorMessage}`,
                createdAt: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getToolIcon = (name: string) => {
        switch (name) {
            case "add_task": return <Plus className="w-4 h-4 text-emerald-500" />;
            case "complete_task": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case "delete_task": return <Trash2 className="w-4 h-4 text-rose-500" />;
            case "update_task": return <Edit3 className="w-4 h-4 text-amber-500" />;
            default: return <Sparkles className="w-4 h-4 text-indigo-500" />;
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-96 h-[calc(100vh-6rem)] sm:h-[600px] max-h-[85vh] sm:max-h-[80vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-50 glass-effect"
                        style={{
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(99, 102, 241, 0.1)"
                        }}
                    >
                        {/* Header */}
                        <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-800">TaskHub Agent</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Autonomous AI Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200"
                        >
                            {messages.length === 0 && (
                                <div className="text-center mt-20 text-slate-400 px-6">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
                                    <p className="font-medium text-slate-500 mb-1">How can I help you today?</p>
                                    <p className="text-xs">Try "Add a task to buy milk" or "What tasks do I have pending?"</p>
                                </div>
                            )}

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                                        msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                                    )}>
                                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className={cn(
                                            "rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            msg.role === "user"
                                                ? "bg-slate-800 text-white rounded-tr-sm"
                                                : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                                        )}>
                                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:text-slate-800">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>

                                        {/* Tool Calls Visualization */}
                                        {msg.toolCalls && msg.toolCalls.length > 0 && (
                                            <div className="flex flex-col gap-1.5 mt-1">
                                                {msg.toolCalls.map((tc, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-500 bg-white border border-slate-100 rounded-lg px-2 py-1.5 shadow-sm w-fit">
                                                        {getToolIcon(tc.tool)}
                                                        <span className="font-mono font-medium">{tc.tool}</span>
                                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1 rounded ml-1">Success</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 mr-auto max-w-[80%]">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                        <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything..."
                                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-2xl shadow-indigo-400/50 flex items-center justify-center text-white z-50 group hover:ring-4 hover:ring-indigo-100 transition-all duration-300"
                >
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-1000" />
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
                </motion.button>
            )}
        </>
    );
}
