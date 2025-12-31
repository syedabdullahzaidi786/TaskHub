/**
 * Signin page
 * User login page
 */
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import SigninForm from "@/components/auth/SigninForm";

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Sign in to TaskHub
          </h2>
          <p className="mt-3 text-slate-500">
            Welcome back! Please enter your details.
          </p>
        </div>

        <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <SigninForm />

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
