"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CheckSquare, LayoutDashboard, LogIn, UserPlus, ChevronDown, User, LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/lib/auth/context";
import { signout } from "@/lib/api/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, clearUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    interface NavLink {
        name: string;
        href: string;
        icon?: React.ElementType;
        highlight?: boolean;
    }

    const navLinks: NavLink[] = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/todos", icon: LayoutDashboard },
    ];

    const authLinks: NavLink[] = user
        ? []
        : [
            { name: "Sign In", href: "/signin", icon: LogIn },
            { name: "Sign Up", href: "/signup", icon: UserPlus, highlight: true },
        ];

    const allLinks: NavLink[] = [...navLinks, ...authLinks];

    const handleSignoutClick = () => {
        setIsLogoutConfirmOpen(true);
    };

    const handleConfirmSignout = async () => {
        setIsLoggingOut(true);
        try {
            await signout();
            clearUser();
            toast.success("Signed out successfully");
            setIsLogoutConfirmOpen(false);
            router.push("/");
        } catch (error: any) {
            toast.error(error.userMessage || "Failed to sign out");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-white/70 backdrop-blur-md border-slate-200 py-3 shadow-sm"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                            <CheckSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                            TaskHub
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {allLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-indigo-600",
                                    pathname === link.href ? "text-indigo-600" : "text-slate-600",
                                    link.highlight &&
                                    "bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 hover:text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <div className="relative ml-4 pl-4 border-l border-slate-200">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all text-slate-700 font-semibold text-sm group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="max-w-[150px] truncate">{user.email}</span>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <>
                                            {/* Invisible backdrop to close dropdown */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsDropdownOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 origin-top-right"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Signed in as</p>
                                                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <Link
                                                        href="/todos"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4" />
                                                        <span>Dashboard</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            handleSignoutClick();
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-indigo-600 transition-colors p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col">
                            {allLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "px-3 py-3 rounded-md text-base font-medium transition-colors",
                                        pathname === link.href
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600",
                                        link.highlight &&
                                        "mt-2 bg-indigo-600 text-white text-center hover:bg-indigo-700 hover:text-white shadow-md"
                                    )}
                                >
                                    <div className="flex items-center">
                                        {link.icon && <link.icon className="w-4 h-4 mr-3" />}
                                        {link.name}
                                    </div>
                                </Link>
                            ))}

                            {user && (
                                <div className="mt-4 pt-4 border-t border-slate-100 px-3">
                                    <p className="text-xs text-slate-500 mb-2">{user.email}</p>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleSignoutClick();
                                        }}
                                        className="text-rose-600 font-semibold text-sm py-2"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={handleConfirmSignout}
                title="Sign Out"
                message="Are you sure you want to sign out of your account?"
                confirmLabel="Sign Out"
                cancelLabel="Stay Logged In"
                variant="warning"
                isLoading={isLoggingOut}
            />
        </nav>
    );
};

export default Navbar;
