import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'red' | 'green' | 'blue' | 'default';
}

export default function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    red: 'text-utalca-red border-utalca-red/30 bg-utalca-red/10',
    green: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    default: 'text-gray-400 border-dm-border',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded border',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

