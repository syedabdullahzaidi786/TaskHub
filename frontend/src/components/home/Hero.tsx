"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const Hero = () => {
    return (
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 pb-16 bg-white">
            {/* 3D Dynamic Accent */}
            <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] opacity-40">
                <Scene3D />
            </div>

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
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.95]"
                        >
                            Organize <br />
                            <span className="text-indigo-600">Everything.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl text-slate-500 max-w-lg mb-12 leading-relaxed font-medium"
                        >
                            TaskHub is the workspace where focus meets fluidity.
                            Beautifully simple, powerfully integrated.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                        >
                            <Link href="/signup" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto px-12 py-5 text-lg font-bold shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all rounded-2xl">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/signin" className="w-full sm:w-auto">
                                <Button variant="ghost" size="lg" className="w-full sm:w-auto px-12 py-5 text-lg font-semibold text-slate-600 hover:bg-slate-50 transition-all rounded-2xl border border-slate-100">
                                    Demo Video
                                </Button>
                            </Link>
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
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] border border-slate-200 transition-all hover:scale-[1.01] duration-700 bg-white">
                            <Image
                                src="/dashboard.png"
                                alt="TaskHub Dashboard Mockup"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                                priority
                            />
                        </div>

                        {/* Floating UI Elements (Fake) */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -left-12 p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 hidden xl:block"
                        >
                            <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                            <div className="w-24 h-2 bg-slate-100 rounded-full" />
                            <div className="w-16 h-2 bg-slate-50 rounded-full mt-2" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-8 -right-8 p-6 bg-white rounded-2xl shadow-2xl border border-slate-100 hidden xl:block"
                        >
                            <Star className="w-8 h-8 text-amber-500 mb-2" />
                            <div className="w-20 h-2 bg-slate-100 rounded-full" />
                            <div className="w-12 h-2 bg-slate-50 rounded-full mt-2" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
