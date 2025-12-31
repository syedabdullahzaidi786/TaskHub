import React from "react";
import Link from "next/link";
import { CheckSquare, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="bg-indigo-600 p-1 rounded-lg">
                                <CheckSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">TaskHub</span>
                        </Link>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            The ultimate task management solution for high-achievers. Stay organized,
                            stay focused, and reach your goals with ease.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-slate-900 font-bold mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Overview</Link></li>
                            <li><Link href="/todos" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Dashboard</Link></li>
                            <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Features</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-slate-900 font-bold mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">About Us</Link></li>
                            <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-slate-900 font-bold mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600 text-sm">support@taskhub.com</span>
                            </li>
                            <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Help Center</Link></li>
                            <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:row items-center justify-between">
                    <p className="text-slate-500 text-xs">
                        © {new Date().getFullYear()} TaskHub by Syed Abdullah Zaidi. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
