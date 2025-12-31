"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    isLoading = false,
}: ConfirmModalProps) {
    const variantStyles = {
        danger: "text-rose-600 bg-rose-50",
        warning: "text-amber-600 bg-amber-50",
        info: "text-indigo-600 bg-indigo-50",
    };

    const buttonVariants = {
        danger: "rose", // Custom variant mapping if exists, but we'll use primary for now with custom bg if needed
        warning: "primary",
        info: "primary",
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
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-slate-950/20 overflow-hidden pointer-events-auto"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-center mb-6">
                                    <div className={`p-4 rounded-2xl ${variantStyles[variant]}`}>
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                </div>

                                <div className="text-center mb-10">
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                                        {title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed px-4">
                                        {message}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-2xl border-slate-200"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        {cancelLabel}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className={`flex-1 h-12 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${variant === "danger" ? "bg-rose-500 hover:bg-rose-600 border-rose-500 shadow-rose-200" : ""
                                            }`}
                                        onClick={onConfirm}
                                        isLoading={isLoading}
                                    >
                                        {confirmLabel}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
