"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Star, PlayCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import DashboardMockup from "./DashboardMockup";
import VideoModal from "@/components/ui/VideoModal";
import PWAInstallButton from "@/components/ui/PWAInstallButton";



const Hero = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    return (
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 pb-16 bg-white">


            {/* Subtle Background Gradients */}
            <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-[5]" />
            <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-gradient-to-tr from-blue-50/30 to-transparent -z-[5]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left flex flex-col items-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-8 backdrop-blur-sm"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">Next Era of Productivity</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.95]"
                        >
                            Organize <br />
                            <span className="text-indigo-600">Everything.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium"
                        >
                            TaskHub is the workspace where focus meets fluidity.
                            Beautifully simple, powerfully integrated.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                        >
                            <Link href="/signup" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto px-12 py-5 text-lg font-bold shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all rounded-2xl">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full sm:w-auto px-12 py-5 text-lg font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded-2xl border border-slate-100 flex items-center justify-center gap-2"
                                onClick={() => setIsVideoModalOpen(true)}
                            >
                                <PlayCircle className="w-5 h-5 text-indigo-600" />
                                Demo Video
                            </Button>
                            <PWAInstallButton />
                        </motion.div>

                        {/* Logo Cloud / Trust */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-16 pt-8 border-t border-slate-100 w-full"
                        >
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Trusted by innovators at</p>
                            <div className="flex flex-wrap gap-8 items-center grayscale opacity-70">
                                <div className="font-black text-lg text-slate-900 tracking-tighter italic">Linear</div>
                                <div className="font-bold text-lg text-slate-900 tracking-tight">Vercel</div>
                                <div className="font-bold text-lg text-slate-900">Notion</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image / Mockup Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative z-10 transition-all hover:scale-[1.01] duration-700">
                            <DashboardMockup />
                        </div>
                    </motion.div>
                </div>
            </div>
            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example placeholder
            />
        </section>
    );
};

export default Hero;
