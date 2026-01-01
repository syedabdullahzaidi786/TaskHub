"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Smartphone, Globe, Clock, Layers } from "lucide-react";

const features = [
    {
        title: "Instant Sync",
        description: "Your tasks are synced across all your devices in real-time. Never lose track of your progress.",
        icon: Zap,
        color: "bg-amber-100 text-amber-600",
    },
    {
        title: "Secure by Design",
        description: "We use industry-standard encryption to ensure your data stays private and secure.",
        icon: Shield,
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        title: "Mobile Ready",
        description: "A seamless experience on your phone, tablet, or desktop. Productive anywhere.",
        icon: Smartphone,
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        title: "Global Search",
        description: "Find any task, tag, or note instantly with our powerful global search engine.",
        icon: Globe,
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Time Tracking",
        description: "Monitor how much time you spend on each task and optimize your workflow.",
        icon: Clock,
        color: "bg-rose-100 text-rose-600",
    },
    {
        title: "Advanced Org",
        description: "Group tasks by projects, categories, or priority with ease and precision.",
        icon: Layers,
        color: "bg-violet-100 text-violet-600",
    },
];

const Features = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                    >
                        Everything you need to succeed
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Powerful tools designed to help you organize, prioritize, and get things done.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.05
                            }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -m-6" />

                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-sm transition-all duration-300`}>
                                <feature.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors tracking-tight">
                                {feature.title}
                            </h3>

                            <p className="text-slate-500 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
