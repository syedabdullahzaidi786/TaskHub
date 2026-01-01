"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Bot, Sparkles, Send, User } from "lucide-react";

const TaskHubAgentPreview = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-slate-50/50">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content Side */}
                    <div className="flex-1 text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Coming Soon</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight"
                        >
                            Meet <span className="text-indigo-600">TaskHub Agent</span> <br />
                            Your Autonomous AI Assistant
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 mb-8 leading-relaxed font-medium max-w-xl"
                        >
                            The future of productivity is here. TaskHub Agent can automatically create tasks,
                            manage your schedule, and coordinate your entire team through a simple chat interface.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <div className="flex items-center gap-4 text-slate-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium">Join 500+ testers in early access</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Chat UI Side */}
                    <div className="flex-1 w-full max-w-lg relative">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 border border-slate-100 overflow-hidden"
                        >
                            {/* Chat Header */}
                            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-none">TaskHub AI</h3>
                                        <span className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Active Now
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div className="p-6 space-y-6 h-[400px] flex flex-col justify-end bg-gradient-to-b from-white to-slate-50/50">
                                {/* Agent Message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="flex gap-3 items-end"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-bl-none max-w-[85%] text-sm font-medium leading-relaxed">
                                        Hello! I'm TaskHub Agent. How can I help you today?
                                    </div>
                                </motion.div>

                                {/* User Message */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                    className="flex gap-3 items-end justify-end"
                                >
                                    <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-br-none max-w-[85%] text-sm font-medium leading-relaxed shadow-lg shadow-indigo-100">
                                        Schedule a meeting with the dev team for tomorrow at 2 PM and create a task for "Final Review".
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-slate-500" />
                                    </div>
                                </motion.div>

                                {/* Agent Processing */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.2 }}
                                    className="flex gap-3 items-end"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-bl-none max-w-[85%] text-sm font-bold border border-indigo-200 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                                        Processing your request...
                                    </div>
                                </motion.div>
                            </div>

                            {/* Chat Input Fake */}
                            <div className="p-6 bg-white flex items-center gap-3">
                                <div className="flex-1 bg-slate-100 px-5 py-3 rounded-xl flex items-center justify-between">
                                    <span className="text-slate-400 text-sm font-medium font-mono">Under Development...</span>
                                    <Send className="w-4 h-4 text-slate-300" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating elements for extra premium feel */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">New feature</p>
                                <p className="text-sm font-bold text-slate-900">Conversational CRM</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TaskHubAgentPreview;
