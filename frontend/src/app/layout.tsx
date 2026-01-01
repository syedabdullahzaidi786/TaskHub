/**
 * Root layout
 * Wraps all pages with providers and global styles
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth/context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/utils/cn";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskHub - Achieve More, Effortlessly",
  description: "TaskHub is a premium full-stack todo application designed to help you organize your life and boost productivity with a sleek, 60fps glassmorphic interface.",
  keywords: ["todo app", "productivity", "task management", "PWA", "organize life", "efficiency", "TaskHub"],
  authors: [{ name: "Syed Abdullah Zaidi" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "TaskHub - Achieve More, Effortlessly",
    description: "The next era of productivity. Organize your tasks with TaskHub's beautiful, fast, and installable PWA interface.",
    url: "https://task-hub-xi.vercel.app/",
    siteName: "TaskHub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaskHub - Productivity Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskHub - Achieve More, Effortlessly",
    description: "Organize everything with TaskHub. A premium workspace for focus and fluidity.",
    images: ["/og-image.png"],
    creator: "@syedabdullahzaidi",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskHub",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
    shortcut: "/icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white text-slate-900 antialiased")}>
        <AuthProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault();
                  window.deferredPWAHomePrompt = e;
                  if (window.onPWAPromptReady) window.onPWAPromptReady(e);
                });
              `,
            }}
          />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
