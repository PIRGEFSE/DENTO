import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-70';
    const variants = {
      primary: 'bg-white text-black hover:bg-gray-100',
      outline: 'border border-dm-border text-dm-muted hover:text-white',
      ghost: 'text-dm-muted hover:text-white',
      danger: 'border text-utalca-red hover:bg-red-900/20',
    };
    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-6 py-3',
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = 'Button';
export default Button;

