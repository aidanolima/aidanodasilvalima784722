import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 rounded-lg border bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            disabled:bg-slate-100 disabled:text-slate-500
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';