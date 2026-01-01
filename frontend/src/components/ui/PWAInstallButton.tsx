"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Button from "./Button";
import { motion, AnimatePresence } from "framer-motion";

const PWAInstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Check session storage to see if user already dismissed it this session
        const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
        if (dismissed === "true") {
            setIsDismissed(true);
            return;
        }

        // 1. Check if the layout script already caught the prompt
        if ((window as any).deferredPWAHomePrompt) {
            setDeferredPrompt((window as any).deferredPWAHomePrompt);
            setIsVisible(true);
        }

        // 2. Define a callback for the layout script
        (window as any).onPWAPromptReady = (e: any) => {
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        const handler = (e: any) => {
            e.preventDefault();
            (window as any).deferredPWAHomePrompt = e;
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        window.addEventListener("appinstalled", () => {
            setIsVisible(false);
            setDeferredPrompt(null);
            (window as any).deferredPWAHomePrompt = null;
        });

        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsVisible(false);
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            (window as any).onPWAPromptReady = null;
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("pwa-prompt-dismissed", "true");
        setIsDismissed(true);
    };

    if (isDismissed || !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-end sm:items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="pointer-events-auto w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-indigo-100 border border-slate-100">
                                    <img src="/icon.png" alt="TaskHub" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Get TaskHub App</h3>
                                    <p className="text-xs text-slate-500 font-medium">Install for a faster, offline experience.</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                Add TaskHub to your home screen for quick access and a premium native-app feel.
                            </p>

                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleInstallClick}
                                    className="w-full py-4 text-base font-bold rounded-2xl shadow-indigo-100"
                                >
                                    Download Now
                                </Button>
                                <button
                                    onClick={handleDismiss}
                                    className="w-full py-3 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    No Thanks
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PWAInstallButton;
