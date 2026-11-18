import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold tracking-widest uppercase text-gray-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg text-white placeholder-gray-600 text-sm',
            'focus:outline-none focus:ring-1 focus:ring-red-700 transition-all',
            className
          )}
          style={{ background: '#1e1e1e', border: `1px solid ${error ? '#C41E3A' : '#2a2a2a'}` }}
          {...props}
        />
        {hint && <p className="text-xs text-gray-600">{hint}</p>}
        {error && <p className="text-xs" style={{ color: '#C41E3A' }}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;

