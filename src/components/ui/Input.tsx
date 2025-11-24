import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${
          error
            ? "border-rose-500 focus:ring-2 focus:ring-rose-500"
            : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};
