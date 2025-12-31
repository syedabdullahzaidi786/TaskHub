import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseStyles =
      "w-full px-4 py-3 bg-white border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 text-slate-900 placeholder:text-slate-400";

    const normalStyles =
      "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20";

    const errorStyles =
      "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(baseStyles, error ? errorStyles : normalStyles, className)}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-rose-600 ml-1">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-500 ml-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
