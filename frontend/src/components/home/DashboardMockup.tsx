"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Circle,
    Clock,
    Plus,
    Search,
    Settings,
    LayoutDashboard,
    Calendar,
    Layers,
    Star
} from "lucide-react";

const DashboardMockup = () => {
    return (
        <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col">
            {/* Top Bar */}
            <div className="h-12 border-b border-white/5 bg-slate-800/50 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <div className="flex items-center text-slate-400 text-[10px] font-medium tracking-tight">
                        <LayoutDashboard className="w-3 h-3 mr-1.5" />
                        Workspace / Dashboard
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                        A
                    </div>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar */}
                <div className="w-48 border-r border-white/5 bg-slate-800/30 p-4 space-y-6 hidden sm:block shrink-0">
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Menu</div>
                        <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 text-xs font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Today</span>
                            <span className="ml-auto bg-indigo-600/20 px-1.5 rounded text-[9px]">4</span>
                        </div>
                        <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-400 text-xs font-medium hover:bg-white/5 transition-colors">
                            <Star className="w-3.5 h-3.5" />
                            <span>Priority</span>
                        </div>
                        <div className="flex items-center space-x-2 px-2 py-1.5 rounded-lg text-slate-400 text-xs font-medium hover:bg-white/5 transition-colors">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Projects</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Filters</div>
                        <div className="flex items-center space-x-2 px-2 py-1.5 text-slate-500 text-xs font-medium">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Completed</span>
                        </div>
                        <div className="flex items-center space-x-2 px-2 py-1.5 text-slate-500 text-xs font-medium">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Pending</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Today's Focus</h2>
                            <p className="text-slate-500 text-xs font-medium mt-0.5">Jan 01, 2026 — 4 items</p>
                        </div>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { id: 1, title: "Refactor API structure", dur: "2h", status: "complete", priority: "high" },
                            { id: 2, title: "New landing page design", dur: "5h", status: "pending", priority: "medium" },
                            { id: 3, title: "Team sync & updates", dur: "1h", status: "pending", priority: "low" },
                            { id: 4, title: "Database migration", dur: "3h", status: "pending", priority: "high" },
                        ].map((task, i) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i + 0.5 }}
                                className="group flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
                            >
                                {task.status === "complete" ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold truncate ${task.status === "complete" ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                        {task.title}
                                    </div>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            <Clock className="w-2.5 h-2.5 mr-1" />
                                            {task.dur}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                                task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between shrink-0">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((u) => (
                                <div key={u} className={`w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[8px] font-bold text-white`}>
                                    {String.fromCharCode(64 + u)}
                                </div>
                            ))}
                            <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-bold text-white">
                                +2
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 font-medium text-[10px]">
                            <Settings className="w-3 h-3" />
                            <span>Project Settings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardMockup;
